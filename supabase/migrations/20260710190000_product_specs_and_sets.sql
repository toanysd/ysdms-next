-- Migration: Add product specifications & set support columns
-- Date: 2026-07-10
-- Purpose: Support product SET (A/B), stacking specs, customer product specs, material links

-- ============================================================
-- 1. Products table: Product SET support
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_set_type TEXT;
COMMENT ON COLUMN products.product_set_type IS 'SET = khuôn dập đồng thời nhiều SP (VD: A/B), NULL = SP đơn';

ALTER TABLE products ADD COLUMN IF NOT EXISTS set_component_names JSONB;
COMMENT ON COLUMN products.set_component_names IS 'Tên từng thành phần trong set. VD: {"A": "TR-S24-A", "B": "TR-S24-B"}';

-- ============================================================
-- 2. Products table: Stacking specifications
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS stacking_type TEXT;
COMMENT ON COLUMN products.stacking_type IS 'Loại xếp chồng: SAME_DIRECTION (同方向) | REVERSE_180 (180°反転) | NESTED (入れ子)';

ALTER TABLE products ADD COLUMN IF NOT EXISTS stacking_layers INTEGER;
COMMENT ON COLUMN products.stacking_layers IS 'Số tầng xếp chồng tiêu chuẩn';

ALTER TABLE products ADD COLUMN IF NOT EXISTS stacking_height_mm NUMERIC;
COMMENT ON COLUMN products.stacking_height_mm IS 'Chiều cao xếp chồng đầy đủ (mm)';

-- ============================================================
-- 3. Products table: External dimensions
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS external_length_mm NUMERIC;
COMMENT ON COLUMN products.external_length_mm IS 'Kích thước ngoài khay - chiều dài (mm)';

ALTER TABLE products ADD COLUMN IF NOT EXISTS external_width_mm NUMERIC;
COMMENT ON COLUMN products.external_width_mm IS 'Kích thước ngoài khay - chiều rộng (mm)';

-- ============================================================
-- 4. Products table: Material link
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_plastic_code TEXT;
COMMENT ON COLUMN products.primary_plastic_code IS 'Mã nhựa chính (VD: 640)';

ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_plastic_spec TEXT;
COMMENT ON COLUMN products.primary_plastic_spec IS 'Thông số nhựa chính (VD: PS黒1.0mm 導電練り込み)';

-- ============================================================
-- 5. Products table: Customer product specs (flexible JSONB)
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS customer_product_specs JSONB;
COMMENT ON COLUMN products.customer_product_specs IS 'Thông số SP khách hàng (linh hoạt). VD: {"size":"31×26mm","weight":"40.7g"}';

-- ============================================================
-- 6. Design_revisions table: Alternate material
-- ============================================================
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS alt_plastic_type TEXT;
COMMENT ON COLUMN design_revisions.alt_plastic_type IS 'Loại nhựa thay thế (VD: PS透明1.0mm 帯電防止付シリコン付【440】)';

ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS alt_plastic_code TEXT;
COMMENT ON COLUMN design_revisions.alt_plastic_code IS 'Mã nhựa thay thế (VD: 440)';
