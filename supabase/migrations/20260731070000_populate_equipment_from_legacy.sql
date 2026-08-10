-- Migration: Populate equipment table from physical_molds and cutters
-- Date: 2026-07-31
-- Purpose: Copy all physical_molds (4,751) and cutters (1,283) into unified equipment table
-- Total expected: ~6,034 records
-- Note: This does NOT drop or modify the source tables (backward compat)

-- =============================================
-- STEP 1: Insert from physical_molds → equipment
-- =============================================
-- Classify equipment_type based on system_code prefix:
--   WB-* → WATER_BASE
--   PB-* → PRESSURE_BASE
--   Everything else → MOLD (default)
INSERT INTO equipment (
  equipment_code,
  display_name,
  equipment_type,
  sub_type,
  physical_stamp,
  actual_length_mm,
  actual_width_mm,
  actual_height_mm,
  actual_weight,
  company_id,
  keeper_company_id,
  design_revision_id,
  cav_type_id,
  mold_master_id,
  mold_revision_id,
  current_rack_layer_id,
  device_status,
  usage_status,
  on_checklist,
  mold_type,
  piece_count,
  copy_number,
  manufacturing_date,
  entry_date,
  returned_date,
  disposed_date,
  qr_uuid,
  legacy_physical_mold_id,
  legacy_id,
  legacy_specs,
  notes,
  created_at,
  updated_at
)
SELECT
  pm.system_code,
  pm.display_name,
  CASE
    WHEN pm.system_code LIKE 'WB-%' OR pm.system_code LIKE 'wb-%' THEN 'WATER_BASE'
    WHEN pm.system_code LIKE 'PB-%' OR pm.system_code LIKE 'pb-%' THEN 'PRESSURE_BASE'
    ELSE 'MOLD'
  END AS equipment_type,
  NULL AS sub_type,
  pm.physical_stamp,
  pm.actual_length_mm,
  pm.actual_width_mm,
  pm.actual_height_mm,
  pm.actual_weight,
  NULL AS company_id, -- physical_molds doesn't have company_id directly
  pm.keeper_company_id,
  NULL AS design_revision_id, -- will be linked via mold_revision → design
  pm.cav_type_id,
  NULL AS mold_master_id, -- deprecated
  pm.mold_revision_id,
  pm.current_rack_layer_id,
  COALESCE(pm.device_status, 'NORMAL'),
  COALESCE(pm.usage_status, 'STORAGE'),
  COALESCE(pm.on_checklist, FALSE),
  pm.mold_type,
  pm.piece_count,
  pm.copy_number,
  pm.manufacturing_date,
  pm.mold_entry_date,
  pm.returned_date,
  pm.disposed_date,
  pm.qr_uuid,
  pm.physical_mold_id, -- preserve link back
  pm.legacy_id,
  pm.legacy_specs,
  pm.notes,
  COALESCE(pm.created_at, now()),
  COALESCE(pm.updated_at, now())
FROM physical_molds pm
ON CONFLICT (equipment_code) DO NOTHING;

-- =============================================
-- STEP 2: Insert from cutters → equipment
-- =============================================
-- All cutters → equipment_type = 'CUTTER_SEPARATE' (default)
-- Prefix cutter_no with 'CT-' if not already prefixed to avoid code collision
INSERT INTO equipment (
  equipment_code,
  display_name,
  equipment_type,
  sub_type,
  dimensions,
  actual_length_mm,
  actual_width_mm,
  actual_height_mm,
  company_id,
  keeper_company_id,
  design_revision_id,
  current_rack_layer_id,
  usage_status,
  entry_date,
  qr_uuid,
  legacy_cutter_id,
  legacy_id,
  legacy_specs,
  notes,
  created_at,
  updated_at
)
SELECT
  CASE
    WHEN c.cutter_no LIKE 'CT-%' THEN c.cutter_no
    ELSE 'CT-' || c.cutter_no
  END AS equipment_code,
  c.cutter_name AS display_name,
  'CUTTER_SEPARATE' AS equipment_type,
  c.cutter_type AS sub_type,
  -- Build dimensions string from cutter dimensions
  CASE
    WHEN c.cutter_length_mm IS NOT NULL AND c.cutter_width_mm IS NOT NULL
    THEN c.cutter_length_mm::text || 'x' || c.cutter_width_mm::text
         || COALESCE('x' || c.cutter_height_mm::text, '')
    ELSE NULL
  END AS dimensions,
  c.cutter_length_mm::text,
  c.cutter_width_mm::text,
  c.cutter_height_mm::text,
  c.company_id,
  c.keeper_company_id,
  c.design_revision_id,
  c.current_rack_layer_id,
  COALESCE(c.usage_status, 'STORAGE'),
  c.date_entry::date,
  c.qr_uuid,
  c.cutter_id, -- preserve link back
  c.legacy_id,
  c.legacy_specs,
  c.notes,
  COALESCE(c.created_at, now()),
  COALESCE(c.updated_at, now())
FROM cutters c
ON CONFLICT (equipment_code) DO NOTHING;

-- =============================================
-- STEP 3: Link jobs.equipment_id where possible
-- =============================================
-- For jobs that have physical_mold_id, set equipment_id to matching equipment record
UPDATE jobs j
SET equipment_id = e.equipment_id
FROM equipment e
WHERE j.physical_mold_id IS NOT NULL
  AND j.equipment_id IS NULL
  AND e.legacy_physical_mold_id = j.physical_mold_id;

-- =============================================
-- STEP 4: Create equipment_assignments for known mold-cutter pairs
-- =============================================
-- Link cutters to their parent molds via design_revision_id
-- (Mold and Cutter share the same design_revision)
INSERT INTO equipment_assignments (
  primary_equipment_id,
  related_equipment_id,
  relationship_type,
  is_default,
  notes
)
SELECT DISTINCT
  e_mold.equipment_id AS primary_equipment_id,
  e_cutter.equipment_id AS related_equipment_id,
  'SET_MEMBER' AS relationship_type,
  TRUE AS is_default,
  'Auto-linked: shared design_revision' AS notes
FROM equipment e_mold
JOIN equipment e_cutter ON e_mold.design_revision_id = e_cutter.design_revision_id
WHERE e_mold.equipment_type = 'MOLD'
  AND e_cutter.equipment_type IN ('CUTTER_SEPARATE', 'CUTTER_INLINE')
  AND e_mold.design_revision_id IS NOT NULL
  AND e_mold.equipment_id <> e_cutter.equipment_id
ON CONFLICT (primary_equipment_id, related_equipment_id) DO NOTHING;
