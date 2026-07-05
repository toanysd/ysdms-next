'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createInboundTxnAction } from '@/app/actions/inventory'

interface PlasticLite {
    id: string
    code: string
    material: string | null
    color_name: string | null
}

export function InboundFormClient({ plastics }: { plastics: PlasticLite[] }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorObj, setErrorObj] = useState<string | null>(null)

    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [plasticId, setPlasticId] = useState('')
    const [changeKg, setChangeKg] = useState('')
    const [lotNo, setLotNo] = useState('')
    const [notes, setNotes] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!plasticId) return alert('Vui lòng chọn loại nhựa')
        const kg = parseFloat(changeKg)
        if (isNaN(kg) || kg <= 0) return alert('Số lượng (Kg) phải lớn hơn 0')
        if (!date) return alert('Ngày giao dịch không thể trống')

        try {
            setIsSubmitting(true)
            setErrorObj(null)

            await createInboundTxnAction({
                plastic_id: plasticId,
                change_kg: kg,
                lot_no_material: lotNo,
                notes: notes,
                transaction_date: date
            })

            router.push('/inventory')
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setErrorObj(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm m-2">
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border-b border-teal-200 shrink-0">
                <div className="flex items-center gap-2">
                    <Link href="/inventory" className="text-teal-700 hover:text-teal-900 transition-colors mr-2">
                        <ArrowLeft size={18} />
                    </Link>
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">入庫登録 (Ghi nhận Nhập Kho)</span>
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    {errorObj && <span className="text-red-500 text-xs font-bold mr-4">{errorObj}</span>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-teal-700 hover:bg-teal-800 text-white h-[30px] px-6 flex items-center gap-2 text-xs rounded transition-colors shadow-sm font-bold disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        Lưu phiếu nhập
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                <div className="max-w-[700px] mx-auto bg-white border border-teal-200 shadow-sm rounded-lg p-6 space-y-6">
                    <h3 className="text-sm font-bold text-teal-800 border-b border-teal-100 pb-2">
                        📦 Thông tin lô nguyên liệu nhập
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1 flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-teal-900">Ngày nhập kho (入庫日) <span className="text-red-500">*</span></label>
                            <input value={date} onChange={e => setDate(e.target.value)} type="date" required className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 rounded px-2" />
                        </div>

                        <div className="col-span-1 flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-teal-900">Loại Nhựa (Vật tư) <span className="text-red-500">*</span></label>
                            <select value={plasticId} onChange={e => setPlasticId(e.target.value)} required className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 rounded px-2 bg-white">
                                <option value="">-- Chọn cuộn nhựa --</option>
                                {plastics.map(p => (
                                    <option key={p.id} value={p.id}>{p.code} - {p.material || ''} {p.color_name ? `(${p.color_name})` : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-1 flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-teal-900">Số lượng Kg (数量) <span className="text-red-500">*</span></label>
                            <input value={changeKg} onChange={e => setChangeKg(e.target.value)} type="number" step="0.01" min="0" required className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 rounded px-2 font-mono" placeholder="Ví dụ: 1000.5" />
                        </div>

                        <div className="col-span-1 flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-teal-900">Mã Lô SX (Lot No/ロット)</label>
                            <input value={lotNo} onChange={e => setLotNo(e.target.value)} type="text" className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 rounded px-2 font-mono" placeholder="Ví dụ: L-2026X" />
                        </div>

                        <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-teal-900">Ghi chú (備考)</label>
                            <input value={notes} onChange={e => setNotes(e.target.value)} type="text" className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 rounded px-2" placeholder="Ghi chú người vận chuyển, tình trạng bao bì..." />
                        </div>
                    </div>

                </div>
            </div>
        </form>
    )
}
