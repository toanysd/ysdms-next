-- Disable unused processes
UPDATE standard_process_times SET is_active = false WHERE process_code IN ('ULTRASONIC', 'FINISH');

-- Update MOLD track
UPDATE standard_process_times SET process_name_ja = '裏面演算＆加工', process_name_vi = 'Lập trình và gia công mặt sau', machine_type_required = 'MANUAL', sort_order = 1 WHERE process_code = 'BACK_CAM';
UPDATE standard_process_times SET process_name_ja = '裏面機械加工', process_name_vi = 'Gia công máy mặt sau', machine_type_required = 'CNC_MOLD', sort_order = 2 WHERE process_code = 'BACK_CNC';
UPDATE standard_process_times SET process_name_ja = '表面演算＆加工', process_name_vi = 'Lập trình và gia công mặt trước', machine_type_required = 'MANUAL', sort_order = 3 WHERE process_code = 'FRONT_CAM';
UPDATE standard_process_times SET process_name_ja = '表面機械加工', process_name_vi = 'Gia công máy mặt trước', machine_type_required = 'CNC_MOLD', sort_order = 4 WHERE process_code = 'FRONT_CNC';
UPDATE standard_process_times SET process_name_ja = '金型穴あけ', process_name_vi = 'Khoan lỗ hút chân không', sort_order = 5 WHERE process_code = 'VACUUM_DRILL';
UPDATE standard_process_times SET process_name_ja = '金型ミガキ&仕上げ', process_name_vi = 'Đánh bóng và hoàn thiện khuôn', sort_order = 6 WHERE process_code = 'POLISH';

-- Update PLUG track
UPDATE standard_process_times SET process_code = 'PLUG_CAM', process_name_ja = 'プラグ演算＆加工', process_name_vi = 'Lập trình và gia công Plug', machine_type_required = 'MANUAL', sort_order = 1 WHERE process_code = 'PLUG_CNC';

INSERT INTO standard_process_times (id, process_code, process_name_ja, process_name_vi, default_hours, default_hours_trial, machine_type_required, track, sort_order, is_active)
VALUES (gen_random_uuid(), 'PLUG_CNC', 'プラグ機械加工', 'Gia công máy Plug', 2, 1, 'CNC_PLUG', 'PLUG', 2, true);

UPDATE standard_process_times SET process_name_ja = '台座製作＆プラグ穴あけ', process_name_vi = 'Chế tạo đế và khoan lỗ cho plug', sort_order = 3 WHERE process_code = 'PLUG_BASE';
UPDATE standard_process_times SET process_name_ja = 'ネル貼り＆仕上げ', process_name_vi = 'Dán vải và hoàn thiện khuôn gỗ plug', sort_order = 4 WHERE process_code = 'PLUG_FELT';
