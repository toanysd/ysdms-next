'use client'

import React from 'react'
import { Crop, Wrench } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EquipmentDetailData } from './types'
import { formatCutterDisplayCode, getCutlineSpecs } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
  jobsHistory?: any[]
}

export default function CutterDetailView({ data, jobsHistory = [] }: Props) {
  const t = useTranslations('EquipmentDetailModal.cutterSpecs')
  const rawCutterType = (
    (data as any).cutter_type ||
    data.sub_type ||
    ((data as any).legacy_specs && typeof (data as any).legacy_specs === 'object' ? (data as any).legacy_specs?.cutter_type : null) ||
    (data.equipment_type === 'CUTTER_INLINE' ? 'In-Line' : data.equipment_type === 'CUTTER_SEPARATE' ? '別抜き' : null)
  )

  const isInline = Boolean(
    rawCutterType?.toUpperCase().includes('INLINE') ||
    rawCutterType?.toUpperCase().includes('IN-LINE') ||
    data.equipment_type === 'CUTTER_INLINE'
  )

  const cutterTypeLabel = rawCutterType
    ? isInline
      ? t('typeInline')
      : rawCutterType.includes('別抜き') || rawCutterType.toUpperCase().includes('SEPARATE')
      ? t('typeSeparate')
      : rawCutterType
    : '—'

  const cutterTypeBadgeClass = rawCutterType
    ? isInline
      ? 'badge badge--orange'
      : 'badge badge--info'
    : 'badge badge--neutral'

  const cutterCode = formatCutterDisplayCode(data.cutter_no || data.equipment_code)
  const isAvailable = data.cutter_presence ?? (data.usage_status !== 'IN_USE')

  // Base structure: Aluminum Plate vs Wood
  const isAluminumBase =
    data.base_type === 'ALUMINUM' ||
    data.base_type?.includes('アルミ') ||
    data.notes?.includes('アルミ') ||
    data.equipment_code?.includes('AL') ||
    data.display_name?.includes('アルミ')

  const baseBadgeClass = isAluminumBase ? 'badge badge--info' : 'badge badge--neutral'

  // Dimensions
  const dimsCutter = [
    data.actual_length_mm,
    data.actual_width_mm,
    data.actual_height_mm
  ].filter(Boolean).join(' × ') || data.dimensions || '—'

  // Legacy specs object synced from cutters table
  const legacySpecs: any = (data.legacy_specs && typeof data.legacy_specs === 'object') ? data.legacy_specs : {}
  const rev: any = data.design_revisions

  // Cutline & Corner R / Chamfer C — RULE-DATA-01: read from design_revisions columns only
  const cutlineSpecs = getCutlineSpecs(rev)
  const cutlineStr = cutlineSpecs.formatted
  const cornerR = cutlineSpecs.cornerR ? (cutlineSpecs.cornerR.startsWith('R') ? cutlineSpecs.cornerR : `R${cutlineSpecs.cornerR}`) : '—'
  const chamferC = cutlineSpecs.chamferC ? (cutlineSpecs.chamferC.startsWith('C') ? cutlineSpecs.chamferC : `C${cutlineSpecs.chamferC}`) : '—'

  // Post-cut finish size
  const postCutLength = data.post_cut_length || legacySpecs.post_cut_length
  const postCutWidth = data.post_cut_width || legacySpecs.post_cut_width
  const postCutStr = (postCutLength && postCutWidth) ? `${postCutLength} × ${postCutWidth} mm` : '—'

  // Blade height
  const bladeHeight = data.blade_height_mm || data.actual_height_mm || '—'

  // Cavity / Blade count & pitch — from design_revisions only
  const cavityCount = rev?.cavity_count || rev?.pocket_numbers || data.pocket_count || data.piece_count || '—'
  const pitchMm = rev?.cavity_pitch_mm || rev?.machine_feed_pitch_mm || '—'

  // Suitable plastic & thickness
  const plasticType = rev?.plastic_type_designed || '—'

  // Entry / Mfg date
  const entryDate = data.entry_date || data.manufacturing_date || data.created_at?.slice(0, 10) || '—'

  // Filter maintenance & repair jobs
  const maintenanceJobs = jobsHistory.filter(j =>
    j.job_category === 'REPAIR' ||
    j.job_category === 'MAINTENANCE' ||
    j.job_name?.includes('刃') ||
    j.notes?.includes('刃') ||
    j.notes?.includes('修理') ||
    j.notes?.includes('研磨')
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Main Cutter Specifications Card */}
      <div
        className="card-flat"
        style={{
          padding: 14,
          background: 'var(--bg-surface-2)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}
      >
        {/* Card Header */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--tint-orange-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 6
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Crop size={15} />
            <span>{t('title')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={baseBadgeClass} style={{ fontSize: 9, fontWeight: 700 }}>
              {isAluminumBase ? '⚡ AL' : '🪵 Wood'}
            </span>
            <span className={cutterTypeBadgeClass} style={{ fontWeight: 700, fontSize: 9 }}>
              {cutterTypeLabel}
            </span>
          </div>
        </div>

        {/* Paper Style Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: 12 }}>

          {/* System ID & Cutter Code */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              ID:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)' }}>
              {data.legacy_id || (data.equipment_id ? `#${data.equipment_id.slice(0, 8)}` : (data as any).cutter_id ? `#${(data as any).cutter_id.slice(0, 8)}` : '—')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('cutterNo')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
              {cutterCode}
            </span>
          </div>

          {/* Cutter Name */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('cutterName')}:
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {data.cutter_name || data.display_name || '—'}
            </span>
          </div>

          {/* Cutter Type */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('cutterType')}:
            </span>
            <span className={cutterTypeBadgeClass} style={{ fontWeight: 700, fontSize: 10 }}>
              {cutterTypeLabel}
            </span>
          </div>

          {/* Cutline Size */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('cutline')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
              {cutlineStr}
            </span>
          </div>

          {/* Post-cut Finish Size */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('postCutDims')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {postCutStr}
            </span>
          </div>

          {/* Blade Height */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('bladeHeight')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {bladeHeight !== '—' ? `${bladeHeight} mm` : '—'}
            </span>
          </div>

          {/* Cutter Outer Dimensions */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('dimensions')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {dimsCutter !== '—' ? `${dimsCutter} mm` : '—'}
            </span>
          </div>

          {/* Blade / Cavity Count */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('bladeCountPitch')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {cavityCount !== '—' ? `${cavityCount}` : '—'}
            </span>
          </div>

          {/* Pitch */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('pitch')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {pitchMm !== '—' ? `${pitchMm} mm` : '—'}
            </span>
          </div>

          {/* Suitable Plastic & Thickness */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('resinApplicable')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
              {plasticType}
            </span>
          </div>

          {/* Corner R & Chamfer C */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('cornerR')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {cornerR !== '—' ? (String(cornerR).startsWith('R') ? cornerR : `R${cornerR}`) : '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('chamferC')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {chamferC !== '—' ? (String(chamferC).startsWith('C') ? chamferC : `C${chamferC}`) : '—'}
            </span>
          </div>

          {/* Presence & Cutter Entry Date */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('presenceStatus')}:
            </span>
            <span className={isAvailable ? 'badge badge--success' : 'badge badge--warning'} style={{ fontSize: 9, fontWeight: 700 }}>
              {isAvailable ? t('available') : t('inUse')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 105, flexShrink: 0, fontWeight: 600 }}>
              {t('mfgDate')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
              {entryDate}
            </span>
          </div>

        </div>
      </div>

      {/* Cutter Repair & Blade Replacement History */}
      <div className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Wrench size={13} style={{ color: 'var(--accent)' }} /> {t('repairHistoryTitle')}
          </span>
          <span className="badge badge--neutral" style={{ fontSize: 9 }}>
            {maintenanceJobs.length}件
          </span>
        </div>

        {maintenanceJobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {maintenanceJobs.map((job) => (
              <div
                key={job.job_id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 8px', borderRadius: 4, background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)', fontSize: 11
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                    {job.job_code}
                  </span>
                  <span>{job.job_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge--info" style={{ fontSize: 8 }}>
                    {job.job_status}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)' }}>
                    {job.created_at?.slice(0, 10)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {t('noRepairHistory')}
          </span>
        )}
      </div>

      {/* Cutter Reuse Guidelines */}
      <div
        className="card-flat"
        style={{
          padding: 10,
          background: 'var(--tint-teal-bg)',
          border: '1px solid var(--tint-teal-border)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tint-teal-text)' }}>
          {t('reusePolicyTitle')}
        </div>
        <div style={{ fontSize: 10, color: 'var(--tint-teal-text)', opacity: 0.9 }}>
          {t('reusePolicyBody')}
        </div>
      </div>
    </div>
  )
}
