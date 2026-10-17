-- ============================================================================
-- WO-MOLD-SYNC-WAVE3 (PAYLOAD V1) — STEP 3.2 (Q2): 356 SHIP LOGS -> EQUIPMENT_SHIP_LOGS
-- Excludes 2 NULL ShipDate rows into EXCLUDED_SHIPLOGS; 0 rows written to equipment_history
-- ============================================================================
BEGIN;

DO $$
DECLARE
    v_rc INTEGER;
    v_ship_pre INTEGER;
    v_ship_dup INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ship_pre FROM public.equipment_ship_logs;
    IF v_ship_pre <> 0 THEN
        RAISE EXCEPTION 'STEP3_2_PREFLIGHT_MISMATCH: equipment_ship_logs=%', v_ship_pre;
    END IF;

    INSERT INTO public.equipment_ship_logs (
        ship_log_id, equipment_id, equipment_type, ship_item_name,
        ship_date, from_company_id, to_company_id, employee_id,
        notes, legacy_ship_id, legacy_mold_id, legacy_cutter_id
    )
    SELECT
        s.target_pk,
        (s.payload_json->>'equipment_id')::uuid,
        s.payload_json->>'equipment_type',
        s.payload_json->>'ship_item_name',
        (s.payload_json->>'ship_date')::date,
        (s.payload_json->>'from_company_id')::uuid,
        (s.payload_json->>'to_company_id')::uuid,
        (s.payload_json->>'employee_id')::uuid,
        s.payload_json->>'notes',
        (s.payload_json->>'legacy_ship_id')::integer,
        (s.payload_json->>'legacy_mold_id')::integer,
        (s.payload_json->>'legacy_cutter_id')::integer
    FROM public.staging_mold_sync_wave3 s
    WHERE s.batch_code = 'WO-MOLD-SYNC-WAVE3-V1'
      AND s.step_code = '3.2_SHIPLOG_INSERT';

    GET DIAGNOSTICS v_rc = ROW_COUNT;
    IF v_rc <> 356 THEN
        RAISE EXCEPTION 'STEP3_2_ROW_COUNT_MISMATCH: expected 356, got %', v_rc;
    END IF;

    SELECT COUNT(*) - COUNT(DISTINCT legacy_ship_id) INTO v_ship_dup
    FROM public.equipment_ship_logs WHERE legacy_ship_id IS NOT NULL;
    IF v_ship_dup <> 0 THEN
        RAISE EXCEPTION 'STEP3_2_DUPLICATE_LEGACY_SHIP_ID: %', v_ship_dup;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & issues GO
