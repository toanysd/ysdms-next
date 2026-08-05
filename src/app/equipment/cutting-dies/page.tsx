export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import CuttersClient from './_components/CuttersClient'

export const metadata = {
  title: '抜型管理 | YSDMS Next-Gen',
}

export const revalidate = 0

export default async function CuttersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const page = parseInt((params.page as string) || '1')
  const q = (params.q as string) || ''
  const PAGE_SIZE = 50

  // 1. Fetch Cutters from equipment table
  let query = supabase
    .from('equipment')
    .select(`
      *,
      companies!equipment_company_id_fkey (
        company_id,
        company_name,
        company_code
      ),
      design_revisions (
        revision_id,
        design_code
      )
    `, { count: 'exact' })
    .in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE'])
    .order('created_at', { ascending: false })

  if (q.trim()) {
    query = query.or(`equipment_code.ilike.%${q}%,display_name.ilike.%${q}%`)
  }

  // Pagination
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data: rawCutters, count } = await query

  const cutters = (rawCutters || []).map((c: any) => ({
    ...c,
    cutter_id: c.equipment_id,
    cutter_no: c.equipment_code,
    cutter_name: c.display_name,
    cutter_type: c.sub_type,
    cutter_length_mm: c.actual_length_mm ? Number(c.actual_length_mm) : null,
    cutter_width_mm: c.actual_width_mm ? Number(c.actual_width_mm) : null,
    cutter_height_mm: c.actual_height_mm ? Number(c.actual_height_mm) : null,
    companies: c.companies ? { company_short_name: c.companies.company_code } : null,
    mold_designs: c.design_revisions ? { design_code: c.design_revisions.design_code } : null
  }))

  // 2. Fetch Companies (Customers)
  const { data: rawCompanies } = await supabase
    .from('companies')
    .select('company_id, company_name, company_code, company_type')
    .eq('is_active', true)
    .order('company_code', { ascending: true })

  const companies = (rawCompanies || [])
    .filter((c: any) => c.company_type?.includes('CUSTOMER'))
    .map(c => ({
      company_id: c.company_id,
      company_name: c.company_name,
      company_short_name: c.company_code
    }))

  // 3. Fetch Mold Designs
  const { data: rawDesigns } = await supabase
    .from('design_revisions')
    .select('revision_id, design_code')
    .order('created_at', { ascending: false })

  const moldDesigns = (rawDesigns || []).map(d => ({
    design_id: d.revision_id,
    design_code: d.design_code
  }))

  return (
    <CuttersClient 
      initialCutters={cutters || []} 
      companies={companies || []}
      moldDesigns={moldDesigns || []}
      totalRecords={count || 0}
      initialPage={page}
      initialSearch={q}
    />
  )
}
