-- =====================================================================
-- Migration: Multi-Department Work Logging — Phase 1
-- Date: 2026-08-19
-- Description:
--   1. Add 10 design processing codes (1-9, 35) from Access tblProcessingCode
--   2. Deactivate code 30 (設計 — too generic, replaced by detailed codes)
--   3. Add department_code column to processing_codes for department filtering
--   4. Add requires_prototype_mold flag to products
--   5. Add optional design_revision_context to work_logs
-- =====================================================================

-- ============================================================
-- [1] Add 10 design processing codes
-- ============================================================
INSERT INTO processing_codes (processing_code_id, processing_name, sort_note, category, is_active) VALUES
(1, 'レイアウト', 1, 'DESIGN', true),
(2, '3Dスキャン図面作成', 2, 'DESIGN', true),
(3, '3D金型図面作成', 3, 'DESIGN', true),
(4, '3Dメンテ図面作成', 4, 'DESIGN', true),
(5, '3Dスタッキング図面作成', 5, 'DESIGN', true),
(6, '展開図工作成', 6, 'DESIGN', true),
(7, '表プログラム作成', 7, 'DESIGN', true),
(8, '3D試作金型作成', 8, 'DESIGN', true),
(9, '裏穴図面作成', 9, 'DESIGN', true),
(35, 'プラグ木型プログラム', 35, 'DESIGN', true)
ON CONFLICT (processing_code_id) DO UPDATE SET
  processing_name = EXCLUDED.processing_name,
  sort_note = EXCLUDED.sort_note,
  category = EXCLUDED.category,
  is_active = true;

-- ============================================================
-- [2] Deactivate code 30 (設計) — replaced by 10 detailed codes
-- ============================================================
UPDATE processing_codes SET is_active = false WHERE processing_code_id = 30;

-- ============================================================
-- [3] Add department_code column for department-based filtering
-- ============================================================
ALTER TABLE processing_codes ADD COLUMN IF NOT EXISTS department_code TEXT;

-- Assign department codes
UPDATE processing_codes SET department_code = 'DESIGN'
  WHERE processing_code_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 35);

UPDATE processing_codes SET department_code = 'MOLD_SHOP'
  WHERE category IN ('MOLD', 'PLUG', 'CUTTER', 'EQUIPMENT', 'MACHINING')
    AND department_code IS NULL;

UPDATE processing_codes SET department_code = 'PRODUCTION'
  WHERE category IN ('PRODUCTION', 'SHIPPING')
    AND department_code IS NULL;

UPDATE processing_codes SET department_code = 'QUALITY'
  WHERE category = 'QUALITY'
    AND department_code IS NULL;

UPDATE processing_codes SET department_code = 'OFFICE'
  WHERE category IN ('OFFICE', 'MEETING', 'MANAGEMENT', 'TRAINING')
    AND department_code IS NULL;

UPDATE processing_codes SET department_code = 'GENERAL'
  WHERE department_code IS NULL;

-- ============================================================
-- [4] Add requires_prototype_mold flag to products
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS
  requires_prototype_mold BOOLEAN DEFAULT false;

COMMENT ON COLUMN products.requires_prototype_mold IS
  '試作ポケット — Product requires a prototype mold before mass production';

-- ============================================================
-- [5] Add optional design_revision_context to work_logs
-- ============================================================
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS
  design_revision_context TEXT;

COMMENT ON COLUMN work_logs.design_revision_context IS
  'Informational: which design revision context this log belongs to (e.g. R2, R3)';

-- ============================================================
-- [6] RLS for new columns (processing_codes already has RLS)
-- ============================================================
-- No additional RLS needed — existing policies cover new columns

-- Done
