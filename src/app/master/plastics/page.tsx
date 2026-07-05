// @ts-nocheck
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Package, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'
import { SearchBox } from '@/components/ui/SearchBox'
import { Pagination } from '@/components/ui/Pagination'

export type PlasticMaster = {
  id: string
  code: string
  family: string
  thickness_mm: number
  width_mm: number
  color: string | null
  grade: string | null
  density_g_cm3: number | null
  reorder_point_kg: number
  is_active: boolean
}

const PAGE_SIZE = 50

export default async function PlasticMasterPage(props: {
  searchParams?: Promise<{ q?: string; page?: string; family?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  const page = Math.max(1, Number(searchParams?.page) || 1)
  const familyFilter = searchParams?.family || 'all'
  const showAll = familyFilter === 'all'

  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let dbQuery = supabase
    .from('plastic_master')
    .select('*', { count: 'exact' })

  // Filter theo Family
  if (!showAll) {
    dbQuery = dbQuery.eq('family', familyFilter)
  }

  // Server-side search
  if (query) {
    dbQuery = dbQuery.or(`code.ilike.%${query}%,family.ilike.%${query}%`)
  }

  const { data: plastics, count, error } = await dbQuery
    .order('code', { ascending: true })
    .range(from, to)

  const totalRecords = count ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Package size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="ja" style={{ fontSize: 16 }}>プラ材料マスター</span>
            <span className="vi" style={{ fontSize: 11 }}>Danh mục Vật tư Nhựa</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Suspense fallback={<div style={{ width: 250, height: 36, background: 'var(--bg-surface-2)', borderRadius: 4 }} />}>
            <SearchBox placeholder="Tìm mã hoặc family..." />
          </Suspense>
          <Link href="/master/plastics/new">
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
              href={`/master/plastics?q=${query}&family=all`}
              className={`tab-item ${showAll ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span className="tab-ja">全て</span>
              <span className="tab-vi">Tất cả {showAll && `(${totalRecords})`}</span>
            </Link>
            <Link 
              href={`/master/plastics?q=${query}&family=PS`}
              className={`tab-item ${familyFilter === 'PS' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span className="tab-ja">PS</span>
              <span className="tab-vi">Nhựa PS {familyFilter === 'PS' && `(${totalRecords})`}</span>
            </Link>
            <Link 
              href={`/master/plastics?q=${query}&family=PP`}
              className={`tab-item ${familyFilter === 'PP' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span className="tab-ja">PP</span>
              <span className="tab-vi">Nhựa PP {familyFilter === 'PP' && `(${totalRecords})`}</span>
            </Link>
            <Link 
              href={`/master/plastics?q=${query}&family=PET`}
              className={`tab-item ${familyFilter === 'PET' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span className="tab-ja">PET</span>
              <span className="tab-vi">Nhựa PET {familyFilter === 'PET' && `(${totalRecords})`}</span>
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
                <th style={{ width: 180 }}>
                  <span className="ja">材料コード</span>
                  <span className="vi">Mã Nhựa</span>
                </th>
                <th style={{ width: 120 }}>
                  <span className="ja">寸法</span>
                  <span className="vi">Family</span>
                </th>
                <th style={{ width: 150 }}>
                  <span className="ja">厚×幅(mm)</span>
                  <span className="vi">Dày x Khổ</span>
                </th>
                <th style={{ width: 150 }}>
                  <span className="ja">色/Grade</span>
                  <span className="vi">Màu / Grade</span>
                </th>
                <th style={{ width: 150, textAlign: 'right' }}>
                  <span className="ja">発注点 (kg)</span>
                  <span className="vi">Min. Stock</span>
                </th>
                <th style={{ width: 120, textAlign: 'center' }}>
                  <span className="ja">状態</span>
                  <span className="vi">Trạng thái</span>
                </th>
                <th style={{ width: 60, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={7} style={{ padding: 16, color: 'var(--status-error)' }}>
                    Lỗi dữ liệu: {error.message}
                  </td>
                </tr>
              )}
              {!error && (!plastics || plastics.length === 0) && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    チE�Eタがありません / Không có dữ liệu
                  </td>
                </tr>
              )}
              {plastics?.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/master/plastics/${item.id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 13, textDecoration: 'none' }} className="hover:underline">
                      {item.code}
                    </Link>
                  </td>
                  <td>
                    <span className="badge badge--neutral">
                      {item.family}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>
                    {item.thickness_mm} <span style={{ color: 'var(--text-muted)' }}>x </span> {item.width_mm}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {item.color || '-'} {item.grade ? <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({item.grade})</span> : ''}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {item.reorder_point_kg > 0 ? item.reorder_point_kg.toLocaleString() : '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${item.is_active ? 'badge--success' : 'badge--neutral'}`}>
                      {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/master/plastics/${item.id}`} style={{ color: 'var(--text-muted)', display: 'inline-flex', padding: 4 }}>
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
            baseUrl={`/master/plastics?q=${encodeURIComponent(query)}&family=${familyFilter}`}
          />
        </div>
      </div>
    </div>
  )
}
