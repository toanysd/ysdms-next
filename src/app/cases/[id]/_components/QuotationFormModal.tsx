'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Save, Plus, Trash2 } from 'lucide-react'
import type { Quotation, QuotationItem, QuotationStatus } from '../types'

type Props = {
  caseId: string
  initialData: Quotation | null
  onClose: () => void
  onSuccess: () => void
  currentUserId: string | null
}

export default function QuotationFormModal({ caseId, initialData, onClose, onSuccess, currentUserId }: Props) {
  const isEdit = !!initialData
  const supabase = createClient()
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    quotation_no: string
    version: number
    issued_date: string
    valid_until: string
    currency: string
    status: QuotationStatus
    notes: string
    items: QuotationItem[]
  }>({
    quotation_no: initialData?.quotation_no || '',
    version: initialData?.version || 1,
    issued_date: initialData?.issued_date || new Date().toISOString().split('T')[0],
    valid_until: initialData?.valid_until || '',
    currency: initialData?.currency || 'JPY',
    status: initialData?.status || 'draft',
    notes: initialData?.notes || '',
    items: initialData?.items_json || [{ id: crypto.randomUUID(), name: '', quantity: 1, unit_price: 0, amount: 0 }],
  })

  // Auto-calculate amounts
  const handleItemChange = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newItems = [...formData.items]
    const item = { ...newItems[index], [field]: value }
    if (field === 'quantity' || field === 'unit_price') {
      item.amount = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
    }
    newItems[index] = item as QuotationItem
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: crypto.randomUUID(), name: '', quantity: 1, unit_price: 0, amount: 0 }]
    })
  }

  const removeItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(i => i.id !== id)
    })
  }

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        case_id: caseId,
        quotation_no: formData.quotation_no,
        version: formData.version,
        issued_date: formData.issued_date || null,
        valid_until: formData.valid_until || null,
        currency: formData.currency,
        status: formData.status,
        notes: formData.notes,
        items_json: formData.items,
        total_amount: totalAmount,
        tax_amount: Math.floor(totalAmount * 0.1), // 10% tax for example, or adjustable
        prepared_by: currentUserId,
      }

      if (isEdit) {
        const { error: updErr } = await supabase
          .from('quotations')
          .update(payload as any)
          .eq('id', initialData.id)
        if (updErr) throw updErr
      } else {
        const { error: insErr } = await supabase
          .from('quotations')
          .insert(payload as any)
        if (insErr) throw insErr
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
        width: '100%', maxWidth: 800, maxHeight: '90vh',
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
                <label className="form-label">バージョン (Version)</label>
                <input type="number" min={1} className="form-input" value={formData.version}
                  onChange={e => setFormData({ ...formData, version: parseInt(e.target.value) || 1 })} />
              </div>

              <div className="form-field">
                <label className="form-label">発行日 (Ngày phát hành)</label>
                <input type="date" required className="form-input" value={formData.issued_date}
                  onChange={e => setFormData({ ...formData, issued_date: e.target.value })} />
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
                <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
                  <Plus size={14} /> 追加
                </button>
              </div>
              
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>項目名 (Tên hạng mục)</th>
                      <th style={{ width: 80 }}>数量 (SL)</th>
                      <th style={{ width: 120 }}>単価 (Đơn giá)</th>
                      <th style={{ width: 120 }}>金額 (Thành tiền)</th>
                      <th style={{ width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input className="form-input" value={item.name} required
                            onChange={e => handleItemChange(index, 'name', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-input" value={item.quantity} required min={1}
                            onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-input" value={item.unit_price} required min={0}
                            onChange={e => handleItemChange(index, 'unit_price', e.target.value)} />
                        </td>
                        <td style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 600 }}>
                          {new Intl.NumberFormat('ja-JP').format(item.amount)}
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <button type="button" onClick={() => removeItem(item.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-error)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'var(--bg-surface-2)' }}>
                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>合計 (Tổng tiền):</td>
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
