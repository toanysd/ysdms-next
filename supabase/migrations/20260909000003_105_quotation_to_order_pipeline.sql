-- Migration 105: Quotation-to-Order Pipeline & Prerequisite Schema (Directive #051)
-- Sprint A: Bổ sung trường liên kết Báo giá <-> Đơn hàng, giá thỏa thuận, và trường màng nhựa tiền đề cho M23-B

BEGIN;

-- 1. Cập nhật bảng quotations
ALTER TABLE public.quotations
  ADD COLUMN IF NOT EXISTS converted_order_id UUID REFERENCES public.orders(order_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_quotations_converted_order_id 
  ON public.quotations(converted_order_id);

-- 2. Cập nhật bảng quotation_lines (bổ sung liên kết sản phẩm & bản vẽ CAD)
ALTER TABLE public.quotation_lines
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(product_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS design_revision_id UUID REFERENCES public.design_revisions(revision_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_quotation_lines_product_id 
  ON public.quotation_lines(product_id);
CREATE INDEX IF NOT EXISTS idx_quotation_lines_design_revision_id 
  ON public.quotation_lines(design_revision_id);

-- 3. Cập nhật bảng orders (bổ sung liên kết ngược về báo giá)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS converted_from_quotation_id UUID REFERENCES public.quotations(quotation_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_converted_from_quotation_id 
  ON public.orders(converted_from_quotation_id);

-- 4. Cập nhật bảng order_lines (bảo lưu đơn giá, thành tiền, bản vẽ CAD và dòng báo giá nguồn)
ALTER TABLE public.order_lines
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS design_revision_id UUID REFERENCES public.design_revisions(revision_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS quotation_line_id UUID REFERENCES public.quotation_lines(line_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_order_lines_design_revision_id 
  ON public.order_lines(design_revision_id);
CREATE INDEX IF NOT EXISTS idx_order_lines_quotation_line_id 
  ON public.order_lines(quotation_line_id);

-- 5. Cập nhật bảng products (Prerequisite fields cho M23-B / M26 theo chỉ đạo PE)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS feed_length_mm NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS film_width_mm NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS thickness_mm NUMERIC(10,3);

COMMENT ON COLUMN public.products.feed_length_mm IS 'Bước tiến màng nhựa khi dập định hình (mm) - phục vụ tính toán tiêu hao màng cuộn';
COMMENT ON COLUMN public.products.film_width_mm IS 'Khổ cuộn màng nhựa yêu cầu (mm)';
COMMENT ON COLUMN public.products.thickness_mm IS 'Độ dày màng nhựa định hình (mm) - tách từ legacy_specs';

-- 6. RPC Atomic Transaction: fn_convert_quotation_to_order
CREATE OR REPLACE FUNCTION public.fn_convert_quotation_to_order(
  p_quotation_id UUID,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote RECORD;
  v_order_id UUID;
  v_order_no TEXT;
  v_company_code TEXT;
  v_date_str TEXT;
  v_seq INTEGER;
  v_line RECORD;
  v_line_count INTEGER := 0;
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

  -- 2. Sinh mã đơn hàng chuẩn YSD: ORD-YYYYMMDD-CUSTOMER_CODE
  v_date_str := to_char(CURRENT_DATE, 'YYYYMMDD');
  v_company_code := COALESCE(NULLIF(TRIM(v_quote.company_code), ''), 'CUST');
  v_order_no := 'ORD-' || v_date_str || '-' || v_company_code;

  -- Đảm bảo duy nhất nếu trong ngày đã có đơn của khách hàng này
  SELECT COUNT(*) + 1 INTO v_seq
  FROM public.orders
  WHERE order_no LIKE v_order_no || '%';

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

  -- 4. Sao chép các dòng chi tiết từ quotation_lines sang order_lines
  FOR v_line IN
    SELECT ql.*, p.product_id AS matched_product_id
    FROM public.quotation_lines ql
    LEFT JOIN public.products p ON (
      ql.product_id IS NOT NULL AND p.product_id = ql.product_id
    ) OR (
      ql.product_id IS NULL AND ql.model_code IS NOT NULL AND TRIM(ql.model_code) = p.product_code
    )
    WHERE ql.quotation_id = p_quotation_id
    ORDER BY ql.line_no ASC
  LOOP
    v_line_count := v_line_count + 1;

    -- Nếu dòng báo giá chưa gắn product_id, tìm sản phẩm đại diện của công ty
    IF v_line.matched_product_id IS NULL THEN
      SELECT product_id INTO v_line.matched_product_id
      FROM public.products
      WHERE company_id = v_quote.company_id
      LIMIT 1;
    END IF;

    -- Nếu vẫn không có, tìm sản phẩm bất kỳ để đáp ứng ràng buộc NOT NULL của order_lines
    IF v_line.matched_product_id IS NULL THEN
      SELECT product_id INTO v_line.matched_product_id
      FROM public.products
      LIMIT 1;
    END IF;

    IF v_line.matched_product_id IS NULL THEN
      RAISE EXCEPTION 'Không tìm thấy sản phẩm hợp lệ trong hệ thống để tạo dòng đơn hàng';
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
      v_line.matched_product_id,
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
$$;

GRANT EXECUTE ON FUNCTION public.fn_convert_quotation_to_order(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_convert_quotation_to_order(UUID, UUID) TO service_role;

COMMIT;
