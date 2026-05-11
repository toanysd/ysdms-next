"use client"

import { useState, useEffect } from "react"
import WorkLogForm from "./WorkLogForm"
import { createClient } from "@/lib/supabase/client"

export default function ProcessListPanel({ jobId }: { jobId?: string }) {
  const [showCreate, setShowCreate] = useState(false)
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null)
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!jobId) {
      setProcesses([])
      return
    }

    const fetchProcesses = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('mold_job_processes')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setProcesses(data)
      } else {
        setProcesses([])
      }
      setLoading(false)
    }

    fetchProcesses()
  }, [jobId])

  if (!jobId) {
    return (
      <div className="flex-1 border border-slate-200 bg-slate-50 flex flex-col m-2 rounded overflow-hidden">
        <div className="bg-slate-200/50 p-2 border-b border-slate-200 text-xs font-bold text-slate-500 sticky top-0 shrink-0">
          加工期限 (Process Deadlines)
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-4">
          Vui lòng chọn Job để xem Kỳ hạn gia công
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 border border-slate-200 bg-white flex flex-col m-2 rounded overflow-hidden shadow-sm">
      <div className="bg-slate-100 p-2 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <span className="text-xs font-bold text-slate-700">加工期限 (Process Deadlines)</span>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="px-2 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded text-[10px] font-bold transition-colors"
        >
          {showCreate ? "キャンセル (Hủy)" : "➕ 期限追加 (Thêm Kỳ Hạn)"}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-slate-50 relative">
        {showCreate && (
          <div className="p-3 bg-teal-50 border-b border-teal-100 shrink-0 shadow-inner">
            <div className="text-[10px] font-bold text-teal-800 mb-2">TẠO KỲ HẠN MỚI</div>
            <div className="flex gap-2 items-center">
              <select className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs bg-white">
                <option value="">-- Công đoạn --</option>
                <option value="MOLD">MOLD (Khuôn nhôm)</option>
                <option value="PLUG">PLUG (Nắp gỗ)</option>
                <option value="STAKING">STAKING</option>
              </select>
              <input type="date" className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs" />
              <button className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-bold shadow-sm">
                保存 (Lưu)
              </button>
            </div>
          </div>
        )}

        <div className="p-2 space-y-2">
          {loading ? (
            <div className="text-xs text-slate-400 text-center py-4">Đang tải...</div>
          ) : processes.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-4">Chưa có kỳ hạn nào</div>
          ) : (
            processes.map(proc => {
              const isExpanded = expandedProcess === proc.id
              const isDone = proc.status === 'completed'
              const isInProgress = proc.status === 'in_progress'
              const colorClass = isDone ? 'slate' : isInProgress ? 'amber' : 'teal'
              
              return (
                <div key={proc.id} className="border border-slate-200 bg-white rounded overflow-hidden">
                  <div 
                    onClick={() => setExpandedProcess(isExpanded ? null : proc.id)}
                    className={`p-2 cursor-pointer transition-colors flex justify-between items-center border-l-4 border-l-${colorClass}-400 hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 mr-2">{proc.process_type}</span>
                      <span className="text-[10px] text-slate-500">Kỳ hạn: {proc.deadline_date || 'Không có'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium
                        ${isInProgress ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                          isDone ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          'bg-teal-100 text-teal-700 border-teal-200'}
                      `}>
                        {(proc.status || 'PENDING').toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-[10px]">{isExpanded ? '▼' : '▶'}</span>
                    </div>
                  </div>

                  {/* INLINE EXPAND: WorkLogForm */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50 p-2 shadow-inner">
                      <WorkLogForm processId={proc.id} jobId={jobId} />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
