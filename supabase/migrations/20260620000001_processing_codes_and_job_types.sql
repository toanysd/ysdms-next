-- =====================================================================
-- Migration: Processing Codes + Job Types Enhancement
-- Date: 2026-06-20
-- Description:
--   1. Add sort_order & category to job_types
--   2. Create processing_codes table (mapping from Access tblProcessingCode)
--   3. Add processing_code_id FK to work_logs
-- =====================================================================

-- [1] job_types — add sort_order & category
ALTER TABLE job_types ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE job_types ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'OTHER';

-- Update existing seed data with sort_order & category
UPDATE job_types SET sort_order = 10, category = 'MOLD'       WHERE job_type_name_ja LIKE '%新規金型%' OR job_type_id = '1';
UPDATE job_types SET sort_order = 20, category = 'MOLD'       WHERE job_type_name_ja LIKE '%金型改%' OR job_type_id = '2';
UPDATE job_types SET sort_order = 30, category = 'MOLD'       WHERE job_type_name_ja LIKE '%金型保守%' OR job_type_id = '3';
UPDATE job_types SET sort_order = 40, category = 'CUTTER'     WHERE job_type_name_ja LIKE '%新規抜型%' OR job_type_id = '4';
UPDATE job_types SET sort_order = 50, category = 'CUTTER'     WHERE job_type_name_ja LIKE '%抜型保守%' OR job_type_id = '5';
UPDATE job_types SET sort_order = 60, category = 'PRODUCTION' WHERE job_type_name_ja LIKE '%試作%' OR job_type_id = '6';
UPDATE job_types SET sort_order = 70, category = 'PRODUCTION' WHERE job_type_name_ja LIKE '%量産%' OR job_type_id = '7';
UPDATE job_types SET sort_order = 80, category = 'PRODUCTION' WHERE job_type_name_ja LIKE '%サンプル%' OR job_type_id = '8';
UPDATE job_types SET sort_order = 90, category = 'DESIGN'     WHERE job_type_name_ja LIKE '%設計%' OR job_type_id = '9';
UPDATE job_types SET sort_order = 100, category = 'OTHER'     WHERE job_type_name_ja LIKE '%その他%' OR job_type_id = '10';

-- [2] processing_codes — tblProcessingCode from Access
-- Mỗi processing_code thuộc 1 category, khi nhập nhật ký sẽ filter theo job_type.category
CREATE TABLE IF NOT EXISTS processing_codes (
  processing_code_id INTEGER PRIMARY KEY,
  processing_name TEXT NOT NULL,
  sort_note INTEGER DEFAULT 0,
  category TEXT DEFAULT 'GENERAL',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed processing_codes from Access tblProcessingCode
-- Category logic: 本型=MOLD, 試作=TRIAL (handled at job_type level per user request),
-- but processing_codes themselves are grouped by functional area
INSERT INTO processing_codes (processing_code_id, processing_name, sort_note, category) VALUES
-- ── Khuôn nhôm (金型) ──
(10, '金型演算＆加工', 100, 'MOLD'),
(11, '本型穴あけ', 120, 'MOLD'),
(12, '本型ミガキ', 130, 'MOLD'),
(13, '本型ネル貼り', 140, 'MOLD'),
(14, '演算＆加工', 101, 'MOLD'),
(15, '金型加工', 110, 'MOLD'),
(16, '金型追加工', 150, 'MOLD'),
(17, '金型ショートかけ', 160, 'MOLD'),
-- ── Khuôn thử nghiệm (試作) ──
(20, '試作金型演算＆加工', 200, 'MOLD'),
(21, '試作穴あけ', 220, 'MOLD'),
(22, '試作ミガキ', 230, 'MOLD'),
(23, '試作ネル貼り', 240, 'MOLD'),
(24, '試作金型加工', 210, 'MOLD'),
-- ── Thiết kế & Plug ──
(30, '設計', 300, 'DESIGN'),
(31, 'プラグ演算＆加工', 310, 'PLUG'),
(32, '試作プラグ演算＆加工', 320, 'PLUG'),
(33, '本型手造りプラグ', 400, 'PLUG'),
(34, '試作手造りプラグ', 410, 'PLUG'),
-- ── Thiết bị / Stacking / Dao ──
(40, 'スタッキング', 520, 'EQUIPMENT'),
(41, 'サーブ木板製作', 430, 'EQUIPMENT'),
(42, '金型・プラグ・ベース修理、穴あけなど', 420, 'EQUIPMENT'),
(43, 'カッター治具', 540, 'CUTTER'),
-- ── Công việc chung ──
(50, '5S', 500, 'GENERAL'),
(51, '梱包', 530, 'SHIPPING'),
(52, '粉砕', 510, 'GENERAL'),
(53, '金型整理', 570, 'GENERAL'),
(54, 'メンテナンス', 710, 'MAINTENANCE'),
(55, '金型清掃', 0, 'GENERAL'),
(56, 'プラグ調整', 0, 'PLUG'),
-- ── Sản xuất / Vận chuyển ──
(250, '事務', 250, 'OFFICE'),
(550, 'プログラムトレーニング', 550, 'TRAINING'),
(560, 'プレス応援', 560, 'PRODUCTION'),
(600, '材料出し', 600, 'PRODUCTION'),
(610, '出荷作業', 610, 'SHIPPING'),
(620, '出荷応援', 620, 'SHIPPING'),
(630, '検査', 630, 'QUALITY'),
(640, '成形補助', 640, 'PRODUCTION'),
(700, '機械加工', 700, 'MACHINING'),
(720, '教育・研修', 720, 'TRAINING'),
(730, '設備管理', 730, 'MAINTENANCE'),
(740, '工程管理', 740, 'MANAGEMENT'),
(750, '客先打ち合わせ', 750, 'MEETING'),
(888, 'その他', 888, 'OTHER'),
(999, '会議（JOB外、一般会議）', 999, 'MEETING')
ON CONFLICT (processing_code_id) DO NOTHING;

-- [3] Add processing_code_id to work_logs
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS processing_code_id INTEGER
  REFERENCES processing_codes(processing_code_id);

-- [4] Enable RLS (match existing pattern)
ALTER TABLE processing_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "processing_codes_read" ON processing_codes FOR SELECT USING (true);

-- Done
