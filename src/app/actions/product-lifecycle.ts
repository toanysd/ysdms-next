'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProductLifecycleStatus = 'DRAFT' | 'DESIGN' | 'PROTOTYPE' | 'APPROVED' | 'MASS_PRODUCTION' | 'DISCONTINUED'

export interface ProductLifecycleLog {
    log_id: string
    product_id: string
    from_status: string | null
    to_status: string
    trigger_event: string
    reference_table: string | null
    reference_id: string | null
    changed_by: string | null
    reason: string | null
    created_at: string
    employee?: {
        employee_id: string
        employee_name: string
    } | null
}

/**
 * Lấy lịch sử chuyển đổi vòng đời của sản phẩm
 */
export async function getProductLifecycleLogs(productId: string): Promise<ProductLifecycleLog[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('product_lifecycle_logs')
        .select(`
            *,
            employee:employees(employee_id, employee_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[API Error] getProductLifecycleLogs:', error)
        return []
    }

    return (data || []) as ProductLifecycleLog[]
}

/**
 * Chuyển trạng thái vòng đời sản phẩm thủ công (Manual Override) hoặc qua quy trình
 */
export async function transitionProductLifecycleAction(data: {
    product_id: string
    to_status: ProductLifecycleStatus
    reason: string
    trigger_event?: string
    reference_table?: string
    reference_id?: string
    changed_by?: string
    is_manual_override?: boolean
}) {
    const supabase = await createClient()

    try {
        const isOverride = data.is_manual_override !== false
        const event = data.trigger_event || (isOverride ? 'MANUAL_OVERRIDE' : 'PROCESS_TRANSITION')

        // Kiểm tra validation Yêu cầu 1: reason bắt buộc khi MANUAL_OVERRIDE
        if (event === 'MANUAL_OVERRIDE' && (!data.reason || !data.reason.trim())) {
            return { success: false, error: 'Bắt buộc phải nhập lý do khi thay đổi trạng thái vòng đời thủ công (MANUAL_OVERRIDE).' }
        }

        // Gọi Atomic RPC fn_transition_product_lifecycle
        const { data: logId, error: rpcError } = await (supabase.rpc as any)('fn_transition_product_lifecycle', {
            p_product_id: data.product_id,
            p_to_status: data.to_status,
            p_trigger_event: event,
            p_reference_table: data.reference_table || null,
            p_reference_id: data.reference_id || null,
            p_reason: data.reason ? data.reason.trim() : null,
            p_changed_by: data.changed_by || null,
        })

        if (rpcError) throw rpcError

        revalidatePath('/product-center/[id]', 'page')
        revalidatePath('/product-center', 'page')

        return { success: true, log_id: logId }
    } catch (err: any) {
        console.error('[Action Error] transitionProductLifecycleAction:', err)
        return { success: false, error: err.message || 'Lỗi khi cập nhật trạng thái vòng đời' }
    }
}
