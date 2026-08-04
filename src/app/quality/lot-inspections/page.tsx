'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createLotInspection } from '@/app/actions/quality'
import { CheckCircle, AlertCircle, ScanLine, Box, Plus, Trash2 } from 'lucide-react'

export default function LotInspectionsPage() {
    const t = useTranslations('Quality')
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
                po_id: null,
                inspection_stage: stage,
                inspected_qty: inspectedQty,
                good_qty: goodQty,
                ng_qty: ngQty,
                notes: t('summaryQty')
            }
            
            const res = await createLotInspection(payload, ngDetails)
            if (res.error) {
                setMessage({ type: 'error', text: res.error })
            } else {
                setMessage({ type: 'success', text: `PASS: ${goodQty}, NG: ${ngQty}` })
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
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto p-4 gap-4 overflow-y-auto">
            <header className="flex justify-between items-center bg-[var(--tint-red-bg)] p-4 rounded-lg border border-[var(--mcs-border)] mb-2 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-3 badge badge--error rounded-full">
                        <Box size={24} />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)' }}>
                            {t('lotInspectionTitle')}
                        </h1>
                        <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                            {t('lotInspectionSubtitle')}
                        </p>
                    </div>
                </div>
            </header>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 font-bold shrink-0 ${message.type === 'success' ? 'badge badge--success' : 'badge badge--error'}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="card-flat flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                {/* Left Panel: Context */}
                <div className="w-full md:w-1/3 border-r border-[var(--mcs-border)] bg-[var(--tint-teal-bg)]/30 p-6 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <button className="btn btn-secondary w-full py-3 flex items-center justify-center gap-2 font-bold text-[13px]">
                            <ScanLine size={20} />
                            {t('scanQrLot')}
                        </button>
                    </div>

                    <div>
                        <label className="block text-[12px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {t('inspectionStage')}
                        </label>
                        <select 
                            className="form-input w-full p-2 text-[13px]"
                            value={stage}
                            onChange={(e) => setStage(e.target.value)}
                        >
                            <option value="initial">{t('stages.initial')}</option>
                            <option value="in_process">{t('stages.in_process')}</option>
                            <option value="final">{t('stages.final')}</option>
                            <option value="customer_complaint">{t('stages.customer_complaint')}</option>
                        </select>
                    </div>
                </div>

                {/* Right Panel: Form */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="card-flat p-6">
                            <h2 className="font-bold mb-4 flex items-center gap-2 text-[14px]" style={{ color: 'var(--text-primary)' }}>
                                {t('summaryQty')}
                            </h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                                        {t('totalInspected')}
                                    </label>
                                    <input 
                                        type="number" 
                                        className="form-input w-full p-3 text-lg font-bold font-mono text-center"
                                        value={inspectedQty}
                                        onChange={(e) => handleQtyChange('inspected', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--status-success)' }}>
                                        {t('goodQty')}
                                    </label>
                                    <input 
                                        type="number" 
                                        className="form-input w-full p-3 text-lg font-bold font-mono text-center"
                                        style={{ color: 'var(--status-success)', backgroundColor: 'var(--tint-teal-bg)', borderColor: 'var(--status-success)' }}
                                        value={goodQty}
                                        onChange={(e) => handleQtyChange('good', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--status-error)' }}>
                                        {t('ngQty')}
                                    </label>
                                    <input 
                                        type="number" 
                                        className="form-input w-full p-3 text-lg font-bold font-mono text-center"
                                        style={{ color: 'var(--status-error)', backgroundColor: 'var(--tint-red-bg)', borderColor: 'var(--status-error)' }}
                                        value={ngQty}
                                        onChange={(e) => handleQtyChange('ng', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NG Details Section */}
                        {ngQty > 0 && (
                            <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--status-error)' }}>
                                <div className="bg-[var(--tint-red-bg)] p-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--status-error)' }}>
                                    <h3 className="font-bold text-[13px]" style={{ color: 'var(--status-error)' }}>{t('ngDetailSection')}</h3>
                                    <button 
                                        type="button" 
                                        onClick={addNgDetail}
                                        className="btn btn-secondary text-[12px] py-1 px-3 flex items-center gap-1 font-bold"
                                    >
                                        <Plus size={16} /> {t('addNg')}
                                    </button>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    {ngDetails.map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-3 card-flat p-3">
                                            <select 
                                                className="form-input p-2 text-[13px] w-1/3"
                                                value={detail.ng_category}
                                                onChange={(e) => updateNgDetail(idx, 'ng_category', e.target.value)}
                                            >
                                                <option value="dimension">{t('categories.dimension')}</option>
                                                <option value="appearance">{t('categories.appearance')}</option>
                                                <option value="material">{t('categories.material')}</option>
                                                <option value="packaging">{t('categories.packaging')}</option>
                                                <option value="other">{t('categories.other')}</option>
                                            </select>
                                            <input 
                                                type="number" 
                                                className="form-input p-2 font-mono text-[13px] w-24 text-center"
                                                placeholder={t('qtyPlaceholder')}
                                                value={detail.ng_qty}
                                                onChange={(e) => updateNgDetail(idx, 'ng_qty', parseInt(e.target.value) || 0)}
                                            />
                                            <input 
                                                type="text" 
                                                className="form-input p-2 text-[13px] flex-1"
                                                placeholder={t('headers.description')}
                                                value={detail.ng_description}
                                                onChange={(e) => updateNgDetail(idx, 'ng_description', e.target.value)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeNgDetail(idx)}
                                                className="p-2 rounded hover:opacity-80 transition-opacity"
                                                style={{ color: 'var(--status-error)' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {ngDetails.length === 0 && (
                                        <p className="text-[12px] italic text-center py-2" style={{ color: 'var(--text-muted)' }}>
                                            {t('noNgDetail')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-[var(--mcs-border)] flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="btn btn-primary px-8 py-3 text-[14px] font-bold shadow-md transition-transform disabled:opacity-50"
                            >
                                {isSubmitting ? t('saving') : t('saveResult')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

