-- Migration 104-B: create v_product_stock_summary
-- Ref: Chỉ thị #047

CREATE OR REPLACE VIEW public.v_product_stock_summary AS
WITH produced AS (
  SELECT
    wo.product_id,
    COALESCE(SUM(wl.quantity_done), 0)::integer AS total_produced
  FROM public.work_logs wl
  JOIN public.jobs j       ON wl.job_id = j.job_id
  JOIN public.work_orders wo ON j.work_order_id = wo.wo_id
  WHERE wo.product_id IS NOT NULL
    AND wl.quantity_done IS NOT NULL   -- chỉ lấy log Thermoforming có qty
  GROUP BY wo.product_id
),
shipped AS (
  SELECT
    wo.product_id,
    COALESCE(SUM(s.shipped_quantity), 0)::integer AS total_shipped
  FROM public.shipments s
  JOIN public.work_orders wo ON s.work_order_id = wo.wo_id
  WHERE s.status IN ('SHIPPED', 'DELIVERED')
    AND wo.product_id IS NOT NULL
  GROUP BY wo.product_id
)
SELECT
  p.product_id,
  p.product_code,
  p.product_name,
  p.product_name_internal,
  p.company_id,
  c.company_name,
  c.company_code,
  COALESCE(pr.total_produced, 0)                                             AS total_produced,
  COALESCE(sh.total_shipped,  0)                                             AS total_shipped,
  GREATEST(0, COALESCE(pr.total_produced, 0) - COALESCE(sh.total_shipped, 0)) AS current_stock,
  500::integer                                                                AS low_stock_threshold,
  CASE
    WHEN GREATEST(0, COALESCE(pr.total_produced,0) - COALESCE(sh.total_shipped,0)) = 0
      THEN 'OUT_OF_STOCK'
    WHEN GREATEST(0, COALESCE(pr.total_produced,0) - COALESCE(sh.total_shipped,0)) <= 500
      THEN 'LOW_STOCK'
    ELSE 'IN_STOCK'
  END AS stock_status
FROM public.products p
LEFT JOIN public.companies c  ON p.company_id  = c.company_id
LEFT JOIN produced pr         ON p.product_id  = pr.product_id
LEFT JOIN shipped  sh         ON p.product_id  = sh.product_id
WHERE p.product_status = 'ACTIVE';

COMMENT ON VIEW public.v_product_stock_summary IS
  'SSOT tồn kho thành phẩm: produced từ work_logs (qty_done), shipped từ shipments. Migration 104-B.';
