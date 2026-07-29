'use client'

import { useTranslations } from 'next-intl'

import { Truck } from 'lucide-react'
import Link from 'next/link'

export function ShipmentDetailHeader({ shipment }: { shipment: any }) {
  const t = useTranslations()

  const isShipped = shipment.status === 'SHIPPED'
  const isDelivered = shipment.status === 'DELIVERED'
  const isCancelled = shipment.status === 'CANCELLED'
  const isPending = shipment.status === 'PENDING'

  let badgeClass = 'badge--neutral'
  let labelKey = 'statusPending'

  if (isShipped) {
    badgeClass = 'badge--info'
    labelKey = 'statusShipped'
  } else if (isDelivered) {
    badgeClass = 'badge--success'
    labelKey = 'statusDelivered'
  } else if (isCancelled) {
    badgeClass = 'badge--error'
    labelKey = 'statusCancelled'
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
              {shipment.delivery_note_no || t('Shipments.notSet')}
            </h1>
            <span className={`badge ${badgeClass}`}>{t(`Shipments.${labelKey}`)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>
              {t('Orders.maH')}
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', marginLeft: 4 }}>
                {shipment.orders?.order_no || '-'}
              </span>
            </span>
            <span>•</span>
            <span>
              {t('Orders.khachHang')}
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
          🖨️ {t('Orders.inPhieuGiao')}
        </Link>
      </div>
    </div>
  )
}
