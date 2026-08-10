-- Add processing_status_id to work_logs (level 3 status)
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS processing_status_id INTEGER REFERENCES processing_statuses(status_id);
