'use client'
import React, { useContext } from 'react'
import { addDays, parseISO, format } from 'date-fns'
import { PlanningContext } from './PlanningClickWrapper'

export default function ExcelPlanGridView({ plans, machines, startDateStr, daysCount = 7 }: { plans: any[], machines: any[], startDateStr: string, daysCount?: number }) {
    const { onCellClick, onPlanClick, selectedOrders, selectedCell } = useContext(PlanningContext)

    // Prepare rows based on daysCount (DAY/NIGHT shifts)
    const start = parseISO(startDateStr)
    const rows: { dateStr: string, shift: 'DAY' | 'NIGHT' }[] = []
    for (let i = 0; i < daysCount; i++) {
        const d = addDays(start, i)
        const dateStr = format(d, 'yyyy-MM-dd')
        rows.push({ dateStr, shift: 'DAY' })
    }

    // We only want active machines or machines that have plans
    const activeMachines = machines.filter(m => {
        const s = m.status?.toLowerCase();
        return s === 'active' || s === 'running' || plans.some(p => p.machine_instance_id === m.id);
    })

    return (
        <div className="w-full h-full overflow-auto bg-[var(--mcs-surface-2)]">
            <div className="inline-block min-w-max bg-[var(--mcs-surface)] border-b border-r border-[var(--mcs-border-strong)] relative">
                {/* Header Row (Machines) - STICKY TOP */}
                <div className="flex border-b border-[var(--mcs-border-strong)] bg-[var(--mcs-surface)] sticky top-0 z-20 shadow-sm">
                    <div className="w-20 shrink-0 border-r border-[var(--mcs-border-strong)] p-3 sticky left-0 bg-[var(--mcs-surface)] z-30">
                        {/* Corner empty block */}
                    </div>
                    {activeMachines.map(m => (
                        <div key={m.id} className="w-[340px] shrink-0 border-r border-[var(--mcs-border)] p-1.5 flex items-center justify-center gap-2 bg-[var(--mcs-surface-hover)]">
                            <div className="font-bold text-[14px] text-[var(--mcs-text)]">{m.internal_code}</div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 ${m.status?.toLowerCase() === 'maintenance' || m.status?.toLowerCase() === 'down' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {m.status || 'ACTIVE'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Matrix Body */}
                {rows.map((row, rIdx) => {
                    const isDay = row.shift === 'DAY'
                    return (
                        <div key={`${row.dateStr}-${row.shift}`} className={`flex border-b border-[var(--mcs-border)] ${isDay ? 'bg-[var(--mcs-surface)]' : 'bg-[var(--mcs-surface-2)]'}`}>
                            {/* Row Header (Date/Shift) */}
                            <div className="w-20 shrink-0 border-r border-[var(--mcs-border-strong)] py-3 px-1 flex flex-col justify-center items-center sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <div className="font-bold text-[var(--mcs-text)] text-[16px] tabular-nums leading-none tracking-tight">
                                    {format(parseISO(row.dateStr), 'MM/dd')}
                                </div>
                                <div className="text-[12px] font-bold text-gray-500 mt-1">
                                    ({['日', '月', '火', '水', '木', '金', '土'][parseISO(row.dateStr).getDay()]})
                                </div>
                                <div className="text-[9px] text-gray-400 mt-1.5 font-mono tracking-tighter opacity-70">
                                    {format(parseISO(row.dateStr), 'yyyy年MM月dd日')}
                                </div>
                            </div>

                            {/* Cells */}
                            {activeMachines.map(m => {
                                const cellId = `${m.id}|${row.dateStr}|${row.shift}`
                                const cellPlansRaw = plans.filter(p => p.machine_instance_id === m.id && p.planned_date === row.dateStr && (p.shift === row.shift || (!p.shift && isDay)))
                                const cellPlans = [...cellPlansRaw].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                                const isDown = m.status?.toLowerCase() === 'maintenance' || m.status?.toLowerCase() === 'down'
                                
                                const totalHours = cellPlans.reduce((sum, p) => sum + (Number(p.estimated_hours) || 0), 0)
                                const operatorName = cellPlans.find(p => p.operator_name)?.operator_name || ''
                                const isSelected = selectedCell?.machineId === m.id && selectedCell?.dateStr === row.dateStr && selectedCell?.shift === row.shift

                                return (
                                    <div 
                                        key={cellId} 
                                        className={`group w-[340px] shrink-0 border-r border-[var(--mcs-border)] flex items-start justify-center transition-all min-h-[100px] p-1 relative ${!isDown ? 'hover:bg-gray-50/50' : ''}`}
                                        style={isSelected ? { outline: '2px solid #0d9488', outlineOffset: '-2px', backgroundColor: 'rgba(20, 184, 166, 0.1)', boxShadow: 'inset 0 0 15px rgba(20, 184, 166, 0.15)', zIndex: 10 } : {}}
                                    >
                                        {isDown && cellPlans.length === 0 ? (
                                            <div className="w-full h-full flex items-center justify-center opacity-30">
                                                <span className="text-xl">❌</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col w-full h-full relative">
                                                {/* Cell Header: Operator & Total Hours */}
                                                {cellPlans.length > 0 && (
                                                    <div className="flex justify-between items-center mb-1.5 px-1 pb-1 border-b border-[var(--mcs-border)]">
                                                        <div className="text-[11px] font-bold text-[var(--mcs-primary)] flex items-center gap-1">
                                                            👤 {operatorName || <span className="text-gray-400 font-normal italic">Chưa gán</span>} <span className="text-gray-400 font-mono ml-1">[{m.internal_code}]</span>
                                                        </div>
                                                        <div className="text-[11px] font-bold text-gray-600 bg-gray-100 px-1.5 rounded">
                                                            {totalHours > 0 ? `${totalHours.toFixed(1)}h` : ''}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Table Header */}
                                                {cellPlans.length > 0 && (
                                                    <div className="grid grid-cols-[95px_50px_1fr_45px_35px] gap-1 px-1 mb-1 text-[11px] text-gray-500 font-bold tracking-tighter">
                                                        <div>品番</div>
                                                        <div className="text-right">数量</div>
                                                        <div className="text-center truncate">備考</div>
                                                        <div className="text-center">出荷</div>
                                                        <div className="text-right">時間</div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-[2px] flex-1">
                                                    {cellPlans.map(plan => {
                                                        const isLocked = plan.status === 'IN_PROGRESS' || plan.status === 'COMPLETED'
                                                        
                                                        // Delivery Date Logic
                                                        const deliveryDateStr = plan.delivery_date || plan.order_items?.delivery_date || plan.order_items?.orders?.delivery_date
                                                        let badgeColor = 'text-gray-400'
                                                        let displayDate = '—'
                                                        let badgeBg = ''
                                                        if (deliveryDateStr) {
                                                            displayDate = format(parseISO(deliveryDateStr), 'MM/dd')
                                                            const diff = Math.round((parseISO(deliveryDateStr).getTime() - parseISO(plan.planned_date).getTime()) / (1000 * 3600 * 24))
                                                            if (diff <= 0) { badgeBg = 'bg-red-100'; badgeColor = 'text-red-700 font-bold' }
                                                            else if (diff === 1) { badgeBg = 'bg-amber-100'; badgeColor = 'text-amber-700 font-bold' }
                                                            else { badgeBg = 'bg-emerald-100'; badgeColor = 'text-emerald-700 font-bold' }
                                                        }

                                                        // Preview selection color or missing operator
                                                        const isPreview = selectedOrders.includes(plan.order_item_id)
                                                        let planClasses = "bg-white border-transparent"
                                                        if (isPreview) {
                                                            planClasses = "bg-yellow-100 border-yellow-400"
                                                        } else if (!plan.operator_name || !plan.estimated_hours) {
                                                            planClasses = "bg-white border-transparent border-l-2 border-l-orange-400"
                                                        }

                                                        return (
                                                            <div 
                                                                key={plan.id} 
                                                                onClick={(e) => { e.stopPropagation(); onPlanClick(plan); }}
                                                                className={`group relative hover:border-[var(--mcs-primary)] hover:shadow-md transition-all rounded-[3px] p-1 grid grid-cols-[95px_50px_1fr_45px_35px] gap-1 items-center text-[12px] cursor-pointer ${planClasses}`}
                                                            >
                                                                <div className="font-bold text-[var(--mcs-primary)] truncate flex items-center gap-1" title={plan.order_items?.product_pn_raw}>
                                                                    {!plan.mold_physical_id && (
                                                                        <span title="金型未設定 (Chưa gán khuôn)" className="text-amber-500 text-[10px] shrink-0">⚠️</span>
                                                                    )}
                                                                    <span className="truncate">{plan.order_items?.product_pn_raw}</span>
                                                                </div>
                                                                <div className="text-right font-mono font-medium text-[var(--mcs-text)]">{plan.planned_quantity.toLocaleString()}</div>
                                                                <div className="text-center truncate text-gray-500 text-[11px]" title={plan.quantity_note || ''}>{plan.quantity_note || '—'}</div>
                                                                <div className={`text-center rounded-[2px] ${badgeBg} ${badgeColor}`}>{displayDate}</div>
                                                                <div className="text-right font-mono text-gray-600">{plan.estimated_hours ? plan.estimated_hours.toFixed(1) : '—'}</div>
                                                                
                                                                {isLocked && (
                                                                    <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-blue-500" title={plan.status}></div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                
                                                {/* Add Order Hint */}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); if (!isDown) onCellClick(m.id, row.dateStr, row.shift); }}
                                                    className="w-full mt-1 flex items-center justify-center p-1.5 rounded border border-dashed border-gray-300 bg-gray-50 text-[var(--mcs-primary)] opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-teal-50 hover:border-teal-400 focus:outline-none"
                                                >
                                                    <span className="text-[11px] font-bold">+ 計画追加 <span className="font-normal text-[10px] ml-1">(Thêm)</span></span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
