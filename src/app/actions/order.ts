'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { OrderInsert, OrderItemInsert, OrderStatus } from '@/types/orders'

export async function createOrderWithItemsAction(
    header: OrderInsert,
    items: Omit<OrderItemInsert, 'order_id'>[]
): Promise<{ orderId: string }> {
    const supabase = await createClient()

    // 1. Chèn Header
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
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

    const orderId = orderData.id

    // 2. Chèn các mặt hàng (Items)
    if (items && items.length > 0) {
        // Map order_id sinh ra vào từng dòng item
        const itemsToInsert = items.map(item => ({
            ...item,
            order_id: orderId
        }))

        const { error: itemsError } = await supabase
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
    const { data: order, error: checkErr } = await supabase.from('orders').select('status').eq('id', orderId).single()
    if (checkErr || !order) throw new Error('Không tìm thấy đơn hàng để xóa')
    if (order.status !== 'draft') throw new Error('Chỉ được xóa đơn hàng ở trạng thái Nháp (Draft)')

    // 2. Cascade delete will handle items if FK exists, but doing it manually is safer
    await supabase.from('order_items').delete().eq('order_id', orderId)

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
        .update({ status: newStatus })
        .eq('id', orderId)

    if (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error)
        throw new Error(error.message)
    }

    // Khi chuyển sang in_production → gọi RPC trừ kho nhựa tự động
    let deductResult = undefined
    if (newStatus === 'in_production') {
        const { data, error: rpcError } = await supabase
            .rpc('auto_deduct_plastic_on_production', { p_order_id: orderId })

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

    const { data, error } = await supabase.rpc('ship_order_items', {
        p_order_id: orderId,
        p_items: items,
        p_notes: notes
    })

    if (error) {
        console.error('Lỗi khi xuất kho:', error)
        throw new Error(error.message)
    }

    if (!data.success) {
        throw new Error(data.message || data.error_code || 'Unknown error during shipping')
    }

    revalidatePath('/order')
    revalidatePath('/production/inventory')
    
    return data
}
