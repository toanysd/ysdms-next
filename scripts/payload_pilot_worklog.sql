-- ============================================================================
-- PAYLOAD ĐẶC TẢ: 01 PILOT WORK LOG (INTERNAL SHOP 5S)
-- Trạng thái: CHƯA THỰC THI (STRICTLY UNEXECUTED - AWAITING PE/THOAN REVIEW)
-- Ngày lập: 2026-10-06
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PREFLIGHT READ-ONLY AUDIT
-- ----------------------------------------------------------------------------
SELECT 
  (SELECT COUNT(*) FROM public.jobs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202' AND job_code = 'JOB-INTERNAL-SHOP') AS job_exists,
  (SELECT COUNT(*) FROM public.job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff' AND job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS step_exists,
  (SELECT COUNT(*) FROM public.employees WHERE employee_id = 'abe82154-2f81-44ec-b76e-11a2db247fca' AND is_active = true) AS employee_exists,
  (SELECT COUNT(*) FROM public.processing_codes WHERE processing_code_id = 50 AND is_active = true) AS processing_code_exists,
  (SELECT COUNT(*) FROM public.work_logs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS existing_worklogs_count,
  (SELECT COUNT(*) FROM public.work_logs) AS work_logs_total_before;

-- Kỳ vọng Preflight:
-- job_exists: 1
-- step_exists: 1
-- employee_exists: 1
-- processing_code_exists: 1
-- existing_worklogs_count: 0
-- work_logs_total_before: 7105

-- ----------------------------------------------------------------------------
-- 2. FAIL-CLOSED TRANSACTION (CHỈ CHẠY KHI ĐƯỢC PE & THOAN PHÊ DUYỆT)
-- ----------------------------------------------------------------------------
BEGIN;

INSERT INTO public.work_logs (
  job_id,
  job_step_id,
  employee_id,
  work_date,
  hours_spent,
  processing_code_id,
  description,
  notes,
  is_finished,
  quantity_done,
  quantity_ng
) VALUES (
  '380d3e19-6074-4701-a0bd-d0e8a2892202', -- job_id: JOB-INTERNAL-SHOP
  '6ba5c7b9-4ec3-4d41-bbd2-057613287bff', -- job_step_id: Step 1 (5S・工場清掃)
  'abe82154-2f81-44ec-b76e-11a2db247fca', -- employee_id: M09 (グエン　ダン　トアン)
  '2026-10-06',                            -- work_date: 2026-10-06
  1.0,                                     -- hours_spent: 1.0 giờ
  50,                                      -- processing_code_id: 50 (5S)
  '5S',                                    -- description: 5S
  '金型工場エリアの5S整理整頓・清掃作業実施（Pilot Work Log）', -- notes: giải thích chi tiết
  false,                                   -- is_finished: false (chưa đóng step)
  NULL,                                    -- quantity_done: NULL (không phải ép nhựa thermoforming)
  0                                        -- quantity_ng: 0
);

-- ----------------------------------------------------------------------------
-- 3. POSTFLIGHT AUDIT
-- ----------------------------------------------------------------------------
SELECT 
  COUNT(*) AS pilot_log_count,
  (SELECT COUNT(*) FROM public.work_logs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS job_worklogs_count,
  (SELECT COUNT(*) FROM public.work_logs) AS work_logs_total_after,
  (SELECT processing_status_id FROM public.job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff') AS step_processing_status_id,
  (SELECT step_status FROM public.job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff') AS step_status_after,
  (SELECT job_status FROM public.jobs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS job_status_after;

-- Kỳ vọng Postflight:
-- pilot_log_count: 1
-- job_worklogs_count: 1
-- work_logs_total_after: 7106
-- step_processing_status_id: 9 (N.進行中 - tự động cập nhật bởi trigger trg_update_step_status_from_worklogs)
-- step_status_after: PENDING (do is_finished = false)
-- job_status_after: PENDING (do chưa có step nào F.完了)

COMMIT;
