'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Play, CheckCircle, Factory, Settings, Check, Clock } from 'lucide-react'
import {
    getTodayProductionPlans,
    getActiveProductionLogs,
    getTodayCompletedLogs,
    confirmProductionPlan,
    startProductionFromPlan
} from '@/app/actions/production'

export default function KanbanBoard({ initialPending, initialActive, initialCompleted }: any) {
    const [pendingItems, setPendingItems] = useState<any[]>(initialPending || [])
    const [activeLogs, setActiveLogs] = useState<any[]>(initialActive || [])
    const [completedLogs, setCompletedLogs] = useState<any[]>(initialCompleted || [])

    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

    const fetchOngoing = useCallback(async () => {
        try {
            const active = await getActiveProductionLogs()
            setActiveLogs(active)
        } catch (e) {
            console.error('Failed to fetch active logs', e)
        }
    }, [])

    const fetchOthers = useCallback(async () => {
        try {
            const pending = await getTodayProductionPlans()
            const completed = await getTodayCompletedLogs()
            setPendingItems(pending)
            setCompletedLogs(completed)
        } catch (e) {
            console.error('Failed to fetch backlog/completed logs', e)
        }
    }, [])

    // Refresh Active Logs every 30s
    useEffect(() => {
        const intervalId = setInterval(fetchOngoing, 30000)
        return () => clearInterval(intervalId)
    }, [fetchOngoing])

    // Refresh Pending & Completed every 60s
    useEffect(() => {
        const intervalId = setInterval(fetchOthers, 60000)
        return () => clearInterval(intervalId)
    }, [fetchOthers])

    const handleConfirm = async (planId: string) => {
        setIsLoading(prev => ({ ...prev, [planId]: true }))
        try {
            await confirmProductionPlan(planId)
            await fetchOthers() // Refresh cột 1
        } catch (e: any) {
            alert(e.message)
        } finally {
            setIsLoading(prev => ({ ...prev, [planId]: false }))
        }
    }

    const handleStart = async (planId: string) => {
        setIsLoading(prev => ({ ...prev, [planId]: true }))
        try {
            await startProductionFromPlan(planId)
            await Promise.all([fetchOthers(), fetchOngoing()]) // Đồng bộ cả 2 cột
        } catch (e: any) {
            alert(e.message)
        } finally {
            setIsLoading(prev => ({ ...prev, [planId]: false }))
        }
    }

    return (
        <div className="flex-1 p-6 overflow-hidden flex flex-col bg-[var(--mcs-surface)] h-screen">
            <header className="mb-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--mcs-text)] flex items-center gap-2">
                        <Factory className="text-[var(--mcs-primary)]" />
                        生産管理 Kanban (Production Execution) V2
                    </h1>
                    <p className="text-sm text-[var(--mcs-text-muted)]">Giám sát và Vận hành Tiến độ Xưởng (Dữ liệu Lịch chạy máy)</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/production/active" className="px-4 py-2 bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] text-[var(--mcs-text)] rounded-md font-bold flex items-center gap-2 hover:border-[var(--mcs-primary)] transition-colors">
                        <Settings size={18} /> Monitor (TV View)
                    </Link>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">

                {/* ---------------- CỘT 1: Cần chạy (DRAFT/SCHEDULED) ---------------- */}
                <div className="flex flex-col bg-[var(--mcs-surface-alert)] border border-[var(--mcs-border)] rounded-lg p-4 h-full min-h-0">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--mcs-border)] shrink-0">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <h2 className="font-bold text-[var(--mcs-text)] text-lg">Chờ Chạy (未着手)</h2>
                        <span className="ml-auto bg-[var(--mcs-surface-2)] px-2 py-1 rounded-full text-xs font-bold text-[var(--mcs-text-muted)]">
                            {pendingItems?.length || 0}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {pendingItems?.map((plan: any) => {
                            const waitLoading = isLoading[plan.id]
                            const isScheduled = plan.status === 'SCHEDULED'

                            return (
                                <div key={plan.id} className={`bg-[var(--mcs-surface)] border-l-4 ${isScheduled ? 'border-l-blue-500' : 'border-l-amber-500'} border border-[var(--mcs-border)] rounded-md p-3 shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[11px] text-[var(--mcs-primary)] font-bold mb-1 truncate">
                                                {plan.order_items.orders.slip_no} • {plan.order_items.product_pn_raw}
                                            </div>
                                            <div className="text-sm font-bold text-[var(--mcs-text)] mb-2">
                                                Cần sx: {plan.planned_quantity?.toLocaleString()} khay
                                            </div>
                                            <div className="text-[11px] text-[var(--mcs-text-muted)] flex items-center gap-2 flex-wrap">
                                                <span className="bg-[var(--mcs-surface-2)] px-1.5 py-0.5 rounded">Máy: {plan.machine_instance.internal_code}</span>
                                                <span className="bg-[var(--mcs-surface-2)] px-1.5 py-0.5 rounded">Khuôn: {plan.mold_physical.physical_code}</span>
                                                {plan.operator_name && <span>Thợ: {plan.operator_name}</span>}
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex items-center">
                                            {isScheduled ? (
                                                <button
                                                    onClick={() => handleStart(plan.id)}
                                                    disabled={waitLoading}
                                                    className="p-2 px-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-md transition-colors shadow flex items-center gap-1 font-bold text-xs"
                                                >
                                                    <Play size={14} /> 開始 Bắt đầu
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleConfirm(plan.id)}
                                                    disabled={waitLoading}
                                                    className="p-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[var(--mcs-surface)] rounded-md transition-colors shadow flex items-center gap-1 font-bold text-xs"
                                                >
                                                    <Check size={14} /> 確認 Xác nhận
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {!isScheduled && (
                                        <div className="mt-2 text-[10px] text-amber-600 font-medium">
                                            Đang là lệnh nháp. Quản đốc cần Duyệt (Xác nhận) trước khi máy chạy.
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {(!pendingItems || pendingItems.length === 0) && (
                            <div className="text-center text-[var(--mcs-text-muted)] text-sm py-10">待機中の生産計画はありません。<br />(Không có lệnh chờ)</div>
                        )}
                    </div>
                </div>

                {/* ---------------- CỘT 2: Đang Lên Máy (IN_PROGRESS) ---------------- */}
                <div className="flex flex-col bg-[var(--mcs-surface-success)] border border-[var(--mcs-border)] rounded-lg p-4 h-full min-h-0">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--mcs-border)] shrink-0">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <h2 className="font-bold text-[var(--mcs-text)] text-lg">実行中 (Đang Chạy)</h2>
                        <span className="ml-auto bg-[var(--mcs-surface-2)] px-2 py-1 rounded-full text-xs font-bold text-[var(--mcs-text-muted)]">
                            {activeLogs?.length || 0}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {activeLogs?.map((log: any) => {
                            const startTime = new Date(log.start_time)
                            const now = new Date()
                            const diffMs = now.getTime() - startTime.getTime()
                            const diffMins = Math.floor(diffMs / 60000)
                            const diffHours = Math.floor(diffMins / 60)
                            const remainMins = diffMins % 60
                            const runtimeStr = diffHours > 0 ? `${diffHours}h ${remainMins}m` : `${remainMins}m`

                            return (
                                <div key={log.id} className="bg-[var(--mcs-surface)] border-l-4 border-l-emerald-500 border border-[var(--mcs-border)] rounded-md p-3 shadow-sm flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[11px] text-[var(--mcs-primary)] font-bold mb-1 truncate">
                                                {log.order_items.product_pn_raw}
                                            </div>
                                            <div className="text-sm font-bold text-[var(--mcs-text)] flex items-center gap-2 mb-1">
                                                生産機 (Máy ép): <span className="bg-[var(--mcs-surface-2)] px-1.5 py-0.5 rounded border border-[var(--mcs-border)]">
                                                    {log.machine_instance?.internal_code || log.machine_master?.code || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-[var(--mcs-text)]">
                                                MTSD: {log.production_plans?.planned_quantity?.toLocaleString() || log.order_items.quantity?.toLocaleString()} Khay
                                            </div>
                                        </div>
                                        <Link href={`/production/track/${log.order_items.id}?logId=${log.id}`} className="shrink-0 p-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors shadow flex items-center gap-1 font-bold text-xs">
                                            <CheckCircle size={14} /> Chốt
                                        </Link>
                                    </div>
                                    <div className="text-[11px] text-[var(--mcs-text-muted)] flex justify-between items-center mt-1 border-t border-[var(--mcs-border)] pt-2">
                                        <span>作業者 (Thợ): {log.operator_name || log.production_plans?.operator_name || 'N/A'}</span>
                                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                            <Clock size={12} /> {runtimeStr}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        {(!activeLogs || activeLogs.length === 0) && (
                            <div className="text-center text-[var(--mcs-text-muted)] text-sm py-10">Máy xưởng đang rảnh tải.</div>
                        )}
                    </div>
                </div>

                {/* ---------------- CỘT 3: Hoàn thành hôm nay (COMPLETED) ---------------- */}
                <div className="flex flex-col bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] rounded-lg p-4 h-full min-h-0">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--mcs-border)] shrink-0">
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                        <h2 className="font-bold text-[var(--mcs-text)] text-lg">完了 (Xong Hôm Nay)</h2>
                        <span className="ml-auto bg-[var(--mcs-surface)] px-2 py-1 rounded-full text-xs font-bold text-[var(--mcs-text-muted)]">
                            {completedLogs?.length || 0}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {completedLogs?.map((log: any) => {
                            const endTimeStr = log.end_time ? new Date(log.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''

                            return (
                                <div key={log.id} className="bg-[var(--mcs-surface)] border-l-4 border-l-indigo-500 border border-[var(--mcs-border)] rounded-md p-3 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[11px] text-[var(--mcs-primary)] font-bold mb-1 truncate">
                                                {log.order_items.orders?.slip_no} • {log.order_items.product_pn_raw}
                                            </div>
                                            <div className="text-sm font-bold text-[var(--mcs-text)] flex items-center gap-2 mb-1">
                                                良品 (OK): <span className="text-indigo-600">{log.produced_qty?.toLocaleString()}</span> khay
                                            </div>
                                            {log.scrap_qty > 0 && (
                                                <div className="text-xs text-red-500 font-bold mb-1">
                                                    不良 (NG): {log.scrap_qty?.toLocaleString()} khay
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-[var(--mcs-text-muted)] flex justify-between items-center mt-1 border-t border-[var(--mcs-border)] pt-2">
                                        <span>生産機 (Máy): {log.machine_instance?.internal_code || log.machine_master?.code || 'N/A'}</span>
                                        <span className="font-bold">完了時間 (End): {endTimeStr}</span>
                                    </div>
                                </div>
                            )
                        })}
                        {(!completedLogs || completedLogs.length === 0) && (
                            <div className="text-center text-[var(--mcs-text-muted)] text-sm py-10">本日完了したロットはありません。<br />(Chưa có mẻ nào hoàn thành trong hôm nay)</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
