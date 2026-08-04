'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createInspection } from '@/app/actions/quality'
import { CheckCircle, AlertCircle, ScanLine, Camera, Check, X } from 'lucide-react'

export default function QCInspectionsPage() {
    const t = useTranslations('Quality')
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
                setMessage({ type: 'success', text: finalResult })
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
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto p-4 gap-4 overflow-y-auto">
            <header className="flex justify-between items-center bg-[var(--tint-teal-bg)] p-4 rounded-lg border border-[var(--mcs-border)] mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 badge badge--info rounded-full">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)' }}>
                            {t('inspectionsTitle')}
                        </h1>
                        <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                            {t('inspectionsSubtitle')}
                        </p>
                    </div>
                </div>
            </header>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 font-bold ${message.type === 'success' ? 'badge badge--success' : 'badge badge--error'}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="card-flat flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel: Context */}
                <div className="w-full md:w-1/3 border-r border-[var(--mcs-border)] bg-[var(--tint-teal-bg)]/30 p-6 flex flex-col gap-6">
                    <div>
                        <button className="btn btn-secondary w-full py-3 flex items-center justify-center gap-2 font-bold text-[13px]">
                            <ScanLine size={20} />
                            {t('scanQrJob')}
                        </button>
                    </div>

                    <div>
                        <label className="block text-[12px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {t('inspectionStage')}
                        </label>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setStage('SETUP')} 
                                className={`p-3 rounded-lg font-bold border text-left text-[13px] transition-colors ${stage === 'SETUP' ? 'btn-primary' : 'card-flat'}`}
                            >
                                {t('stages.setup')}
                            </button>
                            <button 
                                onClick={() => setStage('IN_PROCESS')} 
                                className={`p-3 rounded-lg font-bold border text-left text-[13px] transition-colors ${stage === 'IN_PROCESS' ? 'btn-primary' : 'card-flat'}`}
                            >
                                {t('stages.in_process')}
                            </button>
                            <button 
                                onClick={() => setStage('FINAL')} 
                                className={`p-3 rounded-lg font-bold border text-left text-[13px] transition-colors ${stage === 'FINAL' ? 'btn-primary' : 'card-flat'}`}
                            >
                                {t('stages.final')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Data Entry */}
                <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                    
                    <div className="mb-6">
                        <h3 className="text-[12px] font-bold uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                            {t('dimensionsTitle')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="card-flat p-3">
                                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                                    {t('length')}
                                </label>
                                <input type="number" value={length} onChange={e=>setLength(e.target.value)} className="form-input w-full text-2xl font-bold font-mono p-2" placeholder="0.0" />
                            </div>
                            <div className="card-flat p-3">
                                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                                    {t('width')}
                                </label>
                                <input type="number" value={width} onChange={e=>setWidth(e.target.value)} className="form-input w-full text-2xl font-bold font-mono p-2" placeholder="0.0" />
                            </div>
                            <div className="card-flat p-3">
                                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                                    {t('height')}
                                </label>
                                <input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="form-input w-full text-2xl font-bold font-mono p-2" placeholder="0.0" />
                            </div>
                            <div className="card-flat p-3">
                                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                                    {t('thickness')}
                                </label>
                                <input type="number" value={thickness} onChange={e=>setThickness(e.target.value)} className="form-input w-full text-2xl font-bold font-mono p-2" placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[12px] font-bold uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                            {t('visualTitle')}
                        </h3>
                        <div className="flex gap-4">
                            <button 
                                onClick={()=>setNoScratch(!noScratch)} 
                                className={`flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 font-bold text-[13px] ${noScratch ? 'badge badge--success' : 'badge badge--error'}`}
                            >
                                {noScratch ? <Check size={20}/> : <X size={20}/>} {t('noScratch')}
                            </button>
                            <button 
                                onClick={()=>setNoBurr(!noBurr)} 
                                className={`flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 font-bold text-[13px] ${noBurr ? 'badge badge--success' : 'badge badge--error'}`}
                            >
                                {noBurr ? <Check size={20}/> : <X size={20}/>} {t('noBurr')}
                            </button>
                            <button 
                                onClick={()=>setTransparency(!transparency)} 
                                className={`flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 font-bold text-[13px] ${transparency ? 'badge badge--success' : 'badge badge--error'}`}
                            >
                                {transparency ? <Check size={20}/> : <X size={20}/>} {t('transparency')}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[12px] font-bold uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                            {t('photoTitle')}
                        </h3>
                        <button className="w-full p-4 border-2 border-dashed border-[var(--mcs-border)] rounded-lg flex flex-col items-center justify-center gap-2 text-[13px] font-bold hover:bg-[var(--tint-teal-bg)]/20" style={{ color: 'var(--text-muted)' }}>
                            <Camera size={24} />
                            <span>{t('takePhoto')}</span>
                        </button>
                    </div>

                    <div className="mt-auto border-t border-[var(--mcs-border)] pt-6">
                        <h3 className="text-[12px] font-bold uppercase mb-3 text-center" style={{ color: 'var(--text-muted)' }}>
                            {t('finalResult')}
                        </h3>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleSubmit('FAIL')}
                                disabled={isSubmitting}
                                className="flex-1 py-4 text-white rounded-xl text-xl font-bold transition-transform active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--status-error)' }}
                            >
                                {t('fail')}
                            </button>
                            <button 
                                onClick={() => handleSubmit('PASS')}
                                disabled={isSubmitting}
                                className="flex-[2] py-4 text-white rounded-xl text-xl font-bold transition-transform active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--status-success)' }}
                            >
                                {t('pass')}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

