'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderHeaderAction(orderId: string, payload: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update(payload).eq('order_id', orderId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  const supabase = await createClient()
  
  // Validate transition
  const VALID_FLOW = ['DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'CLOSED']
  const ALLOW_CANCEL_FROM = ['DRAFT', 'CONFIRMED']
  
  const { data: current } = await supabase
    .from('orders').select('order_status').eq('order_id', orderId).single()
  
  const currentIdx = VALID_FLOW.indexOf(current?.order_status || '')
  const newIdx = VALID_FLOW.indexOf(newStatus)
  
  const isForwardOne = newIdx === currentIdx + 1
  const isCancelAllowed = newStatus === 'CANCELLED' && ALLOW_CANCEL_FROM.includes(current?.order_status || '')
  
  if (!isForwardOne && !isCancelAllowed) {
    return { success: false, error: `Không thể chuyển từ ${current?.order_status || 'UNKNOWN'} → ${newStatus}` }
  }
  
  const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('order_id', orderId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function saveOrderLinesAction(orderId: string, lines: any[]) {
  const supabase = await createClient()
  
  const { data: order } = await supabase
    .from('orders').select('order_status').eq('order_id', orderId).single()
  if (!['DRAFT', 'CONFIRMED'].includes(order?.order_status || '')) {
    return { success: false, error: 'Không thể sửa đơn hàng đã xác nhận giao/đóng.' }
  }

  // 1. Fetch existing lines
  const { data: existing } = await supabase.from('order_lines').select('line_id').eq('order_id', orderId)
  const existingIds = (existing || []).map(l => l.line_id)
  
  // 2. Determine which to delete
  const incomingIds = lines.filter(l => l.line_id).map(l => l.line_id)
  const toDelete = existingIds.filter(id => !incomingIds.includes(id))
  
  if (toDelete.length > 0) {
    await supabase.from('order_lines').delete().in('line_id', toDelete)
  }
  
  // 3. Upsert lines
  const toUpsert = lines.map((l, i) => {
    const isNew = l.line_id && l.line_id.startsWith('new-')
    return {
      line_id: isNew ? undefined : l.line_id,
      order_id: orderId,
      line_no: i + 1,
      product_id: l.product_id,
      quantity: l.quantity || 0,
      unit: l.unit || 'PCS',
      due_date: l.due_date || null,
      ship_date: l.ship_date || null,
    }
  })
  
  if (toUpsert.length > 0) {
    const { error } = await supabase.from('order_lines').upsert(toUpsert)
    if (error) return { success: false, error: error.message }
  }
  
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function linkWorkOrderAction(woId: string, orderId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('work_orders').update({ order_id: orderId }).eq('wo_id', woId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function unlinkWorkOrderAction(woId: string, orderId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('work_orders').update({ order_id: null }).eq('wo_id', woId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}
