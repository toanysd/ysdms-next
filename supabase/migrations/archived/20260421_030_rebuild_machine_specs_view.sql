-- ============================================================
-- MIGRATION 030: REBUILD MACHINE EFFECTIVE SPECS VIEW
-- Đảm bảo View join đúng với schema mới nhất (instance -> model -> type)
-- ============================================================

BEGIN;

DROP VIEW IF EXISTS public.v_machine_effective_specs CASCADE;

CREATE OR REPLACE VIEW public.v_machine_effective_specs AS
SELECT
  mi.id               AS instance_id,
  mi.internal_code,
  mi.name             AS machine_name,
  mi.status,
  mi.location,
  mm.id               AS machine_model_id,
  mm.model_code,
  mm.manufacturer,
  mt.id               AS machine_type_id,
  mt.code             AS type_code,
  mt.name_vi          AS type_name,
  mt.name_jp          AS type_name_jp,
  mt.spec_schema,
  -- Merge: model specs + instance overrides (instance wins)
  mm.specs || COALESCE(mi.specs_override, '{}'::jsonb) AS effective_specs
FROM public.machine_instance mi
JOIN public.machine_model   mm ON mm.id = mi.machine_model_id
JOIN public.machine_type    mt ON mt.id = mm.machine_type_id;

COMMIT;
