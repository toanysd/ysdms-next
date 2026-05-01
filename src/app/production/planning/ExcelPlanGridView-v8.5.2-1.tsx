'use client'
import { useTransition } from 'react'
import { deleteProductionPlanAction } from '@/app/actions/production'
import { useDroppable } from '@dnd-kit/core'
import { addDays, parseISO, format } from 'date-fns'
import { Loader2, Trash2 } from 'lucide-react'

function DroppableCell({ id, isDown, children }: { id: string, isDown: boolean, children: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({ id, disabled: isDown })
    return (
        <div ref={setNodeRef} className={`w-40 shrink-0 border-r border-[var(--mcs-border)] flex items-start justify-center transition-colors min-h-[100px] p-1 ${isOver && !isDown ? 'bg-[var(--mcs-success-light)] ring-2 ring-inset ring-[var(--mcs-success)]' : ''}`}>
            {children}
        </div>
    )
}

export default function ExcelPlanGridView({ plans, machines, startDateStr }: { plans: any[], machines: any[], startDateStr: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Bạn có chắc xoá kế hoạch này?')) return
        startTransition(async () => {
            try {
                await deleteProductionPlanAction(id)
            } catch (err: any) {
                alert(err.message)
            }
        })
    }

    // Prepare rows for 7 days (DAY/NIGHT shifts)
    const start = parseISO(startDateStr)
    const rows: { dateStr: string, shift: 'DAY' | 'NIGHT' }[] = []
    for (let i = 0; i < 7; i++) {
        const d = addDays(start, i)
        const dateStr = format(d, 'yyyy-MM-dd')
        rows.push({ dateStr, shift: 'DAY' })
        rows.push({ dateStr, shift: 'NIGHT' })
    }

    // We only want active machines or machines that have plans
    const activeMachines = machines.filter(m => {
        const s = m.status?.toLowerCase();
        return s === 'active' || s === 'running' || plans.some(p => p.machine_instance_id === m.id);
    })

    return (
        <div className="w-full h-full overflow-auto bg-[var(--mcs-surface-2)] p-4">
            <div className="inline-block min-w-max bg-[var(--mcs-surface)] rounded-md border border-[var(--mcs-border-strong)] shadow-sm overflow-hidden">
                {/* Header Row (Machines) */}
                <div className="flex border-b border-[var(--mcs-border-strong)] bg-[var(--mcs-surface)]">
                    <div className="w-24 shrink-0 border-r border-[var(--mcs-border-strong)] p-3 sticky left-0 bg-[var(--mcs-surface)] z-10">
                        {/* Corner empty block */}
                    </div>
                    {activeMachines.map(m => (
                        <div key={m.id} className="w-40 shrink-0 border-r border-[var(--mcs-border)] p-2 text-center bg-[var(--mcs-surface-hover)]">
                            <div className="font-bold text-[14px] text-[var(--mcs-text)]">{m.internal_code}</div>
                            <div className={`text-[9px] font-bold mt-[2px] uppercase tracking-wider rounded px-1 py-0.5 inline-block ${m.status?.toLowerCase() === 'maintenance' || m.status?.toLowerCase() === 'down' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {m.status || 'ACTIVE'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Matrix Body */}
                {rows.map((row, rIdx) => {
                    const isDay = row.shift === 'DAY'
                    return (
                        <div key={`${row.dateStr}-${row.shift}`} className={`flex border-b border-[var(--mcs-border)] ${isDay ? 'bg-[var(--mcs-surface)]' : 'bg-[var(--mcs-surface-2)]'}`}>
                            {/* Row Header (Date/Shift) */}
                            <div className="w-24 shrink-0 border-r border-[var(--mcs-border-strong)] p-2 flex flex-col justify-center items-center sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <div className="font-bold text-[var(--mcs-text)] text-[12px] tabular-nums">{format(parseISO(row.dateStr), 'MM/dd')}</div>
                                <div className={`text-[10px] font-bold uppercase mt-[2px] ${isDay ? 'text-amber-500' : 'text-indigo-400'}`}>{row.shift}</div>
                            </div>

                            {/* Cells */}
                            {activeMachines.map(m => {
                                const cellId = `${m.id}|${row.dateStr}|${row.shift}`
                                const cellPlans = plans.filter(p => p.machine_instance_id === m.id && p.planned_date === row.dateStr && (p.shift === row.shift || (!p.shift && isDay)))
                                const isDown = m.status?.toLowerCase() === 'maintenance' || m.status?.toLowerCase() === 'down'

                                return (
                                    <DroppableCell key={cellId} id={cellId} isDown={isDown}>
                                        {isDown && cellPlans.length === 0 ? (
                                            <div className="w-full h-full flex items-center justify-center opacity-30">
                                                <span className="text-xl">❌</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col w-full gap-1">
                                                {cellPlans.map(plan => {
                                                    const isLocked = plan.status === 'IN_PROGRESS' || plan.status === 'COMPLETED'
                                                    return (
                                                        <div key={plan.id} className="group relative bg-[var(--mcs-surface)] border border-[var(--mcs-border-strong)] p-1.5 rounded-[4px] shadow-sm text-[11px] hover:border-[var(--mcs-primary)] transition-colors">
                                                            <div className="font-bold text-[var(--mcs-primary)] truncate" title={plan.order_items?.product_pn_raw}>{plan.order_items?.product_pn_raw}</div>
                                                            <div className="text-[var(--mcs-text-secondary)] font-mono text-[10px] mt-0.5">Qty: {plan.planned_quantity}</div>
                                                            
                                                            {/* Delete Button */}
                                                            {!isLocked && (
                                                                <button 
                                                                    onClick={(e) => handleDelete(plan.id, e)}
                                                                    className="absolute top-1 right-1 p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    disabled={isPending}
                                                                >
                                                                    {isPending ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                                                                </button>
                                                            )}
                                                            {isLocked && (
                                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" title={plan.status}></div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </DroppableCell>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
