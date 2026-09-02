-- Migration 084: Add CHECK constraint for quantity_ng
-- TD-006: quantity_ng >= 0 trên job_qc_logs và work_logs

ALTER TABLE job_qc_logs 
  ADD CONSTRAINT job_qc_logs_quantity_ng_check 
  CHECK (quantity_ng >= 0);

ALTER TABLE work_logs 
  ADD CONSTRAINT work_logs_quantity_ng_check 
  CHECK (quantity_ng >= 0);
