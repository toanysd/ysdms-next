'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X, CheckCircle2, DollarSign, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { addPayment, AddPaymentPayload } from '@/app/actions/invoice'

interface AddPaymentModalProps {
  isOpen: boolean
  invoiceId: string
  invoiceNumber: string
  remainingAmount: number
  currency?: string
  onClose: () => void
  onSuccess: () => void
}

export default function AddPaymentModal({
  isOpen,
  invoiceId,
  invoiceNumber,
  remainingAmount,
  currency = 'JPY',
  onClose,
  onSuccess,
}: AddPaymentModalProps) {
  const t = useTranslations('invoices')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState<number>(remainingAmount > 0 ? remainingAmount : 0)
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'OTHER'>('BANK_TRANSFER')
  const [referenceNo, setReferenceNo] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (amount <= 0) {
      setError(t('errorInvalidAmount') || 'Số tiền thanh toán phải lớn hơn 0')
      return
    }

    setLoading(true)
    setError(null)

    const payload: AddPaymentPayload = {
      payment_date: paymentDate,
      amount: Number(amount),
      payment_method: paymentMethod,
      reference_no: referenceNo.trim() || null,
      notes: notes.trim() || null,
    }

    const res = await addPayment(invoiceId, payload)
    setLoading(false)

    if (res.success) {
      onSuccess()
      onClose()
    } else {
      setError(res.error || 'Lỗi khi ghi nhận thanh toán')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          borderRadius: 12,
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border-color, #E2E8F0)',
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
            borderBottom: '1px solid var(--border-color, #E2E8F0)',
            background: 'var(--tint-teal-bg, #F0FDFA)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign size={20} style={{ color: 'var(--accent, #0D9488)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>
                {t('recordPayment')}
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted, #64748B)', fontFamily: 'monospace' }}>
                {invoiceNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748B',
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 6,
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
                fontSize: 13,
                border: '1px solid #FECACA',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Remaining Amount Pill */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#F8FAFC',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{t('remaining_amount')}</span>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: remainingAmount > 0 ? '#D97706' : '#16A34A' }}>
              {currency === 'JPY' ? `¥${remainingAmount.toLocaleString()}` : `${remainingAmount.toLocaleString()} ${currency}`}
            </span>
          </div>

          {/* Payment Date */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              {t('payment_date')} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Payment Amount */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              {t('paid_amount')} ({currency}) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="form-input"
              style={{ width: '100%', fontFamily: 'monospace', fontWeight: 700 }}
            />
          </div>

          {/* Payment Method */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              {t('payment_method')}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="form-input"
              style={{ width: '100%' }}
            >
              <option value="BANK_TRANSFER">{t('paymentMethodBank')}</option>
              <option value="CASH">{t('paymentMethodCash')}</option>
              <option value="CHECK">{t('paymentMethodCheck')}</option>
              <option value="OTHER">{t('paymentMethodOther')}</option>
            </select>
          </div>

          {/* Reference No */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              {t('reference_no')}
            </label>
            <input
              type="text"
              placeholder={t('refNoPlaceholder')}
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              {t('notes')}
            </label>
            <textarea
              rows={2}
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              <span>{t('savePayment')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
