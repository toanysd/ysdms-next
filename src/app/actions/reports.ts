'use server'

import { createClient } from '@/lib/supabase/server'
import { InventorySnapshot, OrderSummary } from '@/types/dashboard'

// ============================================
// REPORTS SERVER ACTIONS — Sprint 5B-2
// ============================================

/**
 * Lấy toàn bộ dữ liệu tồn kho chi tiết từ v_inventory_snapshot
 * Dùng cho: /reports/inventory
 */
export async function getInventoryReport(): Promise<InventorySnapshot[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_inventory_snapshot')
        .select('*')
        .order('family', { ascending: true })

    if (error) {
        console.error('[Reports] Lỗi lấy inventory snapshot:', error.message)
        throw new Error(error.message)
    }

    return (data || []) as InventorySnapshot[]
}

/**
 * Lấy toàn bộ đơn hàng từ v_order_summary
 * Hỗ trợ filter theo tháng (YYYY-MM-01) và status
 * Dùng cho: /reports/orders
 */
export async function getOrdersReport(filters?: {
    month?: string      // YYYY-MM-01
    status?: string     // 'draft' | 'confirmed' | 'shipped' ...
    customerId?: string // UUID
}): Promise<OrderSummary[]> {
    const supabase = await createClient()

    let query = supabase
        .from('v_order_summary')
        .select('*')
        .order('order_date', { ascending: false })

    if (filters?.month) {
        query = query.eq('order_month', filters.month)
    }
    if (filters?.status) {
        query = query.eq('status', filters.status)
    }
    if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId)
    }

    const { data, error } = await query.limit(500)

    if (error) {
        console.error('[Reports] Lỗi lấy order summary:', error.message)
        throw new Error(error.message)
    }

    return (data || []) as OrderSummary[]
}

/**
 * Lấy tổng hợp tồn kho group theo Family (loại nhựa)
 * Trả về mảng { family, total_kg, item_count, low_count }
 */
export async function getInventoryByFamily(): Promise<{
    family: string
    total_kg: number
    item_count: number
    low_count: number
}[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_inventory_snapshot')
        .select('family, current_stock_kg, is_low_stock')

    if (error) {
        console.error('[Reports] Lỗi group inventory by family:', error.message)
        throw new Error(error.message)
    }

    // Aggregate client-side (view doesn't support GROUP BY via PostgREST)
    const map: Record<string, { total_kg: number; item_count: number; low_count: number }> = {}
    for (const row of (data || [])) {
        const f = row.family || 'Không xác định'
        if (!map[f]) map[f] = { total_kg: 0, item_count: 0, low_count: 0 }
        map[f].total_kg += Number(row.current_stock_kg || 0)
        map[f].item_count += 1
        if (row.is_low_stock) map[f].low_count += 1
    }

    return Object.entries(map)
        .map(([family, stats]) => ({ family, ...stats }))
        .sort((a, b) => b.total_kg - a.total_kg)
}

/**
 * Lấy tổng hợp đơn hàng group theo tháng
 * Trả về mảng { month, order_count, total_qty, total_amount }
 */
export async function getOrdersByMonth(): Promise<{
    month: string
    order_count: number
    total_qty: number
    total_amount: number
}[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_order_summary')
        .select('order_month, total_qty, total_amount')
        .order('order_month', { ascending: false })
        .limit(500)

    if (error) {
        console.error('[Reports] Lỗi group orders by month:', error.message)
        throw new Error(error.message)
    }

    const map: Record<string, { order_count: number; total_qty: number; total_amount: number }> = {}
    for (const row of (data || [])) {
        const m = row.order_month || 'unknown'
        if (!map[m]) map[m] = { order_count: 0, total_qty: 0, total_amount: 0 }
        map[m].order_count += 1
        map[m].total_qty += Number(row.total_qty || 0)
        map[m].total_amount += Number(row.total_amount || 0)
    }

    return Object.entries(map)
        .map(([month, stats]) => ({ month, ...stats }))
        .sort((a, b) => b.month.localeCompare(a.month))
}
