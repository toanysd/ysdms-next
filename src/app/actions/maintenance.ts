'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Types dựa trên View v_mold_health ---
export type MoldHealth = {
    physical_id: string
    physical_code: string
    mold_status: string
    cavity: number
    mold_base_code: string
    mold_name: string | null
    revision_code: string
    total_shots: number
    last_shot_date: string | null
    maintenance_type: string | null
    interval_shots: number | null
    alert_threshold_shots: number | null
    shots_since_last_maintenance: number | null
    lifecycle_pct: number | null
    health_status: 'OK' | 'WARNING' | 'OVERDUE' | 'NO_SCHEDULE'
}

export type MaintenanceLog = {
    id: string
    mold_physical_id: string
    maintenance_date: string
    performed_by: string | null
    shots_at_maintenance: number | null
    maintenance_type: string | null
    action_taken: string | null
    cost: number | null
    created_at: string
}

// Lấy danh sách trạng thái khuôn (Health Status)
export async function getMoldHealthList(): Promise<MoldHealth[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_mold_health')
        .select('*')
        .order('lifecycle_pct', { ascending: false })

    if (error) {
        console.error('Lỗi lấy Mold Health:', error.message)
        throw new Error(error.message)
    }

    return (data || []) as MoldHealth[]
}

// Lấy danh sách quá hạn bảo trì
export async function getMaintenanceOverdue(): Promise<MoldHealth[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_maintenance_overdue')
        .select('*')
        .order('lifecycle_pct', { ascending: false })

    if (error) {
        console.error('Lỗi lấy Maintenance Overdue:', error.message)
        throw new Error(error.message)
    }

    return (data || []) as MoldHealth[]
}

// Lấy lịch sử log
export async function getMaintenanceLogs(physical_id?: string): Promise<MaintenanceLog[]> {
    const supabase = await createClient()

    let query = supabase
        .from('mold_maintenance_log')
        .select('*')
        .order('maintenance_date', { ascending: false })

    if (physical_id) {
        query = query.eq('mold_physical_id', physical_id)
    }

    const { data, error } = await query

    if (error) {
        console.error('Lỗi lấy Maintenance Log:', error.message)
        throw new Error(error.message)
    }

    return (data || []) as MaintenanceLog[]
}

// Ghi Log bảo trì mới
export async function addMaintenanceLog(logData: {
    mold_physical_id: string
    maintenance_date: string
    performed_by: string
    shots_at_maintenance: number
    maintenance_type: string
    action_taken: string
    cost: number
}) {
    const supabase = await createClient()

    const { error } = await supabase.rpc('record_maintenance_and_reset', {
        p_physical_id: logData.mold_physical_id,
        p_performed_by: logData.performed_by,
        p_maintenance_type: logData.maintenance_type,
        p_action_taken: logData.action_taken,
        p_cost: logData.cost
    })

    if (error) {
        console.error('Lỗi khi chạy RPC record_maintenance_and_reset:', error.message)
        throw new Error(error.message)
    }

    revalidatePath('/maintenance')
    revalidatePath('/dashboard')
}
