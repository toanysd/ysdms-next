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

export interface ProductionReportRow {
    log_id: string
    start_time: string
    end_time: string | null
    operator_name: string | null
    machine_code: string | null
    machine_name: string | null
    order_item_id: string
    product_pn_raw: string | null
    slip_no: string | null
    planned_quantity: number | null
    order_quantity: number | null
    produced_qty: number | null
    scrap_qty: number | null
    achievement_pct: number | null
    scrap_rate_pct: number | null
    duration_min: number | null
}

export interface ReportSummary {
    total_logs: number
    total_planned: number
    total_produced: number
    total_scrap: number
    avg_achievement_pct: number
    overall_scrap_rate_pct: number
}

export interface ProductionReportResult {
    rows: ProductionReportRow[]
    summary: ReportSummary
}

/**
 * Lấy lịch sử sản xuất cho Phase 3C Reporting (Advanced)
 */
export async function getProductionReport(startDate: string, endDate: string): Promise<ProductionReportResult> {
    const supabase = await createClient()

    // Chèn offset múi giờ Nhật Bản (+09:00) để đảm bảo biên thời gian thay vì dùng Z (UTC)
    const startIso = startDate.includes('T') ? startDate : `${startDate}T00:00:00+09:00`
    const endIso = endDate.includes('T') ? endDate : `${endDate}T23:59:59+09:00`

    const { data, error } = await supabase
        .from('production_log')
        .select(`
            id,
            start_time,
            end_time,
            operator_name,
            produced_qty,
            scrap_qty,
            order_item_id,
            machine_instance!left(internal_code, name),
            order_items!left(
                quantity,
                product_pn_raw,
                orders!left(slip_no)
            )
        `)
        .eq('status', 'COMPLETED')
        .gte('end_time', startIso)
        .lte('end_time', endIso)
        .order('end_time', { ascending: false })
        .limit(1000)

    if (error) {
        console.error('[API Error] getProductionReport:', error)
        throw new Error(error.message)
    }

    if (!data || data.length === 0) {
        return {
            rows: [],
            summary: {
                total_logs: 0,
                total_planned: 0,
                total_produced: 0,
                total_scrap: 0,
                avg_achievement_pct: 0,
                overall_scrap_rate_pct: 0,
            }
        }
    }

    const orderItemIds = [...new Set(data.map((d: any) => d.order_item_id))]
    const { data: plansData } = await supabase
        .from('production_plans')
        .select('order_item_id, planned_quantity')
        .in('order_item_id', orderItemIds)
        .is('deleted_at', null)

    const planMap: Record<string, number> = {}
    if (plansData) {
        for (const p of plansData) {
            planMap[p.order_item_id] = (planMap[p.order_item_id] || 0) + (p.planned_quantity || 0)
        }
    }

    const rows: ProductionReportRow[] = data.map((log: any) => {
        const produced = Number(log.produced_qty || 0)
        const scrap = Number(log.scrap_qty || 0)
        const planned = planMap[log.order_item_id] ?? null
        const orderQty = log.order_items?.quantity ?? null

        const achievement = planned && planned > 0
            ? Math.round((produced / planned) * 100 * 10) / 10
            : null

        const scrapRate = produced + scrap > 0
            ? Math.round((scrap / (produced + scrap)) * 100 * 10) / 10
            : 0

        const durationMin = log.start_time && log.end_time
            ? Math.round((new Date(log.end_time).getTime() - new Date(log.start_time).getTime()) / 60000)
            : null

        return {
            log_id: log.id,
            start_time: log.start_time,
            end_time: log.end_time,
            operator_name: log.operator_name,
            machine_code: log.machine_instance?.internal_code ?? null,
            machine_name: log.machine_instance?.name ?? null,
            order_item_id: log.order_item_id,
            product_pn_raw: log.order_items?.product_pn_raw ?? null,
            slip_no: log.order_items?.orders?.slip_no ?? null,
            planned_quantity: planned,
            order_quantity: orderQty ? Number(orderQty) : null,
            produced_qty: produced,
            scrap_qty: scrap,
            achievement_pct: achievement,
            scrap_rate_pct: scrapRate,
            duration_min: durationMin,
        }
    })

    const totalProduced = rows.reduce((s, r) => s + (r.produced_qty || 0), 0)
    const totalScrap = rows.reduce((s, r) => s + (r.scrap_qty || 0), 0)
    const totalPlanned = rows.reduce((s, r) => s + (r.planned_quantity || 0), 0)

    const validRows = rows.filter((r) => r.achievement_pct !== null)
    const avgAchievement = validRows.length > 0
        ? Math.round((validRows.reduce((s, r) => s + r.achievement_pct!, 0) / validRows.length) * 10) / 10
        : 0

    const overallScrapRate = totalProduced + totalScrap > 0
        ? Math.round((totalScrap / (totalProduced + totalScrap)) * 100 * 10) / 10
        : 0

    return {
        rows,
        summary: {
            total_logs: rows.length,
            total_planned: totalPlanned,
            total_produced: totalProduced,
            total_scrap: totalScrap,
            avg_achievement_pct: avgAchievement,
            overall_scrap_rate_pct: overallScrapRate,
        }
    }
}
