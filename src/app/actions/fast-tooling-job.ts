'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface FastToolingJobInput {
  product_code: string
  product_name_internal?: string | null
  company_id: string

  reuse_revision: boolean
  selected_revision_id?: string | null
  cutline_length?: number | null
  cutline_width?: number | null
  corner_r?: string | null
  chamfer_c?: string | null
  cavity_count?: number | null
  plastic_type_designed?: string | null

  rack_layer_id: string
  attach_cutter?: boolean
  cutter_code?: string | null

  job_name: string
  mold_deadline: string
  ship_date?: string | null
  assigned_to?: string | null
}

export interface FastToolingJobResult {
  success: true
  job_id: string
  job_code: string
  product_id: string
  revision_id: string
  mold_id: string
  cutter_id?: string | null
  step_id: string
}

export interface FastToolingJobError {
  success: false
  error: string
  errorKey?: string
}

export async function createFastToolingJobAction(
  input: FastToolingJobInput
): Promise<FastToolingJobResult | FastToolingJobError> {
  const supabase = await createClient()

  // 1. Input Validation
  const productCode = (input.product_code || '').trim().toUpperCase()
  if (!productCode || !/^[A-Z0-9\-_]+$/.test(productCode)) {
    return { success: false, error: '製品コードを入力してください (英数字)', errorKey: 'errProductCodeRequired' }
  }
  if (!input.company_id) {
    return { success: false, error: '得意先を選択してください', errorKey: 'errCompanyRequired' }
  }
  if (!input.reuse_revision) {
    if (!input.cutline_length || input.cutline_length <= 0) {
      return { success: false, error: '抜寸法（長）を正しく入力してください', errorKey: 'errCutlineLengthRequired' }
    }
    if (!input.cutline_width || input.cutline_width <= 0) {
      return { success: false, error: '抜寸法（幅）を正しく入力してください', errorKey: 'errCutlineWidthRequired' }
    }
  }
  if (!input.rack_layer_id) {
    return { success: false, error: '保管棚・段を選択してください', errorKey: 'errRackLayerRequired' }
  }
  const jobName = (input.job_name || '').trim()
  if (!jobName) {
    return { success: false, error: 'ジョブ名（作業件名）を入力してください', errorKey: 'errJobNameRequired' }
  }
  if (!input.mold_deadline) {
    return { success: false, error: '金型納期を指定してください', errorKey: 'errMoldDeadlineRequired' }
  }

  const payload = {
    product_code: productCode,
    product_name_internal: input.product_name_internal?.trim() || null,
    company_id: input.company_id,
    reuse_revision: !!input.reuse_revision,
    selected_revision_id: input.selected_revision_id || null,
    cutline_length: input.cutline_length || null,
    cutline_width: input.cutline_width || null,
    corner_r: input.corner_r?.trim() || null,
    chamfer_c: input.chamfer_c?.trim() || null,
    cavity_count: input.cavity_count || null,
    plastic_type_designed: input.plastic_type_designed?.trim() || null,
    rack_layer_id: input.rack_layer_id,
    attach_cutter: !!input.attach_cutter,
    cutter_code: input.cutter_code?.trim() || null,
    job_name: jobName,
    mold_deadline: input.mold_deadline,
    ship_date: input.ship_date || null,
    assigned_to: input.assigned_to || null,
  }

  // 2. Primary Path: Try Atomic Database RPC
  const { data: rpcData, error: rpcError } = await (supabase.rpc as Function)('create_fast_tooling_job', {
    p_payload: payload,
  })
  const typedRpc = rpcData as {
    success?: boolean
    job_id?: string
    job_code?: string
    product_id?: string
    revision_id?: string
    mold_id?: string
    cutter_id?: string | null
    step_id?: string
  } | null

  if (!rpcError && typedRpc?.success && typedRpc.job_id && typedRpc.job_code && typedRpc.product_id && typedRpc.revision_id && typedRpc.mold_id && typedRpc.step_id) {
    revalidatePath('/equipment/jobs')
    revalidatePath('/equipment/molds')
    revalidatePath('/equipment/unified')
    return {
      success: true,
      job_id: typedRpc.job_id,
      job_code: typedRpc.job_code,
      product_id: typedRpc.product_id,
      revision_id: typedRpc.revision_id,
      mold_id: typedRpc.mold_id,
      cutter_id: typedRpc.cutter_id,
      step_id: typedRpc.step_id,
    }
  }

  // If RPC failed due to unexpected error other than "function does not exist"
  if (rpcError && (rpcError as { code?: string }).code !== 'PGRST202') {
    console.error('[Action Error] create_fast_tooling_job RPC error:', rpcError)
    return { success: false, error: (rpcError as Error).message }
  }

  // 3. Fallback Path (When RPC proposal is still pending migration approval)
  // Executes sequential fail-closed steps with strict telemetry
  console.warn('[Action Fallback] RPC create_fast_tooling_job not present on DB. Using transactional client action.')
  const startTime = Date.now()
  const codeCompact = productCode.replace(/-/g, '')

  try {
    // Step 1: Resolve / Create Product
    let productId: string
    const { data: existingProd, error: prodFindErr } = await supabase
      .from('products')
      .select('product_id')
      .eq('product_code', productCode)
      .maybeSingle()

    if (prodFindErr) throw new Error(prodFindErr.message)

    if (existingProd) {
      productId = existingProd.product_id
    } else {
      const { data: newProd, error: prodInsErr } = await supabase
        .from('products')
        .insert({
          product_code: productCode,
          product_name_internal: input.product_name_internal?.trim() || productCode,
          company_id: input.company_id,
          product_lifecycle_status: 'ACTIVE',
        })
        .select('product_id')
        .single()
      if (prodInsErr || !newProd) throw new Error(prodInsErr?.message || 'Failed to create product')
      productId = newProd.product_id
    }

    // Step 2: Resolve / Create Design Revision
    let revisionId: string = ''
    if (input.reuse_revision && input.selected_revision_id) {
      revisionId = input.selected_revision_id
    } else {
      // Find latest revision number
      const { data: revList } = await supabase
        .from('design_revisions')
        .select('design_code')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      let maxNum = 0
      if (revList) {
        for (const r of revList) {
          const m = (r.design_code || '').match(/-R(\d+)$/i)
          if (m) {
            const num = parseInt(m[1], 10)
            if (num > maxNum) maxNum = num
          }
        }
      }

      let revInserted = false
      let candidateRevCode = `${productCode}-R${maxNum + 1}`
      for (let attempt = 1; attempt <= 5; attempt++) {
        const { data: newRev, error: revErr } = await supabase
          .from('design_revisions')
          .insert({
            product_id: productId,
            company_id: input.company_id,
            design_code: candidateRevCode,
            revision_number: maxNum + attempt,
            cutline_length: input.cutline_length || null,
            cutline_width: input.cutline_width || null,
            corner_r: input.corner_r?.trim() || null,
            chamfer_c: input.chamfer_c?.trim() || null,
            cavity_count: input.cavity_count || null,
            plastic_type_designed: input.plastic_type_designed?.trim() || null,
            status: 'ACTIVE',
          })
          .select('revision_id')
          .single()

        if (!revErr && newRev) {
          revisionId = newRev.revision_id
          revInserted = true
          break
        }

        console.warn('[TELEMETRY_RETRY_DESIGN]', {
          product_id: productId,
          candidate_code: candidateRevCode,
          attempt,
          postgres_code: revErr?.code,
          duration_ms: Date.now() - startTime,
        })

        if (revErr?.code === '23505') {
          candidateRevCode = `${productCode}-R${maxNum + attempt + 1}`
        } else {
          throw new Error(revErr?.message || 'Design revision creation error')
        }
      }

      if (!revInserted) {
        return { success: false, error: 'リビジョン番号の自動採番に失敗しました (Max attempts reached)', errorKey: 'errSequenceExhausted' }
      }
    }

    // Step 3: Equipment (MOLD)
    let moldId: string
    const { data: existingMold } = await supabase
      .from('equipment')
      .select('equipment_id, design_revision_id')
      .eq('equipment_code', productCode)
      .maybeSingle()

    if (existingMold) {
      moldId = existingMold.equipment_id
      if (input.rack_layer_id) {
        await supabase
          .from('equipment')
          .update({
            current_rack_layer_id: input.rack_layer_id,
            design_revision_id: revisionId,
          })
          .eq('equipment_id', moldId)
      }
    } else {
      const { data: newMold, error: moldErr } = await supabase
        .from('equipment')
        .insert({
          equipment_code: productCode,
          display_name: productCode,
          equipment_type: 'MOLD',
          design_revision_id: revisionId,
          company_id: input.company_id,
          current_rack_layer_id: input.rack_layer_id,
          device_status: 'NORMAL',
          usage_status: 'ACTIVE',
        })
        .select('equipment_id')
        .single()
      if (moldErr || !newMold) throw new Error(moldErr?.message || 'Failed to create mold equipment')
      moldId = newMold.equipment_id
    }

    // Step 3B: Cutter (Optional)
    let cutterId: string | null = null
    if (input.attach_cutter && input.cutter_code?.trim()) {
      const cutterCode = input.cutter_code.trim()
      const { data: existingCutter } = await supabase
        .from('equipment')
        .select('equipment_id')
        .eq('equipment_code', cutterCode)
        .maybeSingle()

      if (existingCutter) {
        cutterId = existingCutter.equipment_id
      } else {
        const { data: newCutter, error: cutterErr } = await supabase
          .from('equipment')
          .insert({
            equipment_code: cutterCode,
            display_name: cutterCode,
            equipment_type: 'CUTTER_SEPARATE',
            design_revision_id: revisionId,
            company_id: input.company_id,
            device_status: 'NORMAL',
            usage_status: 'ACTIVE',
          })
          .select('equipment_id')
          .single()
        if (!cutterErr && newCutter) {
          cutterId = newCutter.equipment_id
        }
      }

      if (cutterId) {
        await supabase.from('equipment_assignments').upsert(
          {
            primary_equipment_id: moldId,
            related_equipment_id: cutterId,
            relationship_type: 'SET_MEMBER',
            is_default: true,
          },
          { onConflict: 'primary_equipment_id,related_equipment_id' }
        )
      }
    }

    // Step 4: Job & Step 1
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const baseJobCode = `JOB-${codeCompact}-${dateStr}`
    let candidateJobCode = baseJobCode
    let jobId: string | null = null

    for (let attempt = 1; attempt <= 20; attempt++) {
      const { data: newJob, error: jobErr } = await supabase
        .from('jobs')
        .insert({
          job_code: candidateJobCode,
          job_name: jobName,
          product_id: productId,
          design_revision_id: revisionId,
          equipment_id: moldId,
          company_id: input.company_id,
          job_status: 'PENDING',
          mold_deadline: input.mold_deadline,
          ship_date: input.ship_date || null,
          overall_progress: 0,
          priority: 5,
          start_date: new Date().toISOString().split('T')[0],
        })
        .select('job_id, job_code')
        .single()

      if (!jobErr && newJob) {
        jobId = newJob.job_id
        break
      }

      console.warn('[TELEMETRY_RETRY_JOB]', {
        product_id: productId,
        candidate_code: candidateJobCode,
        attempt,
        postgres_code: jobErr?.code,
        duration_ms: Date.now() - startTime,
      })

      if (jobErr?.code === '23505') {
        candidateJobCode = `${baseJobCode}-${String(attempt + 1).padStart(2, '0')}`
      } else {
        throw new Error(jobErr?.message || 'Job creation error')
      }
    }

    if (!jobId) {
      return { success: false, error: 'ジョブコードの自動採番上限を超過しました', errorKey: 'errSequenceExhausted' }
    }

    // Step 1: 作業 (step_status = PENDING)
    const { data: newStep, error: stepErr } = await supabase
      .from('job_steps')
      .insert({
        job_id: jobId,
        step_no: 1,
        step_name: '作業',
        step_status: 'PENDING',
        assigned_to: input.assigned_to || null,
        deadline: input.mold_deadline ? `${input.mold_deadline}T00:00:00Z` : null,
      })
      .select('step_id')
      .single()

    if (stepErr || !newStep) throw new Error(stepErr?.message || 'Failed to create Job Step 1')

    revalidatePath('/equipment/jobs')
    revalidatePath('/equipment/molds')
    revalidatePath('/equipment/unified')

    return {
      success: true,
      job_id: jobId,
      job_code: candidateJobCode,
      product_id: productId,
      revision_id: revisionId,
      mold_id: moldId,
      cutter_id: cutterId,
      step_id: newStep.step_id,
    }
  } catch (err: any) {
    console.error('[Action Exception] createFastToolingJobAction:', err)
    return { success: false, error: err.message || 'Operation failed' }
  }
}
