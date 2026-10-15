-- ============================================================================
-- WO-MOLD-SYNC-WAVE1 (PAYLOAD V2) — STEP 0: STAGING TABLE & STRICT RLS
-- Policy: service_role WRITE ONLY, authenticated READ ONLY
-- ============================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.staging_mold_sync_wave1 (
    staging_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code TEXT NOT NULL DEFAULT 'WO-MOLD-SYNC-WAVE1-V2',
    step_code TEXT NOT NULL CHECK (step_code IN (
        '1.0_COMPANY_INSERT',
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

-- Postflight check: verify RLS is enabled and 2 policies exist
DO $$
DECLARE
    v_rls BOOLEAN;
    v_pol INTEGER;
BEGIN
    SELECT relrowsecurity INTO v_rls FROM pg_class WHERE oid = 'public.staging_mold_sync_wave1'::regclass;
    SELECT COUNT(*) INTO v_pol FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staging_mold_sync_wave1';
    IF NOT v_rls OR v_pol <> 2 THEN
        RAISE EXCEPTION 'STAGING_RLS_POSTFLIGHT_FAILED: rls=%, policies=%', v_rls, v_pol;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload v2
