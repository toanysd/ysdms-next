-- Migration: Thêm design_revision_id vào order_lines
-- Mục đích: Cho phép chỉ định cụ thể phiên bản thiết kế (revision) cho từng dòng đơn hàng.
-- Mặc định NULL = hệ thống tự lấy revision mới nhất từ product_id.
-- Khi cần chỉ định cụ thể (mẫu thử, chuyển đổi giữa 2 version nhựa khác nhau) → chọn revision.

ALTER TABLE order_lines 
  ADD COLUMN IF NOT EXISTS design_revision_id UUID 
  REFERENCES design_revisions(revision_id) ON DELETE SET NULL;

COMMENT ON COLUMN order_lines.design_revision_id IS 
  'Phiên bản thiết kế cụ thể cho dòng đơn hàng. NULL = tự động lấy revision mới nhất. Chỉ định khi có nhiều revision cùng active (VD: nhựa khác nhau).';
