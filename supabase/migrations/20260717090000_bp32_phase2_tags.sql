-- Migration to support Phase 2 of Production Instruction (BP-32)
-- Adds fields to production_instructions, design_revisions, and creates tag tables

-- 1. Add fields to production_instructions
ALTER TABLE production_instructions ADD COLUMN IF NOT EXISTS daily_quantity INTEGER DEFAULT NULL;
ALTER TABLE production_instructions ADD COLUMN IF NOT EXISTS plain_case BOOLEAN DEFAULT false;
ALTER TABLE production_instructions ADD COLUMN IF NOT EXISTS plain_label BOOLEAN DEFAULT false;
ALTER TABLE production_instructions ADD COLUMN IF NOT EXISTS adhesive_sheet BOOLEAN DEFAULT false;
ALTER TABLE production_instructions ADD COLUMN IF NOT EXISTS design_revision_id UUID REFERENCES design_revisions(revision_id) ON DELETE SET NULL;

-- 2. Add fields to design_revisions
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS gas_pressure TEXT DEFAULT NULL;

-- 3. Create production_tag_master table
CREATE TABLE IF NOT EXISTS production_tag_master (
  tag_code TEXT PRIMARY KEY,
  label_ja TEXT NOT NULL,
  label_vi TEXT NOT NULL,
  priority SMALLINT NOT NULL DEFAULT 0,
  print_style TEXT NOT NULL DEFAULT 'default', -- 'red', 'black_border', etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on production_tag_master
ALTER TABLE production_tag_master ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users on production_tag_master" ON production_tag_master;
CREATE POLICY "Enable all access for authenticated users on production_tag_master" 
  ON production_tag_master FOR ALL TO authenticated USING (true);

-- Seed standard tags
INSERT INTO production_tag_master (tag_code, label_ja, label_vi, priority, print_style, is_active) VALUES
  ('PROTOTYPE', 'P試作', 'Sản xuất thử', 10, 'red', true),
  ('URGENT', '特急', 'Ưu tiên gấp', 20, 'red', true),
  ('FIRST_RUN', '量産初回', 'Lô đầu sản xuất hàng loạt', 30, 'red_bold', true),
  ('REWORK', '再加工', 'Gia công lại', 40, 'black_border', true),
  ('QUALITY_HOLD', '要品質確認', 'Cần QC xác nhận', 50, 'black_border', true),
  ('PACKAGING_SPECIAL', '包装指定あり', 'Có chỉ dẫn đóng gói riêng', 60, 'black', true),
  ('DELIVERY_SPLIT', '分納', 'Giao chia đợt', 70, 'black', true)
ON CONFLICT (tag_code) DO UPDATE SET
  label_ja = EXCLUDED.label_ja,
  label_vi = EXCLUDED.label_vi,
  priority = EXCLUDED.priority,
  print_style = EXCLUDED.print_style,
  is_active = EXCLUDED.is_active;

-- 4. Create production_instruction_tags table
CREATE TABLE IF NOT EXISTS production_instruction_tags (
  instruction_tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id UUID NOT NULL REFERENCES production_instructions(id) ON DELETE CASCADE,
  tag_code TEXT REFERENCES production_tag_master(tag_code) ON DELETE SET NULL,
  custom_label TEXT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT instruction_tag_requires_value CHECK (
    tag_code IS NOT NULL OR custom_label IS NOT NULL
  ),
  CONSTRAINT production_instruction_tag_custom_label_length CHECK (
    custom_label IS NULL OR char_length(custom_label) <= 24
  )
);

-- Enable RLS on production_instruction_tags
ALTER TABLE production_instruction_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users on production_instruction_tags" ON production_instruction_tags;
CREATE POLICY "Enable all access for authenticated users on production_instruction_tags" 
  ON production_instruction_tags FOR ALL TO authenticated USING (true);
