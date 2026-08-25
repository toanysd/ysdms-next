BEGIN;

ALTER TABLE technical_reviews DROP CONSTRAINT IF EXISTS technical_reviews_mold_id_fkey;
UPDATE technical_reviews t SET mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.mold_id = pm.physical_mold_id;
ALTER TABLE technical_reviews ADD CONSTRAINT technical_reviews_mold_id_fkey
  FOREIGN KEY (mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

ALTER TABLE technical_reviews DROP CONSTRAINT IF EXISTS technical_reviews_cutting_die_id_fkey;
UPDATE technical_reviews t SET cutting_die_id = e.equipment_id
FROM cutters c JOIN equipment e ON e.equipment_code = c.cutter_no
WHERE t.cutting_die_id = c.cutter_id;
ALTER TABLE technical_reviews ADD CONSTRAINT technical_reviews_cutting_die_id_fkey
  FOREIGN KEY (cutting_die_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

COMMIT;
