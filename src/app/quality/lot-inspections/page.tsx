'use client'

import { useState } from 'react'
import { createLotInspection } from '@/app/actions/quality'
import { CheckCircle, AlertCircle, ScanLine, Box, Search, Plus, Trash2 } from 'lucide-react'

export default function LotInspectionsPage() {
    const [lotId, setLotId] = useState('')
    const [stage, setStage] = useState('in_process')
    const [inspectedQty, setInspectedQty] = useState<number>(0)
    const [goodQty, setGoodQty] = useState<number>(0)
    const [ngQty, setNgQty] = useState<number>(0)
    
    // Dynamic NG Details Array
    const [ngDetails, setNgDetails] = useState<any[]>([])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

    const handleQtyChange = (field: 'inspected'|'good'|'ng', val: number) => {
        if (field === 'inspected') {
            setInspectedQty(val)
            setGoodQty(val - ngQty) // auto calc
        } else if (field === 'good') {
            setGoodQty(val)
            setNgQty(inspectedQty - val) // auto calc
        } else if (field === 'ng') {
            setNgQty(val)
            setGoodQty(inspectedQty - val) // auto calc
        }
    }

    const addNgDetail = () => {
        setNgDetails([...ngDetails, { ng_category: 'dimension', ng_qty: 1, ng_description: '' }])
    }

    const updateNgDetail = (index: number, field: string, value: any) => {
        const newDetails = [...ngDetails]
        newDetails[index][field] = value
        setNgDetails(newDetails)
    }

    const removeNgDetail = (index: number) => {
        const newDetails = [...ngDetails]
        newDetails.splice(index, 1)
        setNgDetails(newDetails)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage(null)
        
        try {
            const payload = {
                production_lot_id: lotId || null,
                po_id: null, // Depending on relation
                inspection_stage: stage,
                inspected_qty: inspectedQty,
                good_qty: goodQty,
                ng_qty: ngQty,
                notes: 'Kiểm đếm tổng quát'
            }
            
            const res = await createLotInspection(payload, ngDetails)
            if (res.error) {
                setMessage({ type: 'error', text: res.error })
            } else {
                setMessage({ type: 'success', text: `Đã lưu kết quả kiểm đếm! Pass: ${goodQty}, NG: ${ngQty}` })
                setTimeout(() => {
                    // Reset
                    setInspectedQty(0)
                    setGoodQty(0)
                    setNgQty(0)
                    setNgDetails([])
                    setMessage(null)
                }, 3000)
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto bg-gray-50 p-4 rounded-xl shadow-inner">
            <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 text-red-700 rounded-full">
                        <Box size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Kiểm đếm Hàng hóa & Lỗi (NG)</h1>
                        <p className="text-sm text-gray-500">Ghi nhận số lượng Pass/Fail cho Lô sản xuất</p>
                    </div>
                </div>
            </header>

            {message && (
                <div className={`p-4 mb-4 rounded-lg flex items-center gap-2 font-bold shrink-0 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                    {message.text}
                </div>
            )}

            <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col md:flex-row overflow-hidden min-h-0">
                {/* Left Panel: Context */}
                <div className="w-full md:w-1/3 border-r border-gray-100 bg-gray-50 p-6 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <button className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors">
                            <ScanLine size={20} />
                            Quét QR Lô Sản xuất
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Giai đoạn kiểm tra</label>
                        <select 
                            className="form-input w-full p-2 border rounded"
                            value={stage}
                            onChange={(e) => setStage(e.target.value)}
                        >
                            <option value="initial">Kiểm tra ban đầu (First-piece / Đầu chuyền)</option>
                            <option value="in_process">Trong quá trình SX (In-process)</option>
                            <option value="final">Kiểm tra toàn bộ (Final / 100% Check)</option>
                            <option value="customer_complaint">Khiếu nại KH (Customer Complaint)</option>
                        </select>
                    </div>
                </div>

                {/* Right Panel: Form */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                Tổng hợp Số lượng
                            </h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Tổng kiểm (PCS)</label>
                                    <input 
                                        type="number" 
                                        className="form-input w-full p-3 text-lg font-bold text-center border rounded bg-white"
                                        value={inspectedQty}
                                        onChange={(e) => handleQtyChange('inspected', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-green-600 mb-1">Hàng Đạt (PASS)</label>
                                    <input 
                                        type="number" 
                                        className="form-input w-full p-3 text-lg font-bold text-center text-green-700 border-green-200 rounded bg-green-50"
                                        value={goodQty}
                                        onChange={(e) => handleQtyChange('good', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-red-600 mb-1">Hàng Lỗi (NG)</label>
                                    <input 
                                        type="number" 
                                        className="form-input w-full p-3 text-lg font-bold text-center text-red-700 border-red-200 rounded bg-red-50"
                                        value={ngQty}
                                        onChange={(e) => handleQtyChange('ng', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NG Details Section */}
                        {ngQty > 0 && (
                            <div className="border border-red-200 rounded-xl overflow-hidden">
                                <div className="bg-red-50 p-3 border-b border-red-200 flex justify-between items-center">
                                    <h3 className="font-bold text-red-800">Chi tiết Hàng Lỗi (NG)</h3>
                                    <button 
                                        type="button" 
                                        onClick={addNgDetail}
                                        className="text-sm bg-white text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-100 flex items-center gap-1 font-bold"
                                    >
                                        <Plus size={16} /> Thêm Lỗi
                                    </button>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    {ngDetails.map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded border">
                                            <select 
                                                className="form-input p-2 border rounded bg-white w-1/3"
                                                value={detail.ng_category}
                                                onChange={(e) => updateNgDetail(idx, 'ng_category', e.target.value)}
                                            >
                                                <option value="dimension">Kích thước (Dimension)</option>
                                                <option value="appearance">Ngoại quan (Appearance)</option>
                                                <option value="material">Vật liệu (Material)</option>
                                                <option value="packaging">Đóng gói (Packaging)</option>
                                                <option value="other">Khác (Other)</option>
                                            </select>
                                            <input 
                                                type="number" 
                                                className="form-input p-2 border rounded w-24 text-center"
                                                placeholder="SL"
                                                value={detail.ng_qty}
                                                onChange={(e) => updateNgDetail(idx, 'ng_qty', parseInt(e.target.value) || 0)}
                                            />
                                            <input 
                                                type="text" 
                                                className="form-input p-2 border rounded flex-1"
                                                placeholder="Mô tả chi tiết..."
                                                value={detail.ng_description}
                                                onChange={(e) => updateNgDetail(idx, 'ng_description', e.target.value)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeNgDetail(idx)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {ngDetails.length === 0 && (
                                        <p className="text-sm text-gray-500 italic text-center py-2">
                                            Chưa ghi nhận chi tiết loại lỗi nào. Hãy bấm "Thêm Lỗi" để bắt đầu.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-lg font-bold text-white text-lg shadow-md transition-transform ${isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-1'}`}
                            >
                                {isSubmitting ? 'Đang lưu...' : 'Lưu Kết quả KCS'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
