-- ============================================================
-- MIGRATION 025: PRODUCTION PLANS
-- Bảng quản lý Lệnh Sản Xuất cho Tầng Planning
-- Phụ thuộc vào 024 (machine_instance)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.production_plans (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id       uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  machine_instance_id uuid NOT NULL REFERENCES public.machine_instance(id),
  mold_physical_id    uuid NOT NULL REFERENCES public.mold_physical(id),
  
  planned_date        date NOT NULL,
  operator_name       text,
  shift               varchar(10) CHECK (shift IN ('DAY', 'NIGHT')),
  priority            integer DEFAULT 5,

  planned_quantity    integer NOT NULL,
  estimated_shots     integer,
  estimated_hours     numeric(5, 2),
  shipment_dates      text,
  
  status              text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED')),
  
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_prod_plans_order_item ON public.production_plans(order_item_id);
CREATE INDEX IF NOT EXISTS idx_prod_plans_machine    ON public.production_plans(machine_instance_id);
CREATE INDEX IF NOT EXISTS idx_prod_plans_date       ON public.production_plans(planned_date);


-- ============================================================
-- REPORTING / UI VIEW: Tiến độ cấp phát Kế hoạch theo Đơn Hàng
-- ============================================================
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
LEFT JOIN public.production_plans pp ON pp.order_item_id = oi.id
GROUP BY oi.id, oi.quantity;
