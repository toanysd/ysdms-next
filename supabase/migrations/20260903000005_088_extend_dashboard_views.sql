-- Migration 088: Extend v_dashboard_executive_kpis with Work Orders + Shipments counts
CREATE OR REPLACE VIEW v_dashboard_executive_kpis AS
SELECT
  (SELECT COUNT(*) FROM products) AS total_products,
  (SELECT COUNT(*) FROM design_revisions) AS total_design_revisions,
  (SELECT COUNT(*) FROM equipment) AS total_equipment,
  (SELECT COUNT(*) FROM equipment WHERE equipment_type = 'MOLD') AS total_physical_molds,
  (SELECT COUNT(*) FROM equipment WHERE equipment_type IN ('CUTTER_SEPARATE', 'CUTTER_INLINE')) AS total_cutters,
  (SELECT COUNT(*) FROM jobs) AS total_jobs,
  (SELECT COUNT(*) FROM work_logs) AS total_work_logs,
  (SELECT COUNT(*) FROM companies) AS total_companies,
  (SELECT COUNT(*) FROM quotations) AS total_quotations,
  (SELECT COUNT(*) FROM invoices) AS total_invoices,
  (SELECT COUNT(*) FROM work_orders) AS total_work_orders,
  (SELECT COUNT(*) FROM work_orders WHERE wo_status = 'IN_PROGRESS') AS active_work_orders,
  (SELECT COUNT(*) FROM work_orders WHERE wo_status = 'READY_FOR_PRODUCTION') AS ready_work_orders,
  (SELECT COUNT(*) FROM shipments) AS total_shipments,
  (SELECT COUNT(*) FROM shipments WHERE status = 'DELIVERED') AS delivered_shipments;
