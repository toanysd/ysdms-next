-- ============================================================================
-- OFFICIAL INSERT PAYLOAD: B1 ACCESS DELTA (6 STEPS & 5 WORK LOGS)
-- Target: public.job_steps & public.work_logs
-- Source: public.staging_access_delta_b1
-- Policy: Fail-Closed Transaction (Chỉ thực thi khi có lệnh phê duyệt của THOAN)
-- ============================================================================

BEGIN;

-- 1. Preflight assertion inside transaction
DO $$
DECLARE
    v_jobs_count INT;
    v_steps_count INT;
    v_logs_count INT;
    v_staging_steps INT;
    v_staging_logs INT;
BEGIN
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
END $$;

-- 2. Insert 6 Steps from Staging into public.job_steps
-- Note: Assign explicit UUID or use gen_random_uuid(), mapping legacy_id
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

-- 3. Insert 5 Work Logs from Staging into public.work_logs
-- Foreign key job_step_id is mapped dynamically via job_steps.legacy_id
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

-- 4. Postflight assertion inside transaction
DO $$
DECLARE
    v_jobs_after INT;
    v_steps_after INT;
    v_logs_after INT;
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
END $$;

-- 5. Final decision: COMMIT (when authorized) or ROLLBACK (for dry-run)
-- CHỈ UNCOMMENT 'COMMIT;' KHI MINH CHỦ THOAN RA LỆNH THỰC THI CHÍNH THỨC
ROLLBACK;
-- COMMIT;
