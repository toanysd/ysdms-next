'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
}

/**
 * Lấy danh sách các Order Items đang ở trạng thái 'in_production' ở cấp Order Header
 * Đại diện cho cột "Chờ chạy" hoặc "Cần chạy" trên Xưởng.
 */
export async function getPendingProductionItems() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('order_items')
        .select(`
            id, line_no, quantity, product_id, product_pn_raw,
            orders!inner(id, status, slip_no, order_date, customer_id),
            production_log(id, produced_qty, scrap_qty, status)
        `)
        .eq('orders.status', 'in_production')

    if (error) {
        console.error('Error fetching pending items:', error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Lấy danh sách các ca máy đang chạy thật trong xưởng (IN_PROGRESS)
 */
export async function getActiveProductionLogs() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('production_log')
        .select(`
            *,
            machine_master(code, name),
            machine_instance(internal_code, name),
            order_items(id, quantity, product_pn_raw, product_id),
            production_plans(id, operator_name, planned_quantity)
        `)
        .eq('status', 'IN_PROGRESS')
        .order('start_time', { ascending: false })

    if (error) {
        console.error('Error fetching active production logs:', error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Kích hoạt bắt đầu chạy máy (IN_PROGRESS)
 */
export async function startProductionLog(input: StartProductionInput) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('production_log')
        .insert({
            order_item_id: input.order_item_id,
            machine_id: input.machine_id,
            cutter_id: input.cutter_id || null,
            mold_physical_id: input.mold_physical_id || null,
            operator_name: input.operator_name || null,
            status: 'IN_PROGRESS',
            start_time: new Date().toISOString()
        })
        .select()
        .single()

    if (error) {
        console.error('Error starting production:', error)
        throw new Error(error.message)
    }

    revalidatePath('/production')
    revalidatePath('/production/active')
    return { success: true, log: data }
}

/**
 * Chốt ca máy (COMPLETED), ghi nhận số lượng và cộng mài mòn Khuôn
 */
export async function completeProductionLog(input: CompleteProductionInput) {
    const supabase = await createClient()

    const { data: logData, error: updateError } = await supabase
        .from('production_log')
        .update({
            produced_qty: input.produced_qty,
            scrap_qty: input.scrap_qty,
            end_time: new Date().toISOString(),
            status: 'COMPLETED',
            updated_at: new Date().toISOString()
        })
        .eq('id', input.log_id)
        .select('id, mold_physical_id')
        .single()

    if (updateError || !logData) {
        console.error('Error completing production log:', updateError)
        throw new Error(updateError?.message || 'Failed to complete log')
    }

    // Auto Add Shots to Mold
    if (logData.mold_physical_id && input.produced_qty > 0) {
        const { data: physData } = await supabase
            .from('mold_physical')
            .select('cavity')
            .eq('id', logData.mold_physical_id)
            .single()

        const cavity = physData?.cavity || 1
        const addedShots = Math.ceil(input.produced_qty / cavity)

        const { data: counterData } = await supabase
            .from('mold_shot_counter')
            .select('id, total_shots')
            .eq('mold_physical_id', logData.mold_physical_id)
            .single()

        if (counterData) {
            await supabase
                .from('mold_shot_counter')
                .update({
                    total_shots: Number(counterData.total_shots) + addedShots,
                    last_shot_date: new Date().toISOString()
                })
                .eq('id', counterData.id)
        } else {
            await supabase
                .from('mold_shot_counter')
                .insert({
                    mold_physical_id: logData.mold_physical_id,
                    total_shots: addedShots,
                    last_shot_date: new Date().toISOString()
                })
        }
    }

    revalidatePath('/production')
    revalidatePath('/production/active')
    revalidatePath('/maintenance')
    return { success: true, log: logData }
}

/**
 * Lấy danh sách các Đơn hàng (Order Items) đang chờ được KẾ HOẠCH (DRAFT).
 * (Những đơn_items có tỷ lệ plan_coverage_pct < 100%)
 */
export async function getPendingOrderItemsForPlanning() {
    const supabase = await createClient()

    const { data: progressList, error: progressErr } = await supabase
        .from('v_production_plan_progress')
        .select('*')
        .lt('plan_coverage_pct', 100)

    if (progressErr || !progressList) {
        console.error('[API Error] getPendingOrderItemsForPlanning (progress):', progressErr)
        return []
    }

    if (progressList.length === 0) return []

    const itemIds = progressList.map(p => p.order_item_id)

    const { data: itemsDetails, error: detailsErr } = await supabase
        .from('order_items')
        .select(`
             id,
             product_id,
             product_pn_raw,
             quantity,
             delivery_date,
             orders!inner(slip_no, order_date, status),
             product_master ( code, customer_code, name )
        `)
        .in('id', itemIds)
        .in('orders.status', ['confirmed', 'in_production'])

    if (detailsErr || !itemsDetails) {
        console.error('[API Error] getPendingOrderItemsForPlanning (details):', detailsErr)
        return []
    }

    // Ghép Detail với Progress
    return progressList.map(p => {
        const detail = itemsDetails.find(d => d.id === p.order_item_id)
        return {
            ...p,
            detail
        }
    })
}

export type ProductionPlanInsert = {
    order_item_id: string
    machine_instance_id: string
    mold_physical_id: string
    planned_date: string
    operator_name?: string
    notes?: string

    planned_quantity: number
    estimated_shots?: number
    estimated_hours?: number
}

// Fetch Kế hoạch theo ngày (đã loại các plan bị xoá mềm)
export async function getProductionPlansByDate(dateStr: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('production_plans')
        .select(`
            *,
            machine_instance!inner(id, name, internal_code),
            mold_physical!inner(id, physical_code),
            order_items!inner(
                product_pn_raw, delivery_date,
                orders!inner(status, slip_no),
                product_master(code, customer_code, name)
            )
        `)
        .eq('planned_date', dateStr)
        .is('deleted_at', null)
        .order('priority', { ascending: false })

    if (error) {
        console.error('[API Error] getProductionPlansByDate:', error)
        return []
    }
    return data
}

// Lấy danh sách Kanban: Cột 1 (Cần Chạy)
export async function getTodayProductionPlans() {
    const supabase = await createClient()

    // Window rule: <= Today + 2 days
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 2)
    const maxDateStr = maxDate.toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('production_plans')
        .select(`
            *,
            machine_instance!inner(id, name, internal_code),
            mold_physical!inner(id, physical_code),
            order_items!inner(
                product_pn_raw, delivery_date, quantity,
                orders!inner(status, slip_no),
                product_master(code, customer_code, name)
            )
        `)
        .in('status', ['DRAFT', 'SCHEDULED'])
        .is('deleted_at', null)
        .lte('planned_date', maxDateStr)
        .order('priority', { ascending: false })
        .order('planned_date', { ascending: true })

    if (error) {
        console.error('[API Error] getTodayProductionPlans:', error)
        return []
    }
    return data
}

// Lấy danh sách Kanban: Cột 3 (Xong Hôm Nay)
export async function getTodayCompletedLogs() {
    const supabase = await createClient()

    // Yêu cầu: end_time >= start_of_today and <= end_of_today
    const todayStr = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('production_log')
        .select(`
            *,
            machine_master(code, name),
            machine_instance(internal_code, name),
            order_items(id, quantity, product_pn_raw, product_id, orders(slip_no)),
            production_plans(id, planned_quantity)
        `)
        .eq('status', 'COMPLETED')
        .gte('end_time', `${todayStr}T00:00:00Z`)
        .lte('end_time', `${todayStr}T23:59:59.999Z`)
        .order('end_time', { ascending: false })

    if (error) {
        console.error('[API Error] getTodayCompletedLogs:', error)
        return []
    }
    return data
}

// Lấy danh sách khuôn vật lý
export async function getProductPhysicalMolds(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_mold_map')
        .select(`
            mold_design_revision!inner(
                mold_physical(id, physical_code, status)
            )
        `)
        .eq('product_id', productId)

    if (error || !data) return []

    const molds: any[] = []
    data.forEach((map: any) => {
        if (map.mold_design_revision?.mold_physical) {
            const phys = map.mold_design_revision.mold_physical
            if (Array.isArray(phys)) molds.push(...phys)
            else molds.push(phys)
        }
    })

    if (molds.length > 0) return molds

    const { data: allMolds } = await supabase
        .from('mold_physical')
        .select('id, physical_code, status')
        .eq('status', 'ACTIVE')

    return allMolds || []
}

// -------------------------------------------------------------
// MUTATIONS
// -------------------------------------------------------------

export async function createProductionPlanAction(payload: ProductionPlanInsert) {
    const supabase = await createClient()
    const finalPayload = { ...payload, shift: 'DAY' }

    const { data, error } = await supabase
        .from('production_plans')
        .insert([finalPayload])
        .select('id')
        .single()

    if (error) {
        console.error('[API Error] createProductionPlanAction:', error)
        throw new Error(error.message)
    }

    revalidatePath('/production/planning')
    revalidatePath('/order')
    revalidatePath('/production')
    return data
}

export async function updateProductionPlanAction(planId: string, payload: Partial<ProductionPlanInsert>) {
    const supabase = await createClient()
    // 1. Guard check trạng thái
    const { data: plan } = await supabase
        .from('production_plans')
        .select('status')
        .eq('id', planId)
        .single()

    if (plan?.status === 'IN_PROGRESS' || plan?.status === 'COMPLETED') {
        throw new Error('Không thể sửa kế hoạch đang chạy hoặc đã hoàn thành (実行中・完了済みの計画は編集できません)')
    }

    // 2. Cập nhật
    const { error } = await supabase
        .from('production_plans')
        .update(payload)
        .eq('id', planId)

    if (error) throw new Error(error.message)

    revalidatePath('/production/planning')
    revalidatePath('/order')
    revalidatePath('/production')
}

export async function deleteProductionPlanAction(planId: string) {
    const supabase = await createClient()

    // 1. Guard check trạng thái Plan
    const { data: plan } = await supabase
        .from('production_plans')
        .select('status, order_item_id, order_items!inner(order_id, orders!inner(status))')
        .eq('id', planId)
        .single()

    if (plan?.status === 'IN_PROGRESS' || plan?.status === 'COMPLETED') {
        throw new Error('Không thể xóa kế hoạch đang chạy hoặc đã hoàn thành (実行中・完了済みの計画は削除できません)')
    }

    // 2. Guard check trạng thái đơn hàng (Order)
    const orderStatus = (plan as any)?.order_items?.orders?.status
    if (orderStatus === 'completed' || orderStatus === 'shipped') {
        throw new Error('Đơn hàng đã hoàn tất — không thể xóa kế hoạch liên quan (完了済み注文の計画は削除できません)')
    }

    // 3. Mark soft delete
    const { error } = await supabase
        .from('production_plans')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', planId)

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

    // 1. Guard check trạng thái
    const { data: plan } = await supabase
        .from('production_plans')
        .select('status')
        .eq('id', planId)
        .single()

    if (plan?.status !== 'DRAFT') {
        throw new Error('Chỉ có thể xác nhận kế hoạch đang ở trạng thái DRAFT (DRAFTの計画のみ確認できます)')
    }

    // 2. Chuyển DRAFT -> SCHEDULED
    const { error } = await supabase
        .from('production_plans')
        .update({
            status: 'SCHEDULED',
            updated_at: new Date().toISOString()
        })
        .eq('id', planId)

    if (error) throw new Error(error.message)

    revalidatePath('/production')
    revalidatePath('/production/planning')
}

export async function startProductionFromPlan(planId: string) {
    const supabase = await createClient()

    // Đọc thông tin kế hoạch
    const { data: plan } = await supabase
        .from('production_plans')
        .select(`
            id, order_item_id, machine_instance_id,
            mold_physical_id, operator_name, planned_quantity, status
        `)
        .eq('id', planId)
        .is('deleted_at', null)
        .single()

    if (!plan) throw new Error('Không tìm thấy kế hoạch / 計画が見つかりません')

    if (plan.status !== 'SCHEDULED') {
        throw new Error('Chỉ kế hoạch đã SCHEDULED (Xác nhận) mới có thể Start / SCHEDULED済みの計画のみ開始できます')
    }

    // Cập nhật production_plans -> IN_PROGRESS
    const { error: planUpdateErr } = await supabase
        .from('production_plans')
        .update({
            status: 'IN_PROGRESS',
            updated_at: new Date().toISOString()
        })
        .eq('id', planId)

    if (planUpdateErr) throw new Error(planUpdateErr.message)

    // Sinh production_log mới trỏ thẳng về machine_instance_id
    const { data: log, error: logErr } = await supabase
        .from('production_log')
        .insert({
            order_item_id: plan.order_item_id,
            machine_id: null, // Bỏ qua legacy thay vì crash
            machine_instance_id: plan.machine_instance_id, // Truyền trực tiếp ID của con máy hệ mới
            mold_physical_id: plan.mold_physical_id,
            operator_name: plan.operator_name,
            status: 'IN_PROGRESS',
            start_time: new Date().toISOString(),
            production_plan_id: planId // FK ngược
        })
        .select('id')
        .single()

    if (logErr) {
        // Rollback status in app-level (poor man's transaction as we don't have rpc here ready)
        await supabase.from('production_plans').update({ status: 'SCHEDULED' }).eq('id', planId)
        throw new Error(logErr.message)
    }

    revalidatePath('/production')
    revalidatePath('/production/planning')
    revalidatePath('/production/active')

    return { logId: log?.id }
}

