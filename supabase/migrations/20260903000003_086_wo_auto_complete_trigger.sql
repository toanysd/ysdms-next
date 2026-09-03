-- Migration 086: Auto sync work order status when all jobs completed
-- When all jobs associated with a work order are COMPLETED, auto transition work_orders.wo_status to 'READY_FOR_PRODUCTION'

CREATE OR REPLACE FUNCTION sync_work_order_status() 
RETURNS TRIGGER AS $$
DECLARE
  total_jobs INT;
  completed_jobs INT;
  target_wo_id UUID;
BEGIN
  target_wo_id := COALESCE(NEW.work_order_id, OLD.work_order_id);
  
  IF target_wo_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Count all jobs for this work order
  SELECT COUNT(*) INTO total_jobs 
  FROM jobs 
  WHERE work_order_id = target_wo_id;

  -- Count completed jobs for this work order
  SELECT COUNT(*) INTO completed_jobs 
  FROM jobs 
  WHERE work_order_id = target_wo_id AND job_status = 'COMPLETED';

  -- If at least 1 job exists and all jobs are COMPLETED, transition WO status
  IF total_jobs > 0 AND total_jobs = completed_jobs THEN
    UPDATE work_orders 
    SET wo_status = 'READY_FOR_PRODUCTION',
        updated_at = NOW()
    WHERE wo_id = target_wo_id 
      AND wo_status NOT IN ('COMPLETED', 'CANCELLED', 'READY_FOR_PRODUCTION');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_wo_status ON jobs;

CREATE TRIGGER trg_sync_wo_status
  AFTER INSERT OR UPDATE OF job_status ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION sync_work_order_status();
