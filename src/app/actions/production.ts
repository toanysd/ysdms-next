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
            order_items(id, quantity, product_pn_raw, product_id)
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
