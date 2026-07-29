'use client'

import React, { useState, useEffect } from 'react'
import type { Quotation } from '../types'
import { FileSpreadsheet, Plus, FileText, Download } from 'lucide-react'
import QuotationFormModal from './QuotationFormModal'
import { useTranslations } from 'next-intl'

type Props = {
  caseId: string
  companyId: string | null
  quotations: Quotation[]
  currentUserId: string | null
  // Khi vào tab Sales từ nút "Tạo báo giá" bên tab Kỹ thuật → tự mở modal
  openModalOnMount?: boolean
  onModalMounted?: () => void
  onRefresh: () => void
}

const STATUS_BADGE_MAP: Record<string, string> = {
  draft:    'badge--neutral',
  sent:     'badge--info',
  accepted: 'badge--success',
  rejected: 'badge--error',
}

export default function SalesTab({
  caseId,
  companyId,
  quotations,
  currentUserId,
  openModalOnMount,
  onModalMounted,
  onRefresh,
}: Props) {
  const t = useTranslations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)

  // Tự mở modal nếu được yêu cầu từ tab Kỹ thuật
  useEffect(() => {
    if (openModalOnMount) {
      setEditingQuotation(null)
      setIsModalOpen(true)
      onModalMounted?.()
    }
  }, [openModalOnMount, onModalMounted])

  const handleOpenModal = (q?: Quotation) => {
    setEditingQuotation(q || null)
    setIsModalOpen(true)
  }

  const handleExportPDF = async (q: Quotation) => {
    try {
      const { generateQuotationPDF } = await import('@/lib/utils/pdfExport')
      const blob = await generateQuotationPDF(q, '得意先')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `見積書_${q.quotation_no}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      console.error(err)
      alert(t('Cases.pdfExportFailed'))
    }
  }

  return (
    <div className="form-section">
      <div className="form-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FileSpreadsheet size={14} className="section-icon" />
          <span style={{ fontWeight: 600 }}>{t('Cases.quotationList')}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
          <Plus size={14} />
          <span>{t('Cases.createQuotation')}</span>
        </button>
      </div>

      <div className="form-section-body">
        {(!quotations || quotations.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            {t('Cases.noQuotation')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quotations.map(q => (
              <div key={q.quotation_id} style={{
                border: '1px solid var(--border-default)',
                borderRadius: 6,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-surface)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={16} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{q.quotation_no}</span>
                    <span className={`badge ${STATUS_BADGE_MAP[q.status] || 'badge--neutral'}`}>
                      {t(`Cases.QuotationStatus.${q.status}`)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>{t('Cases.quoteDate')}: {q.issued_date || t('Cases.undetermined')}</span>
                    <span style={{ margin: '0 8px' }}>|</span>
                    <span>{t('Cases.totalAmountLabel')}: {new Intl.NumberFormat('ja-JP').format(q.total_amount)} {q.currency}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(q)}>
                    {t('Cases.edit')}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleExportPDF(q)}>
                    <Download size={14} /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <QuotationFormModal
          caseId={caseId}
          companyId={companyId}
          initialData={editingQuotation}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false)
            onRefresh()
          }}
          currentUserId={currentUserId}
        />
      )}
    </div>
  )
}
