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

  // 1. Check if design_master exists, if not create one
  let design_master_id = null;
  const { data: existingDesign } = await supabase
    .from('design_masters')
    .select('design_master_id')
    .eq('design_master_code', code.trim())
    .single();

  if (existingDesign) {
    design_master_id = existingDesign.design_master_id;
  } else {
    // Create new design master
    const { data: newDesign, error: designErr } = await supabase
      .from('design_masters')
      .insert([{
        design_master_code: code.trim(),
        design_master_name: name.trim() || code.trim(),
        company_id: company_id || null
      }])
      .select('design_master_id')
      .single();
      
    if (designErr) throw new Error('Error creating design master: ' + designErr.message);
    design_master_id = newDesign.design_master_id;
  }

  // 2. Create mold master
  const insertData: any = {
    mold_master_code: code.trim(),
    mold_master_name: name.trim() || null,
    design_master_id: design_master_id,
    status: 'ACTIVE'
  }

  if (company_id) {
    insertData.company_id = company_id;
  }

  const { error } = await supabase
    .from('mold_masters')
    .insert([insertData])

  if (error) {
    console.error('Error adding mold master:', error)
    throw new Error(error.message)
  }

  revalidatePath('/master/mold')
  redirect('/master/mold')
}

// ========================================================
// QUERY: Lấy chi tiết Khuôn Gốc (Mold Master)
// ========================================================
export async function getMoldBaseDetail(moldMasterId: string) {
  const supabase = await createClient()

  // 1. Lấy thông tin cơ bản
  const { data: moldBase, error: baseError } = await supabase
    .from('mold_masters')
    .select(`
      *,
      companies ( company_code, company_name )
    `)
    .eq('mold_master_id', moldMasterId)
    .single()

  if (baseError) {
    return { moldBase: null, revisions: [], error: baseError.message }
  }

  // 2. Lấy danh sách Revision
  const { data: revisions, error: revError } = await supabase
    .from('mold_revisions')
    .select(`
      *,
      mold_designs (*)
    `)
    .eq('mold_master_id', moldMasterId)
    .order('created_at', { ascending: true })

  return {
    moldBase,
    revisions: revisions || [],
    derivedMolds: [], // Simplified for now
    error: revError?.message || null,
  }
}

export interface UnifiedMoldPayload {
  // Base
  code: string
  name?: string
  company_id?: string
  mold_class?: string
  base_notes?: string

  // Design
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
  piece_count?: number | null
  
  // Physical
  physical_code?: string
  cav_type_id?: string
  rack_layer_id?: string
  status?: string
  keeper_company?: string
  physical_notes?: string

  // IDs
  existing_base_id?: string
  existing_revision_id?: string
  existing_physical_id?: string
  create_new_revision?: boolean
}

export async function upsertUnifiedMold(payload: UnifiedMoldPayload): Promise<{ success: boolean; error?: string; base_id?: string }> {
  try {
    const supabase = await createClient()

    // ── Step 1: Upsert design_masters and mold_masters ──
    let baseId = payload.existing_base_id
    
    let designMasterId = null;
    if (!baseId) {
        // Find or create design master
        const { data: existingDesign } = await supabase.from('design_masters').select('design_master_id').eq('design_master_code', payload.code).single();
        if (existingDesign) designMasterId = existingDesign.design_master_id;
        else {
            const { data: nd, error: de } = await supabase.from('design_masters').insert([{ design_master_code: payload.code, design_master_name: payload.name || payload.code, company_id: payload.company_id }]).select('design_master_id').single();
            if (de) throw new Error(de.message);
            designMasterId = nd.design_master_id;
        }
    }

    const baseData: Record<string, any> = {
      mold_master_code: payload.code,
      mold_master_name: payload.name || payload.code,
      mold_class: payload.mold_class || 'STD',
      notes: payload.base_notes || null,
    }
    
    if (payload.company_id) baseData.company_id = payload.company_id;

    if (baseId) {
      const { error } = await supabase.from('mold_masters').update(baseData).eq('mold_master_id', baseId)
      if (error) throw new Error(error.message)
    } else {
      baseData.design_master_id = designMasterId;
      const { data, error } = await supabase.from('mold_masters').insert(baseData).select('mold_master_id').single()
      if (error) throw new Error(error.message)
      baseId = data.mold_master_id
    }

    // ── Step 2: Upsert mold_designs and mold_revisions ──
    let revisionId = payload.existing_revision_id
    const shouldCreateNewRevision = payload.create_new_revision || !revisionId

    const designData: Record<string, any> = {
      design_code: `${payload.code}-D-${Date.now()}`, // Temporary unique code
      cutline_x_mm: payload.cutline_x ?? null,
      cutline_y_mm: payload.cutline_y ?? null,
      corner_r: payload.corner_r || null,
      chamfer_c: payload.chamfer_c || null,
      pocket_numbers: payload.pocket_numbers ?? null,
      pitch_mm: payload.pitch ?? null,
      under_angle: payload.under_angle || null,
      mold_orientation: payload.mold_orientation || null,
      mold_setup_type: payload.mold_setup_type || null,
      piece_count: payload.piece_count ?? null,
    }

    if (shouldCreateNewRevision) {
      // 1. Insert Design
      if(payload.company_id) designData.company_id = payload.company_id;
      const { data: newDesign, error: dErr } = await supabase.from('mold_designs').insert(designData).select('design_id').single()
      if (dErr) throw new Error(dErr.message)

      // 2. Insert Revision
      const { count } = await supabase.from('mold_revisions').select('*', { count: 'exact', head: true }).eq('mold_master_id', baseId!)
      const versionNum = (count || 0) + 1
      
      const revData = {
          mold_master_id: baseId,
          design_id: newDesign.design_id,
          revision_code: `${payload.code}-R${String(versionNum).padStart(2, '0')}`,
          revision_name: `R${versionNum}`
      };

      const { data, error } = await supabase.from('mold_revisions').insert(revData).select('revision_id').single()
      if (error) throw new Error(error.message)
      revisionId = data.revision_id
    } else {
       // We skip design update for now to keep it simple, or we can fetch design_id and update it.
       // For this massive refactor, we just assume new revisions are created.
    }

    // ── Step 3: Upsert physical_molds ──
    if (payload.physical_code || payload.existing_physical_id) {
      const physicalData: Record<string, any> = {
        mold_revision_id: revisionId,
        system_code: payload.physical_code || payload.code,
        display_name: payload.physical_code || payload.code,
        cav_type_id: payload.cav_type_id || null,
        device_status: payload.status || 'ACTIVE',
        keeper_company_id: payload.keeper_company || null,
      }

      if (payload.rack_layer_id) {
        physicalData.current_rack_layer_id = payload.rack_layer_id
      }

      if (payload.existing_physical_id) {
        const { error } = await supabase.from('physical_molds').update(physicalData).eq('physical_mold_id', payload.existing_physical_id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('physical_molds').insert(physicalData)
        if (error) throw new Error(error.message)
      }
    }

    revalidatePath('/tooling/molds')
    return { success: true, base_id: baseId! }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}
