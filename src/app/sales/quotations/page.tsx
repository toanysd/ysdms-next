import { createClient } from '@/lib/supabase/server'
import { FileText, Plus } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { QuotationFilterBar } from './_components/QuotationFilterBar'
import { QuotationTable } from './_components/QuotationTable'
import { Pagination } from '@/components/ui/Pagination'

export const dynamic = 'force-dynamic'

export default async function QuotationsPage(props: { searchParams: Promise<{ search?: string, status?: string, page?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const t = await getTranslations('Quotations')

  const PAGE_SIZE = 50
  const currentPage = parseInt(searchParams.page || '1', 10)
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('quotations')
    .select(`
      quotation_id, quotation_no, quotation_type, status, quote_date, valid_until, total_amount, company_id, case_id,
      companies (company_name),
      business_cases (case_code, title)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.search) {
    const searchTerm = `%${searchParams.search}%`
    
    // Step 1: find matching company IDs
    const { data: matchedCompanies } = await supabase
      .from('companies')
      .select('company_id')
      .ilike('company_name', searchTerm)
      
    const matchedCompanyIds = matchedCompanies?.map(c => c.company_id) || []
    
    // Step 2: apply to main query
    if (matchedCompanyIds.length > 0) {
      query = query.or(`quotation_no.ilike.${searchTerm},company_id.in.(${matchedCompanyIds.join(',')})`)
    } else {
      query = query.ilike('quotation_no', searchTerm)
    }
  }
  
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: quotes, count, error } = await query
  const totalItems = count || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '16px 20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText size={20} color="var(--accent)" />
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            {t('title')}
          </h1>
        </div>
        <Link href="/sales/quotations/new" className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
          <Plus size={16} />
          <span>{t('new')}</span>
        </Link>
      </div>

      {/* FilterBar */}
      <QuotationFilterBar 
        initialSearch={searchParams.search} 
        initialStatus={searchParams.status}
      />

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px', paddingBottom: 20 }}>
        <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <QuotationTable data={quotes || []} />
          
          <div className="mt-auto pt-4 pb-2 border-t px-4">
            <Pagination 
              currentPage={currentPage}
              totalRecords={totalItems}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
