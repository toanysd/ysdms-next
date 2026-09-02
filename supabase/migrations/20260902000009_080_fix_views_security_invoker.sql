-- Migration 080: fix_views_security_invoker
ALTER VIEW material_inventory_v2     SET (security_invoker = on);
ALTER VIEW v_customer_debt_summary   SET (security_invoker = on);
ALTER VIEW v_dashboard_executive_kpis SET (security_invoker = on);
ALTER VIEW v_equipment_type_summary  SET (security_invoker = on);
ALTER VIEW v_job_status_summary      SET (security_invoker = on);
