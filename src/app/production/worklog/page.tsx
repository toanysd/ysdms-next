'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createProductionLog } from '@/app/actions/production_logs'
import { CheckCircle, AlertCircle, ScanLine, Clock, Settings, Save } from 'lucide-react'

export default function WorklogPage() {
    const t = useTranslations('Worklogs')
    const locale = useLocale()

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
                setMessage({ type: 'success', text: t('saveSuccess') })
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
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto p-4 rounded-xl card-flat">
            <header className="flex justify-between items-center card-flat p-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--tint-teal-bg)', color: 'var(--accent)' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('machineLogTitle')}</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('machineLogSubtitle')}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                        {new Date().toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'vi-VN')}
                    </div>
                </div>
            </header>

            {message && (
                <div className={`p-4 mb-4 rounded-lg flex items-center gap-2 font-bold ${message.type === 'success' ? 'badge badge--success' : 'badge badge--error'}`} style={{ fontSize: '14px', justifyContent: 'flex-start' }}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="flex-1 card-flat rounded-lg flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel: Steps / Meta */}
                <div className="w-full md:w-1/3 border-r p-6 flex flex-col gap-6" style={{ borderColor: 'var(--border-color, #E2E8F0)', backgroundColor: 'var(--bg-muted, #F8FAFC)' }}>
                    <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('scanQrLabel')}</label>
                        <button className="btn btn-secondary w-full py-4 flex items-center justify-center gap-2 font-bold">
                            <ScanLine size={20} />
                            {t('scanQrButton')}
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('selectMachineAndShift')}</label>
                        <select 
                            className="form-input w-full p-3 mb-3 font-bold"
                            value={machineId}
                            onChange={e => setMachineId(e.target.value)}
                        >
                            <option value="">{t('selectMachinePlaceholder')}</option>
                            <option value="machine-1">{t('machine1')}</option>
                            <option value="machine-2">{t('machine2')}</option>
                            <option value="machine-3">{t('machine3')}</option>
                        </select>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShift('DAY')}
                                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-colors ${shift === 'DAY' ? 'btn-primary' : 'btn-secondary'}`}
                                style={shift === 'DAY' ? { backgroundColor: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' } : {}}
                            >
                                {t('shiftDay')}
                            </button>
                            <button 
                                onClick={() => setShift('NIGHT')}
                                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-colors ${shift === 'NIGHT' ? 'btn-primary' : 'btn-secondary'}`}
                                style={shift === 'NIGHT' ? { backgroundColor: '#7C3AED', color: '#fff', borderColor: '#7C3AED' } : {}}
                            >
                                {t('shiftNight')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Quantity & Params */}
                <div className="flex-1 p-6 flex flex-col">
                    {/* Tabs */}
                    <div className="flex gap-4 border-b mb-6" style={{ borderColor: 'var(--border-color, #E2E8F0)' }}>
                        <button 
                            onClick={() => setStep(1)}
                            className={`pb-3 font-bold text-lg border-b-4 transition-colors`}
                            style={step === 1 ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : { borderColor: 'transparent', color: 'var(--text-muted)' }}
                        >
                            {t('stepQty')}
                        </button>
                        <button 
                            onClick={() => setStep(2)}
                            className={`pb-3 font-bold text-lg border-b-4 transition-colors`}
                            style={step === 2 ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : { borderColor: 'transparent', color: 'var(--text-muted)' }}
                        >
                            {t('stepParams')}
                        </button>
                    </div>

                    {step === 1 && (
                        <div className="flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-6 rounded-xl border-2 text-center relative" style={{ backgroundColor: 'var(--tint-teal-bg, #F0FDF4)', borderColor: 'var(--accent, #16A34A)' }}>
                                    <div className="text-sm font-bold mb-2 uppercase" style={{ color: 'var(--accent)' }}>{t('qtyOk')}</div>
                                    <div className="text-5xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{outputQty.toLocaleString()}</div>
                                    <button onClick={() => setOutputQty(0)} className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-surface, #FFFFFF)', color: 'var(--text-muted)' }}>{t('resetBtn')}</button>
                                </div>
                                <div className="p-6 rounded-xl border-2 text-center relative" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444' }}>
                                    <div className="text-sm font-bold mb-2 uppercase" style={{ color: '#DC2626' }}>{t('qtyNg')}</div>
                                    <div className="text-5xl font-black tabular-nums" style={{ color: '#DC2626' }}>{defectQty.toLocaleString()}</div>
                                    <button onClick={() => setDefectQty(0)} className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-surface, #FFFFFF)', color: 'var(--text-muted)' }}>{t('resetBtn')}</button>
                                </div>
                            </div>

                            <div className="flex-1 flex justify-center items-center">
                                {/* Giant Numpad Component */}
                                <div className="grid grid-cols-3 gap-3 max-w-sm w-full">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <button 
                                            key={num} 
                                            onClick={() => handleNumpadInput(num, setOutputQty)}
                                            className="h-16 btn btn-secondary text-2xl font-bold rounded-lg active:scale-95 transition-transform"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => handleNumpadInput(0, setOutputQty)}
                                        className="h-16 col-span-2 btn btn-secondary text-2xl font-bold rounded-lg active:scale-95 transition-transform"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        0
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(setOutputQty)}
                                        className="h-16 btn text-lg font-bold rounded-lg active:scale-95 transition-transform flex items-center justify-center"
                                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', borderColor: '#FCA5A5' }}
                                    >
                                        {t('deleteBtn')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 rounded-lg border card-flat">
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}><Settings size={16}/> {t('tempTop')}</label>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setTempTop(p=>p-5)} className="btn btn-secondary w-12 h-12 rounded font-bold text-xl">-</button>
                                        <div className="flex-1 text-center text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{tempTop}</div>
                                        <button onClick={() => setTempTop(p=>p+5)} className="btn btn-secondary w-12 h-12 rounded font-bold text-xl">+</button>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg border card-flat">
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}><Settings size={16}/> {t('tempBottom')}</label>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setTempBottom(p=>p-5)} className="btn btn-secondary w-12 h-12 rounded font-bold text-xl">-</button>
                                        <div className="flex-1 text-center text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{tempBottom}</div>
                                        <button onClick={() => setTempBottom(p=>p+5)} className="btn btn-secondary w-12 h-12 rounded font-bold text-xl">+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border card-flat max-w-sm">
                                <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}><Clock size={16}/> {t('cycleTime')}</label>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setCycleTime(p=>p-0.1)} className="btn btn-secondary w-12 h-12 rounded font-bold text-xl">-</button>
                                    <div className="flex-1 text-center text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{cycleTime.toFixed(1)}</div>
                                    <button onClick={() => setCycleTime(p=>p+0.1)} className="btn btn-secondary w-12 h-12 rounded font-bold text-xl">+</button>
                                </div>
                            </div>

                            <div className="mt-auto flex justify-end gap-4 border-t pt-6" style={{ borderColor: 'var(--border-color, #E2E8F0)' }}>
                                <button onClick={() => setStep(1)} className="btn btn-secondary px-8 py-4 font-bold rounded-lg">
                                    {t('backBtn')}
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting}
                                    className="btn btn-primary px-8 py-4 font-bold rounded-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={20}/>
                                    {isSubmitting ? t('savingBtn') : t('saveBtn')}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="mt-auto flex justify-end gap-4 border-t pt-6" style={{ borderColor: 'var(--border-color, #E2E8F0)' }}>
                            <button onClick={() => setStep(2)} className="btn btn-primary px-8 py-4 font-bold rounded-lg flex items-center gap-2">
                                {t('nextParamsBtn')} <Settings size={20}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

