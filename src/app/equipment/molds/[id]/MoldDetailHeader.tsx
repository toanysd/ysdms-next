'use client'

import {
  Box, Building2, MapPin, Pencil, Tag, Layers, Scale, RefreshCw, FileCog
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { MoldDetailData } from './page'

export function MoldDetailHeader({ mold, isEditing, setIsEditing, onOpenReviseModal }: { mold: MoldDetailData; isEditing: boolean; setIsEditing: (v: boolean) => void; onOpenReviseModal?: () => void }) {
  const t = useTranslations()

  const STATUS_LABELS: Record<string, { label: string; badgeClass: string }> = {
    ACTIVE:      { label: t('Equipment.statusActive'),      badgeClass: 'badge badge--success' },
    MAINTENANCE: { label: t('Equipment.statusMaintenance'), badgeClass: 'badge badge--warning' },
    DISPOSED:    { label: t('Equipment.statusDisposed'),    badgeClass: 'badge badge--error' },
  }

  const USAGE_LABELS: Record<string, { label: string; badgeClass: string }> = {
    IN_STOCK:     { label: t('Equipment.statusInStock'),     badgeClass: 'badge badge--success' },
    IN_USE:       { label: t('Equipment.statusInUse'),       badgeClass: 'badge badge--info' },
    OUT_OF_STOCK: { label: t('Equipment.statusOutOfStock'),  badgeClass: 'badge badge--neutral' },
  }

  const deviceStatusInfo = STATUS_LABELS[mold.device_status || ''] || { label: mold.device_status || '—', badgeClass: 'badge badge--neutral' }
  const usageStatusInfo = USAGE_LABELS[mold.usage_status || ''] || { label: mold.usage_status || '—', badgeClass: 'badge badge--neutral' }

  const rev = mold.mold_revisions
  const product = rev?.products
  const customer = product?.companies
  const rack = mold.rack_layers
  const keeper = mold.keeper_company

  const dims = [mold.actual_length_mm, mold.actual_width_mm, mold.actual_height_mm]
    .filter(Boolean)
    .join(' × ')

  return (
    <div
      className="card-flat"
      style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
        <Box size={14} className="text-[var(--accent)]" />
        <span>{t('Equipment.moldTitle')}</span>
      </div>
      
      {/* Row 1: Main info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1
            style={{
              margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--accent)', fontFamily: 'monospace',
            }}
          >
            {mold.equipment_code}
          </h1>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {mold.display_name}
          </span>
        </div>

        <span className={deviceStatusInfo.badgeClass}>{deviceStatusInfo.label}</span>
        <span className={usageStatusInfo.badgeClass}>{usageStatusInfo.label}</span>

        {/* Rack location badge */}
        {rack && (
          <span className="badge badge--info font-mono font-bold text-[12px]">
            <MapPin size={12} />
            {rack.racks?.rack_code || '?'}-{rack.layer_code}
          </span>
        )}

        {!isEditing && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {onOpenReviseModal && (
              <button className="btn btn-secondary text-xs font-bold" onClick={onOpenReviseModal}>
                <RefreshCw size={14} />
                {t('Equipment.reviseRev')}
              </button>
            )}
            <button className="btn btn-secondary text-xs font-bold" onClick={() => setIsEditing(true)}>
              <Pencil size={14} />
              {t('Common.edit')}
            </button>
          </div>
        )}
      </div>

      {/* Row 2: Metadata chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Product code */}
        {product && (
          <Link
            href={`/master/products?search=${encodeURIComponent(product.product_code)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 700, fontFamily: 'monospace'
            }}
          >
            <Layers size={12} />
            <span>{product.product_code}</span>
          </Link>
        )}

        {/* Design Revision */}
        {rev && rev.revision_code && product && (
          <Link
            href={`/engineering/designs/${product.product_id || product.product_code}?revision=${encodeURIComponent(rev.revision_code)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 12, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 700, fontFamily: 'monospace'
            }}
          >
            <FileCog size={12} style={{ color: 'var(--text-muted)' }} />
            <span>{rev.revision_code}</span>
          </Link>
        )}

        {/* Product name */}
        {product?.product_name_internal && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 12, color: 'var(--text-primary)', fontWeight: 600
            }}
          >
            <Tag size={12} style={{ color: 'var(--text-muted)' }} />
            <span>{product.product_name_internal}</span>
          </span>
        )}

        {/* Customer */}
        {customer && (
          <Link
            href={`/master/customers/${customer.company_id || ''}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 12, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600
            }}
          >
            <Building2 size={12} style={{ color: 'var(--text-muted)' }} />
            <span>{customer.company_name}</span>
          </Link>
        )}

        {/* Keeper company */}
        {keeper && (
          <span className="badge badge--info font-bold text-[12px]">
            <Building2 size={12} />
            <span>{t('Equipment.keeperLabel')}</span>
            {keeper.company_name}
          </span>
        )}

        {/* Dimensions */}
        {dims && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 12, color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 700
            }}
          >
            <Scale size={12} style={{ color: 'var(--text-muted)' }} />
            {dims} mm
            {mold.actual_weight && ` | ${mold.actual_weight}kg`}
          </span>
        )}
      </div>
    </div>
  )
}

