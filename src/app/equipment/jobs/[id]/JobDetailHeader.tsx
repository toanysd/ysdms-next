'use client'

import { Briefcase, Box, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function JobDetailHeader({ job }: { job: any }) {
  const t = useTranslations()

  const STATUS_MAP: Record<string, { label: string; badgeClass: string }> = {
    NEW:         { label: t('Equipment.statusNew'),        badgeClass: 'badge badge--info' },
    IN_PROGRESS: { label: t('Equipment.statusInProgress'),  badgeClass: 'badge badge--warning' },
    COMPLETED:   { label: t('Equipment.statusCompleted'),   badgeClass: 'badge badge--success' },
    CANCELLED:   { label: t('Equipment.statusCancelled'),   badgeClass: 'badge badge--neutral' },
  }

  const statusInfo = STATUS_MAP[job.job_status || ''] || { label: job.job_status || '—', badgeClass: 'badge badge--neutral' }

  return (
    <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
        <Briefcase size={14} className="text-[var(--accent)]" />
        <span>{t('Equipment.jobTitle')}</span>
      </div>
      
      {/* Row 1: Main info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 18, fontWeight: 800,
            fontFamily: 'monospace', color: 'var(--accent)', letterSpacing: '-0.02em'
          }}>
            {job.job_code}
          </h1>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {job.job_name}
          </span>
        </div>

        <span className={statusInfo.badgeClass}>
          {statusInfo.label}
        </span>

        {/* Meta info inline */}
        {job.job_types && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 4,
            backgroundColor: 'var(--tint-teal-bg)', color: 'var(--tint-teal-text)',
            border: '1px solid var(--tint-teal-border)'
          }}>
            <span>{job.job_types.job_type_name_ja}</span>
          </span>
        )}
        {job.target_completion_date && (
          <span style={{
            fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 4, background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC'
          }} title="金型完成目標日 (出荷前3稼働日)">
            <span>🏁 完成: {job.target_completion_date.slice(5)}</span>
          </span>
        )}
        {job.mold_deadline && (
          <span style={{
            fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 4, background: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border-default)'
          }} title="指示納期 / 払出期日">
            <span>🛠️ 払出: {job.mold_deadline.slice(5, 10)}</span>
          </span>
        )}
        {job.ship_date && (
          <span style={{
            fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 4, background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A'
          }} title="製品出荷予定日">
            <span>📦 出荷: {job.ship_date.slice(5, 10)}</span>
          </span>
        )}
      </div>

      {/* Row 2: Related links */}
      {(job.physical_molds || job.design_revisions) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid var(--border-default)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t('Equipment.related')}:</span>
          {job.physical_molds && (
            <Link href={`/equipment/molds/${job.physical_molds.physical_mold_id}`} style={{ textDecoration: 'none' }}>
              <span className="badge badge--info font-mono font-bold text-[12px]">
                <Box size={12} />
                {job.physical_molds.system_code}
              </span>
            </Link>
          )}
          {job.design_revisions && job.products && (
            <Link href={`/engineering/designs/${job.products.product_id}?revision=${encodeURIComponent(job.design_revisions.revision_code)}`} style={{ textDecoration: 'none' }}>
              <span className="badge badge--info font-mono font-bold text-[12px]">
                <FileText size={12} />
                {job.design_revisions.design_code}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

