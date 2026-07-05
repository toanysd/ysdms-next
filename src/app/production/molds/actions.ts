'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. checkInMold
export async function checkInMold(moldId: string, rackLayerId: string, operatorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: mold } = await supabase
      .from('physical_molds')
      .select('current_rack_layer_id')
      .eq('physical_mold_id', moldId)
      .single()

    const currentRackLayerId = mold?.current_rack_layer_id

    // Log location
    const { error: locError } = await supabase
      .from('mold_location_history')
      .insert({
        physical_mold_id: moldId,
        old_rack_layer_id: currentRackLayerId,
        new_rack_layer_id: rackLayerId,
        moved_by: operatorId
      })
      
    if (locError) throw new Error(`Failed to log location: ${locError.message}`)

    const { error: updateError } = await supabase
      .from('physical_molds')
      .update({
        usage_status: 'IN_STOCK',
        current_rack_layer_id: rackLayerId
      })
      .eq('physical_mold_id', moldId)

    if (updateError) throw new Error(`Failed to update mold: ${updateError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
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
        mold_owner_id: null, // Depending on if we track owner
        requested_date: payload?.ship_date ?? new Date().toISOString().split('T')[0],
        issued_date: payload?.ship_date ?? new Date().toISOString().split('T')[0],
        issued_by: handlerId,
        prepared_by: handlerId,
        status: 'SHIPPED',
        notes: payload?.notes ?? null
      })

    if (shipError) throw new Error(`Failed to log shipment: ${shipError.message}`)

    const { error: updateError } = await supabase
      .from('physical_molds')
      .update({
        usage_status: 'SHIPPED',
        current_rack_layer_id: null
      })
      .eq('physical_mold_id', moldId)

    if (updateError) throw new Error(`Failed to update mold: ${updateError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
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

    const { data: mold } = await supabase
      .from('physical_molds')
      .select('current_rack_layer_id')
      .eq('physical_mold_id', moldId)
      .single()

    const currentRackLayerId = mold?.current_rack_layer_id

    const { error: locError } = await supabase
      .from('mold_location_history')
      .insert({
        physical_mold_id: moldId,
        old_rack_layer_id: currentRackLayerId,
        new_rack_layer_id: newRackLayerId,
        moved_by: operatorId
      })

    if (locError) throw new Error(`Failed to log location: ${locError.message}`)

    const { error: updateError } = await supabase
      .from('physical_molds')
      .update({
        current_rack_layer_id: newRackLayerId
      })
      .eq('physical_mold_id', moldId)

    if (updateError) throw new Error(`Failed to update mold: ${updateError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
    return { success: true }
  } catch (err) {
    console.error('[relocateMold]', err)
    return { success: false, error: (err as Error).message }
  }
}


