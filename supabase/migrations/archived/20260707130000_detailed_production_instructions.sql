-- ==============================================================================
-- YSDMS NextGen - Add target deadlines, mold quantities and digital stamps
-- ==============================================================================

BEGIN;

-- Thêm thông số chế tạo khuôn và số lòng khuôn vào production_orders
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS mold_sets_to_make INTEGER DEFAULT 1; -- 起工数
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS cavities_per_mold INTEGER; -- 取数

-- Thêm kỳ hạn yêu cầu tĩnh (Target Deadlines của Văn phòng) vào production_orders
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS req_aluminum_date DATE; -- Hạn nhôm yêu cầu
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS req_plug_date DATE; -- Hạn plug yêu cầu
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS req_cutter_date DATE; -- Hạn dao yêu cầu
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS req_mold_date DATE; -- Hạn khuôn yêu cầu (本型納期)
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS req_molding_date DATE; -- Hạn ép mẫu/xuất khay yêu cầu (出荷納期)

-- Thêm chữ ký số hóa (Stamps) của các bộ phận vào production_orders
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS approved_by_procurement UUID REFERENCES employees(employee_id); -- Yoshida
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS approved_by_mold_shop UUID REFERENCES employees(employee_id);   -- Endo
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS approved_by_molding_shop UUID REFERENCES employees(employee_id);-- Kohirumaki
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS approved_by_qc UUID REFERENCES employees(employee_id);          -- Nakamura
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS approved_by_manager UUID REFERENCES employees(employee_id);     -- Kobayashi

COMMIT;
