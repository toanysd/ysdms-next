import { Edit } from 'lucide-react'
import Link from 'next/link'
import type { OrderDetailData } from './page'

const STATUS_CONFIG: Record<string, { label: string; labelVi: string; badgeClass: string }> = {
  NEW:           { label: '新規',   labelVi: 'Mới',         badgeClass: 'badge badge--info' },
  QUOTED:        { label: '見積済', labelVi: 'Đã báo giá',  badgeClass: 'badge badge--warning' },
  APPROVED:      { label: '承認済', labelVi: 'Đã duyệt',    badgeClass: 'badge badge--neutral' },
  IN_PRODUCTION: { label: '生産中', labelVi: 'Đang SX',     badgeClass: 'badge badge--success' },
  SHIPPED:       { label: '出荷済', labelVi: 'Đã giao',     badgeClass: 'badge badge--neutral' },
  CANCELLED:     { label: '取消',   labelVi: 'Đã huỷ',      badgeClass: 'badge badge--error' },
}

export function OrderDetailHeader({
  order,
  isEditing,
  setIsEditing,
}: {
  order: OrderDetailData
  isEditing: boolean
  setIsEditing: (v: boolean) => void
}) {
  const statusCfg = STATUS_CONFIG[order.order_status] || { label: order.order_status, labelVi: '', badgeClass: 'badge badge--neutral' }

  return (
    <div className="card-flat" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
          <Edit size={12} />
          <span>受注 / ĐƠN HÀNG</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 20, margin: 0, fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 700 }}>
            {order.order_no}
          </h1>
          <span className={statusCfg.badgeClass} style={{ fontSize: 12 }}>
            <span style={{ fontFamily: 'var(--font-jp)', fontWeight: 700 }}>{statusCfg.label}</span>
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          得意先: {' '}
          {order.company_id ? (
            <Link href={`/master/customers/${order.company_id}`} className="hover:underline font-bold" style={{ color: 'var(--accent)' }}>
              {order.companies?.company_name || '—'}
            </Link>
          ) : (
            <span style={{ fontWeight: 600 }}>{order.companies?.company_name || '—'}</span>
          )}
          {order.companies?.company_code && <span style={{ marginLeft: 6, fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>({order.companies.company_code})</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!isEditing ? (
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
            <Edit size={14} /> 編集 / Sửa
          </button>
        ) : null}
      </div>
    </div>
  )
}
