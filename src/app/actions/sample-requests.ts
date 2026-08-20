'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type SampleType = 'POCKET_TEST' | 'FULL_TRAY_SAMPLE' | 'VACUUM_SAMPLE'
export type SampleResultStatus = 'REQUESTED' | 'IN_MAKING' | 'SENT_TO_CUSTOMER' | 'CUSTOMER_OK' | 'CUSTOMER_NG'

export interface SampleRequest {
    request_id: string
    product_id: string
    design_revision_id: string | null
    sample_type: SampleType
    requested_qty: number
    target_date: string | null
    result_status: SampleResultStatus
    ng_reason: string | null
    notes: string | null
    created_at: string
    design_revision?: {
        revision_id: string
        design_code: string | null
        plastic_type_designed: string | null
    } | null
}

/**
 * Lấy danh sách yêu cầu mẫu thử của sản phẩm
 */
export async function getSampleRequests(productId: string): Promise<SampleRequest[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sample_requests')
        .select(`
            *,
            design_revision:design_revisions(revision_id, design_code, plastic_type_designed)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[API Error] getSampleRequests:', error)
        return []
    }

    return (data || []) as SampleRequest[]
}

/**
 * Tạo yêu cầu làm mẫu thử mới (Pocket test / Tray sample)
 */
export async function createSampleRequestAction(formData: {
    product_id: string
    design_revision_id?: string | null
    sample_type: SampleType
    requested_qty: number
    target_date?: string
    notes?: string
    requested_by?: string
}) {
    const supabase = await createClient()

    try {
        const { data: sampleData, error: sampleError } = await supabase
            .from('sample_requests')
            .insert({
                product_id: formData.product_id,
                design_revision_id: formData.design_revision_id || null,
                sample_type: formData.sample_type,
                requested_qty: formData.requested_qty || 1,
                target_date: formData.target_date || null,
                result_status: 'REQUESTED',
                notes: formData.notes || null,
            })
            .select()
            .single()

        if (sampleError) throw sampleError

        // Side-effect: Cập nhật vòng đời sản phẩm sang PROTOTYPE nếu chưa phải
        const { data: prod } = await supabase
            .from('products')
            .select('product_lifecycle_status')
            .eq('product_id', formData.product_id)
            .single()

        if (prod && prod.product_lifecycle_status !== 'PROTOTYPE') {
            await (supabase.rpc as any)('fn_transition_product_lifecycle', {
                p_product_id: formData.product_id,
                p_to_status: 'PROTOTYPE',
                p_trigger_event: 'SAMPLE_REQUESTED',
                p_reference_table: 'sample_requests',
                p_reference_id: sampleData.request_id,
                p_reason: `Yêu cầu làm mẫu thử: ${formData.sample_type} (${formData.requested_qty} pcs)`,
                p_changed_by: formData.requested_by || null,
            })
        }

        revalidatePath('/product-center/[id]', 'page')

        return { success: true, data: sampleData }
    } catch (err: any) {
        console.error('[Action Error] createSampleRequestAction:', err)
        return { success: false, error: err.message || 'Lỗi khi tạo yêu cầu mẫu thử' }
    }
}

/**
 * Cập nhật trạng thái / kết quả kiểm tra mẫu thử từ Khách hàng
 */
export async function updateSampleStatusAction(formData: {
    request_id: string
    product_id: string
    result_status: SampleResultStatus
    ng_reason?: string
    notes?: string
    updated_by?: string
}) {
    const supabase = await createClient()

    try {
        const updatePayload: any = {
            result_status: formData.result_status,
            notes: formData.notes || null,
        }
        if (formData.ng_reason) {
            updatePayload.ng_reason = formData.ng_reason
        }

        const { data: sampleData, error: sampleError } = await supabase
            .from('sample_requests')
            .update(updatePayload)
            .eq('request_id', formData.request_id)
            .select()
            .single()

        if (sampleError) throw sampleError

        // Side-effect vòng đời qua Atomic RPC:
        if (formData.result_status === 'CUSTOMER_OK') {
            // Khách hàng duyệt mẫu OK -> chuyển sản phẩm sang APPROVED
            await (supabase.rpc as any)('fn_transition_product_lifecycle', {
                p_product_id: formData.product_id,
                p_to_status: 'APPROVED',
                p_trigger_event: 'SAMPLE_APPROVED',
                p_reference_table: 'sample_requests',
                p_reference_id: formData.request_id,
                p_reason: 'Mẫu thử được khách hàng nghiệm thu đạt yêu cầu (CUSTOMER_OK)',
                p_changed_by: formData.updated_by || null,
            })
        } else if (formData.result_status === 'CUSTOMER_NG') {
            // Khách hàng báo NG -> chuyển về DESIGN để chỉnh sửa bản vẽ
            await (supabase.rpc as any)('fn_transition_product_lifecycle', {
                p_product_id: formData.product_id,
                p_to_status: 'DESIGN',
                p_trigger_event: 'SAMPLE_REJECTED',
                p_reference_table: 'sample_requests',
                p_reference_id: formData.request_id,
                p_reason: `Mẫu thử không đạt (CUSTOMER_NG): ${formData.ng_reason || 'Cần sửa đổi thiết kế'}`,
                p_changed_by: formData.updated_by || null,
            })
        }

        revalidatePath('/product-center/[id]', 'page')

        return { success: true, data: sampleData }
    } catch (err: any) {
        console.error('[Action Error] updateSampleStatusAction:', err)
        return { success: false, error: err.message || 'Lỗi khi cập nhật kết quả mẫu thử' }
    }
}
