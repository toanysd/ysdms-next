-- ============================================================
-- Migration: Chuẩn hóa bảng cav_types theo bảng xưởng YSD
-- YSD規格 CAV-水冷ベース一覧表 (YSD Standard CAV-Water Base)
-- 
-- AN TOÀN: 0% equipment/design_revisions đang reference cav_type_id
-- Đã rà soát toàn bộ repo: 4 file sử dụng, không file nào phụ thuộc mã cũ
-- ============================================================

-- Bước 1: Xóa dữ liệu cũ (57 dòng mã số thuần, không chuẩn)
-- CASCADE: bảng machine_cav_compatibility có FK → cav_types, cần xóa đồng thời
TRUNCATE TABLE cav_types CASCADE;

-- Bước 2: Insert 52 dòng đúng theo bảng xưởng vật lý
-- Nhóm STANDARD (32 mã: A → ZH)
INSERT INTO cav_types (cav_code, description, cav_length_mm, cav_width_mm, machine_group, cav_series, alias_cav_code, notes) VALUES
  ('A',    'CAV A',    470, 300, 'STANDARD', 'C6',  '74B',  NULL),
  ('B',    'CAV B',    335, 265, 'STANDARD', 'PS',  NULL,   NULL),
  ('C',    'CAV C',    499, 347, 'STANDARD', 'JR',  '74F',  NULL),
  ('D',    'CAV D',    354, 300, 'STANDARD', 'C3',  NULL,   NULL),
  ('E',    'CAV E',    430, 260, 'STANDARD', NULL,  NULL,   NULL),
  ('F',    'CAV F',    340, 285, 'STANDARD', NULL,  NULL,   NULL),
  ('G',    'CAV G',    320, 195, 'STANDARD', NULL,  NULL,   NULL),
  ('H',    'CAV H',    300, 246, 'STANDARD', NULL,  NULL,   NULL),
  ('I',    'CAV I',    405, 300, 'STANDARD', NULL,  NULL,   NULL),
  ('J',    'CAV J',    338, 175, 'STANDARD', NULL,  NULL,   NULL),
  ('K',    'CAV K',    503, 273, 'STANDARD', 'HK',  NULL,   NULL),
  ('L',    'CAV L',    416, 336, 'STANDARD', NULL,  NULL,   NULL),
  ('M',    'CAV M',    500, 330, 'STANDARD', NULL,  NULL,   NULL),
  ('O',    'CAV O',    420, 220, 'STANDARD', NULL,  NULL,   NULL),
  ('P',    'CAV P',    443, 246, 'STANDARD', NULL,  NULL,   NULL),
  ('Q',    'CAV Q',    310, 210, 'STANDARD', NULL,  NULL,   NULL),
  ('R',    'CAV R',    310, 240, 'STANDARD', NULL,  NULL,   NULL),
  ('S',    'CAV S',    385, 265, 'STANDARD', 'SMK', NULL,   NULL),
  ('T',    'CAV T',    390, 330, 'STANDARD', NULL,  NULL,   NULL),
  ('U',    'CAV U',    498, 245, 'STANDARD', 'SLK', NULL,   NULL),
  ('V',    'CAV V',    355, 240, 'STANDARD', NULL,  NULL,   NULL),
  ('W',    'CAV W',    492, 270, 'STANDARD', '2C',  NULL,   NULL),
  ('Y',    'CAV Y',    435, 312, 'STANDARD', NULL,  NULL,   NULL),
  ('Z',    'CAV Z',    355, 260, 'STANDARD', NULL,  NULL,   NULL),
  ('ZA',   'CAV ZA',   460, 330, 'STANDARD', NULL,  '74A',  NULL),
  ('ZB',   'CAV ZB',   355, 347, 'STANDARD', NULL,  NULL,   NULL),
  ('ZC',   'CAV ZC',   515, 347, 'STANDARD', NULL,  NULL,   NULL),
  ('ZD',   'CAV ZD',   470, 347, 'STANDARD', NULL,  '74C',  NULL),
  ('ZE',   'CAV ZE',   370, 320, 'STANDARD', 'NEC', NULL,   NULL),
  ('ZF',   'CAV ZF',   300, 285, 'STANDARD', 'JAE', NULL,   NULL),
  ('ZG',   'CAV ZG',   499, 353, 'STANDARD', NULL,  NULL,   NULL),
  ('ZH',   'CAV ZH',   385, 290, 'STANDARD', NULL,  NULL,   NULL),

-- Nhóm 74C (15 mã: 74A → 74O)
  ('74A',  'CAV 74A',  460, 330, '74C', NULL,  'ZA',  NULL),
  ('74B',  'CAV 74B',  470, 300, '74C', NULL,  'A',   NULL),
  ('74C',  'CAV 74C',  470, 347, '74C', NULL,  'ZD',  NULL),
  ('74D',  'CAV 74D',  470, 400, '74C', NULL,  NULL,  NULL),
  ('74E',  'CAV 74E',  470, 450, '74C', NULL,  NULL,  NULL),
  ('74F',  'CAV 74F',  499, 347, '74C', NULL,  'C',   NULL),
  ('74G',  'CAV 74G',  530, 380, '74C', NULL,  NULL,  NULL),
  ('74H',  'CAV 74H',  585, 285, '74C', 'JAE', NULL,  NULL),
  ('74I',  'CAV 74I',  590, 350, '74C', NULL,  NULL,  NULL),
  ('74J',  'CAV 74J',  590, 400, '74C', NULL,  NULL,  NULL),
  ('74K',  'CAV 74K',  590, 450, '74C', NULL,  NULL,  NULL),
  ('74L',  'CAV 74L',  640, 405, '74C', 'KIK', NULL,  NULL),
  ('74M',  'CAV 74M',  560, 360, '74C', 'TDK', NULL,  NULL),
  ('74N',  'CAV 74N',  620, 310, '74C', 'TE',  NULL,  NULL),
  ('74O',  'CAV 74O',  590, 300, '74C', 'DIC', NULL,  NULL),

-- Nhóm 日三化成 NICHI (5 mã)
  ('NICHI-53B',   'CAV 日三53b',    470, 300, 'NICHI', '日三化成', NULL, '53b用'),
  ('NICHI-74C-1', 'CAV 日三74C-1',  470, 300, 'NICHI', '日三化成', NULL, '74C用'),
  ('NICHI-74C-2', 'CAV 日三74C-2',  520, 370, 'NICHI', '日三化成', NULL, '74C用'),
  ('NICHI-74C-3', 'CAV 日三74C-3',  585, 310, 'NICHI', '日三化成', NULL, '74C用'),
  ('NICHI-74C-4', 'CAV 日三74C-4',  620, 310, 'NICHI', '日三化成', NULL, '74C用');

-- Bước 3: Verify
-- SELECT count(*) FROM cav_types; -- Expected: 52
-- SELECT cav_code, cav_length_mm, cav_width_mm, machine_group, cav_series, alias_cav_code FROM cav_types ORDER BY machine_group, cav_code;
