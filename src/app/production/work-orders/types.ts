// ═══════════════════════════════════════════════════════════════════════════
// Types: Work Order & Equipment SET Resolution (Milestone 19 - ADR-010)
// ═══════════════════════════════════════════════════════════════════════════

export type WOReadinessStatus = 
  | 'READY' 
  | 'IN_USE' 
  | 'MAINTENANCE' 
  | 'LOANED_OUT' 
  | 'MISSING_RACK' 
  | 'NOT_READY'

export type WOStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface EquipmentSetMember {
  equipment_id: string
  equipment_code: string
  equipment_name: string
  equipment_type: string
  device_status: string | null
  usage_status: string | null
  owner_company_name: string | null
  keeper_company_name: string | null
  current_rack_layer_id: string | null
  layer_code: string | null
  rack_code: string | null
  zone_code: string | null
  assignment_type: string
  readiness_status: WOReadinessStatus
  active_loan_code: string | null
  loan_scheduled_return_date: string | null
}

export interface SuggestedSharedEquipment {
  equipment_id: string
  equipment_code: string
  equipment_name: string
  equipment_type: string
  device_status: string | null
  usage_status: string | null
  current_rack_layer_id: string | null
  layer_code: string | null
  rack_code: string | null
  match_reason: string
  readiness_status: WOReadinessStatus
}

export interface WOSetSummary {
  total_items: number
  ready_items: number
  has_mold: boolean
  has_cutter: boolean
  is_all_ready: boolean
}

export interface WOEquipmentSetResult {
  wo_id: string
  wo_code: string
  wo_name: string
  wo_status: WOStatus
  product_id: string | null
  product_code: string | null
  product_name: string | null
  product_name_internal: string | null
  design_revision_id: string | null
  design_code: string | null
  revision_number: number | null
  plastic_type_designed: string | null
  cutline_length: number | null
  cutline_width: number | null
  primary_mold: EquipmentSetMember | null
  set_members: EquipmentSetMember[]
  suggested_shared: SuggestedSharedEquipment[]
  summary: WOSetSummary
}

export interface WorkOrderListItem {
  wo_id: string
  wo_code: string
  wo_name: string
  wo_type: string
  wo_status: WOStatus
  start_date: string | null
  deadline: string | null
  priority: number
  company_id: string | null
  company_name: string | null
  product_id: string | null
  product_code: string | null
  product_name: string | null
  total_set_items: number
  ready_set_items: number
  is_set_ready: boolean
  is_overdue: boolean
}

export interface WorkOrderKpis {
  in_progress: number
  planned: number
  overdue: number
  completed: number
}

export interface WorkOrderWorklogItem {
  log_id: string
  job_id: string
  job_code: string | null
  job_name: string | null
  step_id: string | null
  step_name: string | null
  employee_id: string
  employee_name: string | null
  machine_id: string | null
  machine_name: string | null
  work_date: string
  hours_spent: number | null
  quantity_done: number | null
  quantity_ng: number
  is_finished: boolean | null
  notes: string | null
  created_at: string | null
}

