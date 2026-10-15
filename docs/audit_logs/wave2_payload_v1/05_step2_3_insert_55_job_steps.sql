-- ============================================================================
-- WO-MOLD-SYNC-WAVE2 (PAYLOAD V1) — STEP 2.3: INSERT 55 VALID MISSING JOB_STEPS
-- Source: tblProcessingDeadline (4219..4279); 20 orphan Access steps skipped
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_step_pre INTEGER;
    v_step_dup INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_step_pre FROM public.job_steps;
    IF v_step_pre <> 2457 THEN
        RAISE EXCEPTION 'STEP2_3_PREFLIGHT_MISMATCH: job_steps=%', v_step_pre;
    END IF;

    INSERT INTO public.job_steps (
        step_id, job_id, step_no, item_type_id, processing_status_id,
        step_name, step_status, deadline, drawing_receipt_date,
        notes, quantity, legacy_id, legacy_specs
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'job_id')::uuid,
        (s.payload_json->>'step_no')::integer,
        (s.payload_json->>'item_type_id')::integer,
        (s.payload_json->>'processing_status_id')::integer,
        s.payload_json->>'step_name',
        s.payload_json->>'step_status',
        (s.payload_json->>'deadline')::date,
        (s.payload_json->>'drawing_receipt_date')::date,
        s.payload_json->>'notes',
        (s.payload_json->>'quantity')::integer,
        s.legacy_id,
        s.payload_json->'legacy_specs'
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.3_STEP_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 55 THEN
        RAISE EXCEPTION 'STEP2_3_ROW_COUNT_MISMATCH: expected 55, got %', v_rc;
    END IF;

    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_step_dup FROM public.job_steps WHERE legacy_id IS NOT NULL;
    IF v_step_dup <> 0 THEN
        RAISE EXCEPTION 'STEP2_3_DUPLICATE_LEGACY_ID: step_dup=%', v_step_dup;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & THOAN commands GO
