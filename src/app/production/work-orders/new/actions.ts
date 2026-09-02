'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function searchProductsAction(query: string) {
  if (!query || query.length < 2) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('product_id, product_code, product_name, company_id')
    .or(`product_code.ilike.%${query}%,product_name.ilike.%${query}%`)
    .limit(20)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }
  return data
}

export async function getProductDetailsAction(productId: string) {
  const supabase = await createClient()
  
  // Get active design revision
  const { data: rev } = await supabase
    .from('design_revisions')
    .select('revision_id, revision_number')
    .eq('product_id', productId)
    .eq('status', 'APPROVED')
    .single()

  // Get customer info
  const { data: prod } = await supabase
    .from('products')
    .select('company_id, companies!products_company_id_fkey(company_name)')
    .eq('product_id', productId)
    .single()

  return {
    revision_id: rev?.revision_id || null,
    revision_number: rev?.revision_number || null,
    company_id: prod?.company_id || null,
    company_name: (prod?.companies as any)?.company_name || null
  }
}

export async function createWorkOrderAction(payload: any) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Validate
  if (!payload.product_id) return { error: 'Vui lòng chọn Sản phẩm' }
  if (!payload.wo_name) return { error: 'Vui lòng nhập Tên WO' }
  if (!payload.deadline) return { error: 'Vui lòng chọn Hạn chót' }

  // Check unique code
  const { data: existing } = await supabase
    .from('work_orders')
    .select('wo_id')
    .eq('wo_code', payload.wo_code)

  if (existing && existing.length > 0) {
    return { error: 'Mã WO đã tồn tại, vui lòng tải lại trang để lấy mã mới.' }
  }

  const { data, error } = await supabase
    .from('work_orders')
    .insert({
      wo_code: payload.wo_code,
      wo_name: payload.wo_name,
      product_id: payload.product_id,
      design_revision_id: payload.design_revision_id,
      company_id: payload.company_id,
      wo_type: payload.wo_type,
      wo_status: 'PLANNED',
      deadline: payload.deadline,
      priority: payload.priority,
      notes: payload.notes,
      responsible_id: session?.user?.id || null
    })
    .select('wo_id')
    .single()

  if (error) {
    console.error('Error insert WO:', error)
    return { error: `Lỗi tạo WO: ${error.message}` }
  }

  revalidatePath('/production/work-orders')
  return { success: true, woId: data.wo_id }
}
