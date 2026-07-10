'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

export interface StartProductionInput {
    order_item_id: string
    machine_id: string
    cutter_id?: string | null
    mold_physical_id?: string | null
    operator_name?: string | null
}

export interface CompleteProductionInput {
    log_id: string
    produced_qty: number
    scrap_qty: number
    roll_barcode?: string
    meters_consumed?: number
    meters_remaining?: number
    meters_wasted?: number
}

/**
 * Lấy danh sách các Order Lines đang ở trạng thái 'IN_PRODUCTION' ở cấp Order Header
 */
export async function getPendingProductionItems() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('order_lines')
        .select(`
            line_id, line_no, quantity, product_id,
            products(product_code, product_name),
            orders!inner(order_id, order_status, order_no, order_date, company_id),
            production_orders(
                po_id,
                po_status,
                production_logs(
                    log_id,
                    output_quantity,
                    defect_quantity,
                    end_time
                )
            )
        `)
        .eq('orders.order_status', 'IN_PRODUCTION')

    if (error) {
        console.error('Error fetching pending items:', error)
        throw new Error(error.message)
    }

    return data.map((d: any) => {
        const prod = d.products
        const order = d.orders
        const po = d.production_orders?.[0]
        const logs = po?.production_logs || []
        
        return {
            id: d.line_id,
            line_no: d.line_no,
            quantity: d.quantity,
            product_id: d.product_id,
            product_pn_raw: prod?.product_code || '',
            orders: order ? {
                id: order.order_id,
                status: order.order_status,
                slip_no: order.order_no,
                order_date: order.order_date,
                customer_id: order.company_id
            } : null,
            production_log: logs.map((l: any) => ({
                id: l.log_id,
                produced_qty: l.output_quantity || 0,
                scrap_qty: l.defect_quantity || 0,
                status: l.end_time ? 'COMPLETED' : 'IN_PROGRESS'
            }))
        }
    })
}

/**
 * Lấy danh sách các ca máy đang chạy thật trong xưởng (IN_PROGRESS)
 */
export async function getActiveProductionLogs() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('production_logs')
        .select(`
            *,
            machines(machine_id, machine_name, machine_code),
            employees(employee_id, employee_name, employee_name_short),
            production_orders(
                po_id,
                po_code,
                planned_quantity,
                order_lines(
                    line_id,
                    quantity,
                    products(product_code, product_name)
                )
            )
        `)
        .is('end_time', null)
        .order('start_time', { ascending: false })

    if (error) {
        console.error('Error fetching active production logs:', error)
        throw new Error(error.message)
    }

    return data.map((log: any) => ({
        ...log,
        id: log.log_id,
        operator_name: log.employees?.employee_name_short || log.employees?.employee_name || 'N/A',
        machine_instance: log.machines ? { id: log.machines.machine_id, name: log.machines.machine_name, internal_code: log.machines.machine_code } : null,
        order_items: log.production_orders?.order_lines ? {
            id: log.production_orders.order_lines.line_id,
            quantity: log.production_orders.order_lines.quantity,
            product_pn_raw: log.production_orders.order_lines.products?.product_code,
            product_id: log.production_orders.order_lines.product_id
        } : null,
        production_plans: log.production_orders ? {
            id: log.production_orders.po_id,
            operator_name: log.employees?.employee_name_short || log.employees?.employee_name || 'N/A',
            planned_quantity: log.production_orders.planned_quantity
        } : null
    }))
}

/**
 * Kích hoạt bắt đầu chạy máy (IN_PROGRESS)
 */
export async function startProductionLog(input: StartProductionInput) {
    const supabase = await createClient()

    // Find or create production order (po) for this order line
    let poId = null
    const { data: poData } = await supabase
        .from('production_orders')
        .select('po_id')
        .eq('order_line_id', input.order_item_id)
        .limit(1)
        .maybeSingle()

    if (poData) {
        poId = poData.po_id
    } else {
        const { data: newPo } = await supabase
            .from('production_orders')
            .insert({
                order_line_id: input.order_item_id,
                po_code: 'PO-' + input.order_item_id.substring(0, 8).toUpperCase(),
                planned_quantity: 0,
                po_status: 'IN_PROGRESS'
            })
            .select('po_id')
            .single()
        if (newPo) poId = newPo.po_id
    }

    // Resolve operator name/code to employee_id
    let operatorId = null
    if (input.operator_name) {
        const { data: empData } = await supabase
            .from('employees')
            .select('employee_id')
            .or(`employee_name.eq."${input.operator_name}",employee_name_short.eq."${input.operator_name}",employee_code.eq."${input.operator_name}"`)
            .limit(1)
            .maybeSingle()
        if (empData) operatorId = empData.employee_id
    }

    const { data, error } = await supabase
        .from('production_logs')
        .insert({
            po_id: poId,
            machine_id: input.machine_id,
            operator_id: operatorId,
            start_time: new Date().toISOString(),
            log_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single()

    if (error) {
        console.error('Error starting production:', error)
        throw new Error(error.message)
    }

    revalidatePath('/production')
    revalidatePath('/production/active')
    return { success: true, log: { ...data, id: data.log_id } }
}

/**
 * Chốt ca máy (COMPLETED)
 */
export async function completeProductionLog(input: CompleteProductionInput) {
    const supabase = await createClient()

    const { data: logData, error: updateError } = await supabase
        .from('production_logs')
        .update({
            output_quantity: input.produced_qty,
            defect_quantity: input.scrap_qty,
            forming_params_json: {
                roll_barcode: input.roll_barcode || null,
                meters_consumed: input.meters_consumed || 0,
                meters_remaining: input.meters_remaining || 0,
                meters_wasted: input.meters_wasted || 0
            },
            end_time: new Date().toISOString()
        })
        .eq('log_id', input.log_id)
        .select('log_id')
        .single()

    if (updateError || !logData) {
        console.error('Error completing production log:', updateError)
        throw new Error(updateError?.message || 'Failed to complete log')
    }

    revalidatePath('/production')
    revalidatePath('/production/active')
    revalidatePath('/maintenance')
    return { success: true, log: { id: logData.log_id } }
}

/**
 * Lấy danh sách các đơn hàng đang chờ được KẾ HOẠCH (DRAFT).
 */
export async function getPendingOrderItemsForPlanning(limitDateStr?: string) {
    noStore()
    if (!limitDateStr) {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 60)
        limitDateStr = futureDate.toISOString().split('T')[0]
    }

    const supabase = await createClient()

    const { data: linesData, error: linesErr } = await supabase
        .from('order_lines')
        .select(`
             line_id,
             order_id,
             product_id,
             quantity,
             due_date,
             line_status,
             orders!inner(order_no, order_date, order_status),
             products!inner(product_code, product_name)
        `)
        .in('orders.order_status', ['NEW', 'APPROVED', 'IN_PRODUCTION'])
        .or(`due_date.lte.${limitDateStr},due_date.is.null`)

    if (linesErr || !linesData) {
        console.error('[API Error] getPendingOrderItemsForPlanning (lines):', linesErr)
        return []
    }

    if (linesData.length === 0) return []

    const lineIds = linesData.map(l => l.line_id)
    const { data: schedulesData, error: schedulesErr } = await supabase
        .from('production_orders')
        .select('order_line_id, planned_quantity')
        .in('order_line_id', lineIds)
        .neq('po_status', 'CANCELLED')

    if (schedulesErr) {
        console.error('[API Error] getPendingOrderItemsForPlanning (schedules):', schedulesErr)
        return []
    }

    const merged = linesData.map(line => {
        const lineSchedules = schedulesData?.filter(s => s.order_line_id === line.line_id) || []
        const totalPlanned = lineSchedules.reduce((sum, s) => sum + (s.planned_quantity || 0), 0)
        const coveragePct = line.quantity > 0 ? (totalPlanned / line.quantity) * 100 : 100

        const product = (Array.isArray(line.products) ? line.products[0] : line.products) as any
        const order = (Array.isArray(line.orders) ? line.orders[0] : line.orders) as any

        return {
            order_item_id: line.line_id,
            total_ordered: line.quantity,
            total_requested_qty: line.quantity,
            total_planned: totalPlanned,
            plan_coverage_pct: coveragePct,
            detail: {
                id: line.line_id,
                product_id: line.product_id,
                product_pn_raw: product?.product_code,
                quantity: line.quantity,
                delivery_date: line.due_date,
                orders: { slip_no: order?.order_no, order_date: order?.order_date, status: order?.order_status },
                product_master: { 
                  code: product?.product_code, 
                  name: product?.product_name
                }
            }
        }
    })
    
    return merged.filter(p => p.plan_coverage_pct < 100)
}

export type ProductionPlanInsert = {
    order_item_id?: string
    order_line_id?: string
    machine_instance_id?: string
    machine_id?: string
    mold_physical_id?: string | null
    planned_date?: string
    schedule_date?: string
    operator_name?: string
    notes?: string
    product_id?: string

    planned_quantity: number
    estimated_shots?: number
    estimated_hours?: number
    shift?: 'DAY' | 'NIGHT'
    
    quantity_note?: string
    delivery_date?: string
    sort_order?: number
    material_feed_length_mm?: number
}

// Fetch Kế hoạch theo ngày
export async function getProductionPlansByDate(dateStr: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('production_orders')
        .select(`
            *,
            machines(machine_id, machine_name, machine_code),
            physical_molds(physical_mold_id, system_code),
            order_lines(
                line_id, product_id, due_date, quantity,
                products(product_code, product_name),
                orders(order_status, order_no)
            )
        `)
        .gte('planned_start', `${dateStr}T00:00:00Z`)
        .lte('planned_start', `${dateStr}T23:59:59.999Z`)

    if (error) {
        console.error('[API Error] getProductionPlansByDate:', error)
        return []
    }
    
    return data.map((d: any) => ({
        ...d,
        id: d.po_id,
        planned_date: d.planned_start,
        machine_instance_id: d.machine_id,
        order_item_id: d.order_line_id,
        machine_instance: d.machines ? { id: d.machines.machine_id, name: d.machines.machine_name, internal_code: d.machines.machine_code } : null,
        order_items: d.order_lines ? {
            id: d.order_lines.line_id,
            product_id: d.order_lines.product_id,
            delivery_date: d.order_lines.due_date,
            quantity: d.order_lines.quantity,
            product_pn_raw: d.order_lines.products?.product_code,
            orders: { status: d.order_lines.orders?.order_status, slip_no: d.order_lines.orders?.order_no },
            product_master: { code: d.order_lines.products?.product_code, name: d.order_lines.products?.product_name }
        } : null
    }))
}

export async function getProductionPlansByDateRange(startDateStr: string, endDateStr: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('production_orders')
        .select(`
            *,
            machines(machine_id, machine_name, machine_code),
            physical_molds(physical_mold_id, system_code),
            order_lines(
                line_id, product_id, due_date, quantity,
                products(product_code, product_name),
                orders(order_status, order_no)
            )
        `)
        .gte('planned_start', startDateStr)
        .lte('planned_start', endDateStr)

    if (error) {
        console.error('[API Error] getProductionPlansByDateRange:', error)
        return []
    }
    
    return data.map((d: any) => ({
        ...d,
        id: d.po_id,
        planned_date: d.planned_start,
        machine_instance_id: d.machine_id,
        order_item_id: d.order_line_id,
        machine_instance: d.machines ? { id: d.machines.machine_id, name: d.machines.machine_name, internal_code: d.machines.machine_code } : null,
        order_items: d.order_lines ? {
            id: d.order_lines.line_id,
            product_id: d.order_lines.product_id,
            delivery_date: d.order_lines.due_date,
            quantity: d.order_lines.quantity,
            product_pn_raw: d.order_lines.products?.product_code,
            orders: { status: d.order_lines.orders?.order_status, slip_no: d.order_lines.orders?.order_no },
            product_master: { code: d.order_lines.products?.product_code, name: d.order_lines.products?.product_name }
        } : null
    }))
}

// Lấy danh sách Kanban: Cột 1 (Cần Chạy)
export async function getTodayProductionPlans() {
    const supabase = await createClient()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 2)
    const maxDateStr = maxDate.toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('production_orders')
        .select(`
            *,
            machines(machine_id, machine_name, machine_code),
            physical_molds(physical_mold_id, system_code),
            order_lines(
                line_id, product_id, due_date, quantity,
                products(product_code, product_name),
                orders(order_status, order_no)
            )
        `)
        .in('po_status', ['PLANNED', 'SCHEDULED'])
        .lte('planned_start', maxDateStr)
        .order('planned_start', { ascending: true })

    if (error) {
        console.error('[API Error] getTodayProductionPlans:', error)
        return []
    }
    
    return data.map((d: any) => ({
        ...d,
        id: d.po_id,
        planned_date: d.planned_start,
        machine_instance_id: d.machine_id,
        order_item_id: d.order_line_id,
        machine_instance: d.machines ? { id: d.machines.machine_id, name: d.machines.machine_name, internal_code: d.machines.machine_code } : null,
        order_items: d.order_lines ? {
            id: d.order_lines.line_id,
            product_id: d.order_lines.product_id,
            delivery_date: d.order_lines.due_date,
            quantity: d.order_lines.quantity,
            product_pn_raw: d.order_lines.products?.product_code,
            orders: { status: d.order_lines.orders?.order_status, slip_no: d.order_lines.orders?.order_no },
            product_master: { code: d.order_lines.products?.product_code, name: d.order_lines.products?.product_name }
        } : null
    }))
}

// Lấy danh sách Kanban: Cột 3 (Xong Hôm Nay)
export async function getTodayCompletedLogs() {
    const supabase = await createClient()

    const todayStr = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('production_logs')
        .select(`
            *,
            machines(machine_id, machine_name, machine_code),
            employees(employee_id, employee_name, employee_name_short),
            production_orders(
                po_id,
                po_code,
                planned_quantity,
                order_lines(
                    line_id,
                    quantity,
                    products(product_code, product_name),
                    orders(order_status, order_no)
                )
            )
        `)
        .not('end_time', 'is', null)
        .gte('end_time', `${todayStr}T00:00:00Z`)
        .lte('end_time', `${todayStr}T23:59:59.999Z`)
        .order('end_time', { ascending: false })

    if (error) {
        console.error('[API Error] getTodayCompletedLogs:', error)
        return []
    }
    
    return data.map((log: any) => ({
        ...log,
        id: log.log_id,
        produced_qty: log.output_quantity,
        scrap_qty: log.defect_quantity,
        machine_instance: log.machines ? { internal_code: log.machines.machine_code, name: log.machines.machine_name } : null,
        order_items: log.production_orders?.order_lines ? {
            id: log.production_orders.order_lines.line_id,
            quantity: log.production_orders.order_lines.quantity,
            product_pn_raw: log.production_orders.order_lines.products?.product_code,
            product_id: log.production_orders.order_lines.product_id,
            orders: { slip_no: log.production_orders.order_lines.orders?.order_no }
        } : null,
        production_plans: log.production_orders ? {
            id: log.production_orders.po_id,
            planned_quantity: log.production_orders.planned_quantity
        } : null
    }))
}

// Lấy danh sách khuôn vật lý (via design_revisions → mold_revisions → physical_molds)
export async function getProductPhysicalMolds(productId: string) {
    const supabase = await createClient()
    // NEW: design_revisions.product_id → mold_revisions → physical_molds
    const { data, error } = await supabase
        .from('design_revisions')
        .select(`
            mold_revisions(
                physical_molds(physical_mold_id, system_code, device_status)
            )
        `)
        .eq('product_id', productId)

    if (error || !data) return []

    const molds: any[] = []
    data.forEach((dr: any) => {
        if (dr.mold_revisions) {
            dr.mold_revisions.forEach((rev: any) => {
                if (rev.physical_molds) {
                    if (Array.isArray(rev.physical_molds)) molds.push(...rev.physical_molds)
                    else molds.push(rev.physical_molds)
                }
            })
        }
    })

    return molds
}

// Lấy toàn bộ khuôn vật lý
export async function getAllPhysicalMolds() {
    const supabase = await createClient()
    const { data: allMolds } = await supabase
        .from('physical_molds')
        .select('physical_mold_id, system_code, device_status')
        .eq('device_status', 'ACTIVE')

    return allMolds || []
}

// Lấy danh sách các khuôn ĐÃ BỊ CHIẾM DỤNG trong một ngày/ca cụ thể
export async function getOccupiedMolds(dateStr: string, shift: 'DAY'|'NIGHT', excludePlanId?: string) {
    const supabase = await createClient()
    let query = supabase
        .from('production_orders')
        .select(`
            physical_mold_id,
            machines(machine_code)
        `)
        .gte('planned_start', `${dateStr}T00:00:00Z`)
        .lte('planned_start', `${dateStr}T23:59:59.999Z`)
        .not('physical_mold_id', 'is', null)

    if (excludePlanId) {
        query = query.neq('po_id', excludePlanId)
    }

    const { data, error } = await query
    
    if (error || !data) return {}

    const occupiedMap: Record<string, string> = {}
    data.forEach((p: any) => {
        if (p.physical_mold_id) {
            occupiedMap[p.physical_mold_id] = p.machines?.machine_code || 'Máy khác'
        }
    })
    
    return occupiedMap
}

// -------------------------------------------------------------
// MUTATIONS & UTILS
// -------------------------------------------------------------

export async function getOperators() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('employees')
        .select('code:employee_code, name:employee_name, display_name:employee_name_short, employee_id')
        .eq('is_active', true)
        .order('employee_code')

    if (error) {
        console.error('[API Error] getOperators:', error)
        return []
    }
    return data || []
}

export async function createProductionPlanAction(payload: ProductionPlanInsert) {
    const supabase = await createClient()
    const finalPayload = { 
      order_line_id: payload.order_item_id || payload.order_line_id,
      machine_id: payload.machine_instance_id || payload.machine_id || '',
      planned_start: payload.planned_date || payload.schedule_date || new Date().toISOString(),
      planned_quantity: payload.planned_quantity,
      physical_mold_id: payload.mold_physical_id || null,
      notes: payload.notes,
      po_code: 'PO-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      po_status: 'PLANNED'
    }

    const { data, error } = await supabase
        .from('production_orders')
        .insert([finalPayload])
        .select('po_id')
        .single()

    if (error) {
        console.error('[API Error] createProductionPlanAction:', error)
        throw new Error(error.message)
    }

    revalidatePath('/production/planning')
    revalidatePath('/order')
    revalidatePath('/production')
    return { id: data.po_id }
}

export async function createProductionPlansBatchAction(payloads: ProductionPlanInsert[]) {
    const supabase = await createClient()
    const finalPayloads = payloads.map(payload => ({
      order_line_id: payload.order_item_id || payload.order_line_id,
      machine_id: payload.machine_instance_id || payload.machine_id || '',
      planned_start: payload.planned_date || payload.schedule_date || new Date().toISOString(),
      planned_quantity: payload.planned_quantity,
      physical_mold_id: payload.mold_physical_id || null,
      notes: payload.notes,
      po_code: 'PO-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      po_status: 'PLANNED'
    }))

    const { data, error } = await supabase
        .from('production_orders')
        .insert(finalPayloads)
        .select('po_id')

    if (error) {
        console.error('[API Error] createProductionPlansBatchAction:', error)
        throw new Error(error.message)
    }

    revalidatePath('/production/planning')
    revalidatePath('/order')
    revalidatePath('/production')
    return data.map(d => ({ id: d.po_id }))
}

export async function updateProductionPlanAction(planId: string, payload: Partial<ProductionPlanInsert>) {
    const supabase = await createClient()
    
    const { data: plan } = await supabase
        .from('production_orders')
        .select('po_status')
        .eq('po_id', planId)
        .single()

    if (plan?.po_status === 'IN_PROGRESS' || plan?.po_status === 'COMPLETED') {
        throw new Error('Không thể sửa kế hoạch đang chạy hoặc đã hoàn thành')
    }

    const updatePayload: any = {}
    if (payload.planned_date || payload.schedule_date) updatePayload.planned_start = payload.planned_date || payload.schedule_date
    if (payload.machine_instance_id || payload.machine_id) updatePayload.machine_id = payload.machine_instance_id || payload.machine_id
    if (payload.planned_quantity !== undefined) updatePayload.planned_quantity = payload.planned_quantity
    if (payload.notes !== undefined) updatePayload.notes = payload.notes
    if (payload.mold_physical_id !== undefined) updatePayload.physical_mold_id = payload.mold_physical_id
    updatePayload.updated_at = new Date().toISOString()

    const { error } = await supabase
        .from('production_orders')
        .update(updatePayload)
        .eq('po_id', planId)

    if (error) throw new Error(error.message)

    revalidatePath('/production/planning')
    revalidatePath('/order')
    revalidatePath('/production')
}

export async function deleteProductionPlanAction(planId: string) {
    const supabase = await createClient()

    const { data: plan } = await supabase
        .from('production_orders')
        .select('po_status, order_line_id, order_lines(order_id, orders(order_status))')
        .eq('po_id', planId)
        .single()

    if (plan?.po_status === 'IN_PROGRESS' || plan?.po_status === 'COMPLETED') {
        throw new Error('Không thể xóa kế hoạch đang chạy hoặc đã hoàn thành')
    }

    const orderStatus = (plan as any)?.order_lines?.orders?.order_status
    if (orderStatus === 'COMPLETED' || orderStatus === 'SHIPPED') {
        throw new Error('Đơn hàng đã hoàn tất - không thể xóa kế hoạch liên quan')
    }

    const { error } = await supabase
        .from('production_orders')
        .delete()
        .eq('po_id', planId)

    if (error) throw new Error(error.message)

    revalidatePath('/production/planning')
    revalidatePath('/order')
    revalidatePath('/production')
}

// -------------------------------------------------------------
// KANBAN ACTIONS
// -------------------------------------------------------------

export async function confirmProductionPlan(planId: string) {
    const supabase = await createClient()

    const { data: plan } = await supabase
        .from('production_orders')
        .select('po_status')
        .eq('po_id', planId)
        .single()

    if (plan?.po_status !== 'PLANNED') {
        throw new Error('Chỉ có thể xác nhận kế hoạch đang ở trạng thái PLANNED')
    }

    const { error } = await supabase
        .from('production_orders')
        .update({
            po_status: 'SCHEDULED',
            updated_at: new Date().toISOString()
        })
        .eq('po_id', planId)

    if (error) throw new Error(error.message)

    revalidatePath('/production')
    revalidatePath('/production/planning')
}

export async function startProductionFromPlan(planId: string) {
    const supabase = await createClient()

    const { data: plan } = await supabase
        .from('production_orders')
        .select(`
            po_id, order_line_id, machine_id,
            physical_mold_id, planned_quantity, po_status
        `)
        .eq('po_id', planId)
        .single()

    if (!plan) throw new Error('Không tìm thấy kế hoạch')

    if (plan.po_status !== 'SCHEDULED') {
        throw new Error('Chỉ kế hoạch đã SCHEDULED mới có thể Start')
    }

    const { error: planUpdateErr } = await supabase
        .from('production_orders')
        .update({
            po_status: 'IN_PROGRESS',
            updated_at: new Date().toISOString()
        })
        .eq('po_id', planId)

    if (planUpdateErr) throw new Error(planUpdateErr.message)

    const { data: log, error: logErr } = await supabase
        .from('production_logs')
        .insert({
            po_id: plan.po_id,
            machine_id: plan.machine_id,
            start_time: new Date().toISOString(),
            log_date: new Date().toISOString().split('T')[0]
        })
        .select('log_id')
        .single()

    if (logErr) {
        await supabase.from('production_orders').update({ po_status: 'SCHEDULED' }).eq('po_id', planId)
        throw new Error(logErr.message)
    }

    revalidatePath('/production')
    revalidatePath('/production/planning')
    revalidatePath('/production/active')

    return { logId: log?.log_id }
}

export async function getProductionPlansByOrderId(orderId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('production_orders')
        .select(`
            *,
            machines(machine_id, machine_code, machine_name),
            physical_molds(physical_mold_id, system_code),
            order_lines!inner(line_id, order_id, product_id, quantity)
        `)
        .eq('order_lines.order_id', orderId)

    if (error) {
        console.error('[API Error] getProductionPlansByOrderId:', error)
        return []
    }
    
    return data.map((d: any) => ({
        ...d,
        id: d.po_id,
        planned_date: d.planned_start,
        machine_instance_id: d.machine_id,
        order_item_id: d.order_line_id
    }))
}

// -------------------------------------------------------------
// PLASTIC WMS ACTIONS
// -------------------------------------------------------------

export async function consumePlasticRoll(rollBarcode: string, consumedMeters: number, workLogId?: string) {
    const supabase = await createClient()

    // 1. Fetch roll
    const { data: roll } = await (supabase as any)
        .from('plastic_receipt_roll')
        .select('id, current_length_m')
        .eq('roll_barcode', rollBarcode)
        .single()

    if (!roll) {
        throw new Error('Không tìm thấy cuộn nhựa này.')
    }

    if (roll.current_length_m < consumedMeters) {
        throw new Error('Số mét tồn kho không đủ để xuất.')
    }

    const newLength = roll.current_length_m - consumedMeters
    const newStatus = newLength <= 0 ? 'empty' : 'in_use'

    // 2. Insert log
    const { error: logErr } = await (supabase as any)
        .from('plastic_adjustment_log')
        .insert({
            roll_id: roll.id,
            change_length_m: -consumedMeters,
            action_type: 'PRODUCTION',
            work_log_id: workLogId || null
        })

    if (logErr) throw new Error(logErr.message)

    // 3. Update roll
    const { error: rollErr } = await (supabase as any)
        .from('plastic_receipt_roll')
        .update({
            current_length_m: newLength,
            status: newStatus,
            updated_at: new Date().toISOString()
        })
        .eq('id', roll.id)

    if (rollErr) throw new Error(rollErr.message)

    return { success: true, newLength }
}

