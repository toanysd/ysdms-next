-- =================================================================================
-- Migration 049: Fix Legacy ID Unique Constraints
-- Cần thiết cho hàm UPSERT (ON CONFLICT) hoạt động
-- =================================================================================

ALTER TABLE public.mold_design_revision ADD CONSTRAINT uq_mold_design_legacy_id UNIQUE (legacy_id);
ALTER TABLE public.mold_physical ADD CONSTRAINT uq_mold_physical_legacy_id UNIQUE (legacy_id);
ALTER TABLE public.mold_jobs ADD CONSTRAINT uq_mold_jobs_legacy_id UNIQUE (legacy_id);
ALTER TABLE public.mold_work_logs ADD CONSTRAINT uq_mold_work_logs_legacy_id UNIQUE (legacy_id);
