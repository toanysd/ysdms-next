'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPlasticMaster(data: {
  plastic_code: string
  plastic_family: string
  thickness_mm: number
  width_mm: number
  color?: string
  properties?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('plastic_master').insert([
    {
      plastic_code: data.plastic_code,
      plastic_family: data.plastic_family,
      thickness_mm: data.thickness_mm,
      width_mm: data.width_mm,
      color: data.color || null,
      properties: data.properties || null
    }
  ])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/equipment/plastics')
}

export async function addProductionLog(data: {
  job_id?: string
  roll_id: string
  meters_consumed: number
  meters_remaining: number
  meters_wasted: number
}) {
  const supabase = await createClient()

  // Start a transaction-like update
  // First update roll
  const { error: rollError } = await supabase.from('plastic_receipt_roll')
    .update({ current_length_m: data.meters_remaining })
    .eq('id', data.roll_id)
  
  if (rollError) {
    throw new Error(rollError.message)
  }

  // Then add production log
  const { error: logError } = await supabase.from('production_log').insert([
    {
      job_id: data.job_id || null,
      roll_id: data.roll_id,
      meters_consumed: data.meters_consumed,
      meters_remaining: data.meters_remaining,
      meters_wasted: data.meters_wasted
    }
  ])

  if (logError) {
    throw new Error(logError.message)
  }

  revalidatePath('/equipment/plastics')
}
