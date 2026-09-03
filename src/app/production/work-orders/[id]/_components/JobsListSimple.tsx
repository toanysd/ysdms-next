'use client'

import React from 'react'
import Link from 'next/link'
import { Briefcase, CheckCircle, Clock } from 'lucide-react'

interface JobItem {
  job_id: string
  job_code: string
  job_name: string
  job_category: string | null
  job_status: string | null
  equipment_id: string | null
  equipment?: {
    equipment_type: string
    display_name: string | null
    equipment_code: string
  } | null
  job_steps?: Array<{
    step_id: string
    step_status: string | null
  }> | null
}

export function JobsListSimple({ jobs }: { jobs: JobItem[] }) {
  const getStatusBadge = (st: string | null) => {
    switch (st) {
      case 'COMPLETED':
        return <span className="badge badge--success font-bold text-xs">完了</span>
      case 'IN_PROGRESS':
        return <span className="badge badge--warning font-bold text-xs">進行中</span>
      case 'PENDING':
      default:
        return <span className="badge badge--info font-bold text-xs">未着手</span>
    }
  }

  const getEquipmentTypeBadge = (type: string | undefined) => {
    if (!type) return <span className="badge badge--neutral text-xs">-</span>
    let colorClass = 'badge--neutral'
    if (type === 'MOLD') colorClass = 'badge--info'
    if (type.startsWith('CUTTER')) colorClass = 'badge--warning'
    if (type === 'STACKING' || type === 'PLUG') colorClass = 'badge--neutral'

    return <span className={`badge ${colorClass} font-mono text-xs`}>{type}</span>
  }

  return (
    <div className="card-flat" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Briefcase size={16} color="var(--accent)" />
          <span>加工指示書・設備Jobs ({jobs.length})</span>
        </h2>
        <span className="text-xs text-slate-500 font-semibold">ADR-003: 設備別Jobs分離</span>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>設備種別 (Type)</th>
            <th style={{ width: '22%' }}>Jobコード</th>
            <th style={{ width: '33%' }}>指示書名 / 対象設備</th>
            <th style={{ width: '15%', textAlign: 'center' }}>工程進捗</th>
            <th style={{ width: '15%', textAlign: 'center' }}>ステータス</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const steps = job.job_steps || []
            const completedCount = steps.filter(s => s.step_status === 'COMPLETED').length
            const totalCount = steps.length

            return (
              <tr key={job.job_id}>
                <td>
                  {getEquipmentTypeBadge(job.equipment?.equipment_type || job.job_category || undefined)}
                </td>
                <td>
                  <Link
                    href={`/equipment/jobs/${job.job_id}`}
                    style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace' }}
                  >
                    {job.job_code}
                  </Link>
                </td>
                <td>
                  <div className="font-semibold text-slate-800 text-[13px]">{job.job_name}</div>
                  {job.equipment?.equipment_code && (
                    <div className="text-[11px] font-mono text-slate-500">
                      機器番号: {job.equipment.equipment_code}
                    </div>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {totalCount > 0 ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold">
                      {completedCount === totalCount ? (
                        <CheckCircle size={14} className="text-emerald-600" />
                      ) : (
                        <Clock size={14} className="text-amber-500" />
                      )}
                      <span>{completedCount}/{totalCount} 工程</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
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
