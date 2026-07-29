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
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg overflow-hidden m-2">
      {/* Header */}
      <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border border-teal-200 rounded-t-lg shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/reports" className="text-teal-500 hover:text-teal-700 transition-colors" title="Back">
            <ArrowLeft size={18} />
          </Link>
          <Database size={20} className="text-teal-700" />
          <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
            {t('inventoryReportTitle')}
            <span className="text-teal-700 font-normal mt-[-2px] text-[10px]">{t('inventoryReportSubtitle')}</span>
          </h2>
        </div>

        <ExportCSVButton
          data={inventory as unknown as Record<string, unknown>[]}
          filename="YSDMS_Inventory_Report"
          headers={csvHeaders}
          label={t('csvExport')}
        />
      </div>

      <div className="flex-1 overflow-auto border-x border-b border-teal-100 rounded-b-lg">

        {/* KPI Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="bg-white border border-teal-100 rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">{t('currentStock')}</p>
            <p className="text-xl font-black text-teal-800 mt-1">{fmt(totalKg)} <span className="text-xs font-normal text-slate-400">kg</span></p>
          </div>
          <div className="bg-white border border-teal-100 rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide flex items-center justify-center gap-1"><TrendingUp size={12} className="text-green-500" /> {t('totalIn')}</p>
            <p className="text-xl font-black text-green-700 mt-1">{fmt(totalIn)} <span className="text-xs font-normal text-slate-400">kg</span></p>
          </div>
          <div className="bg-white border border-teal-100 rounded-lg p-3 text-center shadow-sm">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide flex items-center justify-center gap-1"><TrendingDown size={12} className="text-orange-500" /> {t('totalOut')}</p>
            <p className="text-xl font-black text-orange-700 mt-1">{fmt(totalOut)} <span className="text-xs font-normal text-slate-400">kg</span></p>
          </div>
          <div className={`bg-white border rounded-lg p-3 text-center shadow-sm ${lowCount > 0 ? 'border-red-200' : 'border-teal-100'}`}>
            <p className={`text-[10px] uppercase font-bold tracking-wide flex items-center justify-center gap-1 ${lowCount > 0 ? 'text-red-500' : 'text-slate-500'}`}>
              <AlertCircle size={12} /> {t('lowStockCount')}
            </p>
            <p className={`text-xl font-black mt-1 ${lowCount > 0 ? 'text-red-600' : 'text-teal-800'}`}>{lowCount} <span className="text-xs font-normal text-slate-400">{t('materialsUnit')}</span></p>
          </div>
        </div>

        {/* Family Summary Bar */}
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">{t('summaryByFamily')}</h3>
          <div className="flex flex-col gap-2">
            {familyGroups.map(g => {
              const pct = totalKg > 0 ? Math.max((g.total_kg / totalKg) * 100, 2) : 0
              return (
                <div key={g.family} className="flex items-center gap-2">
                  <div className="w-[80px] text-xs font-bold text-slate-700 truncate" title={g.family}>{g.family}</div>
                  <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden flex items-center">
                    <div
                      className="h-full bg-teal-500 rounded flex items-center px-2 text-[10px] text-white font-bold transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    >
                      {pct > 12 && `${fmt(g.total_kg)} kg`}
                    </div>
                  </div>
                  <div className="w-[90px] text-right text-xs text-slate-600">
                    <span className="font-bold">{fmt(g.total_kg)}</span> kg
                    <span className="text-slate-400 ml-1">({t('itemsCount', { count: g.item_count })})</span>
                  </div>
                  {g.low_count > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-600 border border-red-200 rounded">
                      ⚠ {g.low_count}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail Table */}
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-[11px] text-slate-500 whitespace-nowrap">
              <tr>
                <th className="p-2.5 font-bold">{t('tableHeaders.plasticCode')}</th>
                <th className="p-2.5 font-bold">{t('tableHeaders.type')}</th>
                <th className="p-2.5 font-bold">{t('tableHeaders.grade')}</th>
                <th className="p-2.5 font-bold">{t('tableHeaders.color')}</th>
                <th className="p-2.5 font-bold text-right">{t('tableHeaders.thickness')}</th>
                <th className="p-2.5 font-bold text-right">{t('tableHeaders.width')}</th>
                <th className="p-2.5 font-bold text-right">{t('tableHeaders.stock')}</th>
                <th className="p-2.5 font-bold text-right">{t('tableHeaders.inbound')}</th>
                <th className="p-2.5 font-bold text-right">{t('tableHeaders.outbound')}</th>
                <th className="p-2.5 font-bold text-right">{t('tableHeaders.txnCount')}</th>
                <th className="p-2.5 font-bold text-center">{t('tableHeaders.status')}</th>
                <th className="p-2.5 font-bold">{t('tableHeaders.lastTxn')}</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {inventory.map((row) => (
                <tr key={row.plastic_id} className={`border-b border-slate-100 transition-colors ${row.is_low_stock ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-teal-50/30'}`}>
                  <td className="p-2.5 font-mono font-bold text-teal-800">{row.plastic_code}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 rounded">{row.family}</span>
                  </td>
                  <td className="p-2.5 text-slate-600">{row.grade || '-'}</td>
                  <td className="p-2.5 text-slate-600">{row.color || '-'}</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">{row.thickness_mm ?? '-'}</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">{row.width_mm ?? '-'}</td>
                  <td className={`p-2.5 text-right font-mono font-bold ${row.is_low_stock ? 'text-red-600' : 'text-slate-800'}`}>
                    {fmt(Number(row.current_stock_kg))}
                  </td>
                  <td className="p-2.5 text-right font-mono text-green-700">{fmt(Number(row.total_in_kg))}</td>
                  <td className="p-2.5 text-right font-mono text-orange-600">{fmt(Number(row.total_out_kg))}</td>
                  <td className="p-2.5 text-right font-mono text-slate-500">{row.txn_count}</td>
                  <td className="p-2.5 text-center">
                    {row.is_low_stock ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 rounded animate-pulse">{t('lowStockBadge')}</span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-green-50 text-green-600 border border-green-200 rounded">{t('normalBadge')}</span>
                    )}
                  </td>
                  <td className="p-2.5 text-[11px] text-slate-400 font-mono">
                    {row.last_txn_time ? new Date(row.last_txn_time).toLocaleDateString('ja-JP') : '-'}
                  </td>
                </tr>
              ))}

              {inventory.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400 italic">
                    {t('noInventoryData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>{t('totalMaterials', { count: inventory.length })}</span>
          <span className="text-slate-400">{t('dataSourceLabel')}</span>
        </div>
      </div>
    </div>
  )
}
