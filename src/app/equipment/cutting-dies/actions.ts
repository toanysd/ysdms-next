'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertCutter(payload: {
  cutter_id?: string
  cutter_no: string
  cutter_name: string
  cutter_type: string
  cavity_count?: string
  pitch_mm?: number | null
  cutter_length_mm?: number | null
  cutter_width_mm?: number | null
  cutter_height_mm?: number | null
  base_type?: string
  company_id?: string | null
  design_revision_id?: string | null
  usage_status: string
  notes?: string
}) {
  try {
    const supabase = await createClient()

    const data = {
      cutter_no: payload.cutter_no,
      cutter_name: payload.cutter_name || payload.cutter_no,
      cutter_type: payload.cutter_type,
      cavity_count: payload.cavity_count || null,
      pitch_mm: payload.pitch_mm || null,
      cutter_length_mm: payload.cutter_length_mm || null,
      cutter_width_mm: payload.cutter_width_mm || null,
      cutter_height_mm: payload.cutter_height_mm || null,
      base_type: payload.base_type || null,
      company_id: payload.company_id || null,
      design_revision_id: payload.design_revision_id || null,
      usage_status: payload.usage_status,
      notes: payload.notes || null,
    }

    if (payload.cutter_id) {
      const { error } = await supabase
        .from('cutters')
        .update(data)
        .eq('cutter_id', payload.cutter_id)
      
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from('cutters')
        .insert(data)

      if (error) throw new Error(error.message)
    }

    revalidatePath('/equipment/cutting-dies')
    return { success: true }
  } catch (err: any) {
    console.error('[upsertCutter] Error:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteCutter(cutterId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('cutters').delete().eq('cutter_id', cutterId)
    if (error) throw new Error(error.message)

    revalidatePath('/equipment/cutting-dies')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

