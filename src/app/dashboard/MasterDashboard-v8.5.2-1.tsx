'use client'

import React, { useEffect, useState } from 'react'
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
                <div className="animate-spin text-[var(--mcs-primary)]">
                    <Activity size={48} />
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-[var(--mcs-surface)] min-h-screen space-y-6">
            <header className="flex justify-between items-end border-b-2 border-[var(--mcs-primary)] pb-4">
                <div>
                    <h1 className="text-3xl font-black text-[var(--mcs-primary)] flex items-center gap-3">
                        <Focus size={32} />
                        中央制御ダッシュボード
                    </h1>
                    <p className="text-sm font-bold text-[var(--mcs-text-muted)] mt-1 uppercase tracking-widest">
                        Master Control Dashboard (Tháp Điều Khiển Trung Tâm)
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-[var(--mcs-text)] tracking-wider">
                        {new Date().toLocaleDateString('ja-JP')} {new Date().toLocaleTimeString('ja-JP')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold justify-end mt-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        リアルタイム同期中 (LIVE SYNC)
                    </div>
                </div>
            </header>

            {/* ROW 1: 4 KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Máy Đang Chạy */}
                <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition">
                    <div>
                        <div className="text-emerald-700 font-black text-sm uppercase tracking-wide">稼働中の機械</div>
                        <div className="text-emerald-600 text-[11px] font-bold mt-0.5">Máy Đang Chạy</div>
                        <div className="text-4xl font-black text-emerald-600 mt-2">{kpis?.activeMachines || 0}</div>
                    </div>
                    <div className="h-14 w-14 rounded-full bg-emerald-200/50 flex items-center justify-center">
                        <Factory size={28} className="text-emerald-600" />
                    </div>
                </div>

                {/* 2. Sản lượng hôm nay */}
                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition">
                    <div>
                        <div className="text-blue-700 font-black text-sm uppercase tracking-wide">本日の生産量</div>
                        <div className="text-blue-600 text-[11px] font-bold mt-0.5">Sản Lượng (Hôm nay)</div>
                        <div className="text-4xl font-black text-blue-600 mt-2">
                            {new Intl.NumberFormat().format(kpis?.todayOutputQty || 0)}
                        </div>
                    </div>
                    <div className="h-14 w-14 rounded-full bg-blue-200/50 flex items-center justify-center">
                        <Package size={28} className="text-blue-600" />
                    </div>
                </div>

                {/* 3. Đơn chưa xếp lịch */}
                <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition">
                    <div>
                        <div className="text-amber-700 font-black text-sm uppercase tracking-wide">未計画オーダー</div>
                        <div className="text-amber-600 text-[11px] font-bold mt-0.5">Đơn Chưa Kế Hoạch</div>
                        <div className="text-4xl font-black text-amber-600 mt-2">{kpis?.unscheduledOrders || 0}</div>
                    </div>
                    <div className="h-14 w-14 rounded-full bg-amber-200/50 flex items-center justify-center">
                        <CalendarClock size={28} className="text-amber-600" />
                    </div>
                </div>

                {/* 4. Khuôn bảo trì */}
                <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition">
                    <div>
                        <div className="text-red-700 font-black text-sm uppercase tracking-wide">要メンテ金型</div>
                        <div className="text-red-600 text-[11px] font-bold mt-0.5">Khuôn Chờ Bảo Trì</div>
                        <div className="text-4xl font-black text-red-600 mt-2">{kpis?.maintenanceAlerts || 0}</div>
                    </div>
                    <div className="h-14 w-14 rounded-full bg-red-200/50 flex items-center justify-center">
                        <PenTool size={28} className="text-red-600" />
                    </div>
                </div>
            </div>

            {/* ROW 2: 2 WIDGETS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                {/* WIDGET 1: COVERAGE CHART */}
                <div className="bg-white border-2 border-[var(--mcs-border)] rounded-xl p-5 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-4 shrink-0">
                        <TrendingUp size={20} className="text-slate-600" />
                        <h2 className="font-black text-slate-800 text-lg">生産進捗カバー率 <span className="text-sm text-slate-500 ml-2 font-bold">(Coverage Chart)</span></h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {chartData.length === 0 ? (
                            <div className="text-center text-slate-400 font-bold pt-10">データなし (No Data)</div>
                        ) : (
                            chartData.map((d, i) => {
                                const fillPercentage = Math.min(d.coveragePct, 100)
                                const isOver = d.coveragePct > 100
                                return (
                                    <div key={i} className="flex flex-col gap-1 text-sm">
                                        <div className="flex justify-between font-bold text-slate-700">
                                            <span>{d.name}</span>
                                            <span className={d.coveragePct >= 100 ? 'text-emerald-600' : 'text-slate-500'}>
                                                {d.coveragePct}%
                                            </span>
                                        </div>
                                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex relative">
                                            <div
                                                className={`h-full transition-all duration-1000 ${fillPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                style={{ width: `${fillPercentage}%` }}
                                            />
                                            {isOver && (
                                                <div
                                                    className="h-full bg-amber-400 opacity-60 absolute right-0"
                                                    style={{ width: `${d.coveragePct - 100}%` }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
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
                <div className="bg-white border-2 border-[var(--mcs-border)] rounded-xl p-5 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4 shrink-0">
                        <div className="flex items-center gap-2">
                            <Factory size={20} className="text-slate-600" />
                            <h2 className="font-black text-slate-800 text-lg">稼働中の機械リスト <span className="text-sm text-slate-500 ml-2 font-bold">(Active Machines)</span></h2>
                        </div>
                        <Link href="/production/active" className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded hover:bg-slate-200 transition">
                            TV Monitor ↗
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {activeLogs.length === 0 ? (
                            <div className="text-center text-slate-400 font-bold pt-10">稼働中の機械はありません (All Idle)</div>
                        ) : (
                            activeLogs.map((log, i) => (
                                <div key={log.id} className="border border-slate-200 p-3 rounded-lg flex items-center justify-between hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-emerald-100 text-emerald-700 font-black text-xl px-4 py-2 rounded">
                                            {log.machine_instance?.internal_code || log.machine_master?.code || '???'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 tracking-wide">{log.order_items?.product_pn_raw}</div>
                                            <div className="text-xs text-slate-500 font-bold uppercase mt-1 flex items-center gap-2">
                                                <span>作業者: {log.production_plans?.operator_name || log.operator_name || 'N/A'}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Clock size={10} /> {new Date(log.start_time).toLocaleTimeString('ja-JP')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Target</div>
                                        <div className="font-black text-slate-700">{log.production_plans?.planned_quantity || 'N/A'}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ROW 3: GANTT TIMELINE */}
            <div className="bg-white border-2 border-[var(--mcs-border)] rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <Clock size={20} className="text-slate-600" />
                        <h2 className="font-black text-slate-800 text-lg">本日のタイムライン <span className="text-sm text-slate-500 ml-2 font-bold">(Today's Timeline)</span></h2>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[800px]">
                        {todayPlans.length === 0 ? (
                            <div className="text-center text-slate-400 font-bold py-8">計画がありません (No Plans Today)</div>
                        ) : (
                            <div className="space-y-4">
                                {todayPlans.map((plan) => {
                                    const isDone = plan.status === 'COMPLETED'
                                    const isRun = plan.status === 'IN_PROGRESS'
                                    return (
                                        <div key={plan.id} className="flex items-center gap-4 group">
                                            <div className="w-32 shrink-0 font-bold text-slate-700 text-sm text-right pr-4 border-r-2 border-slate-200">
                                                {plan.machine_instance?.internal_code || 'Unknown'}
                                            </div>
                                            <div className="flex-1 bg-slate-50 rounded-lg h-10 flex items-center px-4 relative overflow-hidden border border-slate-200 group-hover:border-slate-400 transition">
                                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${isDone ? 'bg-indigo-500' : isRun ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                                <div className="ml-2 flex items-center justify-between w-full">
                                                    <div className="font-bold text-slate-800 text-sm tracking-wide">
                                                        {plan.order_items?.product_pn_raw}
                                                        <span className="text-xs text-slate-400 ml-2 font-normal">
                                                            ({plan.planned_quantity} qty) • {plan.operator_name || 'No Operator'}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1">
                                                        {isDone && <><CheckCircle2 size={12} className="text-indigo-600" /> <span className="text-indigo-600">COMPLETED</span></>}
                                                        {isRun && <><Activity size={12} className="text-emerald-600 animate-pulse" /> <span className="text-emerald-600">IN PROGRESS</span></>}
                                                        {!isDone && !isRun && <span className="text-amber-600">{plan.status}</span>}
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
