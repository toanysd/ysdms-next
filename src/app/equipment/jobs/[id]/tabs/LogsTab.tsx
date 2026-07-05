import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Clock, User, Briefcase, Loader2, Calendar } from 'lucide-react'
import { WorklogModal } from '@/components/equipment/WorklogModal'

type WorklogRow = {
  log_id: string
  job_id: string
  job_step_id: string | null
  employee_id: string
  work_date: string
  processing_code_id: number | null
  description: string | null
  hours_spent: number | null
  notes: string | null
  employees: { employee_name: string } | null
  job_steps: { step_name: string; step_no: number } | null
  processing_codes: { processing_name: string } | null
}

export function LogsTab({ job, onRefresh }: { job: any; onRefresh: () => void }) {
  const supabase = createClient()
  const [logs, setLogs] = useState<WorklogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<any | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('work_logs')
      .select(`
        *,
        employees(employee_name),
        job_steps(step_name, step_no),
        processing_codes(processing_name)
      `)
      .eq('job_id', job.job_id)
      .order('work_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else setLogs(data as any[])
    setLoading(false)
  }, [job.job_id, supabase])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleDelete = async (logId: string) => {
    if (!window.confirm('このログを削除しますか？ / Bạn có chắc muốn xóa nhật ký này?')) return
    const { error: err } = await supabase.from('work_logs').delete().eq('log_id', logId)
    if (err) alert(err.message)
    else {
      fetchLogs()
      onRefresh() // Refresh job to update actual_hours if needed
    }
  }

  // ─── Aggregations ───
  const { totalHours, hoursByStep, hoursByWorker } = useMemo(() => {
    let total = 0
    const byStep: Record<string, number> = {}
    const byWorker: Record<string, number> = {}

    logs.forEach(log => {
      const hrs = log.hours_spent || 0
      total += hrs
      
      const stepKey = log.job_steps?.step_name || 'Khác (Không rõ)'
      byStep[stepKey] = (byStep[stepKey] || 0) + hrs

      const workerKey = log.employees?.employee_name || 'Unknown'
      byWorker[workerKey] = (byWorker[workerKey] || 0) + hrs
    })

    return { totalHours: total, hoursByStep: byStep, hoursByWorker: byWorker }
  }, [logs])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', height: '100%' }}>
      {/* ─── Header & Summaries ─── */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        
        {/* Total Overview Card */}
        <div className="card-flat" style={{ padding: '16px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={16} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>総作業時間</h3>
            </div>
            <button
              className="btn btn-primary"
              style={{ height: 28, padding: '0 10px', fontSize: 11 }}
              onClick={() => { setEditingLog(null); setModalOpen(true); }}
            >
              <Plus size={12} />
              <span style={{ fontFamily: 'var(--font-jp)' }}>ログ追加</span>
            </button>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
            {totalHours.toFixed(2)} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>h</span>
          </div>
        </div>

        {/* Breakdown by Step */}
        <div className="card-flat" style={{ padding: '16px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Briefcase size={14} style={{ color: 'var(--text-secondary)' }} />
            <h3 style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>工程別 (Theo công đoạn)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 80, overflowY: 'auto' }} className="custom-scrollbar">
            {Object.entries(hoursByStep).map(([step, hrs]) => (
              <div key={step} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-jp)' }}>{step}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{hrs.toFixed(2)}h</span>
              </div>
            ))}
            {Object.keys(hoursByStep).length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>データなし</div>}
          </div>
        </div>

        {/* Breakdown by Worker */}
        <div className="card-flat" style={{ padding: '16px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <User size={14} style={{ color: 'var(--text-secondary)' }} />
            <h3 style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>作業者別 (Theo nhân sự)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 80, overflowY: 'auto' }} className="custom-scrollbar">
            {Object.entries(hoursByWorker).map(([worker, hrs]) => (
              <div key={worker} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-jp)' }}>{worker}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{hrs.toFixed(2)}h</span>
              </div>
            ))}
            {Object.keys(hoursByWorker).length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>データなし</div>}
          </div>
        </div>
      </div>

      {/* ─── Detailed Table ─── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>作業詳細ログ (Chi tiết nhật ký)</div>
          {loading && <Loader2 size={14} className="animate-spin text-[var(--accent)]" />}
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
          <table className="data-table">
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-surface-2)', zIndex: 1 }}>
              <tr>
                <th style={{ width: 100 }}>作業日</th>
                <th style={{ width: 120 }}>作業者</th>
                <th style={{ width: 150 }}>工程</th>
                <th style={{ width: 200 }}>作業内容 (Thao tác)</th>
                <th style={{ width: 80 }}>時間(h)</th>
                <th>備考</th>
                <th style={{ width: 80 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {!loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
                    データがありません / Không có nhật ký nào
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.log_id}>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontSize: 11 }}>
                        <Calendar size={10} style={{ color: 'var(--text-muted)' }} />
                        {new Date(log.work_date).toLocaleDateString('ja-JP')}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontFamily: 'var(--font-jp)', fontSize: 12 }}>
                      {log.employees?.employee_name || '—'}
                    </td>
                    <td>
                      {log.job_steps ? (
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-jp)' }}>
                          {log.job_steps.step_no != null ? `${log.job_steps.step_no}. ` : ''}{log.job_steps.step_name}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-jp)' }}>
                          {log.description || log.processing_codes?.processing_name || '—'}
                        </span>
                        {log.processing_codes && log.description && log.description !== log.processing_codes.processing_name && (
                          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                            Mã: {log.processing_codes.processing_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                      {log.hours_spent != null ? log.hours_spent.toFixed(2) : '0.00'}
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {log.notes || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => { setEditingLog(log); setModalOpen(true); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                          title="Sửa"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(log.log_id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-error)' }}
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <WorklogModal
          jobId={job.job_id}
          jobSteps={job.job_steps || []}
          initialData={editingLog}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false)
            fetchLogs()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}
