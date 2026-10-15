-- ============================================================================
-- WO-MOLD-SYNC-WAVE1 (PAYLOAD V2) — STEP 4: EQUIPMENT_ASSIGNMENTS (+1,337)
-- Breakdown: 265 SET_MEMBER + 1,072 SHARED from tblMoldCutter
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_ea_pre INTEGER;
    v_ea_post INTEGER;
    v_orders INTEGER;
    v_order_lines INTEGER;
    v_work_logs INTEGER;
    v_eq_hist INTEGER;
BEGIN
    -- 1. Preflight Check
    SELECT COUNT(*) INTO v_ea_pre FROM public.equipment_assignments;
    IF v_ea_pre <> 1633 THEN
        RAISE EXCEPTION 'STEP4_PREFLIGHT_MISMATCH: equipment_assignments=%', v_ea_pre;
    END IF;

    -- 2. Step 1.5: Insert 1,337 equipment_assignments
    INSERT INTO public.equipment_assignments (
        assignment_id, primary_equipment_id, related_equipment_id,
        relationship_type, is_default, notes
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'primary_equipment_id')::uuid,
        (s.payload_json->>'related_equipment_id')::uuid,
        s.payload_json->>'relationship_type',
        true,
        'SYNC_WAVE1_TBLMOLDCUTTER'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.5_ASSIGN_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1337 THEN
        RAISE EXCEPTION 'STEP_1_5_ROW_COUNT_MISMATCH: expected 1337, got %', v_rc;
    END IF;

    -- 3. Postflight & Forbidden Table Invariant Check
    SELECT COUNT(*) INTO v_ea_post FROM public.equipment_assignments;
    SELECT COUNT(*) INTO v_orders FROM public.orders;
    SELECT COUNT(*) INTO v_order_lines FROM public.order_lines;
    SELECT COUNT(*) INTO v_work_logs FROM public.work_logs;
    SELECT COUNT(*) INTO v_eq_hist FROM public.equipment_history;

    IF v_ea_post <> 2970 OR v_orders <> 2396 OR v_order_lines <> 6279 OR v_work_logs <> 7111 OR v_eq_hist <> 0 THEN
        RAISE EXCEPTION 'STEP4_POSTFLIGHT_FAILED: ea=%, orders=%, lines=%, logs=%, hist=%',
            v_ea_post, v_orders, v_order_lines, v_work_logs, v_eq_hist;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload v2
