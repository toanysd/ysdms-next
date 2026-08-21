'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Save, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const getStatusLabels = (t: any) => ({
  ACTIVE:      t('statusConfig.ACTIVE'),
  MAINTENANCE: t('statusConfig.MAINTENANCE'),
  DISPOSED:    t('statusConfig.DISPOSED'),
})

const getStorageLabels = (t: any) => ({
  IN_STOCK:     t('storageConfig.IN_STOCK'),
  IN_USE:       t('storageConfig.IN_USE'),
  OUT_OF_STOCK: t('storageConfig.OUT_OF_STOCK'),
})

export type PhysicalMoldFormData = {
  system_code: string
  display_name: string
  device_status: string
  usage_status: string
  mold_revision_id: string | null
  mold_revision_label?: string | null
  actual_length_mm: string
  actual_width_mm: string
  actual_height_mm: string
  actual_weight: string
  mold_type: string
  piece_count: string
  notes: string
}

interface MoldModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (moldId: string) => void
  editingId?: string | null
  initialData?: Partial<PhysicalMoldFormData>
}

export function MoldModal({ isOpen, onClose, onSuccess, editingId, initialData }: MoldModalProps) {
  const t = useTranslations()
  const supabase = createClient()
  const router = useRouter()
  const statusLabels = getStatusLabels(t)
  const storageLabels = getStorageLabels(t)
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formSystemCode, setFormSystemCode] = useState(initialData?.system_code || '')
  const [formDisplayName, setFormDisplayName] = useState(initialData?.display_name || '')
  const [formStatus, setFormStatus] = useState(initialData?.device_status || 'ACTIVE')
  const [formUsage, setFormUsage] = useState(initialData?.usage_status || 'IN_STOCK')
  const [formRevisionId, setFormRevisionId] = useState(initialData?.mold_revision_id || '')
  const [formRevisionLabel, setFormRevisionLabel] = useState(initialData?.mold_revision_label || '')
  const [formLength, setFormLength] = useState(initialData?.actual_length_mm || '')
  const [formWidth, setFormWidth] = useState(initialData?.actual_width_mm || '')
  const [formHeight, setFormHeight] = useState(initialData?.actual_height_mm || '')
  const [formWeight, setFormWeight] = useState(initialData?.actual_weight || '')
  const [formMoldType, setFormMoldType] = useState(initialData?.mold_type || 'M')
  const [formPieceCount, setFormPieceCount] = useState(initialData?.piece_count || '1')
  const [formNotes, setFormNotes] = useState(initialData?.notes || '')

  useEffect(() => {
    if (isOpen && editingId) {
      // Fetch existing data
      const fetchMold = async () => {
        const { data, error } = await supabase.from('physical_molds').select('*').eq('physical_mold_id', editingId).single()
        if (data) {
          setFormSystemCode(data.system_code || '')
          setFormDisplayName(data.display_name || '')
          setFormStatus(data.device_status || 'ACTIVE')
          setFormUsage(data.usage_status || 'IN_STOCK')
          setFormLength(data.actual_length_mm || '')
          setFormWidth(data.actual_width_mm || '')
          setFormHeight(data.actual_height_mm || '')
          setFormWeight(data.actual_weight || '')
          setFormMoldType(data.mold_type || 'M')
          setFormPieceCount(data.piece_count ? data.piece_count.toString() : '1')
          setFormNotes(data.notes || '')
          // optionally fetch revision label
        }
      }
      fetchMold()
    } else if (isOpen && initialData) {
      setFormSystemCode(initialData.system_code || '')
      setFormDisplayName(initialData.display_name || '')
      setFormStatus(initialData.device_status || 'ACTIVE')
      setFormUsage(initialData.usage_status || 'IN_STOCK')
      setFormLength(initialData.actual_length_mm || '')
      setFormWidth(initialData.actual_width_mm || '')
      setFormHeight(initialData.actual_height_mm || '')
      setFormWeight(initialData.actual_weight || '')
      setFormMoldType(initialData.mold_type || 'M')
      setFormPieceCount(initialData.piece_count || '1')
      setFormNotes(initialData.notes || '')
    }
  }, [isOpen, editingId, initialData, supabase])

  if (!isOpen) return null

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    if (!formSystemCode.trim()) {
      setError('システムコードは必須です。')
      setSaving(false)
      return
    }

    const payload: any = {
      system_code: formSystemCode.trim(),
      display_name: formDisplayName.trim() || formSystemCode.trim(),
      device_status: formStatus,
      usage_status: formUsage,
      actual_length_mm: formLength || null,
      actual_width_mm: formWidth || null,
      actual_height_mm: formHeight || null,
      actual_weight: formWeight || null,
      mold_type: formMoldType || null,
      piece_count: formPieceCount ? parseInt(formPieceCount) : null,
      notes: formNotes || null,
    }
    if (formRevisionId) payload.mold_revision_id = formRevisionId
    else payload.mold_revision_id = null

    if (editingId) {
      const { error: err } = await supabase
        .from('physical_molds')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('physical_mold_id', editingId)
      if (err) { setError(err.message); setSaving(false); return }
      setSaving(false)
      if (onSuccess) onSuccess(editingId)
      else router.push(`/equipment/molds/${editingId}`)
      onClose()
    } else {
      const { data, error: err } = await supabase
        .from('physical_molds')
        .insert([payload])
        .select('physical_mold_id')
        .single()
      if (err) { setError(err.message); setSaving(false); return }
      setSaving(false)
      if (onSuccess && data) onSuccess(data.physical_mold_id)
      else if (data) router.push(`/equipment/molds/${data.physical_mold_id}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg w-[640px] shadow-lg my-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-3 border-b bg-slate-50 rounded-t-lg">
          <div className="font-bold text-[13px]" style={{ fontFamily: 'var(--font-jp)' }}>
            {editingId ? t('Equipment.editMold') : t('Equipment.registerMold')}
          </div>
          <button onClick={onClose}><X size={16} className="text-slate-500" /></button>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded">{error}</div>}
          
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                {t('Equipment.systemCode')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.systemCodeHint')}</span>
              </label>
              <input value={formSystemCode} onChange={e => setFormSystemCode(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                {t('Equipment.displayName')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.displayNameHint')}</span>
              </label>
              <input value={formDisplayName} onChange={e => setFormDisplayName(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                {t('Equipment.statusLabel')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.statusHint')}</span>
              </label>
              <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }}>
                {Object.keys(statusLabels).map(k => <option key={k} value={k}>{(statusLabels as any)[k]}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                {t('Equipment.storage')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.storageHint')}</span>
              </label>
              <select value={formUsage} onChange={e => setFormUsage(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }}>
                {Object.keys(storageLabels).map(k => <option key={k} value={k}>{(storageLabels as any)[k]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
              {t('Equipment.revisionLink')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.revisionLinkHint')}</span>
            </label>
            {formRevisionId ? (
              <div className="flex items-center gap-2">
                <span className="form-input w-full flex items-center" style={{ fontSize: 11, background: 'var(--bg-surface-2)' }}>
                  <CheckCircle2 size={12} className="mr-1" style={{ color: 'var(--status-success)' }} />
                  {formRevisionLabel || formRevisionId}
                </span>
                <button onClick={() => { setFormRevisionId(''); setFormRevisionLabel('') }} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 p-2 border rounded bg-slate-50" style={{ fontFamily: 'var(--font-jp)' }}>
                {t('Equipment.unlinked')}
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', margin: '4px 0' }} />

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
              {t('Equipment.dimensionsAndWeight')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.dimensionsAndWeightHint')}</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">{t('Equipment.lengthL')}</label>
                <input type="text" value={formLength} onChange={e => setFormLength(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">{t('Equipment.widthW')}</label>
                <input type="text" value={formWidth} onChange={e => setFormWidth(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">{t('Equipment.heightH')}</label>
                <input type="text" value={formHeight} onChange={e => setFormHeight(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">{t('Equipment.weight')}</label>
                <input type="text" value={formWeight} onChange={e => setFormWeight(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                {t('Equipment.moldType')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.moldTypeHint')}</span>
              </label>
              <select value={formMoldType} onChange={e => setFormMoldType(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }}>
                <option value="">—</option>
                <option value="M">M (金型)</option>
                <option value="C">C (抜型)</option>
                <option value="P">P (プラグ)</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                {t('Equipment.pieceCount')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.pieceCountHint')}</span>
              </label>
              <input type="number" value={formPieceCount} onChange={e => setFormPieceCount(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="1" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
              {t('Equipment.notes')} <span className="font-normal text-[9px] text-slate-400">{t('Equipment.notesHint')}</span>
            </label>
            <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} className="form-textarea w-full" style={{ fontSize: 12, minHeight: 50 }} />
          </div>
        </div>

        <div className="flex justify-between items-center p-3 border-t bg-slate-50 rounded-b-lg">
          <div>
            {editingId && (
              <Link
                href={`/equipment/molds/${editingId}`}
                className="text-[10px] font-bold"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                → {t('Equipment.openHubView')}
              </Link>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-secondary" style={{ height: 32, fontSize: 12, padding: '0 14px' }}>
              <span style={{ fontFamily: 'var(--font-jp)' }}>{t('Common.cancel')}</span>
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ height: 32, fontSize: 12, padding: '0 14px' }}>
              <Save size={14} /> <span style={{ fontFamily: 'var(--font-jp)' }}>{saving ? t('Common.saving') : t('Common.save')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
