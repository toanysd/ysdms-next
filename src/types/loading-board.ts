export interface MachineInstance {
  id: string
  internal_code: string
  name: string
  status: 'ACTIVE' | 'DOWN' | 'MAINTENANCE'
}

export interface PendingOrder {
  order_item_id: string
  slip_no: string
  product_pn_raw: string
  quantity: number
  delivery_date: string | null
  urgency: 'CRITICAL' | 'WARNING' | 'NORMAL' | 'UNKNOWN'
}

export interface ProductionPlan {
  id: string
  order_item_id: string
  machine_instance_id: string
  mold_physical_id: string | null
  planned_date: string // YYYY-MM-DD
  shift: 'DAY' | 'NIGHT'
  planned_quantity: number
  estimated_shots: number
  operator_name: string | null
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
  // joined info for display
  slip_no?: string
  product_pn_raw?: string
}

export interface MoldPhysical {
  id: string
  physical_code: string
  cavity: number
}
