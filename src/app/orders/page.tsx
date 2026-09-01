import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Plus, PackageSearch, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Pagination } from '@/components/ui/Pagination'
import { SearchBox } from '@/components/ui/SearchBox'
import { Suspense } from 'react'

const PAGE_SIZE = 50

export default async function OrdersListPage(props: {
  searchParams?: Promise<{ q?: string; tab?: string; page?: string }>
}) {
  const tMaster = await getTranslations('Master')
  const tCommon = await getTranslations('Common')
  const sp = await props.searchParams
  
  const query = sp?.q || ''
  const activeTab = sp?.tab || 'ALL'
  const page = parseInt(sp?.page || '1', 10)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let dbQuery = supabase
    .from('orders')
    .select('order_id, order_no, order_date, requested_delivery, order_status, companies!inner(company_name, company_code)', { count: 'exact' })

  if (activeTab !== 'ALL') {
    dbQuery = dbQuery.eq('order_status', activeTab)
  }

  if (query) {
    dbQuery = dbQuery.or(`order_no.ilike.%${query}%,companies.company_name.ilike.%${query}%,companies.company_code.ilike.%${query}%`)
  }

  const { data: orders, count, error } = await dbQuery
    .order('order_date', { ascending: false })
    .range(from, to)

  const totalRecords = count || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── PageHeader ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Package size={20} style={{ color: 'var(--accent)' }} />
          <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>Quản lý Đơn hàng (Khay)</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Suspense fallback={<div style={{ width: 250, height: 36, background: 'var(--bg-surface-2)', borderRadius: 4 }} />}>
            <SearchBox placeholder={tMaster('searchCompany') + ' / Mã ĐH'} historyKey='search_orders' />
          </Suspense>
          <Link href="/orders/new">
            <button className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} />
              <span>{tCommon('addNew')}</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── FilterBar / TabBar ── */}
      <div className="form-section" style={{ flexShrink: 0, marginBottom: 0 }}>
        <div className="form-section-body">
          <div className="tab-nav" style={{ margin: '-14px -14px -14px', background: 'var(--bg-surface)' }}>
            {['ALL', 'DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'CLOSED'].map(tab => (
              <Link
                key={tab}
                href={`/orders?q=${encodeURIComponent(query)}&tab=${tab}`}
                className={`tab-item ${activeTab === tab ? 'tab-item--active' : ''}`}
                style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
              >
                <span style={{ fontWeight: 700 }}>
                  {tab === 'ALL' ? tCommon('all') : tab} {activeTab === tab && `(${totalRecords})`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Ngày giao (Yêu cầu)</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr><td colSpan={5} style={{ padding: 16, color: 'var(--status-error)' }}>{error.message}</td></tr>
              )}
              {!error && (!orders || orders.length === 0) && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>{tCommon('noData')}</td></tr>
              )}
              {orders?.map((item: any) => (
                <tr key={item.order_id}>
                  <td>
                    <Link href={`/orders/${item.order_id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 800, fontSize: 13, textDecoration: 'none' }} className="hover:underline">
                      {item.order_no}
                    </Link>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.companies?.company_name}</span>
                  </td>
                  <td className="font-mono text-[13px] text-slate-600">
                    {item.order_date ? new Date(item.order_date).toLocaleDateString('ja-JP') : '—'}
                  </td>
                  <td className="font-mono text-[13px] text-slate-600">
                    {item.requested_delivery ? new Date(item.requested_delivery).toLocaleDateString('ja-JP') : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge font-bold ${
                      item.order_status === 'CONFIRMED' ? 'badge--info' :
                      item.order_status === 'IN_PRODUCTION' ? 'badge--warning' :
                      item.order_status === 'SHIPPED' ? 'badge--success' :
                      item.order_status === 'CLOSED' ? 'badge--neutral' :
                      'badge--neutral'
                    }`}>
                      {item.order_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
          <Pagination
            currentPage={page}
            totalRecords={totalRecords}
            pageSize={PAGE_SIZE}
            baseUrl={`/orders?q=${encodeURIComponent(query)}&tab=${activeTab}`}
          />
        </div>
      </div>
    </div>
  )
}
