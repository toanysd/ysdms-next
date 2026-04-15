-- ============================================================
-- Migration: 20260415_012_mold_maintenance_layer.sql
-- Tầng 5C: Vòng đời & Bảo trì Khuôn
-- ============================================================

-- [FIX 5B] Thêm current_weight_kg vào plastic_roll
-- NOTE: Antigravity dời thành regular column + trigger deduct sau, tạm thời tạo cột
ALTER TABLE public.plastic_roll
  ADD COLUMN IF NOT EXISTS current_weight_kg NUMERIC;

-- 1. mold_shot_counter — gắn vào mold_physical
CREATE TABLE IF NOT EXISTS public.mold_shot_counter (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mold_physical_id UUID NOT NULL REFERENCES public.mold_physical(id) ON DELETE CASCADE,
  total_shots     BIGINT NOT NULL DEFAULT 0,
  last_shot_date  TIMESTAMPTZ,
  last_updated    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_shot_counter_physical UNIQUE (mold_physical_id)
);

-- 2. mold_maintenance_schedule — gắn vào revision (định mức)
CREATE TABLE IF NOT EXISTS public.mold_maintenance_schedule (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id           UUID NOT NULL REFERENCES public.mold_design_revision(id),
  maintenance_type      TEXT NOT NULL DEFAULT 'routine',
  interval_shots        BIGINT NOT NULL,
  alert_threshold_shots BIGINT NOT NULL,
  is_active             BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_threshold CHECK (alert_threshold_shots < interval_shots)
);

-- 3. mold_maintenance_log — gắn vào mold_physical
CREATE TABLE IF NOT EXISTS public.mold_maintenance_log (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mold_physical_id     UUID NOT NULL REFERENCES public.mold_physical(id),
  maintenance_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  performed_by         TEXT,
  shots_at_maintenance BIGINT,
  maintenance_type     TEXT DEFAULT 'routine',
  action_taken         TEXT,
  cost                 NUMERIC(12,0),
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.mold_shot_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_maintenance_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_maintenance_log ENABLE ROW LEVEL SECURITY;

-- 5. View: v_mold_health
CREATE OR REPLACE VIEW public.v_mold_health AS
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

-- 6. View: v_maintenance_overdue
CREATE OR REPLACE VIEW public.v_maintenance_overdue AS
SELECT *
FROM public.v_mold_health
WHERE health_status IN ('WARNING', 'OVERDUE')
ORDER BY lifecycle_pct DESC;
