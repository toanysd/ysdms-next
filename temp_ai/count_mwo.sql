SELECT COUNT(*) as pm_count FROM mold_work_orders t JOIN physical_molds pm ON t.physical_mold_id = pm.physical_mold_id JOIN equipment e ON e.equipment_code = pm.system_code;
SELECT COUNT(*) as ct_count FROM mold_work_orders t JOIN cutters c ON t.cutter_id = c.cutter_id JOIN equipment e ON e.equipment_code = c.cutter_no;
