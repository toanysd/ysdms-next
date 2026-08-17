import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/companies/search
 * Search endpoint for companies table.
 *
 * Query params:
 * - q (string, optional) - search term across company_code, company_name, company_name_romaji
 * - code (string, optional) - search by company_code prefix specifically
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')?.trim() || ''
    const code = searchParams.get('code')?.trim() || ''

    const supabase = await createClient()

    let query = supabase
      .from('companies')
      .select('company_id, company_code, company_name, company_name_romaji')
      .eq('is_active', true)

    if (code) {
      query = query.ilike('company_code', `${code}%`)
    }

    if (q) {
      query = query.or(`company_code.ilike.%${q}%,company_name.ilike.%${q}%,company_name_romaji.ilike.%${q}%`)
    }

    const { data, error } = await query
      .order('company_code', { ascending: true })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 })
  }
}
