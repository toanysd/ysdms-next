'use client'

import { Package, Pencil, Building2, Tag, Layers } from 'lucide-react'
import Link from 'next/link'
import type { ProductDetailData } from './page'
import { useTranslations } from 'next-intl'

const STATUS_LABELS: Record<string, { color: string; bg: string; border: string }> = {
  ACTIVE: {
    color: 'var(--status-success)',
    bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)',
    border: 'color-mix(in srgb, var(--status-success) 25%, transparent)',
  },
  MAINTENANCE: {
    color: 'var(--status-warning)',
    bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)',
    border: 'color-mix(in srgb, var(--status-warning) 25%, transparent)',
  },
  DISPOSED: {
    color: 'var(--text-muted)',
    bg: 'color-mix(in srgb, var(--text-muted) 12%, transparent)',
    border: 'color-mix(in srgb, var(--text-muted) 25%, transparent)',
  },
}

function StatusBadge({ status, label }: { status: string | null; label: string }) {
  const s = STATUS_LABELS[status || ''] || STATUS_LABELS.DISPOSED
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export function ProductDetailHeader({
  product,
  isEditing,
  setIsEditing,
}: {
  product: ProductDetailData
  isEditing: boolean
  setIsEditing: (v: boolean) => void
}) {
  const t = useTranslations('Master.Products.Header')
  const tOverview = useTranslations('Master.Products.Overview')
  const customer = product.companies

  return (
    <div
      className="card-flat"
      style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
        <Package size={12} />
        <span>{t('title')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h1
            style={{
              margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', fontFamily: 'var(--font-jp)',
            }}
          >
            {product.product_code}
          </h1>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {product.product_name}
          </span>
        </div>

        <StatusBadge 
          status={product.product_status} 
          label={tOverview(`statusLabels.${product.product_status || 'ACTIVE'}`)} 
        />

        {!isEditing && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary text-xs" onClick={() => setIsEditing(true)}>
              <Pencil size={14} />
              {t('edit')}
            </button>
          </div>
        )}
      </div>

      {/* Metadata chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingLeft: 32 }}>
        {customer && (
          <Link
            href={`/master/customers/${customer.company_id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 10, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600,
            }}
            title={t('openCustomer')}
          >
            <Building2 size={10} style={{ color: 'var(--text-secondary)' }} />
            <span>{customer.company_name}</span>
          </Link>
        )}

        {product.customer_product_name && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 10, color: 'var(--text-secondary)',
            }}
          >
            <Tag size={10} />
            {product.customer_product_name}
          </span>
        )}

        {product.product_code && (
          <Link
            href={`/engineering/designs/${product.product_id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 10, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600,
            }}
            title={t('openDesigns')}
          >
            <Layers size={10} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{product.product_code}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
