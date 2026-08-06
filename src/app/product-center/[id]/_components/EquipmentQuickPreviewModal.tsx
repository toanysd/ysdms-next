'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  X, ExternalLink, Wrench, Crop, Pin, Layers, MapPin, Ruler, Scale,
  Calendar, CheckCircle, AlertTriangle, ShieldAlert, Building2, Box
} from 'lucide-react'
import { formatCutterDisplayCode, formatMoldDisplayCode, formatRackLocationDisplay } from '@/lib/utils/moldNaming'

export type QuickPreviewItem =
  | { type: 'mold'; data: any }
  | { type: 'cutter'; data: any }
  | { type: 'equip'; data: any }

interface Props {
  isOpen: boolean
  onClose: () => void
  item: QuickPreviewItem | null
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'badge badge--success',
  IN_USE: 'badge badge--success',
  IN_STOCK: 'badge badge--info',
  MAINTENANCE: 'badge badge--warning',
  LOAN: 'badge badge--warning',
  NORMAL: 'badge badge--success',
  DISPOSED: 'badge badge--error',
}

export default function EquipmentQuickPreviewModal({ isOpen, onClose, item }: Props) {
  const tPC = useTranslations('ProductCenter')
  const tCommon = useTranslations('Common')

  if (!isOpen || !item) return null

  const getRackText = (rackLayers: any) => formatRackLocationDisplay(rackLayers)

  const getKeeperText = (kc: any) => {
    if (!kc) return tPC('internalYSD') || 'YSD (社内)'
    return kc.company_name || kc.company_code || tPC('internalYSD') || 'YSD (社内)'
  }

  let titleCode = '—'
  let titleName = '—'
  let categoryLabel = '設備 / Equipment'
  let IconComponent = Box
  let headerGradient = 'linear-gradient(135deg, var(--tint-orange-bg) 0%, var(--bg-surface-2) 100%)'
  let headerTextColor = 'var(--tint-orange-text)'
  let detailUrl = '/equipment/molds'
  let bindingBadge: 'active' | 'shared' | 'legacy' | 'disposed' = 'active'
  let statusText = 'ACTIVE'

  if (item.type === 'mold') {
    const m = item.data
    titleCode = formatMoldDisplayCode(m.system_code)
    titleName = m.display_name || '—'
    categoryLabel = tPC('moldThumbnail') || '金型'
    IconComponent = Box
    headerGradient = 'linear-gradient(135deg, var(--tint-orange-bg) 0%, var(--bg-surface-2) 100%)'
    headerTextColor = 'var(--tint-orange-text)'
    detailUrl = `/equipment/molds/${m.physical_mold_id}`
    statusText = m.usage_status || m.device_status || 'ACTIVE'
    bindingBadge = m.usage_status === 'DISPOSED' ? 'disposed' : 'active'
  } else if (item.type === 'cutter') {
    const c = item.data
    titleCode = formatCutterDisplayCode(c.cutter_no || c.equipment_code)
    titleName = c.cutter_name || c.display_name || '—'
    categoryLabel = tPC('cutterThumbnail') || '抜き型'
    IconComponent = Crop
    headerGradient = 'linear-gradient(135deg, var(--tint-purple-bg) 0%, var(--bg-surface-2) 100%)'
    headerTextColor = 'var(--tint-purple-text)'
    detailUrl = `/equipment/cutting-dies`
    statusText = c.usage_status || (c.cutter_presence ? '在空' : '保管中')
    bindingBadge = c.is_shared ? 'shared' : 'active'
  } else if (item.type === 'equip') {
    const eq = item.data
    const isPlug = eq.equipment_type?.includes('PLUG')
    const isCutter = eq.equipment_type?.includes('CUTTER')
    titleCode = isCutter ? formatCutterDisplayCode(eq.equipment_code) : formatMoldDisplayCode(eq.equipment_code)
    titleName = eq.display_name || '—'
    IconComponent = isCutter ? Crop : isPlug ? Pin : Box
    categoryLabel = isCutter ? '抜き型' : isPlug ? 'プラグ' : eq.equipment_type || '設備'
    headerGradient = isCutter
      ? 'linear-gradient(135deg, var(--tint-purple-bg) 0%, var(--bg-surface-2) 100%)'
      : isPlug
      ? 'linear-gradient(135deg, var(--tint-blue-bg) 0%, var(--bg-surface-2) 100%)'
      : 'linear-gradient(135deg, var(--tint-teal-bg) 0%, var(--bg-surface-2) 100%)'
    headerTextColor = isCutter
      ? 'var(--tint-purple-text)'
      : isPlug
      ? 'var(--tint-blue-text)'
      : 'var(--tint-teal-text)'
    detailUrl = `/equipment/jobs`
    statusText = eq.usage_status || eq.device_status || 'ACTIVE'
    bindingBadge = eq.usage_status === 'DISPOSED' ? 'disposed' : 'active'
  }

  const renderBindingLabel = () => {
    const map = {
      active: { label: tPC('bindingActive') || '現行', cls: 'badge badge--success' },
      shared: { label: tPC('bindingShared') || '共有', cls: 'badge badge--info' },
      legacy: { label: tPC('bindingLegacy') || '旧版', cls: 'badge badge--neutral' },
      disposed: { label: tPC('bindingDisposed') || '廃棄', cls: 'badge badge--error' },
    }
    const cfg = map[bindingBadge] || map.active
    return <span className={cfg.cls} style={{ fontSize: 9, padding: '2px 6px' }}>{cfg.label}</span>
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 520, borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          background: headerGradient, borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <IconComponent size={18} style={{ color: headerTextColor }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: headerTextColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {categoryLabel}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {titleCode}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer', padding: 6,
              borderRadius: 6, color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body - Paper Style Specs Layout (Rule UI-10) */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Subtitle / Full Name */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {titleName}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={STATUS_BADGE[statusText] || 'badge badge--neutral'} style={{ fontSize: 9 }}>
                {statusText}
              </span>
              {renderBindingLabel()}
            </div>
          </div>

          {/* Details Paper Spec Grid */}
          {item.type === 'mold' && (() => {
            const m = item.data
            const dims = [m.actual_length_mm, m.actual_width_mm, m.actual_height_mm].filter(Boolean).join(' × ')
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('dimensions') || '寸法 (L×W×H)'}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {dims ? `${dims} mm` : '—'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>重量 (Weight)</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {m.actual_weight ? `${m.actual_weight} kg` : '—'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('rackLocation') || '保管場所'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {getRackText(m.rack_layers)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('keeperCompany') || '保管会社'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Building2 size={12} style={{ color: 'var(--text-muted)' }} /> {getKeeperText(m.keeper_company)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Cavity / Pocket</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {m.piece_count ? `${m.piece_count} pockets` : '—'}
                  </span>
                </div>
                {m.manufacturing_date && (
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>製造日 (Mfg Date)</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {m.manufacturing_date}
                    </span>
                  </div>
                )}
              </div>
            )
          })()}

          {item.type === 'cutter' && (() => {
            const c = item.data
            const dims = [c.cutter_length_mm || c.actual_length_mm, c.cutter_width_mm || c.actual_width_mm, c.cutter_height_mm || c.actual_height_mm].filter(Boolean).join(' × ')
            const cutterTypeLabel = c.cutter_type === 'CUTTER_INLINE' ? 'インライン (Dao liền)' : '別抜き (Dao rời)'
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>種別 (Type)</span>
                  <span style={{ fontWeight: 700, color: 'var(--tint-purple-text)' }}>
                    {cutterTypeLabel}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('dimensions') || '抜き型寸法'}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {dims ? `${dims} mm` : '—'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('rackLocation') || '保管場所'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {getRackText(c.rack_layers)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('keeperCompany') || '保管会社'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Building2 size={12} style={{ color: 'var(--text-muted)' }} /> {getKeeperText(c.keeper_company)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>在空状態 (Presence)</span>
                  <span style={{ fontWeight: 700, color: c.cutter_presence ? 'var(--tint-teal-text)' : 'var(--text-secondary)' }}>
                    {c.cutter_presence ? '在空 (Available)' : '保管中 (Stored)'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>運用分類 (Binding)</span>
                  <span>{renderBindingLabel()}</span>
                </div>
              </div>
            )
          })()}

          {item.type === 'equip' && (() => {
            const eq = item.data
            const isCutter = eq.equipment_type?.includes('CUTTER')
            const dims = [eq.actual_length_mm, eq.actual_width_mm, eq.actual_height_mm].filter(Boolean).join(' × ')
            const cutterTypeLabel = eq.equipment_type === 'CUTTER_INLINE' ? 'インライン (Dao liền)' : '別抜き (Dao rời)'
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('equipmentType') || '設備種別'}</span>
                  <span style={{ fontWeight: 700, color: isCutter ? 'var(--tint-purple-text)' : 'var(--text-primary)' }}>
                    {isCutter ? `抜き型 (${cutterTypeLabel})` : eq.equipment_type || '—'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('dimensions') || '寸法 (L×W×H)'}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {dims ? `${dims} mm` : '—'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('rackLocation') || '保管場所'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {getRackText(eq.rack_layers)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('keeperCompany') || '保管会社'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Building2 size={12} style={{ color: 'var(--text-muted)' }} /> {getKeeperText(eq.keeper_company)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('equipmentStatus') || 'ステータス'}</span>
                  <span className={STATUS_BADGE[statusText] || 'badge badge--neutral'} style={{ fontSize: 9, width: 'fit-content' }}>
                    {statusText}
                  </span>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Footer Action Bar */}
        <div style={{
          padding: '12px 16px', background: 'var(--bg-surface-2)',
          borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            {tCommon('close')}
          </button>

          <Link
            href={detailUrl}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 14px', textDecoration: 'none' }}
          >
            <ExternalLink size={14} />
            <span>{tPC('openDetailPage') || '詳細ページを開く'}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
