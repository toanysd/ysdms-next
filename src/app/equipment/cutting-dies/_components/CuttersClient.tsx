'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit2, Trash2, Box } from 'lucide-react'
import { upsertCutter, deleteCutter } from '../actions'
import { Pagination } from '@/components/ui/Pagination'

interface Company {
  company_id: string
  company_name: string
  company_short_name: string
}

interface MoldDesign {
  design_id: string
  design_code: string
}

interface Cutter {
  cutter_id: string
  cutter_no: string
  cutter_name: string
  cutter_type: string
  cavity_count: string | null
  pitch_mm: number | null
  cutter_length_mm: number | null
  cutter_width_mm: number | null
  cutter_height_mm: number | null
  base_type: string | null
  company_id: string | null
  design_revision_id: string | null
  usage_status: string
  notes: string | null
  companies?: { company_short_name: string } | null
  mold_designs?: { design_code: string } | null
}

export default function CuttersClient({ 
  initialCutters, 
  companies, 
  moldDesigns,
  totalRecords,
  initialPage = 1,
  initialSearch = ''
}: { 
  initialCutters: Cutter[]
  companies: Company[]
  moldDesigns: MoldDesign[]
  totalRecords?: number
  initialPage?: number
  initialSearch?: string
}) {
  const router = useRouter()
  const [cutters, setCutters] = useState<Cutter[]>(initialCutters)
  const [search, setSearch] = useState(initialSearch)
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    setCutters(initialCutters)
  }, [initialCutters])

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`?page=${page}&q=${encodeURIComponent(search)}`)
    }, 500)
    return () => clearTimeout(timer)
  }, [search, page, router])
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingCutter, setEditingCutter] = useState<Cutter | null>(null)
  
  const [form, setForm] = useState({
    cutter_no: '',
    cutter_name: '',
    cutter_type: 'INLINE',
    cavity_count: '',
    pitch_mm: '' as string | number,
    cutter_length_mm: '' as string | number,
    cutter_width_mm: '' as string | number,
    cutter_height_mm: '' as string | number,
    base_type: 'WOOD_12MM',
    company_id: '',
    design_revision_id: '',
    usage_status: 'ACTIVE',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredCutters = cutters

  const handleOpenModal = (cutter?: Cutter) => {
    if (cutter) {
      setEditingCutter(cutter)
      setForm({
        cutter_no: cutter.cutter_no || '',
        cutter_name: cutter.cutter_name || '',
        cutter_type: cutter.cutter_type || 'INLINE',
        cavity_count: cutter.cavity_count || '',
        pitch_mm: cutter.pitch_mm || '',
        cutter_length_mm: cutter.cutter_length_mm || '',
        cutter_width_mm: cutter.cutter_width_mm || '',
        cutter_height_mm: cutter.cutter_height_mm || '',
        base_type: cutter.base_type || 'WOOD_12MM',
        company_id: cutter.company_id || '',
        design_revision_id: cutter.design_revision_id || '',
        usage_status: cutter.usage_status || 'ACTIVE',
        notes: cutter.notes || ''
      })
    } else {
      setEditingCutter(null)
      setForm({
        cutter_no: '',
        cutter_name: '',
        cutter_type: 'INLINE',
        cavity_count: '',
        pitch_mm: '',
        cutter_length_mm: '',
        cutter_width_mm: '',
        cutter_height_mm: '',
        base_type: 'WOOD_12MM',
        company_id: '',
        design_revision_id: '',
        usage_status: 'ACTIVE',
        notes: ''
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      ...form,
      pitch_mm: form.pitch_mm ? Number(form.pitch_mm) : null,
      cutter_length_mm: form.cutter_length_mm ? Number(form.cutter_length_mm) : null,
      cutter_width_mm: form.cutter_width_mm ? Number(form.cutter_width_mm) : null,
      cutter_height_mm: form.cutter_height_mm ? Number(form.cutter_height_mm) : null,
      company_id: form.company_id || null,
      design_revision_id: form.design_revision_id || null,
      cutter_id: editingCutter?.cutter_id
    }

    const res = await upsertCutter(payload)
    if (res.success) {
      window.location.reload()
    } else {
      alert(`エラー (Lỗi): ${res.error}`)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`抜型 [${code}] を削除してもよろしいですか？\nBạn có chắc chắn muốn xóa Dao cắt [${code}] không?`)) return
    const res = await deleteCutter(id)
    if (res.success) {
      setCutters(prev => prev.filter(c => c.cutter_id !== id))
    } else {
      alert(`エラー (Lỗi): ${res.error}`)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#ECEEF1]">
      {/* PageHeader (36px + padding) */}
      <div className="bg-[#F7F8FA] px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Box size={18} className="text-slate-600" />
          <h1 className="text-base font-bold text-slate-800">
            抜型管理 <span className="text-[13px] font-normal text-slate-500 ml-1">/ Quản lý Dao cắt</span>
          </h1>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="h-8 px-4 bg-slate-800 text-white font-medium text-[13px] rounded hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={14} />
          <span className="font-semibold">新規登録</span>
          <span className="text-[11px] text-slate-300 font-normal">(Thêm mới)</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex justify-between items-center bg-white p-2 border border-slate-200 rounded shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-[10px] text-slate-400" />
            <input 
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by code or name... / Tìm kiếm"
              className="pl-9 pr-3 py-2 border rounded-md text-sm w-[300px] outline-none focus:border-[#008A90] focus:ring-1 focus:ring-[#008A90] transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-[#F7F8FA] border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-center w-12 text-[10px] uppercase font-bold tracking-wider">No.</th>
                <th className="px-3 py-2 font-bold">
                  抜型コード <span className="font-normal text-slate-400 text-[11px] block">Mã dao</span>
                </th>
                <th className="px-3 py-2 font-bold">
                  名称 <span className="font-normal text-slate-400 text-[11px] block">Tên dao</span>
                </th>
                <th className="px-3 py-2 font-bold">
                  顧客 <span className="font-normal text-slate-400 text-[11px] block">Khách hàng</span>
                </th>
                <th className="px-3 py-2 font-bold">
                  金型設計 <span className="font-normal text-slate-400 text-[11px] block">Thiết kế khuôn</span>
                </th>
                <th className="px-3 py-2 font-bold">
                  種類 <span className="font-normal text-slate-400 text-[11px] block">Loại</span>
                </th>
                <th className="px-3 py-2 font-bold">
                  ベース <span className="font-normal text-slate-400 text-[11px] block">Đế dao</span>
                </th>
                <th className="px-3 py-2 font-bold">
                  寸法 (L x W x H) <span className="font-normal text-slate-400 text-[11px] block">Kích thước</span>
                </th>
                <th className="px-3 py-2 font-bold">
                  状態 <span className="font-normal text-slate-400 text-[11px] block">Trạng thái</span>
                </th>
                <th className="px-3 py-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCutters.map((c, idx) => {
                let statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
                let statusJa = '使用中'
                if (c.usage_status === 'NEEDS_MAINTENANCE') {
                  statusColor = 'bg-amber-50 text-amber-700 border-amber-200'
                  statusJa = 'メンテ要'
                }
                if (c.usage_status === 'DISCARDED') {
                  statusColor = 'bg-slate-100 text-slate-600 border-slate-300'
                  statusJa = '廃棄済'
                }

                return (
                  <tr key={c.cutter_id} className="hover:bg-[#F0F1F3] transition-colors group">
                    <td className="px-3 py-2 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="px-3 py-2 font-bold text-slate-800">{c.cutter_no}</td>
                    <td className="px-3 py-2 text-slate-700">{c.cutter_name}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {c.companies?.company_short_name || <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {c.mold_designs?.design_code ? (
                        <span className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                          {c.mold_designs.design_code}
                        </span>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <div className="font-semibold">{c.cutter_type === 'INLINE' ? 'インライン' : '別抜き'}</div>
                      <div className="text-[11px] text-slate-400">{c.cutter_type === 'INLINE' ? '(Inline)' : '(Separate)'}</div>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <div className="font-semibold">{c.base_type === 'ALUMINUM' ? 'アルミ' : '木製12mm'}</div>
                      <div className="text-[11px] text-slate-400">{c.base_type === 'ALUMINUM' ? '(Nhôm)' : '(Gỗ)'}</div>
                    </td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums">
                      {c.cutter_length_mm || '-'} x {c.cutter_width_mm || '-'} x {c.cutter_height_mm || '-'}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-sm ${statusColor}`}>
                        {statusJa}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(c)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Sửa">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.cutter_id, c.cutter_no)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredCutters.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-slate-500">
                    データがありません (Không có dữ liệu)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalRecords={totalRecords || 0}
            pageSize={50}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modal - Compact Style */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-[#F7F8FA]">
              <h2 className="text-[14px] font-bold text-slate-800">
                {editingCutter ? '抜型編集 (Sửa Dao Cắt)' : '抜型登録 (Thêm Dao Cắt)'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-[13px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">抜型コード <span className="font-normal">(Mã Dao)</span> <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={form.cutter_no}
                    onChange={e => setForm({...form, cutter_no: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">名称 <span className="font-normal">(Tên Dao)</span> <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={form.cutter_name}
                    onChange={e => setForm({...form, cutter_name: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" 
                  />
                </div>
              </div>

              {/* Ràng buộc (Relationships) */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-[#F0F1F3] rounded-sm border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">顧客 <span className="font-normal">(Khách hàng sở hữu)</span></label>
                  <select 
                    value={form.company_id}
                    onChange={e => setForm({...form, company_id: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">-- 指定なし (Không có) --</option>
                    {companies.map(c => (
                      <option key={c.company_id} value={c.company_id}>{c.company_short_name || c.company_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">金型設計 <span className="font-normal">(Thiết kế khuôn liên kết)</span></label>
                  <select 
                    value={form.design_revision_id}
                    onChange={e => setForm({...form, design_revision_id: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">-- 共通抜型 (Dùng chung) --</option>
                    {moldDesigns.map(m => (
                      <option key={m.design_id} value={m.design_id}>{m.design_code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">種類 <span className="font-normal">(Loại cắt)</span></label>
                  <select 
                    value={form.cutter_type}
                    onChange={e => setForm({...form, cutter_type: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="INLINE">インライン (Inline - Cắt trên máy ép)</option>
                    <option value="SEPARATE">別抜き (Separate - Cắt rời thủ công)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">ベース <span className="font-normal">(Loại đế)</span></label>
                  <select 
                    value={form.base_type}
                    onChange={e => setForm({...form, base_type: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="WOOD_12MM">木製12mm (Đế gỗ ván 12mm)</option>
                    <option value="ALUMINUM">アルミベース (Đế Nhôm - Có thể chỉnh pitch)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">面付け <span className="font-normal">(Số khoang / Cavity)</span></label>
                  <input 
                    type="text" 
                    value={form.cavity_count}
                    onChange={e => setForm({...form, cavity_count: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">ピッチ <span className="font-normal">(Pitch) - mm</span></label>
                  <input 
                    type="number" step="0.1"
                    value={form.pitch_mm}
                    onChange={e => setForm({...form, pitch_mm: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">長さ <span className="font-normal">(Chiều dài - mm)</span></label>
                  <input 
                    type="number" step="0.1"
                    value={form.cutter_length_mm}
                    onChange={e => setForm({...form, cutter_length_mm: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">幅 <span className="font-normal">(Bề rộng - mm)</span></label>
                  <input 
                    type="number" step="0.1"
                    value={form.cutter_width_mm}
                    onChange={e => setForm({...form, cutter_width_mm: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">高さ <span className="font-normal">(Cao dao - mm)</span></label>
                  <input 
                    type="number" step="0.1"
                    value={form.cutter_height_mm}
                    onChange={e => setForm({...form, cutter_height_mm: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none" 
                    placeholder="45, 60, 80..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">状態 <span className="font-normal">(Trạng thái)</span></label>
                  <select 
                    value={form.usage_status}
                    onChange={e => setForm({...form, usage_status: e.target.value})}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="ACTIVE">使用中 (Đang dùng)</option>
                    <option value="NEEDS_MAINTENANCE">メンテ要 (Cần bảo dưỡng)</option>
                    <option value="DISCARDED">廃棄済 (Loại bỏ)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">備考 <span className="font-normal">(Ghi chú)</span></label>
                <textarea 
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-sm focus:border-blue-500 outline-none" 
                  rows={2}
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-sm hover:bg-slate-50 transition-colors font-medium">
                  キャンセル (Hủy)
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 bg-slate-800 text-white rounded-sm hover:bg-slate-700 transition-colors disabled:opacity-50 font-medium">
                  {isSubmitting ? '保存中...' : '保存 (Lưu)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
