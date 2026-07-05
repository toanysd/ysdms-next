'use server'

import { createClient } from '@/lib/supabase/server'
import { ProductMasterFormValues } from '@/lib/validations/master'

export async function searchProducts(query: string) {
  if (!query || query.length < 2) return []

  const supabase = await createClient()

  console.log(`\n[🚀 API SEARCH] Bắt đầu tìm Khay với từ khóa: "${query}"`)

  const { data, error } = await supabase
    .from('products')
    .select(`
      product_id,
      product_code,
      product_name,
      product_name_internal,
      customer_product_name,
      notes,
      legacy_specs
    `)
    .or(`product_code.ilike.%${query}%,product_name.ilike.%${query}%`)
    .order('product_code', { ascending: true })
    .limit(20)

  if (error) {
    console.error("[❌ API SEARCH ERROR] Supabase nổ lỗi:", error)
    return []
  }

  console.log(`[🎯 API SEARCH OK] Đã tìm thấy ${data?.length} dòng Khay cho "${query}"`)

  return data?.map(d => {
    const specs = d.legacy_specs as any

    return {
      id: d.product_id,
      pn: d.product_code,
      customer_part_number: d.customer_product_name || '',
      product_name: d.product_name || d.product_name_internal || '',
      material: specs?.material || '',
      thickness: specs?.thickness || 0,
      length_val: specs?.length_val || 0,
      width_val: specs?.width_val || 0,
      mold_code: d.product_code || ''
    }
  }) || []
}

export async function addProductAction(formData: FormData) {
  throw new Error("addProductAction is deprecated and not implemented in V3")
}

export async function upsertProductAction(data: ProductMasterFormValues) {
  throw new Error("upsertProductAction is deprecated and not implemented in V3")
}
