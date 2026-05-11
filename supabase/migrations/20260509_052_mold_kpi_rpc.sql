-- =================================================================================
-- Migration 052: Mold Dashboard KPIs RPC
-- Purpose: Returns fast aggregated counts for the Mold Work Center dashboard
-- =================================================================================

CREATE OR REPLACE FUNCTION public.get_mold_dashboard_kpis()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'cnt_in', COUNT(*) FILTER (WHERE checkin_status = 'IN'),
    'cnt_out', COUNT(*) FILTER (WHERE checkin_status = 'OUT'),
    'cnt_teflon', COUNT(*) FILTER (WHERE teflon_count > 0 AND last_teflon_date >= CURRENT_DATE - INTERVAL '30 days'),
    'cnt_total', COUNT(*)
  ) INTO result
  FROM public.mold_physical;
  
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_mold_dashboard_kpis() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mold_dashboard_kpis() TO service_role;
