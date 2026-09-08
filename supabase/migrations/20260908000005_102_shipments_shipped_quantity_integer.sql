
-- Migration 102: Change shipped_quantity to INTEGER (Chỉ thị #039)
ALTER TABLE public.shipments 
  ALTER COLUMN shipped_quantity TYPE INTEGER 
  USING shipped_quantity::INTEGER;

COMMENT ON COLUMN public.shipments.shipped_quantity IS 'Số lượng sản phẩm thực tế xuất giao trong đợt này (INTEGER)';
  