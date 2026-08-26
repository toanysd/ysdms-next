-- Migration: 20260819000000_create_company_calendar.sql
-- Description: Create company_calendar table and add target_completion_date column to jobs

-- 1. Create table company_calendar
CREATE TABLE IF NOT EXISTS company_calendar (
    calendar_date DATE PRIMARY KEY,
    day_type TEXT NOT NULL DEFAULT 'WORKDAY', -- 'WORKDAY', 'HOLIDAY', 'PUBLIC_HOLIDAY', 'SPECIAL_WORKDAY', 'COMPANY_OFF'
    is_working_day BOOLEAN NOT NULL DEFAULT true,
    working_hours NUMERIC(4,1) DEFAULT 8.0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indices for performance
CREATE INDEX IF NOT EXISTS idx_company_calendar_date ON company_calendar(calendar_date);
CREATE INDEX IF NOT EXISTS idx_company_calendar_working ON company_calendar(is_working_day);
CREATE INDEX IF NOT EXISTS idx_company_calendar_type ON company_calendar(day_type);

-- 3. Enable RLS
ALTER TABLE company_calendar ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "company_calendar_select" ON company_calendar;
CREATE POLICY "company_calendar_select" ON company_calendar FOR SELECT USING (true);

DROP POLICY IF EXISTS "company_calendar_insert" ON company_calendar;
CREATE POLICY "company_calendar_insert" ON company_calendar FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "company_calendar_update" ON company_calendar;
CREATE POLICY "company_calendar_update" ON company_calendar FOR UPDATE USING (true);

DROP POLICY IF EXISTS "company_calendar_delete" ON company_calendar;
CREATE POLICY "company_calendar_delete" ON company_calendar FOR DELETE USING (true);

-- 5. Add target_completion_date to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS target_completion_date DATE;
CREATE INDEX IF NOT EXISTS idx_jobs_target_completion_date ON jobs(target_completion_date);

-- 6. Add target_completion_date to job_steps (optional per-step target)
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS target_completion_date DATE;
