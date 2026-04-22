'use server'

import {
    getActiveProductionLogs,
    getTodayCompletedLogs,
    getPendingOrderItemsForPlanning
} from './production'
import { createClient } from '@/lib/supabase/server'

export interface MasterDashboardKPIs {
    activeMachines: number
    todayOutputQty: number
    unscheduledOrders: number
    maintenanceAlerts: number
}

/**
 * Fetch all necessary KPIs for the Master Dashboard (Row 1)
 */
export async function getMasterDashboardKPIs(): Promise<MasterDashboardKPIs> {
    const supabase = await createClient()

    // 1. Active Machines
    const activeLogs = await getActiveProductionLogs()
    const activeMachinesCount = activeLogs?.length || 0

    // 2. Today's Output Qty
    const todayLogs = await getTodayCompletedLogs()
    const todayOutputQty = todayLogs?.reduce((sum: number, log: any) => sum + (log.produced_qty || 0), 0) || 0

    // 3. Unscheduled Orders
    const pendingOrders = await getPendingOrderItemsForPlanning()
    const unscheduledOrdersCount = pendingOrders?.length || 0

    // 4. Maintenance Alerts: Query new view
    const { count: maintenanceAlerts, error: err4 } = await supabase
        .from('v_maintenance_overdue')
        .select('*', { count: 'exact', head: true })

    return {
        activeMachines: activeMachinesCount,
        todayOutputQty,
        unscheduledOrders: unscheduledOrdersCount,
        maintenanceAlerts: maintenanceAlerts || 0
    }
}

/**
 * Fetch data for Coverage Chart (Widget 1 - Row 2)
 */
export async function getCoverageChartData() {
    const supabase = await createClient()

    // We fetch top 10 items in production progress for the chart
    const { data, error } = await supabase
        .from('v_production_plan_progress')
        .select(`
            order_item_id,
            total_requested_qty,
            total_planned_qty,
            plan_coverage_pct,
            completed_qty,
            order_items!inner(product_pn_raw)
        `)
        .order('plan_coverage_pct', { ascending: true })
        .limit(10)

    if (error) {
        console.error('[API Error] getCoverageChartData:', error)
        return []
    }

    return data.map((item: any) => ({
        name: item.order_items.product_pn_raw,
        requested: item.total_requested_qty,
        planned: item.total_planned_qty,
        completed: item.completed_qty,
        coveragePct: item.plan_coverage_pct
    }))
}
