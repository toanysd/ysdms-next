'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ========================================================
// ACTION 1: Thêm Khuôn gốc mới (Mold Master)
// ========================================================
export async function addMoldBaseAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const company_id = formData.get('company_id') as string

  // 1. Check if product already exists
  const { data: existingMold } = await supabase
    .from('products')
    .select('product_id')
    .eq('product_code', code.trim())
    .single();

  if (existingMold) {
    throw new Error('Product code already exists: ' + code.trim());
  }

  // 2. Create product
  const insertData: any = {
    product_code: code.trim(),
    product_name_internal: name.trim() || null,
    product_status: 'ACTIVE'
  }

  if (company_id) {
    insertData.company_id = company_id;
  }

  const { error } = await supabase
    .from('products')
    // @ts-ignore
    .insert([insertData])

  if (error) {
    console.error('Error adding mold master:', error)
    throw new Error(error.message)
  }

  revalidatePath('/master/molds')
  redirect('/master/molds')
}

// ========================================================
// ACTION 2: Thﾃｪm Phiﾃｪn b蘯｣n Thi蘯ｿt k蘯ｿ m盻嬖 (Revision)
// ========================================================
export async function addRevisionAction(formData: FormData) {
  const supabase = await createClient()

  const moldMasterId = formData.get('mold_master_id') as string
  const moldMasterCode = formData.get('mold_master_code') as string
  const versionLabel = (formData.get('version_label') as string).trim()
  const approvedDate = formData.get('approved_date') as string

  const revisionCode = `${moldMasterCode}-${versionLabel}`

  // 1. Create Empty Design
  const { data: newDesign, error: dErr } = await supabase
    .from('design_revisions')
    .insert([{ design_code: `${revisionCode}-${Date.now()}` }])
    .select('revision_id')
    .single()
    
  if (dErr) throw new Error(dErr.message)

  // 2. Create Revision
  const insertData: any = {
    product_id: moldMasterId,
    design_revision_id: newDesign.revision_id,
    revision_code: revisionCode,
    revision_name: versionLabel,
  }

  if (approvedDate) {
    insertData.effective_date = approvedDate
  }

  const { error } = await supabase
    .from('mold_revisions')
    // @ts-ignore
    .insert([insertData])

  if (error) {
    console.error('Error adding revision:', error)
    throw new Error(error.message)
  }

  revalidatePath(`/master/molds/${moldMasterId}`)
  redirect(`/master/molds/${moldMasterId}`)
}

// ========================================================
// QUERY: Lấy chi tiết Khuôn Gốc
// ========================================================
export async function getMoldBaseDetail(moldMasterId: string) {
  const supabase = await createClient()

  const { data: moldBase, error: baseError } = await (supabase.from('products') as any)
    .select(`
      *,
      companies!products_company_id_fkey ( company_code, company_name ),
      keeper_company:companies!products_end_user_company_id_fkey ( company_code, company_name )
    `)
    .eq('product_id', moldMasterId)
    .single()

  if (baseError) {
    return { moldBase: null, revisions: [], error: baseError.message }
  }

  const { data: revisions, error: revError } = await supabase
    .from('mold_revisions')
    .select(`
      *,
      design_revisions (*)
    `)
    .eq('product_id', moldMasterId)
    .order('created_at', { ascending: true })

  return {
    moldBase,
    revisions: revisions || [],
    derivedMolds: [],
    error: revError?.message || null,
  }
}

// ========================================================
// QUERY: G盻｣i ﾃｽ Label ti蘯ｿp theo
// ========================================================
export async function suggestNextRevisionLabel(moldMasterId: string) {
  const supabase = await createClient()

  const { data: revisions } = await supabase
    .from('mold_revisions')
    .select('revision_name')
    .eq('product_id', moldMasterId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!revisions || revisions.length === 0) {
    return 'R1'
  }

  const lastLabel = revisions[0].revision_name
  const rMatch = lastLabel.match(/^R(\d+)$/i)
  if (rMatch) {
    return `R${parseInt(rMatch[1], 10) + 1}`
  }

  return ''
}

export interface UnifiedMoldPayload {
  code: string
  name?: string
  company_id?: string
  mold_class?: string
  base_notes?: string

  design_for_plastic_type?: string
  cutline_x?: number | null
  cutline_y?: number | null
  corner_r?: string
  chamfer_c?: string
  pocket_numbers?: number | null
  pitch?: number | null
  under_depth?: number | null
  under_angle?: string
  draft_angle?: string
  mold_orientation?: string
  mold_setup_type?: string
  separate_cutter?: boolean
  plug?: boolean
  customer_drawing_no?: string
  customer_equipment_no?: string
  customer_tray_name?: string
  tray_info?: string
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  design_weight?: number | null
  piece_count?: number | null
  cavid?: string
  data_input?: string
  text_content?: string

  physical_code?: string
  cavity?: number
  item_type_id?: string
  rack_layer_id?: string
  status?: string
  keeper_company?: string
  physical_notes?: string

  existing_base_id?: string
  existing_revision_id?: string
  existing_physical_id?: string
  create_new_revision?: boolean
}

export async function upsertUnifiedMold(payload: UnifiedMoldPayload): Promise<{ success: boolean; error?: string; base_id?: string }> {
  try {
    const supabase = await createClient()

    // 1. Upsert mold master
    let baseId: string | null = payload.existing_base_id || null
    
    const baseData: any = {
      product_code: payload.code,
      product_name_internal: payload.name || payload.code,
      notes: payload.base_notes || null,
    }
    
    if (payload.company_id) baseData.company_id = payload.company_id;

    if (baseId) {
      // @ts-ignore
      const { error } = await supabase.from('products').update(baseData).eq('product_id', baseId)
      if (error) throw new Error(error.message)
    } else {
      // @ts-ignore
      const { data, error } = await supabase.from('products').insert(baseData).select('product_id').single()
      if (error) throw new Error(error.message)
      baseId = data.product_id
    }

    // 2. Upsert designs/revisions
    let revisionId = payload.existing_revision_id
    const shouldCreateNewRevision = payload.create_new_revision || !revisionId

    const designData: any = {
      design_code: `${payload.code}-D-${Date.now()}`,
      cutline_x_mm: payload.cutline_x ?? null,
      cutline_y_mm: payload.cutline_y ?? null,
      corner_r: payload.corner_r || null,
      chamfer_c: payload.chamfer_c || null,
      pocket_numbers: payload.pocket_numbers ?? null,
      cavity_pitch_mm: payload.pitch ?? null,
      under_angle: payload.under_angle || null,
      mold_orientation: payload.mold_orientation || null,
      mold_setup_type: payload.mold_setup_type || null,
      piece_count: payload.piece_count ?? null,
    }

    if (shouldCreateNewRevision) {
      if(payload.company_id) designData.company_id = payload.company_id;
      // @ts-ignore
      const { data: newDesign, error: dErr } = await supabase.from('design_revisions').insert(designData).select('revision_id').single()
      if (dErr) throw new Error(dErr.message)

      const { count } = await supabase.from('mold_revisions').select('*', { count: 'exact', head: true }).eq('product_id', baseId!)
      const versionNum = (count || 0) + 1
      
      const revData = {
          product_id: baseId,
          design_revision_id: newDesign.revision_id,
          revision_code: `${payload.code}-R${String(versionNum).padStart(2, '0')}`,
          revision_name: `R${versionNum}`
      };

      const { data, error } = await supabase.from('mold_revisions').insert(revData).select('revision_id').single()
      if (error) throw new Error(error.message)
      revisionId = data.revision_id
    }

    // 3. Upsert physical
    if (payload.physical_code || payload.existing_physical_id) {
      const physicalData: any = {
        mold_revision_id: revisionId,
        system_code: payload.physical_code || payload.code,
        display_name: payload.physical_code || payload.code,
        cav_type_id: payload.item_type_id || null,
        device_status: payload.status || 'ACTIVE',
        keeper_company_id: payload.keeper_company || null,
        notes: payload.physical_notes || null,
      }

      if (payload.rack_layer_id) {
        physicalData.current_rack_layer_id = payload.rack_layer_id
      }

      if (payload.existing_physical_id) {
        // @ts-ignore
        const { error } = await supabase.from('physical_molds').update(physicalData).eq('physical_mold_id', payload.existing_physical_id)
        if (error) throw new Error(error.message)
      } else {
        // @ts-ignore
        const { error } = await supabase.from('physical_molds').insert(physicalData)
        if (error) throw new Error(error.message)
      }
    }

    revalidatePath('/equipment/molds')
    return { success: true, base_id: baseId! }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function fetchMoldForEdit(physicalId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('physical_molds')
      .select(`
        *,
        mold_revisions (
          *,
          products (*)
        ),
        cav_types (cav_type_id, cav_name),
        rack_layers (id, code, label, rack_id)
      `)
      .eq('physical_mold_id', physicalId)
      .single()

    if (error) throw new Error(error.message)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message, data: null }
  }
}

// Minimal upsert for React Hook Form (MoldRevisionFormValues needs to be updated too, but using generic for now)
export async function upsertMoldRevisionAction(data: any) {
    return { success: false, error: 'Not implemented in v2 migration yet' }
}

