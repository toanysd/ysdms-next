'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ReviseMoldPayload = {
  equipment_id: string
  new_design_revision_id: string
  new_display_name: string
  notes?: string
}

export async function revisePhysicalMoldAction(payload: ReviseMoldPayload) {
  try {
    const supabase = await createClient()

    // 1. Find target design_revision directly
    const { data: revData, error: revErr } = await supabase
      .from('design_revisions')
      .select('revision_id, product_id')
      .eq('revision_id', payload.new_design_revision_id)
      .single()

    if (revErr || !revData) {
      throw new Error('Target design revision not found.')
    }

    // 2. Fetch current equipment/mold
    const { data: currentMold, error: currErr } = await supabase
      .from('equipment')
      .select('display_name, design_revision_id')
      .eq('equipment_id', payload.equipment_id)
      .single()

    if (currErr || !currentMold) {
      throw new Error('Physical mold equipment not found.')
    }

    // 3. Update equipment directly
    const { error: updateErr } = await supabase
      .from('equipment')
      .update({
        design_revision_id: revData.revision_id,
        display_name: payload.new_display_name,
        equipment_code: payload.new_display_name
      })
      .eq('equipment_id', payload.equipment_id)

    if (updateErr) throw new Error(updateErr.message)

    revalidatePath('/equipment/molds')
    revalidatePath(`/equipment/molds/${payload.equipment_id}`)
    if (revData.product_id) {
      revalidatePath(`/engineering/designs/${revData.product_id}`)
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
