-- ============================================================
-- BP-42: Material Inventory Schema (Stock tracking)
-- ============================================================

-- Bảng sổ gốc tồn kho vật liệu
CREATE TABLE IF NOT EXISTS material_stock (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_spec text NOT NULL,          -- "PS(N)0.58t×640×350m"
  factory_site  text NOT NULL,          -- '本社' | '青森' | '茨城' | '坂田'
  is_silicon    boolean DEFAULT false,
  is_antistatic boolean DEFAULT false,
  supplier_name text,
  current_stock_m  numeric(10,1) DEFAULT 0,  -- mét còn lại
  reserved_m       numeric(10,1) DEFAULT 0,  -- giữ chỗ cho PI đã phát hành
  snapshot_date date,                    -- ngày chụp từ Excel
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE(material_spec, factory_site, is_silicon, is_antistatic)
);

-- Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION update_material_stock_modtime()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_material_stock_updated_at ON material_stock;
CREATE TRIGGER trg_material_stock_updated_at
BEFORE UPDATE ON material_stock
FOR EACH ROW
EXECUTE FUNCTION update_material_stock_modtime();

-- View tổng hợp cho checkMaterialStock
CREATE OR REPLACE VIEW material_inventory_v2 AS
SELECT
  material_spec, 
  factory_site,
  is_silicon, 
  is_antistatic,
  current_stock_m,
  reserved_m,
  (current_stock_m - reserved_m) AS available_m
FROM material_stock
WHERE current_stock_m > 0;
