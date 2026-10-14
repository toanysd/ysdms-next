'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Types based on public.v_equipment_lifecycle_status & public.equipment_history (SSOT) ---
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

export type MaintenanceStats = {
    total: number
    overdue: number
    warning: number
    normal: number
}

export type MaintenanceLog = {
    id: string
    mold_physical_id: string
    equipment_code?: string | null
    equipment_name?: string | null
    maintenance_date: string
    performed_by: string | null
    shots_at_maintenance: number | null
    maintenance_type: string | null
    action_taken: string | null
    cost: number | null
    created_at: string
}

function mapLifecycleRowToMoldHealth(row: any): MoldHealth {
    const statusRaw = String(row.lifecycle_status || 'NORMAL').toUpperCase()
    const healthStatus: MoldHealth['health_status'] =
        statusRaw === 'OVERDUE'
            ? 'OVERDUE'
            : statusRaw === 'WARNING'
            ? 'WARNING'
            : 'OK'

    return {
        physical_id: row.equipment_id,
        physical_code: row.equipment_code || '—',
        mold_status: statusRaw,
        cavity: 0,
        mold_base_code: row.display_name || row.equipment_code || '—',
        mold_name: row.display_name || null,
        revision_code: row.equipment_type || 'MOLD',
        total_shots: Number(row.total_shots || 0),
        last_shot_date: null,
        maintenance_type: row.equipment_type || null,
        interval_shots: row.maintenance_shot_threshold != null ? Number(row.maintenance_shot_threshold) : 50000,
        alert_threshold_shots: null,
        shots_since_last_maintenance: Number(row.current_shots_since_service || 0),
        lifecycle_pct: Number(row.pct_life_used || 0),
        health_status: healthStatus,
    }
}

// Lấy thống kê KPI chính xác từ v_equipment_lifecycle_status (vượt giới hạn 1,000 dòng PostgREST)
export async function getMaintenanceStats(): Promise<MaintenanceStats> {
    const supabase = await createClient()

    const [totalRes, overdueRes, warningRes, normalRes] = await Promise.all([
        supabase.from('v_equipment_lifecycle_status').select('*', { count: 'exact', head: true }),
        supabase.from('v_equipment_lifecycle_status').select('*', { count: 'exact', head: true }).eq('lifecycle_status', 'OVERDUE'),
        supabase.from('v_equipment_lifecycle_status').select('*', { count: 'exact', head: true }).eq('lifecycle_status', 'WARNING'),
        supabase.from('v_equipment_lifecycle_status').select('*', { count: 'exact', head: true }).eq('lifecycle_status', 'NORMAL'),
    ])

    return {
        total: totalRes.count || 0,
        overdue: overdueRes.count || 0,
        warning: warningRes.count || 0,
        normal: normalRes.count || 0,
    }
}

// Lấy danh sách trạng thái thiết bị/khuôn từ v_equipment_lifecycle_status
export async function getMoldHealthList(): Promise<MoldHealth[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_equipment_lifecycle_status')
        .select('equipment_id, equipment_code, display_name, equipment_type, maintenance_shot_threshold, shots_at_last_maintenance, total_shots, current_shots_since_service, pct_life_used, lifecycle_status')
        .order('pct_life_used', { ascending: false, nullsFirst: false })
        .order('total_shots', { ascending: false })
        .limit(100)

    if (error) {
        console.error('Lỗi lấy Equipment Lifecycle Status:', error.message)
        throw new Error(error.message)
    }

    return (data || []).map(mapLifecycleRowToMoldHealth)
}

// Lấy danh sách quá hạn / cảnh báo bảo trì từ v_equipment_lifecycle_status
export async function getMaintenanceOverdue(): Promise<MoldHealth[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_equipment_lifecycle_status')
        .select('equipment_id, equipment_code, display_name, equipment_type, maintenance_shot_threshold, shots_at_last_maintenance, total_shots, current_shots_since_service, pct_life_used, lifecycle_status')
        .in('lifecycle_status', ['OVERDUE', 'WARNING'])
        .order('pct_life_used', { ascending: false, nullsFirst: false })
        .order('total_shots', { ascending: false })

    if (error) {
        console.error('Lỗi lấy Maintenance Overdue:', error.message)
        throw new Error(error.message)
    }

    return (data || []).map(mapLifecycleRowToMoldHealth)
}

// Lấy lịch sử bảo trì từ public.equipment_history (action_type = 'MAINTENANCE')
export async function getMaintenanceLogs(physical_id?: string): Promise<MaintenanceLog[]> {
    const supabase = await createClient()

    let query = supabase
        .from('equipment_history')
        .select('history_id, equipment_id, action_type, action_date, description, performed_by, created_at, equipment:equipment!equipment_history_equipment_id_fkey(equipment_code, display_name, equipment_type)')
        .eq('action_type', 'MAINTENANCE')
        .order('action_date', { ascending: false })
        .order('created_at', { ascending: false })

    if (physical_id) {
        query = query.eq('equipment_id', physical_id)
    }

    const { data, error } = await query

    if (error) {
        console.error('Lỗi lấy Maintenance Log từ equipment_history:', error.message)
        throw new Error(error.message)
    }

    return (data || []).map((row: any) => {
        const eq = Array.isArray(row.equipment) ? row.equipment[0] : row.equipment
        return {
            id: row.history_id,
            mold_physical_id: row.equipment_id,
            equipment_code: eq?.equipment_code || null,
            equipment_name: eq?.display_name || null,
            maintenance_date: row.action_date || row.created_at,
            performed_by: row.performed_by || null,
            shots_at_maintenance: null,
            maintenance_type: row.action_type || 'MAINTENANCE',
            action_taken: row.description || null,
            cost: null,
            created_at: row.created_at,
        }
    })
}

// Ghi Log bảo trì mới (Tạm khóa Read-Only trong WO-MOLD-UNIFY; chờ đặc tả WO-MAINTENANCE-SCHEMA-FIX)
export async function addMaintenanceLog(_logData: {
    mold_physical_id: string
    maintenance_date: string
    performed_by: string
    shots_at_maintenance: number
    maintenance_type: string
    action_taken: string
    cost: number
}) {
    // TODO(WO-MAINTENANCE-SCHEMA-FIX): Implement atomic maintenance log recording into public.equipment_history and shot reset on public.equipment after schema/write spec approval.
    const isMaintenanceWriteApproved = false
    if (!isMaintenanceWriteApproved) {
        throw new Error('保守記録の書込機能は安全仕様 (WO-MAINTENANCE-SCHEMA-FIX) 策定待ちのため一時ロック中です / Chức năng ghi nhận bảo trì đang tạm khóa chờ đặc tả WO-MAINTENANCE-SCHEMA-FIX')
    }
    revalidatePath('/maintenance')
    revalidatePath('/dashboard')
}
