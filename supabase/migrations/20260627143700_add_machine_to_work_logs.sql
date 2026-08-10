-- Add machine_id to work_logs for level-3 Gantt planning
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS machine_id UUID REFERENCES machines(machine_id);
