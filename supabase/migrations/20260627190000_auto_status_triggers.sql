-- supabase/migrations/20260627190000_auto_status_triggers.sql

-- 1. Trigger for work_logs (Level 3) to update job_steps (Level 2)
CREATE OR REPLACE FUNCTION trg_update_step_status_from_worklogs()
RETURNS TRIGGER AS $$
DECLARE
    v_step_id UUID;
    v_total_groups INT;
    v_finished_groups INT;
    v_status_id INT;
BEGIN
    v_step_id := COALESCE(NEW.job_step_id, OLD.job_step_id);
    IF v_step_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Count total unique processing_code_ids (Level 3 groups)
    SELECT COUNT(DISTINCT COALESCE(processing_code_id, -1))
    INTO v_total_groups
    FROM work_logs
    WHERE job_step_id = v_step_id;

    -- Count finished groups
    SELECT COUNT(*)
    INTO v_finished_groups
    FROM (
        SELECT COALESCE(processing_code_id, -1)
        FROM work_logs
        WHERE job_step_id = v_step_id
        GROUP BY COALESCE(processing_code_id, -1)
        HAVING bool_or(is_finished) = true
    ) sub;

    IF v_total_groups = 0 THEN
        v_status_id := 1; -- 0.未確認
    ELSIF v_total_groups = v_finished_groups THEN
        v_status_id := 8; -- F.完了
    ELSE
        v_status_id := 9; -- N.進行中
    END IF;

    -- Prevent recursive trigger if we had one on job_steps, but we don't for status change
    UPDATE job_steps
    SET processing_status_id = v_status_id, updated_at = NOW()
    WHERE step_id = v_step_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_step_status ON work_logs;
CREATE TRIGGER trigger_update_step_status
AFTER INSERT OR UPDATE OR DELETE ON work_logs
FOR EACH ROW
EXECUTE FUNCTION trg_update_step_status_from_worklogs();


-- 2. Trigger for job_steps (Level 2) to update jobs (Level 1)
CREATE OR REPLACE FUNCTION trg_update_job_status_from_steps()
RETURNS TRIGGER AS $$
DECLARE
    v_job_id UUID;
    v_total_steps INT;
    v_completed_steps INT;
BEGIN
    v_job_id := COALESCE(NEW.job_id, OLD.job_id);
    IF v_job_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT COUNT(*), 
           COUNT(CASE WHEN processing_status_id = 8 THEN 1 END) -- 8 is F.完了
    INTO v_total_steps, v_completed_steps
    FROM job_steps
    WHERE job_id = v_job_id;

    IF v_total_steps > 0 AND v_total_steps = v_completed_steps THEN
        UPDATE jobs SET job_status = 'COMPLETED', updated_at = NOW() WHERE job_id = v_job_id;
    ELSIF v_completed_steps > 0 THEN
        UPDATE jobs SET job_status = 'IN_PROGRESS', updated_at = NOW() WHERE job_id = v_job_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_job_status ON job_steps;
CREATE TRIGGER trigger_update_job_status
AFTER INSERT OR UPDATE OR DELETE ON job_steps
FOR EACH ROW
EXECUTE FUNCTION trg_update_job_status_from_steps();
