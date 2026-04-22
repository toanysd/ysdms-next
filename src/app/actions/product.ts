'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function searchProducts(query: string) {
  if (!query || query.length < 2) return []

  const supabase = await createClient()

  console.log(`\n[🚀 API SEARCH] Bắt đầu tìm Khay với từ khóa: "${query}"`)

  const { data, error } = await supabase
    .from('product_master')
    .select('id, code, customer_code, name, remarks, material, thickness, length_val, width_val, sheet_width')
    .or(`code.ilike.%${query}%,customer_code.ilike.%${query}%,name.ilike.%${query}%`)
    .order('code', { ascending: true })
    .limit(20)

  if (error) {
    console.error("[❌ API SEARCH ERROR] Supabase nổ lỗi:", error)
    return []
  }

  console.log(`[🎯 API SEARCH OK] Đã tìm thấy ${data?.length} dòng Khay cho "${query}"`)

  // Nếu có data thì in ra dòng đầu tiên để debug
  if (data && data.length > 0) {
    console.log(`[✅ SAMPLE] First Item: `, JSON.stringify(data[0]))
  }

  // Fetch mold mapping for these products
  const productIds = data.map(d => d.id)
  const { data: moldMappings } = await (supabase as any)
    .from('product_mold_map')
    .select(`
        product_id,
        mold_design_revision (
            mold_physical ( physical_code )
        )
    `)
    .in('product_id', productIds)

  // Map lại để khớp với Interface Frontend (pn, product_name)
  return data?.map(d => {
    // Tìm mã Physical Khuôn (nếu có)
    const mapping = moldMappings?.find((m: any) => m.product_id === d.id)
    let moldCode = ''
    if (mapping && mapping.mold_design_revision && mapping.mold_design_revision.mold_physical) {
      const physicals = mapping.mold_design_revision.mold_physical
      if (Array.isArray(physicals) && physicals.length > 0) {
        moldCode = physicals[0].physical_code
      } else if (!Array.isArray(physicals) && physicals.physical_code) {
        moldCode = physicals.physical_code
      }
    }

    return {
      id: d.id,
      pn: d.code,
      customer_code: d.customer_code || '',
      product_name: d.name || '',
      material: d.material || '',
      thickness: d.thickness || 0,
      length_val: d.length_val || 0,
      width_val: d.width_val || 0,
      mold_code: moldCode
    }
  }) || []
}

export async function addProductAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const name = formData.get('name') as string || ''
  const customer_code = formData.get('customer_code') as string || null
  const material = formData.get('material') as string || null
  
  const thicknessStr = formData.get('thickness') as string
  const thickness = thicknessStr ? parseFloat(thicknessStr) : null
  
  const sheet_widthStr = formData.get('sheet_width') as string
  const sheet_width = sheet_widthStr ? parseFloat(sheet_widthStr) : null
  
  const length_valStr = formData.get('length_val') as string
  const length_val = length_valStr ? parseFloat(length_valStr) : null
  
  const length_tol_upperStr = formData.get('length_tol_upper') as string
  const length_tol_upper = length_tol_upperStr ? parseFloat(length_tol_upperStr) : null
  
  const length_tol_lowerStr = formData.get('length_tol_lower') as string
  const length_tol_lower = length_tol_lowerStr ? parseFloat(length_tol_lowerStr) : null

  const width_valStr = formData.get('width_val') as string
  const width_val = width_valStr ? parseFloat(width_valStr) : null
  
  const width_tol_upperStr = formData.get('width_tol_upper') as string
  const width_tol_upper = width_tol_upperStr ? parseFloat(width_tol_upperStr) : null
  
  const width_tol_lowerStr = formData.get('width_tol_lower') as string
  const width_tol_lower = width_tol_lowerStr ? parseFloat(width_tol_lowerStr) : null
  
  const antistatic = formData.get('antistatic') === 'on'
  const silicone = formData.get('silicone') === 'on'
  const coating = formData.get('coating') === 'on'
  
  const qtyStr = formData.get('quantity_per_box') as string
  const quantity_per_box = qtyStr ? parseInt(qtyStr, 10) : null
  
  const remarks = formData.get('remarks') as string || null
  const is_active = formData.get('is_active') === 'on'

  const { error } = await supabase.from('product_master').insert({
    code,
    name,
    customer_code,
    material,
    thickness,
    sheet_width,
    length_val,
    length_tol_upper,
    length_tol_lower,
    width_val,
    width_tol_upper,
    width_tol_lower,
    antistatic,
    silicone,
    coating,
    quantity_per_box,
    remarks,
    is_active
  })

  if (error) {
    console.error('Lỗi khi thêm Khay (Product):', error)
    throw new Error('Lỗi khi thêm Khay: ' + error.message)
  }

  revalidatePath('/master/product')
  redirect('/master/product')
}
