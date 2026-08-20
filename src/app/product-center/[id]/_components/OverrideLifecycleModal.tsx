'use client'

import React, { useState, useEffect } from 'react'
import { X, AlertTriangle, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { transitionProductLifecycleAction, type ProductLifecycleStatus } from '@/app/actions/product-lifecycle'

interface OverrideLifecycleModalProps {
  isOpen: boolean
  productId: string
  currentStatus: string
  onClose: () => void
  onSuccess: () => void
}

export const OverrideLifecycleModal: React.FC<OverrideLifecycleModalProps> = ({
  isOpen,
  productId,
  currentStatus,
  onClose,
  onSuccess,
}) => {
  const [targetStatus, setTargetStatus] = useState<ProductLifecycleStatus>('APPROVED')
  const [reason, setReason] = useState('')
  const [changedBy, setChangedBy] = useState('')
  const [employees, setEmployees] = useState<Array<{ employee_id: string; employee_name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    if (!reason.trim()) {
      setError('手動変更の理由を必ず入力してください (Bắt buộc nhập lý do khi thay đổi trạng thái thủ công).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await transitionProductLifecycleAction({
        product_id: productId,
        to_status: targetStatus,
        reason: reason.trim(),
        changed_by: changedBy || undefined,
        is_manual_override: true,
      })

      if (!res.success) {
        throw new Error(res.error)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật trạng thái vòng đời')
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
          background: '#FEF3C7'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
              ライフサイクル状態 手動変更 (Manual Override)
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400E' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#92400E', background: '#FFFBEB', padding: '8px 10px', borderRadius: 4, lineHeight: 1.4 }}>
            ⚠️ <strong>注意:</strong> ライフサイクル状態を手動で上書きします。変更理由と担当者は監査ログに永続保存されます。
          </div>

          {error && (
            <div style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 4, color: '#DC2626', fontSize: 12 }}>
              {error}
            </div>
          )}

          {/* Current vs New Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                現在の状態 (Hiện tại)
              </label>
              <input
                type="text"
                className="form-input"
                value={currentStatus}
                disabled
                style={{ width: '100%', height: 32, fontSize: 12, background: '#F1F5F9', fontWeight: 700 }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                変更後の状態 (Mục tiêu) <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                className="form-input"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as ProductLifecycleStatus)}
                style={{ width: '100%', height: 32, fontSize: 12, fontWeight: 700 }}
              >
                <option value="DRAFT">DRAFT (構想・ドラフト)</option>
                <option value="DESIGN">DESIGN (設計中)</option>
                <option value="PROTOTYPE">PROTOTYPE (試作検証中)</option>
                <option value="APPROVED">APPROVED (正式承認済)</option>
                <option value="MASS_PRODUCTION">MASS_PRODUCTION (量産中)</option>
                <option value="DISCONTINUED">DISCONTINUED (廃番・中止)</option>
              </select>
            </div>
          </div>

          {/* Reason (NOT NULL) */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              変更理由 (Lý do thay đổi trạng thái) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例: 客先口頭合意に基づき試作スキップして本型承認へ繰り上げ。"
              style={{ width: '100%', fontSize: 12 }}
              required
            />
          </div>

          {/* Employee */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              変更実行者 (Người thực hiện)
            </label>
            <select
              className="form-input"
              value={changedBy}
              onChange={(e) => setChangedBy(e.target.value)}
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

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 30, padding: '0 16px', fontSize: 12, background: '#D97706', borderColor: '#B45309' }}>
              {loading ? '更新中...' : '状態を上書き保存 (Lưu)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
