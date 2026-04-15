-- ============================================================
-- YSDMS-NEXT | Migration: Create Atomic RPC for Orders
-- Priority: P1 (Critical for Production Transaction Safety)
-- ============================================================

CREATE OR REPLACE FUNCTION create_order_with_items(
  p_header jsonb,
  p_items  jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER -- Đảm bảo chạy với quyền chủ schema
AS $$
DECLARE 
  v_order_id uuid;
  item_arr jsonb;
BEGIN
  -- 1. Insert header
  INSERT INTO orders 
  SELECT * FROM jsonb_populate_record(null::orders, p_header)
  RETURNING id INTO v_order_id;

  -- 2. Add order_id into each item object
  SELECT jsonb_agg(i || jsonb_build_object('order_id', v_order_id))
  INTO item_arr
  FROM jsonb_array_elements(p_items) i;

  -- 3. Insert all items
  IF item_arr IS NOT NULL THEN
    INSERT INTO order_items 
    SELECT * FROM jsonb_populate_recordset(null::order_items, item_arr);
  END IF;

  RETURN v_order_id;
END;
$$;
