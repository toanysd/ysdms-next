'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ReviseMoldPayload = {
  physical_mold_id: string
  new_design_revision_id: string
  new_display_name: string
  notes?: string
}

export async function revisePhysicalMoldAction(payload: ReviseMoldPayload) {
  try {
    const supabase = await createClient()

    // 1. Find the mold_revisions record for the target design_revision_id
    const { data: revData, error: revErr } = await supabase
      .from('mold_revisions')
      .select('revision_id, product_id')
      .eq('design_revision_id', payload.new_design_revision_id)
      .single()

    if (revErr || !revData) {
      throw new Error('Target design revision does not have a linked mold_revisions record.')
    }

    // 2. Fetch current physical mold to log the change
    const { data: currentMold, error: currErr } = await supabase
      .from('physical_molds')
      .select('display_name, mold_revision_id')
      .eq('physical_mold_id', payload.physical_mold_id)
      .single()

    if (currErr || !currentMold) {
      throw new Error('Physical mold not found.')
    }

    // 3. Update physical_molds
    const { error: updateErr } = await supabase
      .from('physical_molds')
      .update({
        mold_revision_id: revData.revision_id,
        display_name: payload.new_display_name,
        system_code: payload.new_display_name // keeping them in sync for now as requested
      })
      .eq('physical_mold_id', payload.physical_mold_id)

    if (updateErr) throw new Error(updateErr.message)

    // 4. Log the change in equipment_status_logs
    const auth = await supabase.auth.getUser()
    const { error: logErr } = await supabase
      .from('equipment_status_logs')
      .insert({
        physical_mold_id: payload.physical_mold_id,
        status: 'REVISED',
        notes: `Revised from [${currentMold.display_name}] to [${payload.new_display_name}]. ${payload.notes || ''}`
      })

    if (logErr) {
      console.warn('Failed to log revision', logErr)
    }

    revalidatePath('/equipment/molds')
    revalidatePath(`/equipment/molds/${payload.physical_mold_id}`)
    if (revData.product_id) {
      revalidatePath(`/engineering/designs/${revData.product_id}`)
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
