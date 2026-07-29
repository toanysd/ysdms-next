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
    <div className="card-flat" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
          <Edit size={12} />
          <span>{t('Common.order')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 20, margin: 0, fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 700 }}>
            {order.order_no}
          </h1>
          <span className={statusCfg.badgeClass} style={{ fontSize: 12 }}>
            <span style={{ fontFamily: 'var(--font-jp)', fontWeight: 700 }}>{statusCfg.labelKey ? t(`Orders.${statusCfg.labelKey}`) : order.order_status}</span>
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {t('Common.customer')}: {' '}
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
          <>
            <a 
              href={`/api/orders/${order.order_id}/export`}
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary"
            >
              📊 {t('Common.exportExcel')}
            </a>
            <Link 
              href={`/orders/${order.order_id}/print`}
              target="_blank"
              className="btn btn-secondary"
            >
              🖨️ {t('Common.print')}
            </Link>
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              <Edit size={14} /> {t('Common.edit')}
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
