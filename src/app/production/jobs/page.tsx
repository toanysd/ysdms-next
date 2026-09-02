export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Search, Briefcase, Hash, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function JobsPage(props: { searchParams: Promise<{ search?: string, status?: string, category?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select(`
      job_id, job_code, job_name, job_status, job_category, deadline, estimated_hours,
      work_orders ( wo_code )
    `)
    .order('deadline', { ascending: true })

  if (searchParams.search) {
    // If we want to search by wo_code, we can't easily do it via standard text ilike on joined table in one go without specifying foreign table column, but let's just search job_code or job_name instead, or use a specific filter.
    // Assuming search is for job_code or work order code.
    query = query.ilike('job_code', `%${searchParams.search}%`)
  }
  if (searchParams.status) {
    query = query.eq('job_status', searchParams.status)
  }
  if (searchParams.category) {
    query = query.eq('job_category', searchParams.category)
  }

  const { data: jobs, error } = await query

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
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '16px 20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Briefcase size={20} color="var(--accent)" />
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            Chỉ Thị Công Việc (Jobs)
          </h1>
        </div>
      </div>

      {/* FilterBar */}
      <div style={{ flexShrink: 0, padding: '0 20px', display: 'flex', gap: 12 }}>
        <div className="relative" style={{ width: 250 }}>
          <Search className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            className="form-input form-input-search" 
            placeholder="Tìm mã Job..." 
            defaultValue={searchParams.search}
          />
        </div>
        <select className="form-input" style={{ width: 180 }} defaultValue={searchParams.status || ''}>
          <option value="">Tất cả trạng thái</option>
          <option value="PLANNED">PLANNED</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <select className="form-input" style={{ width: 220 }} defaultValue={searchParams.category || ''}>
          <option value="">Tất cả danh mục (Category)</option>
          <option value="MOLD_NEW">MOLD_NEW</option>
          <option value="CUTTER_NEW">CUTTER_NEW</option>
          <option value="EQUIPMENT_NEW">EQUIPMENT_NEW</option>
        </select>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px', paddingBottom: 20 }}>
        <div className="card-flat">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Mã Job</th>
                <th style={{ width: '25%' }}>Tên Job (Job Name)</th>
                <th style={{ width: '15%' }}>Mã WO (Work Order)</th>
                <th style={{ width: '15%' }}>Danh Mục (Category)</th>
                <th style={{ width: '15%' }}>Trạng Thái</th>
                <th style={{ width: '15%' }}>Hạn Chót (Deadline)</th>
              </tr>
            </thead>
            <tbody>
              {(!jobs || jobs.length === 0) ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '64px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <Briefcase size={48} color="var(--border-default)" />
                      <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 14 }}>Chưa có Job nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job: any) => (
                  <tr key={job.job_id}>
                    <td>
                      <Link href={`/production/jobs/${job.job_id}`} style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Hash size={14} />
                        {job.job_code}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 600 }}>{job.job_name || '-'}</td>
                    <td>
                      {job.work_orders?.wo_code ? (
                        <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {job.work_orders.wo_code}
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      <span className="badge badge--neutral">{job.job_category || '-'}</span>
                    </td>
                    <td>
                      {getStatusBadge(job.job_status)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                          {job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '-'}
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
