-- ============================================================================
-- WO-MOLD-SYNC-WAVE3 (PAYLOAD V1) — STEP 3.5 (Q5 / 5A): 352 STATUSLOGS -> STATUS_LOGS & EQUIPMENT_HISTORY
-- Excludes 46 Status IS NULL rows into EXCLUDED_STATUSLOGS (no fake AUDIT status)
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_stat_pre INTEGER;
    v_ehist_pre INTEGER;
    v_ehist_post INTEGER;
    v_stat_dup INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_stat_pre FROM public.equipment_status_logs;
    SELECT COUNT(*) INTO v_ehist_pre FROM public.equipment_history;
    IF v_stat_pre <> 0 OR v_ehist_pre <> 1544 THEN
        RAISE EXCEPTION 'STEP3_5_PREFLIGHT_MISMATCH: equipment_status_logs=%, equipment_history=%', v_stat_pre, v_ehist_pre;
    END IF;

    -- 3.5A: Insert 352 valid rows into equipment_status_logs
    INSERT INTO public.equipment_status_logs (
        status_log_id, equipment_id, status, action_date, employee_id,
        destination_id, to_location, notes, legacy_mold_id, legacy_cutter_id, legacy_status_log_id
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'equipment_id')::uuid,
        s.payload_json->>'status',
        (s.payload_json->>'action_date')::timestamptz,
        (s.payload_json->>'employee_id')::uuid,
        (s.payload_json->>'destination_id')::uuid,
        s.payload_json->>'to_location',
        s.payload_json->>'notes',
        (s.payload_json->>'legacy_mold_id')::integer,
        (s.payload_json->>'legacy_cutter_id')::integer,
        (s.payload_json->>'legacy_status_log_id')::integer
    FROM public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1'
      AND s.step_code = '3.5A_STATUSLOG_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 352 THEN
        RAISE EXCEPTION 'STEP3_5A_ROW_COUNT_MISMATCH: expected 352, got %', v_rc;
    END IF;

    -- 3.5B: Insert 352 status events into equipment_history
    INSERT INTO public.equipment_history (
        history_id, equipment_id, action_type, action_date, to_location, performed_by, description
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'equipment_id')::uuid,
        s.payload_json->>'action_type',
        (s.payload_json->>'action_date')::date,
        s.payload_json->>'to_location',
        (s.payload_json->>'performed_by')::uuid,
        s.payload_json->>'description'
    FROM public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1'
      AND s.step_code = '3.5B_EQHIST_STATUS';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 352 THEN
        RAISE EXCEPTION 'STEP3_5B_ROW_COUNT_MISMATCH: expected 352, got %', v_rc;
    END IF;

    SELECT COUNT(*) INTO v_ehist_post FROM public.equipment_history;
    SELECT COUNT(*) - COUNT(DISTINCT legacy_status_log_id) INTO v_stat_dup
    FROM public.equipment_status_logs WHERE legacy_status_log_id IS NOT NULL;
    IF v_ehist_post <> 1896 OR v_stat_dup <> 0 THEN
        RAISE EXCEPTION 'STEP3_5_POSTFLIGHT_FAILED: equipment_history=%, stat_dup=%', v_ehist_post, v_stat_dup;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & issues GO
