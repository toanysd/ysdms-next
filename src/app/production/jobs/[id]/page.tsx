export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, ArrowUpFromLine, Calendar, Hash, Briefcase, Info, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JobStepsList } from './_components/JobStepsList'

export default async function JobDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  // Fetch job + work_orders + job_steps + work_logs
  const { data: job } = await supabase
    .from('jobs')
    .select(`
      *,
      work_orders (wo_code),
      job_steps (
        *,
        work_logs (*)
      )
    `)
    .eq('job_id', params.id)
    .single()

  if (!job) {
    notFound()
  }

  // Fetch employees for dropdown
  const { data: employees } = await supabase
    .from('employees')
    .select('employee_id, full_name, role')
    .eq('is_active', true)
    .order('full_name')

  // Calculate Progress (Gantt logic from PE)
  const totalSteps = job.job_steps?.length || 0
  const completedSteps = job.job_steps?.filter((s: any) => s.step_status === 'COMPLETED').length || 0
  const stepPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  const targetQty = job.job_steps?.reduce((sum: number, s: any) => sum + (s.quantity ?? 0), 0) || 0
  let producedQty = 0
  job.job_steps?.forEach((step: any) => {
    producedQty += step.work_logs?.reduce((sum: number, log: any) => sum + (log.quantity_done ?? 0), 0) || 0
  })
  const qtyPct = targetQty > 0 ? Math.min(100, Math.round((producedQty / targetQty) * 100)) : null

  const displayPct = qtyPct ?? stepPct

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'PLANNED': return <span className="badge badge--info font-bold">PLANNED</span>
      case 'IN_PROGRESS': return <span className="badge badge--warning font-bold">IN PROGRESS</span>
      case 'COMPLETED': return <span className="badge badge--success font-bold">COMPLETED</span>
      default: return <span className="badge badge--neutral font-bold">{st || '-'}</span>
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── BackBar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/production/jobs" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
              <ArrowLeft size={14} />
              戻る
            </Link>
            <Link href="/production/jobs" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
              <ArrowUpFromLine size={14} />
              一覧
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', fontSize: 16 }}>
              <Hash size={16} />
              {job.job_code}
            </div>
            {getStatusBadge(job.job_status)}
            <span className="badge badge--neutral font-bold">{job.job_category || 'UNCATEGORIZED'}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '0 20px', paddingBottom: 20 }}>
        
        {/* Vùng 1: Info */}
        <div className="card-flat" style={{ display: 'flex', gap: 24, padding: 16 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
              <Info size={14} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Thông Tin Job</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px 12px', fontSize: 13 }}>
              <div style={{ color: 'var(--text-muted)' }}>Tên Job:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{job.job_name || '-'}</div>
              
              <div style={{ color: 'var(--text-muted)' }}>Lệnh SX:</div>
              <div>
                {job.work_orders?.wo_code ? (
                  <Link href={`/production/work-orders/${job.work_order_id}`} style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace' }}>
                    {job.work_orders.wo_code}
                  </Link>
                ) : '-'}
              </div>
              
              <div style={{ color: 'var(--text-muted)' }}>Hạn Chót:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                <Calendar size={12} />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '-'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Vùng 2: Progress */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, borderLeft: '1px solid var(--border-default)', paddingLeft: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={14} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Tiến Độ Job</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Hoàn thành tổng thể</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{displayPct}%</span>
              </div>
              <div style={{ width: '100%', height: 8, backgroundColor: 'var(--border-default)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${displayPct}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.3s' }}></div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Steps Hoàn Thành</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{completedSteps} / {totalSteps}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Số Lượng Sản Xuất</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{producedQty} / {targetQty > 0 ? targetQty : '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vùng 3: Steps Accordion */}
        <JobStepsList job={job} employees={employees || []} />
        
      </div>
    </div>
  )
}
