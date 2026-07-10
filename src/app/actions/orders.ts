'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Các interface tương ứng với schema DB mới
export interface OrderHeaderInput {
  order_id?: string
  company_id: string
  order_no: string
  order_date: string | null
  requested_delivery: string | null
  order_type: string | null
  customer_order_no: string | null
  lot_no: string | null
  notes: string | null
  order_status?: string
}

export interface OrderLineInput {
  line_id?: string
  order_id?: string
  product_id: string | null
  design_revision_id?: string | null
  delivery_site_id: string | null
  line_no: number
  quantity: number
  unit: string
  due_date: string | null
  ship_date: string | null
  is_free_sample: boolean
  charge_type: string | null
  packing_style: string | null
  shipping_notes: string | null
  line_status?: string
}

export async function upsertOrderAction(header: OrderHeaderInput, lines: OrderLineInput[]): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const supabase = await createClient()

  try {
    let orderId = header.order_id

    // 1. Upsert Header
    const orderPayload: any = {
      company_id: header.company_id,
      order_no: header.order_no,
      order_date: header.order_date || null,
      requested_delivery: header.requested_delivery || null,
      order_type: header.order_type || null,
      customer_order_no: header.customer_order_no || null,
      lot_no: header.lot_no || null,
      notes: header.notes || null,
    }

    if (orderId) {
      // Cập nhật
      if (header.order_status) orderPayload.order_status = header.order_status
      const { error } = await supabase.from('orders').update(orderPayload).eq('order_id', orderId)
      if (error) throw new Error(`Lỗi cập nhật header: ${error.message}`)
    } else {
      // Tạo mới
      orderPayload.order_status = header.order_status || 'NEW'
      const { data: newOrder, error } = await supabase.from('orders').insert([orderPayload]).select('order_id').single()
      if (error) throw new Error(`Lỗi tạo đơn hàng mới: ${error.message}`)
      orderId = newOrder.order_id
    }

    if (!orderId) throw new Error("Order ID not found")

    // 2. Xử lý Order Lines
    // Lấy các line hiện tại
    const { data: existingLines } = await supabase.from('order_lines').select('line_id').eq('order_id', orderId)
    const existingIds = (existingLines || []).map(l => l.line_id)
    
    const currentIds = lines.map(l => l.line_id).filter(Boolean) as string[]
    const idsToDelete = existingIds.filter(id => !currentIds.includes(id))

    if (idsToDelete.length > 0) {
      await supabase.from('order_lines').delete().in('line_id', idsToDelete)
    }

    const linesToUpsert = lines.map(l => {
      const payload: any = {
        order_id: orderId as string,
        product_id: l.product_id || null,
        design_revision_id: l.design_revision_id || null,
        delivery_site_id: l.delivery_site_id || null,
        line_no: l.line_no,
        quantity: l.quantity,
        unit: l.unit || 'PCS',
        due_date: l.due_date || null,
        ship_date: l.ship_date || null,
        is_free_sample: l.is_free_sample || false,
        charge_type: l.charge_type || 'PAID',
        packing_style: l.packing_style || null,
        shipping_notes: l.shipping_notes || null,
      }
      if (l.line_id) payload.line_id = l.line_id
      if (l.line_status) payload.line_status = l.line_status
      return payload
    })

    if (linesToUpsert.length > 0) {
      const { error: upsertError } = await supabase.from('order_lines').upsert(linesToUpsert)
      if (upsertError) throw new Error(`Lỗi cập nhật chi tiết: ${upsertError.message}`)
    }

    revalidatePath('/orders')
    revalidatePath(`/orders/${orderId}`)
    
    return { success: true, orderId }
  } catch (err: any) {
    console.error('Lỗi upsertOrderAction:', err)
    return { success: false, error: err.message || 'Lỗi không xác định' }
  }
}
