export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Package, Edit2, Trash2 } from 'lucide-react'
import { Suspense } from 'react'
import { SearchBox } from '@/components/ui/SearchBox'
import { Pagination } from '@/components/ui/Pagination'

const PAGE_SIZE = 50
const FAMILIES = ['PS', 'PET', 'PP', 'A-PET', 'PVC', 'UNKNOWN', 'OTHER', 'DNF']

export default async function PlasticMasterPage(props: {
  searchParams?: Promise<{ q?: string; page?: string; family?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  const page = Math.max(1, Number(searchParams?.page) || 1)
  const familyFilter = searchParams?.family || 'all'
  const showAll = familyFilter === 'all'

  const supabase = await createClient()
  const tMaster = await getTranslations('Master')
  const tCommon = await getTranslations('Common')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let dbQuery = supabase
    .from('plastic_master')
    .select('id:plastic_id, code:plastic_code, family:plastic_family, thickness_mm, width_mm, subtype:plastic_subtype', { count: 'exact' })

  if (!showAll) {
    dbQuery = dbQuery.eq('plastic_family', familyFilter)
  }

  if (query) {
    dbQuery = dbQuery.or(`plastic_code.ilike.%${query}%,plastic_family.ilike.%${query}%,plastic_subtype.ilike.%${query}%`)
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
            <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
              {tMaster('danhMucVatTuNhua')}
            </h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Suspense fallback={<div style={{ width: 250, height: 36, background: 'var(--bg-surface-2)', borderRadius: 4 }} />}>
            <SearchBox placeholder={tMaster('searchCompany')} />
          </Suspense>
          
          <select 
            className="form-select" 
            style={{ width: 120, padding: '6px 12px', fontSize: 13 }}
            defaultValue={familyFilter}
            // in a real Client Component this would push to router. For RSC demo we can leave it as static visual
          >
            <option value="all">Tất cả Family</option>
            {FAMILIES.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          
          <button className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} />
            <span>Thêm Nhanh (Add)</span>
          </button>
        </div>
      </div>

      <div className="card-flat" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Nhựa (Code)</th>
                <th>Family</th>
                <th style={{ textAlign: 'right' }}>Dày x Khổ</th>
                <th>Subtype (Loại con)</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: 'var(--status-error)' }}>
                    {error.message}
                  </td>
                </tr>
              )}
              {!error && (!plastics || plastics.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    {tCommon('noData')}
                  </td>
                </tr>
              )}
              {plastics?.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td>
                    <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 800, fontSize: 13 }}>
                      {item.code}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge--neutral font-bold">
                      {item.family || 'UNKNOWN'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.thickness_mm} <span style={{ color: 'var(--text-muted)' }}>x </span> {item.width_mm}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {item.subtype || '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-slate-500 hover:text-blue-600 transition-colors" title="Sửa (Edit)">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-slate-500 hover:text-red-600 transition-colors" title="Xóa (Delete)">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
