BEGIN;

ALTER TABLE mold_work_orders DROP CONSTRAINT IF EXISTS mold_work_orders_physical_mold_id_fkey;
UPDATE mold_work_orders t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_work_orders ADD CONSTRAINT mold_work_orders_physical_mold_id_fkey
  FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

ALTER TABLE mold_work_orders DROP CONSTRAINT IF EXISTS mold_work_orders_cutter_id_fkey;
UPDATE mold_work_orders t SET cutter_id = e.equipment_id
FROM cutters c JOIN equipment e ON e.equipment_code = c.cutter_no
WHERE t.cutter_id = c.cutter_id;
ALTER TABLE mold_work_orders ADD CONSTRAINT mold_work_orders_cutter_id_fkey
  FOREIGN KEY (cutter_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

COMMIT;
