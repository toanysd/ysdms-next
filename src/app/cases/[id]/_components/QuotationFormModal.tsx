'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Save, Plus, Trash2 } from 'lucide-react'
import type { Quotation, QuotationLine, QuotationStatus } from '../types'

type Props = {
  caseId: string
  companyId: string | null
  initialData: Quotation | null
  onClose: () => void
  onSuccess: () => void
  currentUserId: string | null
}

const ITEM_TYPES = [
  { value: 'DESIGN_FEE', label: '設計費 (Phí thiết kế)' },
  { value: 'PROTOTYPE', label: '試作費 (Phí Prototype)' },
  { value: 'MOLD', label: '金型代 (Phí Khuôn)' },
  { value: 'PRODUCT', label: '製品代 (Sản phẩm)' },
  { value: 'OTHER', label: 'その他 (Khác)' }
]

export default function QuotationFormModal({ caseId, companyId, initialData, onClose, onSuccess, currentUserId }: Props) {
  const isEdit = !!initialData
  const supabase = createClient()
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultLines: QuotationLine[] = initialData?.quotation_lines?.length
    ? initialData.quotation_lines
    : [{ line_no: 1, item_type: 'MOLD', description: '', quantity: 1, unit_price: 0, amount: 0 }]

  const [formData, setFormData] = useState<{
    quotation_no: string
    version: number
    quote_date: string
    valid_until: string
    currency: string
    status: QuotationStatus
    notes: string
    lines: QuotationLine[]
  }>({
    quotation_no: initialData?.quotation_no || '',
    version: initialData?.version || 1,
    quote_date: initialData?.quote_date || new Date().toISOString().split('T')[0],
    valid_until: initialData?.valid_until || '',
    currency: initialData?.currency || 'JPY',
    status: initialData?.status || 'draft',
    notes: initialData?.notes || '',
    lines: defaultLines,
  })

  // Auto-calculate amounts
  const handleLineChange = (index: number, field: keyof QuotationLine, value: string | number) => {
    const newLines = [...formData.lines]
    const line = { ...newLines[index], [field]: value }
    if (field === 'quantity' || field === 'unit_price') {
      line.amount = (Number(line.quantity) || 0) * (Number(line.unit_price) || 0)
    }
    newLines[index] = line as QuotationLine
    setFormData({ ...formData, lines: newLines })
  }

  const addLine = () => {
    const maxLineNo = formData.lines.reduce((max, l) => Math.max(max, l.line_no), 0)
    setFormData({
      ...formData,
      lines: [...formData.lines, { line_no: maxLineNo + 1, item_type: 'OTHER', description: '', quantity: 1, unit_price: 0, amount: 0 }]
    })
  }

  const removeLine = (index: number) => {
    const newLines = [...formData.lines]
    newLines.splice(index, 1)
    // Re-index line_no
    newLines.forEach((l, i) => l.line_no = i + 1)
    setFormData({ ...formData, lines: newLines })
  }

  const totalAmount = formData.lines.reduce((sum, line) => sum + (line.amount || 0), 0)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!companyId) {
      setError('Lỗi: Chưa có thông tin khách hàng (company_id) từ Business Case.')
      setSaving(false)
      return
    }

    try {
      const payload = {
        case_id: caseId,
        company_id: companyId,
        quotation_no: formData.quotation_no,
        quote_date: formData.quote_date || null,
        valid_until: formData.valid_until || null,
        total_amount: totalAmount,
        status: formData.status,
        notes: formData.notes,
        prepared_by: currentUserId,
      }

      let targetQuotationId = ''

      if (isEdit && initialData?.quotation_id) {
        targetQuotationId = initialData.quotation_id
        const { error: updErr } = await supabase
          .from('quotations')
          .update(payload as any)
          .eq('quotation_id', targetQuotationId)
        if (updErr) throw updErr

        // Delete old lines
        const { error: delErr } = await supabase
          .from('quotation_lines')
          .delete()
          .eq('quotation_id', targetQuotationId)
        if (delErr) throw delErr

      } else {
        const { data: insData, error: insErr } = await supabase
          .from('quotations')
          .insert(payload as any)
          .select('quotation_id')
          .single()
        
        if (insErr) throw insErr
        if (!insData) throw new Error('Không lấy được quotation_id sau khi insert')
        
        targetQuotationId = insData.quotation_id
      }

      // Insert new lines
      if (formData.lines.length > 0) {
        const linesToInsert = formData.lines.map((line, idx) => ({
          quotation_id: targetQuotationId,
          line_no: idx + 1,
          item_type: line.item_type,
          description: line.description,
          quantity: line.quantity,
          unit_price: line.unit_price,
          amount: line.amount,
          notes: line.notes || null,
        }))

        const { error: linesErr } = await supabase
          .from('quotation_lines')
          .insert(linesToInsert as any)

        if (linesErr) throw linesErr
      }

      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Lỗi khi lưu báo giá')
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card-flat" style={{
        width: '100%', maxWidth: 900, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', padding: 0
      }}>
        
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border-default)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>
            <span className="ja">{isEdit ? '見積書編集' : '新規見積作成'}</span>
            <span className="vi" style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              {isEdit ? 'Sửa báo giá' : 'Tạo báo giá mới'}
            </span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ padding: 12, background: 'var(--bg-error)', color: 'var(--text-error)', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <form id="quotation-form" onSubmit={handleSave}>
            
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">見積番号 (Mã báo giá)</label>
                <input required className="form-input" value={formData.quotation_no}
                  onChange={e => setFormData({ ...formData, quotation_no: e.target.value })}
                  placeholder="YSD-Q-2026-001" />
              </div>

              <div className="form-field">
                <label className="form-label">発行日 (Ngày phát hành)</label>
                <input type="date" required className="form-input" value={formData.quote_date}
                  onChange={e => setFormData({ ...formData, quote_date: e.target.value })} />
              </div>

              <div className="form-field">
                <label className="form-label">有効期限 (Hạn báo giá)</label>
                <input type="date" className="form-input" value={formData.valid_until}
                  onChange={e => setFormData({ ...formData, valid_until: e.target.value })} />
              </div>
            </div>

            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ margin: 0, fontSize: 14 }}>見積明細 (Hạng mục)</h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>
                  <Plus size={14} /> 追加
                </button>
              </div>
              
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 150 }}>区分 (Loại)</th>
                      <th>項目名 (Mô tả chi tiết)</th>
                      <th style={{ width: 80 }}>数量 (SL)</th>
                      <th style={{ width: 120 }}>単価 (Đơn giá)</th>
                      <th style={{ width: 120 }}>金額 (Thành tiền)</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.lines.map((line, index) => (
                      <tr key={index}>
                        <td>
                          <select className="form-input" value={line.item_type} required
                            onChange={e => handleLineChange(index, 'item_type', e.target.value)}>
                            {ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </td>
                        <td>
                          <input className="form-input" value={line.description} required
                            onChange={e => handleLineChange(index, 'description', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-input" value={line.quantity} required min={1}
                            onChange={e => handleLineChange(index, 'quantity', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-input" value={line.unit_price} required min={0}
                            onChange={e => handleLineChange(index, 'unit_price', e.target.value)} />
                        </td>
                        <td style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 600 }}>
                          {new Intl.NumberFormat('ja-JP').format(line.amount)}
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <button type="button" onClick={() => removeLine(index)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-error)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'var(--bg-surface-2)' }}>
                      <td colSpan={4} style={{ textAlign: 'right', fontWeight: 600 }}>合計 (Tổng tiền):</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
                        {new Intl.NumberFormat('ja-JP').format(totalAmount)} {formData.currency}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">備考 (Ghi chú)</label>
              <textarea className="form-textarea" rows={3} value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>

            <div className="form-field" style={{ marginTop: 16 }}>
              <label className="form-label">ステータス (Trạng thái)</label>
              <select className="form-input" value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as QuotationStatus })}>
                <option value="draft">下書き (Nháp)</option>
                <option value="sent">提出済 (Đã gửi)</option>
                <option value="accepted">承認済 (Đã chốt)</option>
                <option value="rejected">失注 (Từ chối)</option>
              </select>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border-default)',
          display: 'flex', justifyContent: 'flex-end', gap: 12, background: 'var(--bg-surface)'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            キャンセル
          </button>
          <button type="submit" form="quotation-form" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{saving ? '保存中...' : '保存'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
