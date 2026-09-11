-- ============================================================================
-- Migration: 20260911000001_m28a_db_enum_integrity_v2_1.sql
-- Mục đích: Chuẩn hóa Canonical Enums, cập nhật RPC và áp đặt DB CHECK Constraints
-- Milestone: M28 - Phase A
-- Trạng thái: APPROVED by PE (Ready to apply by PE via Supabase Connector)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- BƯỚC 1: DATA MIGRATION — Chuẩn hóa dữ liệu legacy về giá trị Canonical
-- ----------------------------------------------------------------------------

-- 1.1 Chuẩn hóa jobs.job_status về canonical 'PENDING' (bao gồm cả 'PLANNED')
UPDATE public.jobs
SET job_status = 'PENDING',
    updated_at = NOW()
WHERE job_status IN ('NEW', 'NOT_STARTED', 'PLANNED') OR job_status IS NULL;

-- 1.2 Chuẩn hóa job_steps.step_status về canonical 'PENDING'
UPDATE public.job_steps
SET step_status = 'PENDING',
    updated_at = NOW()
WHERE step_status IN ('NOT_STARTED', 'PLANNED') OR step_status IS NULL;

-- 1.3 Chuẩn hóa work_orders.wo_status (phòng ngừa dữ liệu CONFIRMED)
UPDATE public.work_orders
SET wo_status = 'PLANNED',
    updated_at = NOW()
WHERE wo_status = 'CONFIRMED' OR wo_status IS NULL;

-- ----------------------------------------------------------------------------
-- BƯỚC 2: CẬP NHẬT CÁC HÀM POSTGRESQL RPC ĐỒNG BỘ VỚI CANONICAL ENUM
-- ----------------------------------------------------------------------------

-- 2.1 Cập nhật rpc_confirm_work_order: Chèn job_status = 'PENDING' thay vì 'PLANNED'
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
    SELECT * INTO v_wo FROM work_orders
    WHERE wo_id = p_wo_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'WO not found: %', p_wo_id;
    END IF;
    IF v_wo.wo_status != 'PLANNED' THEN
        RAISE EXCEPTION 'WO % is not in PLANNED status (current: %)',
            v_wo.wo_code, v_wo.wo_status;
    END IF;

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

    FOR v_equip IN
        SELECT equipment_id, equipment_type, equipment_code
        FROM equipment
        WHERE design_revision_id = v_rev_id
          AND (device_status IS NULL OR device_status IN ('NORMAL', 'ACTIVE', 'IN_USE', 'STORED'))
        ORDER BY equipment_type
    LOOP
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

        v_job_code := v_wo.wo_code || '-J' || LPAD(v_seq::TEXT, 2, '0');

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
            'PENDING', -- Đã chuẩn hóa sang PENDING
            v_wo.deadline,
            v_wo.priority,
            v_wo.product_id,
            v_rev_id,
            v_wo.company_id
        );

        v_seq          := v_seq + 1;
        v_jobs_created := v_jobs_created + 1;
    END LOOP;

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
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 2.2 Cập nhật rpc_start_job: Kiểm tra PENDING và chèn step_status = 'PENDING'
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
    -- Đã chuẩn hóa kiểm tra PENDING thay vì PLANNED
    IF v_job.job_status NOT IN ('PENDING') THEN
        RAISE EXCEPTION 'Job % cannot be started (status: %)',
            v_job.job_code, v_job.job_status;
    END IF;

    SELECT COUNT(*) INTO v_steps_count
    FROM job_steps WHERE job_id = p_job_id;

    IF v_steps_count > 0 THEN
        RAISE EXCEPTION 'Job % already has % steps', v_job.job_code, v_steps_count;
    END IF;

    v_category := CASE
        WHEN v_job.job_category LIKE 'MOLD%'      THEN 'MOLD'
        WHEN v_job.job_category LIKE 'CUTTER%'    THEN 'CUTTER'
        ELSE 'EQUIPMENT'
    END;

    -- Đã chuẩn hóa chèn step_status = 'PENDING' thay vì 'NOT_STARTED'
    IF v_category = 'MOLD' THEN
        INSERT INTO job_steps (job_id, step_no, step_name, type_code, step_status) VALUES
          (p_job_id, 1, '材料確認 / Xác nhận vật liệu', 'PREPARATION', 'PENDING'),
          (p_job_id, 2, '加工 / Gia công',               'MACHINING',   'PENDING'),
          (p_job_id, 3, '検査 / Kiểm tra',               'INSPECTION',  'PENDING'),
          (p_job_id, 4, '仕上げ / Hoàn thiện & lắp ráp', 'FINISHING',   'PENDING');
        v_steps_count := 4;

    ELSIF v_category = 'CUTTER' THEN
        INSERT INTO job_steps (job_id, step_no, step_name, type_code, step_status) VALUES
          (p_job_id, 1, '材料確認 / Xác nhận vật liệu', 'PREPARATION', 'PENDING'),
          (p_job_id, 2, 'カット加工 / Gia công cắt',     'MACHINING',   'PENDING'),
          (p_job_id, 3, '刃先検査 / Kiểm tra lưỡi cắt', 'INSPECTION',  'PENDING');
        v_steps_count := 3;

    ELSE
        INSERT INTO job_steps (job_id, step_no, step_name, type_code, step_status) VALUES
          (p_job_id, 1, '製作 / Chế tác',  'MACHINING',  'PENDING'),
          (p_job_id, 2, '検査 / Kiểm tra', 'INSPECTION', 'PENDING');
        v_steps_count := 2;
    END IF;

    UPDATE jobs SET job_status = 'IN_PROGRESS' WHERE job_id = p_job_id;

    RETURN jsonb_build_object(
        'success',       true,
        'job_code',      v_job.job_code,
        'steps_created', v_steps_count
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- ----------------------------------------------------------------------------
-- BƯỚC 3: CẬP NHẬT DEFAULT CHO CỘT TRƯỚC KHI SIẾT CHECK
-- ----------------------------------------------------------------------------
ALTER TABLE public.jobs ALTER COLUMN job_status SET DEFAULT 'PENDING';
ALTER TABLE public.job_steps ALTER COLUMN step_status SET DEFAULT 'PENDING';
ALTER TABLE public.work_orders ALTER COLUMN wo_status SET DEFAULT 'PLANNED';
ALTER TABLE public.quotations ALTER COLUMN status SET DEFAULT 'DRAFT';

-- ----------------------------------------------------------------------------
-- BƯỚC 4: SCHEMA CONSTRAINTS — Siết chặt DB CHECK constraints theo Canonical Enum
-- ----------------------------------------------------------------------------

-- 4.1 quotations: Chuẩn hóa quotation_type theo Phương án 3 (SET, MOLD, TRAY)
ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS quotations_quotation_type_check;
ALTER TABLE public.quotations ADD CONSTRAINT quotations_quotation_type_check 
  CHECK (quotation_type IN ('SET', 'MOLD', 'TRAY'));

-- 4.2 quotations: Siết chặt status (chuẩn hóa APPROVED, loại bỏ hoàn toàn ACCEPTED)
ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS quotations_status_check;
ALTER TABLE public.quotations ADD CONSTRAINT quotations_status_check 
  CHECK (status IN ('DRAFT', 'SENT', 'APPROVED', 'CONVERTED', 'REJECTED', 'EXPIRED'));

-- 4.3 work_orders: Siết chặt wo_status (có READY_FOR_PRODUCTION từ trigger 086)
ALTER TABLE public.work_orders DROP CONSTRAINT IF EXISTS work_orders_wo_status_check;
ALTER TABLE public.work_orders ADD CONSTRAINT work_orders_wo_status_check 
  CHECK (wo_status IN ('PLANNED', 'IN_PROGRESS', 'READY_FOR_PRODUCTION', 'COMPLETED', 'CANCELLED'));

-- 4.4 jobs: Siết chặt job_status (Canonical PENDING, loại bỏ vĩnh viễn NEW / NOT_STARTED / PLANNED)
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_job_status_check;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_job_status_check 
  CHECK (job_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'));

-- 4.5 job_steps: Siết chặt step_status (Canonical PENDING, loại bỏ vĩnh viễn NOT_STARTED / PLANNED)
ALTER TABLE public.job_steps DROP CONSTRAINT IF EXISTS job_steps_step_status_check;
ALTER TABLE public.job_steps ADD CONSTRAINT job_steps_step_status_check 
  CHECK (step_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'));
