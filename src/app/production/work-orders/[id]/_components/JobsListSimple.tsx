'use client'

import React from 'react'
import Link from 'next/link'
import { Briefcase, CheckCircle, Clock, User, Layers } from 'lucide-react'

interface JobItem {
  job_id: string
  job_code: string
  job_name: string
  job_category: string | null
  job_status: string | null
  equipment_id: string | null
  responsible?: {
    full_name: string | null
  } | null
  equipment?: {
    equipment_type: string
    display_name: string | null
    equipment_code: string
  } | null
  job_steps?: Array<{
    step_id: string
    step_name: string
    step_status: string | null
    step_no: number
  }> | null
}

export function JobsListSimple({ jobs }: { jobs: JobItem[] }) {
  const totalJobs = jobs.length
  const completedJobs = jobs.filter(j => j.job_status === 'COMPLETED').length
  const percentComplete = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0

  const getStatusBadge = (st: string | null) => {
    switch (st) {
      case 'COMPLETED':
        return <span className="badge badge--success font-bold text-xs">完了 ✅</span>
      case 'IN_PROGRESS':
        return <span className="badge badge--warning font-bold text-xs">進行中 🔨</span>
      case 'PENDING':
      default:
        return <span className="badge badge--neutral font-bold text-xs text-slate-500">待機中 ⏳</span>
    }
  }

  const getEquipmentPill = (type: string | undefined) => {
    if (!type) return <span className="badge badge--neutral text-xs">-</span>
    
    let label = type
    let bgStyle = { background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }
    let dotColor = '#64748b'

    if (type === 'MOLD') {
      label = '🔵 MOLD'
      bgStyle = { background: 'var(--tint-blue-bg)', color: '#0369a1' }
      dotColor = '#0284c7'
    } else if (type.startsWith('CUTTER')) {
      label = '🟡 CUTTER'
      bgStyle = { background: 'var(--tint-orange-bg)', color: '#b45309' }
      dotColor = '#d97706'
    } else if (type === 'STACKING') {
      label = '📦 STACK'
      bgStyle = { background: 'var(--tint-purple-bg)', color: '#6d28d9' }
      dotColor = '#7c3aed'
    } else if (type === 'PLUG') {
      label = '⚪ PLUG'
      bgStyle = { background: 'var(--tint-teal-bg)', color: '#0f766e' }
      dotColor = '#0d9488'
    } else if (type.includes('BASE')) {
      label = '⚙️ BASE'
      bgStyle = { background: 'var(--bg-surface-2)', color: '#334155' }
      dotColor = '#475569'
    }

    return (
      <span 
        className="font-bold font-mono text-[11px] px-2.5 py-1 rounded-full border border-slate-200 inline-flex items-center gap-1.5"
        style={bgStyle}
      >
        <span>{label}</span>
      </span>
    )
  }

  return (
    <div className="card-flat" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Summary Progress Header ── */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} color="var(--accent)" />
            <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
              加工指示ステータス (Work Order Jobs)
            </h2>
          </div>
          <div className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            {completedJobs}/{totalJobs} Jobs 完了 ({percentComplete}%)
          </div>
        </div>

        {/* Global Progress Bar */}
        <div style={{ width: '100%', height: 8, background: 'var(--border-default)', borderRadius: 4, overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${percentComplete}%`, 
              height: '100%', 
              background: percentComplete === 100 ? 'var(--status-success)' : 'var(--accent)',
              transition: 'width 0.4s ease'
            }} 
          />
        </div>
      </div>

      {/* ── Jobs Table ── */}
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '14%' }}>設備種別</th>
            <th style={{ width: '30%' }}>指示書 / Jobコード</th>
            <th style={{ width: '22%' }}>工程進捗 (Steps)</th>
            <th style={{ width: '18%' }}>担当者</th>
            <th style={{ width: '16%', textAlign: 'center' }}>状態</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const steps = job.job_steps || []
            const completedSteps = steps.filter(s => s.step_status === 'COMPLETED').length
            const totalSteps = steps.length
            const stepPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

            return (
              <tr key={job.job_id}>
                <td>
                  {getEquipmentPill(job.equipment?.equipment_type || job.job_category || undefined)}
                </td>
                <td>
                  <div className="flex flex-col">
                    <Link
                      href={`/equipment/jobs/${job.job_id}`}
                      style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}
                    >
                      {job.job_code}
                    </Link>
                    <span className="font-semibold text-slate-800 text-[12px] truncate max-w-[280px]">
                      {job.job_name}
                    </span>
                    {job.equipment?.equipment_code && (
                      <span className="text-[11px] font-mono text-slate-400">
                        機器: {job.equipment.equipment_code}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  {totalSteps > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700">
                        <span>{completedSteps}/{totalSteps} 工程</span>
                        <span>{stepPercent}%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'var(--border-default)', borderRadius: 3, overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${stepPercent}%`, 
                            height: '100%', 
                            background: stepPercent === 100 ? 'var(--status-success)' : 'var(--accent)'
                          }} 
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">0 工程</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <User size={13} className="text-slate-400 shrink-0" />
                    <span>{job.responsible?.full_name || '未割当'}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {getStatusBadge(job.job_status)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
