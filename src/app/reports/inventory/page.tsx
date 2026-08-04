export const dynamic = 'force-dynamic'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getInventoryReport, getInventoryByFamily } from '@/app/actions/reports'
import { ArrowLeft, Database, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react'
import ExportCSVButton from '@/components/reports/ExportCSVButton'

export default async function InventoryReportPage() {
  const t = useTranslations('Reports')
  const [inventory, familyGroups] = await Promise.all([
    getInventoryReport(),
    getInventoryByFamily(),
  ])

  const totalKg = inventory.reduce((s, r) => s + Number(r.current_stock_kg || 0), 0)
  const totalIn = inventory.reduce((s, r) => s + Number(r.total_in_kg || 0), 0)
  const totalOut = inventory.reduce((s, r) => s + Number(r.total_out_kg || 0), 0)
  const lowCount = inventory.filter(r => r.is_low_stock).length

  const fmt = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(v)

  const csvHeaders = {
    plastic_code: t('csvHeaders.plasticCode'),
    family: t('csvHeaders.family'),
    grade: t('csvHeaders.grade'),
    color: t('csvHeaders.color'),
    thickness_mm: t('csvHeaders.thickness'),
    width_mm: t('csvHeaders.width'),
    current_stock_kg: t('csvHeaders.stock'),
    total_in_kg: t('csvHeaders.totalIn'),
    total_out_kg: t('csvHeaders.totalOut'),
    txn_count: t('csvHeaders.txnCount'),
    reorder_point_kg: t('csvHeaders.reorderPoint'),
    is_low_stock: t('csvHeaders.lowStock'),
    last_txn_time: t('csvHeaders.lastTxn'),
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] rounded-lg overflow-hidden m-2 border border-[var(--border-default)]">
      {/* Header */}
      <div className="h-[48px] bg-[var(--tint-teal-bg)] px-4 flex items-center justify-between border-b border-[var(--border-default)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/reports" className="text-[var(--accent)] hover:opacity-80 transition-colors" title="Back">
            <ArrowLeft size={18} />
          </Link>
          <Database size={20} className="text-[var(--accent)]" />
          <h2 className="text-[14px] font-bold text-[var(--text-primary)] flex flex-col">
            {t('inventoryReportTitle')}
            <span className="text-[var(--text-muted)] font-normal mt-[-2px] text-[10px]">{t('inventoryReportSubtitle')}</span>
          </h2>
        </div>

        <ExportCSVButton
          data={inventory as unknown as Record<string, unknown>[]}
          filename="YSDMS_Inventory_Report"
          headers={csvHeaders}
          label={t('csvExport')}
        />
      </div>

      <div className="flex-1 overflow-auto">

        {/* KPI Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide">{t('currentStock')}</p>
            <p className="text-xl font-black text-[var(--accent)] mt-1">{fmt(totalKg)} <span className="text-xs font-normal text-[var(--text-muted)]">kg</span></p>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide flex items-center justify-center gap-1"><TrendingUp size={12} className="text-[var(--status-success)]" /> {t('totalIn')}</p>
            <p className="text-xl font-black text-[var(--status-success)] mt-1">{fmt(totalIn)} <span className="text-xs font-normal text-[var(--text-muted)]">kg</span></p>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide flex items-center justify-center gap-1"><TrendingDown size={12} className="text-[var(--status-warning)]" /> {t('totalOut')}</p>
            <p className="text-xl font-black text-[var(--status-warning)] mt-1">{fmt(totalOut)} <span className="text-xs font-normal text-[var(--text-muted)]">kg</span></p>
          </div>
          <div className={`bg-[var(--bg-surface)] border rounded-lg p-3 text-center shadow-sm ${lowCount > 0 ? 'border-[var(--status-error)]' : 'border-[var(--border-default)]'}`}>
            <p className={`text-[10px] uppercase font-bold tracking-wide flex items-center justify-center gap-1 ${lowCount > 0 ? 'text-[var(--status-error)]' : 'text-[var(--text-muted)]'}`}>
              <AlertCircle size={12} /> {t('lowStockCount')}
            </p>
            <p className={`text-xl font-black mt-1 ${lowCount > 0 ? 'text-[var(--status-error)]' : 'text-[var(--accent)]'}`}>{lowCount} <span className="text-xs font-normal text-[var(--text-muted)]">{t('materialsUnit')}</span></p>
          </div>
        </div>

        {/* Family Summary Bar */}
        <div className="p-4 border-b border-[var(--border-default)]">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-3">{t('summaryByFamily')}</h3>
          <div className="flex flex-col gap-2">
            {familyGroups.map(g => {
              const pct = totalKg > 0 ? Math.max((g.total_kg / totalKg) * 100, 2) : 0
              return (
                <div key={g.family} className="flex items-center gap-2">
                  <div className="w-[80px] text-xs font-bold text-[var(--text-primary)] truncate" title={g.family}>{g.family}</div>
                  <div className="flex-1 h-5 bg-[var(--border-default)]/30 rounded overflow-hidden flex items-center">
                    <div
                      className="h-full bg-[var(--accent)] rounded flex items-center px-2 text-[10px] text-white font-bold transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    >
                      {pct > 12 && `${fmt(g.total_kg)} kg`}
                    </div>
                  </div>
                  <div className="w-[90px] text-right text-xs text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--text-primary)]">{fmt(g.total_kg)}</span> kg
                    <span className="text-[var(--text-muted)] ml-1">({t('itemsCount', { count: g.item_count })})</span>
                  </div>
                  {g.low_count > 0 && (
                    <span className="badge badge--error">
                      ⚠ {g.low_count}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail Table */}
        <div className="overflow-auto card-flat">
          <table className="data-table min-w-[900px]">
            <thead>
              <tr>
                <th className="font-bold">{t('tableHeaders.plasticCode')}</th>
                <th className="font-bold">{t('tableHeaders.type')}</th>
                <th className="font-bold">{t('tableHeaders.grade')}</th>
                <th className="font-bold">{t('tableHeaders.color')}</th>
                <th className="font-bold text-right">{t('tableHeaders.thickness')}</th>
                <th className="font-bold text-right">{t('tableHeaders.width')}</th>
                <th className="font-bold text-right">{t('tableHeaders.stock')}</th>
                <th className="font-bold text-right">{t('tableHeaders.inbound')}</th>
                <th className="font-bold text-right">{t('tableHeaders.outbound')}</th>
                <th className="font-bold text-right">{t('tableHeaders.txnCount')}</th>
                <th className="font-bold text-center">{t('tableHeaders.status')}</th>
                <th className="font-bold">{t('tableHeaders.lastTxn')}</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((row) => (
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
                  <td style={{ color: 'var(--text-secondary)' }}>{row.grade || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row.color || '-'}</td>
                  <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{row.thickness_mm ?? '-'}</td>
                  <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{row.width_mm ?? '-'}</td>
                  <td className="text-right font-mono text-[13px] font-bold" style={{ color: row.is_low_stock ? 'var(--status-error)' : 'var(--text-primary)' }}>
                    {fmt(Number(row.current_stock_kg))}
                  </td>
                  <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--status-success)' }}>{fmt(Number(row.total_in_kg))}</td>
                  <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--status-warning)' }}>{fmt(Number(row.total_out_kg))}</td>
                  <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--text-muted)' }}>{row.txn_count}</td>
                  <td className="text-center">
                    {row.is_low_stock ? (
                      <span className="badge badge--error animate-pulse">{t('lowStockBadge')}</span>
                    ) : (
                      <span className="badge badge--success">{t('normalBadge')}</span>
                    )}
                  </td>
                  <td className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {row.last_txn_time ? new Date(row.last_txn_time).toLocaleDateString('ja-JP') : '-'}
                  </td>
                </tr>
              ))}

              {inventory.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-8 text-center italic" style={{ color: 'var(--text-muted)' }}>
                    {t('noInventoryData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span>{t('totalMaterials', { count: inventory.length })}</span>
          <span>{t('dataSourceLabel')}</span>
        </div>
      </div>
    </div>
  )
}
