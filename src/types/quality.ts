// Types for Quality module
export interface NGDetailLog {
  ng_log_id: string
  inspection_id: string
  ng_category: string | null
  ng_description: string | null
  ng_qty: number
  photo_path: string | null
  created_at: string
  // Joined relation
  inspections?: {
    inspection_date: string | null
    inspection_stage: string | null
    production_lots?: {
      lot_no: string | null
      production_orders?: {
        order_no: string | null
        products?: {
          product_code: string | null
          product_name: string | null
        } | null
      } | null
    } | null
  } | null
}

export interface NGStatisticsResult {
  data: NGDetailLog[]
  error?: string
}
