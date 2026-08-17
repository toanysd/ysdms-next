'use client'

import React, { useState, useEffect } from 'react'
import { X, Layers, Save, Loader2, PenTool, AlertCircle, Sparkles, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateDesignRevisionAction } from '@/app/actions/engineering'
import { lookupCavType } from '@/lib/utils/moldNaming'

export type EditDesignRevisionData = {
  revision_id: string
  product_id?: string | null
  design_code: string
  revision_number?: number | null
  status?: string | null
  design_date?: string | null
  designer?: string | null
  change_summary?: string | null
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  cutline_length?: number | null
  cutline_width?: number | null
  cavity_count?: number | null
  pocket_numbers?: number | null
  cavity_pitch_mm?: number | null
  machine_feed_pitch_mm?: number | null
  corner_r?: string | null
  chamfer_c?: string | null
  draft_angle?: string | null
  undercut_spec?: string | null
  under_depth?: string | null
  orientation?: string | null
  setup_type?: string | null
  plug_type?: string | null
  has_separate_cutter?: boolean | null
  plastic_type_designed?: string | null
  plastic_id?: string | null
  tolerance_pitch?: string | null
  customer_drawing_no?: string | null
  customer_tray_name?: string | null
}

interface EditDesignRevisionModalProps {
  isOpen: boolean
  revision: EditDesignRevisionData | null
  onClose: () => void
  onSuccess?: () => void
}

export function EditDesignRevisionModal({
  isOpen,
  revision,
  onClose,
  onSuccess
}: EditDesignRevisionModalProps) {
  const tCommon = useTranslations('Common')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    design_code: string
    revision_number: string
    status: string
    design_date: string
    designer: string
    change_summary: string
    design_length: string
    design_width: string
    design_height: string
    design_depth: string
    cutline_length: string
    cutline_width: string
    cavity_count: string
    cavity_pitch_mm: string
    machine_feed_pitch_mm: string
    corner_r: string
    chamfer_c: string
    draft_angle: string
    plug_type: string
    has_separate_cutter: boolean
    plastic_type_designed: string
    tolerance_pitch: string
    customer_drawing_no: string
  }>({
    design_code: '',
    revision_number: '0',
    status: 'APPROVED',
    design_date: '',
    designer: '',
    change_summary: '',
    design_length: '',
    design_width: '',
    design_height: '',
    design_depth: '',
    cutline_length: '',
    cutline_width: '',
    cavity_count: '',
    cavity_pitch_mm: '',
    machine_feed_pitch_mm: '',
    corner_r: '',
    chamfer_c: '',
    draft_angle: '',
    plug_type: 'NONE',
    has_separate_cutter: false,
    plastic_type_designed: '',
    tolerance_pitch: '',
    customer_drawing_no: ''
  })

  useEffect(() => {
    if (!isOpen || !revision) return
    setError(null)
    setFormData({
      design_code: revision.design_code || '',
      revision_number: revision.revision_number != null ? String(revision.revision_number) : '0',
      status: revision.status || 'APPROVED',
      design_date: revision.design_date || '',
      designer: revision.designer || '',
      change_summary: revision.change_summary || '',
      design_length: revision.design_length != null ? String(revision.design_length) : '',
      design_width: revision.design_width != null ? String(revision.design_width) : '',
      design_height: revision.design_height != null ? String(revision.design_height) : '',
      design_depth: revision.design_depth != null ? String(revision.design_depth) : '',
      cutline_length: revision.cutline_length != null ? String(revision.cutline_length) : '',
      cutline_width: revision.cutline_width != null ? String(revision.cutline_width) : '',
      cavity_count: revision.cavity_count != null ? String(revision.cavity_count) : '',
      cavity_pitch_mm: revision.cavity_pitch_mm != null ? String(revision.cavity_pitch_mm) : '',
      machine_feed_pitch_mm: revision.machine_feed_pitch_mm != null ? String(revision.machine_feed_pitch_mm) : '',
      corner_r: revision.corner_r || '',
      chamfer_c: revision.chamfer_c || '',
      draft_angle: revision.draft_angle || '',
      plug_type: revision.plug_type || 'NONE',
      has_separate_cutter: Boolean(revision.has_separate_cutter),
      plastic_type_designed: revision.plastic_type_designed || '',
      tolerance_pitch: revision.tolerance_pitch || '',
      customer_drawing_no: revision.customer_drawing_no || ''
    })
  }, [isOpen, revision])

  const cavInfo = React.useMemo(() => {
    if (!formData.design_length || !formData.design_width) return null
    return lookupCavType(formData.design_length, formData.design_width)
  }, [formData.design_length, formData.design_width])

  if (!isOpen || !revision) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.design_code.trim()) {
      setError('設計コードは必須です (Design Code is required)')
      return
    }

    setLoading(true)
    setError(null)

    const revNumParsed = parseInt(formData.revision_number, 10)
    const revNumFinal = !isNaN(revNumParsed) && revNumParsed >= 0 ? revNumParsed : 0

    try {
      await updateDesignRevisionAction({
        revision_id: revision.revision_id,
        product_id: revision.product_id,
        design_code: formData.design_code.trim(),
        revision_number: revNumFinal,
        status: formData.status,
        design_date: formData.design_date || null,
        designer: formData.designer || null,
        change_summary: formData.change_summary || null,
        design_length: formData.design_length ? parseFloat(formData.design_length) : null,
        design_width: formData.design_width ? parseFloat(formData.design_width) : null,
        design_height: formData.design_height ? parseFloat(formData.design_height) : null,
        design_depth: formData.design_depth ? parseFloat(formData.design_depth) : null,
        cutline_length: formData.cutline_length ? parseFloat(formData.cutline_length) : null,
        cutline_width: formData.cutline_width ? parseFloat(formData.cutline_width) : null,
        cavity_count: formData.cavity_count ? parseInt(formData.cavity_count, 10) : null,
        cavity_pitch_mm: formData.cavity_pitch_mm ? parseFloat(formData.cavity_pitch_mm) : null,
        machine_feed_pitch_mm: formData.machine_feed_pitch_mm ? parseFloat(formData.machine_feed_pitch_mm) : null,
        corner_r: formData.corner_r || null,
        chamfer_c: formData.chamfer_c || null,
        draft_angle: formData.draft_angle || null,
        plug_type: formData.plug_type,
        has_separate_cutter: formData.has_separate_cutter,
        plastic_type_designed: formData.plastic_type_designed || null,
        tolerance_pitch: formData.tolerance_pitch || null,
        customer_drawing_no: formData.customer_drawing_no || null
      })

      onClose()
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || '設計情報の更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: 760,
          maxHeight: '90vh',
          background: 'var(--bg-surface)',
          borderRadius: 10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-teal-bg, var(--bg-surface-2))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PenTool size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                CAD設計リビジョン編集 (Chỉnh sửa Thiết kế)
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {revision.design_code} (Rev.{revision.revision_number ?? 0})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '10px 16px',
              background: 'var(--tint-error-bg, #fee2e2)',
              color: 'var(--status-error, #b91c1c)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid var(--border-default)'
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Group 1: General Info */}
            <div className="card-flat" style={{ padding: 12, background: 'var(--bg-surface-2)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', display: 'block', marginBottom: 8 }}>
                1. 基本情報 (General Info)
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1.2fr', gap: 10 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    設計コード (Design Code) *
                  </label>
                  <input
                    type="text"
                    value={formData.design_code}
                    onChange={(e) => setFormData({ ...formData, design_code: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace', fontWeight: 700 }}
                    placeholder="例: TOW-004 または TOW-004-R1"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }} title="0 = 初版 (R0), 1 = R1, 2 = R2...">
                    版数 (Rev No)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.revision_number}
                    onChange={(e) => setFormData({ ...formData, revision_number: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    0=初版, 1=R1...
                  </span>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    ステータス (Status)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-input"
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    <option value="DRAFT">🟡 DRAFT (下書き)</option>
                    <option value="APPROVED">🟢 APPROVED (承認済)</option>
                    <option value="SUPERSEDED">⚪ SUPERSEDED (旧版)</option>
                    <option value="REJECTED">🔴 REJECTED (不採用)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    設計日 (Design Date)
                  </label>
                  <input
                    type="date"
                    value={formData.design_date}
                    onChange={(e) => setFormData({ ...formData, design_date: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>

            {/* Group 2: Cutline & Cycle Specs */}
            <div className="card-flat" style={{ padding: 12, background: 'var(--bg-surface-2)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', display: 'block', marginBottom: 8 }}>
                2. 抜寸法・成形仕様 (Cutline & Cycle Specs - SSOT)
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    抜寸法 長 (Cutline L mm)
                  </label>
                  <input
                    type="number"
                    value={formData.cutline_length}
                    onChange={(e) => setFormData({ ...formData, cutline_length: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    抜寸法 幅 (Cutline W mm)
                  </label>
                  <input
                    type="number"
                    value={formData.cutline_width}
                    onChange={(e) => setFormData({ ...formData, cutline_width: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    取数 (Pieces/cycle — 取数)
                  </label>
                  <input
                    type="number"
                    value={formData.cavity_count}
                    onChange={(e) => setFormData({ ...formData, cavity_count: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    絞り深さ (Depth mm)
                  </label>
                  <input
                    type="number"
                    value={formData.design_depth}
                    onChange={(e) => setFormData({ ...formData, design_depth: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* Profiles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    コーナーR
                  </label>
                  <input
                    type="text"
                    value={formData.corner_r}
                    onChange={(e) => setFormData({ ...formData, corner_r: e.target.value })}
                    className="form-input"
                    placeholder="R5"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    面取りC
                  </label>
                  <input
                    type="text"
                    value={formData.chamfer_c}
                    onChange={(e) => setFormData({ ...formData, chamfer_c: e.target.value })}
                    className="form-input"
                    placeholder="C2"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    抜き勾配 (Draft Angle)
                  </label>
                  <input
                    type="text"
                    value={formData.draft_angle}
                    onChange={(e) => setFormData({ ...formData, draft_angle: e.target.value })}
                    className="form-input"
                    placeholder="3°"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    別抜き (Separate Cutter)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer', height: 32 }}>
                    <input
                      type="checkbox"
                      checked={formData.has_separate_cutter}
                      onChange={(e) => setFormData({ ...formData, has_separate_cutter: e.target.checked })}
                    />
                    <span>別抜き有 (SEPARATE)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Group 3: Mold Dimensions & Material */}
            <div className="card-flat" style={{ padding: 12, background: 'var(--bg-surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
                  3. 金型外形寸法・材料 (Mold Dimensions & Material)
                </span>
                {cavInfo && (
                  <span className="badge badge--info" style={{ fontSize: 10, fontFamily: 'monospace' }}>
                    CAV: {cavInfo.code} ({cavInfo.length}×{cavInfo.width}mm)
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    型寸法 長 (Mold L mm)
                  </label>
                  <input
                    type="number"
                    value={formData.design_length}
                    onChange={(e) => setFormData({ ...formData, design_length: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    型寸法 幅 (Mold W mm)
                  </label>
                  <input
                    type="number"
                    value={formData.design_width}
                    onChange={(e) => setFormData({ ...formData, design_width: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    型寸法 高 (Mold H mm)
                  </label>
                  <input
                    type="number"
                    value={formData.design_height}
                    onChange={(e) => setFormData({ ...formData, design_height: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    設計材質 (Plastic Material - SSOT)
                  </label>
                  <input
                    type="text"
                    value={formData.plastic_type_designed}
                    onChange={(e) => setFormData({ ...formData, plastic_type_designed: e.target.value })}
                    className="form-input"
                    style={{ fontFamily: 'monospace', fontSize: 12 }}
                    placeholder="例: PP ナチュラル 0.8mm [640] 帯電防止付 シリコン無"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                    寸法公差 (Tolerance)
                  </label>
                  <input
                    type="text"
                    value={formData.tolerance_pitch}
                    onChange={(e) => setFormData({ ...formData, tolerance_pitch: e.target.value })}
                    className="form-input"
                    placeholder="X 321 (±1.0), Y 254 (±1.0)"
                  />
                </div>
              </div>
            </div>

            {/* Group 4: Notes & Summary */}
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                変更履歴・設計メモ (Change Summary / Notes)
              </label>
              <textarea
                value={formData.change_summary}
                onChange={(e) => setFormData({ ...formData, change_summary: e.target.value })}
                className="form-textarea"
                rows={2}
                placeholder="変更内容や特記事項を入力..."
                style={{ fontSize: 12 }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
              padding: '12px 20px',
              borderTop: '1px solid var(--border-default)',
              background: 'var(--bg-surface-2)'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: 12 }}
            >
              {tCommon('cancel')}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ fontSize: 12, padding: '6px 18px', gap: 6 }}
            >
              {loading ? (
                <React.Fragment>
                  <Loader2 size={14} className="animate-spin" />
                  <span>更新中...</span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Save size={14} />
                  <span>設計情報を保存</span>
                </React.Fragment>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
