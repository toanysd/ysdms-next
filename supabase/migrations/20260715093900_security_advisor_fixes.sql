-- Fix RLS cho business_cases
CREATE POLICY "authenticated_all_business_cases"
ON public.business_cases
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix search_path for functions (omit arguments if unique)
ALTER FUNCTION public.trg_update_step_status_from_worklogs SET search_path = public;
ALTER FUNCTION public.trg_update_job_status_from_steps SET search_path = public;
ALTER FUNCTION public.calculate_plastic_mrp_v2 SET search_path = public;
ALTER FUNCTION public.set_updated_at SET search_path = public;

-- Fix security definer cho audit_trigger_func
REVOKE EXECUTE ON FUNCTION public.audit_trigger_func FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.audit_trigger_func FROM anon;
REVOKE EXECUTE ON FUNCTION public.audit_trigger_func FROM authenticated;
GRANT EXECUTE ON FUNCTION public.audit_trigger_func TO postgres;
