-- ============================================================
-- YSDMS-NEXT | Migration 060: Update Plastic to Meters
-- ============================================================

-- 1. Alter plastic_master
ALTER TABLE public.plastic_master ADD COLUMN IF NOT EXISTS width_mm NUMERIC;

-- 2. Alter inventory_txn
ALTER TABLE public.inventory_txn ADD COLUMN IF NOT EXISTS qty_meters NUMERIC DEFAULT 0;

-- 3. Alter production_plans
ALTER TABLE public.production_plans ADD COLUMN IF NOT EXISTS material_feed_length_mm NUMERIC;

-- 4. Alter production_log
ALTER TABLE public.production_log ADD COLUMN IF NOT EXISTS roll_barcode TEXT;
ALTER TABLE public.production_log ADD COLUMN IF NOT EXISTS meters_consumed NUMERIC;
ALTER TABLE public.production_log ADD COLUMN IF NOT EXISTS meters_remaining NUMERIC;
ALTER TABLE public.production_log ADD COLUMN IF NOT EXISTS meters_wasted NUMERIC;

-- 5. Recreate plastic_stock view
CREATE OR REPLACE VIEW public.plastic_stock AS
SELECT 
    pm.id AS id,
    pm.id AS plastic_id,
    COALESCE(SUM(CASE WHEN t.txn_type = 'IN' THEN t.qty_meters WHEN t.txn_type = 'OUT' THEN -t.qty_meters ELSE 0 END), 0) AS current_meters,
    pm.reorder_point_kg AS min_threshold_kg,
    MAX(t.txn_time) AS last_updated
FROM public.plastic_master pm
LEFT JOIN public.inventory_txn t ON t.plastic_id = pm.id
GROUP BY pm.id, pm.reorder_point_kg;

-- Keep grants
GRANT SELECT ON public.plastic_stock TO authenticated;
GRANT SELECT ON public.plastic_stock TO service_role;
