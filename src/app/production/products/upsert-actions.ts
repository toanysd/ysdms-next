'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UnifiedTrayPayload {
  // Section 1: Tray / Product Info
  tray_code: string
  tray_name: string
  company_id?: string
  customer_id?: string
  plastic_id?: string
  
  // Section 2: Design Data (Will spawn a Mold Base & Revision)
  mold_code?: string
  cutline_x?: number | null
  cutline_y?: number | null
  cavity?: number
  piece_count?: number | null
  pocket_numbers?: number | null
  pitch?: number | null

  // Meta
  existing_product_id?: string
  create_new_revision?: boolean
}

export async function upsertUnifiedTray(payload: UnifiedTrayPayload): Promise<{ success: boolean; error?: string; product_id?: string }> {
  try {
    const supabase = await createClient()

    const companyId = payload.company_id || payload.customer_id
    if (!companyId) {
      throw new Error("company_id is required to upsert products/mold")
    }

    // ── Step 1: Upsert products ──
    let productId = payload.existing_product_id

    const productData = {
      product_code: payload.tray_code,
      product_name: payload.tray_name,
      company_id: companyId,
    }

    if (productId) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('product_id', productId)
      if (error) throw new Error(`products update failed: ${error.message}`)
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select('product_id')
        .single()
      if (error) throw new Error(`products insert failed: ${error.message}`)
      productId = data.product_id
    }

    // ── Step 2: Auto-generate Design Revision & Mold Revision if mold_code is provided ──
    // (mold_masters table DROPPED - link design_revisions and mold_revisions directly via product_id)
    if (payload.mold_code) {
      // 2.1 Upsert Design Revision (using product_id instead of mold_master_id)
      const { data: existingDesign } = await supabase
        .from('design_revisions')
        .select('revision_id')
        .eq('product_id', productId!)
        .limit(1)
        .maybeSingle()

      let designRevisionId: string

      const designData = {
        product_id: productId!,
        cutline_length: payload.cutline_x ?? null,
        cutline_width: payload.cutline_y ?? null,
        cavity_count: payload.cavity ?? null,
        pocket_numbers: payload.pocket_numbers ?? null,
        cavity_pitch_mm: payload.pitch ?? null,
        design_code: `${payload.mold_code}-DR`
      }

      if (existingDesign) {
        designRevisionId = existingDesign.revision_id
        const { error: designErr } = await supabase
          .from('design_revisions')
          .update(designData)
          .eq('revision_id', designRevisionId)
        if (designErr) throw new Error(`design_revisions update failed: ${designErr.message}`)
      } else {
        const { data: newDesign, error: designErr } = await supabase
          .from('design_revisions')
          .insert(designData)
          .select('revision_id')
          .single()
        if (designErr) throw new Error(`design_revisions insert failed: ${designErr.message}`)
        designRevisionId = newDesign.revision_id
      }

      // 2.2 Upsert Mold Revision (using product_id instead of mold_master_id)
      const { data: latestRev } = await supabase
        .from('mold_revisions')
        .select('revision_id')
        .eq('product_id', productId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      let revisionId: string

      const revisionData = {
        product_id: productId!,
        design_revision_id: designRevisionId,
        revision_name: `Revision`
      }

      if (latestRev && !payload.create_new_revision) {
        revisionId = latestRev.revision_id
        const { error: revErr } = await supabase
          .from('mold_revisions')
          .update(revisionData)
          .eq('revision_id', revisionId)
        if (revErr) throw new Error(`mold_revisions update failed: ${revErr.message}`)
      } else {
        // Create new
        const { count } = await supabase
          .from('mold_revisions')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', productId!)

        const versionNum = (count || 0) + 1
        const finalRevData = {
          ...revisionData,
          revision_code: `${payload.mold_code}-R${String(versionNum).padStart(2, '0')}`,
          revision_name: `Revision R${versionNum}`
        }

        const { data: newRev, error: revErr } = await supabase
          .from('mold_revisions')
          .insert(finalRevData)
          .select('revision_id')
          .single()
        if (revErr) throw new Error(`mold_revisions insert failed: ${revErr.message}`)
        revisionId = newRev.revision_id
      }

      // 2.3 If Plastic ID is provided, link via product_material_specs
      // TODO: Phase 2 - migrate mold_material_bom to product-based linking
    }

    revalidatePath('/production/products')
    return { success: true, product_id: productId! }
  } catch (err) {
    console.error('[upsertUnifiedTray]', err)
    return { success: false, error: (err as Error).message }
  }
}
