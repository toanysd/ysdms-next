'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { OrderInsert, OrderItemInsert, OrderStatus } from '@/types/orders'
import { OrderFormValues } from '@/lib/validations/order'
import { Database } from '@/types/database.types'
export async function createOrderWithItemsAction(
    header: OrderInsert,
    items: Omit<OrderItemInsert, 'order_id'>[]
): Promise<{ orderId: string }> {
    const supabase = await createClient()

    // 1. Chèn Header
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        // @ts-ignore
        .insert([{
            ...header,
            recipient_name: header.recipient_name ?? null
        }])
        .select('id')
        .single()

    if (orderError || !orderData) {
        console.error('Lỗi khi lưu Header Đơn hàng:', orderError)
        throw new Error(orderError?.message || 'Unknown error inserting order header')
    }

    // @ts-ignore
    const orderId = orderData.id

    // 2. Chèn các mặt hàng (Items)
    if (items && items.length > 0) {
        // Map order_id sinh ra vào từng dòng item
        const itemsToInsert = items.map(item => ({
            ...item,
            order_id: orderId
        }))

        // order_items table — legacy name, may not match current schema types
        const { error: itemsError } = await (supabase as any)
            .from('order_items')
            .insert(itemsToInsert)

        if (itemsError) {
            console.error('Lỗi khi lưu Dòng Đơn hàng (Items):', itemsError)
            // Chú ý: Ở hệ thống thực tế Supabase không hỗ trợ transaction đa bảng tốt qua Data API,
            // Có thể chạy 1 function RPC nếu muốn rollback strict, tuy nhiên ở Next.js ta báo lỗi.
            throw new Error(itemsError.message)
        }
    }

    revalidatePath('/order')
    return { orderId }
}

export async function deleteOrderAction(orderId: string): Promise<void> {
    const supabase = await createClient()

    // 1. Check if it is actually draft
    // @ts-ignore
    const { data: order, error: checkErr } = await supabase.from('orders').select('status').eq('id', orderId).single()
    if (checkErr || !order) throw new Error('Không tìm thấy đơn hàng để xóa')
    // @ts-ignore
    if (order.status !== 'draft') throw new Error('Chỉ được xóa đơn hàng ở trạng thái Nháp (Draft)')

    // 2. Cascade delete will handle items if FK exists, but doing it manually is safer
    // @ts-ignore
    await supabase.from('order_items').delete().eq('order_id', orderId)

    // @ts-ignore
    const { error: delErr } = await supabase.from('orders').delete().eq('id', orderId)
    if (delErr) throw new Error(delErr.message)
}

export async function updateOrderStatusAction(
    orderId: string,
    newStatus: OrderStatus
): Promise<{ deductResult?: { status: string; rows_inserted?: number } }> {
    const supabase = await createClient()

    // Trigger log_order_status_change trên Database sẽ tự sinh dòng log trong order_status_history
    const { error } = await supabase
        .from('orders')
        // @ts-ignore
        .update({ status: newStatus })
        // @ts-ignore
        .eq('id', orderId)

    if (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error)
        throw new Error(error.message)
    }

    // Khi chuyển sang in_production → gọi RPC trừ kho nhựa tự động
    let deductResult = undefined
    if (newStatus === 'in_production') {
        const { data, error: rpcError } = await (supabase.rpc as any)('auto_deduct_plastic_on_production', { p_order_id: orderId })

        if (rpcError) {
            console.error('Lỗi RPC auto-deduct:', rpcError)
            // Không throw — status đã cập nhật, chỉ log lỗi trừ kho
        } else {
            deductResult = data
            console.log('Auto-deduct result:', data)
        }
    }

    revalidatePath('/order')
    revalidatePath(`/order/${orderId}`)
    revalidatePath('/inventory')
    revalidatePath('/inventory/history')

    // @ts-ignore
    return { deductResult }
}

export async function shipOrderItemsAction(
    orderId: string,
    items: { order_item_id: string, product_id: string, quantity: number, lot_no: string, operator_name: string }[],
    notes: string
) {
    const supabase = await createClient()

    // Lấy thông tin session hiện tại để gán cho operator_name nếu ko có? 
    // Theo schema có thể để string tĩnh hoặc truyền từ frontend.

    const { data, error } = await (supabase.rpc as any)('ship_order_items', {
        p_order_id: orderId,
        p_items: items,
        p_notes: notes
    })

    if (error) {
        console.error('Lỗi khi xuất kho:', error)
        throw new Error(error.message)
    }

    // @ts-ignore
    if (!data.success) {
        // @ts-ignore
        throw new Error(data.message || data.error_code || 'Unknown error during shipping')
    }

    revalidatePath('/order')
    revalidatePath('/production/inventory')
    
    return data
}

export async function upsertOrderAction(data: OrderFormValues): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const supabase = await createClient()

  try {
    let orderId = data.id

    // 1. Upsert Header
    const orderPayload = {
      slip_no: data.slip_no,
      order_date: data.order_date,
      customer_id: data.customer_id,
      order_type: data.order_type as string,
      status: data.status as string,
      approval_status: data.approval_status as string,
      delivery_site_code: data.delivery_site_code,
      delivery_address: data.delivery_address,
      requester_code: data.requester_code,
      handler_name: data.handler_name,
      recipient_name: data.recipient_name,
      internal_notes: data.internal_notes,
    }

    if (orderId) {
      // @ts-ignore
      const { error } = await supabase.from('orders').update(orderPayload).eq('id', orderId)
      if (error) throw error
    } else {
      // @ts-ignore
      const { data: newOrder, error } = await supabase.from('orders').insert([orderPayload]).select('id').single()
      if (error) throw error
      // @ts-ignore
      orderId = newOrder.id
    }

    // 2. Upsert Items
    if (!orderId) throw new Error("Order ID not found")

    // Fetch existing items to delete removed ones
    // @ts-ignore
    const { data: existingItems } = await supabase.from('order_items').select('id').eq('order_id', orderId)
    // @ts-ignore
    const existingIds = (existingItems || []).map(i => i.id)

    const currentIds = data.items.map(i => i.id).filter(Boolean) as string[]
    const idsToDelete = existingIds.filter(id => !currentIds.includes(id))

    if (idsToDelete.length > 0) {
      // @ts-ignore
      await supabase.from('order_items').delete().in('id', idsToDelete)
    }

    // Prepare items for upsert
    const itemsToUpsert = data.items.map((item) => ({
      ...(item.id ? { id: item.id } : {}),
      order_id: orderId as string,
      line_no: item.line_no,
      product_id: item.product_id,
      product_pn_raw: item.product_pn_raw,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency: item.currency,
      delivery_date: item.delivery_date,
      delivery_date_end: item.delivery_date_end,
      mold_id: item.mold_id,
      request_no: item.request_no,
      packing_qty: item.packing_qty,
      packing_boxes: item.packing_boxes,
      process_notes: item.process_notes,
      office_qty: item.office_qty,
      shots_count: item.shots_count
    }))

    if (itemsToUpsert.length > 0) {
      // @ts-ignore
      const { error: upsertError } = await supabase.from('order_items').upsert(itemsToUpsert)
      if (upsertError) throw upsertError
    }

    revalidatePath('/order')
    return { success: true, orderId }
  } catch (err: any) {
    console.error('Lỗi khi lưu Đơn hàng:', err)
    return { success: false, error: err.message || 'Unknown error' }
  }
}
