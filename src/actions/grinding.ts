'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createGrindingLog(data: {
  log_date: string
  employee_id: string
  material_type: string
  weight_kg: number
  bag_count?: number
  notes?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('grinding_daily_logs').insert([{
    log_date: data.log_date,
    employee_id: data.employee_id,
    material_type: data.material_type,
    weight_kg: data.weight_kg,
    bag_count: data.bag_count || null,
    notes: data.notes || null
  }])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/production/grinding')
}
