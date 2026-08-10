-- Migration: Cập nhật tên đầy đủ cho các khách hàng chính (CUSTOMER)
-- Bối cảnh: Dữ liệu import từ hệ thống cũ (Access) chỉ có mã viết tắt 3 ký tự
--           làm company_name. Cần cập nhật lại tên tiếng Nhật đầy đủ.
-- Nguồn: Thông tin từ file Excel đơn hàng, email thực tế, và hệ thống cũ.
-- ⚠️ CHỈ UPDATE các khách hàng mà chúng ta BIẾT CHẮC tên đầy đủ.
--     Các khách hàng khác sẽ được cập nhật thủ công qua giao diện.

-- Iriso Electronics (IRI)
UPDATE companies 
SET company_name = 'Iriso Electronics (イリソ電子工業)',
    company_name_romaji = 'Iriso Electronics Co., Ltd.'
WHERE company_code = 'IRI' 
  AND (company_name = 'IRI' OR company_name = 'Iriso Electronics (イリソ電子工業)')
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'IRI');

-- JAE Electronics (JAE)
UPDATE companies 
SET company_name = 'JAE Electronics (日本航空電子工業)',
    company_name_romaji = 'Japan Aviation Electronics Industry, Ltd.'
WHERE company_code = 'JAE' 
  AND (company_name = 'JAE' OR company_name ILIKE '%JAE%')
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'JAE');

-- SMK (SMK)
UPDATE companies 
SET company_name = 'SMK (エスエムケイ)',
    company_name_romaji = 'SMK Corporation'
WHERE company_code = 'SMK' 
  AND company_name = 'SMK'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'SMK');

-- UGM (ウグム)
UPDATE companies 
SET company_name = 'UGM (ウグム)',
    company_name_romaji = 'UGM Co., Ltd.'
WHERE company_code = 'UGM' 
  AND company_name = 'UGM'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'UGM');

-- MNM (ミネベアミツミ)
UPDATE companies 
SET company_name = 'MinebeaMitsumi (ミネベアミツミ)',
    company_name_romaji = 'MinebeaMitsumi Inc.'
WHERE company_code = 'MNM' 
  AND company_name = 'MNM'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'MNM');

-- ADY (アドバンテスト)  
UPDATE companies 
SET company_name = 'Advantest (アドバンテスト)',
    company_name_romaji = 'Advantest Corporation'
WHERE company_code = 'ADY' 
  AND company_name = 'ADY'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'ADY');

-- YMH (ヤマハ)
UPDATE companies 
SET company_name = 'Yamaha (ヤマハ)',
    company_name_romaji = 'Yamaha Corporation'
WHERE company_code = 'YMH' 
  AND company_name = 'YMH'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'YMH');

-- HRS (ヒロセ電機)
UPDATE companies 
SET company_name = 'Hirose Electric (ヒロセ電機)',
    company_name_romaji = 'Hirose Electric Co., Ltd.'
WHERE company_code = 'HRS' 
  AND company_name = 'HRS'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'HRS');

-- TYC (タイコ エレクトロニクス)
UPDATE companies 
SET company_name = 'TE Connectivity (タイコ エレクトロニクス)',
    company_name_romaji = 'TE Connectivity Japan G.K.'
WHERE company_code = 'TYC' 
  AND company_name = 'TYC'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'TYC');

-- MOL (モレックス)
UPDATE companies 
SET company_name = 'Molex (モレックス)',
    company_name_romaji = 'Molex Japan Co., Ltd.'
WHERE company_code = 'MOL' 
  AND company_name = 'MOL'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'MOL');

-- AMP (アンフェノール)
UPDATE companies 
SET company_name = 'Amphenol (アンフェノール)',
    company_name_romaji = 'Amphenol Japan Ltd.'
WHERE company_code = 'AMP' 
  AND company_name = 'AMP'
  AND EXISTS (SELECT 1 FROM companies WHERE company_code = 'AMP');
