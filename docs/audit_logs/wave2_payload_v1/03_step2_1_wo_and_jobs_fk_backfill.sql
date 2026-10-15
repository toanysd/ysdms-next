-- ============================================================================
-- WO-MOLD-SYNC-WAVE2 (PAYLOAD V1) — STEP 2.1: BACKFILL FK ON 1,202 WORK_ORDERS & 1,202 JOBS
-- Unlocks v_work_order_equipment_set across all legacy mold work orders
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_wo_pre INTEGER;
    v_job_pre INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_wo_pre FROM public.work_orders;
    SELECT COUNT(*) INTO v_job_pre FROM public.jobs;
    IF v_wo_pre <> 1203 OR v_job_pre <> 1205 THEN
        RAISE EXCEPTION 'STEP2_1_PREFLIGHT_MISMATCH: work_orders=%, jobs=%', v_wo_pre, v_job_pre;
    END IF;

    -- 2.1A: Backfill design_revision_id, product_id, company_id on 1,202 work_orders
    UPDATE public.work_orders w
    SET design_revision_id = COALESCE(w.design_revision_id, (s.payload_json->>'new_design_revision_id')::uuid),
        product_id = COALESCE(w.product_id, (s.payload_json->>'new_product_id')::uuid),
        company_id = COALESCE(w.company_id, (s.payload_json->>'new_company_id')::uuid)
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1'
      AND s.step_code = '2.1A_WO_FK_BACKFILL'
      AND w.wo_id = s.target_pk
      AND w.legacy_id = s.legacy_id;

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1202 THEN
        RAISE EXCEPTION 'STEP2_1A_ROW_COUNT_MISMATCH: expected 1202, got %', v_rc;
    END IF;

    -- 2.1B: Backfill design_revision_id, product_id, company_id, equipment_id on 1,202 jobs
    UPDATE public.jobs j
    SET design_revision_id = COALESCE(j.design_revision_id, (s.payload_json->>'new_design_revision_id')::uuid),
        product_id = COALESCE(j.product_id, (s.payload_json->>'new_product_id')::uuid),
        company_id = COALESCE(j.company_id, (s.payload_json->>'new_company_id')::uuid),
        equipment_id = COALESCE(j.equipment_id, (s.payload_json->>'new_equipment_id')::uuid)
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1'
      AND s.step_code = '2.1B_JOB_FK_BACKFILL'
      AND j.job_id = s.target_pk
      AND j.legacy_id = s.legacy_id;

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1202 THEN
        RAISE EXCEPTION 'STEP2_1B_ROW_COUNT_MISMATCH: expected 1202, got %', v_rc;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & THOAN commands GO
