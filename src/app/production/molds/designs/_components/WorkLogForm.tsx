"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function WorkLogForm({ processId, jobId }: { processId: string, jobId?: string }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!processId) return

    const fetchLogs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('mold_work_logs')
        .select(`
          id, processing_date, processing_hours, operator_name, notes,
          processing_code:processing_codes(code)
        `)
        .eq('process_id', processId)
        .order('processing_date', { ascending: false })

      if (!error && data) {
        setLogs(data)
      } else {
        setLogs([])
      }
      setLoading(false)
    }

    fetchLogs()
  }, [processId])

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-bold text-slate-500 mb-1 flex justify-between items-center">
        <span>加工履歴 (Work Logs)</span>
        <button className="text-teal-600 hover:underline">Thêm mới</button>
      </div>
      
      {/* List of existing logs */}
      <div className="space-y-1">
        {loading ? (
          <div className="text-xs text-slate-400 py-2">Đang tải lịch sử...</div>
        ) : logs.length === 0 ? (
          <div className="text-xs text-slate-400 py-2">Chưa có lịch sử làm việc</div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="flex items-center justify-between text-[10px] bg-white p-1.5 rounded border border-slate-200">
              <div className="flex gap-2">
                <span className="font-medium text-slate-700">{log.processing_date || 'N/A'}</span>
                <span className="bg-slate-100 px-1 rounded text-slate-600 border border-slate-200">
                  {log.processing_code?.code || 'Unknown Code'}
                </span>
                <span className="text-slate-500">Người làm: {log.operator_name || 'N/A'}</span>
              </div>
              <span className="font-bold text-teal-700 bg-teal-50 px-1.5 rounded">{log.processing_hours}h</span>
            </div>
          ))
        )}
      </div>

      {/* Inline Form to add a new log */}
      <div className="bg-white border border-teal-200 rounded p-2 flex flex-wrap gap-2 items-end shadow-sm mt-2">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Ngày thực hiện</label>
          <input type="date" className="w-full px-2 py-1 border border-slate-300 rounded text-xs" />
        </div>
        
        <div className="flex-[2] min-w-[150px]">
          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Nội dung công việc (Code)</label>
          <select className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white">
            <option value="">-- Chọn mã công việc --</option>
            {/* These should ideally be fetched from processing_codes table */}
            <option value="1">Milling (Phay)</option>
            <option value="2">Drilling (Khoan)</option>
            <option value="3">Polishing (Đánh bóng)</option>
          </select>
        </div>

        <div className="w-[80px]">
          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Giờ (h)</label>
          <input type="number" step="0.5" className="w-full px-2 py-1 border border-slate-300 rounded text-xs" placeholder="0.0" />
        </div>

        <div className="flex-1 min-w-[120px]">
          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Người thực hiện</label>
          <input type="text" placeholder="Tên NV..." className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white" />
        </div>

        <button className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-bold shadow-sm whitespace-nowrap h-[26px]">
          記録 (Ghi)
        </button>
      </div>
    </div>
  )
}
