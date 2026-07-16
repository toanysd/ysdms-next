'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInboundTxnAction(data: {
    plastic_id: string
    change_kg: number
    lot_no_material?: string
    notes?: string
    transaction_date: string
}) {
    const supabase = await createClient()

    const { error } = await supabase
        // @ts-ignore
        .from('inventory_txn')
        .insert([{
            plastic_id: data.plastic_id,
            txn_type: 'IN',
            change_kg: data.change_kg,
            lot_no_material: data.lot_no_material || null,
            notes: data.notes || null,
            transaction_date: data.transaction_date
        }])

    if (error) {
        console.error('Lỗi khi nhập kho:', error)
        throw new Error(error.message)
    }

    revalidatePath('/inventory')
    revalidatePath('/inventory/history')
}

// ============================================================
// YSDMS-NEXT | Server Actions — Tray Inventory
// ============================================================

export interface TrayInPayload {
    product_id: string
    production_log_id?: string | null
    quantity: number
    lot_no?: string | null
    operator_name?: string | null
    notes?: string | null
}

export interface TrayOutPayload {
    product_id: string
    order_item_id: string
    quantity: number
    lot_no?: string | null
    operator_name?: string | null
    notes?: string | null
}

export interface TrayAdjustPayload {
    product_id: string
    actual_quantity: number
    operator_name?: string | null
    notes?: string | null
}

/**
 * 1. recordTrayIn
 * Ghi nhận nhập kho thành phẩm từ xưởng sản xuất (hoặc nhập bù).
 */
export async function recordTrayIn(payload: TrayInPayload) {
    if (!Number.isInteger(payload.quantity) || payload.quantity <= 0) {
        return { success: false, error: 'Quantity must be a positive integer for IN transactions.' }
    }

    const supabase = await createClient()

    // tray_inventory_txn table exists at runtime but not yet in database.types.ts
    const { data, error } = await (supabase as any)
        .from('tray_inventory_txn')
        .insert({
            txn_type: 'IN',
            product_id: payload.product_id,
            production_log_id: payload.production_log_id || null,
            quantity: payload.quantity,
            lot_no: payload.lot_no || null,
            operator_name: payload.operator_name || null,
            notes: payload.notes || 'Nhập kho thành phẩm'
        })
        .select()
        .single()

    if (error) {
        console.error('[API Error] recordTrayIn:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/production/inventory')
    revalidatePath('/production')
    return { success: true, txn: data }
}

/**
 * 2. recordTrayOut
 * Xuất kho thành phẩm để giao cho khách hàng (Gắn với order_item).
 * Có validate chặn xuất âm kho.
 */
export async function recordTrayOut(payload: TrayOutPayload) {
    if (!Number.isInteger(payload.quantity) || payload.quantity <= 0) {
        return { success: false, error: 'Quantity must be a positive integer for OUT transactions.' }
    }

    const supabase = await createClient()

    // Sử dụng RPC "record_tray_out_safe" để tránh Race Condition
    // RPC tự lock table row, check stock, và insert atomic
    const { data, error } = await (supabase.rpc as any)('record_tray_out_safe', {
        p_product_id: payload.product_id,
        p_order_item_id: payload.order_item_id,
        p_quantity: payload.quantity,
        // @ts-ignore
        p_lot_no: payload.lot_no || null,
        // @ts-ignore
        p_operator_name: payload.operator_name || null,
        p_notes: payload.notes || 'Xuất kho giao hàng'
    })

    if (error) {
        console.error('[API Error] recordTrayOut RPC:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/production/inventory')
    revalidatePath('/production')
    return { success: true, txn: data }
}

/**
 * 3. recordTrayAdjust
 * Kiểm kê định kỳ. Nhập vào số đếm thực tế (actual_quantity), 
 * hệ thống tự tính Delta (độ lệch) và ghi log ADJUST.
 */
export async function recordTrayAdjust(payload: TrayAdjustPayload) {
    if (!Number.isInteger(payload.actual_quantity) || payload.actual_quantity < 0) {
        return { success: false, error: 'Số lượng kiểm kê thực tế phải là số nguyên không âm.' }
    }

    const supabase = await createClient()

    // Lấy tồn kho hiện tại
    const { data: stockData, error: stockErr } = await supabase
        // @ts-ignore
        .from('tray_stock_summary')
        .select('current_stock')
        // @ts-ignore
        .eq('product_id', payload.product_id)
        .single()

    if (stockErr && stockErr.code !== 'PGRST116') {
        console.error('[API Error] recordTrayAdjust (stock check):', stockErr)
        return { success: false, error: 'Lỗi kiểm tra tồn kho hiện hành.' }
    }

    // @ts-ignore
    const currentStock = stockData?.current_stock || 0
    const delta = payload.actual_quantity - currentStock

    if (delta === 0) {
        return { success: true, note: 'Khớp số liệu, không cần điều chỉnh.', delta: 0 }
    }

    // Tiến hành ghi ADJUST
    // tray_inventory_txn table exists at runtime but not yet in database.types.ts
    const { data, error } = await (supabase as any)
        .from('tray_inventory_txn')
        .insert({
            txn_type: 'ADJUST',
            product_id: payload.product_id,
            quantity: delta, // Delta có thể âm (-) hoặc dương (+) đúng theo thiết kế
            operator_name: payload.operator_name || null,
            notes: payload.notes || `Kiểm kê kho. Tồn hệ thống: ${currentStock} -> Thực tế đếm: ${payload.actual_quantity} (Lệch: ${delta})`
        })
        .select()
        .single()

    if (error) {
        console.error('[API Error] recordTrayAdjust:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/production/inventory')
    revalidatePath('/production')
    return { success: true, txn: data, delta }
}

/**
 * 4. getRecentTrayTxns
 * Hotfix Modal: Fetch lịch sử chi tiết bypass RLS bằng Server Action
 */
export async function getRecentTrayTxns(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        // @ts-ignore
        .from('tray_inventory_txn')
        .select(`
            id, txn_type, quantity, lot_no, txn_date, operator_name, notes,
            created_at
        `)
        // @ts-ignore
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) {
        console.error('[API Error] getRecentTrayTxns:', error)
        return { success: false, data: [] }
    }
    return { success: true, data }
}

/**
 * 5. getStockForProducts
 * Lấy tồn kho hiện hành (current_stock) cho danh sách product_ids.
 */
export async function getStockForProducts(productIds: string[]) {
    const supabase = await createClient()
    const { data, error } = await supabase
        // @ts-ignore
        .from('tray_stock_summary')
        .select('product_id, current_stock')
        .in('product_id', productIds)

    if (error) {
        console.error('[API Error] getStockForProducts:', error)
        return { success: false, data: [] }
    }
    return { success: true, data }
}
