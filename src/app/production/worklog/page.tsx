'use client'

import { useState } from 'react'
import { createProductionLog } from '@/app/actions/production_logs'
import { CheckCircle, AlertCircle, ScanLine, Calculator, Clock, Settings, Save } from 'lucide-react'

export default function WorklogPage() {
    const [step, setStep] = useState(1)
    
    // Form State
    const [machineId, setMachineId] = useState('')
    const [poId, setPoId] = useState('')
    const [shift, setShift] = useState('DAY')
    const [outputQty, setOutputQty] = useState<number>(0)
    const [defectQty, setDefectQty] = useState<number>(0)
    
    // Forming Params
    const [tempTop, setTempTop] = useState<number>(200)
    const [tempBottom, setTempBottom] = useState<number>(180)
    const [cycleTime, setCycleTime] = useState<number>(5.5)
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

    const handleNumpadInput = (val: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => {
            const str = prev === 0 ? String(val) : String(prev) + String(val)
            return Number(str)
        })
    }

    const handleDelete = (setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => {
            const str = String(prev)
            return str.length > 1 ? Number(str.slice(0, -1)) : 0
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setMessage(null)
        try {
            const payload = {
                machine_id: machineId || '00000000-0000-0000-0000-000000000000', // Mock UUID if empty
                po_id: poId || null,
                log_date: new Date().toISOString().split('T')[0],
                output_quantity: outputQty,
                defect_quantity: defectQty,
                forming_params_json: { temp_top: tempTop, temp_bottom: tempBottom, cycle_time: cycleTime }
            }
            const res = await createProductionLog(payload)
            if (res.error) {
                setMessage({ type: 'error', text: res.error })
            } else {
                setMessage({ type: 'success', text: 'Đã lưu nhật ký thành công!' })
                setTimeout(() => {
                    // Reset
                    setOutputQty(0)
                    setDefectQty(0)
                    setMessage(null)
                    setStep(1)
                }, 2000)
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-gray-50 p-4 rounded-xl shadow-inner">
            <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Nhật Ký Máy</h1>
                        <p className="text-sm text-gray-500">Ghi nhận sản lượng & thông số</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-gray-600">{new Date().toLocaleDateString('vi-VN')}</div>
                </div>
            </header>

            {message && (
                <div className={`p-4 mb-4 rounded-lg flex items-center gap-2 font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                    {message.text}
                </div>
            )}

            <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel: Steps / Meta */}
                <div className="w-full md:w-1/3 border-r border-gray-100 bg-gray-50 p-6 flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Quét Mã Lệnh SX (QR)</label>
                        <button className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors">
                            <ScanLine size={20} />
                            Quét QR Code
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Hoặc chọn Máy & Ca</label>
                        <select 
                            className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3 font-bold text-gray-700 outline-none focus:border-blue-500"
                            value={machineId}
                            onChange={e => setMachineId(e.target.value)}
                        >
                            <option value="">-- Chọn Máy Dập --</option>
                            <option value="machine-1">Máy M1 (Asano 1)</option>
                            <option value="machine-2">Máy M2 (Asano 2)</option>
                            <option value="machine-3">Máy M3 (Illig)</option>
                        </select>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShift('DAY')}
                                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-colors ${shift === 'DAY' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}
                            >
                                Ca Ngày (DAY)
                            </button>
                            <button 
                                onClick={() => setShift('NIGHT')}
                                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-colors ${shift === 'NIGHT' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500'}`}
                            >
                                Ca Đêm (NIGHT)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Quantity & Params */}
                <div className="flex-1 p-6 flex flex-col">
                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-gray-200 mb-6">
                        <button 
                            onClick={() => setStep(1)}
                            className={`pb-3 font-bold text-lg border-b-4 transition-colors ${step === 1 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400'}`}
                        >
                            1. Sản lượng (Qty)
                        </button>
                        <button 
                            onClick={() => setStep(2)}
                            className={`pb-3 font-bold text-lg border-b-4 transition-colors ${step === 2 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400'}`}
                        >
                            2. Thông số (Params)
                        </button>
                    </div>

                    {step === 1 && (
                        <div className="flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200 text-center relative">
                                    <div className="text-sm font-bold text-green-700 mb-2 uppercase">Sản lượng OK</div>
                                    <div className="text-5xl font-black text-green-600 tabular-nums">{outputQty.toLocaleString()}</div>
                                    <button onClick={() => setOutputQty(0)} className="absolute top-2 right-2 text-xs text-green-600 font-bold bg-green-200 px-2 py-1 rounded">Reset</button>
                                </div>
                                <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 text-center relative">
                                    <div className="text-sm font-bold text-red-700 mb-2 uppercase">Hàng Lỗi (NG)</div>
                                    <div className="text-5xl font-black text-red-600 tabular-nums">{defectQty.toLocaleString()}</div>
                                    <button onClick={() => setDefectQty(0)} className="absolute top-2 right-2 text-xs text-red-600 font-bold bg-red-200 px-2 py-1 rounded">Reset</button>
                                </div>
                            </div>

                            <div className="flex-1 flex justify-center items-center">
                                {/* Giant Numpad Component */}
                                <div className="grid grid-cols-3 gap-3 max-w-sm w-full">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <button 
                                            key={num} 
                                            onClick={() => handleNumpadInput(num, setOutputQty)}
                                            className="h-16 bg-gray-100 hover:bg-gray-200 text-2xl font-bold text-gray-700 rounded-lg active:bg-gray-300 transition-colors"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => handleNumpadInput(0, setOutputQty)}
                                        className="h-16 col-span-2 bg-gray-100 hover:bg-gray-200 text-2xl font-bold text-gray-700 rounded-lg active:bg-gray-300 transition-colors"
                                    >
                                        0
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(setOutputQty)}
                                        className="h-16 bg-red-100 hover:bg-red-200 text-red-600 text-lg font-bold rounded-lg active:bg-red-300 transition-colors flex items-center justify-center"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><Settings size={16}/> Nhiệt độ trên (°C)</label>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setTempTop(p=>p-5)} className="w-12 h-12 rounded bg-gray-200 font-bold text-xl">-</button>
                                        <div className="flex-1 text-center text-3xl font-black text-gray-800">{tempTop}</div>
                                        <button onClick={() => setTempTop(p=>p+5)} className="w-12 h-12 rounded bg-gray-200 font-bold text-xl">+</button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><Settings size={16}/> Nhiệt độ dưới (°C)</label>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setTempBottom(p=>p-5)} className="w-12 h-12 rounded bg-gray-200 font-bold text-xl">-</button>
                                        <div className="flex-1 text-center text-3xl font-black text-gray-800">{tempBottom}</div>
                                        <button onClick={() => setTempBottom(p=>p+5)} className="w-12 h-12 rounded bg-gray-200 font-bold text-xl">+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-w-sm">
                                <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><Clock size={16}/> Chu kỳ dập (s)</label>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setCycleTime(p=>p-0.1)} className="w-12 h-12 rounded bg-gray-200 font-bold text-xl">-</button>
                                    <div className="flex-1 text-center text-3xl font-black text-gray-800">{cycleTime.toFixed(1)}</div>
                                    <button onClick={() => setCycleTime(p=>p+0.1)} className="w-12 h-12 rounded bg-gray-200 font-bold text-xl">+</button>
                                </div>
                            </div>

                            <div className="mt-auto flex justify-end gap-4 border-t border-gray-100 pt-6">
                                <button onClick={() => setStep(1)} className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300">
                                    Quay lại
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting}
                                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={20}/>
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu Nhật Ký'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="mt-auto flex justify-end gap-4 border-t border-gray-100 pt-6">
                            <button onClick={() => setStep(2)} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                Tiếp tục: Nhập Thông số <Settings size={20}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
