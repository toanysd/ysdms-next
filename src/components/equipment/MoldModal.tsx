'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Save, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STATUS_LABELS: Record<string, { ja: string; vi: string; color: string }> = {
  ACTIVE:      { ja: '使用中',    vi: 'Đang dùng',  color: 'var(--status-success)' },
  MAINTENANCE: { ja: 'メンテ中',  vi: 'Bảo trì',    color: 'var(--status-warning)' },
  DISPOSED:    { ja: '廃棄済',    vi: 'Đã huỷ',     color: 'var(--status-error)' },
}

const STORAGE_LABELS: Record<string, { ja: string; vi: string; color: string }> = {
  IN_STOCK:     { ja: '在庫',   vi: 'Có hàng',   color: 'var(--status-success)' },
  IN_USE:       { ja: '使用中', vi: 'Đang dùng', color: 'var(--status-info)' },
  OUT_OF_STOCK: { ja: '出庫済', vi: 'Đã xuất',   color: 'var(--text-muted)' },
}

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
  const supabase = createClient()
  const router = useRouter()
  
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
          setFormRevisionId(data.mold_revision_id || '')
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
      setFormRevisionId(initialData.mold_revision_id || '')
      setFormRevisionLabel(initialData.mold_revision_label || '')
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
            {editingId ? '金型編集 / Chỉnh sửa Khuôn' : '金型登録 / Đăng ký Khuôn'}
          </div>
          <button onClick={onClose}><X size={16} className="text-slate-500" /></button>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded">{error}</div>}
          
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                システムコード <span className="font-normal text-[9px] text-slate-400">System Code</span>
              </label>
              <input value={formSystemCode} onChange={e => setFormSystemCode(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                名称 <span className="font-normal text-[9px] text-slate-400">Display Name</span>
              </label>
              <input value={formDisplayName} onChange={e => setFormDisplayName(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                状態 <span className="font-normal text-[9px] text-slate-400">Trạng thái</span>
              </label>
              <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }}>
                {Object.keys(STATUS_LABELS).map(k => <option key={k} value={k}>{STATUS_LABELS[k].ja}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                保管 <span className="font-normal text-[9px] text-slate-400">Kho</span>
              </label>
              <select value={formUsage} onChange={e => setFormUsage(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }}>
                {Object.keys(STORAGE_LABELS).map(k => <option key={k} value={k}>{STORAGE_LABELS[k].ja}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
              版リンク <span className="font-normal text-[9px] text-slate-400">Phiên bản thiết kế liên kết</span>
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
                未リンク — 設計版ページからリンク可能 / Chưa liên kết — có thể liên kết từ trang thiết kế
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', margin: '4px 0' }} />

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
              寸法・重量 <span className="font-normal text-[9px] text-slate-400">Kích thước & Khối lượng</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">長さ L (mm)</label>
                <input type="text" value={formLength} onChange={e => setFormLength(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">幅 W (mm)</label>
                <input type="text" value={formWidth} onChange={e => setFormWidth(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">高さ H (mm)</label>
                <input type="text" value={formHeight} onChange={e => setFormHeight(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-slate-400 mb-0.5">重量 (kg)</label>
                <input type="text" value={formWeight} onChange={e => setFormWeight(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="—" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                金型タイプ <span className="font-normal text-[9px] text-slate-400">Loại khuôn</span>
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
                ピース数 <span className="font-normal text-[9px] text-slate-400">Số miếng</span>
              </label>
              <input type="number" value={formPieceCount} onChange={e => setFormPieceCount(e.target.value)} className="form-input w-full" style={{ fontSize: 12 }} placeholder="1" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
              備考 <span className="font-normal text-[9px] text-slate-400">Ghi chú</span>
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
                → 詳細ページへ / Mở Hub View
              </Link>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-secondary" style={{ height: 32, fontSize: 12, padding: '0 14px' }}>
              <span style={{ fontFamily: 'var(--font-jp)' }}>キャンセル</span>
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ height: 32, fontSize: 12, padding: '0 14px' }}>
              <Save size={14} /> <span style={{ fontFamily: 'var(--font-jp)' }}>{saving ? '保存中...' : '保存する'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
