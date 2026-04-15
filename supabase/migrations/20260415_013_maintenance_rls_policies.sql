-- ============================================================
-- Migration: 20260415_013_maintenance_rls_policies.sql
-- Tầng 5C (Bổ sung): Sửa lỗi linter (Security Definer) và Thêm RLS
-- ============================================================

-- 1. Bảo mật: Chuyển đổi các View mới sang Security Invoker
CREATE OR REPLACE VIEW public.v_mold_health
  WITH (security_invoker = true) AS
SELECT
  mp.id              AS physical_id,
  mp.physical_code,
  mp.status          AS mold_status,
  mp.cavity,
  mb.code            AS mold_base_code,
  mb.name            AS mold_name,
  mdr.revision_code,
  COALESCE(sc.total_shots, 0)        AS total_shots,
  sc.last_shot_date,
  ms.maintenance_type,
  ms.interval_shots,
  ms.alert_threshold_shots,
  COALESCE(sc.total_shots, 0) % NULLIF(ms.interval_shots, 0)
    AS shots_since_last_maintenance,
  ROUND(
    COALESCE(sc.total_shots, 0)::NUMERIC
    % NULLIF(ms.interval_shots, 0)::NUMERIC
    / NULLIF(ms.interval_shots, 0)::NUMERIC * 100, 1
  ) AS lifecycle_pct,
  CASE
    WHEN ms.interval_shots IS NULL THEN 'NO_SCHEDULE'
    WHEN (COALESCE(sc.total_shots,0) % ms.interval_shots) >= ms.interval_shots THEN 'OVERDUE'
    WHEN (COALESCE(sc.total_shots,0) % ms.interval_shots) >= ms.alert_threshold_shots THEN 'WARNING'
    ELSE 'OK'
  END AS health_status
FROM public.mold_physical mp
JOIN public.mold_design_revision mdr ON mp.revision_id = mdr.id
JOIN public.mold_base mb             ON mdr.mold_base_id = mb.id
LEFT JOIN public.mold_shot_counter sc ON sc.mold_physical_id = mp.id
LEFT JOIN public.mold_maintenance_schedule ms ON ms.revision_id = mdr.id
  AND ms.is_active = true;

CREATE OR REPLACE VIEW public.v_maintenance_overdue
  WITH (security_invoker = true) AS
SELECT *
FROM public.v_mold_health
WHERE health_status IN ('WARNING', 'OVERDUE')
ORDER BY lifecycle_pct DESC;


-- 2. Cấp quyền RLS Policies cho phép Server Actions (Next.js) có thể quét được

-- mold_shot_counter
CREATE POLICY "authenticated_read_shot_counter" ON public.mold_shot_counter
  FOR SELECT TO authenticated USING (true);

-- mold_maintenance_schedule
CREATE POLICY "authenticated_read_maintenance_schedule" ON public.mold_maintenance_schedule
  FOR SELECT TO authenticated USING (true);

-- mold_maintenance_log
CREATE POLICY "authenticated_read_maintenance_log" ON public.mold_maintenance_log
  FOR SELECT TO authenticated USING (true);
