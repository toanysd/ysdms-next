'use client'

import React, { useState, useEffect, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { getProductPhysicalMolds, getAllPhysicalMolds, updateProductionPlanAction, deleteProductionPlanAction, getOccupiedMolds } from '@/app/actions/production'
import { Loader2, Search } from 'lucide-react'

export default function EditModal({ 
    planData, 
    machine,
    operators,
    onClose, 
    onSuccess 
}: { 
    planData: any, 
    machine: any,
    operators: any[],
    onClose: () => void, 
    onSuccess: () => void 
}) {
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    
    // Mold States
    const [standardMolds, setStandardMolds] = useState<any[]>([])
    const [allMolds, setAllMolds] = useState<any[]>([])
    const [isAllMoldsLoaded, setIsAllMoldsLoaded] = useState(false)
    const [selectedMold, setSelectedMold] = useState(planData.mold_physical_id || '')
    const [moldSearch, setMoldSearch] = useState('')
    const [showMoldDropdown, setShowMoldDropdown] = useState(false)
    const [shift, setShift] = useState<'DAY'|'NIGHT'>(planData.shift || 'DAY')
    const [occupiedMolds, setOccupiedMolds] = useState<Record<string, string>>({})
    const moldInputRef = useRef<HTMLInputElement>(null)

    const orderItem = planData.order_items
    const orderDetail = orderItem?.orders

    useEffect(() => {
        const fetchMolds = async () => {
            if (!orderItem?.product_id) return
            try {
                const res = await getProductPhysicalMolds(orderItem.product_id)
                setStandardMolds(res)
                
                const hasSelectedMold = !!planData.mold_physical_id
                const isSelectedStandard = res.some(m => m.id === planData.mold_physical_id)
                
                if (hasSelectedMold && !isSelectedStandard) {
                    const allRes = await getAllPhysicalMolds()
                    setAllMolds(allRes)
                    setIsAllMoldsLoaded(true)
                }

                if (res.length > 0 && !selectedMold) {
                    setSelectedMold(res[0].id)
                }
            } catch (err) {}
        }
        fetchMolds()
    }, [orderItem?.product_id])

    useEffect(() => {
        const fetchOccupied = async () => {
            try {
                const occupied = await getOccupiedMolds(planData.planned_date, shift, planData.id)
                setOccupiedMolds(occupied)
            } catch (err) {}
        }
        fetchOccupied()
    }, [planData.planned_date, shift, planData.id])

    const activeMoldsList = isAllMoldsLoaded ? allMolds : standardMolds

    useEffect(() => {
        if (selectedMold && !showMoldDropdown) {
            const obj = activeMoldsList.find(m => m.id === selectedMold)
            if (obj) setMoldSearch(obj.physical_code)
        }
    }, [selectedMold, activeMoldsList, showMoldDropdown])

    const filteredMolds = activeMoldsList.filter(m => {
        if (!moldSearch) return true
        const search = moldSearch.toLowerCase().replace(/[- ]/g, '')
        const code = m.physical_code.toLowerCase().replace(/[- ]/g, '')
        return code.includes(search)
    })

    const handleMoldSelect = (moldId: string, physicalCode: string) => {
        setSelectedMold(moldId)
        setMoldSearch(physicalCode)
        setShowMoldDropdown(false)
        moldInputRef.current?.blur()
    }

    const handleMoldKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (filteredMolds.length > 0) {
                handleMoldSelect(filteredMolds[0].id, filteredMolds[0].physical_code)
            }
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const fd = new FormData(e.target as HTMLFormElement)
        
        try {
            await updateProductionPlanAction(planData.id, {
                mold_physical_id: selectedMold || null as any,
                planned_quantity: Number(fd.get('qty')),
                operator_name: fd.get('operator') as string || undefined,
                shift: shift,
                quantity_note: fd.get('quantity_note') as string || undefined,
                estimated_hours: fd.get('estimated_hours') ? Number(fd.get('estimated_hours')) : undefined,
            })
            onSuccess()
        } catch (err: any) {
            alert(err.message)
        }
        setLoading(false)
    }

    async function handleDelete() {
        if (!confirm('Bạn có chắc xoá kế hoạch này?')) return
        setDeleting(true)
        try {
            await deleteProductionPlanAction(planData.id)
            onSuccess()
        } catch (err: any) {
            alert(err.message)
            setDeleting(false)
        }
    }

    // Delivery Date Color
    const deliveryDateStr = planData.delivery_date || orderItem?.delivery_date || orderDetail?.delivery_date
    let deliveryColor = 'text-[var(--mcs-text)]'
    if (deliveryDateStr) {
        const diff = Math.round((parseISO(deliveryDateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        if (diff < 0) deliveryColor = 'text-red-600 font-bold'
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-[var(--mcs-surface)] w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden border border-[var(--mcs-border)]">
                <div className="bg-[var(--mcs-primary-light)] p-4 border-b border-[var(--mcs-primary)] flex justify-between items-center">
                    <h2 className="text-[16px] font-bold text-[var(--mcs-primary-hover)]">⚙️ 計画編集 / 生産スケジュール設定</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex">
                        {/* CỘT TRÁI - Read-only info */}
                        <div className="w-[40%] bg-[var(--mcs-surface-2)] p-5 border-r border-[var(--mcs-border)] flex flex-col gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block text-[11px] font-bold">設備 (Máy)</span>
                                <span className="font-bold text-[14px]">{machine?.internal_code || planData.machine_instance?.internal_code}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[11px] font-bold">日付 (Ngày chạy)</span>
                                <span className="font-bold text-[14px]">{format(parseISO(planData.planned_date), 'yyyy年MM月dd日')}</span>
                            </div>
                            <div className="border-t border-[var(--mcs-border-strong)]"></div>
                            <div>
                                <span className="text-gray-500 block text-[11px] font-bold">品番 (Sản phẩm)</span>
                                <span className="font-bold text-[14px] text-[var(--mcs-primary)]">{orderItem?.product_pn_raw}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[11px] font-bold">出荷予定日 (Ngày Xuất)</span>
                                <span className={`font-bold text-[14px] ${deliveryColor}`}>
                                    {deliveryDateStr ? format(parseISO(deliveryDateStr), 'yyyy年MM月dd日') : '—'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[11px] font-bold">注文数 (Tổng Đơn Hàng)</span>
                                <span className="font-mono text-[14px] font-bold">{orderItem?.quantity?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* CỘT PHẢI - Editable fields */}
                        <div className="w-[60%] p-5 grid grid-cols-2 gap-4 gap-y-5">
                            <div className="col-span-2 relative">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-[13px] font-bold">金型 <span className="text-[10px] text-gray-500 font-normal ml-1">Khuôn</span></label>
                                    {!isAllMoldsLoaded && (
                                        <button 
                                            type="button" 
                                            onClick={async () => {
                                                const res = await getAllPhysicalMolds()
                                                setAllMolds(res)
                                                setIsAllMoldsLoaded(true)
                                            }} 
                                            className="text-[11px] text-[var(--mcs-primary)] hover:underline"
                                        >
                                            + 他の金型を選択 (Mở rộng tùy chọn)
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input 
                                        ref={moldInputRef}
                                        type="text"
                                        value={moldSearch}
                                        onChange={e => {
                                            const val = e.target.value
                                            setMoldSearch(val)
                                            setShowMoldDropdown(true)
                                            
                                            // Reset selectedMold if typing. Auto-select only if exact match.
                                            const exact = activeMoldsList.find(m => m.physical_code.toLowerCase().replace(/[- ]/g, '') === val.toLowerCase().replace(/[- ]/g, ''))
                                            if (exact) {
                                                setSelectedMold(exact.id)
                                            } else {
                                                setSelectedMold('')
                                            }
                                        }}
                                        onFocus={() => setShowMoldDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowMoldDropdown(false), 200)}
                                        onKeyDown={handleMoldKeyDown}
                                        placeholder="Tìm mã khuôn... (Enter để chọn)"
                                        className="w-full bg-white border border-[var(--mcs-border-strong)] rounded px-3 py-2 text-sm focus:ring-[var(--mcs-primary)] pr-8"
                                    />
                                    <Search size={14} className="absolute right-3 top-3 text-gray-400" />
                                </div>
                                
                                {showMoldDropdown && filteredMolds.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--mcs-border-strong)] rounded shadow-lg max-h-48 overflow-y-auto">
                                        {filteredMolds.map(m => (
                                            <div 
                                                key={m.id}
                                                onMouseDown={(e) => {
                                                    e.preventDefault() // prevent blur
                                                    handleMoldSelect(m.id, m.physical_code)
                                                }}
                                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-[var(--mcs-primary-light)] flex justify-between items-center ${selectedMold === m.id ? 'bg-[var(--mcs-primary-light)] font-bold text-[var(--mcs-primary)]' : ''}`}
                                            >
                                                <span>
                                                    {m.physical_code} 
                                                    {m.status !== 'ACTIVE' && <span className="text-amber-600 ml-1">(⚠️ Bảo trì)</span>}
                                                </span>
                                                {occupiedMolds[m.id] && (
                                                    <span className="text-red-600 text-[11px] font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100">🔒 Đang chạy ở {occupiedMolds[m.id]}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {selectedMold && !standardMolds.some(m => m.id === selectedMold) && !occupiedMolds[selectedMold] && (
                                    <div className="mt-2 text-[12px] font-bold text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                        ⚠️ 警告: 選択した金型（{activeMoldsList.find(m=>m.id === selectedMold)?.physical_code}）は、製品（{orderItem?.product_pn_raw}）の標準金型ではありません。本当によろしいですか？
                                        <div className="text-[10px] font-normal mt-0.5">(Cảnh báo: Khuôn đã chọn khác với mã khay chuẩn. Bạn có chắc chắn không?)</div>
                                    </div>
                                )}

                                {selectedMold && occupiedMolds[selectedMold] && (
                                    <div className="mt-2 text-[12px] font-bold text-red-600 bg-red-100 p-2 rounded border border-red-300 animate-pulse">
                                        🚫 衝突エラー: 選択した金型はすでに {occupiedMolds[selectedMold]} でスケジュールされています！
                                        <div className="text-[10px] font-normal mt-0.5">(Lỗi xung đột: Khuôn này đang được xếp lịch cho {occupiedMolds[selectedMold]} trong cùng ca. Không thể chọn!)</div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold mb-1">計画数 <span className="text-[10px] text-gray-500 font-normal ml-1">Số lượng KH</span></label>
                                <input name="qty" type="number" min="1" defaultValue={planData.planned_quantity} className="w-full bg-white border border-[var(--mcs-border-strong)] rounded px-3 py-2 text-sm font-mono focus:ring-[var(--mcs-primary)]" required />
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold mb-1 text-gray-500">備考 <span className="text-[10px] font-normal ml-1">Ghi chú SL</span></label>
                                <input name="quantity_note" type="text" defaultValue={planData.quantity_note} placeholder="VD: 残18490, 計7840..." className="w-full bg-white border border-[var(--mcs-border-strong)] rounded px-3 py-2 text-sm focus:ring-[var(--mcs-primary)]" />
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold mb-1">担当者 <span className="text-[10px] text-gray-500 font-normal ml-1">Người phụ trách</span></label>
                                <select name="operator" defaultValue={planData.operator_name || ''} className="w-full bg-white border border-[var(--mcs-border-strong)] rounded px-3 py-2 text-sm focus:ring-[var(--mcs-primary)]">
                                    <option value="">--- 未選択 ---</option>
                                    {operators.map(op => (
                                        <option key={op.code} value={op.name}>{op.display_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold mb-1">勤務シフト <span className="text-[10px] text-gray-500 font-normal ml-1">Ca</span></label>
                                <select 
                                    name="shift" 
                                    value={shift} 
                                    onChange={e => setShift(e.target.value as 'DAY'|'NIGHT')}
                                    className="w-full bg-white border border-[var(--mcs-border-strong)] rounded px-3 py-2 text-sm focus:ring-[var(--mcs-primary)]"
                                >
                                    <option value="DAY">DAY (昼番)</option>
                                    <option value="NIGHT">NIGHT (夜番)</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-[13px] font-bold mb-1 text-gray-500">予定時間 <span className="text-[10px] font-normal ml-1">Giờ dự kiến</span></label>
                                <div className="relative w-1/2">
                                    <input name="estimated_hours" type="number" step="0.1" defaultValue={planData.estimated_hours} placeholder="VD: 12.5" className="w-full bg-white border border-[var(--mcs-border-strong)] rounded px-3 py-2 text-sm font-mono pr-12 focus:ring-[var(--mcs-primary)]" />
                                    <span className="absolute right-3 top-2 text-gray-400 text-sm font-bold">時間</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER BUTTONS */}
                    <div className="flex justify-between items-center p-4 border-t border-[var(--mcs-border-strong)] bg-gray-50">
                        <button 
                            type="button" 
                            onClick={handleDelete} 
                            disabled={deleting || loading}
                            className="px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded shadow-sm transition-colors flex items-center gap-2"
                        >
                            {deleting ? <Loader2 size={14} className="animate-spin" /> : '削除 (Xóa)'}
                        </button>
                        
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 rounded shadow-sm">キャンセル</button>
                            <button 
                                type="submit" 
                                disabled={loading || (selectedMold ? !!occupiedMolds[selectedMold] : false)} 
                                className={`px-6 py-2 text-sm font-bold rounded shadow transition-colors ${
                                    (selectedMold && occupiedMolds[selectedMold]) 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-[var(--mcs-primary)] text-white hover:bg-[var(--mcs-primary-hover)]'
                                }`}
                            >
                                {loading ? '保存中...' : '保存 (Lưu)'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
