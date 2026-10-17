ALTER TABLE mold_maintenance DROP CONSTRAINT IF EXISTS mold_maintenance_physical_mold_id_fkey;

UPDATE mold_maintenance t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;

ALTER TABLE mold_maintenance ADD CONSTRAINT mold_maintenance_physical_mold_id_fkey
  FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;
