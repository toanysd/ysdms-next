/**
 * POST /api/master/companies
 * Tạo mới một công ty
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.company_code?.trim()) return NextResponse.json({ error: 'company_code is required' }, { status: 400 })
    if (!body.company_name?.trim()) return NextResponse.json({ error: 'company_name is required' }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('companies')
      .insert({
        company_code:        body.company_code.trim(),
        company_name:        body.company_name.trim(),
        company_name_romaji: body.company_name_romaji || null,
        company_type:        body.company_type || ['CUSTOMER'],
        tel:                 body.tel || null,
        fax:                 body.fax || null,
        address:             body.address || null,
        order_folder_path:   body.order_folder_path || null,
        cad_folder_path:     body.cad_folder_path || null,
        parent_company_id:   body.parent_company_id || null,
        is_active:           body.is_active ?? true,
        notes:               body.notes || null,
        legacy_id:           body.legacy_id || null,
      })
      .select('company_id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
