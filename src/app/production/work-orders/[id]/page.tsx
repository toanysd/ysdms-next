export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, ArrowUpFromLine, Calendar, Hash, CheckCircle2, Play, Edit2, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ConfirmWoButton } from './_components/ConfirmWoButton'

export default async function WorkOrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: wo } = await supabase
    .from('work_orders')
    .select(`
      *,
      products (product_code, product_name),
      companies (company_name),
      jobs (
        job_id, job_code, job_name, job_category, job_status, equipment_id
      )
    `)
    .eq('wo_id', params.id)
    .single()

  if (!wo) {
    notFound()
  }

  const jobs = wo.jobs || []
  
  const statuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  const currentIndex = wo.wo_status === 'CANCELLED' ? 3 : statuses.indexOf(wo.wo_status)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── BackBar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/production/work-orders" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
              <ArrowLeft size={14} />
              戻る
            </Link>
            <Link href="/production/work-orders" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
              <ArrowUpFromLine size={14} />
              一覧
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Hash size={20} color="var(--accent)" />
              {wo.wo_code}
            </h1>
            <span className={`badge ${wo.wo_status === 'COMPLETED' ? 'badge--success' : (wo.wo_status === 'IN_PROGRESS' ? 'badge--warning' : 'badge--info')} font-bold`}>
              {wo.wo_status}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            className="btn btn-secondary flex items-center gap-1.5"
            disabled={wo.wo_status !== 'PLANNED'}
            style={{ opacity: wo.wo_status !== 'PLANNED' ? 0.5 : 1, cursor: wo.wo_status !== 'PLANNED' ? 'not-allowed' : 'pointer' }}
          >
            <Edit2 size={14} />
            <span>Sửa Lệnh</span>
          </button>
          
          <ConfirmWoButton woId={wo.wo_id} status={wo.wo_status} />
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px', display: 'flex', gap: 16 }}>
        
        {/* LEFT COLUMN: WO Info & Jobs */}
        <div style={{ flex: '7', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div className="card-flat" style={{ padding: 20 }}>
            <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>Thông Tin Lệnh Sản Xuất</h2>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Tên Lệnh / Sản Phẩm</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{wo.wo_name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{wo.products?.product_code} - {wo.products?.product_name}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Khách Hàng</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{wo.companies?.company_name || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Loại Lệnh (Type)</p>
                <span className="badge badge--neutral font-bold">{wo.wo_type}</span>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Hạn Chót (Deadline)</p>
                <span style={{ fontSize: 14, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <Calendar size={16} color="var(--accent)" />
                  {wo.deadline ? new Date(wo.deadline).toISOString().split('T')[0] : '-'}
                </span>
              </div>
              <div className="col-span-2">
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Ghi Chú</p>
                <div style={{ fontSize: 13, whiteSpace: 'pre-wrap', background: 'var(--bg-surface-2)', padding: 12, borderRadius: 6 }}>
                  {wo.notes || <span style={{ color: 'var(--text-muted)' }}>Không có ghi chú</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="card-flat" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Danh Sách Jobs Gia Công ({jobs.length})</h2>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Mã Job</th>
                  <th style={{ width: '40%' }}>Tên Job / Thiết Bị</th>
                  <th style={{ width: '20%' }}>Phân Loại</th>
                  <th style={{ width: '20%' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '64px 0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <Briefcase size={40} color="var(--border-default)" />
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 13 }}>
                          Lệnh này chưa được xác nhận để sinh Jobs.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job: any) => (
                    <tr key={job.job_id}>
                      <td>
                        <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace' }}>
                          {job.job_code}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{job.job_name}</span>
                      </td>
                      <td>
                        <span className="badge badge--neutral">{job.job_category}</span>
                      </td>
                      <td>
                        <span className="badge badge--neutral font-bold">{job.job_status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT COLUMN: Timeline & Status Flow */}
        <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-flat" style={{ padding: 20 }}>
            <h2 className="text-[14px] font-bold mb-6" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>Tiến Độ (Lifecycle)</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: 8 }}>
              {statuses.map((st, i) => {
                const isPast = i < currentIndex;
                const isCurrent = i === currentIndex;
                const isFuture = i > currentIndex;
                
                let color = 'var(--text-muted)'
                if (isCurrent) color = 'var(--accent)'
                if (isPast) color = 'var(--status-success)'
                if (wo.wo_status === 'CANCELLED' && st === 'CANCELLED') color = 'var(--status-error)'

                return (
                  <div key={st} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
                    {/* Vertical Line */}
                    {i < statuses.length - 1 && (
                      <div style={{ 
                        position: 'absolute', 
                        left: 11, 
                        top: 24, 
                        bottom: -24, 
                        width: 2, 
                        background: isPast ? 'var(--status-success)' : 'var(--border-default)',
                        zIndex: 1
                      }} />
                    )}
                    
                    {/* Circle Indicator */}
                    <div style={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      background: isCurrent ? 'var(--tint-teal-bg)' : (isPast ? 'var(--status-success)' : 'var(--bg-surface-2)'),
                      border: `2px solid ${isCurrent ? 'var(--accent)' : (isPast ? 'var(--status-success)' : 'var(--border-default)')}`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      zIndex: 2,
                      flexShrink: 0
                    }}>
                      {isPast && <CheckCircle2 size={14} color="white" />}
                    </div>

                    {/* Text */}
                    <div style={{ paddingTop: 2 }}>
                      <p style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 600, color }}>{st}</p>
                      {isCurrent && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Trạng thái hiện tại</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
