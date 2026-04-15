-- ============================================================
-- YSDMS-NEXT | Migration: Add BOM and Order Shots Info
-- Rationale: Tầng 4 needs these dimensions to auto-deduct Plastic Inventory
-- ============================================================

ALTER TABLE public.mold_plastic_bom ADD COLUMN IF NOT EXISTS measured_weight_grams NUMERIC;
COMMENT ON COLUMN public.mold_plastic_bom.measured_weight_grams IS 'Trọng lượng thực cân được (g) — override actual_weight_grams nếu có';

ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS shots_count INTEGER;
COMMENT ON COLUMN public.order_items.shots_count IS '回転数 — số lần bấm máy (= quantity / cavity)';
