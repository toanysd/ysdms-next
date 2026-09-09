-- Migration 104-A: backfill_wo_product_id_exact_match
-- Description: Backfill product_id for work_orders where TRIM(wo_name) exactly and uniquely matches products.product_code
-- Ref: Chỉ thị #047

UPDATE public.work_orders wo
SET product_id = p.product_id
FROM public.products p
WHERE wo.product_id IS NULL
  AND TRIM(wo.wo_name) = p.product_code
  AND (
    SELECT COUNT(*) FROM public.products p2
    WHERE p2.product_code = p.product_code
  ) = 1;
