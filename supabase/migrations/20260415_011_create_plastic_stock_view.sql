-- ============================================================
-- YSDMS-NEXT | Migration 011: Create plastic_stock view
-- Rationale: Tự động tổng hợp lượng tồn kho nhựa từ inventory_txn
-- ============================================================

CREATE OR REPLACE VIEW public.plastic_stock AS
SELECT 
    pm.id AS id,
    pm.id AS plastic_id,
    COALESCE(SUM(CASE WHEN t.txn_type = 'IN' THEN t.qty_kg WHEN t.txn_type = 'OUT' THEN -t.qty_kg ELSE 0 END), 0) AS current_kg,
    pm.reorder_point_kg AS min_threshold_kg,
    MAX(t.txn_time) AS last_updated
FROM public.plastic_master pm
LEFT JOIN public.inventory_txn t ON t.plastic_id = pm.id
GROUP BY pm.id, pm.reorder_point_kg;

-- Grant permissions for authenticated and service roles
GRANT SELECT ON public.plastic_stock TO authenticated;
GRANT SELECT ON public.plastic_stock TO service_role;
