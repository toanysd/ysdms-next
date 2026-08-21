import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || ''
  
  const supabase = await createClient()

  let query = supabase
    .from('employees')
    .select('employee_id, employee_name, employee_code')
    .eq('is_active', true)
    .order('employee_name')

  if (q) {
    query = query.ilike('employee_name', `%${q}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const options = (data || []).map((e) => ({
    value: e.employee_id,
    label: e.employee_name,
    sublabel: e.employee_code || undefined
  }))

  return NextResponse.json(options)
}
