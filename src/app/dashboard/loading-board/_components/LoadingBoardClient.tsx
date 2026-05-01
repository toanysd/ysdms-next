'use client'

import React, { useState } from 'react'
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
        <div className="w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <h2 className="font-black text-slate-700 dark:text-slate-200 flex justify-between items-center">
              Pending Orders
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-xs">{initialPendingOrders.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {initialPendingOrders.map(order => (
              <DraggableOrderCard key={order.order_item_id} order={order} />
            ))}
          </div>
        </div>

        {/* BOARD MATRIX */}
        <div className="flex-1 overflow-auto bg-slate-100/50 dark:bg-slate-950 p-6 relative">
          <div className="inline-block min-w-max bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            
            {/* Header Row (Machines) */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="w-32 shrink-0 border-r border-slate-200 dark:border-slate-800 p-3 sticky left-0 bg-slate-50 dark:bg-slate-950 z-10">
                {/* Corner */}
              </div>
              {initialMachines.map(m => (
                <div key={m.id} className="w-48 shrink-0 border-r border-slate-200 dark:border-slate-800 p-3 text-center">
                  <div className="font-black text-slate-800 dark:text-slate-100 text-lg">{m.internal_code}</div>
                  <div className={`text-[10px] font-bold mt-1 uppercase tracking-wider rounded px-2 py-0.5 inline-block ${m.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {m.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Body */}
            {rows.map((row, rIdx) => {
              const isDay = row.shift === 'DAY'
              return (
                <div key={`${row.dateStr}-${row.shift}`} className={`flex border-b border-slate-100 dark:border-slate-800/50 ${isDay ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-950'}`}>
                  
                  {/* Row Header (Date/Shift) */}
                  <div className="w-32 shrink-0 border-r border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-center sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">{format(parseISO(row.dateStr), 'MMM dd')}</div>
                    <div className={`text-xs font-black uppercase mt-1 ${isDay ? 'text-amber-500' : 'text-indigo-400'}`}>{row.shift}</div>
                  </div>

                  {/* Cells */}
                  {initialMachines.map(m => {
                    const cellId = `${m.id}|${row.dateStr}|${row.shift}`
                    const cellPlans = initialPlans.filter(p => p.machine_instance_id === m.id && p.planned_date === row.dateStr && p.shift === row.shift)
                    return (
                      <DroppableCell key={cellId} id={cellId} isDown={m.status !== 'ACTIVE'}>
                        {m.status !== 'ACTIVE' ? (
                          <div className="w-full h-full flex items-center justify-center opacity-20 bg-stripes">
                            <span className="text-4xl">❌</span>
                          </div>
                        ) : (
                          <div className="space-y-2 p-1 w-full min-h-[80px]">
                            {cellPlans.map(plan => (
                              <div key={plan.id} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded shadow-sm text-xs relative group cursor-pointer hover:border-emerald-400 transition-colors">
                                <div className="font-bold text-slate-800 dark:text-slate-200 truncate pr-4">{plan.product_pn_raw}</div>
                                <div className="text-slate-500 font-medium mt-1">Qty: {plan.planned_quantity}</div>
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>
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
              // We'd rely on revalidatePath to refresh the board, or update local state
            }} 
          />
        )}
      </div>
    </DndContext>
  )
}

function DraggableOrderCard({ order, isOverlay = false }: { order: PendingOrder, isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.order_item_id,
  })

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
  
  // Urgency styling (Anti-pattern but used as MES Convention)
  let borderLeftColor = 'border-l-slate-300'
  if (order.urgency === 'CRITICAL') borderLeftColor = 'border-l-red-500'
  if (order.urgency === 'WARNING') borderLeftColor = 'border-l-amber-500'
  if (order.urgency === 'NORMAL') borderLeftColor = 'border-l-emerald-500'

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl
        border border-slate-200/60 dark:border-slate-700/60
        border-l-4 ${borderLeftColor}
        p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing
        transition-opacity hover:shadow-md
        ${isDragging && !isOverlay ? 'opacity-30' : 'opacity-100'}
        ${isOverlay ? 'shadow-2xl scale-105 rotate-2 cursor-grabbing' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="font-black text-slate-800 dark:text-slate-100">{order.product_pn_raw}</div>
        {order.urgency === 'CRITICAL' && <div className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded animate-pulse">URGENT</div>}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{order.slip_no}</div>
      <div className="flex justify-between mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
        <span>Qty: {order.quantity}</span>
        {order.delivery_date && <span>DL: {format(parseISO(order.delivery_date), 'MM/dd')}</span>}
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
        w-48 shrink-0 border-r border-slate-100 dark:border-slate-800/50 flex items-start justify-center transition-colors
        ${isOver && !isDown ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-inset ring-emerald-400' : ''}
      `}
    >
      {children}
    </div>
  )
}

function ConfirmModal({ data, onClose, onSuccess }: { data: any, onClose: () => void, onSuccess: () => void }) {
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 border-b border-emerald-100 dark:border-emerald-800">
          <h2 className="text-lg font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            ⚙️ Xác nhận Xếp Lịch
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div><span className="text-slate-500 block mb-1">Máy Ép:</span> <span className="font-black text-slate-800 dark:text-slate-100">{data.machine.internal_code}</span></div>
            <div><span className="text-slate-500 block mb-1">Ca / Ngày:</span> <span className="font-black text-slate-800 dark:text-slate-100">{data.shift} | {format(parseISO(data.dateStr), 'MM/dd')}</span></div>
            <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 my-2 pt-2"></div>
            <div className="col-span-2"><span className="text-slate-500 block mb-1">Sản phẩm:</span> <span className="font-black text-slate-800 dark:text-slate-100">{data.order.product_pn_raw}</span></div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Khuôn Tương Thích ▾</label>
            <select 
              value={moldId} 
              onChange={e => setMoldId(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
              required
            >
              <option value="" disabled>Chọn Khuôn...</option>
              {molds.map(m => (
                <option key={m.id} value={m.id}>{m.physical_code} (Cav: {m.cavity})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kế hoạch (Qty)</label>
              <input 
                name="qty" 
                type="number" 
                defaultValue={data.order.quantity} 
                max={data.order.quantity}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Operator</label>
              <input 
                name="operator" 
                type="text" 
                placeholder="Tên thợ..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20">
              {loading ? 'Đang lưu...' : '✅ Xác nhận Lịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
