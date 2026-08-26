SELECT COUNT(*) as pm_count FROM technical_reviews t JOIN physical_molds pm ON t.mold_id = pm.physical_mold_id JOIN equipment e ON e.equipment_code = pm.system_code;
SELECT COUNT(*) as ct_count FROM technical_reviews t JOIN cutters c ON t.cutting_die_id = c.cutter_id JOIN equipment e ON e.equipment_code = c.cutter_no;
