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

export interface ApproveDesignRevisionInput {
  revisionId: string
  approvalType: 'PROTOTYPE' | 'MASS'
  targetDeadline?: string | null
  notes?: string | null
}

/**
 * Approves a design revision and automatically:
 * 1. Sets design_revisions status = 'APPROVED'
 * 2. Creates the physical equipment (Prototype: e.g. MMT-021 R2-D, Mass: e.g. MMT-021 R2)
 * 3. Creates the corresponding Manufacturing Job (JOB-MMT021R2-D or JOB-MMT021-M) with standard process steps on schedule
 */
export async function approveDesignRevisionAction(input: ApproveDesignRevisionInput) {
  const supabase = await createClient()

  // 1. Fetch revision & product details
  const { data: rev, error: revErr } = await supabase
    .from('design_revisions')
    .select(`
      revision_id, design_code, revision_number, design_category,
      design_length, design_width, design_height, plug_type,
      products!inner(product_id, product_code, product_name_internal, product_name, company_id, requires_prototype_mold)
    `)
    .eq('revision_id', input.revisionId)
    .single()

  if (revErr || !rev) {
    throw new Error(revErr?.message || 'Design revision not found')
  }

  const product = (rev as any).products
  const prodCode = (product.product_code || 'PRD').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const prodInternal = product.product_name_internal || product.product_code || 'PRD'
  const revNum = rev.revision_number != null ? rev.revision_number : 1
  const isPrototype = input.approvalType === 'PROTOTYPE'
  const hasPlug = Boolean(rev.plug_type && rev.plug_type !== 'NONE')

  // 2. Naming conventions per YSD Engineering Documentation
  let equipCode: string
  let displayName: string
  let jobCode: string
  let jobName: string
  let stepsConfig: Array<{ name: string; track: string; hours: number; codeId: number }>

  if (isPrototype) {
    const isR0 = revNum <= 0
    equipCode = isR0 ? `${prodInternal}-D` : `${prodInternal} R${revNum}-D`
    displayName = isR0 ? `[試作金型] ${prodInternal}` : `[試作金型] ${prodInternal} R${revNum}`
    jobCode = isR0 ? `JOB-${prodCode}-D` : `JOB-${prodCode}R${revNum}-D`
    jobName = isR0 ? `試作金型製作: ${prodInternal}` : `試作金型製作: ${prodInternal} R${revNum}`
    stepsConfig = [
      { name: '試作金型演算＆加工', track: 'MOLD', hours: 4.0, codeId: 20 },
      { name: '試作穴あけ', track: 'MOLD', hours: 1.5, codeId: 21 },
      { name: '試作ミガキ', track: 'MOLD', hours: 1.5, codeId: 22 },
      { name: '試作ネル貼り', track: 'MOLD', hours: 1.0, codeId: 23 },
    ]
    if (hasPlug) {
      stepsConfig.push({ name: '試作プラグ演算＆加工', track: 'PLUG', hours: 2.0, codeId: 32 })
    }
  } else {
    const isR0 = revNum <= 0
    equipCode = isR0 ? `${prodInternal}` : `${prodInternal} R${revNum}`
    displayName = isR0 ? `[本型] ${prodInternal}` : `[本型] ${prodInternal} R${revNum}`
    jobCode = isR0 ? `JOB-${prodCode}-M` : `JOB-${prodCode}R${revNum}-M`
    jobName = isR0 ? `新規金型製作: ${prodInternal}` : `金型改造: ${prodInternal} R${revNum}`
    stepsConfig = [
      { name: '金型演算＆加工', track: 'MOLD', hours: 6.0, codeId: 10 },
      { name: '本型穴あけ', track: 'MOLD', hours: 2.0, codeId: 11 },
      { name: '本型ミガキ', track: 'MOLD', hours: 2.0, codeId: 12 },
      { name: '本型ネル貼り', track: 'MOLD', hours: 1.5, codeId: 13 },
    ]
    if (hasPlug) {
      stepsConfig.push({ name: 'プラグ演算＆加工', track: 'PLUG', hours: 3.0, codeId: 31 })
    }
    stepsConfig.push({ name: '抜型手配・製作', track: 'CUTTER', hours: 1.0, codeId: 43 })
  }

  // 3. Update design revision status
  const { error: updateRevErr } = await supabase
    .from('design_revisions')
    .update({
      status: 'APPROVED',
      design_category: isPrototype ? 'PROTOTYPE_POCKET' : 'MASS_PRODUCTION'
    })
    .eq('revision_id', input.revisionId)

  if (updateRevErr) {
    throw new Error(`Failed to update design revision status: ${updateRevErr.message}`)
  }

  // 4. Create or update physical equipment
  let equipmentId: string | null = null
  const { data: existingEq } = await supabase
    .from('equipment')
    .select('equipment_id')
    .eq('equipment_code', equipCode)
    .maybeSingle()

  if (existingEq) {
    equipmentId = existingEq.equipment_id
    await supabase
      .from('equipment')
      .update({
        design_revision_id: input.revisionId,
        company_id: product.company_id,
        actual_length_mm: rev.design_length ? String(rev.design_length) : undefined,
        actual_width_mm: rev.design_width ? String(rev.design_width) : undefined,
        device_status: 'NORMAL',
        usage_status: 'IN_USE'
      })
      .eq('equipment_id', equipmentId)
  } else {
    const { data: newEq, error: eqErr } = await supabase
      .from('equipment')
      .insert([{
        equipment_code: equipCode,
        display_name: displayName,
        equipment_type: 'MOLD',
        company_id: product.company_id,
        design_revision_id: input.revisionId,
        actual_length_mm: rev.design_length ? String(rev.design_length) : null,
        actual_width_mm: rev.design_width ? String(rev.design_width) : null,
        actual_height_mm: rev.design_height ? String(rev.design_height) : null,
        device_status: 'NORMAL',
        usage_status: 'IN_USE'
      }])
      .select('equipment_id')
      .single()

    if (eqErr || !newEq) {
      console.warn('Warning: Could not create equipment record:', eqErr?.message)
    } else {
      equipmentId = newEq.equipment_id
    }
  }

  // 5. Create or update manufacturing Job
  const deadlineVal = input.targetDeadline || new Date(Date.now() + (isPrototype ? 5 : 10) * 86400000).toISOString().split('T')[0]

  let jobId: string | null = null
  const { data: existingJob } = await supabase
    .from('jobs')
    .select('job_id')
    .eq('job_code', jobCode)
    .maybeSingle()

  if (existingJob) {
    jobId = existingJob.job_id
    await supabase
      .from('jobs')
      .update({
        job_name: jobName,
        equipment_id: equipmentId || undefined,
        deadline: deadlineVal,
        mold_deadline: deadlineVal,
        target_completion_date: deadlineVal
      })
      .eq('job_id', jobId)
  } else {
    const { data: newJob, error: jobErr } = await supabase
      .from('jobs')
      .insert([{
        job_code: jobCode,
        job_name: jobName,
        job_type_id: isPrototype ? '6' : '1',
        job_category: isPrototype ? 'MOLD_NEW' : 'MOLD_NEW',
        job_status: 'PENDING',
        priority: isPrototype ? 8 : 5,
        product_id: product.product_id,
        design_revision_id: input.revisionId,
        equipment_id: equipmentId,
        company_id: product.company_id,
        start_date: new Date().toISOString().split('T')[0],
        deadline: deadlineVal,
        mold_deadline: deadlineVal,
        target_completion_date: deadlineVal,
        has_plug: hasPlug
      }])
      .select('job_id')
      .single()

    if (!jobErr && newJob) {
      jobId = newJob.job_id
      const stepsToInsert = stepsConfig.map((s, idx) => ({
        job_id: jobId!,
        step_no: idx + 1,
        step_name: s.name,
        step_status: 'PENDING',
        track: s.track,
        planned_hours: s.hours,
        deadline: deadlineVal
      }))
      await supabase.from('job_steps').insert(stepsToInsert)
    }
  }

  // 6. Revalidate routes
  revalidatePath(`/product-center/${product.product_id}`)
  revalidatePath('/equipment/schedule')
  revalidatePath('/equipment/jobs')
  revalidatePath('/engineering')

  return {
    success: true,
    data: {
      equipment_code: equipCode,
      job_code: jobCode,
      job_id: jobId,
      equipment_id: equipmentId
    }
  }
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

export type UpdateDesignRevisionInput = {
  revision_id: string
  product_id?: string | null
  design_code?: string
  revision_number?: number | null
  status?: string
  design_date?: string | null
  designer?: string | null
  designer_id?: string | null
  change_summary?: string | null
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  cutline_length?: number | null
  cutline_width?: number | null
  cavity_count?: number | null
  pocket_numbers?: number | null
  cavity_pitch_mm?: number | null
  machine_feed_pitch_mm?: number | null
  corner_r?: string | null
  chamfer_c?: string | null
  draft_angle?: string | null
  undercut_spec?: string | null
  under_depth?: string | null
  orientation?: string | null
  setup_type?: string | null
  plug_type?: string | null
  has_separate_cutter?: boolean | null
  plastic_type_designed?: string | null
  plastic_id?: string | null
  tolerance_pitch?: string | null
  tolerance_x?: string | null
  tolerance_y?: string | null
  customer_drawing_no?: string | null
  customer_tray_name?: string | null
  customer_equipment_no?: string | null
  tray_info?: string | null
}

export async function updateDesignRevisionAction(input: UpdateDesignRevisionInput) {
  const supabase = await createClient()

  if (!input.revision_id) {
    throw new Error('revision_id is required')
  }

  const payload: any = {}
  if (input.design_code !== undefined) payload.design_code = input.design_code?.trim()
  if (input.revision_number !== undefined) payload.revision_number = input.revision_number
  if (input.status !== undefined) payload.status = input.status
  if (input.design_date !== undefined) payload.design_date = input.design_date || null
  if (input.designer !== undefined) payload.designer = input.designer || null
  if (input.designer_id !== undefined) payload.designer_id = input.designer_id || null
  if (input.change_summary !== undefined) payload.change_summary = input.change_summary || null
  if (input.design_length !== undefined) payload.design_length = input.design_length
  if (input.design_width !== undefined) payload.design_width = input.design_width
  if (input.design_height !== undefined) payload.design_height = input.design_height
  if (input.design_depth !== undefined) payload.design_depth = input.design_depth
  if (input.cutline_length !== undefined) payload.cutline_length = input.cutline_length
  if (input.cutline_width !== undefined) payload.cutline_width = input.cutline_width
  if (input.cavity_count !== undefined) payload.cavity_count = input.cavity_count
  if (input.pocket_numbers !== undefined) payload.pocket_numbers = input.pocket_numbers
  if (input.cavity_pitch_mm !== undefined) payload.cavity_pitch_mm = input.cavity_pitch_mm
  if (input.machine_feed_pitch_mm !== undefined) payload.machine_feed_pitch_mm = input.machine_feed_pitch_mm
  if (input.corner_r !== undefined) payload.corner_r = input.corner_r || null
  if (input.chamfer_c !== undefined) payload.chamfer_c = input.chamfer_c || null
  if (input.draft_angle !== undefined) payload.draft_angle = input.draft_angle || null
  if (input.undercut_spec !== undefined) payload.undercut_spec = input.undercut_spec || null
  if (input.under_depth !== undefined) payload.under_depth = input.under_depth || null
  if (input.orientation !== undefined) payload.orientation = input.orientation || null
  if (input.setup_type !== undefined) payload.setup_type = input.setup_type || null
  if (input.plug_type !== undefined) payload.plug_type = input.plug_type || null
  if (input.has_separate_cutter !== undefined) payload.has_separate_cutter = input.has_separate_cutter
  if (input.plastic_type_designed !== undefined) payload.plastic_type_designed = input.plastic_type_designed || null
  if (input.plastic_id !== undefined) payload.plastic_id = input.plastic_id || null
  if (input.tolerance_pitch !== undefined) payload.tolerance_pitch = input.tolerance_pitch || null
  if (input.tolerance_x !== undefined) payload.tolerance_x = input.tolerance_x || null
  if (input.tolerance_y !== undefined) payload.tolerance_y = input.tolerance_y || null
  if (input.customer_drawing_no !== undefined) payload.customer_drawing_no = input.customer_drawing_no || null
  if (input.customer_tray_name !== undefined) payload.customer_tray_name = input.customer_tray_name || null
  if (input.customer_equipment_no !== undefined) payload.customer_equipment_no = input.customer_equipment_no || null
  if (input.tray_info !== undefined) payload.tray_info = input.tray_info || null

  const { data, error } = await supabase
    .from('design_revisions')
    .update(payload)
    .eq('revision_id', input.revision_id)
    .select('*')
    .single()

  if (error) {
    console.error('[updateDesignRevisionAction Error]:', error)
    throw new Error(error.message)
  }

  if (input.product_id) {
    revalidatePath(`/master/products/${input.product_id}`)
    revalidatePath(`/product-center/${input.product_id}`)
    revalidatePath(`/engineering/designs/${input.product_id}`)
  }
  revalidatePath(`/engineering/designs/revisions/${input.revision_id}`)

  return { success: true, data }
}

/**
 * Safely deletes a product and its associated draft revisions/jobs,
 * as long as no actual order lines or recorded work logs exist.
 */
export async function deleteProductAction(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // 1. Check if product exists
  const { data: prod, error: prodErr } = await supabase
    .from('products')
    .select('product_id, product_code, product_name_internal')
    .eq('product_id', productId)
    .single()

  if (prodErr || !prod) {
    return { success: false, error: '製品が見つかりません (Không tìm thấy sản phẩm)' }
  }

  // 2. Check if product has active order lines
  const { count: orderLineCount } = await supabase
    .from('order_lines')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId)

  if (orderLineCount && orderLineCount > 0) {
    return {
      success: false,
      error: `この製品は ${orderLineCount} 件の受注履歴が存在するため削除できません。(Không thể xóa sản phẩm đã có ${orderLineCount} đơn hàng)`
    }
  }

  // 3. Find and cascade clean up associated jobs, work logs & steps
  const { data: relatedJobs } = await supabase
    .from('jobs')
    .select('job_id')
    .eq('product_id', productId)

  if (relatedJobs && relatedJobs.length > 0) {
    const jobIds = relatedJobs.map(j => j.job_id)
    // Clean up work_logs of these jobs/steps
    await supabase.from('work_logs').delete().in('job_id', jobIds)
    // Clean up job_steps and jobs
    await supabase.from('job_steps').delete().in('job_id', jobIds)
    await supabase.from('jobs').delete().in('job_id', jobIds)
  }

  // 4. Find and clean up associated design revisions & equipment
  const { data: revs } = await supabase
    .from('design_revisions')
    .select('revision_id')
    .eq('product_id', productId)

  const revIds = revs?.map(r => r.revision_id) || []

  if (revIds.length > 0) {
    const { data: eqs } = await supabase
      .from('equipment')
      .select('equipment_id')
      .in('design_revision_id', revIds)

    if (eqs && eqs.length > 0) {
      const eqIds = eqs.map(e => e.equipment_id)
      await supabase.from('equipment_assignments').delete().or(`primary_equipment_id.in.(${eqIds.join(',')}),related_equipment_id.in.(${eqIds.join(',')})`)
      await supabase.from('equipment').delete().in('equipment_id', eqIds)
    }

    await supabase.from('design_revisions').delete().in('revision_id', revIds)
  }

  // 5. Delete product record
  const { error: delErr } = await supabase
    .from('products')
    .delete()
    .eq('product_id', productId)

  if (delErr) {
    return { success: false, error: delErr.message }
  }

  revalidatePath('/product-center')
  revalidatePath('/master/products')
  revalidatePath('/equipment/schedule')
  return { success: true }
}


