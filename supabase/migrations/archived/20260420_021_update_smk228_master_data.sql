-- 20260420_021_update_smk228_master_data.sql

-- Bổ sung thông số Mẫu theo đúng bảng Excel thực tế để giao diện Lệnh Sản Xuất Preview có thể hiển thị
UPDATE product_master
SET material = 'PP(N)',
    thickness = 0.60,
    length_val = 365,
    width_val = 245
WHERE code = 'SMK-228';
