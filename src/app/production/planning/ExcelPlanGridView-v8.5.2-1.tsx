'use client'
import React, { useContext } from 'react'
import { addDays, parseISO, format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { PlanningContext } from './PlanningClickWrapper'

export default function ExcelPlanGridView({ plans, machines, startDateStr, daysCount = 7 }: { plans: any[], machines: any[], startDateStr: string, daysCount?: number }) {
    const t = useTranslations('Planning.ExcelGrid')
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
        const s = (m.status || 'active').toLowerCase();
        return s === 'active' || s === 'running' || plans.some(p => p.machine_instance_id === m.id);
    })

    const dayLabels = [
        t('days.0'), t('days.1'), t('days.2'), t('days.3'), t('days.4'), t('days.5'), t('days.6')
    ]

    return (
        <div className="w-full h-full overflow-auto bg-[var(--bg-surface-2)]">
            <div className="inline-block min-w-max bg-[var(--bg-surface)] border-b border-r border-[var(--border-default)] relative">
                {/* Header Row (Machines) - STICKY TOP */}
                <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-surface)] sticky top-0 z-20 shadow-sm">
                    <div className="w-20 shrink-0 border-r border-[var(--border-default)] p-3 sticky left-0 bg-[var(--bg-surface)] z-30">
                        {/* Corner empty block */}
                    </div>
                    {activeMachines.map(m => (
                        <div key={m.id} className="w-[340px] shrink-0 border-r border-[var(--border-default)] p-1.5 flex items-center justify-center gap-2 bg-[var(--bg-surface-hover)]">
                            <div className="font-bold text-[14px] text-[var(--text-primary)] font-mono">{m.internal_code}</div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 ${m.status?.toLowerCase() === 'maintenance' || m.status?.toLowerCase() === 'down' ? 'badge badge--error' : 'badge badge--success'}`}>
                                {m.status || 'ACTIVE'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Matrix Body */}
                {rows.map((row, rIdx) => {
                    const isDay = row.shift === 'DAY'
                    const parsedDate = parseISO(row.dateStr)
                    return (
                        <div key={`${row.dateStr}-${row.shift}`} className={`flex border-b border-[var(--border-default)] ${isDay ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-surface-2)]'}`}>
                            {/* Row Header (Date/Shift) */}
                            <div className="w-20 shrink-0 border-r border-[var(--border-default)] py-3 px-1 flex flex-col justify-center items-center sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <div className="font-bold text-[var(--text-primary)] text-[16px] tabular-nums leading-none tracking-tight font-mono">
                                    {format(parsedDate, 'MM/dd')}
                                </div>
                                <div className="text-[12px] font-semibold text-[var(--text-muted)] mt-1">
                                    ({dayLabels[parsedDate.getDay()]})
                                </div>
                                <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono tracking-tighter opacity-80">
                                    {format(parsedDate, 'yyyy-MM-dd')}
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
                                        className={`group w-[340px] shrink-0 border-r border-[var(--border-default)] flex items-start justify-center transition-all min-h-[100px] p-1 relative ${!isDown ? 'hover:bg-[var(--bg-surface-hover)]' : ''}`}
                                        style={isSelected ? { outline: '2px solid var(--accent)', outlineOffset: '-2px', backgroundColor: 'var(--tint-teal-bg)', boxShadow: 'inset 0 0 15px rgba(20, 184, 166, 0.15)', zIndex: 10 } : {}}
                                    >
                                        {isDown && cellPlans.length === 0 ? (
                                            <div className="w-full h-full flex items-center justify-center opacity-30">
                                                <span className="text-xl">❌</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col w-full h-full relative">
                                                {/* Cell Header: Operator & Total Hours */}
                                                {cellPlans.length > 0 && (
                                                    <div className="flex justify-between items-center mb-1.5 px-1 pb-1 border-b border-[var(--border-default)]">
                                                        <div className="text-[12px] font-bold text-[var(--accent)] flex items-center gap-1">
                                                            👤 {operatorName || <span className="text-[var(--text-muted)] font-normal italic">{t('unassigned')}</span>} <span className="text-[var(--text-muted)] font-mono ml-1">[{m.internal_code}]</span>
                                                        </div>
                                                        <div className="text-[12px] font-bold text-[var(--text-primary)] bg-[var(--bg-surface-2)] px-1.5 rounded font-mono">
                                                            {totalHours > 0 ? `${totalHours.toFixed(1)}h` : ''}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Table Header */}
                                                {cellPlans.length > 0 && (
                                                    <div className="grid grid-cols-[95px_50px_1fr_45px_35px] gap-1 px-1 mb-1 text-[11px] text-[var(--text-muted)] font-semibold tracking-tighter">
                                                        <div>{t('headers.productPn')}</div>
                                                        <div className="text-right">{t('headers.quantity')}</div>
                                                        <div className="text-center truncate">{t('headers.notes')}</div>
                                                        <div className="text-center">{t('headers.shipDate')}</div>
                                                        <div className="text-right">{t('headers.hours')}</div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-[2px] flex-1">
                                                    {cellPlans.map(plan => {
                                                        const isLocked = plan.status === 'IN_PROGRESS' || plan.status === 'COMPLETED'
                                                        
                                                        // Delivery Date Logic
                                                        const deliveryDateStr = plan.delivery_date || plan.order_items?.delivery_date || plan.order_items?.orders?.delivery_date
                                                        let displayDate = '—'
                                                        let badgeClass = ''
                                                        if (deliveryDateStr) {
                                                            displayDate = format(parseISO(deliveryDateStr), 'MM/dd')
                                                            const diff = Math.round((parseISO(deliveryDateStr).getTime() - parseISO(plan.planned_date).getTime()) / (1000 * 3600 * 24))
                                                            if (diff <= 0) { badgeClass = 'badge badge--error font-bold' }
                                                            else if (diff === 1) { badgeClass = 'badge badge--warning font-bold' }
                                                            else { badgeClass = 'badge badge--success' }
                                                        }

                                                        // Preview selection color or missing operator
                                                        const isPreview = selectedOrders.includes(plan.order_item_id)
                                                        let planClasses = "bg-[var(--bg-surface)] border-transparent"
                                                        if (isPreview) {
                                                            planClasses = "bg-[var(--tint-amber-bg)] border-[var(--status-warning)]"
                                                        } else if (!plan.operator_name || !plan.estimated_hours) {
                                                            planClasses = "bg-[var(--bg-surface)] border-transparent border-l-2 border-l-[var(--status-warning)]"
                                                        }

                                                        return (
                                                            <div 
                                                                key={plan.id} 
                                                                onClick={(e) => { e.stopPropagation(); onPlanClick(plan); }}
                                                                className={`group relative hover:border-[var(--accent)] hover:shadow-md transition-all rounded-[3px] p-1 grid grid-cols-[95px_50px_1fr_45px_35px] gap-1 items-center text-[12px] cursor-pointer ${planClasses}`}
                                                            >
                                                                <div className="font-bold text-[var(--accent)] truncate flex items-center gap-1 font-mono" title={plan.order_items?.product_pn_raw}>
                                                                    {!plan.mold_physical_id && (
                                                                        <span title={t('moldNotSet')} style={{ color: 'var(--status-warning)' }} className="text-[11px] shrink-0">⚠️</span>
                                                                    )}
                                                                    <span className="truncate">{plan.order_items?.product_pn_raw}</span>
                                                                </div>
                                                                <div className="text-right font-mono font-bold text-[13px] text-[var(--text-primary)]">{plan.planned_quantity.toLocaleString()}</div>
                                                                <div className="text-center truncate text-[var(--text-muted)] text-[11px]" title={plan.quantity_note || ''}>{plan.quantity_note || '—'}</div>
                                                                <div className={`text-center rounded-[2px] font-mono text-[11px] ${badgeClass}`}>{displayDate}</div>
                                                                <div className="text-right font-mono text-[var(--text-muted)]">{plan.estimated_hours ? plan.estimated_hours.toFixed(1) : '—'}</div>
                                                                
                                                                {isLocked && (
                                                                    <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" title={plan.status}></div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                
                                                {/* Add Order Hint */}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); if (!isDown) onCellClick(m.id, row.dateStr, row.shift); }}
                                                    className="w-full mt-1 flex items-center justify-center p-1.5 rounded border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-2)] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-[var(--tint-teal-bg)] hover:border-[var(--accent)] focus:outline-none"
                                                >
                                                    <span className="text-[11px] font-bold">+ {t('addPlan')}</span>
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

