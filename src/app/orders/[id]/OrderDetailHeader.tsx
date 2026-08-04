import { useTranslations } from 'next-intl'
import { Edit } from 'lucide-react'
import Link from 'next/link'
import type { OrderDetailData } from './page'

const STATUS_CONFIG: Record<string, { labelKey: string; badgeClass: string }> = {
  NEW:           { labelKey: 'statusNew', badgeClass: 'badge badge--info' },
  QUOTED:        { labelKey: 'statusQuoted', badgeClass: 'badge badge--warning' },
  APPROVED:      { labelKey: 'statusApproved', badgeClass: 'badge badge--neutral' },
  IN_PRODUCTION: { labelKey: 'statusInProduction', badgeClass: 'badge badge--success' },
  SHIPPED:       { labelKey: 'statusShipped', badgeClass: 'badge badge--neutral' },
  CANCELLED:     { labelKey: 'statusCancelled', badgeClass: 'badge badge--error' },
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
  const t = useTranslations()
  const statusCfg = STATUS_CONFIG[order.order_status] || { labelKey: '', badgeClass: 'badge badge--neutral' }

  return (
    <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 style={{ fontSize: 18, margin: 0, fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 700 }}>
            {order.order_no}
          </h1>
          <span className={statusCfg.badgeClass} style={{ fontSize: 12 }}>
            <span style={{ fontWeight: 700 }}>{statusCfg.labelKey ? t(`Orders.${statusCfg.labelKey}`) : order.order_status}</span>
          </span>
        </div>
        
        <div style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('Common.customer')}:</span>
          {order.company_id ? (
            <Link href={`/master/customers/${order.company_id}`} className="hover:underline font-bold" style={{ color: 'var(--text-primary)' }}>
              {order.companies?.company_name || '—'}
            </Link>
          ) : (
            <span style={{ fontWeight: 700 }}>{order.companies?.company_name || '—'}</span>
          )}
          {order.companies?.company_code && (
            <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-muted)' }}>({order.companies.company_code})</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!isEditing ? (
          <>
            <a 
              href={`/api/orders/${order.order_id}/export`}
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '4px 10px' }}
            >
              📊 {t('Common.exportExcel')}
            </a>
            <Link 
              href={`/orders/${order.order_id}/print`}
              target="_blank"
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '4px 10px' }}
            >
              🖨️ {t('Common.print')}
            </Link>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setIsEditing(true)}>
              <Edit size={13} /> {t('Common.edit')}
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
