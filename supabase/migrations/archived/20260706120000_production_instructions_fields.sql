-- ==============================================================================
-- YSDMS NextGen - Add columns supporting Production Instructions and tolerances
-- ==============================================================================

BEGIN;

-- Thêm các trường dung sai và kiểm tra cải tiến vào design_revisions
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS tolerance_x TEXT DEFAULT '±0.5';
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS tolerance_y TEXT DEFAULT '±0.5';
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS tolerance_pitch TEXT DEFAULT '±0.3';
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS discard_old_stock_on_remake BOOLEAN DEFAULT false;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS replace_qc_drawing_on_remake BOOLEAN DEFAULT false;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS water_cooling_plate_spec TEXT DEFAULT 'EXISTING'; -- NEW, EXISTING
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS frame_spec TEXT DEFAULT 'EXISTING'; -- NEW, EXISTING

-- Thêm quy cách đóng gói mẫu vào sample_submissions
ALTER TABLE sample_submissions ADD COLUMN IF NOT EXISTS box_type TEXT DEFAULT 'PLAIN'; -- PLAIN, PRINTED
ALTER TABLE sample_submissions ADD COLUMN IF NOT EXISTS bagging_required BOOLEAN DEFAULT true;
ALTER TABLE sample_submissions ADD COLUMN IF NOT EXISTS packaging_instructions TEXT; -- Lưu ví dụ: "10枚と5枚は袋分けして同梱納入してください"

COMMIT;
