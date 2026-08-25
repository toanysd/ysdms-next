BEGIN;

-- physical_mold_id
ALTER TABLE production_orders DROP CONSTRAINT IF EXISTS production_orders_physical_mold_id_fkey;
ALTER TABLE production_orders ADD CONSTRAINT production_orders_physical_mold_id_fkey
  FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- bom_reference_mold_id
ALTER TABLE production_orders DROP CONSTRAINT IF EXISTS production_orders_bom_reference_mold_id_fkey;
ALTER TABLE production_orders ADD CONSTRAINT production_orders_bom_reference_mold_id_fkey
  FOREIGN KEY (bom_reference_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- cutter_id
ALTER TABLE production_orders DROP CONSTRAINT IF EXISTS production_orders_cutter_id_fkey;
ALTER TABLE production_orders ADD CONSTRAINT production_orders_cutter_id_fkey
  FOREIGN KEY (cutter_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

COMMIT;
