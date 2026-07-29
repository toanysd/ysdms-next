export const dynamic = 'force-dynamic'

// @ts-nocheck
import { getTranslations } from 'next-intl/server'
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
  const t = await getTranslations('Master')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let dbQuery = supabase
    .from('plastic_master')
    .select('id:plastic_id, code:plastic_code, family:plastic_family, thickness_mm, width_mm, color, is_active, status_review', { count: 'exact' })

  // Filter theo Family
  if (!showAll) {
    dbQuery = dbQuery.eq('plastic_family', familyFilter)
  }

  // Server-side search
  if (query) {
    dbQuery = dbQuery.or(`plastic_code.ilike.%${query}%,plastic_family.ilike.%${query}%`)
  }

  const { data: plastics, count, error } = await dbQuery
    .order('plastic_code', { ascending: true })
    .range(from, to)

  const totalRecords = count ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Package size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {t('Master.danhMucVatTuNhua')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Suspense fallback={<div style={{ width: 250, height: 36, background: 'var(--bg-surface-2)', borderRadius: 4 }} />}>
            <SearchBox placeholder="Tìm mã hoặc family..." />
          </Suspense>
          <Link href="/master/plastics/new">
            <button className="btn btn-primary">
              <Plus size={14} />
              {t('Master.maNhua')}
            </button>
          </Link>
        </div>
      </div>

      <div className="card-flat" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 150 }}>
                  {t('Master.maNhua')}
                </th>
                <th style={{ width: 120 }}>
                  {t('Master.family')}
                </th>
                <th style={{ width: 150 }}>
                  {t('Master.dayXKho')}
                </th>
                <th style={{ width: 150 }}>
                  {t('Master.mauGrade')}
                </th>
                <th style={{ width: 150, textAlign: 'right' }}>
                  {t('Master.minStock')}
                </th>
                <th style={{ width: 120, textAlign: 'center' }}>
                  {t('Master.trangThai')}
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
