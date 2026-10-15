-- ============================================================================
-- WO-MOLD-SYNC-WAVE2 (PAYLOAD V1) — STEP 2.4: INSERT 205 VALID STEP-LINKED WORK_LOGS
-- Per PE Decision 2A: 94 NULL-step work_logs excluded (recorded in EXCLUDED_LEGACY_WORK_LOGS)
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_wl_pre INTEGER;
    v_wl_post INTEGER;
    v_wl_dup INTEGER;
    v_orders INTEGER;
    v_order_lines INTEGER;
    v_eq_hist INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_wl_pre FROM public.work_logs;
    IF v_wl_pre <> 7111 THEN
        RAISE EXCEPTION 'STEP2_4_PREFLIGHT_MISMATCH: work_logs=%', v_wl_pre;
    END IF;

    INSERT INTO public.work_logs (
        log_id, job_step_id, job_id, employee_id, work_date,
        hours_spent, quantity_done, quantity_ng, is_finished,
        processing_code_id, contact_content, notes, legacy_id, legacy_specs
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'job_step_id')::uuid,
        (s.payload_json->>'job_id')::uuid,
        (s.payload_json->>'employee_id')::uuid,
        (s.payload_json->>'work_date')::date,
        (s.payload_json->>'hours_spent')::numeric,
        (s.payload_json->>'quantity_done')::integer,
        (s.payload_json->>'quantity_ng')::integer,
        (s.payload_json->>'is_finished')::boolean,
        (s.payload_json->>'processing_code_id')::integer,
        s.payload_json->>'contact_content',
        s.payload_json->>'notes',
        s.legacy_id,
        s.payload_json->'legacy_specs'
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.4_WORKLOG_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 205 THEN
        RAISE EXCEPTION 'STEP2_4_ROW_COUNT_MISMATCH: expected 205, got %', v_rc;
    END IF;

    SELECT COUNT(*) INTO v_wl_post FROM public.work_logs;
    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_wl_dup FROM public.work_logs WHERE legacy_id IS NOT NULL;
    SELECT COUNT(*) INTO v_orders FROM public.orders;
    SELECT COUNT(*) INTO v_order_lines FROM public.order_lines;
    SELECT COUNT(*) INTO v_eq_hist FROM public.equipment_history;

    IF v_wl_post <> 7316 OR v_wl_dup <> 0 OR v_orders <> 2396 OR v_order_lines <> 6279 OR v_eq_hist <> 0 THEN
        RAISE EXCEPTION 'STEP2_4_POSTFLIGHT_FAILED: wl=%, dup=%, orders=%, lines=%, hist=%',
            v_wl_post, v_wl_dup, v_orders, v_order_lines, v_eq_hist;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & THOAN commands GO
