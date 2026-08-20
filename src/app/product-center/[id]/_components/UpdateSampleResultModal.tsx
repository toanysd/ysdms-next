'use client'

import React, { useState } from 'react'
import { X, CheckCircle, AlertTriangle } from 'lucide-react'
import { updateSampleStatusAction, type SampleRequest, type SampleResultStatus } from '@/app/actions/sample-requests'

interface UpdateSampleResultModalProps {
  isOpen: boolean
  sampleRequest: SampleRequest | null
  productId: string
  onClose: () => void
  onSuccess: () => void
}

export const UpdateSampleResultModal: React.FC<UpdateSampleResultModalProps> = ({
  isOpen,
  sampleRequest,
  productId,
  onClose,
  onSuccess,
}) => {
  const [resultStatus, setResultStatus] = useState<SampleResultStatus>(sampleRequest?.result_status || 'CUSTOMER_OK')
  const [ngReason, setNgReason] = useState(sampleRequest?.ng_reason || '')
  const [notes, setNotes] = useState(sampleRequest?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !sampleRequest) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (resultStatus === 'CUSTOMER_NG' && !ngReason.trim()) {
      setError('客先不合格 (NG) の場合はNG理由を必ず入力してください (Bắt buộc nhập lý do khi báo NG).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await updateSampleStatusAction({
        request_id: sampleRequest.request_id,
        product_id: productId,
        result_status: resultStatus,
        ng_reason: ngReason.trim(),
        notes: notes,
      })

      if (!res.success) {
        throw new Error(res.error)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật kết quả mẫu thử')
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
            <CheckCircle size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              試作結果更新 (Cập nhật Kết quả Mẫu thử)
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

          {/* Status Selection */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              進捗・判定状態 (Trạng thái / Kết quả) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              className="form-input"
              value={resultStatus}
              onChange={(e) => setResultStatus(e.target.value as SampleResultStatus)}
              style={{ width: '100%', height: 32, fontSize: 12, fontWeight: 700 }}
            >
              <option value="IN_MAKING">⚙️ 試作中 (Đang gia công/thử nghiệm)</option>
              <option value="SENT_TO_CUSTOMER">🚚 客先送付済 (Đã gửi cho khách hàng)</option>
              <option value="CUSTOMER_OK" style={{ color: '#10B981' }}>✓ 客先合格・本型承認 (CUSTOMER_OK - Đạt)</option>
              <option value="CUSTOMER_NG" style={{ color: '#EF4444' }}>✕ 客先不合格・修正要 (CUSTOMER_NG - Không đạt)</option>
              <option value="REQUESTED">📝 依頼済 (Chờ xử lý)</option>
            </select>
          </div>

          {/* NG Reason (Conditional) */}
          {resultStatus === 'CUSTOMER_NG' && (
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, color: '#DC2626' }}>
                NG理由・客先指摘事項 (Lý do không đạt / Yêu cầu sửa đổi) <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                value={ngReason}
                onChange={(e) => setNgReason(e.target.value)}
                placeholder="例: ポケット深さが0.3mm浅く、パーツが干渉するためCAD修正が必要。"
                style={{ width: '100%', fontSize: 12, borderColor: '#FCA5A5' }}
                required
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              備考・連絡事項 (Ghi chú)
            </label>
            <textarea
              className="form-textarea"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="社内連絡メモ..."
              style={{ width: '100%', fontSize: 12 }}
            />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 30, padding: '0 16px', fontSize: 12 }}>
              {loading ? '更新中...' : '結果を保存 (Cập nhật)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
