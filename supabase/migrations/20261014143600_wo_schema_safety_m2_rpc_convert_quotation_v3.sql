-- ============================================================================
-- WO-SCHEMA-SAFETY-FIX — Migration 2: Update public.fn_convert_quotation_to_order
-- Approved by PE [2026-10-14 14:38 JST] (Payload v3)
-- Preserves core business logic; replaces the 2 LIMIT 1 fallbacks with Method A1
-- (using scalar variable v_matched_product_id UUID) and adds advisory lock on order_no.
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.fn_convert_quotation_to_order(p_quotation_id uuid, p_user_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_quote RECORD;
  v_order_id UUID;
  v_order_no TEXT;
  v_company_code TEXT;
  v_date_str TEXT;
  v_seq INTEGER;
  v_line RECORD;
  v_line_count INTEGER := 0;
  v_matched_product_id UUID;
  v_match_count INTEGER := 0;
BEGIN
  -- 1. Khóa và kiểm tra báo giá
  SELECT q.*, c.company_code
  INTO v_quote
  FROM public.quotations q
  JOIN public.companies c ON c.company_id = q.company_id
  WHERE q.quotation_id = p_quotation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Báo giá không tồn tại (quotation_id: %)', p_quotation_id;
  END IF;

  IF v_quote.status = 'CONVERTED' THEN
    RAISE EXCEPTION 'Báo giá này đã được chuyển đổi thành đơn hàng (Order ID: %)', v_quote.converted_order_id;
  END IF;

  IF v_quote.status != 'APPROVED' THEN
    RAISE EXCEPTION 'Chỉ báo giá ở trạng thái APPROVED mới được chuyển thành đơn hàng (Trạng thái hiện tại: %)', v_quote.status;
  END IF;

  -- 2. Sinh mã đơn hàng chuẩn YSD: ORD-YYYYMMDD-CUSTOMER_CODE (kèm advisory lock chống race condition)
  v_date_str := to_char(CURRENT_DATE, 'YYYYMMDD');
  v_company_code := COALESCE(NULLIF(TRIM(v_quote.company_code), ''), 'CUST');
  v_order_no := 'ORD-' || v_date_str || '-' || v_company_code;

  PERFORM pg_advisory_xact_lock(hashtext('fn_convert_quotation_to_order:' || v_order_no));

  SELECT COUNT(*) + 1 INTO v_seq
  FROM public.orders
  WHERE order_no LIKE v_order_no || '%';

  WHILE EXISTS (
    SELECT 1 FROM public.orders
    WHERE order_no = CASE WHEN v_seq > 1 THEN v_order_no || '-' || v_seq ELSE v_order_no END
  ) LOOP
    v_seq := v_seq + 1;
  END LOOP;

  IF v_seq > 1 THEN
    v_order_no := v_order_no || '-' || v_seq;
  END IF;

  -- 3. Tạo đơn hàng mới trong bảng orders
  INSERT INTO public.orders (
    order_no,
    company_id,
    order_date,
    requested_delivery,
    order_status,
    order_type,
    notes,
    converted_from_quotation_id
  ) VALUES (
    v_order_no,
    v_quote.company_id,
    CURRENT_DATE,
    v_quote.valid_until,
    'CONFIRMED',
    COALESCE(v_quote.quotation_type, 'PRODUCT'),
    'Chuyển đổi từ Báo giá: ' || v_quote.quotation_no || COALESCE(' - ' || v_quote.notes, ''),
    v_quote.quotation_id
  )
  RETURNING order_id INTO v_order_id;

  -- 4. Sao chép các dòng chi tiết từ quotation_lines sang order_lines (Phương án A1 dùng biến scalar v_matched_product_id)
  FOR v_line IN
    SELECT ql.*
    FROM public.quotation_lines ql
    WHERE ql.quotation_id = p_quotation_id
    ORDER BY ql.line_no ASC
  LOOP
    v_line_count := v_line_count + 1;
    v_matched_product_id := NULL;
    v_match_count := 0;

    IF v_line.product_id IS NOT NULL THEN
      SELECT COUNT(*)::integer, (ARRAY_AGG(p.product_id))[1]
      INTO v_match_count, v_matched_product_id
      FROM public.products p
      WHERE p.product_id = v_line.product_id
        AND p.company_id = v_quote.company_id;

      IF v_match_count != 1 OR v_matched_product_id IS NULL THEN
        RAISE EXCEPTION 'Dòng báo giá số % (loại: %): product_id (%) không tồn tại hoặc không thuộc khách hàng của báo giá',
          COALESCE(v_line.line_no, v_line_count), COALESCE(v_line.item_type, 'UNKNOWN'), v_line.product_id;
      END IF;
    ELSIF v_line.model_code IS NOT NULL AND TRIM(v_line.model_code) <> '' THEN
      SELECT COUNT(*)::integer, (ARRAY_AGG(p.product_id))[1]
      INTO v_match_count, v_matched_product_id
      FROM public.products p
      WHERE TRIM(p.product_code) = TRIM(v_line.model_code)
        AND p.company_id = v_quote.company_id;

      IF v_match_count != 1 OR v_matched_product_id IS NULL THEN
        RAISE EXCEPTION 'Dòng báo giá số % (loại: %): model_code (%) khớp % sản phẩm theo product_code của khách hàng (yêu cầu đúng 1 dòng)',
          COALESCE(v_line.line_no, v_line_count), COALESCE(v_line.item_type, 'UNKNOWN'), TRIM(v_line.model_code), v_match_count;
      END IF;
    ELSE
      RAISE EXCEPTION 'Dòng báo giá số % (loại: %) thiếu cả product_id và model_code hợp lệ trước khi chuyển đổi sang đơn hàng',
        COALESCE(v_line.line_no, v_line_count), COALESCE(v_line.item_type, 'UNKNOWN');
    END IF;

    INSERT INTO public.order_lines (
      order_id,
      line_no,
      product_id,
      design_revision_id,
      quantity,
      unit,
      unit_price,
      total_amount,
      line_status,
      quotation_line_id,
      notes
    ) VALUES (
      v_order_id,
      COALESCE(v_line.line_no, v_line_count),
      v_matched_product_id,
      v_line.design_revision_id,
      GREATEST(1, COALESCE(v_line.quantity::integer, 1)),
      'PCS',
      v_line.unit_price,
      COALESCE(v_line.amount, (COALESCE(v_line.quantity, 1) * COALESCE(v_line.unit_price, 0))),
      'CONFIRMED',
      v_line.line_id,
      v_line.notes
    );
  END LOOP;

  IF v_line_count = 0 THEN
    RAISE EXCEPTION 'Báo giá % không có dòng chi tiết nào để tạo đơn hàng', v_quote.quotation_no;
  END IF;

  -- 5. Cập nhật trạng thái báo giá thành CONVERTED và ghi nhận liên kết
  UPDATE public.quotations
  SET status = 'CONVERTED',
      converted_order_id = v_order_id,
      converted_at = NOW(),
      updated_at = NOW()
  WHERE quotation_id = p_quotation_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_no', v_order_no,
    'lines_converted', v_line_count
  );
END;
$function$;

COMMIT;
