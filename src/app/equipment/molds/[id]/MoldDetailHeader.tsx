import {
  Box, Building2, MapPin, Pencil, Tag, Layers, Scale, RefreshCw, FileCog
} from 'lucide-react'
import Link from 'next/link'
import type { MoldDetailData } from './page'

const STATUS_LABELS: Record<string, { ja: string; color: string }> = {
  ACTIVE:      { ja: '使用中',    color: 'var(--status-success)' },
  MAINTENANCE: { ja: 'メンテ中',  color: 'var(--status-warning)' },
  DISPOSED:    { ja: '廃棄済',    color: 'var(--status-error)' },
}

const USAGE_LABELS: Record<string, { ja: string; color: string }> = {
  IN_STOCK:     { ja: '在庫',   color: 'var(--status-success)' },
  IN_USE:       { ja: '使用中', color: 'var(--status-info)' },
  OUT_OF_STOCK: { ja: '出庫済', color: 'var(--text-muted)' },
}

function StatusBadge({ status, labels }: { status: string | null; labels: Record<string, { ja: string; color: string }> }) {
  const s = labels[status || ''] || { ja: status || '—', color: 'var(--text-muted)' }
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: '1px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
        color: s.color,
        background: `color-mix(in srgb, ${s.color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${s.color} 25%, transparent)`,
        whiteSpace: 'nowrap',
      }}
    >
      {s.ja}
    </span>
  )
}

export function MoldDetailHeader({ mold, isEditing, setIsEditing, onOpenReviseModal }: { mold: MoldDetailData; isEditing: boolean; setIsEditing: (v: boolean) => void; onOpenReviseModal?: () => void }) {
  const rev = mold.mold_revisions
  const product = rev?.products
  const customer = product?.companies
  const rack = mold.rack_layers
  const keeper = mold.keeper_company

  // Build dimension string
  const dims = [mold.actual_length_mm, mold.actual_width_mm, mold.actual_height_mm]
    .filter(Boolean)
    .join(' × ')

  return (
    <div
      className="card-flat"
      style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
        <Box size={12} />
        <span>金型 / KHUÔN VẬT LÝ</span>
      </div>
      {/* Row 1: Main info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h1
            style={{
              margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', fontFamily: 'var(--font-jp)',
            }}
          >
            {mold.system_code}
          </h1>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {mold.display_name}
          </span>
        </div>

        <StatusBadge status={mold.device_status} labels={STATUS_LABELS} />
        <StatusBadge status={mold.usage_status} labels={USAGE_LABELS} />

        {/* Rack location badge */}
        {rack && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'color-mix(in srgb, var(--accent) 8%, var(--bg-surface))',
              border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
              fontSize: 10, fontWeight: 700, color: 'var(--accent)',
            }}
          >
            <MapPin size={10} />
            {rack.racks?.rack_code || '?'}-{rack.layer_code}
          </span>
        )}

        {!isEditing && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {onOpenReviseModal && (
              <button className="btn btn-secondary text-xs" onClick={onOpenReviseModal}>
                <RefreshCw size={14} />
                版更新 / Cập nhật Rev
              </button>
            )}
            <button className="btn btn-secondary text-xs" onClick={() => setIsEditing(true)}>
              <Pencil size={14} />
              編集 / Sửa
            </button>
          </div>
        )}
      </div>

      {/* Row 2: Metadata chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingLeft: 32 }}>
        {/* Product code */}
        {product && (
          <Link
            href={`/master/products?search=${encodeURIComponent(product.product_code)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 10, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600,
            }}
            title="製品を開く / Mở sản phẩm"
          >
            <Layers size={10} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{product.product_code}</span>
          </Link>
        )}

        {/* Design Revision */}
        {rev && rev.revision_code && product && (
          <Link
            href={`/engineering/designs/${product.product_id || product.product_code}?revision=${encodeURIComponent(rev.revision_code)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 10, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600,
            }}
            title="設計版を開く / Xem phiên bản thiết kế"
          >
            <FileCog size={10} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{rev.revision_code}</span>
          </Link>
        )}

        {/* Product name */}
        {product?.product_name_internal && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 10, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600,
            }}
          >
            <Tag size={10} style={{ color: 'var(--text-secondary)' }} />
            <span>{product.product_name_internal}</span>
          </span>
        )}

        {/* Customer */}
        {customer && (
          <Link
            href={`/master/customers/${customer.company_id || ''}`}
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

        {/* Keeper company */}
        {keeper && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'color-mix(in srgb, var(--status-info) 8%, var(--bg-surface))',
              border: '1px solid color-mix(in srgb, var(--status-info) 20%, transparent)',
              fontSize: 10, color: 'var(--status-info)', fontWeight: 600,
            }}
          >
            <Building2 size={10} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>保管:</span>
            {keeper.company_name}
          </span>
        )}

        {/* Dimensions */}
        {dims && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
              fontSize: 10, color: 'var(--text-secondary)',
            }}
          >
            <Scale size={10} />
            {dims} mm
            {mold.actual_weight && ` | ${mold.actual_weight}kg`}
          </span>
        )}
      </div>
    </div>
  )
}
