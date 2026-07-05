import { Package, Pencil, Building2, Tag, Layers } from 'lucide-react'
import Link from 'next/link'
import type { ProductDetailData } from './page'

const STATUS_LABELS: Record<string, { ja: string; color: string; bg: string; border: string }> = {
  ACTIVE: {
    ja: '有効',
    color: 'var(--status-success)',
    bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)',
    border: 'color-mix(in srgb, var(--status-success) 25%, transparent)',
  },
  MAINTENANCE: {
    ja: 'メンテ中',
    color: 'var(--status-warning)',
    bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)',
    border: 'color-mix(in srgb, var(--status-warning) 25%, transparent)',
  },
  DISPOSED: {
    ja: '廃止',
    color: 'var(--text-muted)',
    bg: 'color-mix(in srgb, var(--text-muted) 12%, transparent)',
    border: 'color-mix(in srgb, var(--text-muted) 25%, transparent)',
  },
}

function StatusBadge({ status }: { status: string | null }) {
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
      {s.ja}
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
  const customer = product.companies
  // Products = MoldMasters = Tray (same entity)

  return (
    <div
      className="card-flat"
      style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
        <Package size={12} />
        <span>製品 / Sản phẩm</span>
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

        <StatusBadge status={product.product_status} />

        {!isEditing && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary text-xs" onClick={() => setIsEditing(true)}>
              <Pencil size={14} />
              編集 / Sửa
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
            title="顧客を開く / Mở khách hàng"
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
            title="設計版管理を開く / Mở trang quản lý thiết kế"
          >
            <Layers size={10} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{product.product_code}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
