import { createClient } from '@/lib/supabase/server'
import { Briefcase } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { WorkOrderFilterBar } from './_components/WorkOrderFilterBar'
import { WorkOrderTable } from './_components/WorkOrderTable'
import { Pagination } from '@/components/ui/Pagination'

export const dynamic = 'force-dynamic'

export default async function WorkOrdersPage(props: { searchParams: Promise<{ search?: string, status?: string, type?: string, page?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const t = await getTranslations('WorkOrders')

  const PAGE_SIZE = 50
  const currentPage = parseInt(searchParams.page || '1', 10)
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('work_orders')
    .select(`
      wo_id, wo_code, wo_name, wo_type, wo_status, start_date, deadline, priority, company_id, product_id,
      companies (company_name),
      products (product_name, company_id, companies!products_company_id_fkey (company_name))
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.search) {
    query = query.ilike('wo_code', `%${searchParams.search}%`)
  }
  if (searchParams.status) {
    query = query.eq('wo_status', searchParams.status)
  }
  if (searchParams.type) {
    query = query.eq('wo_type', searchParams.type)
  }

  const { data: wos, count, error } = await query
  const totalItems = count || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '16px 20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Briefcase size={20} color="var(--accent)" />
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            {t('title')}
          </h1>
        </div>
        <a href="/production/work-orders/new" className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
          <Briefcase size={16} />
          <span>{t('new')}</span>
        </a>
      </div>

      {/* FilterBar */}
      <WorkOrderFilterBar 
        initialSearch={searchParams.search} 
        initialStatus={searchParams.status}
        initialType={searchParams.type}
      />

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px', paddingBottom: 20 }}>
        <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <WorkOrderTable data={wos || []} />
          
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
