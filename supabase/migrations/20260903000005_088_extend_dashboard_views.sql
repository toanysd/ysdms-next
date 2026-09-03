-- Migration 088: Extend v_dashboard_executive_kpis with WO + Shipment counts
DROP VIEW IF EXISTS v_dashboard_executive_kpis;

CREATE VIEW v_dashboard_executive_kpis AS
SELECT
  (SELECT COUNT(*)::int FROM products) AS total_products,
  (SELECT COUNT(*)::int FROM design_revisions) AS total_design_revisions,
  (SELECT COUNT(*)::int FROM equipment) AS total_equipment,
  (SELECT COUNT(*)::int FROM equipment WHERE equipment_type = 'MOLD') AS total_physical_molds,
  (SELECT COUNT(*)::int FROM equipment WHERE equipment_type IN ('CUTTER_SEPARATE', 'CUTTER_INLINE')) AS total_cutters,
  (SELECT COUNT(*)::int FROM jobs) AS total_jobs,
  (SELECT COUNT(*)::int FROM work_logs) AS total_work_logs,
  (SELECT COUNT(*)::int FROM companies) AS total_companies,
  (SELECT COUNT(*)::int FROM quotations) AS total_quotations,
  (SELECT COUNT(*)::int FROM invoices) AS total_invoices,
  (SELECT COUNT(*)::int FROM work_orders) AS total_work_orders,
  (SELECT COUNT(*)::int FROM work_orders WHERE wo_status = 'IN_PROGRESS') AS active_work_orders,
  (SELECT COUNT(*)::int FROM work_orders WHERE wo_status = 'READY_FOR_PRODUCTION') AS ready_work_orders,
  (SELECT COUNT(*)::int FROM shipments) AS total_shipments,
  (SELECT COUNT(*)::int FROM shipments WHERE status = 'DELIVERED') AS delivered_shipments;
