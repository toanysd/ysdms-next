'use server'

import { createClient } from '@/lib/supabase/server'
import { DashboardKPI, InventorySnapshot, OrderSummary } from '@/types/dashboard'

export async function getDashboardData() {
    const supabase = await createClient()

    // 1. Fetch Inventory Snapshot for KPIs
    const { data: inventory, error: invError } = await supabase
        .from('v_inventory_snapshot')
        .select('plastic_id, current_stock_kg, is_low_stock')

    if (invError) {
        console.error('Lỗi lấy inventory snapshot:', invError.message)
    }

    const inventoryData = (inventory || []) as Pick<InventorySnapshot, 'plastic_id' | 'current_stock_kg' | 'is_low_stock'>[]

    // Calculate Inventory KPIs
    let total_stock_kg = 0
    let low_stock_count = 0
    inventoryData.forEach(item => {
        total_stock_kg += Number(item.current_stock_kg || 0)
        if (item.is_low_stock) low_stock_count += 1
    })

    // 2. Fetch Order Summary for KPIs (Current month)
    const today = new Date()
    const thisMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`

    const { data: ordersMonth, error: orderError } = await supabase
        .from('v_order_summary')
        .select('id, status, order_month')
        .eq('order_month', thisMonthStr)

    if (orderError) {
        console.error('Lỗi lấy order summary:', orderError.message)
    }

    const ordersData = (ordersMonth || []) as Pick<OrderSummary, 'id' | 'status' | 'order_month'>[]

    let orders_pending = 0
    let orders_shipped = 0
    let orders_this_month = ordersData.length

    ordersData.forEach(o => {
        if (['pending', 'confirmed', 'in_production'].includes(o.status)) orders_pending += 1
        if (o.status === 'shipped' || o.status === 'delivered') orders_shipped += 1
    })

    const kpis: DashboardKPI = {
        total_stock_kg,
        low_stock_count,
        orders_pending,
        orders_shipped,
        orders_this_month
    }

    // 3. Fetch Orders Grouped by Status for Chart
    const { data: orderStatusData } = await supabase
        .from('v_order_summary')
        .select('status')

    const statusCounts: Record<string, number> = {}
    if (orderStatusData) {
        orderStatusData.forEach((row: any) => {
            statusCounts[row.status] = (statusCounts[row.status] || 0) + 1
        })
    }

    // 4. Fetch Weekly Consumption (Mock logic using order_week)
    // v_order_summary has order_week and total_qty. We'll use this for the chart.
    const { data: weeklyData } = await supabase
        .from('v_order_summary')
        .select('order_week, total_qty')
        .order('order_week', { ascending: false })
        .limit(50) // About a year max

    // Aggregate by week
    const weeklyAgg: Record<string, number> = {}
    if (weeklyData) {
        weeklyData.forEach((row: any) => {
            if (row.order_week) {
                weeklyAgg[row.order_week] = (weeklyAgg[row.order_week] || 0) + Number(row.total_qty || 0)
            }
        })
    }

    // Sort weeks ascending
    const sortedWeeks = Object.keys(weeklyAgg).sort()
    const weeklyChartData = sortedWeeks.slice(-8).map(week => ({
        week,
        quantity: weeklyAgg[week]
    }))

    return {
        kpis,
        statusCounts,
        weeklyChartData
    }
}
