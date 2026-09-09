'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Download, ShoppingCart, CheckCircle, RefreshCw,
  Send, Lock
} from 'lucide-react'
import { QuotationDetail, updateQuotationStatusAction } from '../actions'
import { ConvertModal } from './ConvertModal'

export interface QuotationHeaderActionsProps {
  quotation: QuotationDetail
}

export function QuotationHeaderActions({ quotation }: QuotationHeaderActionsProps) {
  const t = useTranslations('Quotations')
  const router = useRouter()
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [isUpdatingStatus, startStatusTransition] = useTransition()

  const handleQuickApprove = () => {
    if (!confirm('この見積書を「承認済み (APPROVED)」に更新しますか？')) return
    startStatusTransition(async () => {
      const res = await updateQuotationStatusAction(quotation.quotation_id, 'APPROVED')
      if (res.success) {
        router.refresh()
      } else {
        alert(res.message || 'ステータスの更新に失敗しました')
      }
    })
  }

  const handleQuickSend = () => {
    if (!confirm('この見積書を「送付済み (SENT)」に更新しますか？')) return
    startStatusTransition(async () => {
      const res = await updateQuotationStatusAction(quotation.quotation_id, 'SENT')
      if (res.success) {
        router.refresh()
      } else {
        alert(res.message || 'ステータスの更新に失敗しました')
      }
    })
  }

  const isConverted = quotation.status === 'CONVERTED'
  const isApproved = quotation.status === 'APPROVED'
  const isDraft = quotation.status === 'DRAFT'
  const isSent = quotation.status === 'SENT'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {/* 1. PDF Download */}
      <a
        href={`/api/quotations/${quotation.quotation_id}/pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary"
        style={{
          height: 30,
          padding: '0 12px',
          fontSize: 12,
          gap: 6,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Download size={13} />
        <span>{t('exportPdf')}</span>
      </a>

      {/* 2. Quick Status Updates for DRAFT/SENT */}
      {isDraft && (
        <button
          type="button"
          onClick={handleQuickSend}
          disabled={isUpdatingStatus}
          className="btn btn-secondary"
          style={{ height: 30, padding: '0 12px', fontSize: 12, gap: 6 }}
        >
          {isUpdatingStatus ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
          <span>送付済にする</span>
        </button>
      )}

      {(isDraft || isSent) && (
        <button
          type="button"
          onClick={handleQuickApprove}
          disabled={isUpdatingStatus}
          className="btn btn-secondary"
          style={{
            height: 30,
            padding: '0 12px',
            fontSize: 12,
            gap: 6,
            borderColor: '#059669',
            color: '#059669',
          }}
        >
          {isUpdatingStatus ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle size={13} />}
          <span>承認する (Approve)</span>
        </button>
      )}

      {/* 3. Primary Action: Nút 「受注確定」 khi APPROVED */}
      {isApproved && (
        <button
          type="button"
          onClick={() => setShowConvertModal(true)}
          className="btn btn-primary"
          style={{
            height: 30,
            padding: '0 16px',
            fontSize: 12,
            fontWeight: 800,
            background: '#7E22CE',
            borderColor: '#6B21A8',
            color: '#FFFFFF',
            boxShadow: '0 2px 4px rgba(126, 34, 206, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ShoppingCart size={14} />
          <span>{t('btn_convert')}</span>
        </button>
      )}

      {/* 4. Read-only Lock Indicator khi CONVERTED */}
      {isConverted && (
        <span
          style={{
            height: 30,
            padding: '0 12px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            background: '#F3E8FF',
            color: '#7E22CE',
            border: '1px solid #D8B4FE',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Lock size={12} />
          <span>受注済 (変更不可)</span>
        </span>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <ConvertModal
          quotationId={quotation.quotation_id}
          quotationNo={quotation.quotation_no}
          customerName={quotation.companies?.company_name || '得意先未設定'}
          lineCount={quotation.lines.length}
          totalAmount={Number(quotation.total_amount || 0)}
          onClose={() => setShowConvertModal(false)}
        />
      )}
    </div>
  )
}
