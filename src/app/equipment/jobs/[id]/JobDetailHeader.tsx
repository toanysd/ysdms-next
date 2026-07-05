import { Briefcase, Box, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

const STATUS_MAP: Record<string, { ja: string; color: string }> = {
  NEW:         { ja: '新規',       color: 'var(--status-info)' },
  IN_PROGRESS: { ja: '進行中',     color: 'var(--status-warning)' },
  COMPLETED:   { ja: '完了',       color: 'var(--status-success)' },
  CANCELLED:   { ja: 'キャンセル', color: 'var(--text-muted)' },
}

function StatusBadge({ status }: { status: string | null }) {
  const s = STATUS_MAP[status || ''] || { ja: status || '—', color: 'var(--text-muted)' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '1px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
      color: s.color,
      background: `color-mix(in srgb, ${s.color} 12%, transparent)`,
      border: `1px solid color-mix(in srgb, ${s.color} 25%, transparent)`,
      whiteSpace: 'nowrap',
    }}>
      {s.ja}
    </span>
  )
}

export function JobDetailHeader({ job }: { job: any }) {
  return (
    <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
        <Briefcase size={12} />
        <span>ジョブ / JOB GIA CÔNG</span>
      </div>
      {/* Row 1: Main info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 18, fontWeight: 800,
            fontFamily: 'monospace', color: 'var(--accent)', letterSpacing: '-0.02em'
          }}>
            {job.job_code}
          </h1>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {job.job_name}
          </span>
        </div>

        <StatusBadge status={job.job_status} />

        {/* Meta info inline */}
        {job.job_types && (
          <span style={{
            fontSize: 10, color: 'var(--text-muted)',
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <span style={{ fontFamily: 'var(--font-jp)' }}>{job.job_types.job_type_name_ja}</span>
          </span>
        )}
        {job.mold_deadline && (
          <span style={{
            fontSize: 10, color: 'var(--text-muted)',
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <Calendar size={10} />
            {new Date(job.mold_deadline).toLocaleDateString('ja-JP')}
          </span>
        )}
      </div>

      {/* Row 2: Related links (compact) */}
      {(job.physical_molds || job.design_revisions) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid var(--border-default)' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>関連:</span>
          {job.physical_molds && (
            <Link href={`/equipment/molds/${job.physical_molds.physical_mold_id}`} style={{ textDecoration: 'none' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                background: 'color-mix(in srgb, var(--accent) 8%, var(--bg-surface))',
                border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                fontSize: 10, fontWeight: 700, color: 'var(--accent)',
              }}>
                <Box size={10} />
                {job.physical_molds.system_code}
              </span>
            </Link>
          )}
          {job.design_revisions && job.products && (
            <Link href={`/engineering/designs/${job.products.product_id}?revision=${encodeURIComponent(job.design_revisions.revision_code)}`} style={{ textDecoration: 'none' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                background: 'color-mix(in srgb, var(--status-info) 8%, var(--bg-surface))',
                border: '1px solid color-mix(in srgb, var(--status-info) 20%, transparent)',
                fontSize: 10, fontWeight: 700, color: 'var(--status-info)',
              }}>
                <FileText size={10} />
                {job.design_revisions.design_code}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
