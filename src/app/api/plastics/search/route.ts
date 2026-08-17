import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/plastics/search
 * Search endpoint for plastic_master table.
 *
 * Query params:
 * - q (string, optional) - search term (searches plastic_code, plastic_family, plastic_subtype)
 * - family (string, optional) - filter by plastic_family (e.g. 'PET', 'PP')
 * - thickness (number, optional) - filter by thickness_mm
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')?.trim() || ''
    const family = searchParams.get('family')?.trim() || ''
    const thickness = searchParams.get('thickness')?.trim() || ''

    const supabase = await createClient()

    let query = supabase
      .from('plastic_master')
      .select('*')
      .eq('is_active', true)

    if (q) {
      query = query.or(`plastic_code.ilike.%${q}%,plastic_family.ilike.%${q}%,plastic_subtype.ilike.%${q}%`)
    }

    if (family) {
      query = query.eq('plastic_family', family)
    }

    if (thickness) {
      const thicknessNum = parseFloat(thickness)
      if (!isNaN(thicknessNum)) {
        query = query.eq('thickness_mm', thicknessNum)
      }
    }

    const { data, error } = await query
      .order('plastic_code', { ascending: true })
      .limit(30)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 })
  }
}
