-- ============================================================================
-- WO-MOLD-SYNC-WAVE2 (PAYLOAD V1) — DETERMINISTIC ROLLBACK PLAN BY legacy_id & target_pk
-- Reverse FK Order: 2.4 -> 2.3 -> 2.2B -> 2.2A -> 2.1B -> 2.1A -> 2.0
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
BEGIN
    -- R1. Delete 205 inserted work_logs
    DELETE FROM public.work_logs wl
    USING public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.4_WORKLOG_INSERT'
      AND wl.log_id = s.target_pk AND wl.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 205 THEN RAISE EXCEPTION 'ROLLBACK_2_4_MISMATCH: %', v_rc; END IF;

    -- R2. Delete 55 inserted job_steps
    DELETE FROM public.job_steps js
    USING public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.3_STEP_INSERT'
      AND js.step_id = s.target_pk AND js.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 55 THEN RAISE EXCEPTION 'ROLLBACK_2_3_MISMATCH: %', v_rc; END IF;

    -- R3. Delete 27 inserted jobs
    DELETE FROM public.jobs j
    USING public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.2B_JOB_INSERT'
      AND j.job_id = s.target_pk AND j.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 27 THEN RAISE EXCEPTION 'ROLLBACK_2_2B_MISMATCH: %', v_rc; END IF;

    -- R4. Delete 27 inserted work_orders
    DELETE FROM public.work_orders w
    USING public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.2A_WO_INSERT'
      AND w.wo_id = s.target_pk AND w.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 27 THEN RAISE EXCEPTION 'ROLLBACK_2_2A_MISMATCH: %', v_rc; END IF;

    -- R5. Restore 1,202 updated jobs to exact pre-Wave2 FK values
    UPDATE public.jobs j
    SET design_revision_id = (s.payload_json->>'old_design_revision_id')::uuid,
        product_id = (s.payload_json->>'old_product_id')::uuid,
        company_id = (s.payload_json->>'old_company_id')::uuid,
        equipment_id = (s.payload_json->>'old_equipment_id')::uuid
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.1B_JOB_FK_BACKFILL'
      AND j.job_id = s.target_pk AND j.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1202 THEN RAISE EXCEPTION 'ROLLBACK_2_1B_MISMATCH: %', v_rc; END IF;

    -- R6. Restore 1,202 updated work_orders to exact pre-Wave2 FK values
    UPDATE public.work_orders w
    SET design_revision_id = (s.payload_json->>'old_design_revision_id')::uuid,
        product_id = (s.payload_json->>'old_product_id')::uuid,
        company_id = (s.payload_json->>'old_company_id')::uuid
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.1A_WO_FK_BACKFILL'
      AND w.wo_id = s.target_pk AND w.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1202 THEN RAISE EXCEPTION 'ROLLBACK_2_1A_MISMATCH: %', v_rc; END IF;

    -- R7. Restore 67 updated equipment rows to design_revision_id = NULL
    UPDATE public.equipment e
    SET design_revision_id = NULL
    FROM public.staging_mold_sync_wave2 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE2-V1' AND s.step_code = '2.0_EQUIPMENT_DREV_BACKFILL'
      AND e.equipment_id = s.target_pk AND e.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 67 THEN RAISE EXCEPTION 'ROLLBACK_2_0_MISMATCH: %', v_rc; END IF;
END $$;

ROLLBACK;
