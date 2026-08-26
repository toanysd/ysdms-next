-- Migration: Drop legacy equipment tables (Phase D Stage 3)
-- Date: 2026-08-26

BEGIN;

-- 1. Drop legacy tables
DROP TABLE IF EXISTS public.physical_molds CASCADE;
DROP TABLE IF EXISTS public.cutters CASCADE;

-- 2. Drop legacy column from jobs
ALTER TABLE public.jobs DROP COLUMN IF EXISTS physical_mold_id;

COMMIT;
