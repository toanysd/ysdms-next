'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Layers, Copy, Sparkles, Loader2, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createDesignRevisionAction, type CreateDesignRevisionInput } from '@/app/actions/engineering'

export type SourceRevision = {
  revision_id: string
  design_code: string
  revision_number: number | null
  status: string | null
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  cutline_length?: number | null
  cutline_width?: number | null
  cavity_count?: number | null
  pocket_numbers?: number | null
  pitch_mm?: number | null
  cavity_pitch_mm?: number | null
  machine_feed_pitch_mm?: number | null
  corner_r?: string | null
  chamfer_c?: string | null
  draft_angle?: string | null
  undercut_spec?: string | null
  under_depth?: string | null
  orientation?: string | null
  setup_type?: string | null
  has_plug?: boolean | null
  plug_type?: string | null
  has_separate_cutter?: boolean | null
  plastic_type_designed?: string | null
  customer_drawing_no?: string | null
  designer?: string | null
}

export function CreateDesignRevisionModal({
  productId,
  productCode,
  companyId,
  existingRevisions,
  isOpen,
  onClose,
  onSuccess,
}: {
  productId: string
  productCode: string
  companyId?: string | null
  existingRevisions: SourceRevision[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const tCommon = useTranslations('Common')

  const sortedRevisions = useMemo(() => {
    return [...existingRevisions].sort((a, b) => (b.revision_number || 0) - (a.revision_number || 0))
  }, [existingRevisions])

  const nextRevisionNumber = useMemo(() => {
    if (sortedRevisions.length === 0) return 1
    return (sortedRevisions[0].revision_number || 0) + 1
  }, [sortedRevisions])

  const [selectedSourceId, setSelectedSourceId] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<CreateDesignRevisionInput>({
    product_id: productId,
    company_id: companyId,
    design_code: `${productCode}-R${String(nextRevisionNumber).padStart(2, '0')}`,
    revision_number: nextRevisionNumber,
    status: 'DRAFT',
    change_summary: '',
    design_length: null,
    design_width: null,
    design_height: null,
    design_depth: null,
    cutline_length: null,
    cutline_width: null,
    cavity_count: null,
    pocket_numbers: null,
    pitch_mm: null,
    has_plug: false,
    plug_type: null,
    has_separate_cutter: false,
    plastic_type_designed: null,
    customer_drawing_no: null,
    designer: '',
  })

  // When source revision changes or modal opens, smart clone fields
  useEffect(() => {
    if (!isOpen) return
    const defaultSource = sortedRevisions.find(r => r.status === 'APPROVED' || r.status === 'RELEASED') || sortedRevisions[0]
    const sourceId = selectedSourceId || defaultSource?.revision_id || ''
    if (sourceId) {
      setSelectedSourceId(sourceId)
      const source = sortedRevisions.find(r => r.revision_id === sourceId)
      if (source) {
        setFormData(prev => ({
          ...prev,
          product_id: productId,
          company_id: companyId,
          design_code: `${productCode}-R${String(nextRevisionNumber).padStart(2, '0')}`,
          revision_number: nextRevisionNumber,
          status: 'DRAFT',
          design_length: source.design_length ?? null,
          design_width: source.design_width ?? null,
          design_height: source.design_height ?? null,
          design_depth: source.design_depth ?? null,
          cutline_length: source.cutline_length ?? null,
          cutline_width: source.cutline_width ?? null,
          cavity_count: source.cavity_count ?? null,
          pocket_numbers: source.pocket_numbers ?? null,
          pitch_mm: source.pitch_mm ?? source.cavity_pitch_mm ?? null,
          corner_r: source.corner_r ?? null,
          chamfer_c: source.chamfer_c ?? null,
          draft_angle: source.draft_angle ?? null,
          undercut_spec: source.undercut_spec ?? null,
          under_depth: source.under_depth ?? null,
          orientation: source.orientation ?? null,
          setup_type: source.setup_type ?? null,
          has_plug: source.has_plug ?? false,
          plug_type: source.plug_type ?? null,
          has_separate_cutter: source.has_separate_cutter ?? false,
          plastic_type_designed: source.plastic_type_designed ?? null,
          customer_drawing_no: source.customer_drawing_no ?? null,
          designer: source.designer ?? '',
        }))
      }
    }
  }, [isOpen, selectedSourceId, sortedRevisions, productId, productCode, companyId, nextRevisionNumber])

  if (!isOpen) return null

  const handleSourceChange = (sourceId: string) => {
    setSelectedSourceId(sourceId)
    const source = sortedRevisions.find(r => r.revision_id === sourceId)
    if (source) {
      setFormData(prev => ({
        ...prev,
        design_length: source.design_length ?? null,
        design_width: source.design_width ?? null,
        design_height: source.design_height ?? null,
        design_depth: source.design_depth ?? null,
        cutline_length: source.cutline_length ?? null,
        cutline_width: source.cutline_width ?? null,
        cavity_count: source.cavity_count ?? null,
        pocket_numbers: source.pocket_numbers ?? null,
        pitch_mm: source.pitch_mm ?? source.cavity_pitch_mm ?? null,
        corner_r: source.corner_r ?? null,
        chamfer_c: source.chamfer_c ?? null,
        draft_angle: source.draft_angle ?? null,
        undercut_spec: source.undercut_spec ?? null,
        under_depth: source.under_depth ?? null,
        orientation: source.orientation ?? null,
        setup_type: source.setup_type ?? null,
        has_plug: source.has_plug ?? false,
        plug_type: source.plug_type ?? null,
        has_separate_cutter: source.has_separate_cutter ?? false,
        plastic_type_designed: source.plastic_type_designed ?? null,
        customer_drawing_no: source.customer_drawing_no ?? null,
        designer: source.designer ?? '',
      }))
    }
  }

  const handleSave = async () => {
    if (!formData.design_code.trim()) {
      setError('設計コードは必須です / Design code is required')
      return
    }
    if (!formData.change_summary?.trim()) {
      setError('改訂概要・変更内容は必須です / Tóm tắt thay đổi là bắt buộc')
      return
    }

    setSaving(true)
    setError(null)
    try {
      await createDesignRevisionAction(formData)
      setSaving(false)
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error saving design revision')
      setSaving(false)
    }
  }

  const selectedSourceRev = sortedRevisions.find(r => r.revision_id === selectedSourceId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card-flat w-full max-w-2xl max-h-[90vh] flex flex-col bg-[var(--bg-surface)] overflow-hidden shadow-xl border border-[var(--border-default)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={18} />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-jp)' }}>
              新規設計リビジョン作成 (Smart Clone)
            </h3>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-[12px] rounded border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Smart Clone Source Selector Banner */}
          {sortedRevisions.length > 0 && (
            <div className="p-3 rounded bg-[var(--tint-teal-bg)] border border-[var(--accent)] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--accent)] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-jp)' }}>
                  <Copy size={13} /> 元にするリビジョン (Copy Source):
                </span>
                <select
                  value={selectedSourceId}
                  onChange={e => handleSourceChange(e.target.value)}
                  className="form-input text-[12px] font-bold font-mono px-2 py-1"
                >
                  {sortedRevisions.map(r => (
                    <option key={r.revision_id} value={r.revision_id}>
                      {r.design_code} (Rev {r.revision_number}) — {r.status || 'DRAFT'}
                    </option>
                  ))}
                </select>
              </div>
              {selectedSourceRev && (
                <div className="text-[11px] text-[var(--text-secondary)] font-jp">
                  ✨ Rev {selectedSourceRev.revision_number} ({selectedSourceRev.design_code}) のすべての技術パラメータがフォームに自動コピーされました。
                </div>
              )}
            </div>
          )}

          {/* Main Revision Info */}
          <div className="form-grid-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                設計コード <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.design_code}
                onChange={e => setFormData(f => ({ ...f, design_code: e.target.value.toUpperCase() }))}
                className="form-input w-full font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
                リビジョン番号 (Rev Number)
              </label>
              <input
                type="number"
                value={formData.revision_number}
                onChange={e => setFormData(f => ({ ...f, revision_number: Number(e.target.value) }))}
                className="form-input w-full font-mono"
              />
            </div>
          </div>

          {/* Required Change Summary */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1" style={{ fontFamily: 'var(--font-jp)' }}>
              改訂概要・変更内容 (Change Summary) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.change_summary || ''}
              onChange={e => setFormData(f => ({ ...f, change_summary: e.target.value }))}
              placeholder="例: ポケット寸法を0.2mm拡大、プラグ仕様を変更..."
              rows={2}
              className="form-textarea w-full"
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

          {/* Mold Dimensions */}
          <p className="text-[12px] font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-jp)' }}>
            金型外形寸法 (Mold Dimensions)
          </p>
          <div className="form-grid-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Length (L mm)</label>
              <input
                type="number"
                value={formData.design_length ?? ''}
                onChange={e => setFormData(f => ({ ...f, design_length: e.target.value ? Number(e.target.value) : null }))}
                className="form-input w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Width (W mm)</label>
              <input
                type="number"
                value={formData.design_width ?? ''}
                onChange={e => setFormData(f => ({ ...f, design_width: e.target.value ? Number(e.target.value) : null }))}
                className="form-input w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Height (H mm)</label>
              <input
                type="number"
                value={formData.design_height ?? ''}
                onChange={e => setFormData(f => ({ ...f, design_height: e.target.value ? Number(e.target.value) : null }))}
                className="form-input w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Depth (D mm)</label>
              <input
                type="number"
                value={formData.design_depth ?? ''}
                onChange={e => setFormData(f => ({ ...f, design_depth: e.target.value ? Number(e.target.value) : null }))}
                className="form-input w-full font-mono"
              />
            </div>
          </div>

          {/* Cutline & Cavity */}
          <div className="form-grid-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Cutline L (mm)</label>
              <input
                type="number"
                value={formData.cutline_length ?? ''}
                onChange={e => setFormData(f => ({ ...f, cutline_length: e.target.value ? Number(e.target.value) : null }))}
                className="form-input w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Cutline W (mm)</label>
              <input
                type="number"
                value={formData.cutline_width ?? ''}
                onChange={e => setFormData(f => ({ ...f, cutline_width: e.target.value ? Number(e.target.value) : null }))}
                className="form-input w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Cavity Count (面取数)</label>
              <input
                type="number"
                value={formData.cavity_count ?? ''}
                onChange={e => setFormData(f => ({ ...f, cavity_count: e.target.value ? Number(e.target.value) : null }))}
                className="form-input w-full font-mono"
              />
            </div>
          </div>

          {/* Structure & Auxiliary */}
          <div className="form-grid-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Plug Assist (プラグ)</label>
              <select
                value={formData.has_plug ? 'YES' : 'NO'}
                onChange={e => setFormData(f => ({ ...f, has_plug: e.target.value === 'YES' }))}
                className="form-input w-full"
              >
                <option value="NO">なし (NONE)</option>
                <option value="YES">あり (REQUIRED)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Separate Cutter (別抜き)</label>
              <select
                value={formData.has_separate_cutter ? 'YES' : 'NO'}
                onChange={e => setFormData(f => ({ ...f, has_separate_cutter: e.target.value === 'YES' }))}
                className="form-input w-full"
              >
                <option value="NO">なし (NO)</option>
                <option value="YES">あり (YES)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">設計担当者 (Designer)</label>
              <input
                type="text"
                value={formData.designer || ''}
                onChange={e => setFormData(f => ({ ...f, designer: e.target.value || null }))}
                className="form-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
            {tCommon('cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={15} className="mr-1" />}
            {tCommon('save')}
          </button>
        </div>
      </div>
    </div>
  )
}
