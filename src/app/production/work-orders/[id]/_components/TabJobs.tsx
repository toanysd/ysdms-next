'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Wrench, CheckCircle2, Clock, PlayCircle, Plus } from 'lucide-react'
import { generateJobsForWorkOrder } from '../../actions'

interface JobStep {
  step_id: string
  step_name: string
  step_status: string
  step_no: number
}

interface JobItem {
  job_id: string
  job_code: string
  job_name: string
  job_category: string
  job_status: string
  equipment_id: string | null
  start_date: string | null
  deadline: string | null
  responsible?: { full_name: string } | null
  equipment?: { equipment_type: string; display_name: string; equipment_code: string } | null
  job_steps?: JobStep[]
}

interface TabJobsProps {
  woId: string
  jobs: JobItem[]
}

export function TabJobs({ woId, jobs }: TabJobsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleGenerateJobs = async () => {
    setLoading(true)
    setMessage(null)
    const res = await generateJobsForWorkOrder(woId)
    setLoading(false)

    if (res.error) {
      alert(`エラー: ${res.error}`)
    } else {
      setMessage(res.message || '指示書を発行しました。')
      router.refresh()
    }
  }

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge--success">完了</span>
      case 'IN_PROGRESS':
        return <span className="badge badge--warning">進行中</span>
      case 'PENDING':
      default:
        return <span className="badge badge--info">待機中</span>
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 6,
          border: '1px solid var(--border-default)',
        }}
      >
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            工程・設備別ジョブ (Equipment Jobs & Steps)
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
            ADR-002 / ADR-003: 1 Equipment = 1 Job 体系
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGenerateJobs}
            disabled={loading}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              padding: '6px 12px',
            }}
          >
            <Wrench size={13} />
            <span>{jobs.length === 0 ? '指示書(Job)を一括発行' : '未発行Jobを追加発行'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#F0FDF4',
            color: '#15803D',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid #BBF7D0',
          }}
        >
          {message}
        </div>
      )}

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div
          style={{
            padding: '32px 16px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 6,
            border: '1px dashed var(--border-default)',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            この指示票に紐付くジョブはまだ発行されていません。
          </p>
          <button
            type="button"
            onClick={handleGenerateJobs}
            disabled={loading}
            className="btn btn-primary"
            style={{ fontSize: 12 }}
          >
            上のボタンから「指示書(Job)を一括発行」してください
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {jobs.map((job) => {
            const steps = job.job_steps || []
            const completedSteps = steps.filter((s) => s.step_status === 'COMPLETED').length
            const totalSteps = steps.length

            return (
              <div
                key={job.job_id}
                className="card-flat"
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {/* Job Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link
                      href={`/equipment/jobs?search=${job.job_code}`}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                      }}
                    >
                      {job.job_code}
                    </Link>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {job.job_name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge badge--neutral font-bold">{job.job_category}</span>
                    {getJobStatusBadge(job.job_status)}
                  </div>
                </div>

                {/* Equipment & Steps Progress */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                  }}
                >
                  <div>
                    設備: {job.equipment?.equipment_code || '—'} ({job.equipment?.equipment_type || '—'}) |
                    担当: {job.responsible?.full_name || '未割当'}
                  </div>
                  <div>
                    進捗: <strong style={{ color: '#0F172A' }}>{completedSteps}</strong> / {totalSteps} ステップ完了
                  </div>
                </div>

                {/* Steps pills */}
                {steps.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {steps.map((st) => (
                      <span
                        key={st.step_id}
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 4,
                          backgroundColor:
                            st.step_status === 'COMPLETED'
                              ? '#DCFCE7'
                              : st.step_status === 'IN_PROGRESS'
                              ? '#EFF6FF'
                              : '#F1F5F9',
                          color:
                            st.step_status === 'COMPLETED'
                              ? '#15803D'
                              : st.step_status === 'IN_PROGRESS'
                              ? '#1D4ED8'
                              : '#475569',
                          border: '1px solid var(--border-default)',
                        }}
                      >
                        {st.step_no}. {st.step_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
