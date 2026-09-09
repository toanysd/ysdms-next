-- File: supabase/migrations/20260902000005_076b_hotfix_rpc_confirm_wo.sql
-- Hotfix: design_revisions uses 'status' = 'APPROVED', not 'is_active'

CREATE OR REPLACE FUNCTION public.rpc_confirm_work_order(
    p_wo_id UUID,
    p_confirmed_by UUID
) RETURNS jsonb AS $$
DECLARE
    v_wo            RECORD;
    v_rev_id        UUID;
    v_equip         RECORD;
    v_job_code      TEXT;
    v_seq           INTEGER := 1;
    v_jobs_created  INTEGER := 0;
    v_job_category  TEXT;
BEGIN
    -- 1. Lock + validate WO
    SELECT * INTO v_wo FROM work_orders
    WHERE wo_id = p_wo_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'WO not found: %', p_wo_id;
    END IF;
    IF v_wo.wo_status != 'PLANNED' THEN
        RAISE EXCEPTION 'WO % is not in PLANNED status (current: %)',
            v_wo.wo_code, v_wo.wo_status;
    END IF;

    -- 2. Lấy design_revision_id
    v_rev_id := v_wo.design_revision_id;
    IF v_rev_id IS NULL THEN
        SELECT revision_id INTO v_rev_id
        FROM design_revisions
        WHERE product_id = v_wo.product_id
          AND status = 'APPROVED'
        ORDER BY created_at DESC LIMIT 1;
    END IF;

    IF v_rev_id IS NULL THEN
        RAISE EXCEPTION 'No active design_revision (APPROVED) for product %',
            v_wo.product_id;
    END IF;

    -- 3. Sinh 1 job / equipment liên kết với revision này
    FOR v_equip IN
        SELECT equipment_id, equipment_type, equipment_code
        FROM equipment
        WHERE design_revision_id = v_rev_id
          AND (device_status IS NULL OR device_status IN ('NORMAL', 'ACTIVE', 'IN_USE', 'STORED'))
        ORDER BY equipment_type
    LOOP
        -- Map job_category từ equipment_type + wo_type
        v_job_category :=
            CASE
                WHEN v_equip.equipment_type = 'MOLD'            THEN 'MOLD'
                WHEN v_equip.equipment_type LIKE 'CUTTER%'       THEN 'CUTTER'
                ELSE 'EQUIPMENT'
            END
            || '_' ||
            CASE
                WHEN v_wo.wo_type LIKE '%REPAIR%'               THEN 'REPAIR'
                WHEN v_wo.wo_type LIKE '%MAINTENANCE%'          THEN 'MAINTENANCE'
                ELSE 'NEW'
            END;

        v_job_code := v_wo.wo_code
                      || '-J'
                      || LPAD(v_seq::TEXT, 2, '0');

        INSERT INTO jobs (
            work_order_id,
            equipment_id,
            job_code,
            job_name,
            job_category,
            job_status,
            deadline,
            priority,
            product_id,
            design_revision_id,
            company_id
        ) VALUES (
            p_wo_id,
            v_equip.equipment_id,
            v_job_code,
            v_equip.equipment_type || ' — ' || v_equip.equipment_code,
            v_job_category,
            'PLANNED',
            v_wo.deadline,
            v_wo.priority,
            v_wo.product_id,
            v_rev_id,
            v_wo.company_id
        );

        v_seq          := v_seq + 1;
        v_jobs_created := v_jobs_created + 1;
    END LOOP;

    -- 4. Update WO status
    UPDATE work_orders
    SET wo_status = 'IN_PROGRESS',
        notes = COALESCE(notes, '')
                || E'\n[' || NOW()::DATE || '] Confirmed by '
                || p_confirmed_by::TEXT
                || ' → ' || v_jobs_created || ' jobs created.'
    WHERE wo_id = p_wo_id;

    RETURN jsonb_build_object(
        'success',            true,
        'wo_code',            v_wo.wo_code,
        'jobs_created',       v_jobs_created,
        'design_revision_id', v_rev_id
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

REVOKE EXECUTE ON FUNCTION public.rpc_confirm_work_order(uuid, uuid) FROM anon;
GRANT  EXECUTE ON FUNCTION public.rpc_confirm_work_order(uuid, uuid) TO authenticated;
