import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/search/companies?q=JAE&type=CUSTOMER&limit=20
 *
 * RULE-DATA-6: API route chuẩn cho Async Dropdown.
 * Response: { data: [{value, label, sublabel}], total: number }
 *
 * Params:
 * - q: search query (optional)
 * - type: filter theo company_type, VD: CUSTOMER, VENDOR (optional = tất cả)
 * - limit: số kết quả tối đa (default 20, max 50)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const type = searchParams.get('type') || ''
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20))

  const supabase = await createClient()

  let query = supabase
    .from('companies')
    .select('company_id, company_code, company_name, company_type', { count: 'exact' })
    .eq('is_active', true)

  if (type) {
    query = query.contains('company_type', [type])
  }

  if (q) {
    query = query.or(`company_code.ilike.%${q}%,company_name.ilike.%${q}%`)
  }

  const { data, count, error } = await query
    .order('company_code')
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data: (data ?? []).map(c => ({
      value: c.company_id,
      label: `${c.company_code} — ${c.company_name}`,
      sublabel: (c.company_type as string[])?.join(', ') ?? '',
    })),
    total: count ?? 0,
  })
}
