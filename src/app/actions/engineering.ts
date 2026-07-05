'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEngineeringRequests() {
    const supabase = await createClient()

    // Fetch order lines belonging to design orders
    const { data, error } = await supabase
        .from('order_lines')
        .select(`
            id:line_id,
            order_id,
            line_no,
            product_id,
            quantity,
            delivery_date:due_date,
            orders!inner(
                slip_no:order_no,
                order_date,
                status:order_status,
                order_type,
                customers:companies!orders_company_id_fkey(customer_name_jp:company_name, customer_code:company_code)
            ),
            product_master:products!inner(
                id:product_id,
                code:product_code,
                name:product_name,
                design_revisions(
                    status
                )
            )
        `)
        .in('orders.order_type', ['design_tray', 'design_mold'])
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[API Error] getEngineeringRequests:', error)
        return []
    }

    // Map next-gen data structure to frontend expectations (spec_ext)
    const mapped = (data || []).map((req: any) => {
        const product = Array.isArray(req.product_master) ? req.product_master[0] : req.product_master
        const designRevision = product?.design_revisions?.[0]
        const designStatus = designRevision?.status ? designRevision.status.toLowerCase() : 'draft'

        return {
            ...req,
            product_pn_raw: product?.code || null,
            product_master: {
                ...product,
                spec_ext: {
                    design_status: designStatus
                }
            }
        }
    })

    return mapped
}

export async function updateDesignStatus(productId: string, newStatus: string) {
    const supabase = await createClient()
    
    // Update design_revisions directly via product_id (mold_masters DROPPED)
    const { error: updateErr } = await supabase
        .from('design_revisions')
        .update({ status: newStatus.toUpperCase() })
        .eq('product_id', productId)
        
    if (updateErr) throw new Error(updateErr.message)
    
    revalidatePath('/engineering')
    revalidatePath(`/production/products/${productId}`)
    
    return { success: true }
}
