-- ============================================================================
-- WO-MOLD-SYNC-WAVE2 (PAYLOAD V1) — STEP 2.0: BACKFILL 67 M-* EQUIPMENT design_revision_id
-- Per PE Decision 1B: ONLY update design_revision_id where NULL; 0 changes to company_id
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_eq_pre INTEGER;
    v_comp_pre INTEGER;
    v_comp_post INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_eq_pre FROM public.equipment;
    SELECT COUNT(*) INTO v_comp_pre FROM public.equipment WHERE company_id IS NOT NULL;
    IF v_eq_pre <> 6525 THEN
        RAISE EXCEPTION 'STEP2_0_PREFLIGHT_MISMATCH: equipment=%', v_eq_pre;
    END IF;

    UPDATE public.equipment e
    SET design_revision_id = (s.payload_json->>'new_design_revision_id')::uuid
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1'
      AND s.step_code = '2.0_EQUIPMENT_DREV_BACKFILL'
      AND e.equipment_id = s.target_pk
      AND e.legacy_id = s.legacy_id
      AND e.design_revision_id IS NULL;

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 67 THEN
        RAISE EXCEPTION 'STEP2_0_ROW_COUNT_MISMATCH: expected 67, got %', v_rc;
    END IF;

    -- Guard Decision 1B: equipment.company_id count must remain 100% unchanged
    SELECT COUNT(*) INTO v_comp_post FROM public.equipment WHERE company_id IS NOT NULL;
    IF v_comp_post <> v_comp_pre THEN
        RAISE EXCEPTION 'STEP2_0_COMPANY_ID_MUTATION_FORBIDDEN: pre=%, post=%', v_comp_pre, v_comp_post;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & THOAN commands GO
