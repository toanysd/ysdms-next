-- Migration 090: View v_tray_schedule_gantt for M13 Tray Production Schedule
CREATE OR REPLACE VIEW public.v_tray_schedule_gantt AS
SELECT
  ps.schedule_id,
  ps.schedule_date,
  ps.scheduled_start,
  ps.scheduled_end,
  ps.shift,
  ps.status,
  ps.planned_quantity,
  ps.actual_quantity,
  ps.notes,
  -- Machine
  m.machine_id,
  m.machine_code,
  m.machine_name,
  m.machine_group,
  -- Product
  p.product_id,
  p.product_code,
  p.product_name_internal,
  p.product_name,
  -- Work Order
  wo.wo_id AS work_order_id,
  wo.wo_code AS wo_no,
  wo.wo_code,
  wo.wo_name,
  -- Order (deadline)
  o.order_id,
  o.order_no,
  o.requested_delivery,
  o.order_status,
  -- Plastic Roll
  prr.id AS roll_id,
  prr.roll_barcode,
  prr.commercial_grade_code AS plastic_grade,
  prr.current_length_m AS roll_remaining_m,
  prr.status AS roll_status,
  -- Operator
  e.employee_id AS operator_id,
  e.employee_name AS operator_name,
  e.employee_name_short AS operator_short
FROM public.production_schedules ps
LEFT JOIN public.machines m ON m.machine_id = ps.machine_id
LEFT JOIN public.products p ON p.product_id = ps.product_id
LEFT JOIN public.work_orders wo ON wo.wo_id = ps.work_order_id
LEFT JOIN public.orders o ON o.order_id = wo.order_id
LEFT JOIN public.plastic_receipt_roll prr ON prr.id = ps.roll_id
LEFT JOIN public.employees e ON e.employee_id = ps.operator_id;

COMMENT ON VIEW public.v_tray_schedule_gantt IS 
  'M13 Tray Production Gantt — unified view for /production/schedule Tray tab. Source: production_schedules + machines + products + work_orders + orders + plastic_receipt_roll + employees';
