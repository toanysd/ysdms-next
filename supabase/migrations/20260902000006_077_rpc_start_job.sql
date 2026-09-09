CREATE OR REPLACE FUNCTION public.rpc_start_job(
    p_job_id UUID
) RETURNS jsonb AS $$
DECLARE
    v_job         RECORD;
    v_category    TEXT;
    v_steps_count INTEGER := 0;
BEGIN
    SELECT * INTO v_job FROM jobs WHERE job_id = p_job_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Job not found: %', p_job_id;
    END IF;
    IF v_job.job_status NOT IN ('PLANNED') THEN
        RAISE EXCEPTION 'Job % cannot be started (status: %)',
            v_job.job_code, v_job.job_status;
    END IF;

    -- Kiểm tra đã có steps chưa (tránh duplicate)
    SELECT COUNT(*) INTO v_steps_count
    FROM job_steps WHERE job_id = p_job_id;

    IF v_steps_count > 0 THEN
        RAISE EXCEPTION 'Job % already has % steps', v_job.job_code, v_steps_count;
    END IF;

    -- Normalize category prefix
    v_category := CASE
        WHEN v_job.job_category LIKE 'MOLD%'      THEN 'MOLD'
        WHEN v_job.job_category LIKE 'CUTTER%'    THEN 'CUTTER'
        ELSE 'EQUIPMENT'
    END;

    -- Insert template steps
    IF v_category = 'MOLD' THEN
        INSERT INTO job_steps (job_id, step_no, step_name, type_code, step_status) VALUES
          (p_job_id, 1, '材料確認 / Xác nhận vật liệu', 'PREPARATION', 'NOT_STARTED'),
          (p_job_id, 2, '加工 / Gia công',               'MACHINING',   'NOT_STARTED'),
          (p_job_id, 3, '検査 / Kiểm tra',               'INSPECTION',  'NOT_STARTED'),
          (p_job_id, 4, '仕上げ / Hoàn thiện & lắp ráp', 'FINISHING',   'NOT_STARTED');
        v_steps_count := 4;

    ELSIF v_category = 'CUTTER' THEN
        INSERT INTO job_steps (job_id, step_no, step_name, type_code, step_status) VALUES
          (p_job_id, 1, '材料確認 / Xác nhận vật liệu', 'PREPARATION', 'NOT_STARTED'),
          (p_job_id, 2, 'カット加工 / Gia công cắt',     'MACHINING',   'NOT_STARTED'),
          (p_job_id, 3, '刃先検査 / Kiểm tra lưỡi cắt', 'INSPECTION',  'NOT_STARTED');
        v_steps_count := 3;

    ELSE -- EQUIPMENT (PLUG, FRAME, STACKING, PRESSURE_BASE, WATER_BASE)
        INSERT INTO job_steps (job_id, step_no, step_name, type_code, step_status) VALUES
          (p_job_id, 1, '製作 / Chế tác',  'MACHINING',  'NOT_STARTED'),
          (p_job_id, 2, '検査 / Kiểm tra', 'INSPECTION', 'NOT_STARTED');
        v_steps_count := 2;
    END IF;

    -- Update job status
    UPDATE jobs SET job_status = 'IN_PROGRESS' WHERE job_id = p_job_id;

    RETURN jsonb_build_object(
        'success',      true,
        'job_code',     v_job.job_code,
        'steps_created', v_steps_count
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

REVOKE EXECUTE ON FUNCTION public.rpc_start_job(uuid) FROM anon;
GRANT  EXECUTE ON FUNCTION public.rpc_start_job(uuid) TO authenticated;
