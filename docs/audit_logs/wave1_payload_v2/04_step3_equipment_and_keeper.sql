-- ============================================================================
-- WO-MOLD-SYNC-WAVE1 (PAYLOAD V2) — STEP 3: EQUIPMENT (+24 MOLD, +4 CUTTER) & KEEPER (226)
-- Note: 4 cutters use standard '-2' suffix on equipment_code, keeping legacy_id='C-<id>'
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_eq_pre INTEGER;
    v_eq_dup INTEGER;
    v_keeper_post INTEGER;
BEGIN
    -- 1. Preflight Check
    SELECT COUNT(*) INTO v_eq_pre FROM public.equipment;
    IF v_eq_pre <> 6497 THEN
        RAISE EXCEPTION 'STEP3_PREFLIGHT_MISMATCH: equipment=%', v_eq_pre;
    END IF;

    -- 2. Step 1.3A: Insert 24 new molds (M-5904..M-5929; M-5927 COB001 -> CUST-444)
    INSERT INTO public.equipment (
        equipment_id, equipment_code, display_name, equipment_type,
        design_revision_id, company_id, keeper_company_id, current_rack_layer_id,
        actual_length_mm, actual_width_mm, actual_height_mm, actual_weight,
        entry_date, notes, legacy_id
    )
    SELECT
        s.target_pk,
        s.payload_json->>'equipment_code',
        s.payload_json->>'display_name',
        s.payload_json->>'equipment_type',
        (s.payload_json->>'design_revision_id')::uuid,
        (s.payload_json->>'company_id')::uuid,
        (s.payload_json->>'keeper_company_id')::uuid,
        (s.payload_json->>'current_rack_layer_id')::uuid,
        s.payload_json->>'actual_length_mm',
        s.payload_json->>'actual_width_mm',
        s.payload_json->>'actual_height_mm',
        s.payload_json->>'actual_weight',
        (s.payload_json->>'entry_date')::date,
        s.payload_json->>'notes',
        s.legacy_id
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.3A_MOLD_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 24 THEN
        RAISE EXCEPTION 'STEP_1_3A_ROW_COUNT_MISMATCH: expected 24, got %', v_rc;
    END IF;

    -- 3. Step 1.3B: Insert 4 new cutters (C-3148..C-3154 with '-2' suffix on equipment_code)
    INSERT INTO public.equipment (
        equipment_id, equipment_code, display_name, equipment_type,
        keeper_company_id, current_rack_layer_id,
        actual_length_mm, actual_width_mm, actual_height_mm,
        entry_date, notes, legacy_id
    )
    SELECT
        s.target_pk,
        s.payload_json->>'equipment_code',
        s.payload_json->>'display_name',
        'CUTTER_SEPARATE',
        (s.payload_json->>'keeper_company_id')::uuid,
        (s.payload_json->>'current_rack_layer_id')::uuid,
        s.payload_json->>'actual_length_mm',
        s.payload_json->>'actual_width_mm',
        s.payload_json->>'actual_height_mm',
        (s.payload_json->>'entry_date')::date,
        s.payload_json->>'notes',
        s.legacy_id
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.3B_CUTTER_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 4 THEN
        RAISE EXCEPTION 'STEP_1_3B_ROW_COUNT_MISMATCH: expected 4, got %', v_rc;
    END IF;

    -- 4. Step 1.4: Strict keeper_company_id backfill (225 molds + 1 cutter = 226 rows via COMP-*)
    UPDATE public.equipment e
    SET keeper_company_id = (s.payload_json->>'keeper_company_id')::uuid
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2'
      AND s.step_code = '1.4_KEEPER_BACKFILL'
      AND e.equipment_id = s.target_pk
      AND e.legacy_id = s.legacy_id
      AND e.keeper_company_id IS NULL;

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 226 THEN
        RAISE EXCEPTION 'STEP_1_4_ROW_COUNT_MISMATCH: expected 226, got %', v_rc;
    END IF;

    -- 5. Postflight & legacy_id Uniqueness Guard
    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_eq_dup FROM public.equipment WHERE legacy_id IS NOT NULL;
    SELECT COUNT(*) INTO v_keeper_post FROM public.equipment WHERE keeper_company_id IS NOT NULL;
    IF v_eq_dup <> 0 OR v_keeper_post <> 227 THEN
        RAISE EXCEPTION 'STEP3_POSTFLIGHT_FAILED: eq_dup=%, keeper_post=% (expected 227)', v_eq_dup, v_keeper_post;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload v2
