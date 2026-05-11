'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BilingualLabel } from '@/components/ui/BilingualLabel'
import { receiveTeflon, cancelTeflon, sendToTeflon } from '../actions'

interface TeflonTabProps {
  moldId: string
  employees: { id: string; name: string; name_ja?: string; employee_code?: string }[]
}

export function TeflonTab({ moldId, employees }: TeflonTabProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('mold_teflon_logs')
        .select(`
          id, status, coating_type, reason,
          requested_date, approved_date, sent_date,
          expected_return_date, received_date,
          cost_jpy, quality_note, notes, created_at,
          requested:employees!mold_teflon_logs_requested_by_fkey(name, name_ja),
          approved:employees!mold_teflon_logs_approved_by_fkey(name, name_ja),
          sent:employees!mold_teflon_logs_sent_by_fkey(name, name_ja)
        `)
        .eq('mold_physical_id', moldId)
        .order('created_at', { ascending: false })

      if (data) {
        setLogs(data)
      }
      setLoading(false)
    }
    loadData()
  }, [moldId, refreshTrigger, supabase])

  const activeLog = useMemo(() => {
    return logs.find(l => ['PENDING', 'APPROVED', 'SENT'].includes(l.status))
  }, [logs])

  const historyLogs = useMemo(() => {
    return logs.filter(l => l.id !== activeLog?.id)
  }, [logs, activeLog])

  return (
    <div className="p-4 space-y-6">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      ) : (
        <>
          {activeLog ? (
            <ActiveLogCard log={activeLog} employees={employees} onRefresh={() => setRefreshTrigger(prev => prev + 1)} />
          ) : (
            <NewTeflonForm moldId={moldId} employees={employees} onRefresh={() => setRefreshTrigger(prev => prev + 1)} />
          )}

          {historyLogs.length > 0 && (
            <HistorySection logs={historyLogs} />
          )}
        </>
      )}
    </div>
  )
}

function ActiveLogCard({ log, employees, onRefresh }: { log: any, employees: TeflonTabProps['employees'], onRefresh: () => void }) {
  const [actionMode, setActionMode] = useState<'receive' | 'cancel' | null>(null)
  
  // Receive state
  const [qualityNote, setQualityNote] = useState('')
  const [receiveEmployeeId, setReceiveEmployeeId] = useState('')
  
  // Cancel state
  const [cancelReason, setCancelReason] = useState('')
  const [cancelEmployeeId, setCancelEmployeeId] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReceive = async () => {
    if (!receiveEmployeeId) return
    setIsSubmitting(true)
    setError(null)
    const res = await receiveTeflon(log.id, receiveEmployeeId, qualityNote)
    if (res.success) {
      onRefresh()
    } else {
      setError(res.error || 'Lỗi không xác định')
      setIsSubmitting(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelEmployeeId || !cancelReason.trim()) return
    setIsSubmitting(true)
    setError(null)
    const res = await cancelTeflon(log.id, cancelEmployeeId, cancelReason)
    if (res.success) {
      onRefresh()
    } else {
      setError(res.error || 'Lỗi không xác định')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-mcs-warning-light border border-mcs-warning/50 rounded overflow-hidden shadow-sm">
      <div className="bg-mcs-warning text-mcs-warning-text px-3 py-2 flex items-center justify-between">
        <div className="font-bold text-xs flex items-center gap-2">
          <span>◐</span> SENT / テフロン加工中
        </div>
        <div className="text-[10px] opacity-80">
          ID: {log.id.split('-')[0]}
        </div>
      </div>
      
      <div className="p-3 text-sm space-y-2">
        <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">Loại mạ:</span><span className="font-medium">{log.coating_type || '-'}</span></div>
        <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">Gửi ngày:</span><span>{log.sent_date ? new Date(log.sent_date).toLocaleDateString('ja-JP') : '-'}</span></div>
        <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">Hạn trả về:</span><span>{log.expected_return_date ? new Date(log.expected_return_date).toLocaleDateString('ja-JP') : '-'}</span></div>
        <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">Người gửi:</span><span>{log.sent?.name || log.requested?.name || '-'}</span></div>
        <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">Ghi chú:</span><span>{log.notes || '-'}</span></div>
      </div>

      <div className="p-3 bg-white border-t border-mcs-warning/20">
        {!actionMode ? (
          <div className="flex gap-2">
            <button 
              onClick={() => setActionMode('receive')}
              className="flex-1 min-h-[36px] bg-mcs-primary text-white text-xs font-bold rounded hover:bg-mcs-primary-hover transition-colors"
            >
              ✓ Đánh dấu Đã nhận
            </button>
            <button 
              onClick={() => setActionMode('cancel')}
              className="flex-1 min-h-[36px] bg-white border border-mcs-error text-mcs-error text-xs font-bold rounded hover:bg-mcs-error-light transition-colors"
            >
              ✕ Hủy đợt này
            </button>
          </div>
        ) : actionMode === 'receive' ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="font-bold text-xs text-mcs-primary">NHẬN HÀNG / 受取確認</div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Ghi chú chất lượng (Quality Note)</label>
              <textarea 
                value={qualityNote}
                onChange={e => setQualityNote(e.target.value)}
                placeholder="Ví dụ: Đạt yêu cầu..."
                className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
                rows={2}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Nhân viên nhận *</label>
              <select 
                value={receiveEmployeeId}
                onChange={e => setReceiveEmployeeId(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>

            {error && <div className="text-xs text-mcs-error mt-1">{error}</div>}

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleReceive}
                disabled={!receiveEmployeeId || isSubmitting}
                className="flex-1 min-h-[36px] bg-mcs-primary text-white text-xs font-bold rounded hover:bg-mcs-primary-hover transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Đang xử lý...' : '✓ Xác nhận Đã nhận'}
              </button>
              <button 
                onClick={() => setActionMode(null)}
                disabled={isSubmitting}
                className="px-4 min-h-[36px] bg-slate-100 text-slate-600 text-xs font-bold rounded hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="font-bold text-xs text-mcs-error">HỦY ĐỢT MẠ / 取消</div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Lý do hủy (Reason) *</label>
              <textarea 
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Bắt buộc nhập lý do..."
                className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-error outline-none"
                rows={2}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Nhân viên hủy *</label>
              <select 
                value={cancelEmployeeId}
                onChange={e => setCancelEmployeeId(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-error outline-none"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>

            {error && <div className="text-xs text-mcs-error mt-1">{error}</div>}

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleCancel}
                disabled={!cancelEmployeeId || !cancelReason.trim() || isSubmitting}
                className="flex-1 min-h-[36px] bg-mcs-error text-white text-xs font-bold rounded hover:bg-mcs-error-hover transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Đang xử lý...' : '✕ Xác nhận Hủy'}
              </button>
              <button 
                onClick={() => setActionMode(null)}
                disabled={isSubmitting}
                className="px-4 min-h-[36px] bg-slate-100 text-slate-600 text-xs font-bold rounded hover:bg-slate-200 transition-colors"
              >
                Quay lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NewTeflonForm({ moldId, employees, onRefresh }: { moldId: string, employees: TeflonTabProps['employees'], onRefresh: () => void }) {
  const [coatingType, setCoatingType] = useState('')
  const [sentDate, setSentDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedReturnDate, setExpectedReturnDate] = useState('')
  const [costJpy, setCostJpy] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [notes, setNotes] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!employeeId) return
    setIsSubmitting(true)
    setError(null)
    
    const payload = {
      coating_type: coatingType || undefined,
      sent_date: sentDate || undefined,
      expected_return_date: expectedReturnDate || undefined,
      cost_jpy: costJpy ? parseFloat(costJpy) : undefined,
      notes: notes || undefined
    }

    const res = await sendToTeflon(moldId, employeeId, payload)
    if (res.success) {
      onRefresh()
    } else {
      setError(res.error || 'Lỗi không xác định')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border border-mcs-border rounded overflow-hidden shadow-sm bg-white">
      <div className="bg-slate-100 px-3 py-2 border-b border-mcs-border font-bold text-xs text-slate-700 flex items-center gap-2">
        <span className="text-mcs-primary">+</span> Tạo đợt mạ mới / 新規テフロン依頼
      </div>
      
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Loại mạ (Coating Type)</label>
            <input 
              type="text" 
              value={coatingType}
              onChange={e => setCoatingType(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Chi phí / Cost (¥)</label>
            <input 
              type="number" 
              value={costJpy}
              onChange={e => setCostJpy(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Ngày gửi (Sent Date)</label>
            <input 
              type="date" 
              value={sentDate}
              onChange={e => setSentDate(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Hạn trả về (Return Date)</label>
            <input 
              type="date" 
              value={expectedReturnDate}
              onChange={e => setExpectedReturnDate(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 font-medium">Nhân viên *</label>
          <select 
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 font-medium">Ghi chú (Notes)</label>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
            disabled={isSubmitting}
          />
        </div>

        {error && <div className="text-xs text-mcs-error mt-1">{error}</div>}

        <button 
          onClick={handleSubmit}
          disabled={!employeeId || isSubmitting}
          className="w-full min-h-[40px] bg-mcs-primary text-white text-sm font-bold rounded hover:bg-mcs-primary-hover transition-colors disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi đi テフロンに送る'}
        </button>
      </div>
    </div>
  )
}

function HistorySection({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xs text-slate-600 border-b border-slate-200 pb-2">
        LỊCH SỬ / 履歴
      </h3>
      <div className="relative border-l-2 border-slate-200 ml-2 space-y-4 pb-4">
        {logs.map(log => {
          const isReceived = log.status === 'RECEIVED'
          const dateStr = log.received_date || log.sent_date || log.created_at
          return (
            <div key={log.id} className="relative pl-4">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-50 ${isReceived ? 'bg-mcs-primary' : 'bg-slate-400'}`}></div>
              <div className="text-[11px] text-slate-500 font-medium mb-1">
                <span className={`font-bold ${isReceived ? 'text-mcs-primary' : 'text-slate-600'}`}>{log.status}</span>
                <span className="mx-2">──</span>
                {new Date(dateStr).toLocaleDateString('ja-JP')}
              </div>
              <div className="bg-white border border-slate-200 rounded p-2 text-xs shadow-sm space-y-1">
                {log.coating_type && <div><span className="text-slate-500">Loại mạ:</span> {log.coating_type}</div>}
                {log.cost_jpy != null && <div><span className="text-slate-500">Chi phí:</span> ¥{log.cost_jpy.toLocaleString()}</div>}
                {log.quality_note && <div><span className="text-slate-500">Chất lượng:</span> {log.quality_note}</div>}
                {log.reason && <div><span className="text-slate-500">Lý do:</span> <span className="text-mcs-error font-medium">{log.reason}</span></div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
