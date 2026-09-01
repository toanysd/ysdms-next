import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { lookupCavType } from '@/lib/utils/moldNaming'
import { calculateTargetCompletionDate } from '@/lib/utils/companyCalendar'

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
  cost_note?: string | null
  price_quote_required?: boolean
  shipping_deadline?: string
  mold_deadline?: string
  design_category?: string
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
    shared_from_product_code?: string
    shared_with_code?: string | null
    shared_note?: string | null
    notes?: string
  }>
  dry_run?: boolean
  target_job_id?: string
  target_work_order_id?: string
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

    const isDryRun = body.dry_run === true
    const dryRunLogs: string[] = []
    const logDryRun = (msg: string) => {
      if (isDryRun) dryRunLogs.push(msg)
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
      logDryRun(`✅ Update existing Product: ${baseInternal} (${productId})`)
      if (!isDryRun) {
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
      }
    } else {
      logDryRun(`🆕 Create new Product: ${baseInternal}`)
      if (isDryRun) {
        productId = 'dry-run-prod-id'
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
      logDryRun(`✅ Update existing Design Revision: ${designCode} (${revisionId})`)
      if (!isDryRun) {
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
      }
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

      logDryRun(`🆕 Create new Design Revision: ${designCode}`)
      if (isDryRun) {
        revisionId = 'dry-run-rev-id'
      } else {
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
    let finalWoCode = woCode

    if (body.target_work_order_id) {
      workOrderId = body.target_work_order_id
      const { data: targetWO } = await supabase
        .from('work_orders')
        .select('wo_id, wo_code, wo_name')
        .eq('wo_id', workOrderId)
        .maybeSingle()

      if (targetWO?.wo_code) {
        finalWoCode = targetWO.wo_code
      }

      logDryRun(`🔗 Link to existing Work Order: ${finalWoCode} (${workOrderId})`)
      if (!isDryRun) {
        await supabase
          .from('work_orders')
          .update({
            product_id: productId,
            design_revision_id: revisionId,
            company_id: companyId,
            deadline: maxDeadline || undefined
          })
          .eq('wo_id', workOrderId!)
      }
    } else {
      const { data: existingWO } = await supabase
        .from('work_orders')
        .select('wo_id, wo_code')
        .eq('product_id', productId!)
        .eq('design_revision_id', revisionId!)
        .limit(1)
        .maybeSingle()

      if (existingWO) {
        workOrderId = existingWO.wo_id
        if (existingWO.wo_code) {
          finalWoCode = existingWO.wo_code
        }
        logDryRun(`✅ Update existing Work Order: ${workOrderId}`)
        if (!isDryRun) {
          await supabase
            .from('work_orders')
            .update({
              deadline: maxDeadline || undefined,
              wo_status: 'PLANNED'
            })
            .eq('wo_id', workOrderId)
        }
      } else {
        logDryRun(`🆕 Create new Work Order: ${woCode}`)
        if (isDryRun) {
          workOrderId = 'dry-run-wo-id'
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
      }
    }
    // ─── 5. Create & Link Equipment (Kit Members) ─────────────────────
    let moldEquipmentId: string | null = null
    const createdEquipmentIds: { type: string; id: string }[] = []

    // 5. Create or Update Equipment
    const moldComponent = body.components?.find(c => c.type_code === 'MOLD')
    const cutterComponent = body.components?.find(c => c.type_code === 'CUTTER')
    const moldIsNew = !moldComponent || moldComponent.condition !== 'EXISTING'

    const originalCode = body.product_code.trim().toUpperCase()
    // Look for existing base mold to avoid creating phantom duplicate equipment
    const { data: existingBaseMold } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code')
      .in('equipment_code', [
        baseInternal,
        `${baseInternal} R${revNum}`,
        cleanInternal,
        cleanCode,
        baseCode,
        originalCode,
        `${originalCode} R${revNum}`
      ])
      .eq('equipment_type', 'MOLD')
      .limit(1)
      .maybeSingle()

    if (moldHandlingMode === 'REUSE_EXISTING' && existingBaseMold) {
      // Re-use existing physical mold and update its linked design revision
      moldEquipmentId = existingBaseMold.equipment_id
      logDryRun(`✅ Update existing Mold Equipment: ${existingBaseMold.equipment_code} (${moldEquipmentId})`)
      if (!isDryRun) {
        await supabase
          .from('equipment')
          .update({
            design_revision_id: revisionId,
            actual_length_mm: body.design_length ? String(body.design_length) : undefined,
            actual_width_mm: body.design_width ? String(body.design_width) : undefined,
            material_spec: moldComponent?.material_spec || 'アルミ材',
            cav_type_id: matchedCavTypeId || undefined,
            cost_note: body.cost_note || null,
            shared_with_code: cutterComponent?.shared_with_code || null,
            shared_note: cutterComponent?.shared_note || null
          })
          .eq('equipment_id', moldEquipmentId)
      }
      createdEquipmentIds.push({ type: 'MOLD', id: moldEquipmentId })
    } else if (moldIsNew) {
      const moldCode = revNum > 0 ? `${baseInternal} R${revNum}` : baseInternal
      logDryRun(`🆕 Create new Mold Equipment: ${moldCode}`)
      if (isDryRun) {
        moldEquipmentId = 'dry-run-mold-id'
      } else {
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
              cost_note: body.cost_note || null,
              shared_with_code: cutterComponent?.shared_with_code || null,
              shared_note: cutterComponent?.shared_note || null,
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
      }
      if (moldEquipmentId) createdEquipmentIds.push({ type: 'MOLD', id: moldEquipmentId })
    }

    // 5b. Cutter Equipment
    let cutterEquipmentId: string | null = null
    const cutterIsNew = !cutterComponent || cutterComponent.condition !== 'EXISTING'

    // Look for existing base cutter to avoid creating phantom duplicate equipment
    const { data: existingBaseCutter } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code')
      .in('equipment_code', [
        `C-${cleanInternal}`,
        `C-${cleanInternal}-R${revNum}`,
        `C-${cleanCode}`,
        `C-${baseCode}`,
        `C-${originalCode}`,
        `C-${originalCode}-R${revNum}`,
        `C-${baseInternal}`
      ])
      .in('equipment_type', ['CUTTER', 'CUTTER_INLINE', 'CUTTER_SEPARATE'])
      .limit(1)
      .maybeSingle()

    if (moldHandlingMode === 'REUSE_EXISTING' && existingBaseCutter) {
      cutterEquipmentId = existingBaseCutter.equipment_id
      logDryRun(`✅ Update existing Cutter Equipment: ${existingBaseCutter.equipment_code} (${cutterEquipmentId})`)
      if (!isDryRun) {
        await supabase
          .from('equipment')
          .update({
            design_revision_id: revisionId,
            actual_length_mm: body.cutline_length ? String(body.cutline_length) : undefined,
            actual_width_mm: body.cutline_width ? String(body.cutline_width) : undefined,
            material_spec: cutterComponent?.material_spec || '抜型',
            shared_with_code: cutterComponent?.shared_with_code || null,
            shared_note: cutterComponent?.shared_note || null
          })
          .eq('equipment_id', cutterEquipmentId)
      }
      createdEquipmentIds.push({ type: 'CUTTER', id: cutterEquipmentId })
    } else if (cutterIsNew) {
      const cutterType = body.has_separate_cutter ? 'CUTTER_SEPARATE' : 'CUTTER_INLINE'
      const cutterCode = revNum > 0 ? `C-${cleanInternal}-R${revNum}` : `C-${cleanInternal}`
      const cutterDisplayName = revNum > 0 ? `No.${cleanInternal} R${revNum}` : `No.${cleanInternal}`

      logDryRun(`🆕 Create new Cutter Equipment: ${cutterCode}`)
      if (isDryRun) {
        cutterEquipmentId = 'dry-run-cutter-id'
        createdEquipmentIds.push({ type: 'CUTTER', id: cutterEquipmentId })
      } else {
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
              shared_with_code: cutterComponent?.shared_with_code || null,
              shared_note: cutterComponent?.shared_note || null,
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
    } else {
      // Shared existing cutter! E.g. "MMT-014と同じ"
      const sharedCode = cutterComponent?.shared_from_product_code || cutterComponent?.notes || null
      let matchedCutterId: string | null = cutterComponent?.existing_equipment_id || null

      if (!matchedCutterId && sharedCode) {
        const cleanShared = sharedCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        const cleanSharedDash = sharedCode.replace(/と同じ|と共通|流用|既存/g, '').trim().toUpperCase()

        // 1. Direct search by equipment_code / display_name
        const { data: directCutters } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code')
          .in('equipment_type', ['CUTTER', 'CUTTER_INLINE', 'CUTTER_SEPARATE'])
          .or(`equipment_code.ilike.%${cleanShared}%,equipment_code.ilike.%${cleanSharedDash}%,display_name.ilike.%${cleanSharedDash}%`)
          .limit(1)

        if (directCutters && directCutters.length > 0) {
          matchedCutterId = directCutters[0].equipment_id
        } else {
          // 2. Search via product -> design_revisions -> equipment
          const { data: targetProds } = await supabase
            .from('products')
            .select('product_id, design_revisions(revision_id, equipment(equipment_id, equipment_type))')
            .or(`product_code.ilike.%${cleanShared}%,product_name_internal.ilike.%${cleanSharedDash}%`)
            .limit(1)

          if (targetProds && targetProds.length > 0) {
            const revList = (targetProds[0] as any)?.design_revisions || []
            for (const r of revList) {
              const eqList = r.equipment || []
              const cEq = eqList.find((e: any) => ['CUTTER', 'CUTTER_INLINE', 'CUTTER_SEPARATE'].includes(e.equipment_type))
              if (cEq) {
                matchedCutterId = cEq.equipment_id
                break
              }
            }
          }
        }
      }

      if (matchedCutterId) {
        cutterEquipmentId = matchedCutterId
        // Link to equipment_assignments with relationship_type = 'SHARED'
        if (moldEquipmentId) {
          logDryRun(`🔗 Link Cutter Equipment: ${matchedCutterId} to Mold ${moldEquipmentId} (SHARED)`)
          if (!isDryRun) {
            try {
              await supabase.from('equipment_assignments').upsert({
                primary_equipment_id: moldEquipmentId,
                related_equipment_id: matchedCutterId,
                relationship_type: 'SHARED',
                is_default: true,
                notes: sharedCode ? `${sharedCode} (AI OCR 抜型流用設定)` : '抜型流用設定'
              }, { onConflict: 'primary_equipment_id,related_equipment_id' })
            } catch (assignErr) {
              console.warn('Non-blocking cutter assignment link error:', assignErr)
            }
          }
        }
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
        logDryRun(`🆕 Create new Aux Equipment: ${auxCode}`)
        if (isDryRun) {
          auxEquipId = `dry-run-aux-${comp.type_code.toLowerCase()}-id`
        } else {
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
      }

      if (auxEquipId) {
        createdEquipmentIds.push({ type: comp.type_code, id: auxEquipId })
      }
    }

    // ─── 5d. Link Equipment into Set via `equipment_assignments` ───────
    if (moldEquipmentId && createdEquipmentIds.length > 1) {
      for (const eq of createdEquipmentIds) {
        if (eq.id === moldEquipmentId) continue
        logDryRun(`🔗 Link Equipment ${eq.id} to Mold ${moldEquipmentId} (SET_MEMBER)`)
        if (!isDryRun) {
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
    }

    // ─── 6. Create Separate Jobs Per Equipment Component ────────────────
    // Pattern: 1 Job = 1 Equipment (matching established data from Access import)
    // Each component from the 工程票 gets its own Job + Job Steps
    const isJobModification = revNum > 0 && moldHandlingMode === 'REUSE_EXISTING'
    const moldDeadline = body.mold_deadline || maxDeadline || undefined
    const targetCompletionDate = (body as any).target_completion_date || calculateTargetCompletionDate(body.shipping_deadline, moldDeadline)

    const normalizeDl = (dStr?: string | null) => {
      if (!dStr) return null
      const targetYear = (moldDeadline ? new Date(moldDeadline as string).getFullYear() : (body.shipping_deadline ? new Date(body.shipping_deadline).getFullYear() : new Date().getFullYear())) || new Date().getFullYear()
      const m = String(dStr).match(/^(\d{4})-(\d{2}-\d{2}.*)$/)
      if (m && targetYear && parseInt(m[1], 10) !== targetYear) {
        return `${targetYear}-${m[2]}`
      }
      return dStr
    }

    const createdJobIds: { type: string; jobId: string; jobCode: string }[] = []
    const commonJobFields = {
      product_id: productId,
      design_revision_id: revisionId,
      company_id: companyId,
      work_order_id: workOrderId,
      ship_date: body.shipping_deadline || undefined,
      mold_deadline: body.mold_deadline || undefined,
      target_completion_date: targetCompletionDate || undefined,
      unit_price: body.cost_amount ? parseFloat(String(body.cost_amount)) : (body.quotation_amount ? parseFloat(String(body.quotation_amount)) : undefined),
        price_quote_required: body.price_quote_required ?? (body.quotation_attached ? ['有', '要', '✓', 'true', '添付済'].includes(String(body.quotation_attached).trim()) : undefined),
    }

    // Helper: create or update a job for a specific equipment
    async function upsertEquipmentJob(params: {
      equipmentId: string | null,
      jobCategory: string,
      jobTypeId: string,
      jobName: string,
      jobCodePrefix: string,
      deadline: string | null | undefined,
      steps: Array<{ step_name: string; track: string; type_code: string; material_spec?: string; manufacture_location?: string; deadline?: string | null; estimated_hours?: number | null }>,
      isTargetJob?: boolean,
    }) {
      const { equipmentId, jobCategory, jobTypeId, jobName, jobCodePrefix, deadline, steps, isTargetJob } = params

      // Check for existing job with same equipment + product + design (avoid duplicates)
      let existingJob: any = null
      
      if (isTargetJob && body.target_job_id) {
        if (!isDryRun) {
          const { data: targetJob } = await supabase.from('jobs').select('job_id, job_name').eq('job_id', body.target_job_id).limit(1).maybeSingle()
          existingJob = targetJob
        } else {
          existingJob = { job_id: body.target_job_id, job_name: 'Existing Job (Dry Run)' }
        }
      } else if (!isDryRun) {
        let existingQuery = supabase
          .from('jobs')
          .select('job_id, job_name')
          .eq('product_id', productId!)
          .eq('design_revision_id', revisionId!)
          .eq('job_category', jobCategory)

        if (equipmentId) {
          existingQuery = existingQuery.eq('equipment_id', equipmentId)
        }

        const { data: found } = await existingQuery.limit(1).maybeSingle()
        existingJob = found

        // If not found yet and target_work_order_id is provided, check jobs belonging to that Work Order or legacy job
        if (!existingJob && body.target_work_order_id) {
          let woJobQuery = supabase
            .from('jobs')
            .select('job_id, job_name, job_category, legacy_id')
            .eq('work_order_id', body.target_work_order_id)

          if (jobCategory.startsWith('MOLD')) {
            woJobQuery = woJobQuery.in('job_category', ['MOLD', 'MOLD_NEW', 'MOLD_MAINTENANCE', 'MOLD_REPAIR'])
          } else {
            woJobQuery = woJobQuery.eq('job_category', jobCategory)
          }

          const { data: foundWoJob } = await woJobQuery.limit(1).maybeSingle()
          if (foundWoJob) {
            existingJob = foundWoJob
          } else {
            const { data: targetWO } = await supabase
              .from('work_orders')
              .select('legacy_id')
              .eq('wo_id', body.target_work_order_id)
              .maybeSingle()

            if (targetWO?.legacy_id) {
              const expectedJobLegacyId = targetWO.legacy_id.replace('WO', 'JOB')
              const { data: foundLegacyJob } = await supabase
                .from('jobs')
                .select('job_id, job_name, job_category, legacy_id')
                .eq('legacy_id', expectedJobLegacyId)
                .limit(1)
                .maybeSingle()
              if (foundLegacyJob) {
                existingJob = foundLegacyJob
              }
            }
          }
        }
      } else {
        // In dry-run, mock IDs wouldn't be found anyway, so we just assume new unless it's a real equipment ID
        if (equipmentId && !equipmentId.toString().startsWith('dry-run-')) {
          let existingQuery = supabase
            .from('jobs')
            .select('job_id, job_name')
            .eq('product_id', productId!)
            .eq('design_revision_id', revisionId!)
            .eq('job_category', jobCategory)
            .eq('equipment_id', equipmentId)
          const { data: found } = await existingQuery.limit(1).maybeSingle()
          existingJob = found
        }
        if (!existingJob && body.target_work_order_id) {
          existingJob = { job_id: 'dry-run-existing-wo-job-id', job_name: `${jobName} (Target WO Job)` }
        }
      }

      let jobId: string
      let jobCode: string

      if (existingJob) {
        jobId = existingJob.job_id
        jobCode = jobCodePrefix
        
        let finalJobName = jobName
        if (isTargetJob && body.target_job_id) {
          finalJobName = `${existingJob.job_name} [${finalWoCode}]`
        }

        logDryRun(`✅ Update existing Job: [${jobCategory}] ${finalJobName} (${jobId})`)
        
        if (!isDryRun) {
          await supabase.from('jobs').update({
            job_name: finalJobName,
            equipment_id: equipmentId || undefined,
            ...commonJobFields,
            deadline: deadline || undefined,
            separate_cutter: body.has_separate_cutter || false,
            has_plug: Boolean(body.plug_type && body.plug_type !== 'なし'),
          }).eq('job_id', jobId)

          // Only replace steps if no work_logs exist yet
          const { count: logCount } = await supabase
            .from('work_logs')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', jobId)

          if (!logCount || logCount === 0) {
            await supabase.from('job_steps').delete().eq('job_id', jobId)
            if (steps.length > 0) {
              await supabase.from('job_steps').insert(
                steps.map((s, i) => ({
                  job_id: jobId,
                  step_no: i + 1,
                  step_name: s.step_name,
                  track: s.track,
                  type_code: s.type_code,
                  material_spec: s.material_spec || null,
                  arrangement: 'REQUIRED',
                  condition: 'NEW',
                  step_status: 'PENDING',
                  manufacture_location: s.manufacture_location || 'IN_HOUSE',
                  deadline: s.deadline || deadline || null,
                  target_completion_date: targetCompletionDate || null,
                  estimated_hours: s.estimated_hours || null,
                }))
              )
            }
          }
        }
      } else {
        jobCode = `${jobCodePrefix}-${Date.now().toString().slice(-4)}`
        logDryRun(`🆕 Create new Job: [${jobCategory}] ${jobName} (${jobCode})`)
        
        if (isDryRun) {
          jobId = `dry-run-job-${jobCategory}-id`
        } else {
          const { data: newJob, error: jobErr } = await supabase
            .from('jobs')
            .insert([{
              job_code: jobCode,
              job_name: jobName,
              equipment_id: equipmentId,
              job_status: 'NEW',
              job_type_id: jobTypeId,
              job_category: jobCategory,
              ...commonJobFields,
              deadline: deadline || null,
              separate_cutter: body.has_separate_cutter || false,
              has_plug: Boolean(body.plug_type && body.plug_type !== 'なし'),
            }])
            .select('job_id')
            .single()

          if (jobErr || !newJob) {
            throw new Error(`Failed to create job ${jobCategory}: ${jobErr?.message}`)
          }
          jobId = newJob.job_id

          if (steps.length > 0) {
            await supabase.from('job_steps').insert(
              steps.map((s, i) => ({
                job_id: jobId,
                step_no: i + 1,
                step_name: s.step_name,
                track: s.track,
                type_code: s.type_code,
                material_spec: s.material_spec || null,
                arrangement: 'REQUIRED',
                condition: 'NEW',
                step_status: 'PENDING',
                manufacture_location: s.manufacture_location || 'IN_HOUSE',
                deadline: s.deadline || deadline || null,
                target_completion_date: targetCompletionDate || null,
                estimated_hours: s.estimated_hours || null,
              }))
            )
          }
        }
      }

      createdJobIds.push({ type: jobCategory, jobId, jobCode })
      return jobId
    }

    // ── 6a. Mold Job (金型製作) ──────────────────────────────────────────
    const moldComp = body.components?.find(c => c.type_code === 'MOLD')
    const moldCategory = isJobModification ? 'MOLD_MODIFY' : 'MOLD_NEW'
    const moldTypeId = isJobModification ? '2' : '1'
    const moldJobName = isJobModification
      ? `金型改修: ${baseInternal}${revSuffix}`
      : `新規金型製作: ${baseInternal}${revSuffix}`

    const moldSteps: Array<{ step_name: string; track: string; type_code: string; material_spec?: string; manufacture_location?: string; deadline?: string | null; estimated_hours?: number | null }> = []
    const normalizedMoldDl = normalizeDl(moldComp?.deadline)
    if (normalizedMoldDl && normalizedMoldDl !== moldDeadline) {
      moldSteps.push({ step_name: 'アルミ材手配', track: 'MOLD', type_code: 'MOLD', material_spec: moldComp?.material_spec || 'アルミ材', manufacture_location: moldComp?.manufacture_location || 'IN_HOUSE', deadline: normalizedMoldDl })
    }
    moldSteps.push({ step_name: '金型製作', track: 'MOLD', type_code: 'MOLD', material_spec: moldComp?.material_spec || 'アルミ材', manufacture_location: moldComp?.manufacture_location || 'IN_HOUSE', deadline: (targetCompletionDate || moldDeadline || null) as string | null })

    const moldJobId = await upsertEquipmentJob({
      equipmentId: moldEquipmentId,
      jobCategory: moldCategory,
      jobTypeId: moldTypeId,
      jobName: moldJobName,
      jobCodePrefix: `JOB-${baseCode}-M`,
      deadline: moldDeadline as string | null | undefined,
      steps: moldSteps,
      isTargetJob: true,
    })

    // ── 6b. Cutter Job (抜型製作) ────────────────────────────────────────
    const cutterComp = body.components?.find(c => c.type_code === 'CUTTER')
    const hasCutterRequirement = cutterComp
      ? (cutterComp.arrangement === 'REQUIRED' && cutterComp.condition !== 'EXISTING')
      : true // Default: cutter is always needed unless explicitly marked EXISTING

    if (hasCutterRequirement && cutterEquipmentId) {
      const normalizedCutterDl = normalizeDl(cutterComp?.deadline)
      await upsertEquipmentJob({
        equipmentId: cutterEquipmentId,
        jobCategory: 'CUTTER_NEW',
        jobTypeId: '3',
        jobName: `抜型製作: ${baseInternal}${revSuffix}`,
        jobCodePrefix: `JOB-${baseCode}-C`,
        deadline: (normalizedCutterDl || moldDeadline || null) as string | null | undefined,
        steps: [{ step_name: '抜型製作', track: 'CUTTER', type_code: 'CUTTER', material_spec: cutterComp?.material_spec || '抜型', manufacture_location: cutterComp?.manufacture_location || 'OUTSOURCE' }],
      })
    }

    // ── 6c. Plug Job (プラグ製作) ────────────────────────────────────────
    const plugComp = body.components?.find(c => c.type_code === 'PLUG')
    const hasPlugRequirement = plugComp
      ? (plugComp.arrangement === 'REQUIRED' && plugComp.condition !== 'EXISTING')
      : Boolean(body.plug_type && body.plug_type !== 'なし' && body.plug_type !== 'NONE')

    if (hasPlugRequirement) {
      const plugEquipId = createdEquipmentIds.find(e => e.type === 'PLUG')?.id || null
      const normalizedPlugDl = normalizeDl(plugComp?.deadline)
      await upsertEquipmentJob({
        equipmentId: plugEquipId,
        jobCategory: 'EQUIPMENT_NEW',
        jobTypeId: '4',
        jobName: `プラグ製作: ${baseInternal}${revSuffix}`,
        jobCodePrefix: `JOB-${baseCode}-P`,
        deadline: (normalizedPlugDl || moldDeadline || null) as string | null | undefined,
        steps: [{ step_name: 'プラグ製作', track: 'PLUG', type_code: 'PLUG', material_spec: plugComp?.material_spec || undefined, manufacture_location: plugComp?.manufacture_location || 'IN_HOUSE' }],
      })
    }

    // ── 6d. Auxiliary Equipment Jobs (WB, PB, Frame, Stacking — only if NEW) ─
    const otherComps = body.components?.filter(c => !['MOLD', 'PLUG', 'CUTTER'].includes(c.type_code)) || []
    for (const oc of otherComps) {
      const isReq = oc.arrangement === 'REQUIRED' && oc.condition !== 'EXISTING'
      if (!isReq) continue

      const auxEquipId = createdEquipmentIds.find(e => e.type === oc.type_code)?.id || null
      if (!auxEquipId) continue // No equipment created = no job needed

      const isOutsource = oc.type_code === 'FRAME' || (oc.step_name && (oc.step_name.includes('枠') || oc.step_name.includes('抜型')))
      const ocDl = oc.deadline ? normalizeDl(oc.deadline) : moldDeadline
      await upsertEquipmentJob({
        equipmentId: auxEquipId,
        jobCategory: 'EQUIPMENT_NEW',
        jobTypeId: '5',
        jobName: `${oc.step_name || oc.type_code}製作: ${baseInternal}${revSuffix}`,
        jobCodePrefix: `JOB-${baseCode}-${oc.type_code.slice(0, 2)}`,
        deadline: (ocDl || null) as string | null | undefined,
        steps: [{ step_name: oc.step_name || oc.type_code, track: oc.type_code, type_code: oc.type_code, material_spec: oc.material_spec || undefined, manufacture_location: oc.manufacture_location || (isOutsource ? 'OUTSOURCE' : 'IN_HOUSE'), estimated_hours: oc.estimated_hours || undefined }],
      })
    }

    // ─── 7. Auto-create Design Job for the Product & Revision ───────
    try {
      let existingDesignJob: any = null
      if (!isDryRun) {
        const { data: found } = await supabase
          .from('jobs')
          .select('job_id')
          .eq('product_id', productId!)
          .eq('job_category', 'DESIGN')
          .limit(1)
          .maybeSingle()
        existingDesignJob = found
      } else {
        // Mock ID wouldn't be found
      }

      if (!existingDesignJob) {
        const designJobCode = `DES-${cleanCode}`
        const designJobName = `${cleanInternal} 設計`
        const hasProto = body.design_category === 'PROTOTYPE_POCKET' || Boolean(body.components?.some(c => c.step_name?.includes('試作')))

        logDryRun(`🆕 Create new Design Job: ${designJobCode}`)
        
        if (isDryRun) {
          createdJobIds.push({ type: 'DESIGN', jobId: 'dry-run-design-job-id', jobCode: designJobCode })
        } else {
          const { data: newDesJob } = await supabase
            .from('jobs')
            .insert([{
              job_code: designJobCode,
              job_name: designJobName,
              job_type_id: '9',
              job_category: 'DESIGN',
              product_id: productId,
              design_revision_id: revisionId,
              company_id: companyId,
              job_status: 'NEW',
              overall_progress: 0,
              priority: 5,
              start_date: new Date().toISOString().split('T')[0],
              mold_deadline: moldDeadline || undefined,
              ship_date: body.shipping_deadline || undefined,
              deadline: moldDeadline || undefined,
              target_completion_date: targetCompletionDate || undefined,
              work_order_id: workOrderId || undefined,
              notes: 'AI OCR 工程票取込 自動作成'
            }])
            .select('job_id')
            .maybeSingle()

          if (newDesJob) {
            const desSteps = hasProto
              ? [
                  { job_id: newDesJob.job_id, step_no: 1, step_name: '試作金型作成', step_status: 'NOT_STARTED', track: 'DESIGN', deadline: moldDeadline || null, target_completion_date: targetCompletionDate || null, notes: '試作金型作成' },
                  { job_id: newDesJob.job_id, step_no: 2, step_name: '本型設計', step_status: 'NOT_STARTED', track: 'DESIGN', deadline: moldDeadline || null, target_completion_date: targetCompletionDate || null, notes: '本型設計' }
                ]
              : [
                  { job_id: newDesJob.job_id, step_no: 1, step_name: '本型設計', step_status: 'NOT_STARTED', track: 'DESIGN', deadline: moldDeadline || null, target_completion_date: targetCompletionDate || null, notes: '本型設計' }
                ]

            await supabase.from('job_steps').insert(desSteps)
            createdJobIds.push({ type: 'DESIGN', jobId: newDesJob.job_id, jobCode: designJobCode })
          }
        }
      } else {
        logDryRun(`✅ Existing Design Job found: ${existingDesignJob.job_id}`)
      }
    } catch (desErr) {
      console.warn('Non-blocking Design Job creation error in OCR save:', desErr)
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
        job_count: createdJobIds.length,
        jobs: createdJobIds,
        product_code: cleanCode,
        product_name_internal: cleanInternal,
        dry_run: isDryRun,
        dry_run_logs: dryRunLogs
      }
    })
  } catch (err: any) {
    console.error('OCR Save API Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to save OCR data' }, { status: 500 })
  }
}
