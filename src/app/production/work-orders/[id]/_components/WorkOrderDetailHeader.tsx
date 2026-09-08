'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowUpFromLine, 
  Hash, 
  Printer, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateWorkOrderStatus } from '../../actions'
import type { WOStatus, WOEquipmentSetResult } from '../../types'

interface WorkOrderDetailHeaderProps {
  woId: string
  woCode: string
  status: WOStatus
  equipmentSet?: WOEquipmentSetResult | null
}

export function WorkOrderDetailHeader({
  woId,
  woCode,
  status,
  equipmentSet,
}: WorkOrderDetailHeaderProps) {
  const t = useTranslations('WorkOrders')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isSetReady = equipmentSet?.summary.is_all_ready ?? false

  const handleStartProduction = async (override = false) => {
    setLoading(true)
    setErrorMessage(null)

    const res = await updateWorkOrderStatus(
      woId,
      'IN_PROGRESS',
      override ? overrideReason : undefined
    )

    setLoading(false)

    if (!res.success) {
      if (res.gatekeeperBlocked && !override) {
        setShowOverrideModal(true)
      } else {
        setErrorMessage(res.message || res.error || 'Lỗi cập nhật trạng thái')
      }
    } else {
      setShowOverrideModal(false)
      router.refresh()
    }
  }

  const handleCompleteProduction = async () => {
    if (!confirm('製造完了として登録しますか？ (Xác nhận hoàn tất lệnh sản xuất?)')) {
      return
    }

    setLoading(true)
    const res = await updateWorkOrderStatus(woId, 'COMPLETED')
    setLoading(false)

    if (!res.success) {
      alert(res.error || 'Lỗi cập nhật')
    } else {
      router.refresh()
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge--success">{t('completed')}</span>
      case 'IN_PROGRESS':
        return <span className="badge badge--warning">{t('inProgress')}</span>
      case 'CANCELLED':
        return <span className="badge badge--error">{t('cancelled')}</span>
      case 'PLANNED':
      default:
        return <span className="badge badge--info">{t('planned')}</span>
    }
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          flexShrink: 0,
        }}
      >
        {/* Left: Back / Up / Code / Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
              title="戻る"
            >
              <ArrowLeft size={13} />
              <span>戻る</span>
            </button>
            <Link
              href="/production/work-orders"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                fontSize: 11,
              }}
              title="一覧"
            >
              <ArrowUpFromLine size={13} />
              <span>一覧</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: 'var(--text-primary)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Hash size={17} color="var(--accent)" />
              {woCode}
            </h1>
            {getStatusBadge()}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Print PDF */}
          <a
            href={`/api/production/work-orders/${woId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              padding: '6px 12px',
            }}
          >
            <Printer size={14} />
            <span>{t('printPdf')}</span>
          </a>

          {/* Gatekeeper: PLANNED -> IN_PROGRESS */}
          {status === 'PLANNED' && (
            <button
              type="button"
              onClick={() => handleStartProduction(false)}
              disabled={loading}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                padding: '6px 12px',
                backgroundColor: isSetReady ? 'var(--accent, #0D9488)' : '#D97706',
                borderColor: isSetReady ? 'var(--accent, #0D9488)' : '#D97706',
              }}
            >
              <Play size={13} />
              <span>{t('startProduction')}</span>
            </button>
          )}

          {/* IN_PROGRESS -> COMPLETED */}
          {status === 'IN_PROGRESS' && (
            <button
              type="button"
              onClick={handleCompleteProduction}
              disabled={loading}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                padding: '6px 12px',
                backgroundColor: '#16A34A',
                borderColor: '#16A34A',
              }}
            >
              <CheckCircle2 size={14} />
              <span>{t('completeProduction')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Override Modal (Gatekeeper) */}
      {showOverrideModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              width: 480,
              maxWidth: '90vw',
              padding: 20,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: 10,
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} color="#D97706" />
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>
                  {t('gatekeeperWarning')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, marginBottom: 12 }}>
              金型または抜型の状態が READY（準備完了）になっていないか、一部の設備が揃っていません。
              製造を開始するには、工場長または管理者の例外承認理由を入力してください。
            </p>

            {errorMessage && (
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: 12,
                  borderRadius: 4,
                  marginBottom: 10,
                }}
              >
                {errorMessage}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                }}
              >
                例外承認理由 (Lý do ngoại lệ) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder={t('gatekeeperReasonPlaceholder')}
                className="form-input"
                style={{ width: '100%', height: 75, fontSize: 12, padding: 8 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '6px 14px' }}
              >
                キャンセル (Hủy)
              </button>
              <button
                type="button"
                onClick={() => handleStartProduction(true)}
                disabled={loading || !overrideReason.trim()}
                className="btn btn-primary"
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  backgroundColor: '#D97706',
                  borderColor: '#D97706',
                  opacity: !overrideReason.trim() ? 0.6 : 1,
                }}
              >
                {t('gatekeeperOverride')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
