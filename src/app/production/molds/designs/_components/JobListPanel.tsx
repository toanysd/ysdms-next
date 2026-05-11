"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface JobListPanelProps {
  physicalId?: string
  selectedJobId: string | null
  onSelectJob: (id: string | null) => void
}

export default function JobListPanel({ physicalId, selectedJobId, onSelectJob }: JobListPanelProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!physicalId) {
      setJobs([])
      return
    }

    const fetchJobs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('mold_jobs')
        .select('id, job_code, status, notes, created_at')
        .eq('mold_physical_id', physicalId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setJobs(data)
      } else {
        setJobs([])
      }
      setLoading(false)
    }

    fetchJobs()
  }, [physicalId])

  if (!physicalId) {
    return (
      <div className="flex-1 border border-slate-200 bg-slate-50 flex flex-col m-2 rounded overflow-hidden">
        <div className="bg-slate-200/50 p-2 border-b border-slate-200 text-xs font-bold text-slate-500 sticky top-0 shrink-0">
          工程リスト (Job List)
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-4">
          Vui lòng chọn Khuôn vật lý để xem Job
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 border border-slate-200 bg-white flex flex-col m-2 rounded overflow-hidden shadow-sm">
      <div className="bg-slate-100 p-2 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <span className="text-xs font-bold text-slate-700">工程リスト (Job List)</span>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded text-[10px] font-bold transition-colors"
        >
          {showCreate ? "キャンセル (Hủy)" : "➕ JOB作成 (Tạo Mới)"}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-slate-50 relative">
        {showCreate && (
          <div className="p-3 bg-indigo-50 border-b border-indigo-100 shrink-0 shadow-inner">
            <div className="text-[10px] font-bold text-indigo-800 mb-2">TẠO JOB MỚI</div>
            <div className="flex gap-2">
              <input type="text" placeholder="Tên Job (Code)" className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs" />
              <input type="text" placeholder="Ghi chú" className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs" />
              <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm">
                保存 (Lưu)
              </button>
            </div>
          </div>
        )}

        <div className="p-2 space-y-2">
          {loading ? (
            <div className="text-xs text-slate-400 text-center py-4">Đang tải...</div>
          ) : jobs.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-4">Chưa có Job nào</div>
          ) : (
            jobs.map(job => {
              const isSelected = job.id === selectedJobId
              return (
                <div 
                  key={job.id}
                  onClick={() => onSelectJob(job.id)}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-indigo-400 bg-indigo-50 border-l-4 border-l-indigo-600 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{job.job_code || 'Unnamed Job'}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                      job.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                      job.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      'bg-indigo-100 text-indigo-700 border-indigo-200'
                    }`}>
                      {job.status || 'PENDING'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{job.notes || 'Không có ghi chú'}</div>
                  <div className="text-[9px] text-slate-400 mt-1 text-right">
                    {new Date(job.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
