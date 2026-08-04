export const dynamic = 'force-dynamic'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getOrdersReport, getOrdersByMonth } from '@/app/actions/reports'
import { ArrowLeft, ClipboardList, Calendar } from 'lucide-react'
import ExportCSVButton from '@/components/reports/ExportCSVButton'

export default async function OrdersReportPage() {
  const t = useTranslations('Reports')
  const [orders, monthlyGroups] = await Promise.all([
    getOrdersReport(),
    getOrdersByMonth(),
  ])

  const totalOrders = orders.length
  const totalQty = orders.reduce((s, r) => s + Number(r.total_qty || 0), 0)
  const totalAmount = orders.reduce((s, r) => s + Number(r.total_amount || 0), 0)
  const uniqueCustomers = new Set(orders.map(o => o.customer_id)).size

  const fmt = (v: number) => new Intl.NumberFormat('en-US').format(v)
  const fmtCurrency = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

  // Status distribution
  const statusDist: Record<string, number> = {}
  orders.forEach(o => {
    statusDist[o.status] = (statusDist[o.status] || 0) + 1
  })
  const maxStatusVal = Math.max(...Object.values(statusDist), 1)

  const statusConfigs: Record<string, { label: string; badgeClass: string }> = {
    draft: { label: t('statusMap.draft'), badgeClass: 'badge badge--neutral' },
    pending: { label: t('statusMap.pending'), badgeClass: 'badge badge--warning' },
    confirmed: { label: t('statusMap.confirmed'), badgeClass: 'badge badge--info' },
    in_production: { label: t('statusMap.in_production'), badgeClass: 'badge badge--info' },
    shipped: { label: t('statusMap.shipped'), badgeClass: 'badge badge--success' },
    delivered: { label: t('statusMap.delivered'), badgeClass: 'badge badge--success' },
    cancelled: { label: t('statusMap.cancelled'), badgeClass: 'badge badge--error' },
  }

  const csvHeaders = {
    slip_no: t('csvHeaders.slipNo'),
    order_date: t('csvHeaders.orderDate'),
    customer_name: t('csvHeaders.customerName'),
    customer_code: t('csvHeaders.customerCode'),
    status: t('csvHeaders.status'),
    order_type: t('csvHeaders.orderType'),
    line_count: t('csvHeaders.lineCount'),
    total_qty: t('csvHeaders.totalQty'),
    total_amount: t('csvHeaders.totalAmount'),
    approval_status: t('csvHeaders.approvalStatus'),
    created_at: t('csvHeaders.createdAt'),
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] rounded-lg overflow-hidden m-2 border border-[var(--border-default)]">
      {/* Header */}
      <div className="h-[48px] bg-[var(--tint-teal-bg)] px-4 flex items-center justify-between border-b border-[var(--border-default)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/reports" className="text-[var(--accent)] hover:opacity-80 transition-colors" title="Back">
            <ArrowLeft size={18} />
          </Link>
          <ClipboardList size={20} className="text-[var(--accent)]" />
          <h2 className="text-[14px] font-bold text-[var(--text-primary)] flex flex-col">
            {t('ordersReportTitle')}
            <span className="text-[var(--text-muted)] font-normal mt-[-2px] text-[10px]">{t('ordersReportSubtitle')}</span>
          </h2>
        </div>

        <ExportCSVButton
          data={orders as unknown as Record<string, unknown>[]}
          filename="YSDMS_Orders_Report"
          headers={csvHeaders}
          label={t('csvExport')}
        />
      </div>

      <div className="flex-1 overflow-auto">

        {/* KPI Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide">{t('totalOrders')}</p>
            <p className="text-xl font-black text-[var(--accent)] mt-1">{fmt(totalOrders)} <span className="text-xs font-normal text-[var(--text-muted)]">{t('ordersUnit')}</span></p>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide">{t('totalProduction')}</p>
            <p className="text-xl font-black text-[var(--status-success)] mt-1">{fmt(totalQty)} <span className="text-xs font-normal text-[var(--text-muted)]">{t('productsUnit')}</span></p>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide">{t('totalRevenue')}</p>
            <p className="text-xl font-black text-[var(--status-warning)] mt-1">{fmtCurrency(totalAmount)}</p>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide">{t('customersCount')}</p>
            <p className="text-xl font-black text-[var(--text-primary)] mt-1">{uniqueCustomers} <span className="text-xs font-normal text-[var(--text-muted)]">{t('customersUnit')}</span></p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border-b border-[var(--border-default)]">
          {/* Status Distribution */}
          <div className="card-flat p-4">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <ClipboardList size={14} className="text-[var(--text-muted)]" />
              {t('statusDistribution')}
            </h3>
            <div className="flex flex-col gap-2">
              {Object.entries(statusDist).map(([status, count]) => {
                const pct = Math.max((count / maxStatusVal) * 100, 3)
                const statusInfo = statusConfigs[status] || { label: status, badgeClass: 'badge badge--neutral' }
                return (
                  <div key={status} className="flex items-center gap-2">
                    <div className="w-[100px]">
                      <span className={statusInfo.badgeClass}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex-1 h-4 bg-[var(--border-default)]/30 rounded overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs font-bold text-[var(--text-primary)]">{count}</div>
                  </div>
                )
              })}
              {Object.keys(statusDist).length === 0 && (
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
              )}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="card-flat p-4">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Calendar size={14} className="text-[var(--text-muted)]" />
              {t('ordersByMonth')}
            </h3>
            <div className="flex flex-col gap-1.5">
              {monthlyGroups.slice(0, 6).map(g => {
                const maxMonthOrders = Math.max(...monthlyGroups.map(m => m.order_count), 1)
                const pct = Math.max((g.order_count / maxMonthOrders) * 100, 3)
                return (
                  <div key={g.month} className="flex items-center gap-2">
                    <div className="w-[70px] text-xs font-mono text-[var(--text-secondary)]">{g.month.substring(0, 7)}</div>
                    <div className="flex-1 h-4 bg-[var(--border-default)]/30 rounded overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-[130px] text-right text-[11px] text-[var(--text-secondary)]">
                      <span className="font-bold text-[var(--text-primary)]">{g.order_count}</span> {t('ordersUnit')}
                      <span className="text-[var(--text-muted)] mx-1">|</span>
                      <span className="font-bold text-[var(--text-primary)]">{fmt(g.total_qty)}</span> {t('productsUnit')}
                    </div>
                  </div>
                )
              })}
              {monthlyGroups.length === 0 && (
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Detail Table */}
        <div className="overflow-auto card-flat">
          <table className="data-table min-w-[1000px]">
            <thead>
              <tr>
                <th className="font-bold">{t('tableHeaders.slipNo')}</th>
                <th className="font-bold">{t('tableHeaders.orderDate')}</th>
                <th className="font-bold">{t('tableHeaders.customer')}</th>
                <th className="font-bold text-center">{t('tableHeaders.status')}</th>
                <th className="font-bold">{t('tableHeaders.type')}</th>
                <th className="font-bold text-right">{t('tableHeaders.lineCount')}</th>
                <th className="font-bold text-right">{t('tableHeaders.totalQty')}</th>
                <th className="font-bold text-right">{t('tableHeaders.totalAmount')}</th>
                <th className="font-bold text-center">{t('tableHeaders.approved')}</th>
                <th className="font-bold">{t('tableHeaders.createdAt')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => {
                const statusInfo = statusConfigs[row.status] || { label: row.status, badgeClass: 'badge badge--neutral' }
                return (
                  <tr key={row.id}>
                    <td>
                      <Link
                        href={`/orders/${row.id}`}
                        className="font-mono text-[13px] font-bold text-[var(--accent)] hover:underline"
                      >
                        {row.slip_no || '-'}
                      </Link>
                    </td>
                    <td className="font-mono text-[13px] font-bold" style={{ color: 'var(--text-secondary)' }}>{row.order_date?.substring(0, 10)}</td>
                    <td>
                      <div className="font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>{row.customer_name || '-'}</div>
                      {row.customer_code && <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{row.customer_code}</div>}
                    </td>
                    <td className="text-center">
                      <span className={statusInfo.badgeClass}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="capitalize text-[13px]" style={{ color: 'var(--text-secondary)' }}>{row.order_type || '-'}</td>
                    <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--text-muted)' }}>{row.line_count}</td>
                    <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{fmt(Number(row.total_qty))}</td>
                    <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--status-warning)' }}>{fmtCurrency(Number(row.total_amount))}</td>
                    <td className="text-center">
                      <span className={`badge ${row.approval_status === 'approved' ? 'badge--success' : 'badge--neutral'}`}>
                        {row.approval_status || '-'}
                      </span>
                    </td>
                    <td className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {row.created_at ? new Date(row.created_at).toLocaleDateString('ja-JP') : '-'}
                    </td>
                  </tr>
                )
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center italic" style={{ color: 'var(--text-muted)' }}>
                    {t('noOrdersData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span>{t('footerOrdersStats', { total: totalOrders, qty: fmt(totalQty), amount: fmtCurrency(totalAmount) })}</span>
          <span>{t('footerOrdersSource')}</span>
        </div>
      </div>
    </div>
  )
}
