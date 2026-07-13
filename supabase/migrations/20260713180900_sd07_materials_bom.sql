-- ============================================================
-- SD-07: Extend Materials & BOM for Production Module
-- File: 20260713_sd07_materials_bom.sql
-- ============================================================

-- 1. Mở rộng material_inventory: thêm Reserved, Min Alert
ALTER TABLE material_inventory
  ADD COLUMN IF NOT EXISTS quantity_reserved NUMERIC(10,3) NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_stock_alert   NUMERIC(10,3) NULL,
  ADD COLUMN IF NOT EXISTS kanban_status     TEXT NULL DEFAULT 'ok'
    CHECK (kanban_status IN ('ok', 'low', 'waiting_supply', 'request_purchase'));

COMMENT ON COLUMN material_inventory.quantity_reserved
  IS 'SD-07: Tồn đã giữ chỗ cho Lệnh SX đang chạy (Reserved Qty)';
COMMENT ON COLUMN material_inventory.min_stock_alert
  IS 'SD-07: Ngưỡng cảnh báo tối thiểu — nếu (current - reserved) < min → cảnh báo';
COMMENT ON COLUMN material_inventory.kanban_status
  IS 'SD-07: ok | low | waiting_supply (ZN.材料待ち) | request_purchase (ZR.材料Request)';

-- 2. Mở rộng mold_material_bom: thêm consumption_per_shot rõ ràng hơn
--    (đổi tên conceptual: quantity_per_shot đã có, thêm unit và ppwr_reportable)
ALTER TABLE mold_material_bom
  ADD COLUMN IF NOT EXISTS unit             TEXT NULL DEFAULT 'kg',
  ADD COLUMN IF NOT EXISTS ppwr_reportable  BOOLEAN DEFAULT false;

COMMENT ON COLUMN mold_material_bom.ppwr_reportable
  IS 'SD-07: true = vật tư đóng gói cần báo cáo PPWR (EU Packaging Regulation)';

-- 3. Bảng mới: material_consumption_logs
--    Ghi nhận tiêu hao thực tế khi máy chạy (trừ lùi từ inventory)
CREATE TABLE IF NOT EXISTS material_consumption_logs (
  log_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_lot_id TEXT NOT NULL
    REFERENCES production_lots(lot_id) ON DELETE CASCADE,
  material_id      TEXT NOT NULL
    REFERENCES materials(material_id),
  consumed_qty     NUMERIC(10,3) NOT NULL,
  unit             TEXT NOT NULL DEFAULT 'kg',
  consumed_at      TIMESTAMPTZ DEFAULT now(),
  machine_id       TEXT NULL
    REFERENCES machines(machine_id),
  recorded_by      TEXT NULL
    REFERENCES employees(employee_id),
  is_packaging     BOOLEAN DEFAULT false,
  notes            TEXT NULL
);

COMMENT ON TABLE material_consumption_logs
  IS 'SD-07: Log tiêu hao vật tư theo lô SX — nguồn dữ liệu cho PPWR & Kanban';
COMMENT ON COLUMN material_consumption_logs.is_packaging
  IS 'SD-07: true = vật tư đóng gói → dùng filter này để xuất báo cáo PPWR';

-- 4. Liên kết production_orders → BOM reference
--    (bổ sung FK vào bảng đã được REVISE ở SD-03)
ALTER TABLE production_orders
  ADD COLUMN IF NOT EXISTS bom_mold_master_id TEXT NULL;

COMMENT ON COLUMN production_orders.bom_mold_master_id
  IS 'SD-07: Tham chiếu đến mold_material_bom.mold_master_id để auto-pull định mức vật tư';
