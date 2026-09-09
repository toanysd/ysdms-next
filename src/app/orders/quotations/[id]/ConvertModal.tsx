'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  ShoppingCart, X, AlertCircle, CheckCircle2,
  RefreshCw, Building2, FileText, Layers, Banknote
} from 'lucide-react'
import { convertQuotationToOrderAction } from '../actions'

export interface ConvertModalProps {
  quotationId: string
  quotationNo: string
  customerName: string
  lineCount: number
  totalAmount: number
  onClose: () => void
}

export function ConvertModal({
  quotationId,
  quotationNo,
  customerName,
  lineCount,
  totalAmount,
  onClose,
}: ConvertModalProps) {
  const router = useRouter()
  const t = useTranslations('Quotations')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleConfirm = () => {
    setError(null)
    startTransition(async () => {
      try {
        const res = await convertQuotationToOrderAction(quotationId)
        if (res.success && res.orderId) {
          setSuccessMessage(res.message || t('convertModal.success'))
          setTimeout(() => {
            router.push(`/orders/${res.orderId}`)
          }, 900)
        } else {
          setError(res.message || 'Lỗi không xác định khi chuyển đổi báo giá thành đơn hàng.')
        }
      } catch (err: unknown) {
        const errorText = err instanceof Error ? err.message : 'Lỗi hệ thống bất ngờ'
        setError(errorText)
      }
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose()
        }
      }}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--bg-surface, #FFFFFF)',
          borderRadius: 8,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-color, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--tint-purple-bg, #FAF5FF)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: '#7E22CE',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCart size={16} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 800,
                color: '#581C87',
              }}
            >
              {t('convertModal.title')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: isPending ? 'not-allowed' : 'pointer',
              color: 'var(--text-muted, #64748B)',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '18px 20px' }}>
          <p
            style={{
              margin: '0 0 14px 0',
              fontSize: 12,
              lineHeight: '18px',
              color: 'var(--text-secondary, #475569)',
            }}
          >
            {t('convertModal.summary')}
          </p>

          {/* 4-Line Summary Box */}
          <div
            style={{
              background: 'var(--bg-muted, #F8FAFC)',
              border: '1px solid var(--border-color, #E2E8F0)',
              borderRadius: 6,
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {/* 1. Khách hàng */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted, #64748B)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={14} />
                <span>{t('customerName')}</span>
              </span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>
                {customerName}
              </span>
            </div>

            {/* 2. Số báo giá */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted, #64748B)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={14} />
                <span>{t('quotationNo')}</span>
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#7E22CE' }}>
                {quotationNo}
              </span>
            </div>

            {/* 3. Số mặt hàng */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted, #64748B)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={14} />
                <span>対象明細数</span>
              </span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {lineCount} 行 (items)
              </span>
            </div>

            {/* 4. Tổng tiền */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 13,
                borderTop: '1px dashed var(--border-color, #E2E8F0)',
                paddingTop: 8,
              }}
            >
              <span style={{ color: 'var(--text-muted, #64748B)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Banknote size={15} />
                <span style={{ fontWeight: 600 }}>{t('grandTotal')}</span>
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: 16,
                  color: 'var(--accent, #0D9488)',
                }}
              >
                ¥ {Number(totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                borderRadius: 6,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: 12,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ lineHeight: '18px' }}>{error}</div>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                borderRadius: 6,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#047857',
                fontSize: 12,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ lineHeight: '18px', fontWeight: 600 }}>{successMessage}</div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-color, #E2E8F0)',
            background: 'var(--bg-muted, #F8FAFC)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="btn btn-secondary"
            style={{ height: 32, padding: '0 16px', fontSize: 12 }}
          >
            {t('convertModal.cancel')}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || Boolean(successMessage)}
            className="btn btn-primary"
            style={{
              height: 32,
              padding: '0 18px',
              fontSize: 12,
              fontWeight: 700,
              background: '#7E22CE',
              borderColor: '#6B21A8',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isPending ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>{t('convertModal.converting')}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>{t('convertModal.confirm')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
