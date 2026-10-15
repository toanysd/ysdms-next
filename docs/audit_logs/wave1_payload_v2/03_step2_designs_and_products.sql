-- ============================================================================
-- WO-MOLD-SYNC-WAVE1 (PAYLOAD V2) — STEP 2: DESIGN PREFIX (70), PRODUCTS (+54), DESIGNS (+88)
-- Note: Product TRAY-5387 (COB001) & Design D-4942 link directly to CUST-444 (COB)
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_prod_pre INTEGER;
    v_des_pre INTEGER;
    v_prod_dup INTEGER;
    v_des_dup INTEGER;
    v_des_prefix_rem INTEGER;
BEGIN
    -- 1. Preflight Check
    SELECT COUNT(*) INTO v_prod_pre FROM public.products;
    SELECT COUNT(*) INTO v_des_pre FROM public.design_revisions;
    IF v_prod_pre <> 8489 OR v_des_pre <> 4693 THEN
        RAISE EXCEPTION 'STEP2_PREFLIGHT_MISMATCH: products=%, design_revisions=%', v_prod_pre, v_des_pre;
    END IF;

    -- 2. Step 1.2A: Normalize 70 design_revisions legacy_id from DESIGN-<id> to D-<id>
    UPDATE public.design_revisions d
    SET legacy_id = s.payload_json->>'new_legacy_id'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2'
      AND s.step_code = '1.2A_DESIGN_PREFIX'
      AND d.revision_id = s.target_pk
      AND d.legacy_id = s.payload_json->>'old_legacy_id';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 70 THEN
        RAISE EXCEPTION 'STEP_1_2A_ROW_COUNT_MISMATCH: expected 70, got %', v_rc;
    END IF;

    -- 3. Step 1.2B: Insert 54 new products (22 TRAY-* + 32 P-MD-*, COB001 -> CUST-444)
    INSERT INTO public.products (
        product_id, product_code, product_name, product_name_internal,
        company_id, product_status, product_lifecycle_status, legacy_id
    )
    SELECT
        s.target_pk,
        s.payload_json->>'product_code',
        s.payload_json->>'product_name',
        s.payload_json->>'product_name_internal',
        (s.payload_json->>'company_id')::uuid,
        'ACTIVE',
        'MASS_PRODUCTION',
        s.legacy_id
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.2B_PRODUCT_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 54 THEN
        RAISE EXCEPTION 'STEP_1_2B_ROW_COUNT_MISMATCH: expected 54, got %', v_rc;
    END IF;

    -- 4. Step 1.2C: Insert 88 truly new design_revisions (D-*, COB001 -> CUST-444)
    INSERT INTO public.design_revisions (
        revision_id, design_code, tray_info, product_id, company_id,
        design_length, design_width, design_height, design_depth, design_weight,
        pocket_numbers, cavity_count, cavity_pitch_mm,
        cutline_length, cutline_width, corner_r, chamfer_c,
        plastic_type_designed, status, revision_number, legacy_id
    )
    SELECT
        s.target_pk,
        s.payload_json->>'design_code',
        s.payload_json->>'tray_info',
        (s.payload_json->>'product_id')::uuid,
        (s.payload_json->>'company_id')::uuid,
        (s.payload_json->>'design_length')::numeric,
        (s.payload_json->>'design_width')::numeric,
        (s.payload_json->>'design_height')::numeric,
        (s.payload_json->>'design_depth')::numeric,
        s.payload_json->>'design_weight',
        (s.payload_json->>'pocket_numbers')::integer,
        (s.payload_json->>'cavity_count')::integer,
        (s.payload_json->>'cavity_pitch_mm')::numeric,
        (s.payload_json->>'cutline_length')::numeric,
        (s.payload_json->>'cutline_width')::numeric,
        s.payload_json->>'corner_r',
        s.payload_json->>'chamfer_c',
        s.payload_json->>'plastic_type_designed',
        'APPROVED',
        0,
        s.legacy_id
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.2C_DESIGN_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 88 THEN
        RAISE EXCEPTION 'STEP_1_2C_ROW_COUNT_MISMATCH: expected 88, got %', v_rc;
    END IF;

    -- 5. Postflight & legacy_id Uniqueness Guard
    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_prod_dup FROM public.products WHERE legacy_id IS NOT NULL;
    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_des_dup FROM public.design_revisions WHERE legacy_id IS NOT NULL;
    SELECT COUNT(*) INTO v_des_prefix_rem FROM public.design_revisions WHERE legacy_id LIKE 'DESIGN-%';
    IF v_prod_dup <> 0 OR v_des_dup <> 0 OR v_des_prefix_rem <> 0 THEN
        RAISE EXCEPTION 'STEP2_POSTFLIGHT_FAILED: prod_dup=%, des_dup=%, rem_DESIGN_prefix=%', v_prod_dup, v_des_dup, v_des_prefix_rem;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload v2
