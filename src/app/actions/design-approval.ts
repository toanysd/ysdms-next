'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ApprovalStage = 'LAYOUT' | 'SAMPLE_POCKET' | 'MASS_DRAWING' | 'MASS_MOLD'
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED_REVISE' | 'CANCELLED'

export interface DesignApprovalLog {
    log_id: string
    design_revision_id: string
    approval_round: number
    approval_stage: ApprovalStage
    approver_id: string | null
    customer_feedback: string | null
    status: ApprovalStatus
    approved_date: string | null
    notes: string | null
    created_at: string
    approver?: {
        employee_id: string
        employee_name: string
        role?: string | null
    } | null
}

/**
 * Lấy toàn bộ lịch sử các vòng duyệt thiết kế của một Revision
 */
export async function getDesignApprovalLogs(designRevisionId: string): Promise<DesignApprovalLog[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('design_approval_logs')
        .select(`
            *,
            approver:employees(employee_id, employee_name, role)
        `)
        .eq('design_revision_id', designRevisionId)
        .order('approval_round', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[API Error] getDesignApprovalLogs:', error)
        return []
    }

    return (data || []) as DesignApprovalLog[]
}

/**
 * Lấy toàn bộ lịch sử duyệt thiết kế của tất cả Revisions thuộc 1 sản phẩm
 */
export async function getDesignApprovalLogsByProductId(productId: string): Promise<DesignApprovalLog[]> {
    const supabase = await createClient()

    const { data: revs } = await supabase
        .from('design_revisions')
        .select('revision_id')
        .eq('product_id', productId)

    if (!revs || revs.length === 0) return []

    const revIds = revs.map((r: any) => r.revision_id)

    const { data, error } = await supabase
        .from('design_approval_logs')
        .select(`
            *,
            approver:employees(employee_id, employee_name, role)
        `)
        .in('design_revision_id', revIds)
        .order('approval_round', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[API Error] getDesignApprovalLogsByProductId:', error)
        return []
    }

    return (data || []) as DesignApprovalLog[]
}

/**
 * Tạo bản ghi log duyệt thiết kế mới (hoặc vòng duyệt mới)
 */
export async function submitDesignApprovalLogAction(formData: {
    design_revision_id: string
    approval_round?: number
    approval_stage: ApprovalStage
    approver_id?: string | null
    customer_feedback?: string
    status: ApprovalStatus
    approved_date?: string
    notes?: string
}) {
    const supabase = await createClient()

    try {
        // Tự động tính số vòng nếu không truyền
        let round = formData.approval_round
        if (!round) {
            const { count } = await supabase
                .from('design_approval_logs')
                .select('*', { count: 'exact', head: true })
                .eq('design_revision_id', formData.design_revision_id)
            round = (count || 0) + 1
        }

        const insertPayload: any = {
            design_revision_id: formData.design_revision_id,
            approval_round: round,
            approval_stage: formData.approval_stage,
            approver_id: formData.approver_id || null,
            customer_feedback: formData.customer_feedback || null,
            status: formData.status,
            approved_date: formData.approved_date || (formData.status === 'APPROVED' ? new Date().toISOString() : null),
            notes: formData.notes || null,
        }

        const { data: logData, error: logError } = await supabase
            .from('design_approval_logs')
            .insert(insertPayload)
            .select()
            .single()

        if (logError) throw logError

        // Lấy thông tin design_revision và product tương ứng
        const { data: revData } = await supabase
            .from('design_revisions')
            .select('product_id, design_code, products(product_id, requires_prototype_mold, product_lifecycle_status)')
            .eq('revision_id', formData.design_revision_id)
            .single()

        // Cập nhật trạng thái trên design_revisions
        if (formData.status === 'APPROVED') {
            await supabase
                .from('design_revisions')
                .update({
                    status: 'APPROVED',
                    approved_date: formData.approved_date ? formData.approved_date.split('T')[0] : new Date().toISOString().split('T')[0],
                })
                .eq('revision_id', formData.design_revision_id)

            // Side-effect vòng đời sản phẩm:
            if (revData?.product_id) {
                const product = (revData as any).products
                const targetStatus = product?.requires_prototype_mold ? 'PROTOTYPE' : 'APPROVED'
                
                // Gọi Atomic RPC chuyển trạng thái và ghi log an toàn
                await (supabase.rpc as any)('fn_transition_product_lifecycle', {
                    p_product_id: revData.product_id,
                    p_to_status: targetStatus,
                    p_trigger_event: 'DESIGN_APPROVED',
                    p_reference_table: 'design_approval_logs',
                    p_reference_id: logData.log_id,
                    p_reason: `Bản vẽ ${revData.design_code || ''} được phê duyệt (${formData.approval_stage})`,
                    p_changed_by: formData.approver_id || null,
                })
            }
        } else if (formData.status === 'REJECTED_REVISE') {
            await supabase
                .from('design_revisions')
                .update({ status: 'REVISED' })
                .eq('revision_id', formData.design_revision_id)
        }

        revalidatePath('/product-center/[id]', 'page')
        revalidatePath('/engineering/designs', 'page')

        return { success: true, data: logData }
    } catch (err: any) {
        console.error('[Action Error] submitDesignApprovalLogAction:', err)
        return { success: false, error: err.message || 'Lỗi khi lưu kết quả phê duyệt thiết kế' }
    }
}
