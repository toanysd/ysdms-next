import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Database, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import { SearchBox } from '@/components/ui/SearchBox'
import { Pagination } from '@/components/ui/Pagination'

const PAGE_SIZE = 50

export default async function RollsPage(props: {
  searchParams?: Promise<{ q?: string; page?: string; status?: string; family?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  const page = Math.max(1, Number(searchParams?.page) || 1)
  const statusFilter = searchParams?.status || 'all'
  const familyFilter = searchParams?.family || 'all'
  
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let dbQuery = supabase
    .from('plastic_receipt_roll')
    .select(`
      id,
      roll_barcode,
      current_length_m,
      status,
      location,
      plastic_master!inner (
        plastic_code,
        plastic_family,
        thickness_mm,
        width_mm
      )
    `, { count: 'exact' })

  if (statusFilter !== 'all') {
    dbQuery = dbQuery.eq('status', statusFilter)
  }
  if (familyFilter !== 'all') {
    dbQuery = dbQuery.eq('plastic_master.plastic_family', familyFilter)
  }
  if (query) {
    dbQuery = dbQuery.ilike('roll_barcode', `%${query}%`)
  }

  const { data: rolls, count, error } = await dbQuery
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalRecords = count ?? 0

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'in_stock': return { label: '在庫 / In Stock', badgeClass: 'badge--success', icon: CheckCircle }
      case 'in_use': return { label: '使用中 / In Use', badgeClass: 'badge--warning', icon: Clock }
      case 'empty': return { label: '空 / Empty', badgeClass: 'badge--neutral', icon: XCircle }
      case 'returned': return { label: '返品 / Returned', badgeClass: 'badge--error', icon: AlertCircle }
      default: return { label: status, badgeClass: 'badge--neutral', icon: AlertCircle }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Database size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
              ロール在庫管理 (Rolls Inventory)
            </h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Suspense fallback={<div style={{ width: 250, height: 36, background: 'var(--bg-surface-2)', borderRadius: 4 }} />}>
            <SearchBox placeholder="Tìm barcode..." />
          </Suspense>
          <Link href="/warehouse/receipt-new">
            <button className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} />
              <span>Nhập Kho</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="card-flat" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Barcode</th>
                <th>Mã Nhựa (Plastic Code)</th>
                <th>Family</th>
                <th style={{ textAlign: 'right' }}>Dày x Khổ</th>
                <th style={{ textAlign: 'right' }}>Chiều Dài Hiện Tại</th>
                <th style={{ textAlign: 'center' }}>Vị Trí (Location)</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={8} style={{ padding: 16, color: 'var(--status-error)' }}>
                    {error.message}
                  </td>
                </tr>
              )}
              {rolls?.map((item: any) => {
                const plastic = Array.isArray(item.plastic_master) ? item.plastic_master[0] : item.plastic_master
                const st = getStatusConfig(item.status)
                return (
                  <tr key={item.id} className="cursor-pointer hover:bg-slate-50">
                    <td>
                      <Link href={`/warehouse/rolls/${item.id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
                        {item.roll_barcode}
                      </Link>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {plastic?.plastic_code || '-'}
                    </td>
                    <td><span className="badge badge--neutral font-bold">{plastic?.plastic_family || '-'}</span></td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                      {plastic?.thickness_mm} <span style={{ color: 'var(--text-muted)' }}>x </span> {plastic?.width_mm}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, fontSize: 14 }}>
                      {item.current_length_m} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>m</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.location || '-'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${st.badgeClass} flex items-center justify-center gap-1 w-fit mx-auto`}>
                        <st.icon size={12} />
                        {st.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/warehouse/rolls/${item.id}`} style={{ color: 'var(--text-muted)', display: 'inline-flex', padding: 4 }}>
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
          <Pagination currentPage={page} totalRecords={totalRecords} pageSize={PAGE_SIZE} baseUrl={`/warehouse/rolls?q=${encodeURIComponent(query)}`} />
        </div>
      </div>
    </div>
  )
}
