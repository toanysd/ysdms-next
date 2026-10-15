-- ============================================================================
-- WO-MOLD-SYNC-WAVE1 (PAYLOAD V2) — DETERMINISTIC ROLLBACK PLAN BY legacy_id & target_pk
-- Reverse FK Order: 1.5 -> 1.4 -> 1.3 -> 1.2C -> 1.2B -> 1.2A -> 1.1 -> 1.0
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
BEGIN
    -- R1. Delete 1,337 equipment_assignments
    DELETE FROM public.equipment_assignments ea
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.5_ASSIGN_INSERT'
      AND ea.assignment_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1337 THEN RAISE EXCEPTION 'ROLLBACK_1_5_MISMATCH: %', v_rc; END IF;

    -- R2. Revert 226 keeper_company_id updates
    UPDATE public.equipment e
    SET keeper_company_id = NULL
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.4_KEEPER_BACKFILL'
      AND e.equipment_id = s.target_pk AND e.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 226 THEN RAISE EXCEPTION 'ROLLBACK_1_4_MISMATCH: %', v_rc; END IF;

    -- R3. Delete 28 new equipment rows (24 molds + 4 cutters)
    DELETE FROM public.equipment e
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code IN ('1.3A_MOLD_INSERT', '1.3B_CUTTER_INSERT')
      AND e.equipment_id = s.target_pk AND e.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 28 THEN RAISE EXCEPTION 'ROLLBACK_1_3_MISMATCH: %', v_rc; END IF;

    -- R4. Delete 88 new design_revisions
    DELETE FROM public.design_revisions d
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.2C_DESIGN_INSERT'
      AND d.revision_id = s.target_pk AND d.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 88 THEN RAISE EXCEPTION 'ROLLBACK_1_2C_MISMATCH: %', v_rc; END IF;

    -- R5. Delete 54 new products
    DELETE FROM public.products p
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.2B_PRODUCT_INSERT'
      AND p.product_id = s.target_pk AND p.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 54 THEN RAISE EXCEPTION 'ROLLBACK_1_2B_MISMATCH: %', v_rc; END IF;

    -- R6. Restore 70 DESIGN-<id> prefixes on design_revisions
    UPDATE public.design_revisions d
    SET legacy_id = s.payload_json->>'old_legacy_id'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.2A_DESIGN_PREFIX'
      AND d.revision_id = s.target_pk AND d.legacy_id = s.payload_json->>'new_legacy_id';
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 70 THEN RAISE EXCEPTION 'ROLLBACK_1_2A_MISMATCH: %', v_rc; END IF;

    -- R7. Delete 20 new rack_layers
    DELETE FROM public.rack_layers rl
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.1_RACK_LAYER_INSERT'
      AND rl.id = s.target_pk AND rl.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 20 THEN RAISE EXCEPTION 'ROLLBACK_1_1_MISMATCH: %', v_rc; END IF;

    -- R8. Delete 1 new company (CUST-444 COB)
    DELETE FROM public.companies c
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.0_COMPANY_INSERT'
      AND c.company_id = s.target_pk AND c.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1 THEN RAISE EXCEPTION 'ROLLBACK_1_0_MISMATCH: %', v_rc; END IF;
END $$;

ROLLBACK;
