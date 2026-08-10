-- Liên kết ngược production_log → production_plans
ALTER TABLE public.production_log
ADD COLUMN IF NOT EXISTS production_plan_id UUID
  REFERENCES public.production_plans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_production_log_plan_id
  ON public.production_log(production_plan_id);
