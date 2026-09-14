'use client'

import React from 'react'
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Wrench, 
  FileText,
  Calendar
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { WorkOrderProgress } from '../../types'

interface WorkOrderProgressCockpitProps {
  progress: WorkOrderProgress | null
  deadline?: string | null
  woStatus?: string
}

export function WorkOrderProgressCockpit({
  progress,
  deadline,
  woStatus,
}: WorkOrderProgressCockpitProps) {
  const t = useTranslations('WorkOrders')

  if (!progress) {
    return null
  }

  const isOverdue = progress.is_overdue
  const percent = progress.progress_percent || 0
  const isCompleted = progress.wo_status === 'COMPLETED' || woStatus === 'COMPLETED'

  return (
    <div
      className="card-flat"
      style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-surface)',
        border: isOverdue ? '1.5px solid #FCA5A5' : '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* ── 1. Cockpit Header & Overdue Alert ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} color="var(--accent)" />
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            {t('tierProgressTitle')}
          </h3>
        </div>

        {/* Global Progress % Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 16,
              backgroundColor: isCompleted
                ? 'var(--tint-teal-bg, #F0FDF4)'
                : isOverdue
                ? '#FEF2F2'
                : 'var(--tint-teal-bg, #F0FDFA)',
              border: `1px solid ${
                isCompleted ? '#86EFAC' : isOverdue ? '#FECACA' : '#99F6E4'
              }`,
              color: isCompleted ? '#16A34A' : isOverdue ? '#DC2626' : '#0D9488',
              fontWeight: 700,
              fontSize: 12,
              fontFamily: 'monospace',
            }}
          >
            {isCompleted ? <CheckCircle2 size={14} /> : <Clock size={14} />}
            <span>{t('colProgress')}: {percent}%</span>
          </div>
        </div>
      </div>

      {/* ── Overdue Warning Banner (if is_overdue) ── */}
      {isOverdue && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #F87171',
            borderRadius: 6,
            color: '#B91C1C',
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 700 }}>{t('overdueWarning')}: </span>
            <span>
              製造期限 ({deadline ? deadline.slice(0, 10) : '—'}) を超過していますが、指示はまだ完了していません。工程ステップおよび作業日報の進捗を確認してください。
            </span>
          </div>
        </div>
      )}

      {/* ── 2. 4-Tier Visual Progress Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {/* Tier 1: Lệnh sản xuất (WO) */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
            borderRadius: 6,
            border: '1px solid var(--border-default, #E2E8F0)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <FileText size={13} color="var(--accent)" />
              {t('tier1Label')}
            </span>
            <span className="badge badge--info font-mono" style={{ fontSize: 10 }}>
              {progress.wo_status}
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: 'var(--text-primary)',
            }}
          >
            {progress.wo_code}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            種別: {progress.wo_type}
          </div>
        </div>

        {/* Tier 2: Chỉ thị gia công (Jobs) */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
            borderRadius: 6,
            border: '1px solid var(--border-default, #E2E8F0)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Wrench size={13} color="#2563EB" />
              {t('tier2Label')}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#2563EB',
              }}
            >
              {progress.completed_jobs} / {progress.total_jobs}
            </span>
          </div>
          <div style={{ width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', margin: '6px 0' }}>
            <div
              style={{
                width: `${progress.total_jobs > 0 ? (progress.completed_jobs / progress.total_jobs) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#2563EB',
                transition: 'width 0.3s',
              }}
            />
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
            設備別ジョブ完了率:{' '}
            {progress.total_jobs > 0
              ? Math.round((progress.completed_jobs / progress.total_jobs) * 100)
              : 0}
            %
          </div>
        </div>

        {/* Tier 3: Các bước công đoạn (Job Steps) */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
            borderRadius: 6,
            border: '1px solid var(--border-default, #E2E8F0)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Layers size={13} color="#0D9488" />
              {t('tier3Label')}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#0D9488',
              }}
            >
              {progress.completed_steps} / {progress.total_steps}
            </span>
          </div>
          <div style={{ width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', margin: '6px 0' }}>
            <div
              style={{
                width: `${progress.total_steps > 0 ? (progress.completed_steps / progress.total_steps) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#0D9488',
                transition: 'width 0.3s',
              }}
            />
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
            ステップ達成度:{' '}
            {progress.total_steps > 0
              ? Math.round((progress.completed_steps / progress.total_steps) * 100)
              : 0}
            %
          </div>
        </div>

        {/* Tier 4: Nhật ký giờ công (Work Logs) */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
            borderRadius: 6,
            border: '1px solid var(--border-default, #E2E8F0)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Clock size={13} color="#D97706" />
              {t('tier4Label')}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#D97706',
              }}
            >
              {progress.sum_actual_hours}h
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: 'var(--text-primary)',
            }}
          >
            実績: {progress.sum_actual_hours}h
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            日報からの累積投入工数
          </div>
        </div>
      </div>

      {/* ── 3. Hours Comparison Table (Planned vs Actual vs Variance) ── */}
      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
            padding: '8px 12px',
            fontSize: 11.5,
            fontWeight: 700,
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Clock size={13} />
          <span>工数比較・実績差異 (So sánh Giờ công Kế hoạch vs Thực tế)</span>
        </div>

        <table
          className="data-table"
          style={{ width: '100%', margin: 0, borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={{ width: '25%' }}>{t('plannedHoursLabel')}</th>
              <th style={{ width: '25%' }}>{t('actualHoursLabel')}</th>
              <th style={{ width: '25%' }}>{t('varianceHoursLabel')}</th>
              <th style={{ width: '25%' }}>判定 (Đánh giá)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 600 }}>
                {progress.sum_planned_hours} h
              </td>
              <td
                style={{
                  fontSize: 13,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: progress.variance_hours > 0 ? '#DC2626' : '#0D9488',
                }}
              >
                {progress.sum_actual_hours} h
              </td>
              <td
                style={{
                  fontSize: 13,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: progress.variance_hours > 0 ? '#DC2626' : '#15803D',
                }}
              >
                {progress.variance_hours > 0 ? `+${progress.variance_hours}` : progress.variance_hours} h
              </td>
              <td>
                {progress.variance_hours > 0 ? (
                  <span className="badge badge--error">超過 (Over budget)</span>
                ) : progress.sum_actual_hours > 0 ? (
                  <span className="badge badge--success">適正 (On track)</span>
                ) : (
                  <span className="badge badge--neutral">未着手 (Pending)</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
