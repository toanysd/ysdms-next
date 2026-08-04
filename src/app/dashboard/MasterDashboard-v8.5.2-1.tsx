'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Activity, Package, CalendarClock, PenTool, Focus,
    TrendingUp, Clock, Factory, CheckCircle2
} from 'lucide-react'
import {
    getMasterDashboardKPIs,
    getCoverageChartData,
    MasterDashboardKPIs
} from '../actions/master-dashboard'
import { getActiveProductionLogs, getProductionPlansByDate } from '../actions/production'
import Link from 'next/link'

export default function MasterDashboard() {
    const t = useTranslations('DashboardMaster')

    const [kpis, setKpis] = useState<MasterDashboardKPIs | null>(null)
    const [chartData, setChartData] = useState<any[]>([])
    const [activeLogs, setActiveLogs] = useState<any[]>([])
    const [todayPlans, setTodayPlans] = useState<any[]>([])

    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        try {
            const [kpiRes, chartRes, logRes, planRes] = await Promise.all([
                getMasterDashboardKPIs(),
                getCoverageChartData(),
                getActiveProductionLogs(),
                getProductionPlansByDate(new Date().toISOString().split('T')[0])
            ])
            setKpis(kpiRes)
            setChartData(chartRes)
            setActiveLogs(logRes || [])
            setTodayPlans(planRes || [])
        } catch (e) {
            console.error('Error fetching dashboard data', e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000) // Real-time 30s
        return () => clearInterval(interval)
    }, [])

    if (isLoading && !kpis) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin text-[var(--accent)]">
                    <Activity size={48} />
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-[var(--bg-surface)] min-h-screen space-y-6">
            <header className="flex justify-between items-end border-b-2 border-[var(--accent)] pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--accent)] flex items-center gap-3">
                        <Focus size={28} />
                        {t('title')}
                    </h1>
                    <p className="text-xs font-semibold text-[var(--text-muted)] mt-1 tracking-wider">
                        {t('subtitle')}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-mono font-bold text-[var(--text-primary)] tracking-wider">
                        {new Date().toLocaleDateString('ja-JP')} {new Date().toLocaleTimeString('ja-JP')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--status-success)] font-bold justify-end mt-1">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-success)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--status-success)]"></span>
                        </span>
                        {t('liveSync')}
                    </div>
                </div>
            </header>

            {/* ROW 1: 4 KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Máy Đang Chạy */}
                <div className="card-flat p-4 flex items-center justify-between shadow-sm" style={{ background: 'var(--tint-teal-bg)' }}>
                    <div>
                        <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-wide">{t('activeMachines')}</div>
                        <div className="text-[var(--text-muted)] text-[11px] font-medium mt-0.5">{t('activeMachinesSub')}</div>
                        <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">{kpis?.activeMachines || 0}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                        <Factory size={22} className="text-[var(--accent)]" />
                    </div>
                </div>

                {/* 2. Sản lượng hôm nay */}
                <div className="card-flat p-4 flex items-center justify-between shadow-sm" style={{ background: 'var(--tint-blue-bg)' }}>
                    <div>
                        <div className="text-[var(--status-info)] font-bold text-xs uppercase tracking-wide">{t('todayOutput')}</div>
                        <div className="text-[var(--text-muted)] text-[11px] font-medium mt-0.5">{t('todayOutputSub')}</div>
                        <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">
                            {new Intl.NumberFormat().format(kpis?.todayOutputQty || 0)}
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[var(--status-info)]/10 flex items-center justify-center">
                        <Package size={22} className="text-[var(--status-info)]" />
                    </div>
                </div>

                {/* 3. Đơn chưa xếp lịch */}
                <div className="card-flat p-4 flex items-center justify-between shadow-sm" style={{ background: 'var(--tint-orange-bg)' }}>
                    <div>
                        <div className="text-[var(--status-warning)] font-bold text-xs uppercase tracking-wide">{t('unscheduledOrders')}</div>
                        <div className="text-[var(--text-muted)] text-[11px] font-medium mt-0.5">{t('unscheduledOrdersSub')}</div>
                        <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">{kpis?.unscheduledOrders || 0}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[var(--status-warning)]/10 flex items-center justify-center">
                        <CalendarClock size={22} className="text-[var(--status-warning)]" />
                    </div>
                </div>

                {/* 4. Khuôn bảo trì */}
                <div className="card-flat p-4 flex items-center justify-between shadow-sm" style={{ background: 'var(--tint-purple-bg)' }}>
                    <div>
                        <div className="text-[var(--status-error)] font-bold text-xs uppercase tracking-wide">{t('maintenanceAlerts')}</div>
                        <div className="text-[var(--text-muted)] text-[11px] font-medium mt-0.5">{t('maintenanceAlertsSub')}</div>
                        <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">{kpis?.maintenanceAlerts || 0}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[var(--status-error)]/10 flex items-center justify-center">
                        <PenTool size={22} className="text-[var(--status-error)]" />
                    </div>
                </div>
            </div>

            {/* ROW 2: 2 WIDGETS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[380px]">
                {/* WIDGET 1: COVERAGE CHART */}
                <div className="card-flat p-4 flex flex-col h-full overflow-hidden">
                    <div className="card-header-tint flex items-center gap-2 pb-2.5 mb-3 shrink-0">
                        <TrendingUp size={18} className="text-[var(--text-secondary)]" />
                        <h2 className="font-bold text-[var(--text-primary)] text-sm">{t('coverageChart')} <span className="text-xs text-[var(--text-muted)] ml-2 font-medium">({t('coverageChartSub')})</span></h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {chartData.length === 0 ? (
                            <div className="text-center text-[var(--text-muted)] font-bold pt-10 text-xs">{t('noData')}</div>
                        ) : (
                            chartData.map((d, i) => {
                                const fillPercentage = Math.min(d.coveragePct, 100)
                                const isOver = d.coveragePct > 100
                                return (
                                    <div key={i} className="flex flex-col gap-1 text-xs">
                                        <div className="flex justify-between font-bold text-[var(--text-primary)]">
                                            <span>{d.name}</span>
                                            <span className={d.coveragePct >= 100 ? 'text-[var(--status-success)]' : 'text-[var(--text-muted)]'}>
                                                {d.coveragePct}%
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-[var(--bg-surface-2)] rounded-full overflow-hidden flex relative border border-[var(--border-subtle)]">
                                            <div
                                                className={`h-full transition-all duration-1000 ${fillPercentage === 100 ? 'bg-[var(--status-success)]' : 'bg-[var(--accent)]'}`}
                                                style={{ width: `${fillPercentage}%` }}
                                            />
                                            {isOver && (
                                                <div
                                                    className="h-full bg-[var(--status-warning)] opacity-60 absolute right-0"
                                                    style={{ width: `${d.coveragePct - 100}%` }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                                            <span>Requested: {d.requested}</span>
                                            <span>Planned: {d.planned}</span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* WIDGET 2: ACTIVE MACHINES */}
                <div className="card-flat p-4 flex flex-col h-full overflow-hidden">
                    <div className="card-header-tint flex items-center justify-between pb-2.5 mb-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <Factory size={18} className="text-[var(--text-secondary)]" />
                            <h2 className="font-bold text-[var(--text-primary)] text-sm">{t('activeMachinesList')} <span className="text-xs text-[var(--text-muted)] ml-2 font-medium">({t('activeMachinesListSub')})</span></h2>
                        </div>
                        <Link href="/production/active" className="btn btn-secondary text-xs px-2.5 py-1">
                            {t('tvMonitor')}
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2.5">
                        {activeLogs.length === 0 ? (
                            <div className="text-center text-[var(--text-muted)] font-bold pt-10 text-xs">{t('allIdle')}</div>
                        ) : (
                            activeLogs.map((log) => (
                                <div key={log.id} className="border border-[var(--border-subtle)] p-2.5 rounded-lg flex items-center justify-between hover:bg-[var(--bg-surface-2)] transition">
                                    <div className="flex items-center gap-3">
                                        <div className="badge badge--success font-mono font-bold text-sm px-3 py-1">
                                            {log.machine_instance?.internal_code || log.machine_master?.code || '???'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-[var(--text-primary)] text-xs">{log.order_items?.product_pn_raw}</div>
                                            <div className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5 flex items-center gap-2">
                                                <span>{t('operator')}: {log.production_plans?.operator_name || log.operator_name || 'N/A'}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 font-mono"><Clock size={10} /> {new Date(log.start_time).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-semibold text-[var(--text-muted)]">{t('target')}</div>
                                        <div className="font-mono text-xs font-bold text-[var(--text-primary)]">{log.production_plans?.planned_quantity || 'N/A'}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ROW 3: GANTT TIMELINE */}
            <div className="card-flat p-4">
                <div className="card-header-tint flex items-center justify-between pb-2.5 mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[var(--text-secondary)]" />
                        <h2 className="font-bold text-[var(--text-primary)] text-sm">{t('todayTimeline')} <span className="text-xs text-[var(--text-muted)] ml-2 font-medium">({t('todayTimelineSub')})</span></h2>
                    </div>
                </div>

                <div className="overflow-x-auto pb-2">
                    <div className="min-w-[800px]">
                        {todayPlans.length === 0 ? (
                            <div className="text-center text-[var(--text-muted)] font-bold py-6 text-xs">{t('noPlansToday')}</div>
                        ) : (
                            <div className="space-y-3">
                                {todayPlans.map((plan) => {
                                    const isDone = plan.status === 'COMPLETED'
                                    const isRun = plan.status === 'IN_PROGRESS'
                                    return (
                                        <div key={plan.id} className="flex items-center gap-3 group">
                                            <div className="w-28 shrink-0 font-mono font-bold text-[var(--text-primary)] text-xs text-right pr-3 border-r border-[var(--border-subtle)]">
                                                {plan.machine_instance?.internal_code || 'Unknown'}
                                            </div>
                                            <div className="flex-1 bg-[var(--bg-surface-2)] rounded-lg h-9 flex items-center px-3 relative overflow-hidden border border-[var(--border-subtle)] group-hover:border-[var(--accent)] transition">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isDone ? 'bg-[var(--status-info)]' : isRun ? 'bg-[var(--status-success)]' : 'bg-[var(--status-warning)]'}`} />
                                                <div className="ml-2 flex items-center justify-between w-full">
                                                    <div className="font-bold text-[var(--text-primary)] text-xs">
                                                        {plan.order_items?.product_pn_raw}
                                                        <span className="text-[11px] text-[var(--text-muted)] ml-2 font-normal">
                                                            ({plan.planned_quantity} qty) • {plan.operator_name || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                                                        {isDone && <><CheckCircle2 size={12} className="text-[var(--status-info)]" /> <span className="text-[var(--status-info)]">{t('statusCompleted')}</span></>}
                                                        {isRun && <><Activity size={12} className="text-[var(--status-success)] animate-pulse" /> <span className="text-[var(--status-success)]">{t('statusInProgress')}</span></>}
                                                        {!isDone && !isRun && <span className="text-[var(--status-warning)]">{plan.status}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
