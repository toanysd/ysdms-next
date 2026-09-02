export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Plus, Search, Calendar, Briefcase, ChevronRight, Hash } from 'lucide-react'
import Link from 'next/link'

export default async function WorkOrdersPage(props: { searchParams: Promise<{ search?: string, status?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  let query = supabase
    .from('work_orders')
    .select(`
      wo_id, wo_code, wo_name, wo_status, wo_type, priority, deadline,
      products (product_code, product_name),
      companies (company_name)
    `)
    .order('created_at', { ascending: false })

  if (searchParams.search) {
    query = query.ilike('wo_code', `%${searchParams.search}%`)
  }
  if (searchParams.status) {
    query = query.eq('wo_status', searchParams.status)
  }

  const { data: wos, error } = await query

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'PLANNED': return <span className="badge badge--info font-bold">PLANNED</span>
      case 'IN_PROGRESS': return <span className="badge badge--warning font-bold">IN PROGRESS</span>
      case 'COMPLETED': return <span className="badge badge--success font-bold">COMPLETED</span>
      case 'CANCELLED': return <span className="badge badge--neutral font-bold">CANCELLED</span>
      default: return <span className="badge badge--neutral font-bold">{st}</span>
    }
  }

  const getPriorityBadge = (p: number) => {
    if (p <= 2) return <span className="badge badge--error font-bold" style={{ fontSize: 10 }}>URGENT</span>
    if (p <= 4) return <span className="badge badge--warning font-bold" style={{ fontSize: 10 }}>HIGH</span>
    return <span className="badge badge--neutral font-bold" style={{ fontSize: 10 }}>NORMAL</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '16px 20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Briefcase size={20} color="var(--accent)" />
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            Lệnh Sản Xuất (Work Orders)
          </h1>
        </div>
        <Link href="/production/work-orders/new">
          <button className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
            <Plus size={16} />
            <span>Tạo Mới (New WO)</span>
          </button>
        </Link>
      </div>

      {/* FilterBar */}
      <div style={{ flexShrink: 0, padding: '0 20px', display: 'flex', gap: 12 }}>
        <div className="relative" style={{ width: 250 }}>
          <Search className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            className="form-input form-input-search" 
            placeholder="Tìm theo mã WO..." 
            defaultValue={searchParams.search}
          />
        </div>
        <select className="form-input" style={{ width: 150 }} defaultValue={searchParams.status || ''}>
          <option value="">Tất cả trạng thái</option>
          <option value="PLANNED">PLANNED</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px', paddingBottom: 20 }}>
        <div className="card-flat">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Mã Lệnh (WO Code)</th>
                <th style={{ width: '25%' }}>Tên Lệnh / Sản Phẩm</th>
                <th style={{ width: '20%' }}>Khách Hàng (Customer)</th>
                <th style={{ width: '10%' }}>Loại (Type)</th>
                <th style={{ width: '10%' }}>Mức Độ (Pri)</th>
                <th style={{ width: '10%' }}>Trạng Thái</th>
                <th style={{ width: '10%' }}>Hạn Chót</th>
              </tr>
            </thead>
            <tbody>
              {(!wos || wos.length === 0) ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '64px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <Briefcase size={48} color="var(--border-default)" />
                      <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 14 }}>Chưa có lệnh sản xuất nào</p>
                      <Link href="/production/work-orders/new">
                        <button className="btn btn-secondary flex items-center gap-1.5 cursor-pointer mt-2">
                          <Plus size={14} />
                          Tạo Lệnh Sản Xuất Đầu Tiên
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                wos.map((wo: any) => (
                  <tr key={wo.wo_id}>
                    <td>
                      <Link href={`/production/work-orders/${wo.wo_id}`} style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Hash size={14} />
                        {wo.wo_code}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{wo.wo_name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{wo.products?.product_code || '-'}</span>
                      </div>
                    </td>
                    <td>{wo.companies?.company_name || '-'}</td>
                    <td>
                      <span className="badge badge--neutral">{wo.wo_type}</span>
                    </td>
                    <td>
                      {getPriorityBadge(wo.priority)}
                    </td>
                    <td>
                      {getStatusBadge(wo.wo_status)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                          {wo.deadline ? new Date(wo.deadline).toISOString().split('T')[0] : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
