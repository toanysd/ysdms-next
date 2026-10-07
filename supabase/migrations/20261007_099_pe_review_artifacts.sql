-- ==============================================================================
-- Migration 099: PE Review Artifacts Bridge Table
-- Purpose: Enable direct zero-copy text transport between AN and PE via SQL
-- Security: Isolated audit table, zero foreign keys, service_role write
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.pe_review_artifacts (
    artifact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_name TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    content_md TEXT NOT NULL,
    byte_size INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pe_review_artifacts_name_ver_uniq UNIQUE (artifact_name, version)
);

-- Enable RLS
ALTER TABLE public.pe_review_artifacts ENABLE ROW LEVEL SECURITY;

-- Allow read for authenticated & service role / public read-only
DROP POLICY IF EXISTS "Allow select on pe_review_artifacts" ON public.pe_review_artifacts;
CREATE POLICY "Allow select on pe_review_artifacts" ON public.pe_review_artifacts
    FOR SELECT TO public USING (true);

-- Allow write for service role only
DROP POLICY IF EXISTS "Allow service role all on pe_review_artifacts" ON public.pe_review_artifacts;
CREATE POLICY "Allow service role all on pe_review_artifacts" ON public.pe_review_artifacts
    FOR ALL TO service_role USING (true) WITH CHECK (true);
