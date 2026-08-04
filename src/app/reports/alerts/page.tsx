export const dynamic = 'force-dynamic'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getInventoryReport } from '@/app/actions/reports'
import { ArrowLeft, AlertTriangle, Bell, ShieldCheck, TrendingDown } from 'lucide-react'

/**
 * Sprint 5B-3: Cảnh báo Reorder & Giám sát Ngưỡng Tồn kho
 * Hiển thị danh sách nhựa dưới ngưỡng tối thiểu (min_threshold_kg / reorder_point_kg)
 */
export default async function AlertsPage() {
  const t = useTranslations('Reports')
  const inventory = await getInventoryReport()

  // Phân loại: Critical (is_low_stock) vs Normal
  const criticalItems = inventory.filter(r => r.is_low_stock)
  const normalItems = inventory.filter(r => !r.is_low_stock)

  // Phân mức cảnh báo chi tiết
  const getAlertLevel = (current: number, threshold: number | null): { level: string; color: string; icon: string; bg: string; border: string } => {
    if (!threshold || threshold <= 0) return { level: t('alertLevels.notSet'), color: 'text-[var(--text-muted)]', icon: '—', bg: 'bg-[var(--bg-base)]', border: 'border-[var(--border-default)]' }
    const ratio = current / threshold
    if (ratio <= 0) return { level: t('alertLevels.outOfStock'), color: 'text-[var(--status-error)]', icon: '🔴', bg: 'bg-[var(--tint-red-bg)]/40', border: 'border-[var(--status-error)]/30' }
    if (ratio <= 0.5) return { level: t('alertLevels.critical'), color: 'text-[var(--status-error)]', icon: '🔴', bg: 'bg-[var(--tint-red-bg)]/30', border: 'border-[var(--status-error)]/20' }
    if (ratio <= 1.0) return { level: t('alertLevels.warning'), color: 'text-[var(--status-warning)]', icon: '🟡', bg: 'bg-[var(--tint-orange-bg)]/30', border: 'border-[var(--status-warning)]/20' }
    if (ratio <= 1.5) return { level: t('alertLevels.monitoring'), color: 'text-[var(--accent)]', icon: '🔵', bg: 'bg-[var(--tint-teal-bg)]/30', border: 'border-[var(--accent)]/20' }
    return { level: t('alertLevels.normal'), color: 'text-[var(--status-success)]', icon: '🟢', bg: 'bg-[var(--tint-teal-bg)]/20', border: 'border-[var(--status-success)]/20' }
  }

  const fmt = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(v)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] rounded-lg overflow-hidden m-2 border border-[var(--border-default)]">
      {/* Header */}
      <div className="h-[48px] bg-[var(--tint-teal-bg)] px-4 flex items-center justify-between border-b border-[var(--border-default)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/reports" className="text-[var(--accent)] hover:opacity-80 transition-colors" title="Back">
            <ArrowLeft size={18} />
          </Link>
          <Bell size={20} className="text-[var(--accent)]" />
          <h2 className="text-[14px] font-bold text-[var(--text-primary)] flex flex-col">
            {t('alertsTitle')}
            <span className="text-[var(--text-muted)] font-normal mt-[-2px] text-[10px]">{t('alertsSubtitle')}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {criticalItems.length > 0 ? (
            <span className="badge badge--error animate-pulse flex items-center gap-1">
              <AlertTriangle size={12} />
              {t('alertsCount', { count: criticalItems.length })}
            </span>
          ) : (
            <span className="badge badge--success flex items-center gap-1">
              <ShieldCheck size={12} />
              {t('systemStable')}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">

        {/* Summary Banner */}
        <div className={`p-4 border-b flex items-center gap-3 ${criticalItems.length > 0 ? 'bg-[var(--tint-red-bg)]/40 border-[var(--border-default)]' : 'bg-[var(--tint-teal-bg)]/40 border-[var(--border-default)]'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${criticalItems.length > 0 ? 'bg-[var(--tint-red-bg)]' : 'bg-[var(--tint-teal-bg)]'}`}>
            {criticalItems.length > 0
              ? <AlertTriangle size={24} className="text-[var(--status-error)]" />
              : <ShieldCheck size={24} className="text-[var(--status-success)]" />
            }
          </div>
          <div>
            <h3 className={`text-sm font-bold ${criticalItems.length > 0 ? 'text-[var(--status-error)]' : 'text-[var(--text-primary)]'}`}>
              {criticalItems.length > 0
                ? t('attentionNeeded', { count: criticalItems.length })
                : t('stableAll')
              }
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {t('summaryStats', { total: inventory.length, normal: normalItems.length, warning: criticalItems.length })}
            </p>
          </div>
        </div>

        {/* Critical Alerts Section */}
        {criticalItems.length > 0 && (
          <div className="p-4 border-b border-[var(--border-default)]">
            <h3 className="text-xs font-bold text-[var(--status-error)] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              {t('actionRequiredList')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {criticalItems.map(item => {
                const alert = getAlertLevel(Number(item.current_stock_kg), Number(item.reorder_point_kg))
                const stockPercent = item.reorder_point_kg && Number(item.reorder_point_kg) > 0
                  ? Math.min((Number(item.current_stock_kg) / Number(item.reorder_point_kg)) * 100, 100)
                  : 0

                return (
                  <div key={item.plastic_id} className={`border ${alert.border} ${alert.bg} rounded-lg p-4 shadow-sm transition-all hover:shadow-md`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href={`/master/plastics?search=${encodeURIComponent(item.plastic_code || '')}`}
                        className="font-mono text-[13px] font-bold text-[var(--accent)] hover:underline"
                      >
                        {item.plastic_code}
                      </Link>
                      <span className={`text-[10px] font-bold ${alert.color}`}>
                        {alert.icon} {alert.level}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="text-xs text-[var(--text-muted)] mb-3">
                      <span className="px-1.5 py-0.5 bg-white/60 border border-[var(--border-default)] rounded text-[10px] font-bold mr-1">{item.family}</span>
                      {item.color && <span className="text-[var(--text-muted)]">{item.color}</span>}
                      {item.grade && <span className="text-[var(--text-muted)] ml-1">({item.grade})</span>}
                    </div>

                    {/* Stock Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
                        <span>{t('stockVsThreshold')}</span>
                        <span className="font-bold font-mono text-[11px]">{fmt(Number(item.current_stock_kg))} / {item.reorder_point_kg ? fmt(Number(item.reorder_point_kg)) : '—'} kg</span>
                      </div>
                      <div className="h-2.5 bg-white/80 rounded-full overflow-hidden border border-[var(--border-default)]">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${stockPercent <= 30 ? 'bg-[var(--status-error)]' : stockPercent <= 70 ? 'bg-[var(--status-warning)]' : 'bg-[var(--status-success)]'}`}
                          style={{ width: `${Math.max(stockPercent, 3)}%` }}
                        />
                      </div>
                    </div>

                    {/* Trend indicator */}
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      <TrendingDown size={10} className="text-[var(--status-error)]" />
                      {t('lastActivity')}: {item.last_txn_time ? new Date(item.last_txn_time).toLocaleDateString('ja-JP') : 'N/A'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All Items Summary Table */}
        <div className="p-4">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-3 flex items-center gap-1.5">
            {t('allMaterialsList', { count: inventory.length })}
          </h3>
          <div className="overflow-auto card-flat">
            <table className="data-table min-w-[700px]">
              <thead>
                <tr>
                  <th className="font-bold">{t('tableHeaders.plasticCode')}</th>
                  <th className="font-bold">{t('tableHeaders.type')}</th>
                  <th className="font-bold">{t('tableHeaders.color')}</th>
                  <th className="font-bold text-right">{t('tableHeaders.stock')}</th>
                  <th className="font-bold text-right">{t('tableHeaders.threshold')}</th>
                  <th className="font-bold text-center">{t('tableHeaders.ratio')}</th>
                  <th className="font-bold text-center">{t('tableHeaders.alertLevel')}</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(row => {
                  const alert = getAlertLevel(Number(row.current_stock_kg), Number(row.reorder_point_kg))
                  const ratio = row.reorder_point_kg && Number(row.reorder_point_kg) > 0
                    ? (Number(row.current_stock_kg) / Number(row.reorder_point_kg) * 100)
                    : null

                  return (
                    <tr key={row.plastic_id} className={row.is_low_stock ? 'bg-[var(--tint-red-bg)]/20' : ''}>
                      <td>
                        <Link
                          href={`/master/plastics?search=${encodeURIComponent(row.plastic_code || '')}`}
                          className="font-mono text-[13px] font-bold text-[var(--accent)] hover:underline"
                        >
                          {row.plastic_code}
                        </Link>
                      </td>
                      <td>
                        <span className="badge badge--neutral">{row.family}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{row.color || '-'}</td>
                      <td className="text-right font-mono text-[13px] font-bold" style={{ color: row.is_low_stock ? 'var(--status-error)' : 'var(--text-primary)' }}>
                        {fmt(Number(row.current_stock_kg))}
                      </td>
                      <td className="text-right font-mono text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        {row.reorder_point_kg ? fmt(Number(row.reorder_point_kg)) : '—'}
                      </td>
                      <td className="text-center">
                        {ratio !== null ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-12 h-1.5 bg-[var(--border-default)] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${ratio <= 50 ? 'bg-[var(--status-error)]' : ratio <= 100 ? 'bg-[var(--status-warning)]' : 'bg-[var(--status-success)]'}`}
                                style={{ width: `${Math.min(ratio, 100)}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono font-bold" style={{ color: ratio <= 50 ? 'var(--status-error)' : ratio <= 100 ? 'var(--status-warning)' : 'var(--status-success)' }}>
                              {ratio.toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td className="text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${alert.bg} ${alert.color} ${alert.border}`}>
                          {alert.level}
                        </span>
                      </td>
                    </tr>
                  )
                })}

                {inventory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center italic" style={{ color: 'var(--text-muted)' }}>
                      {t('noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span>{t('footerStats', { total: inventory.length, warning: criticalItems.length })}</span>
          <span>{t('footerAutoRefresh')}</span>
        </div>
      </div>
    </div>
  )
}
