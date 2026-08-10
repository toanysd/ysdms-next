-- =================================================================================
-- Migration 048: Add Legacy IDs for Migration
-- Purpose: Để khớp hoàn hảo ID của Access (số nguyên) với Supabase (UUID)
-- =================================================================================

ALTER TABLE public.mold_design_revision ADD COLUMN IF NOT EXISTS legacy_id INTEGER UNIQUE;
ALTER TABLE public.mold_physical ADD COLUMN IF NOT EXISTS legacy_id INTEGER UNIQUE;
ALTER TABLE public.mold_jobs ADD COLUMN IF NOT EXISTS legacy_id INTEGER UNIQUE;
ALTER TABLE public.mold_work_logs ADD COLUMN IF NOT EXISTS legacy_id INTEGER UNIQUE;
