-- ============================================================================
-- WO-MOLD-SYNC-WAVE2 (PAYLOAD V1) — STEP 2.2: INSERT 27 MISSING WORK_ORDERS & 27 JOBS
-- Source: tblJOB (JobID 1251..1278; 27/27 resolved design_revision_id & equipment_id)
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_wo_dup INTEGER;
    v_job_dup INTEGER;
BEGIN
    -- 2.2A: Insert 27 missing work_orders
    INSERT INTO public.work_orders (
        wo_id, wo_code, wo_name, product_id, design_revision_id, company_id,
        wo_type, wo_status, start_date, deadline, responsible_id, priority, legacy_id, legacy_specs
    )
    SELECT
        s.target_pk,
        s.payload_json->>'wo_code',
        s.payload_json->>'wo_name',
        (s.payload_json->>'product_id')::uuid,
        (s.payload_json->>'design_revision_id')::uuid,
        (s.payload_json->>'company_id')::uuid,
        s.payload_json->>'wo_type',
        s.payload_json->>'wo_status',
        (s.payload_json->>'start_date')::timestamptz,
        (s.payload_json->>'deadline')::timestamptz,
        (s.payload_json->>'responsible_id')::uuid,
        (s.payload_json->>'priority')::integer,
        s.legacy_id,
        s.payload_json->'legacy_specs'
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.2A_WO_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 27 THEN
        RAISE EXCEPTION 'STEP2_2A_ROW_COUNT_MISMATCH: expected 27, got %', v_rc;
    END IF;

    -- 2.2B: Insert 27 missing jobs
    INSERT INTO public.jobs (
        job_id, job_code, job_name, work_order_id, equipment_id, design_revision_id,
        product_id, company_id, responsible_id, processing_item_id, start_date, deadline,
        job_status, job_category, approved, priority, year_period, month_period,
        quantity, release_type, separate_cutter, unit_price, notes, legacy_id, legacy_specs
    )
    SELECT
        s.target_pk,
        s.payload_json->>'job_code',
        s.payload_json->>'job_name',
        (s.payload_json->>'work_order_id')::uuid,
        (s.payload_json->>'equipment_id')::uuid,
        (s.payload_json->>'design_revision_id')::uuid,
        (s.payload_json->>'product_id')::uuid,
        (s.payload_json->>'company_id')::uuid,
        (s.payload_json->>'responsible_id')::uuid,
        (s.payload_json->>'processing_item_id')::integer,
        (s.payload_json->>'start_date')::timestamptz,
        (s.payload_json->>'deadline')::timestamptz,
        s.payload_json->>'job_status',
        s.payload_json->>'job_category',
        (s.payload_json->>'approved')::boolean,
        (s.payload_json->>'priority')::integer,
        (s.payload_json->>'year_period')::integer,
        (s.payload_json->>'month_period')::integer,
        (s.payload_json->>'quantity')::integer,
        s.payload_json->>'release_type',
        (s.payload_json->>'separate_cutter')::boolean,
        (s.payload_json->>'unit_price')::numeric,
        s.payload_json->>'notes',
        s.legacy_id,
        s.payload_json->'legacy_specs'
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.2B_JOB_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 27 THEN
        RAISE EXCEPTION 'STEP2_2B_ROW_COUNT_MISMATCH: expected 27, got %', v_rc;
    END IF;

    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_wo_dup FROM public.work_orders WHERE legacy_id IS NOT NULL;
    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_job_dup FROM public.jobs WHERE legacy_id IS NOT NULL;
    IF v_wo_dup <> 0 OR v_job_dup <> 0 THEN
        RAISE EXCEPTION 'STEP2_2_DUPLICATE_LEGACY_ID: wo_dup=%, job_dup=%', v_wo_dup, v_job_dup;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & THOAN commands GO
