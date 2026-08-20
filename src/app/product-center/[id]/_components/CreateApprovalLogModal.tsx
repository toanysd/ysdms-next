'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertTriangle, FileCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { submitDesignApprovalLogAction, type ApprovalStage, type ApprovalStatus } from '@/app/actions/design-approval'

interface CreateApprovalLogModalProps {
  isOpen: boolean
  productId: string
  designRevisions: Array<{ revision_id: string; design_code: string | null }>
  onClose: () => void
  onSuccess: () => void
}

export const CreateApprovalLogModal: React.FC<CreateApprovalLogModalProps> = ({
  isOpen,
  productId,
  designRevisions,
  onClose,
  onSuccess,
}) => {
  const [selectedRevId, setSelectedRevId] = useState('')
  const [stage, setStage] = useState<ApprovalStage>('LAYOUT')
  const [status, setStatus] = useState<ApprovalStatus>('APPROVED')
  const [customerFeedback, setCustomerFeedback] = useState('')
  const [approverId, setApproverId] = useState('')
  const [notes, setNotes] = useState('')
  const [employees, setEmployees] = useState<Array<{ employee_id: string; employee_name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (designRevisions.length > 0 && !selectedRevId) {
      setSelectedRevId(designRevisions[0].revision_id)
    }
  }, [designRevisions, selectedRevId])

  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('employees').select('employee_id, employee_name').eq('is_active', true)
        setEmployees(data || [])
      }
      fetchEmployees()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRevId) {
      setError('設計リビジョンを選択してください (Vui lòng chọn Revision).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await submitDesignApprovalLogAction({
        design_revision_id: selectedRevId,
        approval_stage: stage,
        status: status,
        approver_id: approverId || undefined,
        customer_feedback: customerFeedback,
        notes: notes,
      })

      if (!res.success) {
        throw new Error(res.error)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu kết quả duyệt')
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
        borderRadius: 8, width: '100%', maxWidth: 500,
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
            <FileCheck size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              承認ログ記録 (Ghi nhận Kết quả Duyệt Thiết kế)
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

          {/* Revision Selection */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              対象リビジョン (Revision cần duyệt) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              className="form-input"
              value={selectedRevId}
              onChange={(e) => setSelectedRevId(e.target.value)}
              style={{ width: '100%', height: 32, fontSize: 12 }}
              required
            >
              {designRevisions.map((rev) => (
                <option key={rev.revision_id} value={rev.revision_id}>
                  {rev.design_code || 'Unnamed Revision'}
                </option>
              ))}
            </select>
          </div>

          {/* Stage & Status Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                承認段階 (Giai đoạn)
              </label>
              <select
                className="form-input"
                value={stage}
                onChange={(e) => setStage(e.target.value as ApprovalStage)}
                style={{ width: '100%', height: 32, fontSize: 12 }}
              >
                <option value="LAYOUT">レイアウト承認 (Layout)</option>
                <option value="SAMPLE_POCKET">試作ポケット承認 (Sample Pocket)</option>
                <option value="MASS_DRAWING">本型図面承認 (Mass Drawing)</option>
                <option value="MASS_MOLD">本型金型承認 (Mass Mold)</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                判定結果 (Kết quả duyệt)
              </label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApprovalStatus)}
                style={{ width: '100%', height: 32, fontSize: 12, fontWeight: 700 }}
              >
                <option value="APPROVED" style={{ color: '#10B981' }}>✓ 承認 (APPROVED)</option>
                <option value="REJECTED_REVISE" style={{ color: '#EF4444' }}>✕ 修正要求 (REVISE)</option>
                <option value="PENDING" style={{ color: '#F59E0B' }}>⏳ 確認待ち (PENDING)</option>
                <option value="CANCELLED">🚫 取消 (CANCELLED)</option>
              </select>
            </div>
          </div>

          {/* Customer Feedback */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              顧客フィードバック / メール要旨 (Ý kiến phản hồi từ Khách hàng)
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={customerFeedback}
              onChange={(e) => setCustomerFeedback(e.target.value)}
              placeholder="例: メールにてレイアウト図面OK受領。ポケット寸法公差±0.2mm確認済み。"
              style={{ width: '100%', fontSize: 12 }}
            />
          </div>

          {/* Approver */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              社内確認担当者 (Người xác nhận nội bộ)
            </label>
            <select
              className="form-input"
              value={approverId}
              onChange={(e) => setApproverId(e.target.value)}
              style={{ width: '100%', height: 32, fontSize: 12 }}
            >
              <option value="">-- 選択なし (Chưa chọn) --</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              メモ (Ghi chú bổ sung)
            </label>
            <input
              type="text"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', height: 30, fontSize: 12 }}
              placeholder="社内共有メモ..."
            />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 30, padding: '0 16px', fontSize: 12 }}>
              {loading ? '保存中...' : '登録する (Lưu)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
