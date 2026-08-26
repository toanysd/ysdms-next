-- ==============================================================================
-- Migration: 20260820090000_cleanup_prototype_data.sql
-- Description: Chuẩn hóa lại design_category và dọn dẹp các bước '試作金型作成' thừa
--              trên các job thiết kế lượng sản, đồng thời liên kết dữ liệu cũ.
-- ==============================================================================

-- Step 1: Update design_revisions wrongfully marked as PROTOTYPE_POCKET to MASS_PRODUCTION
UPDATE public.design_revisions
SET design_category = 'MASS_PRODUCTION'
WHERE design_category = 'PROTOTYPE_POCKET'
  AND UPPER(design_code) NOT LIKE '%-D'
  AND UPPER(design_code) NOT LIKE '%_D'
  AND UPPER(design_code) NOT LIKE '% R0-D'
  AND UPPER(design_code) NOT LIKE '%試作%';

-- Step 2: Ensure any revision with '-D' or '試作' is explicitly set to PROTOTYPE_POCKET
UPDATE public.design_revisions
SET design_category = 'PROTOTYPE_POCKET'
WHERE (UPPER(design_code) LIKE '%-D' OR UPPER(design_code) LIKE '%_D' OR UPPER(design_code) LIKE '% R0-D' OR UPPER(design_code) LIKE '%試作%')
  AND (design_category IS NULL OR design_category != 'PROTOTYPE_POCKET');

-- Step 3: Remove unstarted '試作金型作成' steps from Design Jobs belonging to MASS_PRODUCTION designs
DELETE FROM public.job_steps
WHERE step_name = '試作金型作成'
  AND step_status = 'NOT_STARTED'
  AND job_id IN (
    SELECT j.job_id
    FROM public.jobs j
    JOIN public.design_revisions dr ON j.design_revision_id = dr.revision_id
    WHERE dr.design_category = 'MASS_PRODUCTION'
  );
