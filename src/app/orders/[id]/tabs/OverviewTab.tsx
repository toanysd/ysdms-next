import { useTranslations } from 'next-intl'
import type { OrderDetailData } from '../page'

export function OverviewTab({
  order,
}: {
  order: OrderDetailData
  isEditing: boolean
  formData: Partial<OrderDetailData>
  setFormData: (val: any) => void
}) {
  const t = useTranslations('Orders')

  return (
    <div className="card-flat" style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{t('customerPO')}</div>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{order.customer_order_no || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{t('lotNo')}</div>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{order.lot_no || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{t('orderType')}</div>
          <div>
            <span className={order.order_type === 'MOLD' ? 'badge badge--warning' : 'badge badge--info'}>
              {order.order_type === 'MOLD' ? t('orderTypeMold') : t('orderTypeProduct')}
            </span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{t('orderDate')}</div>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{order.order_date || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{t('deliveryDate')}</div>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{order.requested_delivery || '—'}</div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{t('notes')}</div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{order.notes || '—'}</div>
        </div>
      </div>
    </div>
  )
}
