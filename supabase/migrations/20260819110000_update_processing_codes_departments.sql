-- =====================================================================
-- Migration: Correct Processing Codes Department Classification
-- Date: 2026-08-19
-- Description:
--   Explicitly maps all processing codes to their respective department:
--   - MOLD_SHOP: All mold machining, trial mold, plug, cutter, maintenance, and workshop operations
--   - DESIGN: 10 design & CAM codes (1-9, 35)
--   - PRODUCTION: Thermoforming, pressing, packaging, shipping, material prep
--   - QUALITY: Inspection (630)
--   - OFFICE: Office work, meetings, management, training
--   - GENERAL: 5S (50), Other (888)
-- =====================================================================

-- 1. Reset all to GENERAL first
UPDATE processing_codes SET department_code = 'GENERAL';

-- 2. DESIGN (設計部)
UPDATE processing_codes
SET department_code = 'DESIGN', category = 'DESIGN'
WHERE processing_code_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 35);

-- 3. MOLD_SHOP (金型工場 / Gia công, sửa chữa khuôn, plug, dao, bảo trì)
UPDATE processing_codes
SET department_code = 'MOLD_SHOP', category = 'MOLD'
WHERE processing_code_id IN (
  10, 11, 12, 13, 14, 15, 16, 17, -- Khuôn nhôm (金型演算＆加工, 本型穴あけ, 本型ミガキ, 本型ネル貼り, 演算＆加工, 金型加工, 金型追加工, 金型ショートかけ)
  20, 21, 22, 23, 24              -- Khuôn thử nghiệm (試作金型演算＆加工, 試作穴あけ, 試作ミガキ, 試作ネル貼り, 試作金型加工)
);

UPDATE processing_codes
SET department_code = 'MOLD_SHOP', category = 'PLUG'
WHERE processing_code_id IN (31, 32, 33, 34, 56); -- Plug (プラグ演算＆加工, 試作プラグ演算＆加工, 本型手造りプラグ, 試作手造りプラグ, プラグ調整)

UPDATE processing_codes
SET department_code = 'MOLD_SHOP', category = 'EQUIPMENT'
WHERE processing_code_id IN (40, 41, 42, 43, 53, 54, 55, 700, 730); -- Gá, dao, bảo trì, gia công cơ khí (スタッキング, サーブ木板製作, 修理, カッター治具, 金型整理, メンテナンス, 金型清掃, 機械加工, 設備管理)

-- 4. PRODUCTION (生産部 / Ép nhựa, dập, bao gói, xuất hàng)
UPDATE processing_codes
SET department_code = 'PRODUCTION', category = 'PRODUCTION'
WHERE processing_code_id IN (51, 52, 560, 600, 610, 620, 640); -- 梱包, 粉砕, プレス応援, 材料出し, 出荷作業, 出荷応援, 成形補助

-- 5. QUALITY (品質管理 / Kiểm tra)
UPDATE processing_codes
SET department_code = 'QUALITY', category = 'QUALITY'
WHERE processing_code_id IN (630); -- 検査

-- 6. OFFICE (事務 / Văn phòng, họp, quản lý, đào tạo)
UPDATE processing_codes
SET department_code = 'OFFICE', category = 'OFFICE'
WHERE processing_code_id IN (250, 550, 720, 740, 750, 999); -- 事務, プログラムトレーニング, 教育・研修, 工程管理, 客先打ち合わせ, 会議

-- 7. GENERAL (共通 / 5S, Khác)
UPDATE processing_codes
SET department_code = 'GENERAL', category = 'GENERAL'
WHERE processing_code_id IN (50, 888); -- 5S, その他

-- 8. Code 30 is inactive
UPDATE processing_codes SET is_active = false WHERE processing_code_id = 30;
