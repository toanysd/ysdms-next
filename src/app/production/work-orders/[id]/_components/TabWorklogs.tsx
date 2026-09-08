'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Calendar, 
  User, 
  Cpu, 
  ExternalLink 
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { WorkOrderWorklogItem } from '../../types'

interface TabWorklogsProps {
  woId: string
  worklogs: WorkOrderWorklogItem[]
}

export function TabWorklogs({ woId, worklogs }: TabWorklogsProps) {
  const t = useTranslations('WorkOrders')
  const [searchTerm, setSearchTerm] = useState('')

  // Aggregate KPIs
  const stats = useMemo(() => {
    let totalHours = 0
    let totalDone = 0
    let totalNg = 0

    for (const log of worklogs) {
      if (log.hours_spent) totalHours += Number(log.hours_spent)
      if (log.quantity_done) totalDone += Number(log.quantity_done)
      if (log.quantity_ng) totalNg += Number(log.quantity_ng)
    }

    const totalProduced = totalDone + totalNg
    const ngRate = totalProduced > 0 ? ((totalNg / totalProduced) * 100).toFixed(1) : '0.0'

    return {
      totalLogs: worklogs.length,
      totalHours: totalHours.toFixed(1),
      totalDone,
      totalNg,
      ngRate
    }
  }, [worklogs])

  // Filtered rows
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return worklogs
    const q = searchTerm.toLowerCase().trim()
    return worklogs.filter(log => {
      const matchEmp = log.employee_name?.toLowerCase().includes(q)
      const matchJob = log.job_code?.toLowerCase().includes(q) || log.job_name?.toLowerCase().includes(q)
      const matchStep = log.step_name?.toLowerCase().includes(q)
      const matchMachine = log.machine_name?.toLowerCase().includes(q)
      const matchNotes = log.notes?.toLowerCase().includes(q)
      const matchDate = log.work_date?.includes(q)
      return matchEmp || matchJob || matchStep || matchMachine || matchNotes || matchDate
    })
  }, [worklogs, searchTerm])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* ── 1. KPI Aggregates ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        
        {/* Total Logs */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--tint-teal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
            <ClipboardList size={18} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t('worklogTotal')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {stats.totalLogs} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>回</span>
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--tint-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-info)', flexShrink: 0 }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t('worklogHours')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {stats.totalHours} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>h</span>
            </div>
          </div>
        </div>

        {/* Output Done */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--tint-green-bg, rgba(34, 197, 94, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-success)', flexShrink: 0 }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t('worklogQuantityDone')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {stats.totalDone.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>pcs</span>
            </div>
          </div>
        </div>

        {/* Defect Rate */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 8, 
            backgroundColor: Number(stats.ngRate) > 5 ? 'var(--tint-red-bg, rgba(239, 68, 68, 0.1))' : 'var(--tint-orange-bg)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: Number(stats.ngRate) > 5 ? 'var(--status-error)' : 'var(--status-warning)', 
            flexShrink: 0 
          }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t('worklogQuantityNg')} / {t('worklogNgRate')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {stats.totalNg} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>({stats.ngRate}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 2. Filter Bar & Table ── */}
      <div className="card-flat" style={{ padding: '16px 18px', backgroundColor: 'var(--bg-surface)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardList size={16} color="var(--accent)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('tabWorklogs')}
            </span>
            <span className="badge badge--neutral" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
              {filteredLogs.length}
            </span>
          </div>

          <div style={{ position: 'relative', width: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="検索（作業者、工程、機械...）"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 30, fontSize: 12, height: 32 }}
            />
          </div>
        </div>

        {/* Table or Empty */}
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
            <ClipboardList size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 13, fontWeight: 600 }}>{t('noWorklogs')}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>作業日</th>
                  <th style={{ width: 130 }}>担当作業者</th>
                  <th>関連ジョブ / 工程</th>
                  <th style={{ width: 120 }}>設備 / 機械</th>
                  <th style={{ width: 80, textAlign: 'right' }}>工数 (h)</th>
                  <th style={{ width: 90, textAlign: 'right' }}>良品数</th>
                  <th style={{ width: 80, textAlign: 'right' }}>不良 (NG)</th>
                  <th style={{ width: 90, textAlign: 'center' }}>完了状態</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.log_id}>
                    {/* Work Date */}
                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
                      {log.work_date}
                    </td>

                    {/* Employee */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                        <User size={13} color="var(--text-muted)" />
                        <span>{log.employee_name || '—'}</span>
                      </div>
                    </td>

                    {/* Job & Step */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {log.job_id ? (
                          <Link 
                            href={`/equipment/jobs/${log.job_id}`}
                            style={{ 
                              color: 'var(--accent)', 
                              fontFamily: 'monospace', 
                              fontWeight: 700, 
                              fontSize: 12,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <span>{log.job_code || 'JOB'}</span>
                            <ExternalLink size={10} />
                          </Link>
                        ) : null}
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {log.step_name || log.job_name || '—'}
                        </div>
                      </div>
                    </td>

                    {/* Machine */}
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {log.machine_name ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Cpu size={12} color="var(--text-muted)" />
                          <span>{log.machine_name}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Hours */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: 700 }}>
                      {log.hours_spent !== null ? Number(log.hours_spent).toFixed(1) : '—'}
                    </td>

                    {/* Done */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--status-success)' }}>
                      {log.quantity_done !== null ? log.quantity_done.toLocaleString() : '—'}
                    </td>

                    {/* NG */}
                    <td style={{ textAlign: 'right' }}>
                      {log.quantity_ng > 0 ? (
                        <span className="badge badge--error" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
                          {log.quantity_ng}
                        </span>
                      ) : (
                        <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>0</span>
                      )}
                    </td>

                    {/* Finished Status */}
                    <td style={{ textAlign: 'center' }}>
                      {log.is_finished ? (
                        <span className="badge badge--success" style={{ fontSize: 11, fontWeight: 700 }}>
                          完了
                        </span>
                      ) : (
                        <span className="badge badge--info" style={{ fontSize: 11, fontWeight: 600 }}>
                          進行中
                        </span>
                      )}
                    </td>

                    {/* Notes */}
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.notes || ''}>
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  )
}
