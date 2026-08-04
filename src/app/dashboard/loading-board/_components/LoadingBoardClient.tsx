'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { MachineInstance, PendingOrder, ProductionPlan, MoldPhysical } from '@/types/loading-board'
import { createProductionPlan, getCompatibleMolds } from '../_actions/board'
import { addDays, parseISO, format } from 'date-fns'

interface Props {
  initialMachines: MachineInstance[]
  initialPendingOrders: PendingOrder[]
  initialPlans: ProductionPlan[]
  startDateStr: string
}

export default function LoadingBoardClient({ initialMachines, initialPendingOrders, initialPlans, startDateStr }: Props) {
  const t = useTranslations('LoadingBoard')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [dropData, setDropData] = useState<any>(null)
  
  // Generating Rows (7 days x 2 shifts)
  const start = parseISO(startDateStr)
  const rows = []
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i)
    const dateStr = format(d, 'yyyy-MM-dd')
    rows.push({ dateStr, shift: 'DAY' as const })
    rows.push({ dateStr, shift: 'NIGHT' as const })
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (over && over.id) {
      // over.id should be encoded cell info like "m-id|2026-05-01|DAY"
      const [machineId, dateStr, shift] = (over.id as string).split('|')
      const orderId = active.id as string

      const order = initialPendingOrders.find(o => o.order_item_id === orderId)
      const machine = initialMachines.find(m => m.id === machineId)

      if (order && machine) {
        setDropData({ order, machine, dateStr, shift })
        setModalOpen(true)
      }
    }
  }

  const activeOrder = activeId ? initialPendingOrders.find(o => o.order_item_id === activeId) : null

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full overflow-hidden">
        
        {/* SIDEBAR */}
        <div className="w-80 bg-[var(--bg-surface-2)] border-r border-[var(--border-default)] flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
            <h2 className="font-bold text-[var(--text-primary)] text-sm flex justify-between items-center">
              {t('pendingOrders')}
              <span className="badge badge--neutral text-xs font-mono">{initialPendingOrders.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {initialPendingOrders.map(order => (
              <DraggableOrderCard key={order.order_item_id} order={order} />
            ))}
          </div>
        </div>

        {/* BOARD MATRIX */}
        <div className="flex-1 overflow-auto bg-[var(--bg-surface-2)] p-6 relative">
          <div className="inline-block min-w-max bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden">
            
            {/* Header Row (Machines) */}
            <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
              <div className="w-32 shrink-0 border-r border-[var(--border-default)] p-3 sticky left-0 bg-[var(--bg-surface-2)] z-10">
                {/* Corner */}
              </div>
              {initialMachines.map(m => (
                <div key={m.id} className="w-48 shrink-0 border-r border-[var(--border-default)] p-3 text-center">
                  <div className="font-mono font-bold text-[var(--text-primary)] text-base">{m.internal_code}</div>
                  <div className={`text-[10px] font-bold mt-1 uppercase tracking-wider rounded px-2 py-0.5 inline-block ${m.status === 'ACTIVE' ? 'badge badge--success' : 'badge badge--error'}`}>
                    {m.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Body */}
            {rows.map((row) => {
              const isDay = row.shift === 'DAY'
              return (
                <div key={`${row.dateStr}-${row.shift}`} className={`flex border-b border-[var(--border-subtle)] ${isDay ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-surface-2)]'}`}>
                  
                  {/* Row Header (Date/Shift) */}
                  <div className="w-32 shrink-0 border-r border-[var(--border-default)] p-3 flex flex-col justify-center sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="font-mono font-bold text-[var(--text-primary)] text-xs">{format(parseISO(row.dateStr), 'MM/dd')}</div>
                    <div className={`text-[10px] font-bold uppercase mt-1 ${isDay ? 'text-[var(--status-warning)]' : 'text-[var(--status-info)]'}`}>{row.shift}</div>
                  </div>

                  {/* Cells */}
                  {initialMachines.map(m => {
                    const cellId = `${m.id}|${row.dateStr}|${row.shift}`
                    const cellPlans = initialPlans.filter(p => p.machine_instance_id === m.id && p.planned_date === row.dateStr && p.shift === row.shift)
                    return (
                      <DroppableCell key={cellId} id={cellId} isDown={m.status !== 'ACTIVE'}>
                        {m.status !== 'ACTIVE' ? (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            <span className="text-2xl">❌</span>
                          </div>
                        ) : (
                          <div className="space-y-2 p-1 w-full min-h-[80px]">
                            {cellPlans.map(plan => (
                              <div key={plan.id} className="card-flat p-2 text-xs relative group cursor-pointer hover:border-[var(--accent)] transition-colors">
                                <div className="font-bold text-[var(--text-primary)] truncate pr-4">{plan.product_pn_raw}</div>
                                <div className="text-[var(--text-muted)] font-mono text-[11px] mt-1">{t('qty', { qty: plan.planned_quantity })}</div>
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--status-success)]"></div>
                              </div>
                            ))}
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

        {/* OVERLAY FOR DRAGGING */}
        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeOrder ? <DraggableOrderCard order={activeOrder} isOverlay /> : null}
        </DragOverlay>

        {/* CONFIRM MODAL */}
        {modalOpen && dropData && (
          <ConfirmModal 
            data={dropData} 
            onClose={() => setModalOpen(false)} 
            onSuccess={() => {
              setModalOpen(false)
            }} 
          />
        )}
      </div>
    </DndContext>
  )
}

function DraggableOrderCard({ order, isOverlay = false }: { order: PendingOrder, isOverlay?: boolean }) {
  const t = useTranslations('LoadingBoard')
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.order_item_id,
  })

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
  
  let badgeClass = 'badge badge--neutral'
  if (order.urgency === 'CRITICAL') badgeClass = 'badge badge--error'
  if (order.urgency === 'WARNING') badgeClass = 'badge badge--warning'
  if (order.urgency === 'NORMAL') badgeClass = 'badge badge--success'

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`
        card-flat p-3 cursor-grab active:cursor-grabbing
        transition-opacity hover:shadow-md
        ${isDragging && !isOverlay ? 'opacity-30' : 'opacity-100'}
        ${isOverlay ? 'shadow-2xl scale-105 rotate-2 cursor-grabbing' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="font-bold text-[var(--text-primary)] text-xs">{order.product_pn_raw}</div>
        {order.urgency === 'CRITICAL' && <div className={`${badgeClass} text-[10px] animate-pulse`}>{t('urgent')}</div>}
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">{order.slip_no}</div>
      <div className="flex justify-between mt-2 text-xs font-mono font-bold text-[var(--text-secondary)]">
        <span>{t('qty', { qty: order.quantity })}</span>
        {order.delivery_date && <span>{t('dl', { date: format(parseISO(order.delivery_date), 'MM/dd') })}</span>}
      </div>
    </div>
  )
}

function DroppableCell({ id, isDown, children }: { id: string, isDown: boolean, children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id, disabled: isDown })

  return (
    <div 
      ref={setNodeRef} 
      className={`
        w-48 shrink-0 border-r border-[var(--border-subtle)] flex items-start justify-center transition-colors
        ${isOver && !isDown ? 'bg-[var(--tint-teal-bg)] ring-2 ring-inset ring-[var(--accent)]' : ''}
      `}
    >
      {children}
    </div>
  )
}

function ConfirmModal({ data, onClose, onSuccess }: { data: any, onClose: () => void, onSuccess: () => void }) {
  const t = useTranslations('LoadingBoard')
  const [loading, setLoading] = useState(false)
  const [moldId, setMoldId] = useState('')
  const [molds, setMolds] = useState<MoldPhysical[]>([])

  React.useEffect(() => {
    getCompatibleMolds(data.machine.id, data.order.order_item_id).then(res => {
      setMolds(res)
      if (res.length > 0) setMoldId(res[0].id)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.target as HTMLFormElement)
    const qty = Number(fd.get('qty'))
    const selectedMold = molds.find(m => m.id === moldId)
    const shots = selectedMold ? Math.ceil(qty / selectedMold.cavity) : 0

    await createProductionPlan({
      order_item_id: data.order.order_item_id,
      machine_instance_id: data.machine.id,
      mold_physical_id: moldId || null,
      planned_date: data.dateStr,
      shift: data.shift,
      planned_quantity: qty,
      estimated_shots: shots,
      operator_name: fd.get('operator') as string || null
    })
    
    setLoading(false)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-[var(--bg-surface)] w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)]">
        <div className="card-header-tint p-4 border-b border-[var(--border-default)]">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            {t('confirmModalTitle')}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4 text-xs bg-[var(--bg-surface-2)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <div><span className="text-[var(--text-muted)] block mb-1">{t('machine')}:</span> <span className="font-mono font-bold text-[var(--text-primary)]">{data.machine.internal_code}</span></div>
            <div><span className="text-[var(--text-muted)] block mb-1">{t('shiftDate')}:</span> <span className="font-mono font-bold text-[var(--text-primary)]">{data.shift} | {format(parseISO(data.dateStr), 'MM/dd')}</span></div>
            <div className="col-span-2 border-t border-[var(--border-subtle)] my-2 pt-2"></div>
            <div className="col-span-2"><span className="text-[var(--text-muted)] block mb-1">{t('product')}:</span> <span className="font-bold text-[var(--text-primary)]">{data.order.product_pn_raw}</span></div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">{t('compatibleMold')}</label>
            <select 
              value={moldId} 
              onChange={e => setMoldId(e.target.value)}
              className="form-select w-full"
              required
            >
              <option value="" disabled>{t('selectMold')}</option>
              {molds.map(m => (
                <option key={m.id} value={m.id}>{m.physical_code} (Cav: {m.cavity})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">{t('plannedQty')}</label>
              <input 
                name="qty" 
                type="number" 
                defaultValue={data.order.quantity} 
                max={data.order.quantity}
                className="form-input w-full font-mono font-bold"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">{t('operator')}</label>
              <input 
                name="operator" 
                type="text" 
                placeholder={t('operatorPlaceholder')}
                className="form-input w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-[var(--border-default)]">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs px-4 py-2">
              {t('cancel')}
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-4 py-2 flex items-center gap-2">
              {loading ? t('saving') : t('confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
