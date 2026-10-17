-- ============================================================================
-- WO-MOLD-SYNC-WAVE3 (PAYLOAD V1) — DETERMINISTIC ROLLBACK PLAN BY target_pk
-- Reverse Order: 3.5B -> 3.5A -> 3.4B -> 3.4A -> 3.3 -> 3.2 -> 3.1
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
BEGIN
    -- R1. Delete 352 status rows from equipment_history (3.5B)
    DELETE FROM public.equipment_history eh
    USING public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1' AND s.step_code = '3.5B_EQHIST_STATUS'
      AND eh.history_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 352 THEN RAISE EXCEPTION 'ROLLBACK_3_5B_MISMATCH: %', v_rc; END IF;

    -- R2. Delete 352 rows from equipment_status_logs (3.5A)
    DELETE FROM public.equipment_status_logs esl
    USING public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1' AND s.step_code = '3.5A_STATUSLOG_INSERT'
      AND esl.status_log_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 352 THEN RAISE EXCEPTION 'ROLLBACK_3_5A_MISMATCH: %', v_rc; END IF;

    -- R3. Delete 56 mold/cutter rows from equipment_history (3.4B)
    DELETE FROM public.equipment_history eh
    USING public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1' AND s.step_code = '3.4B_EQHIST_MOLD_CUTTER'
      AND eh.history_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 56 THEN RAISE EXCEPTION 'ROLLBACK_3_4B_MISMATCH: %', v_rc; END IF;

    -- R4. Delete 35 rows from mold_name_history (3.4A)
    DELETE FROM public.mold_name_history mnh
    USING public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1' AND s.step_code = '3.4A_MOLDNAME_HIST_INSERT'
      AND mnh.history_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 35 THEN RAISE EXCEPTION 'ROLLBACK_3_4A_MISMATCH: %', v_rc; END IF;

    -- R5. Delete 190 rows from mold_maintenance (3.3)
    DELETE FROM public.mold_maintenance mm
    USING public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1' AND s.step_code = '3.3_TEFLON_MAINT_INSERT'
      AND mm.maintenance_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 190 THEN RAISE EXCEPTION 'ROLLBACK_3_3_MISMATCH: %', v_rc; END IF;

    -- R6. Delete 356 rows from equipment_ship_logs (3.2)
    DELETE FROM public.equipment_ship_logs esl
    USING public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1' AND s.step_code = '3.2_SHIPLOG_INSERT'
      AND esl.ship_log_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 356 THEN RAISE EXCEPTION 'ROLLBACK_3_2_MISMATCH: %', v_rc; END IF;

    -- R7. Delete 1,488 location rows from equipment_history (3.1)
    DELETE FROM public.equipment_history eh
    USING public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1' AND s.step_code = '3.1_EQHIST_LOCATION'
      AND eh.history_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1488 THEN RAISE EXCEPTION 'ROLLBACK_3_1_MISMATCH: %', v_rc; END IF;
END $$;

ROLLBACK;
