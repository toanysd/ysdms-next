'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. checkInMold
export async function checkInMold(moldId: string, rackLayerId: string, operatorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: equip } = await supabase
      .from('equipment')
      .select('current_rack_layer_id')
      .eq('equipment_id', moldId)
      .single()

    const currentRackLayerId = equip?.current_rack_layer_id

    // Log location into canonical asset_location_logs (ADR-008)
    if (currentRackLayerId !== rackLayerId) {
      const { error: logErr } = await supabase
        .from('asset_location_logs')
        .insert({
          asset_id: moldId,
          asset_type: 'MOLD',
          old_rack_layer_id: currentRackLayerId || null,
          new_rack_layer_id: rackLayerId,
          moved_by: operatorId || null,
          notes: 'Check-in to rack'
        })
      if (logErr) console.warn(`Asset location log note: ${logErr.message}`)
    }

    const { error: updateError } = await supabase
      .from('equipment')
      .update({
        usage_status: 'IN_STOCK',
        current_rack_layer_id: rackLayerId,
        updated_at: new Date().toISOString()
      })
      .eq('equipment_id', moldId)

    if (updateError) throw new Error(`Failed to update equipment: ${updateError.message}`)

    revalidatePath('/equipment/molds')
    return { success: true }
  } catch (err) {
    console.error('[checkInMold]', err)
    return { success: false, error: (err as Error).message }
  }
}

// 2. checkOutMold
export async function checkOutMold(
  moldId: string,
  _companyId?: string,
  _handlerId?: string,
  _payload?: {
    ship_date?: string
    return_date?: string
    item_type_id?: string
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error: updateError } = await supabase
      .from('equipment')
      .update({
        usage_status: 'SHIPPED',
        current_rack_layer_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('equipment_id', moldId)

    if (updateError) throw new Error(`Failed to update equipment: ${updateError.message}`)

    revalidatePath('/equipment/molds')
    return { success: true }
  } catch (err) {
    console.error('[checkOutMold]', err)
    return { success: false, error: (err as Error).message }
  }
}

// 3. relocateMold
export async function relocateMold(moldId: string, newRackLayerId: string, operatorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: equip } = await supabase
      .from('equipment')
      .select('current_rack_layer_id')
      .eq('equipment_id', moldId)
      .single()

    const currentRackLayerId = equip?.current_rack_layer_id

    // Log location into canonical asset_location_logs (ADR-008)
    if (currentRackLayerId !== newRackLayerId) {
      const { error: logErr } = await supabase
        .from('asset_location_logs')
        .insert({
          asset_id: moldId,
          asset_type: 'MOLD',
          old_rack_layer_id: currentRackLayerId || null,
          new_rack_layer_id: newRackLayerId,
          moved_by: operatorId || null,
          notes: 'Relocate mold'
        })
      if (logErr) console.warn(`Asset location log note: ${logErr.message}`)
    }

    const { error: updateError } = await supabase
      .from('equipment')
      .update({
        current_rack_layer_id: newRackLayerId,
        updated_at: new Date().toISOString()
      })
      .eq('equipment_id', moldId)

    if (updateError) throw new Error(`Failed to update equipment: ${updateError.message}`)

    revalidatePath('/equipment/molds')
    return { success: true }
  } catch (err) {
    console.error('[relocateMold]', err)
    return { success: false, error: (err as Error).message }
  }
}
