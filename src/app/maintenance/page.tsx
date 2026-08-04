export const dynamic = 'force-dynamic'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getMoldHealthList } from '@/app/actions/maintenance'
import { Wrench, AlertTriangle, ShieldCheck, Drill, History } from 'lucide-react'
import RecordMaintenanceButton from './RecordMaintenanceButton'

// Dashboard Bảo trì Khuôn (Tầng 5C)
export default async function MaintenanceDashboard() {
  const t = useTranslations('Maintenance')
  const healthList = await getMoldHealthList()

  const overdueCount = healthList.filter(h => h.health_status === 'OVERDUE').length
  const warningCount = healthList.filter(h => h.health_status === 'WARNING').length
  const okCount = healthList.filter(h => h.health_status === 'OK' || h.health_status === 'NO_SCHEDULE').length

  const getStatusStyle = (status: string) => {
    if (status === 'OVERDUE') return { badgeClass: 'badge badge--error', icon: '🚨' }
    if (status === 'WARNING') return { badgeClass: 'badge badge--warning', icon: '⚠️' }
    if (status === 'OK') return { badgeClass: 'badge badge--success', icon: '✅' }
    return { badgeClass: 'badge badge--neutral', icon: '➖' }
  }

  const getStatusLabel = (status: string) => {
    if (status === 'OVERDUE') return t('statusLabels.OVERDUE')
    if (status === 'WARNING') return t('statusLabels.WARNING')
    if (status === 'OK') return t('statusLabels.OK')
    return status
  }

  const fmt = (v: number) => new Intl.NumberFormat('en-US').format(v)

  return (
    <div className="flex flex-col h-full rounded-lg overflow-y-auto m-2">
      {/* Header */}
      <div className="h-[48px] bg-[var(--tint-teal-bg)] px-4 flex items-center justify-between border border-[var(--mcs-border)] rounded-t-lg shrink-0">
        <div className="flex items-center gap-2">
          <Wrench size={20} style={{ color: 'var(--accent)' }} />
          <h2 className="text-[14px] font-bold flex flex-col" style={{ color: 'var(--text-primary)' }}>
            {t('title')}
            <span className="font-normal mt-[-2px] text-[10px]" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/maintenance/log">
            <button className="btn btn-secondary h-[30px] px-3 flex items-center gap-1.5 text-[12px] font-bold">
              <History size={14} />
              {t('logBtn')}
            </button>
          </Link>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 border-x border-b border-[var(--mcs-border)] rounded-b-lg flex-1">
        {/* KPI Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-flat p-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold mb-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('overdueCard')}</p>
              <h3 className="text-3xl font-black font-mono text-[var(--status-error)]">{overdueCount} <span className="text-[12px] font-normal" style={{ color: 'var(--text-muted)' }}>{t('moldsUnit')}</span></h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${overdueCount > 0 ? 'badge badge--error animate-pulse' : 'card-flat'}`}>
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="card-flat p-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold mb-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('warningCard')}</p>
              <h3 className="text-3xl font-black font-mono text-[var(--status-warning)]">{warningCount} <span className="text-[12px] font-normal" style={{ color: 'var(--text-muted)' }}>{t('moldsUnit')}</span></h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${warningCount > 0 ? 'badge badge--warning' : 'card-flat'}`}>
              <Drill size={24} />
            </div>
          </div>

          <div className="card-flat p-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold mb-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('okCard')}</p>
              <h3 className="text-3xl font-black font-mono text-[var(--status-success)]">{okCount} <span className="text-[12px] font-normal" style={{ color: 'var(--text-muted)' }}>{t('moldsUnit')}</span></h3>
            </div>
            <div className="w-12 h-12 rounded-full badge badge--success flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Overdue / Warning Highlight Grid */}
        {(overdueCount > 0 || warningCount > 0) && (
          <div className="mt-2">
            <h3 className="text-[14px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle size={16} className="text-[var(--status-error)]" />
              {t('actionRequired')}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {healthList.filter(h => h.health_status === 'OVERDUE' || h.health_status === 'WARNING').map(h => {
                const st = getStatusStyle(h.health_status)
                return (
                  <div key={h.physical_id} className="card-flat p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-mono font-bold text-[15px]">
                          <Link href={`/equipment/molds/${h.physical_id}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
                            {h.physical_code}
                          </Link>
                        </h4>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{h.mold_base_code} (Rev: {h.revision_code})</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[11px] font-bold ${st.badgeClass} ${h.health_status === 'OVERDUE' ? 'animate-pulse' : ''}`}>
                        {st.icon} {getStatusLabel(h.health_status)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-[12px] mb-1" style={{ color: 'var(--text-muted)' }}>
                        <span>{t('shots')}</span>
                        <span className="font-bold font-mono text-[13px]">{fmt(h.total_shots)} / {fmt(h.interval_shots || 0)}</span>
                      </div>
                      <div className="h-2 bg-[var(--tint-teal-bg)] rounded-full overflow-hidden border border-[var(--mcs-border)]">
                        <div
                          className={`h-full ${h.health_status === 'OVERDUE' ? 'bg-[var(--status-error)]' : 'bg-[var(--status-warning)]'}`}
                          style={{ width: `${Math.min(h.lifecycle_pct || 0, 100)}%` }}
                        />
                      </div>
                      <div className="text-right text-[11px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                        {h.lifecycle_pct}% {t('towardsLimit')}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <RecordMaintenanceButton physicalId={h.physical_id} totalShots={h.total_shots} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All Molds List */}
        <div className="mt-4 card-flat overflow-hidden">
          <h3 className="text-[14px] font-bold p-4 border-b border-[var(--mcs-border)] bg-[var(--tint-teal-bg)]" style={{ color: 'var(--text-primary)' }}>{t('allMoldsTitle')}</h3>
          <div className="overflow-x-auto">
            <table className="data-table w-full text-left min-w-[900px]">
              <thead>
                <tr>
                  <th className="p-3 font-bold">{t('tableHeaders.physicalCode')}</th>
                  <th className="p-3 font-bold">{t('tableHeaders.designCode')}</th>
                  <th className="p-3 text-right font-bold w-[120px]">{t('tableHeaders.totalShots')}</th>
                  <th className="p-3 text-right font-bold w-[120px]">{t('tableHeaders.interval')}</th>
                  <th className="p-3 text-center font-bold w-[200px]">{t('tableHeaders.lifecycleProgress')}</th>
                  <th className="p-3 text-center font-bold w-[100px]">{t('tableHeaders.health')}</th>
                </tr>
              </thead>
              <tbody>
                {healthList.map(h => {
                  const st = getStatusStyle(h.health_status)
                  return (
                    <tr key={h.physical_id} className={`border-b border-[var(--mcs-border)] hover:bg-[var(--tint-teal-bg)]/20 ${h.health_status === 'OVERDUE' ? 'bg-[var(--tint-red-bg)]/20' : ''}`}>
                      <td className="p-3 font-mono font-bold text-[13px]">
                        <Link href={`/equipment/molds/${h.physical_id}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
                          {h.physical_code}
                        </Link>
                      </td>
                      <td className="p-3 font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                        <span>{h.mold_base_code}</span>
                        <span className="font-mono text-[11px] ml-1 px-1 rounded" style={{ color: 'var(--text-muted)' }}>{h.revision_code}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>{fmt(h.total_shots)}</td>
                      <td className="p-3 text-right font-mono font-bold text-[13px]" style={{ color: 'var(--text-muted)' }}>{h.interval_shots ? fmt(h.interval_shots) : '-'}</td>
                      <td className="p-3">
                        {h.interval_shots ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded overflow-hidden bg-[var(--tint-teal-bg)] border border-[var(--mcs-border)]">
                              <div className={`h-full ${h.health_status === 'OVERDUE' ? 'bg-[var(--status-error)]' : h.health_status === 'WARNING' ? 'bg-[var(--status-warning)]' : 'bg-[var(--status-success)]'}`} style={{ width: `${Math.min(h.lifecycle_pct || 0, 100)}%` }} />
                            </div>
                            <span className="w-8 text-right text-[11px] font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{h.lifecycle_pct}%</span>
                          </div>
                        ) : <span className="text-[11px] italic block text-center" style={{ color: 'var(--text-muted)' }}>{t('noSchedule')}</span>}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`px-2 py-0.5 text-[11px] font-bold ${st.badgeClass}`}>
                            {getStatusLabel(h.health_status)}
                          </span>
                          {(h.health_status === 'OVERDUE' || h.health_status === 'WARNING') && (
                            <RecordMaintenanceButton physicalId={h.physical_id} totalShots={h.total_shots} />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {healthList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[13px] italic" style={{ color: 'var(--text-muted)' }}>{t('noPhysicalMolds')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

