-- Migration: Backfill job_category for existing jobs
-- Date: 2026-07-31
-- Purpose: Classify 1,183 existing jobs based on job_type_id mapping
-- Logic:
--   job_type_id = '4' (新規抜型) → CUTTER_NEW (958 rows)
--   job_type_id = '2' (金型改造) → MOLD_MODIFY (78 rows)
--   job_type_id = '10' (その他) → check sub-patterns, default OTHER (147 rows)
--   job_type_id = '1' (新規金型) → MOLD_NEW
--   job_type_id = '3' (金型保守) → MAINTENANCE
--   job_type_id = '5' (新規水冷盤) → EQUIPMENT_NEW
--   job_type_id = '6' (新規圧空盤) → EQUIPMENT_NEW
--   job_type_id = '7' (新規枠・受け盤) → EQUIPMENT_NEW
--   job_type_id = '8' (設備修理・清掃) → EQUIPMENT_REPAIR
--   job_type_id = '9' (その他/DESIGN) → OTHER
--   Quick Jobs (job_code LIKE 'QJ-%') → INTERNAL_OPS
--   Facility Jobs (notes ILIKE '%社内作業%') → INTERNAL_OPS

-- Step 1: Cutter jobs (biggest group)
UPDATE jobs SET job_category = 'CUTTER_NEW'
WHERE job_category IS NULL
  AND job_type_id = '4';

-- Step 2: Mold modify
UPDATE jobs SET job_category = 'MOLD_MODIFY'
WHERE job_category IS NULL
  AND job_type_id = '2';

-- Step 3: Mold new
UPDATE jobs SET job_category = 'MOLD_NEW'
WHERE job_category IS NULL
  AND job_type_id = '1';

-- Step 4: Mold maintenance
UPDATE jobs SET job_category = 'MAINTENANCE'
WHERE job_category IS NULL
  AND job_type_id = '3';

-- Step 5: Equipment manufacturing (Water Base, Pressure Base, Frame)
UPDATE jobs SET job_category = 'EQUIPMENT_NEW'
WHERE job_category IS NULL
  AND job_type_id IN ('5', '6', '7');

-- Step 6: Equipment repair
UPDATE jobs SET job_category = 'EQUIPMENT_REPAIR'
WHERE job_category IS NULL
  AND job_type_id = '8';

-- Step 7: Internal operations (Quick Jobs or facility jobs)
UPDATE jobs SET job_category = 'INTERNAL_OPS'
WHERE job_category IS NULL
  AND (job_code LIKE 'QJ-%' OR notes ILIKE '%社内作業%' OR notes ILIKE '%Internal Facility Job%');

-- Step 8: "その他" category — try to infer from job_name patterns
-- Water Base patterns
UPDATE jobs SET job_category = 'EQUIPMENT_NEW'
WHERE job_category IS NULL
  AND job_type_id = '10'
  AND (job_name ILIKE '%WB-%' OR job_name ILIKE '%水冷%' OR job_name ILIKE '%PB-%' OR job_name ILIKE '%圧空%');

-- Internal operation patterns
UPDATE jobs SET job_category = 'INTERNAL_OPS'
WHERE job_category IS NULL
  AND job_type_id = '10'
  AND (job_name ILIKE '%社内%' OR job_name ILIKE '%5S%' OR job_name ILIKE '%梱包%' OR job_name ILIKE '%写真%' OR job_name ILIKE '%清掃%');

-- Remaining "その他" with design+mold → likely MOLD_NEW
UPDATE jobs SET job_category = 'MOLD_NEW'
WHERE job_category IS NULL
  AND job_type_id = '10'
  AND design_revision_id IS NOT NULL
  AND physical_mold_id IS NOT NULL;

-- Step 9: Catch-all for anything remaining
UPDATE jobs SET job_category = 'OTHER'
WHERE job_category IS NULL;

-- Also update job_types.category to align with job_category values
UPDATE job_types SET category = 'MOLD' WHERE job_type_id = '1';
UPDATE job_types SET category = 'MOLD' WHERE job_type_id = '2';
UPDATE job_types SET category = 'MOLD' WHERE job_type_id = '3';
UPDATE job_types SET category = 'CUTTER' WHERE job_type_id = '4';
UPDATE job_types SET category = 'EQUIPMENT' WHERE job_type_id = '5';
UPDATE job_types SET category = 'EQUIPMENT' WHERE job_type_id = '6';
UPDATE job_types SET category = 'EQUIPMENT' WHERE job_type_id = '7';
UPDATE job_types SET category = 'EQUIPMENT' WHERE job_type_id = '8';
UPDATE job_types SET category = 'OTHER' WHERE job_type_id = '9';
UPDATE job_types SET category = 'OTHER' WHERE job_type_id = '10';
