'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ========================================================
// ACTION 1: Thêm Khuôn gốc mới (Base Mold) — Tầng 1
// ========================================================
export async function addMoldBaseAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const customer_id = formData.get('customer_id') as string

  // Clean data
  const insertData: any = {
    code: code.trim(),
    name: name.trim() || null,
    is_active: true
  }
  
  if (customer_id) {
    insertData.customer_id = customer_id;
  }

  const { error } = await supabase
    .from('mold_base')
    .insert([insertData])

  if (error) {
    console.error('Error adding mold base:', error)
    throw new Error(error.message)
  }

  // Cập nhật lại cache cho trang danh sách
  revalidatePath('/master/mold')
  
  // Trở về trang danh sách
  redirect('/master/mold')
}

// ========================================================
// ACTION 2: Thêm Phiên bản Thiết kế mới (Revision) — Tầng 2
// ========================================================
export async function addRevisionAction(formData: FormData) {
  const supabase = await createClient()

  const moldBaseId = formData.get('mold_base_id') as string
  const moldBaseCode = formData.get('mold_base_code') as string
  const versionLabel = (formData.get('version_label') as string).trim()
  const approvedDate = formData.get('approved_date') as string

  // Tự động sinh revision_code bằng cách nối Mã Gốc + Dấu gạch ngang + Nhãn
  // VD: JAE-001 + R1 => JAE-001-R1
  const revisionCode = `${moldBaseCode}-${versionLabel}`

  const insertData: any = {
    mold_base_id: moldBaseId,
    revision_code: revisionCode,
    version_label: versionLabel,
  }

  if (approvedDate) {
    insertData.approved_date = approvedDate
  }

  const { error } = await supabase
    .from('mold_design_revision')
    .insert([insertData])

  if (error) {
    console.error('Error adding revision:', error)
    throw new Error(error.message)
  }

  // Revalidate trang chi tiết khuôn
  revalidatePath(`/master/mold/${moldBaseId}`)

  // Trở về trang chi tiết khuôn
  redirect(`/master/mold/${moldBaseId}`)
}

// ========================================================
// QUERY: Lấy chi tiết Khuôn Gốc kèm Phả hệ bản D + Revisions
// ========================================================
export async function getMoldBaseDetail(moldBaseId: string) {
  const supabase = await createClient()

  // 1. Lấy thông tin cơ bản của Khuôn Gốc + JOIN Customer + Prototype (bản D)
  const { data: moldBase, error: baseError } = await supabase
    .from('mold_base')
    .select(`
      *,
      customers ( code, name ),
      prototype:mold_base!prototype_base_id ( id, code, name )
    `)
    .eq('id', moldBaseId)
    .single()

  if (baseError) {
    return { moldBase: null, revisions: [], error: baseError.message }
  }

  // 2. Lấy danh sách các Revision của Khuôn này
  const { data: revisions, error: revError } = await supabase
    .from('mold_design_revision')
    .select('*')
    .eq('mold_base_id', moldBaseId)
    .order('created_at', { ascending: true })

  // 3. Kiểm tra xem có khuôn nào khai phả hệ ngược lại (Con cháu kế thừa từ mình) không
  const { data: derivedMolds } = await supabase
    .from('mold_base')
    .select('id, code, name')
    .eq('prototype_base_id', moldBaseId)

  return {
    moldBase,
    revisions: revisions || [],
    derivedMolds: derivedMolds || [],
    error: revError?.message || null,
  }
}

// ========================================================
// QUERY: Gợi ý Label tiếp theo cho Revision (Soft Suggest)
// ========================================================
export async function suggestNextRevisionLabel(moldBaseId: string) {
  const supabase = await createClient()

  const { data: revisions } = await supabase
    .from('mold_design_revision')
    .select('version_label')
    .eq('mold_base_id', moldBaseId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!revisions || revisions.length === 0) {
    // Chưa có bản nào => Gợi ý R1
    return 'R1'
  }

  const lastLabel = revisions[0].version_label
  // Phân tích nhãn cuối: Nếu dạng R[N] thì +1
  const rMatch = lastLabel.match(/^R(\d+)$/i)
  if (rMatch) {
    return `R${parseInt(rMatch[1], 10) + 1}`
  }

  // Nếu dạng NO[N] hoặc TYPE[N]
  const noMatch = lastLabel.match(/^(NO|TYPE)(\d+)$/i)
  if (noMatch) {
    return `${noMatch[1].toUpperCase()}${parseInt(noMatch[2], 10) + 1}`
  }

  // Không nhận diện được pattern, không gợi ý gì
  return ''
}
