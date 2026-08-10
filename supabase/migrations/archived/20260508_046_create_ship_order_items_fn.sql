CREATE OR REPLACE FUNCTION public.ship_order_items(
  p_order_id UUID,
  p_items    JSONB,
  p_notes    TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item          JSONB;
  v_current_stock BIGINT;
  v_product_id    UUID;
  v_qty           INTEGER;
  v_order_item_id UUID;
  v_lot_no        TEXT;
  v_operator      TEXT;
  v_total_items   INTEGER := 0;
BEGIN

  IF NOT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = p_order_id
    AND status NOT IN ('shipped', 'cancelled')
  ) THEN
    RETURN jsonb_build_object(
      'success',    false,
      'error_code', 'ORDER_NOT_SHIPPABLE',
      'message',    'Đơn hàng không tồn tại hoặc đã được giao/huỷ.'
    );
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP

    v_product_id    := (v_item->>'product_id')::UUID;
    v_qty           := (v_item->>'quantity')::INTEGER;
    v_order_item_id := (v_item->>'order_item_id')::UUID;
    v_lot_no        := v_item->>'lot_no';
    v_operator      := v_item->>'operator_name';

    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'INVALID_QTY:%', v_product_id;
    END IF;

    -- ── LOCK ROW (Atomic) ──
    -- Lock product row thay vì lock aggregated rows (PostgreSQL cấm FOR UPDATE với SUM)
    PERFORM 1 FROM public.product_master WHERE id = v_product_id FOR UPDATE;

    -- ── TÍNH TỒN KHO THỰC TẾ ──
    SELECT COALESCE(SUM(
      CASE
        WHEN txn_type = 'IN'     THEN quantity
        WHEN txn_type = 'OUT'    THEN -quantity
        WHEN txn_type = 'ADJUST' THEN quantity
        ELSE 0
      END
    ), 0)
    INTO v_current_stock
    FROM public.tray_inventory_txn
    WHERE product_id = v_product_id;

    IF v_current_stock < v_qty THEN
      RAISE EXCEPTION 'INSUFFICIENT_STOCK:%:%:%',
        v_product_id, v_qty, v_current_stock;
    END IF;

    INSERT INTO public.tray_inventory_txn (
      id, txn_type, product_id, order_item_id,
      production_log_id, quantity, lot_no,
      txn_date, operator_name, notes, created_at
    ) VALUES (
      gen_random_uuid(), 'OUT', v_product_id, v_order_item_id,
      NULL, v_qty, v_lot_no,
      CURRENT_DATE, v_operator,
      COALESCE(p_notes, '出荷処理 / Xuất kho theo đơn hàng'),
      NOW()
    );

    v_total_items := v_total_items + 1;
  END LOOP;

  UPDATE public.orders
  SET status = 'shipped', updated_at = NOW()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'success',      true,
    'items_shipped', v_total_items,
    'order_id',     p_order_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success',    false,
      'error_code', SPLIT_PART(SQLERRM, ':', 1),
      'message',    SQLERRM
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.ship_order_items(UUID, JSONB, TEXT)
  TO anon, authenticated;
