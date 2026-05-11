'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { recordShipReturn } from '../actions'

interface ShipLogTabProps {
  moldId: string
  employees: { id: string; name: string; name_ja?: string }[]
}

interface ShipPair {
  outLog: any
  returnLog: any | null
}

export function ShipLogTab({ moldId, employees }: ShipLogTabProps) {
  const [logs, setLogs] = useState<ShipPair[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // Return form state
  const [receivingLogId, setReceivingLogId] = useState<string | null>(null)
  const [returnEmployeeId, setReturnEmployeeId] = useState('')
  const [returnNotes, setReturnNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('mold_ship_logs')
        .select(`
          id, direction, ship_date, return_date, notes, created_at,
          company:companies(id, name),
          handler:employees!mold_ship_logs_handler_id_fkey(name, name_ja),
          item_type:item_types(id, name)
        `)
        .eq('mold_physical_id', moldId)
        .order('ship_date', { ascending: true }) // fetch ASC to pair, then reverse

      if (data) {
        const paired = data.reduce((acc, log) => {
          if (log.direction === 'SHIP_OUT') {
            acc.push({ outLog: log, returnLog: null })
          } else if (log.direction === 'RETURN') {
            // Find last unpaired SHIP_OUT
            const unpairedOut = [...acc].reverse().find(p => p.returnLog === null)
            if (unpairedOut) unpairedOut.returnLog = log
            else acc.push({ outLog: null, returnLog: log }) // Just in case there's an orphan RETURN
          }
          return acc
        }, [] as ShipPair[])
        
        // Reverse back to DESC
        setLogs(paired.reverse())
      }
      setLoading(false)
    }
    loadData()
  }, [moldId, refreshTrigger, supabase])

  const handleReturn = async (outLogId: string) => {
    if (!returnEmployeeId) return
    setIsSubmitting(true)
    const res = await recordShipReturn(moldId, outLogId, returnEmployeeId, returnNotes)
    if (res.success) {
      setReceivingLogId(null)
      setReturnEmployeeId('')
      setReturnNotes('')
      setRefreshTrigger(prev => prev + 1)
    } else {
      alert(res.error || 'Lỗi không xác định')
    }
    setIsSubmitting(false)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h3 className="font-bold text-xs text-slate-600 border-b border-slate-200 pb-2 mb-4">
        LỊCH SỬ VẬN CHUYỂN / 出荷履歴
      </h3>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-slate-200 rounded"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded">
          Chưa có lịch sử vận chuyển.
        </div>
      ) : (
        <div className="space-y-4 relative border-l-2 border-slate-200 ml-2 pb-4">
          {logs.map((pair, index) => {
            const outLog = pair.outLog
            const retLog = pair.returnLog
            
            if (!outLog) {
              // Orphan return log
              return (
                <div key={retLog.id} className="relative pl-4">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-50 bg-teal-500"></div>
                  <div className="text-[11px] text-slate-500 font-medium mb-1">
                    <span className="font-bold text-teal-600">▼ IN</span>
                    <span className="mx-2">──</span>
                    {new Date(retLog.ship_date).toLocaleDateString('ja-JP')}
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2 text-xs shadow-sm">
                    <div><span className="text-slate-500">Người nhận:</span> {retLog.handler?.name}</div>
                    {retLog.notes && <div><span className="text-slate-500">Ghi chú:</span> {retLog.notes}</div>}
                  </div>
                </div>
              )
            }

            const isOverdue = outLog.return_date && 
              new Date(outLog.return_date) < today && 
              !retLog

            return (
              <div key={outLog.id} className="relative pl-4">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-50 bg-orange-500"></div>
                <div className="text-[11px] text-slate-500 font-medium mb-1 flex items-center gap-2">
                  <span className="font-bold text-orange-600">▲ OUT</span>
                  <span className="mx-1">──</span>
                  {new Date(outLog.ship_date).toLocaleDateString('ja-JP')}
                  
                  {isOverdue && (
                    <span className="text-red-600 font-bold bg-red-50 px-1 rounded ml-auto flex items-center gap-1">
                      ⚠️ Quá hạn
                    </span>
                  )}
                </div>
                
                <div className={`bg-white border rounded p-3 text-xs shadow-sm space-y-2 ${isOverdue ? 'border-red-300' : 'border-slate-200'}`}>
                  <div className="font-bold text-slate-700">
                    Công ty: {outLog.company?.name || 'Unknown'}
                  </div>
                  
                  <div className="grid grid-cols-[80px_1fr] gap-y-1">
                    <span className="text-slate-500">Hạn trả:</span>
                    <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                      {outLog.return_date ? new Date(outLog.return_date).toLocaleDateString('ja-JP') : '-'}
                    </span>
                    
                    <span className="text-slate-500">Loại:</span>
                    <span>{outLog.item_type?.name || '-'}</span>
                    
                    <span className="text-slate-500">Nhân viên:</span>
                    <span>{outLog.handler?.name || '-'}</span>
                    
                    <span className="text-slate-500">Ghi chú:</span>
                    <span>{outLog.notes || '-'}</span>
                  </div>

                  {/* Return Log Section */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    {retLog ? (
                      <div className="bg-teal-50 text-teal-800 p-2 rounded flex flex-col gap-1">
                        <div className="font-bold">✓ Đã trả về — Nhận: {new Date(retLog.ship_date).toLocaleDateString('ja-JP')}</div>
                        <div>Người nhận: {retLog.handler?.name}</div>
                        {retLog.notes && <div>Ghi chú: {retLog.notes}</div>}
                      </div>
                    ) : receivingLogId === outLog.id ? (
                      <div className="bg-slate-50 border border-slate-200 rounded p-2 mt-2 space-y-2">
                        <div className="font-bold text-slate-700 text-[11px]">XÁC NHẬN NHẬN VỀ / 返却確認</div>
                        <select
                          value={returnEmployeeId}
                          onChange={e => setReturnEmployeeId(e.target.value)}
                          className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
                          disabled={isSubmitting}
                        >
                          <option value="">-- Chọn Nhân viên nhận --</option>
                          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <textarea
                          value={returnNotes}
                          onChange={e => setReturnNotes(e.target.value)}
                          placeholder="Ghi chú thêm..."
                          rows={2}
                          className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
                          disabled={isSubmitting}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReturn(outLog.id)}
                            disabled={!returnEmployeeId || isSubmitting}
                            className="flex-1 bg-teal-600 text-white font-bold text-xs py-2 rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
                          >
                            {isSubmitting ? 'Đang lưu...' : 'Lưu 返却済にする'}
                          </button>
                          <button
                            onClick={() => setReceivingLogId(null)}
                            disabled={isSubmitting}
                            className="px-3 bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded hover:bg-slate-300 transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReceivingLogId(outLog.id)}
                        className="text-teal-600 hover:text-teal-700 text-xs font-bold w-fit px-2 py-1 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
                      >
                        [Đánh dấu Đã nhận về 返却済にする]
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {!loading && logs.length > 0 && (
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200">
          Tổng: {logs.length} lần vận chuyển
        </div>
      )}
    </div>
  )
}
