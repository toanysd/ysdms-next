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
        .insert([header])
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
