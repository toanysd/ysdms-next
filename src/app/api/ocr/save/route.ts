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
  quotation_amount?: number
  cost_amount?: number
  price_quote_required?: boolean
  shipping_deadline?: string
  mold_deadline?: string
  mold_handling_mode?: 'REUSE_EXISTING' | 'CREATE_NEW'
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
        box_spec: body.packaging_info || undefined
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

    // ─── 3. Create Design Revision (SSOT) ────────────────────────────
    const revNum = body.revision_number != null && !isNaN(body.revision_number) ? body.revision_number : 0
    const designCode = body.design_code || (revNum > 0 ? `${baseInternal}-R${revNum}` : baseInternal)

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
        plug_type: body.plug_type || null,
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
    const revisionId = newRev.revision_id

    // ─── 4. Create Work Order (Parent for all jobs) ───────────────────
    const moldHandlingMode = body.mold_handling_mode || 'REUSE_EXISTING'
    const year = new Date().getFullYear()
    const randSeq = Math.floor(100000 + Math.random() * 900000)
    const woCode = `WO-${year}-${randSeq}`
    const woType = revNum > 0 ? (moldHandlingMode === 'REUSE_EXISTING' ? 'MODIFICATION' : 'NEW_SET') : 'NEW_SET'
    const woName = revNum > 0 
      ? (moldHandlingMode === 'REUSE_EXISTING' ? `金型改修: ${baseInternal} (R${revNum})` : `新規金型製作: ${baseInternal} (R${revNum})`)
      : `新規金型製作: ${baseInternal}`

    // Determine deadline = MAX of component deadlines or shipping deadline
    const componentDeadlines = (body.components || [])
      .map(c => c.deadline)
      .filter((d): d is string => !!d)
      .sort()
    const maxDeadline = componentDeadlines.length > 0
      ? componentDeadlines[componentDeadlines.length - 1]
      : body.shipping_deadline || null

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

    const workOrderId = newWO?.wo_id || null

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

    // ─── 6. Create Manufacturing Jobs (jobs table) under Work Order ──
    // 6a. Main Mold Job (MOLD)
    const moldJobCode = `JOB-${baseCode}-${Date.now().toString().slice(-4)}`
    const moldJobName = revNum > 0 
      ? (moldHandlingMode === 'REUSE_EXISTING' ? `金型改修: ${baseInternal} (R${revNum})` : `新規金型製作: ${baseInternal} (R${revNum})`)
      : `新規金型製作: ${baseInternal}`
    const moldCategory = revNum > 0 && moldHandlingMode === 'REUSE_EXISTING' ? 'MOLD_MODIFY' : 'MOLD_NEW'
    const moldTypeId = revNum > 0 && moldHandlingMode === 'REUSE_EXISTING' ? '2' : '1'
    const moldDeadline = body.mold_deadline || moldComponent?.deadline || maxDeadline || undefined

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
        work_order_id: workOrderId || undefined,
        deadline: moldDeadline,
        ship_date: body.shipping_deadline || undefined,
        mold_deadline: body.mold_deadline || undefined,
        unit_price: body.quotation_amount ?? undefined,
        price_quote_required: body.price_quote_required ?? undefined
      }])
      .select('job_id')
      .single()

    if (jobErr || !newMoldJob) {
      throw new Error(`Failed to create mold manufacturing job: ${jobErr?.message}`)
    }
    const moldJobId = newMoldJob.job_id

    // Insert actual step(s) for Mold Job
    if (moldComponent) {
      await supabase.from('job_steps').insert([{
        job_id: moldJobId,
        step_no: 1,
        step_name: moldComponent.step_name || '本型加工',
        track: 'MOLD',
        type_code: 'MOLD',
        material_spec: moldComponent.material_spec || 'アルミ材',
        arrangement: moldComponent.arrangement || 'REQUIRED',
        condition: 'NEW',
        step_status: 'NEW',
        manufacture_location: moldComponent.manufacture_location || 'IN_HOUSE',
        deadline: moldComponent.deadline || moldDeadline || null,
        estimated_hours: moldComponent.estimated_hours || null
      }])
    }

    // 6b. Cutter Job (CUTTER) — only created if Cutter is NEW
    let cutterJobId: string | null = null
    if (cutterIsNew && cutterEquipmentId) {
      const cutterJobCode = `JOB-CUT-${baseCode}-${Date.now().toString().slice(-4)}`
      const cutterJobName = revNum > 0 ? `抜型製作: ${baseInternal} (R${revNum})` : `抜型製作: ${baseInternal}`
      const cutterDeadline = cutterComponent?.deadline || maxDeadline || undefined

      const { data: newCutterJob } = await supabase
        .from('jobs')
        .insert([{
          job_code: cutterJobCode,
          job_name: cutterJobName,
          product_id: productId,
          equipment_id: cutterEquipmentId,
          design_revision_id: revisionId,
          company_id: companyId,
          job_status: 'NEW',
          job_type_id: '3', // 3 = 抜型製作
          job_category: 'CUTTER_NEW',
          start_date: new Date().toISOString().split('T')[0],
          work_order_id: workOrderId || undefined,
          deadline: cutterDeadline,
          ship_date: body.shipping_deadline || undefined
        }])
        .select('job_id')
        .maybeSingle()

      if (newCutterJob) {
        cutterJobId = newCutterJob.job_id
        await supabase.from('job_steps').insert([{
          job_id: cutterJobId,
          step_no: 1,
          step_name: cutterComponent?.step_name || '抜型製作',
          track: 'CUTTER',
          type_code: 'CUTTER',
          material_spec: cutterComponent?.material_spec || null,
          arrangement: cutterComponent?.arrangement || 'REQUIRED',
          condition: 'NEW',
          step_status: 'NEW',
          manufacture_location: cutterComponent?.manufacture_location || 'IN_HOUSE',
          deadline: cutterComponent?.deadline || cutterDeadline || null,
          estimated_hours: cutterComponent?.estimated_hours || null
        }])
      }
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
        cutter_job_id: cutterJobId,
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
