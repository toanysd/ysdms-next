'use client'

import React from 'react'
import { Box, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EquipmentDetailData } from './types'
import { getCutlineSpecs, lookupCavType } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
}

export default function MoldDetailView({ data }: Props) {
  const t = useTranslations('EquipmentDetailModal.moldSpecs')
  const rev = data.design_revisions
  const prod = rev?.products

  // Mold Dimensions
  const moldLen = data.actual_length_mm || rev?.design_length
  const moldWid = data.actual_width_mm || rev?.design_width
  const dimsMold = [
    moldLen,
    moldWid,
    data.actual_height_mm || rev?.design_height
  ].filter(Boolean).join(' × ')

  // YSD Standard CAV lookup based on mold outer dimensions
  const cavType = lookupCavType(moldLen, moldWid)

  // Cutline & Corner R — RULE-DATA-01: read ONLY from design_revisions columns
  const cutlineSpecs = getCutlineSpecs(rev)
  const dimsCutline = cutlineSpecs.formatted

  // Pocket count from design_revisions columns only
  const pocketCountVal = rev?.pocket_numbers || rev?.cavity_count || null

  const isTeflonCoated = Boolean(
    data.is_teflon ||
    data.notes?.toLowerCase().includes('teflon') ||
    data.notes?.toLowerCase().includes('テフロン')
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Mold Overview Block */}
      <div
        className="card-flat"
        style={{
          padding: 14,
          background: 'var(--bg-surface-2)',
          borderRadius: 8,
          border: '1px solid var(--border-default)'
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--accent)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 6,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Box size={15} />
          {t('title')}
        </div>

        {/* Paper Style Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: 12 }}>
          {/* Customer Tray Name */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('trayName')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
              {rev?.customer_tray_name || prod?.product_name_internal || prod?.product_code || '—'}
            </span>
          </div>

          {/* Tray Info */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('trayInfo')}:
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {rev?.tray_info || '—'}
            </span>
          </div>

          {/* Plastic Material & Thickness */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('plasticType')}:
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {rev?.plastic_type_designed || (data as any).plastic_type || '—'}
            </span>
          </div>

          {/* Initial Export / Mfg Date */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('mfgDate')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
              {data.manufacturing_date || data.entry_date || '—'}
            </span>
          </div>

          {/* Mold Cavity & Pocket Count */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('pieceCount')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {data.piece_count || rev?.cavity_count || pocketCountVal || '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('pocketCount')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {pocketCountVal ? `${pocketCountVal} pockets` : '—'}
            </span>
          </div>

          {/* Mold Dimensions Badge */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('moldDims')}:
            </span>
            <span
              className="badge badge--info"
              style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}
            >
              {dimsMold ? `${dimsMold} mm` : '—'}
            </span>
          </div>

          {/* YSD Standard CAV Classification */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              実取り寸法 (CAV):
            </span>
            {cavType ? (
              <span
                className="badge badge--neutral"
                style={{
                  fontFamily: 'monospace', fontWeight: 700, fontSize: 11,
                  color: '#0F766E', background: '#F0FDFA', border: '1px solid #99F6E4'
                }}
              >
                {cavType.canonicalName}
              </span>
            ) : (
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-muted)' }}>
                —
              </span>
            )}
          </div>

          {/* Mold Weight */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('moldWeight')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {data.actual_weight ? `${data.actual_weight} kg` : rev?.design_weight || '—'}
            </span>
          </div>

          {/* Cutline Dimensions */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('cutline')}:
            </span>
            <span
              className="badge badge--success"
              style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}
            >
              {dimsCutline}
            </span>
          </div>

          {/* Corner R & Chamfer C */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              {t('chamferDims')}:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {cutlineSpecs.cornerR ? (cutlineSpecs.cornerR.startsWith('R') ? cutlineSpecs.cornerR : `R${cutlineSpecs.cornerR}`) : ''}
              {cutlineSpecs.cornerR && cutlineSpecs.chamferC ? ' / ' : ''}
              {cutlineSpecs.chamferC ? (cutlineSpecs.chamferC.startsWith('C') ? cutlineSpecs.chamferC : `C${cutlineSpecs.chamferC}`) : ''}
              {!cutlineSpecs.cornerR && !cutlineSpecs.chamferC ? '—' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Teflon & Special Status Block */}
      <div
        className="card-flat"
        style={{
          padding: 12,
          background: isTeflonCoated ? 'var(--tint-purple-bg)' : 'var(--bg-surface-2)',
          border: isTeflonCoated ? '1px solid var(--tint-purple-border)' : '1px solid var(--border-default)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: isTeflonCoated ? 'var(--tint-purple-text)' : 'var(--text-muted)' }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: isTeflonCoated ? 'var(--tint-purple-text)' : 'var(--text-primary)' }}>
              {t('teflonStatus')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {isTeflonCoated ? t('teflonDescCoated') : t('teflonDescStandard')}
            </div>
          </div>
        </div>

        <span className={isTeflonCoated ? 'badge badge--purple font-bold' : 'badge badge--neutral'}>
          {isTeflonCoated ? t('teflonCoated') : t('teflonStandard')}
        </span>
      </div>
    </div>
  )
}
