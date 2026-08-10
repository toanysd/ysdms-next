-- ============================================================
-- MIGRATION 026: EXTEND PRODUCTION PLANS
-- Bổ sung Soft Delete, Ghi chú, và Cập nhật View
-- ============================================================

-- 1. Bổ sung các trường mới phục vụ Ghi chú và Soft Delete
ALTER TABLE public.production_plans 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- 2. Cập nhật View để Tự Động KHẤU TRỪ các Kế hoạch đã Xoá Mềm
CREATE OR REPLACE VIEW public.v_production_plan_progress AS
SELECT 
  oi.id AS order_item_id,
  oi.quantity AS total_requested_qty,
  COALESCE(SUM(pp.planned_quantity), 0) AS total_planned_qty,
  CASE 
    WHEN oi.quantity > 0 THEN 
      ROUND((COALESCE(SUM(pp.planned_quantity), 0)::numeric / oi.quantity) * 100, 2)
    ELSE 0 
  END AS plan_coverage_pct,
  COALESCE(SUM(CASE WHEN pp.status = 'COMPLETED' THEN pp.planned_quantity ELSE 0 END), 0) AS completed_qty
FROM public.order_items oi
LEFT JOIN public.production_plans pp ON pp.order_item_id = oi.id AND pp.deleted_at IS NULL
GROUP BY oi.id, oi.quantity;
