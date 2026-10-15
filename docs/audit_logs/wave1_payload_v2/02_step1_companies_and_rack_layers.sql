-- ============================================================================
-- WO-MOLD-SYNC-WAVE1 (PAYLOAD V2) — STEP 1: COMPANIES (+1 COB) & RACK_LAYERS (+20)
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_comp_pre INTEGER;
    v_rl_pre INTEGER;
    v_comp_dup INTEGER;
    v_rl_dup INTEGER;
BEGIN
    -- 1. Preflight Check
    SELECT COUNT(*) INTO v_comp_pre FROM public.companies;
    SELECT COUNT(*) INTO v_rl_pre FROM public.rack_layers;
    IF v_comp_pre <> 2214 OR v_rl_pre <> 380 THEN
        RAISE EXCEPTION 'STEP1_PREFLIGHT_MISMATCH: companies=%, rack_layers=%', v_comp_pre, v_rl_pre;
    END IF;

    -- 2. Step 1.0: Insert 1 missing customer COB (CustomerID=444 -> legacy_id='CUST-444')
    INSERT INTO public.companies (
        company_id, company_code, company_name, company_type, is_active, legacy_id, notes
    )
    SELECT
        s.target_pk,
        s.payload_json->>'company_code',
        s.payload_json->>'company_name',
        ARRAY['CUSTOMER']::text[],
        true,
        s.legacy_id,
        s.payload_json->>'notes'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.0_COMPANY_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1 THEN
        RAISE EXCEPTION 'STEP_1_0_ROW_COUNT_MISMATCH: expected 1 (CUST-444 COB), got %', v_rc;
    END IF;

    -- 3. Step 1.1: Insert 20 missing rack_layers (legacy_id 11..1001)
    INSERT INTO public.rack_layers (id, rack_id, layer_number, layer_code, legacy_id, notes)
    SELECT
        s.target_pk,
        (s.payload_json->>'rack_id')::uuid,
        (s.payload_json->>'layer_number')::integer,
        s.payload_json->>'layer_code',
        s.legacy_id,
        s.payload_json->>'notes'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1-V2' AND s.step_code = '1.1_RACK_LAYER_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 20 THEN
        RAISE EXCEPTION 'STEP_1_1_ROW_COUNT_MISMATCH: expected 20, got %', v_rc;
    END IF;

    -- 4. Postflight & legacy_id Uniqueness Guard
    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_comp_dup FROM public.companies WHERE legacy_id IS NOT NULL;
    SELECT COUNT(*) - COUNT(DISTINCT legacy_id) INTO v_rl_dup FROM public.rack_layers WHERE legacy_id IS NOT NULL;
    IF v_comp_dup <> 0 OR v_rl_dup <> 0 THEN
        RAISE EXCEPTION 'STEP1_LEGACY_ID_DUPLICATE: comp_dup=%, rl_dup=%', v_comp_dup, v_rl_dup;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload v2
