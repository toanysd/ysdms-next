'use client'

import React, { useState } from 'react'
import { X, Layers } from 'lucide-react'
import { createSampleRequestAction, type SampleType } from '@/app/actions/sample-requests'

interface CreateSampleRequestModalProps {
  isOpen: boolean
  productId: string
  designRevisions: Array<{ revision_id: string; design_code: string | null }>
  onClose: () => void
  onSuccess: () => void
}

export const CreateSampleRequestModal: React.FC<CreateSampleRequestModalProps> = ({
  isOpen,
  productId,
  designRevisions,
  onClose,
  onSuccess,
}) => {
  const [selectedRevId, setSelectedRevId] = useState('')
  const [sampleType, setSampleType] = useState<SampleType>('POCKET_TEST')
  const [requestedQty, setRequestedQty] = useState(2)
  const [targetDate, setTargetDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await createSampleRequestAction({
        product_id: productId,
        design_revision_id: selectedRevId || undefined,
        sample_type: sampleType,
        requested_qty: Number(requestedQty) || 1,
        target_date: targetDate || undefined,
        notes: notes,
      })

      if (!res.success) {
        throw new Error(res.error)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo yêu cầu mẫu thử')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{
        background: 'var(--bg-surface, #ffffff)',
        borderRadius: 8, width: '100%', maxWidth: 460,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface-2, #f8fafc)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} style={{ color: 'var(--tint-orange-text)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              試作・サンプル手配作成 (Yêu cầu Mẫu thử Pocket / Khay)
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {error && (
            <div style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 4, color: '#DC2626', fontSize: 12 }}>
              {error}
            </div>
          )}

          {/* Sample Type */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              試作種類 (Loại mẫu thử)
            </label>
            <select
              className="form-input"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value as SampleType)}
              style={{ width: '100%', height: 32, fontSize: 12 }}
            >
              <option value="POCKET_TEST">🧪 試作ポケット成形 (Pocket Test)</option>
              <option value="FULL_TRAY_SAMPLE">📦 フルサイズサンプル (Full Tray Sample)</option>
              <option value="VACUUM_SAMPLE">💨 真空成形サンプル (Vacuum Sample)</option>
            </select>
          </div>

          {/* Revision Link */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              関連設計リビジョン (Revision bản vẽ liên quan)
            </label>
            <select
              className="form-input"
              value={selectedRevId}
              onChange={(e) => setSelectedRevId(e.target.value)}
              style={{ width: '100%', height: 32, fontSize: 12 }}
            >
              <option value="">-- 自動判定 / 選択なし --</option>
              {designRevisions.map((rev) => (
                <option key={rev.revision_id} value={rev.revision_id}>
                  {rev.design_code || 'Unnamed Revision'}
                </option>
              ))}
            </select>
          </div>

          {/* Qty & Target Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                要求数量 (Số lượng pcs) <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={requestedQty}
                onChange={(e) => setRequestedQty(Number(e.target.value))}
                style={{ width: '100%', height: 32, fontSize: 12 }}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                希望完成・送付日 (Hạn hoàn thành/gửi)
              </label>
              <input
                type="date"
                className="form-input"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ width: '100%', height: 32, fontSize: 12 }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              手配要領・備考 (Ghi chú yêu cầu)
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例: 客先治具での装着確認用。2枚成形して測定確認の上発送。"
              style={{ width: '100%', fontSize: 12 }}
            />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 30, padding: '0 16px', fontSize: 12 }}>
              {loading ? '作成中...' : '手配登録 (Tạo yêu cầu)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
