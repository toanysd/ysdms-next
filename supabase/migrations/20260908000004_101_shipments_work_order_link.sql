-- Migration 101: Shipments Work Order Link (ADR-012 / Chỉ thị #037)
-- Cho phép liên kết đợt xuất hàng (shipments) trực tiếp với lệnh sản xuất (work_orders)

ALTER TABLE public.shipments 
  ADD COLUMN IF NOT EXISTS work_order_id UUID 
  REFERENCES public.work_orders(wo_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_shipments_work_order_id 
  ON public.shipments(work_order_id);

COMMENT ON COLUMN public.shipments.work_order_id IS 'Khóa ngoại liên kết trực tiếp với Lệnh sản xuất (work_orders) cho luồng xuất hàng WO-direct';
