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

    // Log location
    const { error: locError } = await supabase
      .from('mold_location_history')
      .insert({
        physical_mold_id: moldId,
        old_rack_layer_id: currentRackLayerId,
        new_rack_layer_id: rackLayerId,
        moved_by: operatorId
      })
      
    if (locError) console.warn(`Location history log note: ${locError.message}`)

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
  companyId: string,
  handlerId: string,
  payload?: {
    ship_date?: string
    return_date?: string
    item_type_id?: string
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error: shipError } = await supabase
      .from('mold_loan_certificates')
      .insert({
        mold_owner_id: companyId,
        requested_date: payload?.ship_date ?? new Date().toISOString().split('T')[0],
        issued_date: payload?.ship_date ?? new Date().toISOString().split('T')[0],
        issued_by: handlerId,
        prepared_by: handlerId,
        status: 'SHIPPED',
        notes: payload?.notes ?? null
      })

    if (shipError) console.warn(`Loan cert log note: ${shipError.message}`)

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

    const { error: locError } = await supabase
      .from('mold_location_history')
      .insert({
        physical_mold_id: moldId,
        old_rack_layer_id: currentRackLayerId,
        new_rack_layer_id: newRackLayerId,
        moved_by: operatorId
      })

    if (locError) console.warn(`Location history log note: ${locError.message}`)

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
