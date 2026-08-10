-- ============================================================
-- Migration: 20260714154000_sd03_rev5_production_orders_print_sheet.sql
-- Tác giả: AN (AI Assistant) & Thoan
-- Mô tả: Bổ sung các cột phục vụ bản in 指示書作成シート(成形） cho production_orders
-- Ghi chú: Dữ liệu vật liệu (nhựa) KHÔNG lưu ở đây mà lấy từ plastic_master thông qua design_revisions.
-- ============================================================

ALTER TABLE public.production_orders
  ADD COLUMN IF NOT EXISTS lot_no TEXT,
  ADD COLUMN IF NOT EXISTS delivery_date DATE,
  ADD COLUMN IF NOT EXISTS packaging_style TEXT,
  ADD COLUMN IF NOT EXISTS tolerance_short TEXT DEFAULT '±1.0',
  ADD COLUMN IF NOT EXISTS tolerance_long TEXT DEFAULT '±1.0',
  ADD COLUMN IF NOT EXISTS delivery_destination TEXT,
  ADD COLUMN IF NOT EXISTS requester_code TEXT;

-- Ghi chú:
-- cut_length và cut_width không cần thêm vào đây vì đã có cutline_length và cutline_width trong bảng design_revisions.
-- Nếu muốn cho phép ghi đè (override) khi in, có thể mở khóa 2 dòng dưới đây trong tương lai:
-- ADD COLUMN IF NOT EXISTS cut_length NUMERIC,
-- ADD COLUMN IF NOT EXISTS cut_width NUMERIC;
