'use client'

import { useState } from 'react'
import { createInspection } from '@/app/actions/quality'
import { CheckCircle, AlertCircle, ScanLine, Camera, Check, X } from 'lucide-react'

export default function QCInspectionsPage() {
    const [jobId, setJobId] = useState('')
    const [productId, setProductId] = useState('')
    const [stage, setStage] = useState('SETUP')
    
    // Measurement Data
    const [length, setLength] = useState<string>('')
    const [width, setWidth] = useState<string>('')
    const [height, setHeight] = useState<string>('')
    const [thickness, setThickness] = useState<string>('')
    
    // Visual Checks
    const [noScratch, setNoScratch] = useState(true)
    const [noBurr, setNoBurr] = useState(true)
    const [transparency, setTransparency] = useState(true)
    
    const [result, setResult] = useState<'PASS'|'FAIL'|null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

    const handleSubmit = async (finalResult: 'PASS'|'FAIL') => {
        setResult(finalResult)
        setIsSubmitting(true)
        setMessage(null)
        
        try {
            const payload = {
                job_id: jobId || '00000000-0000-0000-0000-000000000000', // Mock
                product_id: productId || '00000000-0000-0000-0000-000000000000',
                inspection_type: 'TRAY_DIMENSION',
                inspection_stage: stage,
                pass_fail: finalResult,
                measurement_data: { length, width, height, thickness },
                notes: `Visual Checks: Scratch=${!noScratch}, Burr=${!noBurr}, Transp=${transparency}`
            }
            
            const res = await createInspection(payload)
            if (res.error) {
                setMessage({ type: 'error', text: res.error })
            } else {
                setMessage({ type: 'success', text: `Đã ghi nhận kết quả: ${finalResult}` })
                setTimeout(() => {
                    // Reset
                    setLength('')
                    setWidth('')
                    setHeight('')
                    setThickness('')
                    setResult(null)
                    setMessage(null)
                }, 2000)
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto bg-gray-50 p-4 rounded-xl shadow-inner">
            <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Kiểm tra Chất lượng (KCS)</h1>
                        <p className="text-sm text-gray-500">Đo kích thước & Ngoại quan khay</p>
                    </div>
                </div>
            </header>

            {message && (
                <div className={`p-4 mb-4 rounded-lg flex items-center gap-2 font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                    {message.text}
                </div>
            )}

            <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel: Context */}
                <div className="w-full md:w-1/3 border-r border-gray-100 bg-gray-50 p-6 flex flex-col gap-6">
                    <div>
                        <button className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors">
                            <ScanLine size={20} />
                            Quét QR Lệnh SX / Khay
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Công đoạn kiểm tra</label>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => setStage('SETUP')} className={`p-3 rounded-lg font-bold border-2 text-left ${stage === 'SETUP' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500'}`}>
                                1. Đầu ca (Setup)
                            </button>
                            <button onClick={() => setStage('IN_PROCESS')} className={`p-3 rounded-lg font-bold border-2 text-left ${stage === 'IN_PROCESS' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500'}`}>
                                2. Giữa ca (In-Process)
                            </button>
                            <button onClick={() => setStage('FINAL')} className={`p-3 rounded-lg font-bold border-2 text-left ${stage === 'FINAL' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500'}`}>
                                3. Lấy mẫu Cuối ca (Final)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Data Entry */}
                <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                    
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">1. Kích thước đo (mm)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Chiều Dài</label>
                                <input type="number" value={length} onChange={e=>setLength(e.target.value)} className="w-full text-2xl font-bold p-2 border border-gray-300 rounded focus:border-purple-500 outline-none" placeholder="0.0" />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Chiều Rộng</label>
                                <input type="number" value={width} onChange={e=>setWidth(e.target.value)} className="w-full text-2xl font-bold p-2 border border-gray-300 rounded focus:border-purple-500 outline-none" placeholder="0.0" />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Chiều Cao</label>
                                <input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="w-full text-2xl font-bold p-2 border border-gray-300 rounded focus:border-purple-500 outline-none" placeholder="0.0" />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Độ Dày T.</label>
                                <input type="number" value={thickness} onChange={e=>setThickness(e.target.value)} className="w-full text-2xl font-bold p-2 border border-gray-300 rounded focus:border-purple-500 outline-none" placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">2. Đánh giá Ngoại quan</h3>
                        <div className="flex gap-4">
                            <button onClick={()=>setNoScratch(!noScratch)} className={`flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 font-bold ${noScratch ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'}`}>
                                {noScratch ? <Check size={20}/> : <X size={20}/>} Không xước
                            </button>
                            <button onClick={()=>setNoBurr(!noBurr)} className={`flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 font-bold ${noBurr ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'}`}>
                                {noBurr ? <Check size={20}/> : <X size={20}/>} Không bavia
                            </button>
                            <button onClick={()=>setTransparency(!transparency)} className={`flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 font-bold ${transparency ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'}`}>
                                {transparency ? <Check size={20}/> : <X size={20}/>} Độ trong đạt
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">3. Hình ảnh (Tùy chọn)</h3>
                        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
                            <Camera size={24} />
                            <span>Chụp ảnh hàng NG / Lỗi</span>
                        </button>
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 text-center">Kết luận cuối cùng</h3>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleSubmit('FAIL')}
                                disabled={isSubmitting}
                                className="flex-1 py-6 bg-red-600 hover:bg-red-700 text-white rounded-xl text-2xl font-black shadow-lg shadow-red-200 transition-transform active:scale-95 disabled:opacity-50"
                            >
                                FAIL (NG)
                            </button>
                            <button 
                                onClick={() => handleSubmit('PASS')}
                                disabled={isSubmitting}
                                className="flex-[2] py-6 bg-green-500 hover:bg-green-600 text-white rounded-xl text-2xl font-black shadow-lg shadow-green-200 transition-transform active:scale-95 disabled:opacity-50"
                            >
                                PASS (OK)
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
