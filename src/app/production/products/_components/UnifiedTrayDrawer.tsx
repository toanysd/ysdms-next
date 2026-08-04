'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { upsertUnifiedTray, type UnifiedTrayPayload } from '../upsert-actions'

type Section = 'TRAY' | 'DESIGN' | 'PRODUCTION'

interface Props {
  isOpen: boolean
  onClose: () => void
  customers?: any[]
  plasticTypes?: any[]
}

const inputCls = 'w-full min-h-[40px] px-3 border border-slate-300 rounded-lg bg-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors'
const labelCls = 'text-xs font-bold text-slate-500 mb-1 flex items-baseline gap-1'

export default function UnifiedTrayDrawer({ isOpen, onClose, customers = [], plasticTypes = [] }: Props) {
  const t = useTranslations('UnifiedTray')
  const [activeSection, setActiveSection] = useState<Section>('TRAY')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [form, setForm] = useState<UnifiedTrayPayload>({
    tray_code: '',
    tray_name: '',
    customer_id: '',
    plastic_id: '',
    mold_code: '',
    cutline_x: null,
    cutline_y: null,
    cavity: 1,
    piece_count: null,
    pocket_numbers: null,
    pitch: null,
  })

  useEffect(() => {
    if (!isOpen) {
      setActiveSection('TRAY')
      setError(null)
      setSuccess(false)
      setForm({
        tray_code: '', tray_name: '', customer_id: '', plastic_id: '', mold_code: '',
        cutline_x: null, cutline_y: null, cavity: 1, piece_count: null, pocket_numbers: null, pitch: null,
      })
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!form.tray_code.trim()) { setError(t('reqTrayCode')); setActiveSection('TRAY'); return }
    if (!form.tray_name.trim()) { setError(t('reqTrayName')); setActiveSection('TRAY'); return }
    
    setIsSubmitting(true)
    setError(null)
    const result = await upsertUnifiedTray(form)
    setIsSubmitting(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => onClose(), 1200)
    } else {
      setError(result.error || t('unknownError'))
    }
  }

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isSubmitting) onClose() }
    if (isOpen) window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'TRAY', label: t('trayInfo'), icon: '📦' },
    { id: 'DESIGN', label: t('designData'), icon: '📐' },
    { id: 'PRODUCTION', label: t('productionOrder'), icon: '📋' },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[700px] bg-white shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-indigo-200 text-[10px] font-bold tracking-widest mb-0.5">
              {t('createTitle')}
            </div>
            <h2 className="text-lg font-bold">{form.tray_code || t('new')}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg">✕</button>
        </div>

        {/* Section Nav */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 border-b-2 transition-all ${
                activeSection === s.id ? 'border-indigo-600 bg-white text-indigo-700' : 'border-transparent text-slate-500 hover:bg-slate-100'
              }`}>
              <span className="text-base">{s.icon}</span>
              <span className="text-[11px] font-bold">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/80">
          {activeSection === 'TRAY' && (
            <div className="space-y-4">
              <SectionHeader title={t('trayInfoAndCustomer')} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className={labelCls}><span>{t('trayCode')}</span></label>
                  <input type="text" value={form.tray_code} onChange={e => setForm({...form, tray_code: e.target.value})} className={inputCls} disabled={isSubmitting} />
                </div>
                <div className="flex flex-col">
                  <label className={labelCls}><span>{t('productName')}</span></label>
                  <input type="text" value={form.tray_name} onChange={e => setForm({...form, tray_name: e.target.value})} className={inputCls} disabled={isSubmitting} />
                </div>
              </div>
              <div className="flex flex-col">
                <label className={labelCls}><span>{t('customer')}</span></label>
                <select value={form.customer_id || ''} onChange={e => setForm({...form, customer_id: e.target.value})} className={inputCls} disabled={isSubmitting}>
                  <option value="">{t('select')}</option>
                  {customers.map(c => <option key={c.company_id} value={c.company_id}>{c.company_name} ({c.company_code})</option>)}
                </select>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-sm text-amber-800">
                <p className="font-bold mb-1">💡 Product-Centric Workflow:</p>
                <p className="text-xs">
                  {t('productCentricNote')}
                </p>
              </div>
            </div>
          )}

          {activeSection === 'DESIGN' && (
            <div className="space-y-4">
              <SectionHeader title={t('designDataAndMold')} />
              
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-600 border-b border-slate-100 pb-2">{t('autoGenerateMold')}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className={labelCls}><span>{t('moldCode')}</span></label>
                    <input type="text" placeholder="VD: K-18052S-01" value={form.mold_code || ''} onChange={e => setForm({...form, mold_code: e.target.value})} className={inputCls} disabled={isSubmitting} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelCls}><span>{t('cavity')}</span></label>
                    <input type="number" min="1" value={form.cavity || ''} onChange={e => setForm({...form, cavity: Number(e.target.value)})} className={inputCls} disabled={isSubmitting} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-600 border-b border-slate-100 pb-2">{t('plasticMaterial')}</div>
                <div className="flex flex-col">
                  <select value={form.plastic_id || ''} onChange={e => setForm({...form, plastic_id: e.target.value})} className={inputCls} disabled={isSubmitting}>
                    <option value="">{t('selectPlastic')}</option>
                    {plasticTypes.map(p => <option key={p.material_id} value={p.material_id}>{p.material_code} ({p.material_type} - T{p.thickness_mm}xW{p.width_mm})</option>)}
                  </select>
                </div>
              </div>

            </div>
          )}

          {activeSection === 'PRODUCTION' && (
            <div className="space-y-4">
              <SectionHeader title={t('productionOrder')} />
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center h-32 text-slate-500 text-center">
                <p className="text-sm font-medium">{t('poDevNote1')}</p>
                <p className="text-xs mt-1">{t('poDevNote2')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-2">
          {error && <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">⚠️ {error}</div>}
          {success && <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-bold text-center">{t('saveSuccess')}</div>}
          
          <div className="flex gap-3">
            <button onClick={onClose} disabled={isSubmitting} className="flex-1 min-h-[44px] bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg font-bold text-sm transition-colors">
              {t('cancel')}
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting || success} className="flex-1 min-h-[44px] bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center">
               {isSubmitting ? t('processing') : success ? t('completed') : t('save')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="w-1 h-5 bg-indigo-500 rounded-full" />
      <span className="font-bold text-sm text-slate-700">{title}</span>
    </div>
  )
}
