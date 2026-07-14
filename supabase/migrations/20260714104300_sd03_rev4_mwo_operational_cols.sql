-- ============================================================
-- Migration: 20260714104300_sd03_rev4_mwo_operational_cols.sql
-- SD-03 Rev 4: Add missing operational columns to mold_work_orders
-- Rationale: Rev 2 schema was incomplete — missing machine, cutter,
--   mold_sets, cavities, req_aluminum_date, and employee-based stamps.
--   Code in mold-orders/page.tsx requires all these columns.
-- PO Approved: Thoan — 2026-07-14
-- ============================================================

-- BƯỚC 1: Thêm cột thiết bị và thông số sản xuất
ALTER TABLE mold_work_orders
  ADD COLUMN IF NOT EXISTS machine_id          UUID REFERENCES machines(machine_id)   ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cutter_id           UUID REFERENCES cutters(cutter_id)     ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS mold_sets_to_make   SMALLINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS cavities_per_mold   SMALLINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS req_aluminum_date   DATE;

-- BƯỚC 2: Thêm cột stamps theo employee (Phương án A — UUID FK)
-- Thay thế cho approved_procurement/approved_mold_shop/approved_molding_shop (BOOLEAN)
-- Giữ lại các cột BOOLEAN cũ tạm thời để không phá code khác, sẽ drop ở Rev 5
ALTER TABLE mold_work_orders
  ADD COLUMN IF NOT EXISTS approved_by_procurement  UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_by_mold_shop    UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_by_molding_shop UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_by_qc           UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_by_manager      UUID REFERENCES employees(employee_id) ON DELETE SET NULL;

-- BƯỚC 3: Đổi physical_mold_id thành NULLABLE
-- Lý do: form tạo mới cho phép chọn khuôn sau khi tạo chỉ thị
ALTER TABLE mold_work_orders
  ALTER COLUMN physical_mold_id DROP NOT NULL;

-- BƯỚC 4: Indexes cho các FK mới
CREATE INDEX IF NOT EXISTS idx_mwo_machine  ON mold_work_orders(machine_id);
CREATE INDEX IF NOT EXISTS idx_mwo_cutter   ON mold_work_orders(cutter_id);

-- BƯỚC 5: Comments
COMMENT ON COLUMN mold_work_orders.mold_sets_to_make   IS 'Số bộ khuôn cần làm trong chỉ thị này (起工数)';
COMMENT ON COLUMN mold_work_orders.cavities_per_mold   IS 'Số lòng khuôn mỗi bộ (取数/キャビティ数)';
COMMENT ON COLUMN mold_work_orders.req_aluminum_date   IS 'Hạn giao phôi nhôm (アルミ材手配納期)';
COMMENT ON COLUMN mold_work_orders.approved_by_procurement  IS 'UUID employee đã ký duyệt phần Tổng vụ (手配担当)';
COMMENT ON COLUMN mold_work_orders.approved_by_mold_shop    IS 'UUID employee đã ký duyệt phần Xưởng khuôn (金型担当)';
COMMENT ON COLUMN mold_work_orders.approved_by_molding_shop IS 'UUID employee đã ký duyệt phần Xưởng định hình (成形担当)';
COMMENT ON COLUMN mold_work_orders.approved_by_qc           IS 'UUID employee đã ký duyệt phần Kiểm tra (検査担当)';
COMMENT ON COLUMN mold_work_orders.approved_by_manager      IS 'UUID employee đã ký xác nhận quản lý (管理確認)';
COMMENT ON COLUMN mold_work_orders.physical_mold_id         IS 'NULLABLE từ Rev4: Khuôn vật lý có thể chọn sau khi tạo chỉ thị.';
