import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { lookupCavType } from '@/lib/utils/moldNaming'

interface SaveOCRInput {
  product_code: string
  product_name_internal: string
  product_description?: string
  customer_name?: string
  company_id?: string
  customer_product_name?: string
  revision_number?: number
  design_code?: string
  design_length?: number
  design_width?: number
  design_height?: number
  design_depth?: number
  cutline_length?: number
  cutline_width?: number
  pieces_per_cycle?: number
  pocket_count?: number
  plastic_type_designed?: string
  plastic_id?: string
  plug_type?: string
  has_separate_cutter?: boolean
  corner_r?: string
  chamfer_c?: string
  draft_angle?: string
  tolerance_info?: string
  packaging_info?: string
  quotation_attached?: string
  quotation_amount?: number
  cost_amount?: number
  price_quote_required?: boolean
  shipping_deadline?: string
  mold_deadline?: string
  mold_handling_mode?: 'REUSE_EXISTING' | 'CREATE_NEW'
  existing_handling_mode?: 'ENRICH_EXISTING' | 'NEW_REVISION'
  components?: Array<{
    type_code: string
    step_name: string
    material_spec?: string
    arrangement?: string
    condition?: string
    manufacture_location?: string
    deadline?: string
    estimated_hours?: number
    existing_equipment_id?: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: SaveOCRInput = await request.json()

    if (!body.product_code || !body.product_name_internal) {
      return NextResponse.json(
        { error: '製品コードと社内製品名は必須です (Product Code and Internal Name are required)' },
        { status: 400 }
      )
    }

    const cleanCode = body.product_code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    const cleanInternal = body.product_name_internal.trim().toUpperCase()

    // ─── 1. Resolve Company / Customer ───────────────────────────────
    let companyId = body.company_id || null

    if (!companyId && body.customer_name) {
      // 1a. Try prefix match from product code (e.g. TOW from TOW-004)
      const prefixMatch = cleanInternal.match(/^([A-Z]+)/)
      if (prefixMatch) {
        const prefix = prefixMatch[1]
        const { data: prefixResults } = await supabase
          .from('companies')
          .select('company_id, company_name, company_code')
          .ilike('company_code', `${prefix}%`)
          .limit(1)

        if (prefixResults && prefixResults.length > 0) {
          companyId = prefixResults[0].company_id
        }
      }

      // 1b. Fallback: search by customer name
      if (!companyId) {
        const trimmedCustomer = body.customer_name.trim()
        const { data: compList } = await supabase
          .from('companies')
          .select('company_id, company_name, company_code')
          .or(`company_name.ilike.%${trimmedCustomer}%,company_code.ilike.%${trimmedCustomer}%`)
          .limit(1)

        if (compList && compList.length > 0) {
          companyId = compList[0].company_id
        }
      }
    }

    // 1c. Ultimate fallback: pick first active company if none found
    if (!companyId) {
      const { data: fallbackCompany } = await supabase
        .from('companies')
        .select('company_id')
        .limit(1)
        .maybeSingle()
      companyId = fallbackCompany?.company_id || null
    }

    if (!companyId) {
      return NextResponse.json(
        { error: '得意先が見つかりません。得意先を選択してください。(Customer not found. Please select a customer.)' },
        { status: 400 }
      )
    }

    // ─── 2. Check or Create Base Product (Single Source of Truth) ─────
    let productId: string | null = null

    // Normalize base product code by removing revision suffixes (R1, R2, etc.)
    const baseCode = cleanCode.replace(/R\d+$/i, '')
    const baseInternal = cleanInternal.replace(/(?:[\s\-_(]|^)(?:R|REV\.?|REVISION\s*)(\d+)\)?$/i, '').trim()

    // Match existing product by baseCode, full cleanCode, or baseInternal name
    const { data: existingProd } = await supabase
      .from('products')
      .select('product_id, product_code, product_name_internal')
      .or(`product_code.eq.${baseCode},product_code.eq.${cleanCode},product_name_internal.eq.${baseInternal}`)
      .limit(1)
      .maybeSingle()

    if (existingProd) {
      productId = existingProd.product_id
      // Update missing fields
      await supabase.from('products').update({
        product_name_internal: existingProd.product_name_internal || baseInternal,
        product_description: body.product_description || undefined,
        customer_product_name: body.customer_product_name || undefined,
        pocket_count: body.pocket_count || undefined,
        box_spec: body.packaging_info || undefined,
        first_shipment_date: body.shipping_deadline || undefined,
        updated_at: new Date().toISOString()
      }).eq('product_id', productId)
    } else {
      const { data: newProd, error: prodErr } = await supabase
        .from('products')
        .insert([
          {
            product_code: baseCode,
            product_name_internal: baseInternal,
            product_name: baseInternal,
            product_description: body.product_description || null,
            customer_product_name: body.customer_product_name || null,
            company_id: companyId,
            pocket_count: body.pocket_count || null,
            box_spec: body.packaging_info || null,
            first_shipment_date: body.shipping_deadline || null,
            product_status: 'ACTIVE'
          }
        ])
        .select('product_id')
        .single()

      if (prodErr || !newProd) {
        throw new Error(`Failed to create product: ${prodErr?.message}`)
      }
      productId = newProd.product_id
    }

    // ─── 3. Create or Enrich Design Revision (SSOT) ───────────────────
    const existingHandlingMode = body.existing_handling_mode || 'ENRICH_EXISTING'
    const revNum = body.revision_number != null && !isNaN(body.revision_number) ? body.revision_number : 0
    let designCode = body.design_code || (revNum > 0 ? `${baseInternal}-R${revNum}` : baseInternal)

    // Find CAV Type ID from mold dimensions if available
    let matchedCavTypeId: string | null = null
    if (body.design_length && body.design_width) {
      const cavInfo = lookupCavType(body.design_length, body.design_width)
      if (cavInfo?.code) {
        const { data: cavRow } = await supabase
          .from('cav_types')
          .select('cav_type_id')
          .ilike('cav_code', cavInfo.code)
          .maybeSingle()
        if (cavRow) matchedCavTypeId = cavRow.cav_type_id
      }
    }

    // Normalize plug_type: DB check constraint allows only 'NONE', 'OWNED', 'SHARED'
    const rawPlugType = (body.plug_type || '').toString().trim()
    let normalizedPlugType: string = 'NONE'
    if (rawPlugType === 'NONE' || rawPlugType === 'OWNED' || rawPlugType === 'SHARED') {
      normalizedPlugType = rawPlugType
    } else if (rawPlugType && rawPlugType !== 'なし' && rawPlugType.toLowerCase() !== 'none') {
      normalizedPlugType = 'OWNED'
    }

    let revisionId: string | null = null
    let existingRev: any = null

    // 1. Try finding revision for this product by revision_number
    const { data: revByNum } = await supabase
      .from('design_revisions')
      .select('revision_id, revision_number, design_code')
      .eq('product_id', productId)
      .eq('revision_number', revNum)
      .limit(1)
      .maybeSingle()

    if (revByNum) {
      existingRev = revByNum
    } else {
      // 2. Try finding revision by design_code (to avoid duplicate key collision on design_code)
      const { data: revByCode } = await supabase
        .from('design_revisions')
        .select('revision_id, revision_number, design_code')
        .eq('design_code', designCode)
        .limit(1)
        .maybeSingle()

      if (revByCode) {
        existingRev = revByCode
      } else if (existingHandlingMode === 'ENRICH_EXISTING') {
        // 3. If ENRICH_EXISTING, find the latest revision of this product to enrich
        const { data: latestRev } = await supabase
          .from('design_revisions')
          .select('revision_id, revision_number, design_code')
          .eq('product_id', productId)
          .order('revision_number', { ascending: false, nullsFirst: false })
          .limit(1)
          .maybeSingle()

        if (latestRev) {
          existingRev = latestRev
        }
      }
    }

    if (existingRev) {
      revisionId = existingRev.revision_id
      await supabase
        .from('design_revisions')
        .update({
          design_code: existingRev.design_code || designCode,
          cav_type_id: matchedCavTypeId || undefined,
          plastic_type_designed: body.plastic_type_designed || undefined,
          plastic_id: body.plastic_id || undefined,
          design_length: body.design_length || undefined,
          design_width: body.design_width || undefined,
          design_height: body.design_height || undefined,
          design_depth: body.design_depth || undefined,
          cutline_length: body.cutline_length || undefined,
          cutline_width: body.cutline_width || undefined,
          cavity_count: body.pieces_per_cycle || undefined,
          plug_type: normalizedPlugType,
          has_separate_cutter: body.has_separate_cutter || false,
          corner_r: body.corner_r || undefined,
          chamfer_c: body.chamfer_c || undefined,
          draft_angle: body.draft_angle || undefined,
          tolerance_pitch: body.tolerance_info || undefined,
          change_summary: '新規金型製造工程票 (AI OCR 自動補完・更新)'
        })
        .eq('revision_id', revisionId!)
    } else {
      // Check if designCode collides with an existing code from another product or rev
      const { data: duplicateCodeCheck } = await supabase
        .from('design_revisions')
        .select('revision_id')
        .eq('design_code', designCode)
        .limit(1)
        .maybeSingle()

      if (duplicateCodeCheck) {
        // Disambiguate by appending next revision suffix
        const { data: productRevs } = await supabase
          .from('design_revisions')
          .select('revision_number')
          .eq('product_id', productId!)
          .order('revision_number', { ascending: false, nullsFirst: false })
          .limit(1)
        const nextRevNum = (productRevs?.[0]?.revision_number || 0) + 1
        designCode = `${baseInternal}-R${nextRevNum}`
      }

      const { data: newRev, error: revErr } = await supabase
        .from('design_revisions')
        .insert([{
          product_id: productId,
          company_id: companyId,
          design_code: designCode,
          revision_number: revNum,
          design_category: 'MASS',
          status: 'APPROVED',
          cav_type_id: matchedCavTypeId || undefined,
          plastic_type_designed: body.plastic_type_designed || null,
          plastic_id: body.plastic_id || null,
          design_length: body.design_length || null,
          design_width: body.design_width || null,
          design_height: body.design_height || null,
          design_depth: body.design_depth || null,
          cutline_length: body.cutline_length || null,
          cutline_width: body.cutline_width || null,
          cavity_count: body.pieces_per_cycle || null,
          plug_type: normalizedPlugType,
          has_separate_cutter: body.has_separate_cutter || false,
          corner_r: body.corner_r || null,
          chamfer_c: body.chamfer_c || null,
          draft_angle: body.draft_angle || null,
          tolerance_pitch: body.tolerance_info || null,
          change_summary: '新規金型製造工程票 (AI OCR 自動取込)'
        }])
        .select('revision_id')
        .single()

      if (revErr || !newRev) {
        throw new Error(`Failed to create design revision: ${revErr?.message}`)
      }
      revisionId = newRev.revision_id
    }

    // ─── 4. Create or Update Work Order (Parent for all jobs) ─────────
    const moldHandlingMode = body.mold_handling_mode || 'CREATE_NEW'
    const isModification = revNum > 0 && moldHandlingMode === 'REUSE_EXISTING'
    const year = new Date().getFullYear()
    const randSeq = Math.floor(100000 + Math.random() * 900000)
    const woCode = `WO-${year}-${randSeq}`
    const woType = isModification ? 'MODIFICATION' : 'NEW_SET'
    const revSuffix = revNum > 0 ? `-R${revNum}` : ''
    const woName = isModification 
      ? `金型改修: ${baseInternal}${revSuffix}`
      : `新規金型製作: ${baseInternal}${revSuffix}`

    // Determine deadline = MAX of component deadlines or shipping deadline
    const componentDeadlines = (body.components || [])
      .map(c => c.deadline)
      .filter((d): d is string => !!d)
      .sort()
    const maxDeadline = componentDeadlines.length > 0
      ? componentDeadlines[componentDeadlines.length - 1]
      : body.shipping_deadline || null

    let workOrderId: string | null = null
    const { data: existingWO } = await supabase
      .from('work_orders')
      .select('wo_id')
      .eq('product_id', productId!)
      .eq('design_revision_id', revisionId!)
      .limit(1)
      .maybeSingle()

    if (existingWO) {
      workOrderId = existingWO.wo_id
      await supabase
        .from('work_orders')
        .update({
          deadline: maxDeadline || undefined,
          wo_status: 'PLANNED'
        })
        .eq('wo_id', workOrderId)
    } else {
      const { data: newWO } = await supabase
        .from('work_orders')
        .insert([{
          wo_code: woCode,
          wo_name: woName,
          product_id: productId,
          design_revision_id: revisionId,
          company_id: companyId,
          wo_type: woType,
          wo_status: 'PLANNED',
          start_date: new Date().toISOString().split('T')[0],
          deadline: maxDeadline || undefined
        }])
        .select('wo_id')
        .maybeSingle()

      workOrderId = newWO?.wo_id || null
    }

    // ─── 5. Create & Link Equipment (Kit Members) ─────────────────────
    let moldEquipmentId: string | null = null
    const createdEquipmentIds: { type: string; id: string }[] = []

    // 5a. Main Mold Equipment
    const moldComponent = body.components?.find(c => c.type_code === 'MOLD')
    const moldIsNew = !moldComponent || moldComponent.condition !== 'EXISTING'

    // Look for existing base mold to avoid creating phantom duplicate equipment
    const { data: existingBaseMold } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code')
      .in('equipment_code', [baseInternal, `${baseInternal} R${revNum}`, cleanInternal, cleanCode, baseCode])
      .eq('equipment_type', 'MOLD')
      .limit(1)
      .maybeSingle()

    if (moldHandlingMode === 'REUSE_EXISTING' && existingBaseMold) {
      // Re-use existing physical mold and update its linked design revision
      moldEquipmentId = existingBaseMold.equipment_id
      await supabase
        .from('equipment')
        .update({
          design_revision_id: revisionId,
          actual_length_mm: body.design_length ? String(body.design_length) : undefined,
          actual_width_mm: body.design_width ? String(body.design_width) : undefined,
          material_spec: moldComponent?.material_spec || 'アルミ材',
          cav_type_id: matchedCavTypeId || undefined
        })
        .eq('equipment_id', moldEquipmentId)
      createdEquipmentIds.push({ type: 'MOLD', id: moldEquipmentId })
    } else if (moldIsNew) {
      const moldCode = revNum > 0 ? `${baseInternal} R${revNum}` : baseInternal
      const { data: newMold, error: moldErr } = await supabase
        .from('equipment')
        .insert([
          {
            equipment_code: moldCode,
            display_name: moldCode,
            equipment_type: 'MOLD',
            company_id: companyId,
            design_revision_id: revisionId,
            cav_type_id: matchedCavTypeId || null,
            material_spec: moldComponent?.material_spec || 'アルミ材',
            actual_length_mm: body.design_length ? String(body.design_length) : null,
            actual_width_mm: body.design_width ? String(body.design_width) : null,
            actual_height_mm: body.design_height ? String(body.design_height) : null,
            device_status: 'NORMAL',
            usage_status: 'STORAGE'
          }
        ])
        .select('equipment_id')
        .single()

      if (moldErr || !newMold) {
        throw new Error(`Failed to create mold equipment: ${moldErr?.message}`)
      }
      moldEquipmentId = newMold.equipment_id
      if (moldEquipmentId) createdEquipmentIds.push({ type: 'MOLD', id: moldEquipmentId })
    }

    // 5b. Cutter Equipment
    let cutterEquipmentId: string | null = null
    const cutterComponent = body.components?.find(c => c.type_code === 'CUTTER')
    const cutterIsNew = !cutterComponent || cutterComponent.condition !== 'EXISTING'

    if (cutterIsNew) {
      const cutterType = body.has_separate_cutter ? 'CUTTER_SEPARATE' : 'CUTTER_INLINE'
      const cutterCode = revNum > 0 ? `C-${cleanInternal}-R${revNum}` : `C-${cleanInternal}`
      const cutterDisplayName = revNum > 0 ? `No.${cleanInternal} R${revNum}` : `No.${cleanInternal}`

      const { data: newCutter } = await supabase
        .from('equipment')
        .insert([
          {
            equipment_code: cutterCode,
            display_name: cutterDisplayName,
            equipment_type: cutterType,
            company_id: companyId,
            design_revision_id: revisionId,
            actual_length_mm: body.cutline_length ? String(body.cutline_length) : null,
            actual_width_mm: body.cutline_width ? String(body.cutline_width) : null,
            material_spec: cutterComponent?.material_spec || '抜型',
            device_status: 'NORMAL',
            usage_status: 'STORAGE'
          }
        ])
        .select('equipment_id')
        .maybeSingle()

      if (newCutter) {
        cutterEquipmentId = newCutter.equipment_id
        createdEquipmentIds.push({ type: 'CUTTER', id: cutterEquipmentId })
      }
    }

    // 5c. Auxiliary Components (WATER_BASE, FRAME, PRESSURE_BASE, STACKING)
    // NOTE: PLUG is an integrated property of MOLD (has_plug, plug_type), not a standalone equipment entity.
    for (const comp of body.components || []) {
      if (['MOLD', 'CUTTER', 'PLUG'].includes(comp.type_code)) continue

      let auxEquipId = comp.existing_equipment_id || null

      // If condition is EXISTING, search for existing shared equipment with matching CAV Type
      if (!auxEquipId && comp.condition === 'EXISTING' && matchedCavTypeId) {
        const { data: existingShared } = await supabase
          .from('equipment')
          .select('equipment_id')
          .eq('equipment_type', comp.type_code)
          .eq('cav_type_id', matchedCavTypeId)
          .limit(1)
          .maybeSingle()

        if (existingShared) {
          auxEquipId = existingShared.equipment_id
        }
      }

      // Only insert new equipment if condition is explicitly NEW
      if (!auxEquipId && comp.condition === 'NEW') {
        const auxCode = `${comp.type_code.slice(0, 2)}-${cleanInternal}-R${revNum}`
        const { data: newAux } = await supabase
          .from('equipment')
          .insert([{
            equipment_code: auxCode,
            display_name: `${comp.step_name} (${cleanInternal})`,
            equipment_type: comp.type_code,
            company_id: companyId,
            design_revision_id: revisionId,
            material_spec: comp.material_spec || null,
            cav_type_id: matchedCavTypeId || null,
            device_status: 'NORMAL',
            usage_status: 'STORAGE'
          }])
          .select('equipment_id')
          .maybeSingle()

        if (newAux) {
          auxEquipId = newAux.equipment_id
        }
      }

      if (auxEquipId) {
        createdEquipmentIds.push({ type: comp.type_code, id: auxEquipId })
      }
    }

    // ─── 5d. Link Equipment into Set via `equipment_assignments` ───────
    if (moldEquipmentId && createdEquipmentIds.length > 1) {
      for (const eq of createdEquipmentIds) {
        if (eq.id === moldEquipmentId) continue
        try {
          await supabase
            .from('equipment_assignments')
            .upsert({
              primary_equipment_id: moldEquipmentId,
              related_equipment_id: eq.id,
              relationship_type: 'SET_MEMBER',
              is_default: true,
              notes: 'AI OCR 工程票取込 自動セット設定'
            }, { onConflict: 'primary_equipment_id,related_equipment_id' })
        } catch (assignErr) {
          console.warn('Non-blocking assignment link error:', assignErr)
        }
      }
    }

    // ─── 6. Create or Update Master Manufacturing Job (jobs table) with Standard Steps ──
    const moldJobCode = `JOB-${baseCode}-${Date.now().toString().slice(-4)}`
    const isJobModification = revNum > 0 && moldHandlingMode === 'REUSE_EXISTING'
    const moldJobName = isJobModification 
      ? `金型改修: ${baseInternal}${revSuffix}`
      : `新規金型製作: ${baseInternal}${revSuffix}`
    const moldCategory = isJobModification ? 'MOLD_MODIFY' : 'MOLD_NEW'
    const moldTypeId = isJobModification ? '2' : '1'
    const moldDeadline = body.mold_deadline || maxDeadline || undefined

    let moldJobId: string | null = null
    const { data: existingJob } = await supabase
      .from('jobs')
      .select('job_id')
      .eq('product_id', productId!)
      .eq('design_revision_id', revisionId!)
      .limit(1)
      .maybeSingle()

    let hasRecordedLogs = false
    if (existingJob) {
      moldJobId = existingJob.job_id
      await supabase
        .from('jobs')
        .update({
          job_name: moldJobName,
          equipment_id: moldEquipmentId || undefined,
          company_id: companyId,
          separate_cutter: body.has_separate_cutter || false,
          has_plug: Boolean(body.plug_type && body.plug_type !== 'なし'),
          deadline: moldDeadline,
          ship_date: body.shipping_deadline || undefined,
          mold_deadline: body.mold_deadline || undefined,
          unit_price: body.cost_amount ? parseFloat(String(body.cost_amount)) : (body.quotation_amount ? parseFloat(String(body.quotation_amount)) : undefined),
          price_quote_required: body.price_quote_required ?? (body.quotation_attached ? ['有', '要', '✓', 'true', '添付済'].includes(String(body.quotation_attached).trim()) : undefined)
        })
        .eq('job_id', moldJobId)

      const { count: logCount } = await supabase
        .from('work_logs')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', moldJobId)

      hasRecordedLogs = Boolean(logCount && logCount > 0)
      if (!hasRecordedLogs) {
        await supabase.from('job_steps').delete().eq('job_id', moldJobId)
      }
    } else {
      const { data: newMoldJob, error: jobErr } = await supabase
        .from('jobs')
        .insert([{
          job_code: moldJobCode,
          job_name: moldJobName,
          product_id: productId,
          equipment_id: moldEquipmentId,
          design_revision_id: revisionId,
          company_id: companyId,
          job_status: 'NEW',
          job_type_id: moldTypeId,
          job_category: moldCategory,
          separate_cutter: body.has_separate_cutter || false,
          has_plug: Boolean(body.plug_type && body.plug_type !== 'なし'),
          start_date: new Date().toISOString().split('T')[0],
          work_order_id: workOrderId,
          deadline: moldDeadline,
          ship_date: body.shipping_deadline || undefined,
          mold_deadline: body.mold_deadline || undefined,
          unit_price: body.cost_amount ? parseFloat(String(body.cost_amount)) : (body.quotation_amount ? parseFloat(String(body.quotation_amount)) : undefined),
          price_quote_required: body.price_quote_required ?? (body.quotation_attached ? ['有', '要', '✓', 'true', '添付済'].includes(String(body.quotation_attached).trim()) : undefined)
        }])
        .select('job_id')
        .single()

      if (jobErr || !newMoldJob) {
        throw new Error(`Failed to create mold manufacturing job: ${jobErr?.message}`)
      }
      moldJobId = newMoldJob.job_id
    }

    // Insert component steps strictly from the OCR sheet (1 step per equipment component / milestone)
    const moldComp = body.components?.find(c => c.type_code === 'MOLD')
    const plugComp = body.components?.find(c => c.type_code === 'PLUG')
    const cutterComp = body.components?.find(c => c.type_code === 'CUTTER')
    const hasPlugRequirement = plugComp?.arrangement === 'REQUIRED' || Boolean(body.plug_type && body.plug_type !== 'なし')
    const hasCutterRequirement = cutterComp?.arrangement === 'REQUIRED' || !cutterComp || cutterComp.condition === 'NEW'

    const targetYear = (moldDeadline ? new Date(moldDeadline).getFullYear() : (body.shipping_deadline ? new Date(body.shipping_deadline).getFullYear() : new Date().getFullYear())) || new Date().getFullYear()

    const normalizeDl = (dStr?: string | null) => {
      if (!dStr) return null
      const m = String(dStr).match(/^(\d{4})-(\d{2}-\d{2}.*)$/)
      if (m && targetYear && parseInt(m[1], 10) !== targetYear) {
        return `${targetYear}-${m[2]}`
      }
      return dStr
    }

    const jobStepsToInsert: any[] = []
    let stepNo = 1

    const normalizedMoldCompDl = normalizeDl(moldComp?.deadline)
    const normalizedPlugCompDl = normalizeDl(plugComp?.deadline)
    const normalizedCutterCompDl = normalizeDl(cutterComp?.deadline)

    // 1. Track [M] 金型
    if (normalizedMoldCompDl && normalizedMoldCompDl !== moldDeadline) {
      jobStepsToInsert.push({
        job_id: moldJobId,
        step_no: stepNo++,
        step_name: 'アルミ材手配',
        track: 'MOLD',
        type_code: 'MOLD',
        material_spec: moldComp?.material_spec || 'アルミ材',
        arrangement: 'REQUIRED',
        condition: 'NEW',
        step_status: 'PENDING',
        manufacture_location: moldComp?.manufacture_location || 'IN_HOUSE',
        deadline: normalizedMoldCompDl,
        estimated_hours: null
      })
    }
    jobStepsToInsert.push({
      job_id: moldJobId,
      step_no: stepNo++,
      step_name: '金型製作',
      track: 'MOLD',
      type_code: 'MOLD',
      material_spec: moldComp?.material_spec || 'アルミ材',
      arrangement: 'REQUIRED',
      condition: 'NEW',
      step_status: 'PENDING',
      manufacture_location: moldComp?.manufacture_location || 'IN_HOUSE',
      deadline: moldDeadline || null,
      estimated_hours: null
    })

    // 2. Track [P] プラグ
    if (hasPlugRequirement) {
      const plugDl = normalizedPlugCompDl || moldDeadline || null
      jobStepsToInsert.push({
        job_id: moldJobId,
        step_no: stepNo++,
        step_name: 'プラグ製作',
        track: 'PLUG',
        type_code: 'PLUG',
        material_spec: plugComp?.material_spec || null,
        arrangement: 'REQUIRED',
        condition: 'NEW',
        step_status: 'PENDING',
        manufacture_location: plugComp?.manufacture_location || 'IN_HOUSE',
        deadline: plugDl,
        estimated_hours: null
      })
    }

    // 3. Track [C] 抜型
    if (hasCutterRequirement) {
      const cutterDl = normalizedCutterCompDl || moldDeadline || null
      jobStepsToInsert.push({
        job_id: moldJobId,
        step_no: stepNo++,
        step_name: '抜型製作',
        track: 'CUTTER',
        type_code: 'CUTTER',
        material_spec: cutterComp?.material_spec || '抜型',
        arrangement: 'REQUIRED',
        condition: 'NEW',
        step_status: 'PENDING',
        manufacture_location: cutterComp?.manufacture_location || 'IN_HOUSE',
        deadline: cutterDl,
        estimated_hours: null
      })
    }

    // 4. Other auxiliary components (Water base, Frame...)
    const otherComps = body.components?.filter(c => !['MOLD', 'PLUG', 'CUTTER'].includes(c.type_code)) || []
    for (const oc of otherComps) {
      jobStepsToInsert.push({
        job_id: moldJobId,
        step_no: stepNo++,
        step_name: oc.step_name || oc.type_code,
        track: oc.type_code,
        type_code: oc.type_code,
        material_spec: oc.material_spec || null,
        arrangement: oc.arrangement || 'NOT_REQUIRED',
        condition: oc.condition || 'EXISTING',
        step_status: 'PENDING',
        manufacture_location: oc.manufacture_location || 'IN_HOUSE',
        deadline: normalizeDl(oc.deadline) || null,
        estimated_hours: oc.estimated_hours || null
      })
    }

    if (!existingJob || !hasRecordedLogs) {
      await supabase.from('job_steps').insert(jobStepsToInsert)
    }

    return NextResponse.json({
      success: true,
      data: {
        product_id: productId,
        revision_id: revisionId,
        work_order_id: workOrderId,
        mold_equipment_id: moldEquipmentId,
        cutter_equipment_id: cutterEquipmentId,
        equipment_count: createdEquipmentIds.length,
        job_id: moldJobId,
        job_code: moldJobCode,
        product_code: cleanCode,
        product_name_internal: cleanInternal
      }
    })
  } catch (err: any) {
    console.error('OCR Save API Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to save OCR data' }, { status: 500 })
  }
}
