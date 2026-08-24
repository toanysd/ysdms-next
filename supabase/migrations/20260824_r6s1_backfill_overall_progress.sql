-- Migration: R6-S1 Backfill overall_progress + Auto-sync Trigger
-- Phase R6-S1: Fix jobs.overall_progress from job_steps.step_status
-- Applied: 2026-08-24
-- PE Directive: #38

-- Step 1a: Backfill jobs that HAVE job_steps
UPDATE jobs j
SET overall_progress = (
  SELECT ROUND(
    100.0 * COUNT(*) FILTER (WHERE step_status = 'COMPLETED') 
    / NULLIF(COUNT(*), 0)
  , 1)
  FROM job_steps js
  WHERE js.job_id = j.job_id
)
WHERE EXISTS (SELECT 1 FROM job_steps WHERE job_id = j.job_id);

-- Step 1b: Backfill jobs WITHOUT job_steps (infer from job_status)
UPDATE jobs
SET overall_progress = CASE 
  WHEN job_status = 'COMPLETED' THEN 100
  WHEN job_status = 'IN_PROGRESS' THEN 50
  ELSE 0
END
WHERE job_id NOT IN (SELECT DISTINCT job_id FROM job_steps);

-- Step 2: Create auto-sync trigger function
CREATE OR REPLACE FUNCTION sync_job_overall_progress()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE jobs
  SET overall_progress = (
    SELECT ROUND(
      100.0 * COUNT(*) FILTER (WHERE step_status = 'COMPLETED') 
      / NULLIF(COUNT(*), 0)
    , 1)
    FROM job_steps
    WHERE job_id = COALESCE(NEW.job_id, OLD.job_id)
  )
  WHERE job_id = COALESCE(NEW.job_id, OLD.job_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 3: Create trigger on job_steps
CREATE TRIGGER trg_sync_job_progress
AFTER INSERT OR UPDATE OF step_status OR DELETE
ON job_steps
FOR EACH ROW EXECUTE FUNCTION sync_job_overall_progress();
