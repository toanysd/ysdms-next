-- DRY RUN ONLY — DO NOT EXECUTE ON PRODUCTION
-- Purpose: Map physical_molds.id -> equipment.id for foreign key migration
-- Verify logic only

BEGIN;

-- Step 1: Verify record counts match
SELECT 
  (SELECT COUNT(*) FROM physical_molds) as pm_count,
  (SELECT COUNT(*) FROM equipment WHERE equipment_type = 'MOLD') as eq_mold_count,
  (SELECT COUNT(*) FROM cutters) as cutter_count,
  (SELECT COUNT(*) FROM equipment WHERE equipment_type IN ('CUTTER_SEPARATE', 'CUTTER_INLINE')) as eq_cutter_count;

-- Step 2: Find orphaned physical_molds (no matching equipment record)
SELECT pm.physical_mold_id, pm.display_name
FROM physical_molds pm
LEFT JOIN equipment e ON e.legacy_physical_mold_id = pm.physical_mold_id
WHERE e.equipment_id IS NULL;

-- Step 3: Find orphaned cutters (no matching equipment record)
SELECT c.cutter_id, c.cutter_name
FROM cutters c
LEFT JOIN equipment e ON e.legacy_cutter_id = c.cutter_id::text
WHERE e.equipment_id IS NULL;

ROLLBACK;
