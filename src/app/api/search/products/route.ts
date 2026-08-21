import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('product_id, product_code, product_name_internal')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (q) {
    // Search by product_code or product_name_internal
    query = query.or(`product_code.ilike.%${q}%,product_name_internal.ilike.%${q}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const options = (data || []).map((p) => ({
    value: p.product_id,
    label: p.product_code,
    sublabel: p.product_name_internal || undefined
  }))

  return NextResponse.json(options)
}
