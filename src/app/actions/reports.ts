'use server'

import { createClient } from '@/lib/supabase/server'
import { InventorySnapshot, OrderSummary } from '@/types/dashboard'

// ============================================
// REPORTS SERVER ACTIONS - V3 Compliant
// ============================================

const MOCK_INVENTORY: InventorySnapshot[] = [
    {
        plastic_id: 'p1',
        plastic_code: 'PET-0.3-610',
        family: 'PET',
        grade: 'A-PET',
        color: 'Clear',
        thickness_mm: 0.3,
        width_mm: 610,
        total_in_kg: 1200,
        total_out_kg: 850,
        txn_count: 45,
        last_txn_time: '2026-06-20T10:00:00Z',
        reorder_point_kg: 200,
        current_stock_kg: 350,
        is_low_stock: false
    },
    {
        plastic_id: 'p2',
        plastic_code: 'PP-0.45-580',
        family: 'PP',
        grade: 'Conductive',
        color: 'Black',
        thickness_mm: 0.45,
        width_mm: 580,
        total_in_kg: 800,
        total_out_kg: 720,
        txn_count: 30,
        last_txn_time: '2026-06-21T15:30:00Z',
        reorder_point_kg: 150,
        current_stock_kg: 80,
        is_low_stock: true
    },
    {
        plastic_id: 'p3',
        plastic_code: 'PS-0.5-600',
        family: 'PS',
        grade: 'HIPS',
        color: 'White',
        thickness_mm: 0.5,
        width_mm: 600,
        total_in_kg: 1500,
        total_out_kg: 1000,
        txn_count: 50,
        last_txn_time: '2026-06-19T08:45:00Z',
        reorder_point_kg: 300,
        current_stock_kg: 500,
        is_low_stock: false
    }
]

/**
 * Lấy toàn bộ dữ liệu tồn kho nhựa chi tiết (từ mock vì V3 chưa có bảng nhựa)
 * Dùng cho: /reports/inventory
 */
export async function getInventoryReport(): Promise<InventorySnapshot[]> {
    return MOCK_INVENTORY
}

/**
 * Lấy toàn bộ đơn hàng từ bảng orders và order_lines
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
        .from('orders')
        .select(`
            order_id,
            order_no,
            order_date,
            order_status,
            order_type,
            company_id,
            created_at,
            companies!left(
                company_name,
                company_code
            ),
            order_lines!left(
                quantity
            )
        `)

    if (filters?.customerId) {
        query = query.eq('company_id', filters.customerId)
    }
    if (filters?.status) {
        query = query.eq('order_status', filters.status)
    }

    const { data, error } = await query.order('order_date', { ascending: false }).limit(500)

    if (error) {
        console.error('[Reports] Lỗi lấy order summary:', error.message)
        throw new Error(error.message)
    }

    let summaries: OrderSummary[] = (data || []).map((o: any) => {
        const orderMonth = o.order_date ? o.order_date.substring(0, 7) + '-01' : undefined
        const totalQty = o.order_lines ? o.order_lines.reduce((s: number, l: any) => s + Number(l.quantity || 0), 0) : 0
        const lineCount = o.order_lines ? o.order_lines.length : 0

        return {
            id: o.order_id,
            status: o.order_status || 'draft',
            order_month: orderMonth,
            slip_no: o.order_no,
            order_date: o.order_date,
            customer_name: o.companies?.company_name,
            customer_code: o.companies?.company_code,
            customer_id: o.company_id,
            order_type: o.order_type || 'standard',
            line_count: lineCount,
            total_qty: totalQty,
            total_amount: 0,
            approval_status: 'approved',
            created_at: o.created_at
        }
    })

    if (filters?.month) {
        summaries = summaries.filter(s => s.order_month === filters.month)
    }

    return summaries
}

/**
 * Lấy tổng hợp tồn kho group theo Family (loại nhựa)
 */
export async function getInventoryByFamily(): Promise<{
    family: string
    total_kg: number
    item_count: number
    low_count: number
}[]> {
    const map: Record<string, { total_kg: number; item_count: number; low_count: number }> = {}
    for (const row of MOCK_INVENTORY) {
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
 */
export async function getOrdersByMonth(): Promise<{
    month: string
    order_count: number
    total_qty: number
    total_amount: number
}[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(`
            order_date,
            order_lines!left(
                quantity
            )
        `)
        .order('order_date', { ascending: false })
        .limit(500)

    if (error) {
        console.error('[Reports] Lỗi group orders by month:', error.message)
        throw new Error(error.message)
    }

    const map: Record<string, { order_count: number; total_qty: number; total_amount: number }> = {}
    for (const row of (data || [])) {
        const m = row.order_date ? row.order_date.substring(0, 7) + '-01' : 'unknown'
        if (!map[m]) map[m] = { order_count: 0, total_qty: 0, total_amount: 0 }
        map[m].order_count += 1
        const qty = row.order_lines ? row.order_lines.reduce((s: number, l: any) => s + Number(l.quantity || 0), 0) : 0
        map[m].total_qty += qty
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

    const startIso = startDate.includes('T') ? startDate : `${startDate}T00:00:00+09:00`
    const endIso = endDate.includes('T') ? endDate : `${endDate}T23:59:59+09:00`

    const { data, error } = await supabase
        .from('production_logs')
        .select(`
            log_id,
            start_time,
            end_time,
            operator_id,
            output_quantity,
            defect_quantity,
            po_id,
            employees!left(
                employee_name
            ),
            production_orders!left(
                planned_quantity,
                po_code,
                order_lines!left(
                    quantity,
                    products!left(
                        product_code
                    ),
                    orders!left(
                        order_no
                    )
                ),
                machines!left(
                    machine_code,
                    machine_name
                )
            )
        `)
        .not('end_time', 'is', null)
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

    const rows: ProductionReportRow[] = data.map((log: any) => {
        const produced = Number(log.output_quantity || 0)
        const scrap = Number(log.defect_quantity || 0)
        const planned = log.production_orders?.planned_quantity ?? null
        const orderQty = log.production_orders?.order_lines?.quantity ?? null
        const prodCode = log.production_orders?.order_lines?.products?.product_code ?? null
        const slipNo = log.production_orders?.order_lines?.orders?.order_no ?? null
        const mCode = log.production_orders?.machines?.machine_code ?? null
        const mName = log.production_orders?.machines?.machine_name ?? null
        const opName = log.employees?.employee_name ?? null

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
            log_id: log.log_id,
            start_time: log.start_time,
            end_time: log.end_time,
            operator_name: opName,
            machine_code: mCode,
            machine_name: mName,
            order_item_id: log.po_id || '',
            product_pn_raw: prodCode,
            slip_no: slipNo,
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
