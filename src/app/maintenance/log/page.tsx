export const dynamic = 'force-dynamic'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getMaintenanceLogs } from '@/app/actions/maintenance'
import { ArrowLeft, History, Wrench, Settings, Search } from 'lucide-react'

// Nhật ký Bảo trì (Tầng 5C)
export default async function MaintenanceLogPage() {
  const t = useTranslations('Maintenance')
  const logs = await getMaintenanceLogs()

  const fmt = (v: number) => new Intl.NumberFormat('en-US').format(v)
  const fmtCurrency = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden m-2 border border-[var(--mcs-border)] card-flat">
      {/* Header */}
      <div className="h-[48px] bg-[var(--tint-teal-bg)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/maintenance" className="hover:opacity-80 transition-colors" title="Back" style={{ color: 'var(--accent)' }}>
            <ArrowLeft size={18} />
          </Link>
          <History size={20} style={{ color: 'var(--accent)' }} />
          <h2 className="text-[14px] font-bold flex flex-col" style={{ color: 'var(--text-primary)' }}>
            {t('maintenanceLogs')}
            <span className="font-normal mt-[-2px] text-[10px]" style={{ color: 'var(--text-muted)' }}>{t('physicalMoldsLogSubtitle')}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-2 top-1.5" style={{ color: 'var(--text-muted)' }} size={16} />
            <input
              type="text"
              disabled
              placeholder={t('searchPicPlaceholder')}
              className="form-input h-[30px] w-[200px] pl-8 text-[12px] opacity-50 cursor-not-allowed"
            />
          </div>
          <button className="btn btn-primary h-[30px] px-3 flex items-center gap-1.5 text-[12px] font-bold opacity-50 cursor-not-allowed">
            <Settings size={14} />
            {t('maintenanceRecordBtn')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="data-table w-full text-left min-w-[900px]">
          <thead>
            <tr>
              <th className="p-3 font-bold w-[120px]">{t('maintDateCol')}</th>
              <th className="p-3 font-bold">{t('physicalMoldCol')}</th>
              <th className="p-3 font-bold">{t('maintTypeCol')}</th>
              <th className="p-3 text-right font-bold">{t('shotsAtMaintCol')}</th>
              <th className="p-3 font-bold">{t('actionTakenCol')}</th>
              <th className="p-3 text-right font-bold">{t('costCol')}</th>
              <th className="p-3 font-bold w-[150px]">{t('performedByCol')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--tint-teal-bg)]/20 transition-colors">
                <td className="p-3 font-mono font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                  {new Date(log.maintenance_date).toLocaleDateString('ja-JP')}
                </td>
                <td className="p-3">
                  <Link href={`/equipment/molds/${log.mold_physical_id}`} className="font-mono font-bold text-[13px] hover:underline" style={{ color: 'var(--accent)' }}>
                    {log.mold_physical_id.substring(0, 8)}...
                  </Link>
                </td>
                <td className="p-3">
                  <span className="badge badge--info text-[11px] font-bold uppercase">
                    {log.maintenance_type || 'routine'}
                  </span>
                </td>
                <td className="p-3 text-right font-mono font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                  {log.shots_at_maintenance ? fmt(log.shots_at_maintenance) : '-'}
                </td>
                <td className="p-3 text-[13px] truncate max-w-[250px]" style={{ color: 'var(--text-primary)' }} title={log.action_taken || ''}>
                  {log.action_taken || '-'}
                </td>
                <td className="p-3 text-right font-mono font-bold text-[13px]" style={{ color: 'var(--status-warning)' }}>
                  {log.cost ? fmtCurrency(log.cost) : '-'}
                </td>
                <td className="p-3 font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                  {log.performed_by || '-'}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[13px] italic" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Wrench size={32} style={{ color: 'var(--text-muted)' }} />
                    <p>{t('noLogData')}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 bg-[var(--tint-teal-bg)]/50 border-t border-[var(--mcs-border)] flex items-center justify-between text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
        <span>{t('totalLogs', { count: logs.length })}</span>
        <span>{t('dataSourceLabel')}</span>
      </div>
    </div>
  )
}

