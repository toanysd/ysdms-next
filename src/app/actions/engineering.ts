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

export async function updateRevisionStatus(revisionId: string, newStatus: string) {
    const supabase = await createClient()
    
    const { error: updateErr } = await supabase
        .from('design_revisions')
        .update({ status: newStatus.toUpperCase() })
        .eq('revision_id', revisionId)
        
    if (updateErr) throw new Error(updateErr.message)
    
    revalidatePath('/engineering')
    revalidatePath('/product-center')
    
    return { success: true }
}

export type CreateDesignRevisionInput = {
  product_id: string
  company_id?: string | null
  design_code: string
  revision_number: number
  status?: string
  design_date?: string | null
  designer?: string | null
  change_summary?: string | null
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  cutline_length?: number | null
  cutline_width?: number | null
  cavity_count?: number | null
  pocket_numbers?: number | null
  pitch_mm?: number | null
  cavity_pitch_mm?: number | null
  machine_feed_pitch_mm?: number | null
  corner_r?: string | null
  chamfer_c?: string | null
  draft_angle?: string | null
  undercut_spec?: string | null
  under_depth?: string | null
  orientation?: string | null
  setup_type?: string | null
  has_plug?: boolean | null
  plug_type?: string | null
  has_separate_cutter?: boolean | null
  plastic_type_designed?: string | null
  customer_drawing_no?: string | null
  customer_tray_name?: string | null
  customer_equipment_no?: string | null
  tray_info?: string | null
}

export async function createDesignRevisionAction(input: CreateDesignRevisionInput) {
  const supabase = await createClient()

  if (!input.product_id || !input.design_code) {
    throw new Error('product_id and design_code are required')
  }

  const payload: any = {
    product_id: input.product_id,
    company_id: input.company_id || null,
    design_code: input.design_code.trim(),
    revision_number: input.revision_number || 1,
    status: input.status || 'DRAFT',
    design_date: input.design_date || new Date().toISOString().split('T')[0],
    designer: input.designer || null,
    change_summary: input.change_summary || null,
    design_length: input.design_length ?? null,
    design_width: input.design_width ?? null,
    design_height: input.design_height ?? null,
    design_depth: input.design_depth ?? null,
    cutline_length: input.cutline_length ?? null,
    cutline_width: input.cutline_width ?? null,
    cavity_count: input.cavity_count ?? null,
    pocket_numbers: input.pocket_numbers ?? null,
    pitch_mm: input.pitch_mm ?? null,
    cavity_pitch_mm: input.cavity_pitch_mm ?? null,
    machine_feed_pitch_mm: input.machine_feed_pitch_mm ?? null,
    corner_r: input.corner_r || null,
    chamfer_c: input.chamfer_c || null,
    draft_angle: input.draft_angle || null,
    undercut_spec: input.undercut_spec || null,
    under_depth: input.under_depth || null,
    orientation: input.orientation || null,
    setup_type: input.setup_type || null,
    has_plug: input.has_plug ?? false,
    plug_type: input.plug_type || null,
    has_separate_cutter: input.has_separate_cutter ?? false,
    plastic_type_designed: input.plastic_type_designed || null,
    customer_drawing_no: input.customer_drawing_no || null,
    customer_tray_name: input.customer_tray_name || null,
    customer_equipment_no: input.customer_equipment_no || null,
    tray_info: input.tray_info || null,
  }

  const { data, error } = await supabase
    .from('design_revisions')
    .insert([payload])
    .select('revision_id, design_code, revision_number')
    .single()

  if (error) {
    console.error('[createDesignRevisionAction Error]:', error)
    throw new Error(error.message)
  }

  revalidatePath(`/master/products/${input.product_id}`)
  revalidatePath(`/engineering/designs/${input.product_id}`)

  return { success: true, data }
}

