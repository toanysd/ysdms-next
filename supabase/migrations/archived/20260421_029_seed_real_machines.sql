-- ============================================================
-- MIGRATION 029: Cấu trúc Dữ Liệu Máy Móc Thực Tế Tại Xưởng YSD
-- Mô tả: Cập nhật đồng bộ các thông tin về máy định hình ILLIG, 台湾機, プレス機, CNC
-- Fix lỗi NULL master_id bằng cách auto-backfill production_log mồ côi
-- ============================================================

BEGIN;

-- 1. Insert hoặc Update Master (Bảng gốc cũ để đảm bảo không gãy luồng module trước)
INSERT INTO public.machine_master (code, name, process_type, status)
VALUES
-- Máy định hình
('5号機',  'ILLIG 5号機', 'MOLDING', 'ACTIVE'),
('6号機',  'ILLIG 6号機', 'MOLDING', 'ACTIVE'),
('7号機',  'ILLIG 7号機', 'MOLDING', 'ACTIVE'),
('8号機',  'ILLIG 8号機', 'MOLDING', 'ACTIVE'),
('9号機',  'ILLIG 9号機', 'MOLDING', 'ACTIVE'),
('台湾機', '台湾機 (Đài Loan)', 'MOLDING', 'ACTIVE'),
-- Máy dập
('プレス機１', 'Máy Dập 1', 'MOLDING', 'ACTIVE'),
('プレス機２', 'Máy Dập 2', 'MOLDING', 'ACTIVE'),
('プレス機３', 'Máy Dập 3', 'MOLDING', 'ACTIVE'),
-- Máy CNC
('CMX-800V', 'CNC CMX-800V', 'MOLDING', 'ACTIVE'),
('CMX-1100V', 'CNC CMX-1100V', 'MOLDING', 'ACTIVE'),
('DuraVertical 5080', 'CNC DuraVertical', 'MOLDING', 'ACTIVE'),
('MILLAC 700', 'CNC MILLAC 700 (Plug)', 'MOLDING', 'ACTIVE'),
('MILLAC 648V', 'CNC MILLAC 648V', 'MOLDING', 'ACTIVE')
ON CONFLICT (code) DO UPDATE SET status = 'ACTIVE';


-- 2. Tái cấu trúc phân lớp Model và Instance
DO $$
DECLARE
    v_type_thermo uuid;
    v_type_cnc uuid;
    v_type_press uuid;
    v_model_illig uuid;
    v_model_taiwan uuid;
    v_model_press uuid;
    v_model_cnc uuid;
BEGIN
    SELECT id INTO v_type_thermo FROM public.machine_type WHERE code = 'THERMOFORM';
    SELECT id INTO v_type_cnc FROM public.machine_type WHERE code = 'CNC_MILLING';
    SELECT id INTO v_type_press FROM public.machine_type WHERE code = 'PRESS';

    IF v_type_thermo IS NULL OR v_type_cnc IS NULL OR v_type_press IS NULL THEN
        RAISE EXCEPTION 'Machine types (THERMOFORM, CNC_MILLING, PRESS) are missing. Please ensure they existed before running this script.';
    END IF;

    -- Tạo Models đại diện
    INSERT INTO public.machine_model (machine_type_id, manufacturer, model_code, model_name)
    VALUES (v_type_thermo, 'ILLIG', 'ILLIG-M', 'ILLIG Molding Machine')
    ON CONFLICT (machine_type_id, model_code) DO NOTHING;
    SELECT id INTO v_model_illig FROM public.machine_model WHERE model_code = 'ILLIG-M' LIMIT 1;

    INSERT INTO public.machine_model (machine_type_id, manufacturer, model_code, model_name)
    VALUES (v_type_thermo, 'Taiwan', 'TW-M', 'Taiwan Thermoformer')
    ON CONFLICT (machine_type_id, model_code) DO NOTHING;
    SELECT id INTO v_model_taiwan FROM public.machine_model WHERE model_code = 'TW-M' LIMIT 1;

    INSERT INTO public.machine_model (machine_type_id, manufacturer, model_code, model_name)
    VALUES (v_type_press, 'N/A', 'PRESS-STD', 'Standard Press Machine')
    ON CONFLICT (machine_type_id, model_code) DO NOTHING;
    SELECT id INTO v_model_press FROM public.machine_model WHERE model_code = 'PRESS-STD' LIMIT 1;

    INSERT INTO public.machine_model (machine_type_id, manufacturer, model_code, model_name)
    VALUES (v_type_cnc, 'DMG MORI/OKUMA', 'CNC-M', 'CNC Master')
    ON CONFLICT (machine_type_id, model_code) DO NOTHING;
    SELECT id INTO v_model_cnc FROM public.machine_model WHERE model_code = 'CNC-M' LIMIT 1;

    -- Upsert Instances thực tế ghép đúng Model
    INSERT INTO public.machine_instance (machine_model_id, internal_code, name, status)
    VALUES
    (v_model_illig, '5号機', 'ILLIG 5号機', 'active'),
    (v_model_illig, '6号機', 'ILLIG 6号機', 'active'),
    (v_model_illig, '7号機', 'ILLIG 7号機', 'active'),
    (v_model_illig, '8号機', 'ILLIG 8号機', 'active'),
    (v_model_illig, '9号機', 'ILLIG 9号機', 'active'),
    (v_model_taiwan, '台湾機', '台湾機', 'active'),
    (v_model_press, 'プレス機１', 'プレス機１', 'active'),
    (v_model_press, 'プレス機２', 'プレス機２', 'active'),
    (v_model_press, 'プレス機３', 'プレス機３', 'active'),
    (v_model_cnc, 'CMX-800V', 'CMX-800V', 'active'),
    (v_model_cnc, 'CMX-1100V', 'CMX-1100V', 'active'),
    (v_model_cnc, 'DuraVertical 5080', 'DuraVertical 5080', 'active'),
    (v_model_cnc, 'MILLAC 700', 'MILLAC 700 (Plug)', 'active'),
    (v_model_cnc, 'MILLAC 648V', 'MILLAC 648V', 'active')
    ON CONFLICT (internal_code) DO UPDATE 
    SET name = EXCLUDED.name, machine_model_id = EXCLUDED.machine_model_id, status = 'active';

END $$;

-- 3. Backfill tự động: Cứu các log bị "mồ côi" do Trigger không chèn được master_id hồi nãy
UPDATE public.production_log pl
SET machine_id = mm.id
FROM public.machine_instance mi
JOIN public.machine_master mm ON mm.code = mi.internal_code
WHERE pl.machine_instance_id = mi.id
  AND pl.machine_id IS NULL;

-- 4. Ẩn bớt M08, M12 cũ để bảng TV Monitor đỡ rác (Không xóa để tránh gãy FK)
UPDATE public.machine_master
SET status = 'MAINTENANCE'
WHERE code IN ('M08', 'M12');

COMMIT;
