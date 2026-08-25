-- BƯỚC 1: Update UUID cũ → UUID mới qua code match
UPDATE mold_photos t
SET physical_mold_id = e.equipment_id
FROM physical_molds pm
JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;

-- BƯỚC 3: Drop constraint cũ + Add constraint mới → equipment
ALTER TABLE mold_photos 
  DROP CONSTRAINT IF EXISTS mold_photos_physical_mold_id_fkey;

ALTER TABLE mold_photos 
  ADD CONSTRAINT mold_photos_physical_mold_id_fkey
  FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id)
  ON DELETE SET NULL;
