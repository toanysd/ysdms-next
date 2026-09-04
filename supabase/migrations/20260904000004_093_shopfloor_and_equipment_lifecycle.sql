-- ====================================================================
-- Migration 093: Shopfloor Tablet & Equipment Lifecycle Integration
-- Reference: ADR-007 (Milestone 14 Kickoff)
-- Target:
-- 1. Link forming_daily_logs & press_daily_logs to production_schedules
-- 2. Add maintenance threshold & last maintenance shot tracking to equipment
-- 3. Create view v_equipment_lifecycle_status (security_invoker = true)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Link Schedule with Daily Logs (M14-S1 + M14-S2 Bridge)
-- --------------------------------------------------------------------
ALTER TABLE public.forming_daily_logs
  ADD COLUMN IF NOT EXISTS schedule_id UUID REFERENCES public.production_schedules(schedule_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_forming_daily_logs_schedule_id
  ON public.forming_daily_logs(schedule_id);

ALTER TABLE public.press_daily_logs
  ADD COLUMN IF NOT EXISTS schedule_id UUID REFERENCES public.production_schedules(schedule_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_press_daily_logs_schedule_id
  ON public.press_daily_logs(schedule_id);

-- --------------------------------------------------------------------
-- 2. Add Maintenance Thresholds to Equipment (M14-S2 Lifecycle)
-- --------------------------------------------------------------------
ALTER TABLE public.equipment
  ADD COLUMN IF NOT EXISTS maintenance_shot_threshold INTEGER DEFAULT 50000,
  ADD COLUMN IF NOT EXISTS shots_at_last_maintenance  INTEGER DEFAULT 0;

-- Backfill default thresholds based on standard YSD equipment types (ADR-007)
UPDATE public.equipment
SET maintenance_shot_threshold = CASE
  WHEN equipment_type = 'MOLD' THEN 100000
  WHEN equipment_type = 'PLUG' THEN 80000
  WHEN equipment_type LIKE 'CUTTER%' THEN 50000
  ELSE 50000
END
WHERE maintenance_shot_threshold IS NULL OR maintenance_shot_threshold = 50000;

-- --------------------------------------------------------------------
-- 3. Create SSOT View for Equipment Lifecycle Status (Security Invoker)
-- --------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_equipment_lifecycle_status
WITH (security_invoker = true) AS
SELECT
  e.equipment_id,
  e.equipment_code,
  e.display_name,
  e.equipment_type,
  COALESCE(e.maintenance_shot_threshold, 50000)                             AS maintenance_shot_threshold,
  COALESCE(e.shots_at_last_maintenance, 0)                                 AS shots_at_last_maintenance,
  COALESCE(SUM(p.shot_count), 0)::bigint                                   AS total_shots,
  (COALESCE(SUM(p.shot_count), 0) - COALESCE(e.shots_at_last_maintenance, 0))::bigint AS current_shots_since_service,
  ROUND(
    (COALESCE(SUM(p.shot_count), 0) - COALESCE(e.shots_at_last_maintenance, 0))::numeric
    / NULLIF(COALESCE(e.maintenance_shot_threshold, 50000), 0) * 100, 1
  )                                                                         AS pct_life_used,
  CASE
    WHEN (COALESCE(SUM(p.shot_count), 0) - COALESCE(e.shots_at_last_maintenance, 0))
         >= COALESCE(e.maintenance_shot_threshold, 50000)                  THEN 'OVERDUE'
    WHEN (COALESCE(SUM(p.shot_count), 0) - COALESCE(e.shots_at_last_maintenance, 0))
         >= COALESCE(e.maintenance_shot_threshold, 50000) * 0.8            THEN 'WARNING'
    ELSE 'NORMAL'
  END                                                                       AS lifecycle_status
FROM public.equipment e
LEFT JOIN public.press_daily_logs p ON p.equipment_id = e.equipment_id
GROUP BY 
  e.equipment_id, 
  e.equipment_code, 
  e.display_name, 
  e.equipment_type, 
  e.maintenance_shot_threshold, 
  e.shots_at_last_maintenance;

-- Grant access to authenticated users & service_role
GRANT SELECT ON public.v_equipment_lifecycle_status TO authenticated, service_role;
