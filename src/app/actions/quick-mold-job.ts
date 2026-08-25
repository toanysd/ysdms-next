'use server'

import { createClient } from '@/lib/supabase/server'
import { isPrototypeDesignOrMold } from '@/lib/utils/moldNaming'

// ── Unified Type: Job Component (= job_steps row) ──
// job_steps = Components/Thành phần của Job (KHÔNG phải công đoạn tuần tự)
// Với Job khuôn: MOLD, PLUG, CUTTER, WATER_BASE... (thiết bị phụ kiện)
// Các components thực hiện SONG SONG, chỉ cần đúng kỳ hạn.
export type ProcessStepInput = {
  step_no: number
  step_name: string
  estimated_hours?: number | null
  assigned_to?: string | null
  deadline?: string | null
  notes?: string | null
}

export type WizardJobInput = {
  temp_id: string                    // client-side temp ID
  equipment_type: string             // MOLD, PLUG, CUTTER_SEPARATE, WATER_BASE, PRESSURE_BASE, FRAME
  equipment_code: string             // e.g. 'M-SMK218R3'
  equipment_name: string             // display name
  is_existing: boolean               // true = link to existing equipment
  existing_equipment_id?: string | null  // UUID of existing equipment (if is_existing)
  manufacture_location?: string | null   // IN_HOUSE, OUTSOURCED
  deadline?: string | null
  steps: ProcessStepInput[]          // processing steps for this job
}

/** @deprecated — Use ProcessStepInput instead. Kept for backward compat. */
export type QuickMoldJobStepInput = {
  step_id?: string
  step_no: number
  step_name: string
  type_code?: string | null
  track?: string | null
  material_spec?: string | null
  quantity?: number | null
  arrangement?: 'REQUIRED' | 'NOT_REQUIRED' | string | null
  condition?: 'NEW' | 'EXISTING' | string | null
  manufacture_location?: 'IN_HOUSE' | 'OUTSOURCED' | string | null
  processing_code_id?: number | null
  estimated_hours?: number | null
  assigned_to?: string | null
  deadline?: string | null
  notes?: string | null
}

/** @deprecated — Use ProcessStepInput instead. Kept for backward compat. */
export type MoldComponentInput = QuickMoldJobStepInput

export type QuickMoldJobInput = {
  // 1. Company & Product
  company_id?: string | null
  product_code: string
  product_name: string
  customer_product_name?: string | null

  // 2. Design Revision Specs
  design_code: string
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  cavity_count?: number | null
  plastic_type_designed?: string | null
  plastic_id?: string | null
  cutline_length?: number | null
  cutline_width?: number | null
  corner_r?: string | null
  chamfer_c?: string | null
  orientation?: string | null
  setup_type?: string | null
  under_depth?: number | null
  undercut_spec?: string | null
  draft_angle?: number | null
  text_content?: string | null
  plug_type?: string | null
  has_separate_cutter?: boolean | null
  pocket_prototype?: string | null

  // 3. Work Order
  wo_name?: string | null
  wo_type?: string | null   // NEW_SET, REPAIR, REMAKE
  responsible_id?: string | null
  start_date?: string | null
  deadline?: string | null
  ship_date?: string | null
  first_shipment_date?: string | null
  notes?: string | null

  // 4. Jobs (Option C: each job = 1 equipment)
  jobs?: WizardJobInput[]

  // --- DEPRECATED FIELDS BELOW (Kept for backward compatibility) ---
  /** @deprecated */ system_code?: string
  /** @deprecated */ display_name?: string
  /** @deprecated */ physical_stamp?: string | null
  /** @deprecated */ current_rack_layer_id?: string | null
  /** @deprecated */ job_code?: string
  /** @deprecated */ job_name?: string
  /** @deprecated */ job_type_id?: string | null
  /** @deprecated */ job_category?: string | null
  /** @deprecated */ price_quote_required?: boolean | null
  /** @deprecated */ unit_price?: number | null
  /** @deprecated */ steps?: QuickMoldJobStepInput[]
}

// ── 1. Create New Quick Mold Job Workflow ──────────────────────────────────────
export async function createQuickMoldJobWorkflow(input: QuickMoldJobInput) {
  const supabase = await createClient()

  try {
    let companyId = input.company_id?.trim() || null
    if (!companyId) {
      const { data: firstCompany } = await supabase
        .from('companies')
        .select('company_id')
        .limit(1)
        .maybeSingle()
      companyId = firstCompany?.company_id || '3c52ba34-0383-4b32-940c-99385e68f20d'
    }

    // Step 1: Product
    let productId: string | null = null

    const { data: existingProduct } = await supabase
      .from('products')
      .select('product_id')
      .eq('product_code', input.product_code.trim())
      .maybeSingle()

    if (existingProduct) {
      productId = existingProduct.product_id
    } else {
      const { data: newProd, error: prodErr } = await supabase
        .from('products')
        .insert({
          product_code: input.product_code.trim(),
          product_name_internal: input.product_code.trim(),
          product_name: input.product_name.trim() || input.product_code.trim(),
          customer_product_name: input.customer_product_name?.trim() || null,
          company_id: companyId,
          first_shipment_date: input.ship_date || input.first_shipment_date || null,
          product_status: 'ACTIVE',
        })
        .select('product_id')
        .single()

      if (prodErr || !newProd) {
        return { success: false, error: `Lỗi tạo sản phẩm: ${prodErr?.message}` }
      }
      productId = newProd.product_id
    }

    // Step 2: Design Revision
    const isProtoRev = isPrototypeDesignOrMold({ design_code: input.design_code })
    const { data: newRev, error: revErr } = await supabase
      .from('design_revisions')
      .insert({
        product_id: productId,
        design_code: input.design_code.trim(),
        revision_number: 1,
        status: 'APPROVED',
        design_category: isProtoRev ? 'PROTOTYPE_POCKET' : 'MASS_PRODUCTION',
        company_id: companyId,
        design_length: input.design_length || null,
        design_width: input.design_width || null,
        design_height: input.design_height || null,
        design_depth: input.design_depth || null,
        cavity_count: input.cavity_count || null,
        plastic_type_designed: input.plastic_type_designed?.trim() || null,
        plastic_id: input.plastic_id || null,
        cutline_length: input.cutline_length || null,
        cutline_width: input.cutline_width || null,
        corner_r: input.corner_r?.trim() || null,
        chamfer_c: input.chamfer_c?.trim() || null,
        orientation: input.orientation?.trim() || null,
        setup_type: input.setup_type?.trim() || null,
        under_depth: input.under_depth ? String(input.under_depth) : null,
        undercut_spec: input.undercut_spec?.trim() || null,
        draft_angle: input.draft_angle ? String(input.draft_angle) : null,
        text_content: input.text_content?.trim() || null,
        plug_type: input.plug_type?.trim() || null,
        has_separate_cutter: input.has_separate_cutter || false,
        change_summary: input.pocket_prototype ? `ポケット試作: ${input.pocket_prototype}` : null,
      })
      .select('revision_id')
      .single()

    if (revErr || !newRev) {
      return { success: false, error: `Lỗi tạo bản vẽ thiết kế: ${revErr?.message}` }
    }
    const designRevisionId = newRev.revision_id

    // Step 3: Work Order (Option C Model)
    let workOrderId: string | null = null
    try {
      const year = new Date().getFullYear()
      const randSeq = Math.floor(100000 + Math.random() * 900000)
      const woCode = `WO-${year}-${randSeq}`

      const { data: woData } = await supabase
        .from('work_orders')
        .insert({
          wo_code: woCode,
          wo_name: input.wo_name || `Chế tạo bộ khuôn ${input.product_code.trim()}`,
          product_id: productId,
          design_revision_id: designRevisionId,
          company_id: companyId,
          wo_type: input.wo_type || 'NEW_SET',
          wo_status: 'PLANNED',
          deadline: input.deadline || null,
          start_date: input.start_date || null,
          responsible_id: input.responsible_id || null,
          notes: input.notes || null,
        })
        .select('wo_id')
        .single()

      if (woData) {
        workOrderId = woData.wo_id
      }
    } catch (woErr) {
      console.warn('Non-blocking error creating Work Order:', woErr)
    }

    // Step 4: Process Jobs (1 Job = 1 Equipment)
    const createdJobIds: string[] = []
    const createdEquipmentIds: string[] = []

    for (const jobInput of input.jobs || []) {
      let equipmentId = jobInput.existing_equipment_id || null

      // a. If is_existing=false: Create new Equipment row
      if (!jobInput.is_existing) {
        const { data: newEquip, error: equipErr } = await supabase
          .from('equipment')
          .insert({
            equipment_code: jobInput.equipment_code.trim(),
            display_name: jobInput.equipment_name.trim() || jobInput.equipment_code.trim(),
            equipment_type: jobInput.equipment_type,
            company_id: companyId,
            design_revision_id: designRevisionId,
            device_status: 'NORMAL',
            usage_status: 'STORAGE',
          })
          .select('equipment_id')
          .maybeSingle()
        
        if (equipErr) {
          console.warn(`Error creating equipment ${jobInput.equipment_code}:`, equipErr)
        } else if (newEquip) {
          equipmentId = newEquip.equipment_id
        }
      }

      if (equipmentId) {
        createdEquipmentIds.push(equipmentId)
      }

      // c. Create Job row
      const year = new Date().getFullYear()
      const randSeq = Math.floor(100000 + Math.random() * 900000)
      const jobCodeStr = `JOB-${year}-${randSeq}`

      const totalEstHours = (jobInput.steps || []).reduce((sum: number, s: ProcessStepInput) => sum + (s.estimated_hours || 0), 0)

      const { data: newJob, error: jobErr } = await supabase
        .from('jobs')
        .insert({
          job_code: jobCodeStr,
          job_name: `Gia công ${jobInput.equipment_name}`,
          job_type_id: '1', // required default
          job_category: 'MOLD_NEW',
          work_order_id: workOrderId,
          equipment_id: equipmentId,
          product_id: productId,
          design_revision_id: designRevisionId,
          company_id: companyId,
          responsible_id: input.responsible_id || null, // inherit from work order if needed
          deadline: jobInput.deadline || input.deadline || null,
          estimated_hours: totalEstHours || null,
          job_status: 'PLANNED',
          overall_progress: 0,
        })
        .select('job_id')
        .single()

      if (jobErr || !newJob) {
        return { success: false, error: `Lỗi tạo Job gia công cho ${jobInput.equipment_name}: ${jobErr?.message}` }
      }
      const jobId = newJob.job_id
      createdJobIds.push(jobId)

      // d. Insert job_steps[] for this job
      if (jobInput.steps && jobInput.steps.length > 0) {
        const stepsPayload = jobInput.steps.map((s, idx) => ({
          job_id: jobId,
          step_no: s.step_no || idx + 1,
          step_name: s.step_name.trim(),
          estimated_hours: s.estimated_hours || null,
          assigned_to: s.assigned_to || null,
          deadline: s.deadline || jobInput.deadline || null,
          notes: s.notes || null,
          step_status: 'PLANNED',
          manufacture_location: jobInput.manufacture_location || null,
        }))

        await supabase.from('job_steps').insert(stepsPayload)
      }
    }

    return {
      success: true,
      work_order_id: workOrderId,
      job_ids: createdJobIds,
      job_id: createdJobIds[0] || undefined,
      equipment_ids: createdEquipmentIds,
      product_id: productId,
      design_revision_id: designRevisionId,
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi hệ thống không xác định' }
  }
}

export async function getQuickMoldJobData(jobId: string) {
  const supabase = await createClient()

  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        companies:companies!jobs_company_id_fkey(*),
        products(*, companies:companies!products_company_id_fkey(*)),
        design_revisions(*),
        equipment(*),
        job_steps(*)
      `)
      .eq('job_id', jobId)
      .single()

    if (error || !job) {
      return { success: false, error: error?.message || 'Không tìm thấy Job gia công' }
    }

    // Fallback: If embedded join for job_steps returned null, query separately
    if (!job.job_steps || (Array.isArray(job.job_steps) && job.job_steps.length === 0)) {
      const { data: stepsData } = await supabase
        .from('job_steps')
        .select('*')
        .eq('job_id', jobId)
        .order('step_no')
      if (stepsData && stepsData.length > 0) {
        job.job_steps = stepsData
      }
    }

    // Fallback company lookup via design_revisions if job & product company_id are null
    let resolvedCompany = job.companies || job.products?.companies || null
    if (!resolvedCompany && job.design_revisions?.company_id) {
      const { data: comp } = await supabase
        .from('companies')
        .select('*')
        .eq('company_id', job.design_revisions.company_id)
        .maybeSingle()
      if (comp) resolvedCompany = comp
    }

    return {
      success: true,
      job: {
        ...job,
        resolved_company: resolvedCompany
      } as any,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ── 3. Update Existing Quick Mold Job Workflow ─────────────────────────────────
export async function updateQuickMoldJobWorkflow(jobId: string, input: any) {
  const supabase = await createClient()

  try {
    // 1. Fetch current job references
    const { data: currentJob } = await supabase
      .from('jobs')
      .select('job_id, product_id, design_revision_id, equipment_id')
      .eq('job_id', jobId)
      .single()

    if (!currentJob) {
      return { success: false, error: 'Job không tồn tại' }
    }

    const companyId = input.company_id?.trim() || null

    // 2. Update Product if exists
    if (currentJob.product_id) {
      await supabase.from('products').update({
        product_code: input.product_code.trim(),
        product_name: input.product_name.trim() || input.product_code.trim(),
        customer_product_name: input.customer_product_name?.trim() || null,
        company_id: companyId || undefined,
        first_shipment_date: input.ship_date || input.first_shipment_date || undefined,
        updated_at: new Date().toISOString()
      }).eq('product_id', currentJob.product_id)
    }

    // 3. Update Design Revision if exists
    if (currentJob.design_revision_id) {
      await supabase.from('design_revisions').update({
        design_code: input.design_code.trim(),
        design_length: input.design_length || null,
        design_width: input.design_width || null,
        design_height: input.design_height || null,
        design_depth: input.design_depth || null,
        cavity_count: input.cavity_count || null,
        plastic_type_designed: input.plastic_type_designed?.trim() || null,
        plastic_id: input.plastic_id || null,
        cutline_length: input.cutline_length || null,
        cutline_width: input.cutline_width || null,
        corner_r: input.corner_r?.trim() || null,
        chamfer_c: input.chamfer_c?.trim() || null,
        orientation: input.orientation?.trim() || null,
        setup_type: input.setup_type?.trim() || null,
        under_depth: input.under_depth ? String(input.under_depth) : null,
        undercut_spec: input.undercut_spec?.trim() || null,
        draft_angle: input.draft_angle ? String(input.draft_angle) : null,
        text_content: input.text_content?.trim() || null,
        plug_type: input.plug_type?.trim() || null,
        has_separate_cutter: input.has_separate_cutter || false,
        change_summary: input.pocket_prototype ? `ポケット試作: ${input.pocket_prototype}` : null,
      }).eq('revision_id', currentJob.design_revision_id)
    }

    // Component summary (derived from unified steps[])
    const componentSteps = (input.steps || []).filter((s: any) => s.type_code)
    let compSummary = ''
    if (componentSteps.length > 0) {
      compSummary = '【構成部品・補助設備 Kit】: ' + componentSteps.map((c: any) => `${c.step_name} (x${c.quantity || 1})`).join(', ')
    }

    // 4. Update Equipment (Mold) if exists
    if (currentJob.equipment_id) {
      await supabase.from('equipment').update({
        equipment_code: input.system_code?.trim() || input.display_name?.trim(),
        display_name: input.display_name?.trim() || input.system_code?.trim(),
        physical_stamp: input.physical_stamp?.trim() || null,
        notes: compSummary || null,
      }).eq('equipment_id', currentJob.equipment_id)
    }

    // 5. Update Job
    const totalEstHours = (input.steps || []).reduce((sum: number, s: any) => sum + (s.estimated_hours || 0), 0)
    const combinedNotes = [input.notes?.trim(), compSummary].filter(Boolean).join('\n')

    await supabase.from('jobs').update({
      job_code: input.job_code.trim(),
      job_name: input.job_name.trim(),
      job_type_id: input.job_type_id || '1',
      job_category: input.job_category || 'MOLD_NEW',
      responsible_id: input.responsible_id || null,
      company_id: companyId || undefined,
      start_date: input.start_date || null,
      deadline: input.deadline || null,
      mold_deadline: input.deadline || null,
      ship_date: input.ship_date || null,
      separate_cutter: input.has_separate_cutter || false,
      price_quote_required: input.price_quote_required || false,
      unit_price: input.unit_price || null,
      notes: combinedNotes || null,
      estimated_hours: totalEstHours || null,
    }).eq('job_id', jobId)

    // 6. Refresh Job Components (Delete & Re-insert with component fields)
    await supabase.from('job_steps').delete().eq('job_id', jobId)

    if (input.steps && input.steps.length > 0) {
      const stepsPayload = input.steps.map((s: any, idx: number) => ({
        job_id: jobId,
        step_no: s.step_no || idx + 1,
        step_name: s.step_name.trim(),
        type_code: s.type_code || null,
        track: s.type_code || null,
        material_spec: s.material_spec || null,
        quantity: s.quantity || 1,
        arrangement: s.arrangement || null,
        condition: s.condition || null,
        manufacture_location: s.manufacture_location || null,
        estimated_hours: s.estimated_hours || null,
        assigned_to: s.assigned_to || null,
        deadline: s.deadline || null,
        notes: s.notes || null,
        step_status: 'PLANNED',
      }))
      await supabase.from('job_steps').insert(stepsPayload)
    }

    return {
      success: true,
      job_id: jobId,
      equipment_id: currentJob.equipment_id,
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi cập nhật hệ thống' }
  }
}
