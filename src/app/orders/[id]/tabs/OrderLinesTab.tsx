import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { OrderDetailData } from '../page'

export function OrderLinesTab({ order }: { order: OrderDetailData }) {
  const t = useTranslations('Orders')
  const lines = order.order_lines || []

  if (lines.length === 0) {
    return (
      <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        {t('noOrderLines')}
      </div>
    )
  }

  return (
    <div className="card-flat custom-scrollbar" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 60, textAlign: 'center' }}>No.</th>
            <th>{t('colProductCode')}</th>
            <th>{t('productName')}</th>
            <th style={{ width: 100, textAlign: 'right' }}>{t('quantity')}</th>
            <th style={{ width: 100 }}>{t('itemType')}</th>
            <th style={{ width: 120 }}>{t('ngayXuat')}</th>
            <th style={{ width: 120 }}>{t('deliveryDate')}</th>
            <th style={{ width: 120 }}>{t('soThung')}</th>
            <th style={{ width: 100, textAlign: 'center' }}>{t('trangThai')}</th>
          </tr>
        </thead>
        <tbody>
          {lines.sort((a, b) => a.line_no - b.line_no).map(line => (
            <tr key={line.line_id}>
              <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {line.line_no}
              </td>
              <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                {line.product_id ? (
                  <Link href={`/master/products/${line.product_id}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
                    {line.products?.product_code || line.product_id}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {line.products?.product_name || '—'}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                {line.quantity} <span style={{fontSize: 11, fontWeight: 'normal', color: 'var(--text-muted)'}}>{line.unit}</span>
              </td>
              <td>
                {line.charge_type === 'FREE' && <span className="badge badge--warning">{t('chargeTypeFree')}</span>}
                {line.charge_type === 'PAID' && <span className="badge badge--success">{t('chargeTypePaid')}</span>}
                {line.charge_type === 'OFFICE_SAMPLE' && <span className="badge badge--info">{t('chargeTypeOffice')}</span>}
              </td>
              <td style={{ fontFamily: 'monospace' }}>{line.ship_date || '—'}</td>
              <td style={{ fontFamily: 'monospace' }}>{line.due_date || '—'}</td>
              <td>{line.packing_style || '—'}</td>
              <td style={{ textAlign: 'center' }}>
                <span className="badge badge--neutral">{line.line_status || line.status || 'NEW'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
