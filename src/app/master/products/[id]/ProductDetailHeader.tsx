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
  const tProd = useTranslations('Products')
  const tMaster = useTranslations('Master')
  const tCommon = useTranslations('Common')
  const tCust = useTranslations('Customers')

  const customer = product.companies
  const statusKey = product.product_status === 'ACTIVE' ? 'activeStatus' : product.product_status === 'MAINTENANCE' ? 'maintenanceStatus' : 'disposedStatus'
  const statusText = tMaster(statusKey)

  return (
    <div
      className="card-flat"
      style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Package size={14} style={{ color: 'var(--accent)' }} />
        <span>{tProd('title')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h1
            style={{
              margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', fontFamily: 'monospace',
            }}
          >
            {product.product_code}
          </h1>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
            {product.product_name}
          </span>
        </div>

        <StatusBadge 
          status={product.product_status} 
          label={statusText} 
        />

        {!isEditing && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary text-xs flex items-center gap-1 cursor-pointer" onClick={() => setIsEditing(true)}>
              <Pencil size={14} />
              {tCommon('edit')}
            </button>
          </div>
        )}
      </div>

      {/* Metadata chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {customer && (
          <Link
            href={`/master/customers/${customer.company_id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 700,
            }}
          >
            <Building2 size={12} style={{ color: 'var(--accent)' }} />
            <span>{customer.company_name}</span>
          </Link>
        )}

        {product.customer_product_name && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace', fontWeight: 600,
            }}
          >
            <Tag size={12} />
            {product.customer_product_name}
          </span>
        )}

        {product.product_code && (
          <Link
            href={`/engineering/designs/${product.product_id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 700,
            }}
          >
            <Layers size={12} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'monospace' }}>{product.product_code}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

