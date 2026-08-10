-- ============================================================
-- YSDMS-NEXT | Migration: Optimize Inventory Txn Index
-- Priority: High (Performance Before WMS Launch)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_inventory_txn_plastic_id
ON public.inventory_txn (plastic_id);
