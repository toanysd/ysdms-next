'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFormingLog(data: {
  log_date: string
  operator_id: string
  product_id?: string
  equipment_id?: string
  qty_ok: number
  qty_ng_a: number
  qty_ng_b: number
  qty_ng_c: number
  qty_ng_d: number
  qty_ng_e: number
  qty_ng_f: number
  qty_ng_g: number
  check_heater: boolean
  check_mold: boolean
  check_cutter: boolean
  check_plug: boolean
  check_frame: boolean
  check_water_base: boolean
  check_stacking: boolean
  notes?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('forming_daily_logs').insert([{
    log_date: data.log_date,
    operator_id: data.operator_id,
    product_id: data.product_id || null,
    equipment_id: data.equipment_id || null,
    qty_ok: data.qty_ok,
    qty_ng_a: data.qty_ng_a,
    qty_ng_b: data.qty_ng_b,
    qty_ng_c: data.qty_ng_c,
    qty_ng_d: data.qty_ng_d,
    qty_ng_e: data.qty_ng_e,
    qty_ng_f: data.qty_ng_f,
    qty_ng_g: data.qty_ng_g,
    check_heater: data.check_heater,
    check_mold: data.check_mold,
    check_cutter: data.check_cutter,
    check_plug: data.check_plug,
    check_frame: data.check_frame,
    check_water_base: data.check_water_base,
    check_stacking: data.check_stacking,
    notes: data.notes || null
  }])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/production/daily-logs')
}

export async function createPressLog(data: {
  log_date: string
  operator_id: string
  product_id?: string
  equipment_id?: string
  qty_ok: number
  qty_ng: number
  shot_count?: number
  cutter_condition?: string
  notes?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('press_daily_logs').insert([{
    log_date: data.log_date,
    operator_id: data.operator_id,
    product_id: data.product_id || null,
    equipment_id: data.equipment_id || null,
    qty_ok: data.qty_ok,
    qty_ng: data.qty_ng,
    shot_count: data.shot_count || null,
    cutter_condition: data.cutter_condition || null,
    notes_vi: data.notes || null, // Map to notes_vi since press_daily_logs has notes_vi/ja
  }])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/production/daily-logs')
}
