'use client'

import React, { useState } from 'react'
import type { Quotation } from '../types'
import { FileSpreadsheet, Plus, FileText, Download, CheckCircle2, Clock } from 'lucide-react'
import QuotationFormModal from './QuotationFormModal'

type Props = {
  caseId: string
  quotations: Quotation[]
  currentUserId: string | null
  onRefresh: () => void
}

const STATUS_MAP: Record<string, { labelJA: string; badge: string }> = {
  draft: { labelJA: '下書き', badge: 'badge--neutral' },
  sent: { labelJA: '提出済', badge: 'badge--info' },
  accepted: { labelJA: '承認済', badge: 'badge--success' },
  rejected: { labelJA: '失注', badge: 'badge--error' },
}

export default function SalesTab({ caseId, quotations, currentUserId, onRefresh }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)

  const handleOpenModal = (q?: Quotation) => {
    setEditingQuotation(q || null)
    setIsModalOpen(true)
  }

  const handleExportPDF = async (q: Quotation) => {
    try {
      const { generateQuotationPDF } = await import('@/lib/utils/pdfExport')
      const blob = await generateQuotationPDF(q, '得意先') // We can pass the real customer name later if available
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `見積書_${q.quotation_no}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error(err)
      alert('PDFのエクスポートに失敗しました。')
    }
  }

  return (
    <div className="form-section">
      <div className="form-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FileSpreadsheet size={14} className="section-icon" />
          <span style={{ fontFamily: 'var(--font-jp)' }}>見積書一覧</span>
          <span style={{ marginLeft: 6, opacity: 0.6 }}>Danh sách Báo giá</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
          <Plus size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>見積作成</span>
        </button>
      </div>
      
      <div className="form-section-body">
        {(!quotations || quotations.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            見積がありません / Chưa có báo giá
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quotations.map(q => (
              <div key={q.id} style={{
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
                    <span className={`badge ${STATUS_MAP[q.status]?.badge || 'badge--neutral'}`}>
                      {STATUS_MAP[q.status]?.labelJA || q.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>発行日: {q.issued_date || '未定'}</span>
                    <span style={{ margin: '0 8px' }}>|</span>
                    <span>総額: {new Intl.NumberFormat('ja-JP').format(q.total_amount)} {q.currency}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(q)}>
                    編集
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
