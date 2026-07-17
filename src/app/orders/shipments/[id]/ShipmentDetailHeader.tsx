'use client'

import { Truck } from 'lucide-react'
import Link from 'next/link'

export function ShipmentDetailHeader({ shipment }: { shipment: any }) {
  const isShipped = shipment.status === 'SHIPPED'
  const isDelivered = shipment.status === 'DELIVERED'
  const isCancelled = shipment.status === 'CANCELLED'
  const isPending = shipment.status === 'PENDING'

  let badgeClass = 'badge--neutral'
  let labelJa = '未出荷'
  let labelVi = 'Chưa xuất'

  if (isShipped) {
    badgeClass = 'badge--info'
    labelJa = '出荷済'
    labelVi = 'Đã xuất'
  } else if (isDelivered) {
    badgeClass = 'badge--success'
    labelJa = '納品済'
    labelVi = 'Đã giao'
  } else if (isCancelled) {
    badgeClass = 'badge--error'
    labelJa = 'キャンセル'
    labelVi = 'Hủy'
  }

  return (
    <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Truck size={20} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {shipment.delivery_note_no || '未設定 (No Delivery Note)'}
            </h1>
            <span className={`badge ${badgeClass}`}>{labelJa}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>
              <span className="ja">受注番号:</span>
              <span className="vi" style={{ fontSize: 10, marginLeft: 4 }}>Mã ĐH:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', marginLeft: 4 }}>
                {shipment.orders?.order_no || '-'}
              </span>
            </span>
            <span>•</span>
            <span>
              <span className="ja">得意先:</span>
              <span className="vi" style={{ fontSize: 10, marginLeft: 4 }}>Khách hàng:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginLeft: 4 }}>
                {shipment.orders?.companies?.company_name || '-'}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <Link 
          href={`/orders/shipments/${shipment.shipment_id}/print`}
          target="_blank"
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          🖨️ <span className="ja">納品書印刷</span><span className="vi" style={{ fontSize: 11 }}>In phiếu giao</span>
        </Link>
      </div>
    </div>
  )
}
