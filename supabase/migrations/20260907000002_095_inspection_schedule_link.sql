-- 095_inspection_schedule_link.sql
-- Link inspection_daily_logs to production_schedules for KCS reconciliation

ALTER TABLE public.inspection_daily_logs
  ADD COLUMN IF NOT EXISTS schedule_id UUID 
    REFERENCES public.production_schedules(schedule_id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_inspection_daily_logs_schedule_id
  ON public.inspection_daily_logs(schedule_id);

COMMENT ON COLUMN public.inspection_daily_logs.schedule_id IS 'Khóa ngoại liên kết ca dập định hình tương ứng trong production_schedules';
