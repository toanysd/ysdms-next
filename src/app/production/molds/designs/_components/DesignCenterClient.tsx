"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import JobListPanel from "./JobListPanel"
import ProcessListPanel from "./ProcessListPanel"

export default function DesignCenterClient({ initialBases }: { initialBases: any[] }) {
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null)
  const [selectedPhysicalId, setSelectedPhysicalId] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [showCreateDesignModal, setShowCreateDesignModal] = useState(false)
  const [showCreatePhysicalModal, setShowCreatePhysicalModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  const selectedBase = initialBases.find(b => b.id === selectedBaseId)

  // Filter bases based on search query
  const normalizedQuery = searchQuery.toLowerCase().replace(/[\s-]/g, '')
  const filteredBases = initialBases.filter(base => {
    if (!normalizedQuery) return true
    
    const code = base.code?.toLowerCase().replace(/[\s-]/g, '') || ''
    const name = base.name?.toLowerCase().replace(/[\s-]/g, '') || ''
    const customer = base.customers?.customer_code?.toLowerCase().replace(/[\s-]/g, '') || ''
    const customerJp = base.customers?.customer_name_jp?.toLowerCase().replace(/[\s-]/g, '') || ''
    
    return code.includes(normalizedQuery) || 
           name.includes(normalizedQuery) || 
           customer.includes(normalizedQuery) || 
           customerJp.includes(normalizedQuery)
  })

  return (
    <div className="h-full flex">
      {/* PANE TRÁI (40%): List of Designs */}
      <div className="w-[40%] shrink-0 border-r border-slate-200 bg-white flex flex-col h-full z-0 relative shadow-sm">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <input 
            type="text" 
            placeholder="Tìm kiếm thiết kế..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mr-2 text-sm px-3 py-1.5 border border-slate-300 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
          <button 
            onClick={() => setShowCreateDesignModal(true)}
            className="shrink-0 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded shadow-sm whitespace-nowrap transition-colors"
          >
            ➕ 新規設計 (Tạo)
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredBases.map(base => {
            const isSelected = base.id === selectedBaseId
            const physicalCount = base.revisions?.reduce((sum: number, rev: any) => sum + (rev.physical_molds?.length || 0), 0) || 0
            
            return (
              <div 
                key={base.id} 
                onClick={() => {
                  setSelectedBaseId(base.id)
                  setSelectedPhysicalId(null)
                  setSelectedJobId(null)
                }}
                className={`p-3 border-b border-slate-100 cursor-pointer transition-colors hover:bg-teal-50/50 ${isSelected ? 'bg-teal-50 border-l-4 border-l-teal-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-slate-800">{base.code}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">
                    Khuôn đúc: {physicalCount}
                  </span>
                </div>
                <div className="text-xs text-slate-600 line-clamp-1 font-medium">{base.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Khách hàng: {base.customers?.customer_code || 'N/A'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* PANE PHẢI (60%): 3 columns (Physical -> Job -> Process) */}
      <div className="w-[60%] bg-slate-100 flex flex-col sm:flex-row overflow-hidden">
        {selectedBase ? (() => {
          const allPhysicals = selectedBase.revisions?.flatMap((rev: any) => 
            (rev.physical_molds || []).map((phys: any) => ({
              ...phys, 
              revision_code: rev.revision_code
            }))
          ) || [];

          return (
          <>
            {/* COLUMN 1: Physical List */}
            <div className="flex-1 border-r border-slate-200 bg-white flex flex-col h-full shadow-sm z-10 min-w-[200px]">
              <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-col sticky top-0 shrink-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">金型リスト (Physical)</span>
                  <button onClick={() => setShowCreatePhysicalModal(true)} className="px-2 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded text-[10px] font-bold transition-colors">
                    ➕ 追加 (Thêm)
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-medium truncate">{selectedBase.code} - {selectedBase.name}</span>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Kích thước (L x W x H):</span> {selectedBase.revisions?.[0]?.length_mm || '?'} x {selectedBase.revisions?.[0]?.width_mm || '?'} x {selectedBase.revisions?.[0]?.height_mm || '?'} mm
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
                {/* REAL DATA: Physical Molds */}
                {allPhysicals.map((phys: any) => {
                  const isSelected = phys.id === selectedPhysicalId
                  return (
                    <div 
                      key={phys.id}
                      onClick={() => {
                        setSelectedPhysicalId(phys.id)
                        setSelectedJobId(null)
                      }}
                      className={`p-2 mb-2 border rounded cursor-pointer transition-colors ${isSelected ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-slate-200 bg-white hover:border-teal-300'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-800">{phys.physical_code}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${phys.checkin_status === 'IN' ? 'bg-mcs-primary text-mcs-text-inverse' : 'bg-mcs-returned text-mcs-text-inverse'}`}>
                          {phys.checkin_status || 'IN'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                        <span>Cavity: {phys.cavity || 1}</span>
                        <span>Rev: {phys.revision_code || 'R01'}</span>
                      </div>
                    </div>
                  )
                })}
                {allPhysicals.length === 0 && (
                  <div className="text-xs text-slate-400 text-center py-4">Chưa có khuôn vật lý</div>
                )}
              </div>
            </div>

            {/* COLUMN 2: Job List Panel */}
            <div className="flex-1 border-r border-slate-200 bg-slate-50 flex flex-col h-full min-w-[250px]">
              <JobListPanel 
                physicalId={selectedPhysicalId || undefined} 
                selectedJobId={selectedJobId}
                onSelectJob={setSelectedJobId}
              />
            </div>

            {/* COLUMN 3: Process List Panel + WorkLog */}
            <div className="flex-[1.5] bg-slate-100 flex flex-col h-full min-w-[300px]">
              <ProcessListPanel jobId={selectedJobId || undefined} /> 
            </div>
          </>
          )
        })() : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <span className="text-4xl mb-3">👈</span>
            <p className="text-sm font-medium">左から設計を選択してください</p>
            <p className="text-xs mt-1">Vui lòng chọn một thiết kế từ danh sách bên trái</p>
          </div>
        )}
      </div>

      {/* MODAL TẠO MỚI THIẾT KẾ */}
      {showCreateDesignModal && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={() => setShowCreateDesignModal(false)} />
          <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-[600px] bg-white md:rounded shadow-2xl flex flex-col">
            <div className="bg-[#01696f] text-white p-4 flex items-center justify-between md:rounded-t shrink-0">
              <div>
                <h2 className="text-lg font-bold">新規設計 / Thiết Kế Mới</h2>
              </div>
              <button onClick={() => setShowCreateDesignModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">✕</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Mã thiết kế (Code) *</label>
                    <input type="text" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm" placeholder="VD: KDS-001" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tên khuôn (Name) *</label>
                    <input type="text" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm" placeholder="VD: Khay Staking" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Khách hàng</label>
                  <select className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm">
                    <option>-- Chọn khách hàng --</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Dài (L)</label>
                    <input type="number" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm" placeholder="mm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Rộng (W)</label>
                    <input type="number" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm" placeholder="mm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cao (H)</label>
                    <input type="number" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm" placeholder="mm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Ghi chú thiết kế</label>
                  <textarea className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm h-20"></textarea>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0 md:rounded-b">
              <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded shadow transition-colors">
                保存 (Lưu Thiết Kế)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
