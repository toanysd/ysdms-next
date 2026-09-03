'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const JOB_STEP_TEMPLATES: Record<string, string[]> = {
  MOLD:            ['CAM設計', 'CNC加工', '磨き仕上げ', '試打確認'],
  CUTTER_INLINE:   ['設計', 'レーザー/CNC加工', '刃研ぎ', '試打確認'],
  CUTTER_SEPARATE: ['設計', 'レーザー/CNC加工', '刃研ぎ', '試打確認'],
  PRESSURE_BASE:   ['設計', '加工', '確認'],
  WATER_BASE:      ['設計', '配管加工', '確認'],
  STACKING:        ['設計', '溶接/加工', '確認'],
  PLUG:            ['設計', '加工', '確認'],
  FRAME:           ['設計', '加工', '確認'],
}

const VALID_EQUIPMENT_TYPES = [
  'MOLD', 'CUTTER_INLINE', 'CUTTER_SEPARATE', 'PRESSURE_BASE', 'WATER_BASE', 'STACKING', 'PLUG', 'FRAME'
]

export async function generateJobsForWorkOrder(workOrderId: string) {
  const supabase = await createClient()

  // 1. Get WO
  const { data: wo, error: woError } = await supabase
    .from('work_orders')
    .select('wo_id, wo_code, wo_name, product_id, design_revision_id, case_id, company_id, deadline, wo_status')
    .eq('wo_id', workOrderId)
    .single()

  if (woError || !wo) return { error: 'Work order not found' }

  // 2. Resolve product_id and design_revision_id
  let productId = wo.product_id
  let revisionId = wo.design_revision_id

  if (!revisionId && productId) {
    const { data: rev } = await supabase
      .from('design_revisions')
      .select('revision_id')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (rev) revisionId = rev.revision_id
  }

  if (!productId && revisionId) {
    const { data: dr } = await supabase
      .from('design_revisions')
      .select('product_id')
      .eq('revision_id', revisionId)
      .single()
    if (dr?.product_id) productId = dr.product_id
  }

  if (!revisionId && !productId) {
    return { error: '製品IDまたは設計リビジョンが特定できません。Work Orderに製品を紐付けてください。' }
  }

  // 3. Find primary MOLD equipment
  let targetEquipments: Array<{
    equipment_id: string
    equipment_code: string
    display_name: string | null
    equipment_type: string
  }> = []

  let mold: any = null
  if (revisionId) {
    const { data: moldData } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code, display_name, equipment_type')
      .eq('design_revision_id', revisionId)
      .eq('equipment_type', 'MOLD')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    mold = moldData
  }

  if (mold) {
    targetEquipments.push(mold)

    // 4. Find auxiliary equipment via equipment_assignments (SET_MEMBER)
    const { data: assignments } = await supabase
      .from('equipment_assignments')
      .select(`
        related_equipment_id,
        related_equipment:equipment!equipment_assignments_related_equipment_id_fkey(
          equipment_id, equipment_code, display_name, equipment_type
        )
      `)
      .eq('primary_equipment_id', mold.equipment_id)
      .eq('relationship_type', 'SET_MEMBER')

    if (assignments && assignments.length > 0) {
      for (const a of assignments) {
        const rel = a.related_equipment as any
        if (
          rel && 
          VALID_EQUIPMENT_TYPES.includes(rel.equipment_type) &&
          !targetEquipments.some(e => e.equipment_id === rel.equipment_id)
        ) {
          targetEquipments.push(rel)
        }
      }
    } else if (revisionId) {
      // Fallback: any other equipment with the same design_revision_id
      // POINT 1 FIX: Filter strictly by VALID_EQUIPMENT_TYPES and pick at most 1 per auxiliary equipment_type
      const { data: otherEq } = await supabase
        .from('equipment')
        .select('equipment_id, equipment_code, display_name, equipment_type')
        .eq('design_revision_id', revisionId)
        .in('equipment_type', VALID_EQUIPMENT_TYPES)
        .neq('equipment_id', mold.equipment_id)
        .order('created_at', { ascending: false })

      if (otherEq && otherEq.length > 0) {
        const includedTypes = new Set<string>(['MOLD'])
        for (const eq of otherEq) {
          if (!includedTypes.has(eq.equipment_type)) {
            targetEquipments.push(eq)
            includedTypes.add(eq.equipment_type) // Max 1 per auxiliary type in fallback
          }
        }
      }
    }
  } else if (revisionId) {
    // If no specific MOLD, fetch equipment filtered by VALID_EQUIPMENT_TYPES (max 1 per type)
    const { data: allEq } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code, display_name, equipment_type')
      .eq('design_revision_id', revisionId)
      .in('equipment_type', VALID_EQUIPMENT_TYPES)
      .order('created_at', { ascending: false })

    if (allEq && allEq.length > 0) {
      const includedTypes = new Set<string>()
      for (const eq of allEq) {
        if (!includedTypes.has(eq.equipment_type)) {
          targetEquipments.push(eq)
          includedTypes.add(eq.equipment_type)
        }
      }
    }
  }

  if (targetEquipments.length === 0) {
    return { error: '紐付く設備・金型が見つかりません。製品の設計リビジョンまたは設備登録を確認してください。' }
  }

  // 5. Idempotency check: Find existing jobs for this work_order
  const { data: existingJobs } = await supabase
    .from('jobs')
    .select('equipment_id')
    .eq('work_order_id', workOrderId)

  const existingEquipIds = new Set(existingJobs?.map(j => j.equipment_id).filter(Boolean))
  const equipmentsToCreate = targetEquipments.filter(eq => !existingEquipIds.has(eq.equipment_id))

  if (equipmentsToCreate.length === 0) {
    return { 
      success: true, 
      jobsCreated: 0, 
      message: '該当するすべての設備に対してすでに指示書（Jobs）が発行されています。' 
    }
  }

  // 6. Create Jobs and Job Steps
  let totalJobsCreated = 0
  let totalStepsCreated = 0

  for (const eq of equipmentsToCreate) {
    const jobCategory = eq.equipment_type === 'MOLD'
      ? 'MOLD_NEW'
      : (eq.equipment_type.startsWith('CUTTER') ? 'CUTTER_NEW' : 'EQUIPMENT_NEW')

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const jobCode = `JOB-${wo.wo_code}-${eq.equipment_type.slice(0, 4)}-${randomSuffix}`
    const jobName = `${wo.wo_name || wo.wo_code} - ${eq.display_name || eq.equipment_code || eq.equipment_type}`

    // Insert Job
    const { data: newJob, error: jobError } = await supabase
      .from('jobs')
      .insert({
        work_order_id: workOrderId,
        equipment_id: eq.equipment_id,
        product_id: productId,
        design_revision_id: revisionId,
        case_id: wo.case_id,
        company_id: wo.company_id,
        job_code: jobCode,
        job_name: jobName,
        job_category: jobCategory,
        job_status: 'PENDING',
        deadline: wo.deadline,
        start_date: new Date().toISOString().slice(0, 10),
      })
      .select('job_id')
      .single()

    if (jobError || !newJob) {
      console.error('Error creating job for equipment:', eq.equipment_id, jobError)
      continue
    }

    totalJobsCreated++

    // Insert Steps
    const stepNames = JOB_STEP_TEMPLATES[eq.equipment_type] || ['設計・準備', '加工', '仕上げ・確認']
    const stepsToInsert = stepNames.map((name, index) => ({
      job_id: newJob.job_id,
      step_no: index + 1,
      step_name: name,
      step_status: 'PENDING',
      track: eq.equipment_type === 'MOLD' ? 'MOLD' : (eq.equipment_type === 'PLUG' ? 'PLUG' : 'CUTTER'),
      deadline: wo.deadline,
    }))

    const { error: stepsError } = await supabase
      .from('job_steps')
      .insert(stepsToInsert)

    if (stepsError) {
      console.error('Error creating steps for job:', newJob.job_id, stepsError)
    } else {
      totalStepsCreated += stepsToInsert.length
    }
  }

  // POINT 2 FIX: Guard update to IN_PROGRESS only if current status is CONFIRMED or PLANNED
  if (['CONFIRMED', 'PLANNED'].includes(wo.wo_status)) {
    await supabase
      .from('work_orders')
      .update({ wo_status: 'IN_PROGRESS' })
      .eq('wo_id', workOrderId)
  }

  revalidatePath(`/production/work-orders/${workOrderId}`)
  revalidatePath('/production/work-orders')
  revalidatePath('/equipment/jobs')

  return {
    success: true,
    jobsCreated: totalJobsCreated,
    stepsCreated: totalStepsCreated,
    message: `${totalJobsCreated} 件の加工指示（Job）と ${totalStepsCreated} 件の工程ステップを発行しました。`
  }
}
