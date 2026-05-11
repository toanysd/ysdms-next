'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. checkInMold
export async function checkInMold(moldId: string, rackLayerId: string, operatorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { data: mold } = await supabase
      .from('mold_physical')
      .select('current_rack_layer_id')
      .eq('id', moldId)
      .single()

    const currentRackLayerId = mold?.current_rack_layer_id

    const { error: statusError } = await supabase
      .from('mold_status_logs')
      .insert({
        mold_physical_id: moldId,
        status: 'IN',
        employee_id: operatorId
      })

    if (statusError) throw new Error(`Failed to log status: ${statusError.message}`)

    // 🔴 Điểm 1: Luôn INSERT mold_location_logs
    const { error: locError } = await supabase
      .from('mold_location_logs')
      .insert({
        mold_physical_id: moldId,
        from_rack_layer_id: currentRackLayerId,
        to_rack_layer_id: rackLayerId,
        moved_by: operatorId
      })
      
    if (locError) throw new Error(`Failed to log location: ${locError.message}`)

    const { error: updateError } = await supabase
      .from('mold_physical')
      .update({
        checkin_status: 'IN',
        current_rack_layer_id: rackLayerId
      })
      .eq('id', moldId)

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
    const supabase = createClient()

    const { error: shipError } = await supabase
      .from('mold_ship_logs')
      .insert({
        mold_physical_id: moldId,
        direction: 'SHIP_OUT',
        company_id: companyId,
        handler_id: handlerId,
        ship_date: payload?.ship_date ?? new Date().toISOString().split('T')[0],
        return_date: payload?.return_date ?? null,
        item_type_id: payload?.item_type_id ?? null,
        notes: payload?.notes ?? null
      })

    if (shipError) throw new Error(`Failed to log shipment: ${shipError.message}`)

    const { error: updateError } = await supabase
      .from('mold_physical')
      .update({
        checkin_status: 'OUT',
        current_rack_layer_id: null
      })
      .eq('id', moldId)

    if (updateError) throw new Error(`Failed to update mold: ${updateError.message}`)

    const { error: statusError } = await supabase
      .from('mold_status_logs')
      .insert({
        mold_physical_id: moldId,
        status: 'OUT',
        employee_id: handlerId,
        notes: payload?.notes || null
      })

    if (statusError) throw new Error(`Failed to log status: ${statusError.message}`)

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
    const supabase = createClient()

    const { data: mold } = await supabase
      .from('mold_physical')
      .select('current_rack_layer_id')
      .eq('id', moldId)
      .single()

    const currentRackLayerId = mold?.current_rack_layer_id

    const { error: locError } = await supabase
      .from('mold_location_logs')
      .insert({
        mold_physical_id: moldId,
        from_rack_layer_id: currentRackLayerId,
        to_rack_layer_id: newRackLayerId,
        moved_by: operatorId
      })

    if (locError) throw new Error(`Failed to log location: ${locError.message}`)

    const { error: updateError } = await supabase
      .from('mold_physical')
      .update({
        current_rack_layer_id: newRackLayerId
      })
      .eq('id', moldId)

    if (updateError) throw new Error(`Failed to update mold: ${updateError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
    return { success: true }
  } catch (err) {
    console.error('[relocateMold]', err)
    return { success: false, error: (err as Error).message }
  }
}

// 4. sendToTeflon
export async function sendToTeflon(
  moldId: string,
  operatorId: string,
  payload: {
    coating_type?: string
    sent_date?: string
    expected_return_date?: string
    cost_jpy?: number
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error: teflonError } = await supabase
      .from('mold_teflon_logs')
      .insert({
        mold_physical_id: moldId,
        status: 'SENT',
        requested_by: operatorId,
        sent_by: operatorId,
        coating_type: payload.coating_type || null,
        sent_date: payload.sent_date || new Date().toISOString().split('T')[0],
        expected_return_date: payload.expected_return_date || null,
        cost_jpy: payload.cost_jpy || null,
        notes: payload.notes || null
      })

    if (teflonError) throw new Error(`Failed to log teflon: ${teflonError.message}`)

    const { error: updateError } = await supabase
      .from('mold_physical')
      .update({
        checkin_status: 'TEFLON'
      })
      .eq('id', moldId)

    if (updateError) throw new Error(`Failed to update mold: ${updateError.message}`)

    // Insert mold_status_logs
    const { error: statusLogError } = await supabase
      .from('mold_status_logs')
      .insert({
        mold_physical_id: moldId,
        status: 'TEFLON',
        employee_id: operatorId,
        notes: 'Gửi mạ Teflon'
      })

    if (statusLogError) throw new Error(`Failed to log status: ${statusLogError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
    return { success: true }
  } catch (err) {
    console.error('[sendToTeflon]', err)
    return { success: false, error: (err as Error).message }
  }
}

// 5. addComment
export async function addComment(moldId: string, operatorId: string, content: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('mold_comments')
      .insert({
        mold_physical_id: moldId,
        author_id: operatorId,
        content
      })

    if (error) throw new Error(`Failed to add comment: ${error.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
    return { success: true }
  } catch (err) {
    console.error('[addComment]', err)
    return { success: false, error: (err as Error).message }
  }
}

// 6. receiveTeflon
export async function receiveTeflon(
  teflonLogId: string, 
  operatorId: string, 
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Lấy mold_physical_id
    const { data: logData, error: logError } = await supabase
      .from('mold_teflon_logs')
      .select('mold_physical_id')
      .eq('id', teflonLogId)
      .single()
      
    if (logError || !logData) throw new Error(`Failed to get teflon log: ${logError?.message}`)
    
    const moldId = logData.mold_physical_id

    // Update mold_teflon_logs
    const { error: updateTeflonError } = await supabase
      .from('mold_teflon_logs')
      .update({
        status: 'RECEIVED',
        received_date: new Date().toISOString().split('T')[0],
        quality_note: notes ?? null
      })
      .eq('id', teflonLogId)

    if (updateTeflonError) throw new Error(`Failed to update teflon status: ${updateTeflonError.message}`)

    // Update mold_physical
    const { error: updateMoldError } = await supabase
      .from('mold_physical')
      .update({
        checkin_status: 'IN'
      })
      .eq('id', moldId)

    if (updateMoldError) throw new Error(`Failed to update mold checkin_status: ${updateMoldError.message}`)

    // Insert mold_status_logs
    const { error: statusLogError } = await supabase
      .from('mold_status_logs')
      .insert({
        mold_physical_id: moldId,
        status: 'IN',
        employee_id: operatorId,
        notes: 'Nhận lại sau mạ teflon'
      })

    if (statusLogError) throw new Error(`Failed to log status: ${statusLogError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
    return { success: true }
  } catch (err) {
    console.error('[receiveTeflon]', err)
    return { success: false, error: (err as Error).message }
  }
}

// 7. cancelTeflon
export async function cancelTeflon(
  teflonLogId: string,
  operatorId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Lấy mold_physical_id
    const { data: logData, error: logError } = await supabase
      .from('mold_teflon_logs')
      .select('mold_physical_id')
      .eq('id', teflonLogId)
      .single()
      
    if (logError || !logData) throw new Error(`Failed to get teflon log: ${logError?.message}`)
    
    const moldId = logData.mold_physical_id

    // Update mold_teflon_logs
    const { error: updateTeflonError } = await supabase
      .from('mold_teflon_logs')
      .update({
        status: 'CANCELLED',
        reason: reason
      })
      .eq('id', teflonLogId)

    if (updateTeflonError) throw new Error(`Failed to cancel teflon log: ${updateTeflonError.message}`)

    // Update mold_physical
    const { error: updateMoldError } = await supabase
      .from('mold_physical')
      .update({
        checkin_status: 'IN'
      })
      .eq('id', moldId)

    if (updateMoldError) throw new Error(`Failed to update mold checkin_status: ${updateMoldError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
    return { success: true }
  } catch (err) {
    console.error('[cancelTeflon]', err)
    return { success: false, error: (err as Error).message }
  }
}

// 8. recordShipReturn
export async function recordShipReturn(
  moldId: string,
  originalShipLogId: string,
  handlerId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error: shipError } = await supabase
      .from('mold_ship_logs')
      .insert({
        mold_physical_id: moldId,
        direction: 'RETURN',
        handler_id: handlerId,
        ship_date: new Date().toISOString().split('T')[0],
        notes: notes ?? null
      })

    if (shipError) throw new Error(`Failed to log shipment return: ${shipError.message}`)

    const { error: updateError } = await supabase
      .from('mold_physical')
      .update({
        checkin_status: 'IN'
      })
      .eq('id', moldId)

    if (updateError) throw new Error(`Failed to update mold checkin_status: ${updateError.message}`)

    const { error: statusError } = await supabase
      .from('mold_status_logs')
      .insert({
        mold_physical_id: moldId,
        status: 'IN',
        employee_id: handlerId,
        notes: 'Nhận về từ vận chuyển'
      })

    if (statusError) throw new Error(`Failed to log status: ${statusError.message}`)

    revalidatePath('/production/molds')
    revalidatePath('/production/molds', 'layout')
    return { success: true }
  } catch (err) {
    console.error('[recordShipReturn]', err)
    return { success: false, error: (err as Error).message }
  }
}
