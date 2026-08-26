-- Migration: 20260820170000_r5_s3_dashboard_aggregates.sql
-- Description: Server-side aggregate views for Executive Dashboard (Fix 1,000 rows limit)

CREATE OR REPLACE VIEW public.v_equipment_type_summary AS
SELECT 
  equipment_type,
  COUNT(*)::int AS total_count,
  COUNT(CASE WHEN UPPER(COALESCE(device_status, '')) IN ('NORMAL', 'ACTIVE', 'IN_STOCK', 'IN_USE') THEN 1 END)::int AS active_count,
  COUNT(CASE WHEN UPPER(COALESCE(device_status, '')) NOT IN ('NORMAL', 'ACTIVE', 'IN_STOCK', 'IN_USE') THEN 1 END)::int AS maintenance_count
FROM public.equipment
GROUP BY equipment_type;

CREATE OR REPLACE VIEW public.v_job_status_summary AS
SELECT 
  COALESCE(job_status, 'DRAFT') AS job_status,
  COUNT(*)::int AS count,
  COALESCE(AVG(overall_progress), 0)::numeric(5,2) AS avg_progress
FROM public.jobs
GROUP BY job_status;

CREATE OR REPLACE VIEW public.v_dashboard_executive_kpis AS
SELECT
  (SELECT COUNT(*)::int FROM public.products) AS total_products,
  (SELECT COUNT(*)::int FROM public.design_revisions) AS total_design_revisions,
  (SELECT COUNT(*)::int FROM public.equipment) AS total_equipment,
  (SELECT COUNT(*)::int FROM public.equipment WHERE equipment_type = 'MOLD') AS total_physical_molds,
  (SELECT COUNT(*)::int FROM public.equipment WHERE equipment_type IN ('CUTTER_SEPARATE', 'CUTTER_INLINE')) AS total_cutters,
  (SELECT COUNT(*)::int FROM public.jobs) AS total_jobs,
  (SELECT COUNT(*)::int FROM public.work_logs) AS total_work_logs,
  (SELECT COUNT(*)::int FROM public.companies) AS total_companies,
  (SELECT COUNT(*)::int FROM public.quotations) AS total_quotations,
  (SELECT COUNT(*)::int FROM public.invoices) AS total_invoices;
