/**
 * GET  /api/master/companies/[id]  — Lấy chi tiết
 * PATCH /api/master/companies/[id] — Cập nhật
 * DELETE /api/master/companies/[id] — Xóa mềm (is_active = false)
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('companies').select('*').eq('company_id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()

    const supabase = await createClient()
    const updates: Record<string, any> = {}

    // Chỉ cập nhật các trường được gửi lên
    const ALLOWED = ['company_code','company_name','company_name_romaji','company_type','tel','fax','address','order_folder_path','cad_folder_path','parent_company_id','is_active','notes','legacy_id']
    for (const key of ALLOWED) {
      if (key in body) updates[key] = body[key]
    }
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('companies')
      // @ts-ignore
      .update(updates)
      .eq('company_id', id)
      .select('company_id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { error } = await supabase
    .from('companies')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('company_id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
