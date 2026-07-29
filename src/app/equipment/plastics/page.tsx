export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import PlasticsClientPage from './_components/PlasticsClientPage'

const PAGE_SIZE = 50

export default async function PlasticsPage(props: {
  searchParams?: Promise<{ q?: string; page?: string; sort?: string; dir?: string }>
}) {
  const supabase = await createClient()
  const searchParams = await props.searchParams
  const q = searchParams?.q || ''
  const page = Math.max(1, Number(searchParams?.page) || 1)
  const sort = searchParams?.sort || 'created_at'
  const dir = searchParams?.dir || 'desc'

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Fetch plastic masters
  const { data: masters } = await supabase
    .from('plastic_master')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch rolls
  let rollsQuery = supabase
    .from('plastic_receipt_roll')
    .select('*, plastic_master(*)', { count: 'exact' })

  if (q) {
    rollsQuery = rollsQuery.or(`roll_barcode.ilike.%${q}%`)
  }

  rollsQuery = rollsQuery.order(sort, { ascending: dir === 'asc' }).range(from, to)

  const { data: rolls, count } = await rollsQuery

  // Fetch jobs for dropdown
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, products(*)')
    .order('created_at', { ascending: false })
    .limit(100)
    
  // Fetch machines to get feed_length_mm
  const { data: machines } = await supabase
    .from('machines')
    .select('*')
    .order('created_at', { ascending: false })
    
  return (
    <PlasticsClientPage 
      masters={masters || []} 
      rolls={rolls || []} 
      jobs={jobs || []} 
      machines={machines || []}
      totalCount={count || 0}
      currentPage={page}
    />
  )
}
