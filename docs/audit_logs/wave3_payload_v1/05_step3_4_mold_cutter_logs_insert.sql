-- ============================================================================
-- WO-MOLD-SYNC-WAVE3 (PAYLOAD V1) — STEP 3.4 (Q4): MOLDLOG (35) & CUTTERLOG (21)
-- 3.4A: +35 to mold_name_history; 3.4B: +56 (35 MODIFICATION + 21 CUTTER_MAINTENANCE) to equipment_history
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_mname_pre INTEGER;
    v_ehist_pre INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_mname_pre FROM public.mold_name_history;
    SELECT COUNT(*) INTO v_ehist_pre FROM public.equipment_history;
    IF v_mname_pre <> 0 OR v_ehist_pre <> 1488 THEN
        RAISE EXCEPTION 'STEP3_4_PREFLIGHT_MISMATCH: mold_name_history=%, equipment_history=%', v_mname_pre, v_ehist_pre;
    END IF;

    -- 3.4A: Insert 35 valid tblMoldLog rows into mold_name_history
    INSERT INTO public.mold_name_history (
        history_id, physical_mold_id, old_system_code, new_system_code,
        old_physical_stamp, new_physical_stamp, change_reason, changed_by, changed_at
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'physical_mold_id')::uuid,
        s.payload_json->>'old_system_code',
        s.payload_json->>'new_system_code',
        s.payload_json->>'old_physical_stamp',
        s.payload_json->>'new_physical_stamp',
        s.payload_json->>'change_reason',
        s.payload_json->>'changed_by',
        (s.payload_json->>'changed_at')::timestamptz
    FROM public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1'
      AND s.step_code = '3.4A_MOLDNAME_HIST_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 35 THEN
        RAISE EXCEPTION 'STEP3_4A_ROW_COUNT_MISMATCH: expected 35, got %', v_rc;
    END IF;

    -- 3.4B: Insert 56 rows (35 MODIFICATION + 21 CUTTER_MAINTENANCE) into equipment_history
    INSERT INTO public.equipment_history (
        history_id, equipment_id, action_type, action_date, description
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'equipment_id')::uuid,
        s.payload_json->>'action_type',
        (s.payload_json->>'action_date')::date,
        s.payload_json->>'description'
    FROM public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1'
      AND s.step_code = '3.4B_EQHIST_MOLD_CUTTER';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 56 THEN
        RAISE EXCEPTION 'STEP3_4B_ROW_COUNT_MISMATCH: expected 56, got %', v_rc;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & issues GO
