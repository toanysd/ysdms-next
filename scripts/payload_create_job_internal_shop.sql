-- ==============================================================================
-- PAYLOAD CHUẨN BỊ CHO JOB NỘI BỘ XƯỞNG KHUÔN (UNEXECUTED / CHƯA CHẠY)
-- File: scripts/payload_create_job_internal_shop.sql
-- Mục tiêu: Tạo Job nội bộ và 4 Steps phục vụ ghi nhận công việc 5S/Bảo trì/Sửa chữa
-- Tình trạng: DỰ THẢO - CHỜ PE & MINH CHỦ THOAN DUYỆT - TUYỆT ĐỐI CHƯA CHẠY
-- Ngày lập: 2026-10-06 16:40 JST
-- ==============================================================================

-- [PREFLIGHT CHECK CHỈ-ĐỌC TRƯỚC KHI THỰC HIỆN]
-- 1. Kiểm tra mã JOB-INTERNAL-SHOP đã tồn tại hay chưa (Kỳ vọng: 0 dòng)
SELECT job_id, job_code, job_name, job_status 
FROM public.jobs 
WHERE job_code = 'JOB-INTERNAL-SHOP';

-- 2. Kiểm tra các mã processing_code_id thực tế (Kỳ vọng: 40, 42, 50, 54 đều có thật)
SELECT processing_code_id, processing_name, department_code, category 
FROM public.processing_codes 
WHERE processing_code_id IN (40, 42, 50, 54)
ORDER BY processing_code_id;

-- 3. Kiểm tra processing_item_id thực tế (Kỳ vọng: 1, 7, 10)
SELECT processing_item_id, item_name 
FROM public.processing_items 
WHERE processing_item_id IN (1, 7, 10)
ORDER BY processing_item_id;

-- ==============================================================================
-- NỘI DUNG PAYLOAD (CHỈ THỰC THI KHI CÓ QUYẾT ĐỊNH CHÍNH THỨC CỦA THOAN & PE)
-- ==============================================================================

DO $$
DECLARE
    v_job_id UUID;
    v_company_id UUID;
    v_count INT;
BEGIN
    -- Kiểm tra an toàn: nếu Job đã tồn tại thì dừng ngay lập tức
    SELECT count(*) INTO v_count FROM public.jobs WHERE job_code = 'JOB-INTERNAL-SHOP';
    IF v_count > 0 THEN
        RAISE EXCEPTION 'Job code JOB-INTERNAL-SHOP already exists! Aborting.';
    END IF;

    -- Lấy ID công ty nội bộ YSD ((株)ヨシダ成形)
    SELECT company_id INTO v_company_id 
    FROM public.companies 
    WHERE company_code = 'YSD' 
    LIMIT 1;

    -- 1. Tạo Job xưởng nội bộ
    INSERT INTO public.jobs (
        job_code,
        job_name,
        job_category,
        job_status,
        company_id,
        is_facility_job,
        overall_progress,
        notes,
        created_at,
        updated_at
    ) VALUES (
        'JOB-INTERNAL-SHOP',
        '社内作業・5S・保全',
        'INTERNAL_OPS',
        'IN_PROGRESS',
        v_company_id,
        TRUE,
        0,
        '社内作業・設備保全・5S・治具修理用パイロットジョブ (Internal Shop Pilot Job)',
        NOW(),
        NOW()
    ) RETURNING job_id INTO v_job_id;

    RAISE NOTICE 'Created Job JOB-INTERNAL-SHOP with ID: %', v_job_id;

    -- 2. Tạo 4 bước công đoạn chuẩn (job_steps)
    -- Step 1: 5S / Vệ sinh xưởng
    INSERT INTO public.job_steps (
        job_id,
        step_no,
        step_name,
        step_status,
        track,
        processing_code_id,
        processing_item_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        1,
        '5S・工場清掃',
        'IN_PROGRESS',
        'FINISH',
        50,  -- processing_codes: '5S' (GENERAL)
        10,  -- processing_items: '社内作業'
        0,
        0,
        '工場環境整備、清掃、整理整頓 (5S & Factory Cleaning)',
        NOW(),
        NOW()
    );

    -- Step 2: Bảo trì máy móc & thiết bị
    INSERT INTO public.job_steps (
        job_id,
        step_no,
        step_name,
        step_status,
        track,
        processing_code_id,
        processing_item_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        2,
        '設備・コンプレッサー保全',
        'IN_PROGRESS',
        'FINISH',
        54,  -- processing_codes: 'メンテナンス' (MOLD_SHOP)
        10,  -- processing_items: '社内作業'
        0,
        0,
        '機械設備点検、コンプレッサー給油、定期保全 (Equipment Maintenance)',
        NOW(),
        NOW()
    );

    -- Step 3: Sửa khuôn / Đồ gá
    INSERT INTO public.job_steps (
        job_id,
        step_no,
        step_name,
        step_status,
        track,
        processing_code_id,
        processing_item_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        3,
        '金型・治具修理',
        'IN_PROGRESS',
        'MOLD',
        42,  -- processing_codes: '金型・プラグ・ベース修理、穴あけなど' (MOLD_SHOP)
        1,   -- processing_items: '金型'
        0,
        0,
        '金型溶接補修、プラグ手直し、治具修理 (Mold & Jig Repair)',
        NOW(),
        NOW()
    );

    -- Step 4: Gia công ván gỗ Stacking
    INSERT INTO public.job_steps (
        job_id,
        step_no,
        step_name,
        step_status,
        track,
        processing_code_id,
        processing_item_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        4,
        'スタッキング木板製作',
        'IN_PROGRESS',
        'FINISH',
        40,  -- processing_codes: 'スタッキング木板製作' (MOLD_SHOP)
        7,   -- processing_items: 'スタッキング'
        0,
        0,
        'スタッキング用木板加工・組み立て (Stacking Board Fabrication)',
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Successfully created 4 internal steps for JOB-INTERNAL-SHOP.';
END $$;

-- [POST-VERIFICATION QUERY CHỈ-ĐỌC]
-- SELECT j.job_code, j.job_name, j.job_status, s.step_no, s.step_name, s.processing_code_id, pc.processing_name
-- FROM public.jobs j
-- JOIN public.job_steps s ON j.job_id = s.job_id
-- LEFT JOIN public.processing_codes pc ON s.processing_code_id = pc.processing_code_id
-- WHERE j.job_code = 'JOB-INTERNAL-SHOP'
-- ORDER BY s.step_no;
