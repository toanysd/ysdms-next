-- ============================================================================
-- OFFICIAL INSERT PAYLOAD: B1 ACCESS DELTA (6 STEPS & 5 WORK LOGS)
-- Target: public.job_steps & public.work_logs
-- Source: public.staging_access_delta_b1
-- Policy: Fail-Closed Transaction with Deep Preflight & Row Count Assertions
-- Note: Mặc định an toàn kết thúc bằng ROLLBACK; Chỉ chuyển COMMIT khi có phê duyệt
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PREFLIGHT ASSERTIONS (FAIL-CLOSED)
-- ============================================================================
DO $$
DECLARE
    -- Baseline counts
    v_jobs_count INT;
    v_steps_count INT;
    v_logs_count INT;
    v_staging_steps INT;
    v_staging_logs INT;
    
    -- Conflict & Idempotency counts
    v_step_legacy_conflicts INT;
    v_log_legacy_conflicts INT;
    v_step_no_conflicts INT;
    v_staging_source_duplicates INT;
    
    -- Relational resolution counts
    v_resolved_step_joins INT;
    v_active_employees INT;
    v_active_processing_codes INT;
BEGIN
    -- 1.1 Baseline assertion
    SELECT count(*) INTO v_jobs_count FROM public.jobs;
    SELECT count(*) INTO v_steps_count FROM public.job_steps;
    SELECT count(*) INTO v_logs_count FROM public.work_logs;
    SELECT count(*) INTO v_staging_steps FROM public.staging_access_delta_b1 WHERE entity_type = 'STEP';
    SELECT count(*) INTO v_staging_logs FROM public.staging_access_delta_b1 WHERE entity_type = 'WORK_LOG';

    IF v_jobs_count <> 1205 OR v_steps_count <> 2451 OR v_logs_count <> 7106 THEN
        RAISE EXCEPTION 'Preflight Failed: Production baseline mismatch (jobs=%, steps=%, logs=%)',
            v_jobs_count, v_steps_count, v_logs_count;
    END IF;

    IF v_staging_steps <> 6 OR v_staging_logs <> 5 THEN
        RAISE EXCEPTION 'Preflight Failed: Staging B1 row mismatch (steps=%, logs=%)',
            v_staging_steps, v_staging_logs;
    END IF;

    -- 1.2 Idempotency: Target legacy_id collision check
    SELECT count(*) INTO v_step_legacy_conflicts
    FROM public.job_steps
    WHERE legacy_id IN (
        SELECT legacy_id FROM public.staging_access_delta_b1 WHERE entity_type = 'STEP'
    );
    IF v_step_legacy_conflicts > 0 THEN
        RAISE EXCEPTION 'Preflight Failed: % Step legacy_ids already exist in public.job_steps', v_step_legacy_conflicts;
    END IF;

    SELECT count(*) INTO v_log_legacy_conflicts
    FROM public.work_logs
    WHERE legacy_id IN (
        SELECT legacy_id FROM public.staging_access_delta_b1 WHERE entity_type = 'WORK_LOG'
    );
    IF v_log_legacy_conflicts > 0 THEN
        RAISE EXCEPTION 'Preflight Failed: % Work Log legacy_ids already exist in public.work_logs', v_log_legacy_conflicts;
    END IF;

    -- 1.3 Target unique key (job_id, step_no) collision check
    SELECT count(*) INTO v_step_no_conflicts
    FROM public.job_steps js
    JOIN public.staging_access_delta_b1 s 
      ON s.entity_type = 'STEP' 
     AND s.target_job_id = js.job_id 
     AND s.step_no = js.step_no;
    IF v_step_no_conflicts > 0 THEN
        RAISE EXCEPTION 'Preflight Failed: % (job_id, step_no) unique conflicts detected in public.job_steps', v_step_no_conflicts;
    END IF;

    -- 1.4 Source duplicate check in staging
    SELECT count(*) INTO v_staging_source_duplicates
    FROM (
        SELECT source_table, source_primary_key 
        FROM public.staging_access_delta_b1 
        GROUP BY source_table, source_primary_key 
        HAVING count(*) > 1
    ) sub;
    IF v_staging_source_duplicates > 0 THEN
        RAISE EXCEPTION 'Preflight Failed: % duplicate source keys in staging_access_delta_b1', v_staging_source_duplicates;
    END IF;

    -- 1.5 Resolved step join for Work Logs check
    -- Every work log must map to a valid step in staging
    SELECT count(*) INTO v_resolved_step_joins
    FROM public.staging_access_delta_b1 l
    JOIN public.staging_access_delta_b1 s 
      ON s.entity_type = 'STEP' 
     AND s.legacy_id = (l.payload->>'target_step_legacy_id')
    WHERE l.entity_type = 'WORK_LOG';
    IF v_resolved_step_joins <> 5 THEN
        RAISE EXCEPTION 'Preflight Failed: Only % of 5 work logs resolved target step in staging', v_resolved_step_joins;
    END IF;

    -- 1.6 Employees existence and is_active check
    SELECT count(DISTINCT e.employee_id) INTO v_active_employees
    FROM public.staging_access_delta_b1 l
    JOIN public.employees e 
      ON e.employee_id = l.employee_id 
     AND e.is_active = true
    WHERE l.entity_type = 'WORK_LOG';
    IF v_active_employees <> 2 THEN
        RAISE EXCEPTION 'Preflight Failed: Expected 2 active employees, found %', v_active_employees;
    END IF;

    -- 1.7 Processing codes existence and is_active check
    SELECT count(DISTINCT pc.processing_code_id) INTO v_active_processing_codes
    FROM public.staging_access_delta_b1 l
    JOIN public.processing_codes pc 
      ON pc.processing_code_id = l.processing_code_id 
     AND pc.is_active = true
    WHERE l.entity_type = 'WORK_LOG';
    IF v_active_processing_codes <> 4 THEN
        RAISE EXCEPTION 'Preflight Failed: Expected 4 active processing codes, found %', v_active_processing_codes;
    END IF;

    RAISE NOTICE 'Preflight Validation Passed: All 7 checks verified successfully.';
END $$;

-- ============================================================================
-- 2. INSERT 6 STEPS & ASSERT ACTUAL INSERTED ROW COUNT
-- ============================================================================
DO $$
DECLARE
    v_inserted_steps INT;
BEGIN
    INSERT INTO public.job_steps (
        step_id,
        job_id,
        step_no,
        step_name,
        processing_status_id,
        step_status,
        deadline,
        notes,
        legacy_id,
        legacy_specs
    )
    SELECT 
        COALESCE(s.target_candidate_id, gen_random_uuid()) AS step_id,
        s.target_job_id AS job_id,
        s.step_no,
        s.step_name,
        s.processing_status_id,
        s.step_status,
        s.deadline,
        s.notes,
        s.legacy_id,
        jsonb_build_object(
            'source_table', s.source_table,
            'source_primary_key', s.source_primary_key,
            'source_row_hash', s.source_row_hash,
            'source_file_sha256', s.source_file_sha256
        ) AS legacy_specs
    FROM public.staging_access_delta_b1 s
    WHERE s.entity_type = 'STEP'
    ORDER BY s.source_primary_key;

    GET DIAGNOSTICS v_inserted_steps = ROW_COUNT;
    IF v_inserted_steps <> 6 THEN
        RAISE EXCEPTION 'Insert Failed: Expected 6 steps inserted, actual row count: %', v_inserted_steps;
    END IF;
    RAISE NOTICE 'Step Insert Succeeded: % rows inserted into public.job_steps.', v_inserted_steps;
END $$;

-- ============================================================================
-- 3. INSERT 5 WORK LOGS & ASSERT ACTUAL INSERTED ROW COUNT
-- ============================================================================
DO $$
DECLARE
    v_inserted_logs INT;
BEGIN
    INSERT INTO public.work_logs (
        log_id,
        job_id,
        job_step_id,
        employee_id,
        company_id,
        work_date,
        hours_spent,
        processing_code_id,
        is_finished,
        quantity_ng,
        notes,
        legacy_id,
        legacy_specs
    )
    SELECT 
        gen_random_uuid() AS log_id,
        s.target_job_id AS job_id,
        js.step_id AS job_step_id,
        s.employee_id,
        NULL AS company_id,
        s.work_date::date AS work_date,
        s.hours_spent,
        s.processing_code_id,
        s.is_finished,
        0 AS quantity_ng,
        s.notes,
        s.legacy_id,
        jsonb_build_object(
            'source_table', s.source_table,
            'source_primary_key', s.source_primary_key,
            'source_row_hash', s.source_row_hash,
            'source_file_sha256', s.source_file_sha256
        ) AS legacy_specs
    FROM public.staging_access_delta_b1 s
    JOIN public.job_steps js 
      ON js.legacy_id = (s.payload->>'target_step_legacy_id')
    WHERE s.entity_type = 'WORK_LOG'
    ORDER BY s.source_primary_key;

    GET DIAGNOSTICS v_inserted_logs = ROW_COUNT;
    IF v_inserted_logs <> 5 THEN
        RAISE EXCEPTION 'Insert Failed: Expected 5 work logs inserted, actual row count: %', v_inserted_logs;
    END IF;
    RAISE NOTICE 'Work Log Insert Succeeded: % rows inserted into public.work_logs.', v_inserted_logs;
END $$;

-- ============================================================================
-- 4. POSTFLIGHT ASSERTIONS
-- ============================================================================
DO $$
DECLARE
    v_jobs_after INT;
    v_steps_after INT;
    v_logs_after INT;
    v_pending_steps_maintained INT;
BEGIN
    SELECT count(*) INTO v_jobs_after FROM public.jobs;
    SELECT count(*) INTO v_steps_after FROM public.job_steps;
    SELECT count(*) INTO v_logs_after FROM public.work_logs;

    IF v_jobs_after <> 1205 THEN
        RAISE EXCEPTION 'Postflight Failed: jobs count changed (expected 1205, got %)', v_jobs_after;
    END IF;
    IF v_steps_after <> 2457 THEN
        RAISE EXCEPTION 'Postflight Failed: steps count mismatch (expected 2457, got %)', v_steps_after;
    END IF;
    IF v_logs_after <> 7111 THEN
        RAISE EXCEPTION 'Postflight Failed: logs count mismatch (expected 7111, got %)', v_logs_after;
    END IF;

    -- Verify trigger side effects on active steps
    SELECT count(*) INTO v_pending_steps_maintained
    FROM public.job_steps
    WHERE legacy_id IN ('LEGACY-STEP-4226', 'LEGACY-STEP-4275')
      AND processing_status_id = 9;
    IF v_pending_steps_maintained <> 2 THEN
        RAISE EXCEPTION 'Postflight Failed: Trigger trg_update_step_status_from_worklogs did not maintain processing_status_id=9 (expected 2, got %)', v_pending_steps_maintained;
    END IF;

    RAISE NOTICE 'Postflight Validation Passed: All counts and trigger side effects verified.';
END $$;

-- ============================================================================
-- 5. TRANSACTION CONTROL
-- ============================================================================
-- CHẾ ĐỘ THẨM ĐỊNH DRY-RUN: MẶC ĐỊNH LUÔN LÀ ROLLBACK
-- CHỈ ĐỔI THÀNH COMMIT KHI CÓ QUYẾT ĐỊNH PHÊ DUYỆT BẰNG VĂN BẢN TỪ MINH CHỦ THOAN
ROLLBACK;
-- COMMIT;
