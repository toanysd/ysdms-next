-- Migration: 20260509_053_add_mold_job_processes.sql
-- Mục đích: Thêm bảng mold_job_processes (kỳ hạn gia công) giữa mold_jobs và mold_work_logs
-- Access gốc: bảng ProcessingDeadline (JobID, ItemTypeID, ProcessingDeadline)

BEGIN;

-- ═══════════════════════════════════════════════════
-- BẢNG MỚI: mold_job_processes (kỳ hạn gia công)
-- ═══════════════════════════════════════════════════
CREATE TABLE mold_job_processes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            uuid NOT NULL REFERENCES mold_jobs(id) ON DELETE CASCADE,
  
  -- Loại công đoạn: MOLD, PLUG, STAKING, etc.
  -- Tham chiếu bảng processing_items (ItemTypeID trong Access)
  process_type      text NOT NULL,
  -- Giải thích: dùng text thay vì FK để linh hoạt
  -- (processingitems có thể thêm loại mới mà không cần migration)
  
  -- Kỳ hạn hoàn thành (ProcessingDeadline trong Access)
  deadline_date     date,
  
  -- Trạng thái kỳ hạn
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  
  -- Người phụ trách kỳ hạn này (InChargePerson trong Access)
  responsible_employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Ghi chú
  notes             text,
  
  -- Audit
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  
  -- Legacy (map về Access JobID + ItemTypeID)
  legacy_job_id     text,
  legacy_item_type  text
);

-- Index tra cứu theo job
CREATE INDEX idx_mold_job_processes_job_id 
  ON mold_job_processes(job_id);

-- Index tra cứu theo deadline (cho dashboard kỳ hạn)
CREATE INDEX idx_mold_job_processes_deadline 
  ON mold_job_processes(deadline_date) 
  WHERE status != 'completed';

-- ═══════════════════════════════════════════════════
-- SỬA mold_work_logs: Thêm FK → mold_job_processes
-- Giữ nguyên job_id (backward compat) nhưng thêm process_id
-- ═══════════════════════════════════════════════════
ALTER TABLE mold_work_logs
  ADD COLUMN process_id uuid REFERENCES mold_job_processes(id) ON DELETE SET NULL;

-- Index mới
CREATE INDEX idx_mold_work_logs_process_id 
  ON mold_work_logs(process_id);

-- ═══════════════════════════════════════════════════
-- CẤP QUYỀN VÀ RLS CHO BẢNG MỚI
-- ═══════════════════════════════════════════════════
ALTER TABLE mold_job_processes ENABLE ROW LEVEL SECURITY;
GRANT ALL ON mold_job_processes TO authenticated;
CREATE POLICY "Allow authenticated full access on mold_job_processes" ON mold_job_processes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════
-- COMMENT documentation
-- ═══════════════════════════════════════════════════
COMMENT ON TABLE mold_job_processes IS 
  'Kỳ hạn gia công theo từng công đoạn (MOLD/PLUG/STAKING...) của một Job. Tương đương bảng ProcessingDeadline trong Access legacy.';

COMMENT ON COLUMN mold_job_processes.process_type IS 
  'Mã công đoạn: MOLD | PLUG | STAKING | EDM | DRILL | GRIND | etc.';

COMMENT ON COLUMN mold_job_processes.deadline_date IS 
  'Ngày kỳ hạn hoàn thành công đoạn. Tương đương cột ProcessingDeadline trong Access.';

COMMENT ON COLUMN mold_work_logs.process_id IS 
  'FK tùy chọn trỏ đến kỳ hạn cụ thể. NULL = work log cũ chưa gán kỳ hạn (backward compat).';

COMMIT;
