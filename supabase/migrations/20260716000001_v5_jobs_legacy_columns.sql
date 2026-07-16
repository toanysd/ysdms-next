-- ============================================================================
-- Migration: V5 Restore Jobs Legacy Columns & Add BP-32 Specific Columns
-- ============================================================================

-- 1. Thêm các cột bị thiếu vào bảng jobs (từ Jobs.csv)
ALTER TABLE jobs 
  ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS release_type TEXT,
  ADD COLUMN IF NOT EXISTS separate_cutter BOOLEAN,
  ADD COLUMN IF NOT EXISTS inventory_check_on_repro BOOLEAN,
  ADD COLUMN IF NOT EXISTS drawing_check_on_repro BOOLEAN,
  ADD COLUMN IF NOT EXISTS qty_sent_to_office INTEGER,
  ADD COLUMN IF NOT EXISTS price_quote_required BOOLEAN,
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC;

-- 2. Thêm các cột liên quan đến đóng gói vào production_instructions (thuộc BP-32)
ALTER TABLE production_instructions
  ADD COLUMN IF NOT EXISTS packaging_type TEXT, -- LoaiThungDong (1: ?, 2: ?)
  ADD COLUMN IF NOT EXISTS wrap_in_plastic_bag BOOLEAN; -- BaoNilon (1: 要, 2: 不要)


