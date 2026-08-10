-- Seed new Equipment Job Types into job_types table
INSERT INTO job_types (job_type_id, job_type_name_ja, job_type_name_vi, sort_order)
VALUES
  ('5', '新規水冷盤', 'Chế tạo Đế làm mát mới (Water Base)', 5),
  ('6', '新規圧空盤', 'Chế tạo Đế áp lực mới (Pressure Base)', 6),
  ('7', '新規枠・受け盤', 'Chế tạo Khung / Đế đỡ mới (Frame)', 7),
  ('8', '設備修理・清掃', 'Sửa chữa & Làm sạch thiết bị', 8),
  ('9', 'その他', 'Khác', 9)
ON CONFLICT (job_type_id) DO UPDATE SET
  job_type_name_ja = EXCLUDED.job_type_name_ja,
  job_type_name_vi = EXCLUDED.job_type_name_vi,
  sort_order = EXCLUDED.sort_order;
