export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Users, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'
import { SearchBox } from '@/components/ui/SearchBox'
import { Pagination } from '@/components/ui/Pagination'
import { getTranslations } from 'next-intl/server'

export type Company = {
  company_id: string
  company_code: string
  company_name: string
  company_name_romaji: string | null
  company_type: string[] | null
  tel: string | null
  is_active: boolean
  parent_company_id: string | null
  legacy_id: string | null
}

const PAGE_SIZE = 50

export default async function CustomersPage(props: {
  searchParams?: Promise<{ q?: string; page?: string; type?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  const page = Math.max(1, Number(searchParams?.page) || 1)
  const typeFilter = searchParams?.type || 'CUSTOMER'
  const showAll = typeFilter === 'all'

  const t = await getTranslations('Customers')
  const tMaster = await getTranslations('Master')
  const tCommon = await getTranslations('Common')

  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let dbQuery = supabase
    .from('companies')
    .select('company_id, company_code, company_name, company_name_romaji, company_type, tel, is_active, parent_company_id, legacy_id', { count: 'exact' })

  // Filter theo loại (default = CUSTOMER)
  if (!showAll) {
    dbQuery = dbQuery.contains('company_type', [typeFilter])
  }

  // Server-side search
  if (query) {
    dbQuery = dbQuery.or(`company_code.ilike.%${query}%,company_name.ilike.%${query}%,company_name_romaji.ilike.%${query}%`)
  }

  let { data: companies, count, error } = await dbQuery
    .order('company_code', { ascending: true })
    .range(from, to)

  // Fix: Nếu range vượt quá kết quả (lỗi 416), retry với page 1
  if (error?.message?.includes('range not satisfiable') || error?.code === 'PGRST103') {
    const retryDbQuery = supabase
      .from('companies')
      .select('company_id, company_code, company_name, company_name_romaji, company_type, tel, is_active, parent_company_id, legacy_id', { count: 'exact' })
    let finalQuery = retryDbQuery
    if (!showAll) {
      finalQuery = finalQuery.contains('company_type', [typeFilter])
    }
    if (query) {
      finalQuery = finalQuery.or(`company_code.ilike.%${query}%,company_name.ilike.%${query}%,company_name_romaji.ilike.%${query}%`)
    }
    const retryRes = await finalQuery
      .order('company_code', { ascending: true })
      .range(0, PAGE_SIZE - 1)
    companies = retryRes.data
    count = retryRes.count
    error = retryRes.error
  }

  const totalRecords = count ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Users size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>{t('title')}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Suspense fallback={<div style={{ width: 250, height: 36, background: 'var(--bg-surface-2)', borderRadius: 4 }} />}>
            <SearchBox placeholder={tMaster('searchCompany')} historyKey='search_customers' />
          </Suspense>
          <Link href="/master/customers/new">
            <button className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} />
              <span>{tCommon('addNew')}</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── Filters Section ── */}
      <div className="form-section" style={{ flexShrink: 0, marginBottom: 0 }}>
        <div className="form-section-body">
          <div className="tab-nav" style={{ margin: '-14px -14px -14px', background: 'var(--bg-surface)' }}>
            <Link 
              href={`/master/customers?q=${query}&type=all`}
              className={`tab-item ${showAll ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>{tCommon('all')} {showAll && `(${totalRecords})`}</span>
            </Link>
            <Link 
              href={`/master/customers?q=${query}&type=CUSTOMER`}
              className={`tab-item ${typeFilter === 'CUSTOMER' && !showAll ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>{t('customer')} {typeFilter === 'CUSTOMER' && !showAll && `(${totalRecords})`}</span>
            </Link>
            <Link 
              href={`/master/customers?q=${query}&type=VENDOR`}
              className={`tab-item ${typeFilter === 'VENDOR' && !showAll ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>{t('vendor')} {typeFilter === 'VENDOR' && !showAll && `(${totalRecords})`}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('customerCode')}</th>
                <th>{t('companyName')}</th>
                <th className="hidden md:table-cell">{t('companyNameRomaji')}</th>
                <th>{t('type')}</th>
                <th className="hidden lg:table-cell">{t('tel')}</th>
                <th style={{ textAlign: 'center' }}>{tCommon('status')}</th>
                <th style={{ textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={7} style={{ padding: 16, color: 'var(--status-error)' }}>
                    {error.message}
                  </td>
                </tr>
              )}
              {!error && (!companies || companies.length === 0) && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    {tCommon('noData')}
                  </td>
                </tr>
              )}
              {companies?.map((item: any) => (
                <tr key={item.company_id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Link href={`/master/customers/${item.company_id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 800, fontSize: 13, textDecoration: 'none' }} className="hover:underline">
                        {item.company_code}
                      </Link>
                      {item.legacy_id && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {item.legacy_id}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.company_name}</span>
                      {item.company_name_romaji && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.company_name_romaji}</span>
                      )}
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.company_name_romaji || '—'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.company_type?.map((tVal: string) => (
                        <span key={tVal} className={
                          tVal === 'CUSTOMER' ? 'badge badge--info font-bold' :
                          tVal === 'VENDOR' ? 'badge badge--warning font-bold' :
                          'badge badge--neutral font-bold'
                        }>
                          {tVal}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell font-mono text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    {item.tel || '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${item.is_active ? 'badge--success' : 'badge--neutral'}`}>
                      {item.is_active ? tMaster('activeStatus') : tMaster('inactiveStatus')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/master/customers/${item.company_id}`} style={{ color: 'var(--text-muted)', display: 'inline-flex', padding: 4 }}>
                      <ChevronRight size={16} />
                    </Link>
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
            baseUrl={`/master/customers?q=${encodeURIComponent(query)}&type=${typeFilter}`}
          />
        </div>
      </div>
    </div>
  )
}

