-- ============================================================
-- YSDMS-NEXT | Migration 010: RPC auto_deduct_plastic_on_production
-- Rationale: Tự động trừ kho nhựa khi Order → in_production
-- Công thức: qty_kg = measured_weight_grams * (1 + scrap_ratio) * shots_count / 1000
-- ============================================================

CREATE OR REPLACE FUNCTION public.auto_deduct_plastic_on_production(
  p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status           TEXT;
  v_already_deducted BOOLEAN;
  v_item             RECORD;
  v_qty_kg           NUMERIC;
  v_deducted_rows    INT := 0;
BEGIN
  -- 1. Kiểm tra order tồn tại và đang ở in_production
  SELECT status::TEXT INTO v_status
  FROM public.orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % không tồn tại', p_order_id;
  END IF;

  IF v_status <> 'in_production' THEN
    RAISE EXCEPTION 'Order % chưa ở trạng thái in_production (hiện: %)', p_order_id, v_status;
  END IF;

  -- 2. Idempotent guard — kiểm tra đã deduct chưa (dựa vào ref_vocher)
  SELECT EXISTS (
    SELECT 1 FROM public.inventory_txn
    WHERE ref_vocher = 'ORDER:' || p_order_id::TEXT
      AND txn_type = 'OUT'
  ) INTO v_already_deducted;

  IF v_already_deducted THEN
    RETURN jsonb_build_object(
      'status',   'skipped',
      'reason',   'already_deducted',
      'order_id', p_order_id
    );
  END IF;

  -- 3. Loop: order_items → mold_design_revision → BOM → tính qty_kg → INSERT OUT
  FOR v_item IN
    SELECT
      oi.id            AS order_item_id,
      oi.shots_count,
      bom.plastic_id,
      COALESCE(bom.measured_weight_grams, bom.actual_weight_grams) AS weight_grams,
      COALESCE(bom.scrap_ratio, 0)                                  AS scrap_ratio
    FROM public.order_items oi
    JOIN public.mold_base mb ON mb.id = oi.mold_id
    JOIN public.mold_design_revision mdr
      ON mdr.mold_id = mb.id
     AND mdr.is_current = TRUE
    JOIN public.mold_plastic_bom bom ON bom.revision_id = mdr.id
    WHERE oi.order_id = p_order_id
      AND oi.shots_count IS NOT NULL
      AND oi.shots_count > 0
      AND COALESCE(bom.measured_weight_grams, bom.actual_weight_grams) IS NOT NULL
  LOOP
    v_qty_kg := ROUND(
      v_item.weight_grams * (1 + v_item.scrap_ratio) * v_item.shots_count / 1000.0,
      4
    );

    INSERT INTO public.inventory_txn (
      id,
      txn_time,
      txn_type,
      plastic_id,
      qty_kg,
      ref_vocher,
      remark
    ) VALUES (
      gen_random_uuid(),
      NOW(),
      'OUT',
      v_item.plastic_id,
      v_qty_kg,
      'ORDER:' || p_order_id::TEXT,
      'Auto-deduct khi Order → in_production (order_item: ' || v_item.order_item_id || ')'
    );

    v_deducted_rows := v_deducted_rows + 1;
  END LOOP;

  -- 4. Trả về kết quả
  RETURN jsonb_build_object(
    'status',        'ok',
    'order_id',      p_order_id,
    'rows_inserted', v_deducted_rows
  );
END;
$$;

COMMENT ON FUNCTION public.auto_deduct_plastic_on_production(UUID) IS
  'RPC Tầng 4 — Trừ kho nhựa khi Order → in_production. Idempotent: gọi nhiều lần an toàn. Trả về JSONB {status, order_id, rows_inserted}.';
