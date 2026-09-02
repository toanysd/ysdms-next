'use client'

import { useState, useTransition } from 'react'
import { ChevronDown, ChevronRight, Play, CheckCircle2, Clock, Calendar, Save, AlertCircle } from 'lucide-react'
import { startJobAction, addWorkLogAction } from '../../actions'

export function JobStepsList({ job, employees }: { job: any, employees: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  
  const steps = job.job_steps?.sort((a: any, b: any) => a.step_no - b.step_no) || []
  
  const handleStartJob = () => {
    if (!confirm('Bạn có chắc chắn muốn bắt đầu Job này?')) return
    startTransition(async () => {
      const res = await startJobAction(job.job_id)
      if (!res.success) {
        alert('Lỗi: ' + res.error)
      }
    })
  }

  const getStepStatusIcon = (st: string) => {
    if (st === 'COMPLETED') return <CheckCircle2 size={16} className="text-green-600" />
    if (st === 'IN_PROGRESS') return <Play size={16} className="text-orange-500" />
    return <Clock size={16} className="text-slate-400" />
  }

  if (job.job_status === 'PLANNED' && steps.length === 0) {
    return (
      <div className="card-flat" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <AlertCircle size={48} color="var(--text-muted)" />
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Job chưa bắt đầu</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
            Job đang ở trạng thái PLANNED. Hãy nhấn "Bắt Đầu Job" để hệ thống tự động tạo các bước thực hiện (Job Steps).
          </p>
        </div>
        <button 
          className="btn btn-primary flex items-center gap-2 mt-4" 
          onClick={handleStartJob}
          disabled={isPending}
        >
          <Play size={16} />
          <span>{isPending ? 'Đang xử lý...' : 'Bắt Đầu Job'}</span>
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Các Bước Thực Hiện</span>
        <span className="badge badge--neutral">{steps.length} steps</span>
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((step: any) => {
          const isExpanded = expandedStep === step.step_id
          const logs = step.work_logs?.sort((a: any, b: any) => new Date(a.work_date).getTime() - new Date(b.work_date).getTime()) || []
          
          return (
            <div key={step.step_id} className="card-flat" style={{ overflow: 'hidden' }}>
              {/* Accordion Header */}
              <div 
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12, 
                  cursor: 'pointer', background: isExpanded ? 'var(--tint-blue-bg)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid var(--border-default)' : 'none'
                }}
                onClick={() => setExpandedStep(isExpanded ? null : step.step_id)}
              >
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 12, background: 'var(--bg-default)', fontSize: 12, fontWeight: 700, border: '1px solid var(--border-default)' }}>
                  {step.step_no}
                </div>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{step.step_name}</span>
                  <span className="badge badge--neutral" style={{ fontSize: 10 }}>{step.type_code}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
                  {step.quantity > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Mục tiêu</span>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{step.quantity}</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 16, background: 'var(--bg-default)', border: '1px solid var(--border-default)' }}>
                    {getStepStatusIcon(step.step_status)}
                    <span style={{ fontWeight: 600 }}>{step.step_status}</span>
                  </div>
                </div>
              </div>
              
              {/* Accordion Content (Work Logs & Form) */}
              {isExpanded && (
                <div style={{ padding: 16, background: 'var(--bg-default)' }}>
                  
                  {/* Logs Table */}
                  {logs.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>Nhật Ký Thực Hiện (Work Logs)</h4>
                      <table className="data-table" style={{ fontSize: 12 }}>
                        <thead>
                          <tr>
                            <th style={{ width: '20%' }}>Ngày</th>
                            <th style={{ width: '20%' }}>Người Thực Hiện</th>
                            <th style={{ width: '15%' }}>Thời Gian (h)</th>
                            <th style={{ width: '15%' }}>Hoàn Thành (Qty)</th>
                            <th style={{ width: '30%' }}>Ghi Chú (Lỗi/NG)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map((log: any) => {
                            const emp = employees.find(e => e.employee_id === log.employee_id)
                            return (
                              <tr key={log.log_id}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Calendar size={12} className="text-slate-400" />
                                    <span style={{ fontFamily: 'monospace' }}>{log.work_date}</span>
                                  </div>
                                </td>
                                <td>{emp?.employee_name || log.employee_id}</td>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{log.hours_spent || '-'}</td>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{log.quantity_done || '-'}</td>
                                <td>{log.notes || '-'}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Add Work Log Form */}
                  {step.step_status !== 'COMPLETED' && (
                    <div className="card-flat" style={{ padding: 16, background: '#fff', border: '1px dashed var(--border-default)' }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px 0', color: 'var(--accent)' }}>+ Thêm Nhật Ký Mới</h4>
                      
                      <form action={async (formData) => {
                        const res = await addWorkLogAction(formData)
                        if (!res.success) alert('Lỗi: ' + res.error)
                        else {
                          // form will reset automatically or we could use useRef, but server action revalidates path.
                          // It's a simple approach. 
                          alert('Đã lưu nhật ký!')
                        }
                      }}>
                        <input type="hidden" name="job_id" value={job.job_id} />
                        <input type="hidden" name="job_step_id" value={step.step_id} />
                        <input type="hidden" name="step_status" value={step.step_status} />
                        <input type="hidden" name="planned_start" value={step.planned_start || ''} />
                        
                        <div className="form-grid-4">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label className="form-label">Ngày thực hiện *</label>
                            <input type="date" name="work_date" className="form-input" required defaultValue={new Date().toISOString().split('T')[0]} />
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label className="form-label">Người thực hiện *</label>
                            <select name="employee_id" className="form-input" required>
                              <option value="">-- Chọn nhân viên --</option>
                              {employees.map(e => (
                                <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label className="form-label">Thời gian (Giờ)</label>
                            <input type="number" name="hours_spent" step="0.5" min="0" className="form-input" placeholder="Ví dụ: 2.5" />
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label className="form-label">S.Lượng Hoàn Thành</label>
                            <input type="number" name="quantity_done" min="0" className="form-input" placeholder="Qty" />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
                          <label className="form-label">Ghi chú (Lỗi/NG)</label>
                          <input type="text" name="notes" className="form-input" placeholder="Ghi chú số lượng lỗi, lý do..." />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                            <input type="checkbox" name="mark_complete" style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                            ☑ Đánh dấu bước này HOÀN THÀNH
                          </label>
                          
                          <button type="submit" className="btn btn-primary flex items-center gap-1.5" disabled={isPending}>
                            <Save size={14} />
                            Lưu Nhật Ký
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
