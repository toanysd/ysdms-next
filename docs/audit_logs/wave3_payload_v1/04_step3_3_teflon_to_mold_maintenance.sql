-- ============================================================================
-- WO-MOLD-SYNC-WAVE3 (PAYLOAD V1) — STEP 3.3 (Q3): 190 TEFLON LOGS -> MOLD_MAINTENANCE
-- Only 190 rows with SentDate IS NOT NULL; excludes 78 pending & 4,424 empty rows
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_maint_pre INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_maint_pre FROM public.mold_maintenance;
    IF v_maint_pre <> 0 THEN
        RAISE EXCEPTION 'STEP3_3_PREFLIGHT_MISMATCH: mold_maintenance=%', v_maint_pre;
    END IF;

    INSERT INTO public.mold_maintenance (
        maintenance_id, physical_mold_id, maintenance_type,
        request_date, completed_date, vendor_id, employee_id,
        reason, result, cost, status, notes
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'physical_mold_id')::uuid,
        s.payload_json->>'maintenance_type',
        (s.payload_json->>'request_date')::timestamptz,
        (s.payload_json->>'completed_date')::timestamptz,
        (s.payload_json->>'vendor_id')::uuid,
        (s.payload_json->>'employee_id')::uuid,
        s.payload_json->>'reason',
        s.payload_json->>'result',
        (s.payload_json->>'cost')::numeric,
        s.payload_json->>'status',
        s.payload_json->>'notes'
    FROM public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1'
      AND s.step_code = '3.3_TEFLON_MAINT_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 190 THEN
        RAISE EXCEPTION 'STEP3_3_ROW_COUNT_MISMATCH: expected 190, got %', v_rc;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & issues GO
