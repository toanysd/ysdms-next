-- ==============================================================================
-- BẢN DỰ THẢO PAYLOAD CHUẨN BỊ CHO JOB NỘI BỘ (UNEXECUTED / CHƯA CHẠY)
-- File: scripts/payload_create_job_internal_shop.sql
-- Mục tiêu: Tạo 1 Job nội bộ xưởng khuôn và 4 Steps chuẩn bị cho Pilot Nippo
-- Tình trạng: DỰ THẢO (CODE WRITTEN) - CHỜ THOAN & PE DUYỆT RIÊNG - CHƯA CHẠY
-- Ngày sửa đổi: 2026-10-06 17:05 JST (Phiên bản Fail-Closed, Khởi tạo PENDING)
-- ==============================================================================

-- ==============================================================================
-- 1. PREFLIGHT VERIFICATION QUERIES (CHỈ-ĐỌC / VERIFY TRƯỚC KHI CHẠY)
-- ==============================================================================

-- 1.1. Xác minh JOB-INTERNAL-SHOP chưa tồn tại (Kỳ vọng: 0 dòng)
SELECT count(*) AS job_code_conflict_count 
FROM public.jobs 
WHERE job_code = 'JOB-INTERNAL-SHOP';

-- 1.2. Xác minh công ty nội bộ YSD tồn tại duy nhất (Kỳ vọng: 1 dòng)
SELECT company_id, company_code, company_name 
FROM public.companies 
WHERE company_code = 'YSD';

-- 1.3. Xác minh processing_items 1, 7, 10 tồn tại duy nhất (Kỳ vọng: 3 dòng)
SELECT processing_item_id, item_name 
FROM public.processing_items 
WHERE processing_item_id IN (1, 7, 10)
ORDER BY processing_item_id;

-- 1.4. Xác minh processing_codes 40, 42, 50, 54 tồn tại trong danh mục tham chiếu Nippo (Kỳ vọng: 4 dòng)
SELECT processing_code_id, processing_name, department_code, category 
FROM public.processing_codes 
WHERE processing_code_id IN (40, 42, 50, 54)
ORDER BY processing_code_id;

-- 1.5. Xác minh processing_status_id = 1 ('0.未確認') cho trạng thái PENDING
SELECT status_id, status_code, status_name_vi 
FROM public.processing_statuses 
WHERE status_id = 1;

-- ==============================================================================
-- 2. NỘI DUNG PAYLOAD TRANSACTION FAIL-CLOSED (CHỈ CHẠY KHI CÓ QUYẾT ĐỊNH CỦA THOAN)
-- ==============================================================================

DO $$
DECLARE
    v_job_id UUID;
    v_company_id UUID;
    v_job_exists INT;
    v_company_count INT;
    v_item_count INT;
    v_status_count INT;
BEGIN
    -- [KIỂM TRA CHẶT CHẼ TRƯỚC KHI THỰC HIỆN - FAIL-CLOSED]
    -- Kiểm tra 1: Mã Job chưa tồn tại
    SELECT count(*) INTO v_job_exists FROM public.jobs WHERE job_code = 'JOB-INTERNAL-SHOP';
    IF v_job_exists > 0 THEN
        RAISE EXCEPTION 'PREFLIGHT FAILED: job_code JOB-INTERNAL-SHOP already exists! Aborting.';
    END IF;

    -- Kiểm tra 2: Công ty YSD tồn tại duy nhất
    SELECT count(*), max(company_id) INTO v_company_count, v_company_id 
    FROM public.companies 
    WHERE company_code = 'YSD';
    IF v_company_count <> 1 OR v_company_id IS NULL THEN
        RAISE EXCEPTION 'PREFLIGHT FAILED: Unique YSD company record not found (count=%)! Aborting.', v_company_count;
    END IF;

    -- Kiểm tra 3: Processing items (1, 7, 10) có đủ 3 items
    SELECT count(*) INTO v_item_count 
    FROM public.processing_items 
    WHERE processing_item_id IN (1, 7, 10);
    IF v_item_count <> 3 THEN
        RAISE EXCEPTION 'PREFLIGHT FAILED: Processing items 1, 7, 10 count mismatch (found %)! Aborting.', v_item_count;
    END IF;

    -- Kiểm tra 4: Processing status 1 (0.未確認) tồn tại
    SELECT count(*) INTO v_status_count 
    FROM public.processing_statuses 
    WHERE status_id = 1;
    IF v_status_count <> 1 THEN
        RAISE EXCEPTION 'PREFLIGHT FAILED: Processing status 1 not found! Aborting.';
    END IF;

    -- [BƯỚC 1: TẠO BẢN GHI JOB NỘI BỘ XƯỞNG KHUÔN]
    -- Ghi chú schema: jobs không có cột is_facility_job, dùng notes và job_category để nhận diện
    INSERT INTO public.jobs (
        job_code,
        job_name,
        job_category,
        job_status,
        company_id,
        processing_item_id,
        overall_progress,
        priority,
        notes,
        created_at,
        updated_at
    ) VALUES (
        'JOB-INTERNAL-SHOP',
        '社内作業・5S・保全',
        'INTERNAL_OPS',
        'PENDING',                    -- Khởi tạo ở trạng thái PENDING theo yêu cầu PE
        v_company_id,
        10,                           -- processing_item_id: 10 ('社内作業')
        0,                            -- overall_progress = 0
        5,                            -- default priority
        '社内作業・設備保全・5S・治具修理用パイロットジョブ (Internal Shop Pilot Job)',
        NOW(),
        NOW()
    ) RETURNING job_id INTO v_job_id;

    RAISE NOTICE 'SUCCESS: Created internal job JOB-INTERNAL-SHOP with ID %', v_job_id;

    -- [BƯỚC 2: TẠO 4 BƯỚC CÔNG ĐOẠN CHUẨN (JOB_STEPS)]
    -- Ghi chú schema: job_steps không có cột processing_code_id (thuộc work_logs)
    -- Sử dụng processing_item_id, processing_status_id và track đúng schema thực tế

    -- Step 1: 5S / Vệ sinh xưởng
    INSERT INTO public.job_steps (
        job_id,
        step_no,
        step_name,
        step_status,
        track,
        processing_item_id,
        processing_status_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        1,
        '5S・工場清掃',
        'PENDING',                    -- Khởi tạo PENDING theo yêu cầu PE
        'FINISH',
        10,                           -- processing_item_id: 10 ('社内作業')
        1,                            -- processing_status_id: 1 ('0.未確認')
        0,                            -- progress_percent = 0
        0,                            -- actual_hours = 0
        '[Mã công việc: 50] 工場環境整備、清掃、整理整頓 (5S & Factory Cleaning)',
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
        processing_item_id,
        processing_status_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        2,
        '設備・コンプレッサー保全',
        'PENDING',                    -- Khởi tạo PENDING theo yêu cầu PE
        'FINISH',
        10,                           -- processing_item_id: 10 ('社内作業')
        1,                            -- processing_status_id: 1 ('0.未確認')
        0,                            -- progress_percent = 0
        0,                            -- actual_hours = 0
        '[Mã công việc: 54] 機械設備点検、コンプレッサー給油、定期保全 (Equipment Maintenance)',
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
        processing_item_id,
        processing_status_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        3,
        '金型・治具修理',
        'PENDING',                    -- Khởi tạo PENDING theo yêu cầu PE
        'MOLD',
        1,                            -- processing_item_id: 1 ('金型')
        1,                            -- processing_status_id: 1 ('0.未確認')
        0,                            -- progress_percent = 0
        0,                            -- actual_hours = 0
        '[Mã công việc: 42] 金型溶接補修、プラグ手直し、治具修理 (Mold & Jig Repair)',
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
        processing_item_id,
        processing_status_id,
        progress_percent,
        actual_hours,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_job_id,
        4,
        'スタッキング木板製作',
        'PENDING',                    -- Khởi tạo PENDING theo yêu cầu PE
        'FINISH',
        7,                            -- processing_item_id: 7 ('スタッキング')
        1,                            -- processing_status_id: 1 ('0.未確認')
        0,                            -- progress_percent = 0
        0,                            -- actual_hours = 0
        '[Mã công việc: 40] スタッキング用木板加工・組み立て (Stacking Board Fabrication)',
        NOW(),
        NOW()
    );

    RAISE NOTICE 'SUCCESS: Created 4 internal steps for JOB-INTERNAL-SHOP at PENDING status.';
END $$;

-- ==============================================================================
-- 3. POSTFLIGHT VERIFICATION QUERIES (CHẠY SAU KHI INSERT ĐỂ NGHIỆM THU)
-- ==============================================================================

-- 3.1. Xác minh Job đã tạo đúng 1 bản ghi và các trường khởi tạo
SELECT 
    j.job_id,
    j.job_code,
    j.job_name,
    j.job_category,
    j.job_status,
    j.overall_progress,
    j.company_id,
    c.company_code,
    c.company_name
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.company_id
WHERE j.job_code = 'JOB-INTERNAL-SHOP';

-- 3.2. Xác minh 4 bước công đoạn đã tạo thuộc đúng Job
SELECT 
    s.step_no,
    s.step_name,
    s.step_status,
    s.track,
    s.processing_item_id,
    pi.item_name AS item_name,
    s.processing_status_id,
    ps.status_code AS status_code,
    s.progress_percent,
    s.actual_hours,
    s.notes
FROM public.job_steps s
JOIN public.jobs j ON s.job_id = j.job_id
LEFT JOIN public.processing_items pi ON s.processing_item_id = pi.processing_item_id
LEFT JOIN public.processing_statuses ps ON s.processing_status_id = ps.status_id
WHERE j.job_code = 'JOB-INTERNAL-SHOP'
ORDER BY s.step_no;

-- 3.3. Xác minh tổng hợp số lượng và trạng thái
SELECT 
    j.job_code,
    count(s.step_id) AS inserted_step_count,
    min(s.step_no) AS min_step_no,
    max(s.step_no) AS max_step_no,
    count(*) FILTER (WHERE s.step_status = 'PENDING') AS pending_steps_count,
    j.job_status,
    j.overall_progress
FROM public.jobs j
LEFT JOIN public.job_steps s ON j.job_id = s.job_id
WHERE j.job_code = 'JOB-INTERNAL-SHOP'
GROUP BY j.job_id, j.job_code, j.job_status, j.overall_progress;
