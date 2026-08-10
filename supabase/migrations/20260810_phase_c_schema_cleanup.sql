-- ============================================================================
-- Migration: Phase C — Schema Cleanup (2026-08-10)
-- C1: DROP products.primary_plastic_code (SSOT = design_revisions.plastic_type_designed)
-- C2: Rename version_note → change_summary (consolidate duplicate columns)
-- C3: Update mold_design_cutters.cutter_id FK → equipment(equipment_id)
-- ============================================================================

-- ── C1: Remove primary_plastic_code from products ──────────────────────────
-- Rationale: Plastic SSOT is design_revisions.plastic_type_designed.
-- products.primary_plastic_code caused confusion (showed "PET 0.5t" vs full spec).
-- Step: Copy any non-null values to design_revisions first (backfill safety net).

-- Safety backfill: copy products.primary_plastic_code → design_revisions.plastic_type_designed
-- ONLY where design_revisions.plastic_type_designed IS NULL
UPDATE design_revisions dr
SET plastic_type_designed = p.primary_plastic_code
FROM products p
WHERE dr.product_id = p.product_id
  AND (dr.plastic_type_designed IS NULL OR dr.plastic_type_designed = '')
  AND p.primary_plastic_code IS NOT NULL
  AND p.primary_plastic_code <> '';

-- Now drop the column
ALTER TABLE products DROP COLUMN IF EXISTS primary_plastic_code;
-- Also drop primary_plastic_spec if it exists (related deprecated column)
ALTER TABLE products DROP COLUMN IF EXISTS primary_plastic_spec;

-- ── C2: Consolidate version_note → change_summary ─────────────────────────
-- Both columns exist in design_revisions. Consolidate into change_summary.

-- Step 1: Copy version_note data → change_summary where change_summary is empty
UPDATE design_revisions
SET change_summary = version_note
WHERE (change_summary IS NULL OR change_summary = '')
  AND version_note IS NOT NULL
  AND version_note <> '';

-- Step 2: Drop version_note column
ALTER TABLE design_revisions DROP COLUMN IF EXISTS version_note;

-- ── C3: Migrate mold_design_cutters FK from cutters → equipment ───────────
-- Step 1: Add new column equipment_id referencing equipment table
ALTER TABLE mold_design_cutters
  ADD COLUMN IF NOT EXISTS equipment_id UUID REFERENCES equipment(equipment_id);

-- Step 2: Populate equipment_id from legacy_cutter_id in equipment table
UPDATE mold_design_cutters mdc
SET equipment_id = e.equipment_id
FROM equipment e
WHERE e.legacy_cutter_id = mdc.cutter_id
  AND mdc.equipment_id IS NULL;

-- Step 3: Also try direct match (some cutters may have been migrated with equipment_id = cutter_id)
UPDATE mold_design_cutters mdc
SET equipment_id = e.equipment_id
FROM equipment e
WHERE e.equipment_id = mdc.cutter_id
  AND mdc.equipment_id IS NULL;

-- Step 4: Drop old FK and column, rename equipment_id to cutter_id
-- NOTE: We keep the old cutter_id for now as fallback, but add the new FK
-- In a future migration, we can fully drop cutter_id after all code is migrated.

-- Add FK constraint on the new equipment_id column
-- (Already added via REFERENCES in ADD COLUMN above)

-- Log migration result
DO $$
DECLARE
  migrated_count INT;
  unmigrated_count INT;
BEGIN
  SELECT COUNT(*) INTO migrated_count FROM mold_design_cutters WHERE equipment_id IS NOT NULL;
  SELECT COUNT(*) INTO unmigrated_count FROM mold_design_cutters WHERE equipment_id IS NULL;
  RAISE NOTICE 'C3 Migration: % rows migrated to equipment_id, % rows still unmigrated', migrated_count, unmigrated_count;
END $$;
