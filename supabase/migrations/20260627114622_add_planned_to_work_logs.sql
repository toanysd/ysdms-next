-- Add planned_hours and planned_date to work_logs for level-3 Gantt planning
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS planned_hours NUMERIC(5,2);
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS planned_date DATE;
