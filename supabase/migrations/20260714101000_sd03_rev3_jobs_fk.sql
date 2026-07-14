-- ============================================================
-- Migration: 20260714101000_sd03_rev3_jobs_fk.sql
-- SD-03 Rev 3: Migrate jobs.production_order_id -> mold_work_order_id
-- Rationale: jobs table tracks mold manufacturing workflow only.
-- production_orders is for regular tray production (注文書), separate concern.
-- ============================================================

-- Step 1: Add new FK column (nullable initially for safe migration)
ALTER TABLE jobs
  ADD COLUMN mold_work_order_id UUID REFERENCES mold_work_orders(mwo_id) ON DELETE SET NULL;

-- Step 2: Migrate existing data
-- Any existing jobs linked to production_orders that were
-- actually mold jobs: we cannot auto-migrate (no data exists yet in prod).
-- Safe to leave NULL for now since system is pre-launch.

-- Step 3: Drop old FK column
ALTER TABLE jobs
  DROP COLUMN production_order_id;

-- Step 4: Create index for performance
CREATE INDEX idx_jobs_mold_work_order_id ON jobs(mold_work_order_id);

-- Step 5: Update jobs_mold_deadline column (rename for clarity if needed)
-- jobs.mold_deadline stays as-is (still valid for mold deadline tracking)
COMMENT ON COLUMN jobs.mold_work_order_id IS
  'FK to mold_work_orders. NULL if job is standalone (not linked to a mold instruction).';
