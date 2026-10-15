-- ============================================================================
-- WO-MOLD-SYNC-WAVE2 (PAYLOAD V1) — STEP 0: STAGING TABLE & STRICT RLS
-- Policy: service_role WRITE ONLY, authenticated READ ONLY
-- ============================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.staging_mold_sync_wave2 (
    staging_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code TEXT NOT NULL DEFAULT 'WO-MOLD-SYNC-WAVE2-V1',
    step_code TEXT NOT NULL CHECK (step_code IN (
        '2.0_EQUIPMENT_DREV_BACKFILL',
        '2.1A_WO_FK_BACKFILL',
        '2.1B_JOB_FK_BACKFILL',
        '2.2A_WO_INSERT',
        '2.2B_JOB_INSERT',
        '2.3_STEP_INSERT',
        '2.4_WORKLOG_INSERT'
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

ALTER TABLE public.staging_mold_sync_wave2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staging_mold_sync_wave2_service_role_all" ON public.staging_mold_sync_wave2;
CREATE POLICY "staging_mold_sync_wave2_service_role_all"
    ON public.staging_mold_sync_wave2
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "staging_mold_sync_wave2_authenticated_read" ON public.staging_mold_sync_wave2;
CREATE POLICY "staging_mold_sync_wave2_authenticated_read"
    ON public.staging_mold_sync_wave2
    FOR SELECT
    TO authenticated
    USING (true);

DO $$
DECLARE
    v_rls BOOLEAN;
    v_pol INTEGER;
BEGIN
    SELECT relrowsecurity INTO v_rls FROM pg_class WHERE oid = 'public.staging_mold_sync_wave2'::regclass;
    SELECT COUNT(*) INTO v_pol FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staging_mold_sync_wave2';
    IF NOT v_rls OR v_pol <> 2 THEN
        RAISE EXCEPTION 'WAVE2_STAGING_RLS_FAILED: rls=%, policies=%', v_rls, v_pol;
    END IF;
END $$;

ROLLBACK; -- Change to COMMIT only after PE approves Gate 1 Payload & THOAN commands GO
