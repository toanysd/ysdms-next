-- ============================================================================
-- WORK ORDER: WO-MOLD-SYNC-WAVE1 (GATE 1 PAYLOAD — DO NOT EXECUTE WITHOUT PE APPROVAL)
-- Verified via PostgreSQL BEGIN ... ROLLBACK Dry-Run at: 2026-10-15 02:22:52.364305+00
-- Full row-level mapping dataset: docs/audit_logs/2026-10-15_WO-MOLD-SYNC-WAVE1-GATE1.json
-- ============================================================================

-- ============================================================================
-- PART 1: MIGRATION A — STAGING TABLE WITH STRICT RLS (service_role WRITE ONLY)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.staging_mold_sync_wave1 (
    staging_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code TEXT NOT NULL DEFAULT 'WO-MOLD-SYNC-WAVE1',
    step_code TEXT NOT NULL CHECK (step_code IN (
        '1.1_RACK_LAYER_INSERT',
        '1.2A_DESIGN_PREFIX',
        '1.2B_PRODUCT_INSERT',
        '1.2C_DESIGN_INSERT',
        '1.3A_MOLD_INSERT',
        '1.3B_CUTTER_INSERT',
        '1.4_KEEPER_BACKFILL',
        '1.5_ASSIGN_INSERT'
    )),
    source_table TEXT NOT NULL,
    legacy_id TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_pk UUID NOT NULL,
    payload_json JSONB NOT NULL,
    applied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (batch_code, step_code, legacy_id)
);

ALTER TABLE public.staging_mold_sync_wave1 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staging_mold_sync_wave1_service_role_all" ON public.staging_mold_sync_wave1;
CREATE POLICY "staging_mold_sync_wave1_service_role_all"
    ON public.staging_mold_sync_wave1
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "staging_mold_sync_wave1_authenticated_read" ON public.staging_mold_sync_wave1;
CREATE POLICY "staging_mold_sync_wave1_authenticated_read"
    ON public.staging_mold_sync_wave1
    FOR SELECT
    TO authenticated
    USING (true);

-- ============================================================================
-- PART 2: TRANSACTIONAL DRY-RUN / EXECUTION BLOCK WITH STRICT ROW_COUNT GUARDS
-- Note: For dry-run, wrap in BEGIN; ... ROLLBACK;
--       For Cổng 2 execution (after PE approval), wrap in BEGIN; ... COMMIT;
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_orders INTEGER;
    v_order_lines INTEGER;
    v_work_logs INTEGER;
    v_eq_hist INTEGER;
BEGIN
    -- 0. Preflight Invariant Guard (Forbidden tables must remain untouched)
    SELECT COUNT(*) INTO v_orders FROM public.orders;
    SELECT COUNT(*) INTO v_order_lines FROM public.order_lines;
    SELECT COUNT(*) INTO v_work_logs FROM public.work_logs;
    SELECT COUNT(*) INTO v_eq_hist FROM public.equipment_history;

    IF v_orders <> 2396 OR v_order_lines <> 6279 OR v_work_logs <> 7111 OR v_eq_hist <> 0 THEN
        RAISE EXCEPTION 'PREFLIGHT_INVARIANT_FAILED: orders=%, order_lines=%, work_logs=%, equipment_history=%',
            v_orders, v_order_lines, v_work_logs, v_eq_hist;
    END IF;

    -- 1.1 Insert 20 missing rack_layers
    INSERT INTO public.rack_layers (id, rack_id, layer_number, layer_code, legacy_id, notes)
    SELECT
        s.target_pk,
        (s.payload_json->>'rack_id')::uuid,
        (s.payload_json->>'layer_number')::integer,
        s.payload_json->>'layer_code',
        s.legacy_id,
        s.payload_json->>'notes'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1' AND s.step_code = '1.1_RACK_LAYER_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 20 THEN
        RAISE EXCEPTION 'STEP_1_1_ROW_COUNT_MISMATCH: expected 20, got %', v_rc;
    END IF;

    -- 1.2A Normalize 70 design_revisions legacy_id from DESIGN-<id> to D-<id>
    UPDATE public.design_revisions d
    SET legacy_id = s.payload_json->>'new_legacy_id'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.2A_DESIGN_PREFIX'
      AND d.revision_id = s.target_pk
      AND d.legacy_id = s.payload_json->>'old_legacy_id';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 70 THEN
        RAISE EXCEPTION 'STEP_1_2A_ROW_COUNT_MISMATCH: expected 70, got %', v_rc;
    END IF;

    -- 1.2B Insert 54 new products for unlinked design_revisions
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
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1' AND s.step_code = '1.2B_PRODUCT_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 54 THEN
        RAISE EXCEPTION 'STEP_1_2B_ROW_COUNT_MISMATCH: expected 54, got %', v_rc;
    END IF;

    -- 1.2C Insert 88 truly new design_revisions
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
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1' AND s.step_code = '1.2C_DESIGN_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 88 THEN
        RAISE EXCEPTION 'STEP_1_2C_ROW_COUNT_MISMATCH: expected 88, got %', v_rc;
    END IF;

    -- 1.3A Insert 24 new molds (23 MOLD, 1 WATER_BASE)
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
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1' AND s.step_code = '1.3A_MOLD_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 24 THEN
        RAISE EXCEPTION 'STEP_1_3A_ROW_COUNT_MISMATCH: expected 24, got %', v_rc;
    END IF;

    -- 1.3B Insert 4 new cutters (CUTTER_SEPARATE with '-2' suffix on equipment_code)
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
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1' AND s.step_code = '1.3B_CUTTER_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 4 THEN
        RAISE EXCEPTION 'STEP_1_3B_ROW_COUNT_MISMATCH: expected 4, got %', v_rc;
    END IF;

    -- 1.4 Strict keeper_company_id backfill (ONLY COMP-<id> exact matches: 225 molds + 1 cutter = 226)
    UPDATE public.equipment e
    SET keeper_company_id = (s.payload_json->>'keeper_company_id')::uuid
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.4_KEEPER_BACKFILL'
      AND e.equipment_id = s.target_pk
      AND e.legacy_id = s.legacy_id
      AND e.keeper_company_id IS NULL;

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 226 THEN
        RAISE EXCEPTION 'STEP_1_4_ROW_COUNT_MISMATCH: expected 226, got %', v_rc;
    END IF;

    -- 1.5 Insert 1,337 equipment_assignments from tblMoldCutter (265 SET_MEMBER + 1,072 SHARED)
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
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1' AND s.step_code = '1.5_ASSIGN_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1337 THEN
        RAISE EXCEPTION 'STEP_1_5_ROW_COUNT_MISMATCH: expected 1337, got %', v_rc;
    END IF;
END $$;

ROLLBACK;

-- ============================================================================
-- PART 3: EXACT DETERMINISTIC ROLLBACK PLAN BY legacy_id / target_pk
-- (Reverse FK order, strict ROW_COUNT guards, zero broad conditions)
-- ============================================================================
/*
BEGIN;
DO $$
DECLARE
    v_rc INTEGER;
BEGIN
    -- R1. Delete 1,337 equipment_assignments
    DELETE FROM public.equipment_assignments ea
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.5_ASSIGN_INSERT'
      AND ea.assignment_id = s.target_pk;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 1337 THEN RAISE EXCEPTION 'ROLLBACK_1_5_MISMATCH: %', v_rc; END IF;

    -- R2. Revert 226 keeper_company_id backfills by exact legacy_id & target_pk
    UPDATE public.equipment e
    SET keeper_company_id = NULL
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.4_KEEPER_BACKFILL'
      AND e.equipment_id = s.target_pk
      AND e.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 226 THEN RAISE EXCEPTION 'ROLLBACK_1_4_MISMATCH: %', v_rc; END IF;

    -- R3. Delete 28 new equipment rows (24 molds + 4 cutters) by exact legacy_id & target_pk
    DELETE FROM public.equipment e
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code IN ('1.3A_MOLD_INSERT', '1.3B_CUTTER_INSERT')
      AND e.equipment_id = s.target_pk
      AND e.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 28 THEN RAISE EXCEPTION 'ROLLBACK_1_3_MISMATCH: %', v_rc; END IF;

    -- R4. Delete 88 new design_revisions by exact legacy_id & target_pk
    DELETE FROM public.design_revisions d
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.2C_DESIGN_INSERT'
      AND d.revision_id = s.target_pk
      AND d.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 88 THEN RAISE EXCEPTION 'ROLLBACK_1_2C_MISMATCH: %', v_rc; END IF;

    -- R5. Delete 54 new products by exact legacy_id & target_pk
    DELETE FROM public.products p
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.2B_PRODUCT_INSERT'
      AND p.product_id = s.target_pk
      AND p.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 54 THEN RAISE EXCEPTION 'ROLLBACK_1_2B_MISMATCH: %', v_rc; END IF;

    -- R6. Restore 70 DESIGN-<id> prefixes on design_revisions
    UPDATE public.design_revisions d
    SET legacy_id = s.payload_json->>'old_legacy_id'
    FROM public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.2A_DESIGN_PREFIX'
      AND d.revision_id = s.target_pk
      AND d.legacy_id = s.payload_json->>'new_legacy_id';
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 70 THEN RAISE EXCEPTION 'ROLLBACK_1_2A_MISMATCH: %', v_rc; END IF;

    -- R7. Delete 20 new rack_layers by exact legacy_id & target_pk
    DELETE FROM public.rack_layers rl
    USING public.staging_mold_sync_wave1 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE1'
      AND s.step_code = '1.1_RACK_LAYER_INSERT'
      AND rl.id = s.target_pk
      AND rl.legacy_id = s.legacy_id;
    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 20 THEN RAISE EXCEPTION 'ROLLBACK_1_1_MISMATCH: %', v_rc; END IF;
END $$;
COMMIT;
*/
