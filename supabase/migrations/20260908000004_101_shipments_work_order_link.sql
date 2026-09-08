-- Migration 101: Shipments Work Order Link (ADR-012 / Chỉ thị #037)
-- Cho phép liên kết đợt xuất hàng (shipments) trực tiếp với lệnh sản xuất (work_orders)

ALTER TABLE public.shipments 
  ADD COLUMN IF NOT EXISTS work_order_id UUID 
  REFERENCES public.work_orders(wo_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS shipped_quantity NUMERIC DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_shipments_work_order_id 
  ON public.shipments(work_order_id);

COMMENT ON COLUMN public.shipments.work_order_id IS 'Khóa ngoại liên kết trực tiếp với Lệnh sản xuất (work_orders) cho luồng xuất hàng WO-direct';
COMMENT ON COLUMN public.shipments.shipped_quantity IS 'Số lượng sản phẩm thực tế xuất giao trong đợt này';

