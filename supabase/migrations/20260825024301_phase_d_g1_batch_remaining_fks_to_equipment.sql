-- ============================================================
-- ADR-004 Phase 1 Batch: 12 remaining safe FK → equipment
-- ============================================================

-- [1] aluminum_blanks.mold_id → physical_molds
ALTER TABLE aluminum_blanks DROP CONSTRAINT IF EXISTS aluminum_blanks_mold_id_fkey;
UPDATE aluminum_blanks t SET mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.mold_id = pm.physical_mold_id;
ALTER TABLE aluminum_blanks ADD CONSTRAINT aluminum_blanks_mold_id_fkey FOREIGN KEY (mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [2] certificate_items
ALTER TABLE certificate_items DROP CONSTRAINT IF EXISTS certificate_items_physical_mold_id_fkey;
UPDATE certificate_items t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE certificate_items ADD CONSTRAINT certificate_items_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [3] cutter_orders.cutter_id → cutters
ALTER TABLE cutter_orders DROP CONSTRAINT IF EXISTS cutter_orders_cutter_id_fkey;
UPDATE cutter_orders t SET cutter_id = e.equipment_id
FROM cutters c JOIN equipment e ON e.equipment_code = c.cutter_no
WHERE t.cutter_id = c.cutter_id;
ALTER TABLE cutter_orders ADD CONSTRAINT cutter_orders_cutter_id_fkey FOREIGN KEY (cutter_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [4] cutter_orders.reuse_cutter_id → cutters
ALTER TABLE cutter_orders DROP CONSTRAINT IF EXISTS cutter_orders_reuse_cutter_id_fkey;
UPDATE cutter_orders t SET reuse_cutter_id = e.equipment_id
FROM cutters c JOIN equipment e ON e.equipment_code = c.cutter_no
WHERE t.reuse_cutter_id = c.cutter_id;
ALTER TABLE cutter_orders ADD CONSTRAINT cutter_orders_reuse_cutter_id_fkey FOREIGN KEY (reuse_cutter_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [5] mold_disposal_logs
ALTER TABLE mold_disposal_logs DROP CONSTRAINT IF EXISTS mold_disposal_logs_physical_mold_id_fkey;
UPDATE mold_disposal_logs t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_disposal_logs ADD CONSTRAINT mold_disposal_logs_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [6] mold_inventory_items
ALTER TABLE mold_inventory_items DROP CONSTRAINT IF EXISTS mold_inventory_items_physical_mold_id_fkey;
UPDATE mold_inventory_items t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_inventory_items ADD CONSTRAINT mold_inventory_items_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [7] mold_location_history
ALTER TABLE mold_location_history DROP CONSTRAINT IF EXISTS mold_location_history_physical_mold_id_fkey;
UPDATE mold_location_history t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_location_history ADD CONSTRAINT mold_location_history_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [8] mold_maintenance
ALTER TABLE mold_maintenance DROP CONSTRAINT IF EXISTS mold_maintenance_physical_mold_id_fkey;
UPDATE mold_maintenance t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_maintenance ADD CONSTRAINT mold_maintenance_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [9] mold_measurements
ALTER TABLE mold_measurements DROP CONSTRAINT IF EXISTS mold_measurements_physical_mold_id_fkey;
UPDATE mold_measurements t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_measurements ADD CONSTRAINT mold_measurements_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [10] mold_name_history
ALTER TABLE mold_name_history DROP CONSTRAINT IF EXISTS mold_name_history_physical_mold_id_fkey;
UPDATE mold_name_history t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_name_history ADD CONSTRAINT mold_name_history_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [11] mold_owner_qr_labels
ALTER TABLE mold_owner_qr_labels DROP CONSTRAINT IF EXISTS mold_owner_qr_labels_physical_mold_id_fkey;
UPDATE mold_owner_qr_labels t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_owner_qr_labels ADD CONSTRAINT mold_owner_qr_labels_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

-- [12] mold_return_logs
ALTER TABLE mold_return_logs DROP CONSTRAINT IF EXISTS mold_return_logs_physical_mold_id_fkey;
UPDATE mold_return_logs t SET physical_mold_id = e.equipment_id
FROM physical_molds pm JOIN equipment e ON e.equipment_code = pm.system_code
WHERE t.physical_mold_id = pm.physical_mold_id;
ALTER TABLE mold_return_logs ADD CONSTRAINT mold_return_logs_physical_mold_id_fkey FOREIGN KEY (physical_mold_id) REFERENCES equipment(equipment_id) ON DELETE SET NULL;

