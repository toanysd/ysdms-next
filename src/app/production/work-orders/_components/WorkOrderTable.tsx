import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Calendar, Hash, Briefcase } from 'lucide-react'

interface WorkOrder {
  wo_id: string
  wo_code: string
  wo_name: string
  wo_type: string
  wo_status: string
  start_date: string | null
  deadline: string | null
  priority: number | null
  company_id: string | null
  product_id: string | null
  companies: { company_name: string } | null
  products: {
    product_name: string | null
    company_id: string | null
    companies: { company_name: string | null } | null
  } | null
}

export function WorkOrderTable({ data }: { data: WorkOrder[] }) {
  const t = useTranslations('WorkOrders')

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'PLANNED': return <span className="badge badge--info font-bold">PLANNED</span>
      case 'IN_PROGRESS': return <span className="badge badge--warning font-bold">IN PROGRESS</span>
      case 'COMPLETED': return <span className="badge badge--success font-bold">COMPLETED</span>
      case 'CANCELLED': return <span className="badge badge--neutral font-bold">CANCELLED</span>
      default: return <span className="badge badge--neutral font-bold">{st}</span>
    }
  }

  const getPriorityBadge = (p: number | null) => {
    if (!p) return <span className="badge badge--neutral font-bold" style={{ fontSize: 10 }}>NORMAL</span>
    if (p <= 2) return <span className="badge badge--error font-bold" style={{ fontSize: 10 }}>URGENT</span>
    if (p <= 4) return <span className="badge badge--warning font-bold" style={{ fontSize: 10 }}>HIGH</span>
    return <span className="badge badge--neutral font-bold" style={{ fontSize: 10 }}>NORMAL</span>
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ width: '15%' }}>{t('col_code')}</th>
          <th style={{ width: '25%' }}>{t('col_name')}</th>
          <th style={{ width: '20%' }}>{t('col_customer')}</th>
          <th style={{ width: '10%' }}>{t('col_type')}</th>
          <th style={{ width: '10%' }}>{t('col_priority')}</th>
          <th style={{ width: '10%' }}>{t('col_status')}</th>
          <th style={{ width: '10%' }}>{t('col_deadline')}</th>
        </tr>
      </thead>
      <tbody>
        {(!data || data.length === 0) ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Briefcase size={48} color="var(--border-default)" />
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 14 }}>Chưa có lệnh sản xuất nào</p>
                <Link href="/production/work-orders/new" className="btn btn-secondary flex items-center gap-1.5 cursor-pointer mt-2">
                  Tạo Lệnh Sản Xuất Đầu Tiên
                </Link>
              </div>
            </td>
          </tr>
        ) : (
          data.map((wo) => {
            const customerName = wo.companies?.company_name || wo.products?.companies?.company_name || '-'
            const productName = wo.products?.product_name || '-'

            return (
              <tr key={wo.wo_id}>
                <td>
                  <Link href={`/production/work-orders/${wo.wo_id}`} style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Hash size={14} />
                    {wo.wo_code}
                  </Link>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{wo.wo_name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{productName}</span>
                  </div>
                </td>
                <td>{customerName}</td>
                <td>
                  <span className="badge badge--neutral">{wo.wo_type}</span>
                </td>
                <td>
                  {getPriorityBadge(wo.priority)}
                </td>
                <td>
                  {getStatusBadge(wo.wo_status)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                    <Calendar size={12} />
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {wo.deadline ? new Date(wo.deadline).toISOString().split('T')[0] : '-'}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}
