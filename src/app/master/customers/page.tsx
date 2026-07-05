// @ts-nocheck
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Users, Edit, X, Search, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'
import { SearchBox } from '@/components/ui/SearchBox'
import { Pagination } from '@/components/ui/Pagination'

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

  const { data: companies, count, error } = await dbQuery
    .order('company_code', { ascending: true })
    .range(from, to)

  const totalRecords = count ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Users size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="ja" style={{ fontSize: 16 }}>顧客・会社マスター</span>
            <span className="vi" style={{ fontSize: 11 }}>Danh mục Công ty / Khách hàng</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Suspense fallback={<div style={{ width: 250, height: 36, background: 'var(--bg-surface-2)', borderRadius: 4 }} />}>
            <SearchBox placeholder="Tìm mã hoặc tên KH..." historyKey='search_customers' />
          </Suspense>
          <Link href="/master/customers/new">
            <button className="btn btn-primary">
              <Plus size={14} />
              <span className="ja" style={{ fontFamily: 'var(--font-jp)' }}>新規登録</span>
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
              <span className="tab-ja">全て</span>
              <span className="tab-vi">Tất cả {showAll && `(${totalRecords})`}</span>
            </Link>
            <Link 
              href={`/master/customers?q=${query}&type=CUSTOMER`}
              className={`tab-item ${typeFilter === 'CUSTOMER' && !showAll ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span className="tab-ja">顧客</span>
              <span className="tab-vi">Khách hàng {typeFilter === 'CUSTOMER' && !showAll && `(${totalRecords})`}</span>
            </Link>
            <Link 
              href={`/master/customers?q=${query}&type=VENDOR`}
              className={`tab-item ${typeFilter === 'VENDOR' && !showAll ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span className="tab-ja">仕入先</span>
              <span className="tab-vi">Nhà cung cấp {typeFilter === 'VENDOR' && !showAll && `(${totalRecords})`}</span>
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
                <th style={{ width: 140 }}>
                  <span className="ja">顧客コード</span>
                  <span className="vi">Mã KH</span>
                </th>
                <th style={{ width: 300 }}>
                  <span className="ja">会社名</span>
                  <span className="vi">Tên công ty</span>
                </th>
                <th style={{ width: 180 }}>
                  <span className="ja">種別</span>
                  <span className="vi">Loại</span>
                </th>
                <th style={{ width: 140 }}>
                  <span className="ja">電話番号</span>
                  <span className="vi">Điện thoại</span>
                </th>
                <th style={{ width: 60, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: 'var(--status-error)' }}>
                    Lỗi dữ liệu: {error.message}
                  </td>
                </tr>
              )}
              {!error && (!companies || companies.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    データがありません / Không có dữ liệu
                  </td>
                </tr>
              )}
              {companies?.map((item: Company) => (
                <tr key={item.company_id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Link href={`/master/customers/${item.company_id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 13, textDecoration: 'none' }} className="hover:underline">
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
                      <span style={{ fontWeight: 600 }}>{item.company_name}</span>
                      {item.company_name_romaji && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.company_name_romaji}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.company_type?.map((t: string) => (
                        <span key={t} className={
                          t === 'CUSTOMER' ? 'badge badge--info' :
                          t === 'VENDOR' ? 'badge badge--warning' :
                          'badge badge--neutral'
                        }>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {item.tel || '—'}
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
