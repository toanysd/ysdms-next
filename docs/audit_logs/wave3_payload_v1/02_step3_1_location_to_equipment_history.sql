-- ============================================================================
-- WO-MOLD-SYNC-WAVE3 (PAYLOAD V1) — STEP 3.1 (Q1): 1,488 LOCATION LOGS -> EQUIPMENT_HISTORY
-- LocationLogID=1356 (Orphan RackLayerID=840) -> to_location=NULL + note; 0 changes to asset_location_logs
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_hist_pre INTEGER;
    v_aloc_pre INTEGER;
    v_aloc_post INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_hist_pre FROM public.equipment_history;
    SELECT COUNT(*) INTO v_aloc_pre FROM public.asset_location_logs;
    IF v_hist_pre <> 0 OR v_aloc_pre <> 1450 THEN
        RAISE EXCEPTION 'STEP3_1_PREFLIGHT_MISMATCH: equipment_history=%, asset_location_logs=%', v_hist_pre, v_aloc_pre;
    END IF;

    INSERT INTO public.equipment_history (
        history_id, equipment_id, action_type, action_date,
        from_location, to_location, performed_by, description
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'equipment_id')::uuid,
        s.payload_json->>'action_type',
        (s.payload_json->>'action_date')::date,
        s.payload_json->>'from_location',
        s.payload_json->>'to_location',
        (s.payload_json->>'performed_by')::uuid,
        s.payload_json->>'description'
    FROM public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1'
      AND s.step_code = '3.1_EQHIST_LOCATION';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1488 THEN
        RAISE EXCEPTION 'STEP3_1_ROW_COUNT_MISMATCH: expected 1488, got %', v_rc;
    END IF;

    -- Guard Q1: asset_location_logs must remain untouched at 1,450
    SELECT COUNT(*) INTO v_aloc_post FROM public.asset_location_logs;
    IF v_aloc_post <> 1450 THEN
        RAISE EXCEPTION 'STEP3_1_ASSET_LOCATION_LOGS_MUTATION_FORBIDDEN: %', v_aloc_post;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & issues GO
