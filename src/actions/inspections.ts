'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInspectionLog(data: {
  log_date: string
  inspector_id: string
  product_id?: string
  order_line_id?: string
  lot_size?: number
  sample_size?: number
  qty_wc: number
  qty_sc: number
  qty_dt: number
  qty_fm: number
  qty_bh: number
  qty_br: number
  qty_sd: number
  qty_ot: number
  result: string
  disposition?: string
  notes?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('inspection_daily_logs').insert([{
    log_date: data.log_date,
    inspector_id: data.inspector_id,
    product_id: data.product_id || null,
    order_line_id: data.order_line_id || null,
    lot_size: data.lot_size || null,
    sample_size: data.sample_size || null,
    qty_wc: data.qty_wc,
    qty_sc: data.qty_sc,
    qty_dt: data.qty_dt,
    qty_fm: data.qty_fm,
    qty_bh: data.qty_bh,
    qty_br: data.qty_br,
    qty_sd: data.qty_sd,
    qty_ot: data.qty_ot,
    result: data.result,
    disposition: data.disposition || null,
    notes: data.notes || null
  }])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/quality/daily-inspection')
}
