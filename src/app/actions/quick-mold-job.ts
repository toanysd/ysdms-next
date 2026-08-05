'use server'

import { createClient } from '@/lib/supabase/server'

// ── Unified Type: Job Component (= job_steps row) ──
// job_steps = Components/Thành phần của Job (KHÔNG phải công đoạn tuần tự)
// Với Job khuôn: MOLD, PLUG, CUTTER, WATER_BASE... (thiết bị phụ kiện)
// Các components thực hiện SONG SONG, chỉ cần đúng kỳ hạn.
export type QuickMoldJobStepInput = {
  step_id?: string
  step_no: number
  step_name: string
  // Component-specific fields (from former MoldComponentInput)
  type_code?: string | null           // MOLD, PLUG, CUTTER, WATER_BASE, FRAME...
  track?: string | null               // Component track (synced with type_code)
  material_spec?: string | null       // A5052, SKD11, ベニヤ木板...
  quantity?: number | null            // default 1
  arrangement?: 'REQUIRED' | 'NOT_REQUIRED' | string | null  // 手配
  condition?: 'NEW' | 'EXISTING' | string | null              // 新規/既存
  manufacture_location?: 'IN_HOUSE' | 'OUTSOURCED' | string | null // 内製/外注
  // Step/processing fields
  processing_code_id?: number | null
  estimated_hours?: number | null
  assigned_to?: string | null
  deadline?: string | null
  notes?: string | null
}

// @deprecated — Use QuickMoldJobStepInput instead. Kept for backward compat.
export type MoldComponentInput = QuickMoldJobStepInput

export type QuickMoldJobInput = {
  // 1. Company & Product
  company_id?: string | null
  product_code: string
  product_name: string
  customer_product_name?: string | null
  primary_plastic_code?: string | null

  // 2. Design Revision Specs
  design_code: string
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  cavity_count?: number | null
  plastic_type_designed?: string | null
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

  // 3. Physical Mold
  system_code: string
  display_name: string
  physical_stamp?: string | null
  current_rack_layer_id?: string | null

  // 4. Job Directive
  job_code: string
  job_name: string
  job_type_id?: string | null
  job_category?: string | null
  responsible_id?: string | null
  start_date?: string | null
  deadline?: string | null
  ship_date?: string | null
  price_quote_required?: boolean | null
  unit_price?: number | null
  notes?: string | null

  // 5. Job Components (= job_steps: unified components + process info)
  steps: QuickMoldJobStepInput[]
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
          primary_plastic_code: input.primary_plastic_code?.trim() || null,
          company_id: companyId,
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
    const { data: newRev, error: revErr } = await supabase
      .from('design_revisions')
      .insert({
        product_id: productId,
        design_code: input.design_code.trim(),
        revision_number: 1,
        status: 'APPROVED',
        company_id: companyId,
        design_length: input.design_length || null,
        design_width: input.design_width || null,
        design_height: input.design_height || null,
        design_depth: input.design_depth || null,
        cavity_count: input.cavity_count || null,
        plastic_type_designed: input.plastic_type_designed?.trim() || input.primary_plastic_code?.trim() || null,
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
        version_note: input.pocket_prototype ? `ポケット試作: ${input.pocket_prototype}` : null,
      })
      .select('revision_id')
      .single()

    if (revErr || !newRev) {
      return { success: false, error: `Lỗi tạo bản vẽ thiết kế: ${revErr?.message}` }
    }
    const designRevisionId = newRev.revision_id

    // Component Kit Summary (derived from unified steps[])
    const componentSteps = input.steps.filter(s => s.type_code)
    let compSummary = ''
    if (componentSteps.length > 0) {
      compSummary = '【構成部品・補助設備 Kit】: ' + componentSteps.map(c => `${c.step_name} (x${c.quantity || 1})`).join(', ')
    }

    // Step 4: Physical Mold
    const { data: newMold, error: moldErr } = await supabase
      .from('physical_molds')
      .insert({
        system_code: input.system_code.trim(),
        display_name: input.display_name.trim() || input.system_code.trim(),
        physical_stamp: input.physical_stamp?.trim() || null,
        current_rack_layer_id: input.current_rack_layer_id || null,
        device_status: '製作中',
        usage_status: '保管中',
        notes: compSummary || null,
      })
      .select('physical_mold_id')
      .single()

    if (moldErr || !newMold) {
      return { success: false, error: `Lỗi tạo khuôn vật lý: ${moldErr?.message}` }
    }
    const physicalMoldId = newMold.physical_mold_id

    // Step 5: Job
    const totalEstHours = input.steps.reduce((sum, s) => sum + (s.estimated_hours || 0), 0)
    const combinedNotes = [input.notes?.trim(), compSummary].filter(Boolean).join('\n')

    const { data: newJob, error: jobErr } = await supabase
      .from('jobs')
      .insert({
        job_code: input.job_code.trim(),
        job_name: input.job_name.trim(),
        job_type_id: input.job_type_id || '1',
        job_category: input.job_category || 'MOLD_NEW',
        product_id: productId,
        design_revision_id: designRevisionId,
        physical_mold_id: physicalMoldId,
        company_id: companyId,
        responsible_id: input.responsible_id || null,
        start_date: input.start_date || null,
        deadline: input.deadline || null,
        mold_deadline: input.deadline || null,
        ship_date: input.ship_date || null,
        separate_cutter: input.has_separate_cutter || false,
        price_quote_required: input.price_quote_required || false,
        unit_price: input.unit_price || null,
        notes: combinedNotes || null,
        estimated_hours: totalEstHours || null,
        job_status: 'PLANNED',
        overall_progress: 0,
      })
      .select('job_id')
      .single()

    if (jobErr || !newJob) {
      return { success: false, error: `Lỗi tạo Job gia công: ${jobErr?.message}` }
    }
    const jobId = newJob.job_id

    // Step 6: Batch Insert Job Components (= job_steps with component fields)
    if (input.steps && input.steps.length > 0) {
      const stepsPayload = input.steps.map((s, idx) => ({
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
      physical_mold_id: physicalMoldId,
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
        physical_molds(*),
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
export async function updateQuickMoldJobWorkflow(jobId: string, input: QuickMoldJobInput) {
  const supabase = await createClient()

  try {
    // 1. Fetch current job references
    const { data: currentJob } = await supabase
      .from('jobs')
      .select('job_id, product_id, design_revision_id, physical_mold_id')
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
        primary_plastic_code: input.primary_plastic_code?.trim() || null,
        company_id: companyId || undefined,
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
        plastic_type_designed: input.plastic_type_designed?.trim() || input.primary_plastic_code?.trim() || null,
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
        version_note: input.pocket_prototype ? `ポケット試作: ${input.pocket_prototype}` : null,
      }).eq('revision_id', currentJob.design_revision_id)
    }

    // Component summary (derived from unified steps[])
    const componentSteps = input.steps.filter(s => s.type_code)
    let compSummary = ''
    if (componentSteps.length > 0) {
      compSummary = '【構成部品・補助設備 Kit】: ' + componentSteps.map(c => `${c.step_name} (x${c.quantity || 1})`).join(', ')
    }

    // 4. Update Physical Mold if exists
    if (currentJob.physical_mold_id) {
      await supabase.from('physical_molds').update({
        system_code: input.system_code.trim(),
        display_name: input.display_name.trim() || input.system_code.trim(),
        physical_stamp: input.physical_stamp?.trim() || null,
        notes: compSummary || null,
      }).eq('physical_mold_id', currentJob.physical_mold_id)
    }

    // 5. Update Job
    const totalEstHours = input.steps.reduce((sum, s) => sum + (s.estimated_hours || 0), 0)
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
      const stepsPayload = input.steps.map((s, idx) => ({
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
      physical_mold_id: currentJob.physical_mold_id,
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi cập nhật hệ thống' }
  }
}
