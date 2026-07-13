-- Migration: 20260713_sd03_extend_production_orders.sql
-- Mở rộng production_orders thay vì tạo production_instructions

ALTER TABLE production_orders
  -- Phương pháp cắt (yêu cầu nghiệp vụ mới từ SD-03)
  ADD COLUMN IF NOT EXISTS cut_method TEXT NULL,
  -- Ghi chú chỉ thị sản xuất chi tiết
  ADD COLUMN IF NOT EXISTS instruction_notes TEXT NULL,
  -- Trạng thái chỉ thị (nếu chưa có)
  ADD COLUMN IF NOT EXISTS instruction_status TEXT NULL DEFAULT 'draft';

COMMENT ON COLUMN production_orders.cut_method IS 'SD-03: Phương pháp cắt — e.g. straight_cut, contour_cut';
COMMENT ON COLUMN production_orders.instruction_notes IS 'SD-03: Ghi chú chỉ thị sản xuất chi tiết';
