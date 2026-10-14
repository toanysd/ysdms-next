'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Save, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Quotation, QuotationLine, QuotationStatus, QuotationType } from '../types'

type Props = {
  caseId: string
  companyId: string | null
  initialData: Quotation | null
  onClose: () => void
  onSuccess: () => void
  currentUserId: string | null
}

type ProductOption = {
  product_id: string
  product_code: string
  product_name: string
  company_id: string | null
  design_revisions?: { revision_id: string }[]
}

export default function QuotationFormModal({ caseId, companyId, initialData, onClose, onSuccess }: Props) {
  const t = useTranslations()
  const isEdit = !!initialData
  const supabase = createClient()
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductOption[]>([])
  const [employees, setEmployees] = useState<{ employee_id: string; employee_code: string; employee_name: string }[]>([])

  useEffect(() => {
    async function loadOptions() {
      const [prodRes, empRes] = await Promise.all([
        supabase
          .from('products')
          .select('product_id, product_code, product_name, company_id, design_revisions!design_revisions_product_id_fkey(revision_id)')
          .order('product_code')
          .limit(500),
        supabase
          .from('employees')
          .select('employee_id, employee_code, employee_name')
          .order('employee_code'),
      ])
      if (prodRes.data) setProducts(prodRes.data as any)
      if (empRes.data) setEmployees(empRes.data)
    }
    loadOptions()
  }, [supabase])

  const filteredProducts = companyId
    ? products.filter(p => !p.company_id || p.company_id === companyId)
    : products

  const ITEM_TYPES = [
    { value: 'DESIGN_FEE', labelKey: 'Cases.ItemTypes.DESIGN_FEE' },
    { value: 'PROTOTYPE', labelKey: 'Cases.ItemTypes.PROTOTYPE' },
    { value: 'MOLD', labelKey: 'Cases.ItemTypes.MOLD' },
    { value: 'PRODUCT', labelKey: 'Cases.ItemTypes.PRODUCT' },
    { value: 'OTHER', labelKey: 'Cases.ItemTypes.OTHER' }
  ]

  const defaultLines: QuotationLine[] = initialData?.quotation_lines?.length
    ? initialData.quotation_lines
    : [{ line_no: 1, item_type: 'MOLD', product_id: null, design_revision_id: null, model_code: null, description: '', quantity: 1, unit_price: 0, amount: 0 }]

  const normalizedInitialStatus = (initialData?.status
    ? initialData.status.toUpperCase()
    : 'DRAFT') as QuotationStatus

  const [formData, setFormData] = useState<{
    quotation_no: string
    quotation_type: QuotationType
    version: number
    quote_date: string
    valid_until: string
    currency: string
    status: QuotationStatus
    prepared_by: string
    notes: string
    lines: QuotationLine[]
  }>({
    quotation_no: initialData?.quotation_no || '',
    quotation_type: initialData?.quotation_type || 'SET',
    version: initialData?.version || 1,
    quote_date: initialData?.quote_date || new Date().toISOString().split('T')[0],
    valid_until: initialData?.valid_until || '',
    currency: initialData?.currency || 'JPY',
    status: normalizedInitialStatus,
    prepared_by: initialData?.prepared_by || '',
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

  const handleProductSelect = (index: number, productId: string) => {
    const newLines = [...formData.lines]
    const prod = products.find(p => p.product_id === productId)
    newLines[index] = {
      ...newLines[index],
      product_id: prod ? prod.product_id : null,
      design_revision_id: prod?.design_revisions?.[0]?.revision_id || null,
      model_code: prod ? prod.product_code : null,
    }
    setFormData({ ...formData, lines: newLines })
  }

  const addLine = () => {
    const maxLineNo = formData.lines.reduce((max, l) => Math.max(max, l.line_no), 0)
    setFormData({
      ...formData,
      lines: [
        ...formData.lines,
        {
          line_no: maxLineNo + 1,
          item_type: 'OTHER',
          product_id: null,
          design_revision_id: null,
          model_code: null,
          description: '',
          quantity: 1,
          unit_price: 0,
          amount: 0,
        },
      ],
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
      setError(t('Cases.customerInfoError'))
      setSaving(false)
      return
    }

    try {
      // quotations_prepared_by_fkey references public.employees(employee_id), NOT auth.users(id)
      const payload = {
        case_id: caseId,
        company_id: companyId,
        quotation_no: formData.quotation_no,
        quotation_type: formData.quotation_type,
        quote_date: formData.quote_date || null,
        valid_until: formData.valid_until || null,
        total_amount: totalAmount,
        status: formData.status,
        notes: formData.notes,
        prepared_by: formData.prepared_by || null,
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
        if (!insData) throw new Error(t('Cases.quotationIdError'))
        
        targetQuotationId = insData.quotation_id
      }

      // Insert new lines with product_id, design_revision_id, model_code
      if (formData.lines.length > 0) {
        const linesToInsert = formData.lines.map((line, idx) => ({
          quotation_id: targetQuotationId,
          line_no: idx + 1,
          item_type: line.item_type,
          product_id: line.product_id || null,
          design_revision_id: line.design_revision_id || null,
          model_code: line.model_code || null,
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
      setError(err.message || t('Cases.saveQuotationError'))
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
        width: '100%', maxWidth: 960, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', padding: 0
      }}>
        
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border-default)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>
            <span>{isEdit ? t('Cases.editQuotation') : t('Cases.newQuotation')}</span>
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
                <label className="form-label">{t('Cases.quotationNo')}</label>
                <input required className="form-input" value={formData.quotation_no}
                  onChange={e => setFormData({ ...formData, quotation_no: e.target.value })}
                  placeholder="YSD-Q-2026-001" />
              </div>

              <div className="form-field">
                <label className="form-label">見積種別 (Type)</label>
                <select className="form-input" value={formData.quotation_type}
                  onChange={e => setFormData({ ...formData, quotation_type: e.target.value as QuotationType })}>
                  <option value="SET">SET (金型＋製品一括)</option>
                  <option value="MOLD">MOLD (金型・抜型のみ)</option>
                  <option value="TRAY">TRAY (トレイ製品のみ)</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Cases.quoteDate')}</label>
                <input type="date" required className="form-input" value={formData.quote_date}
                  onChange={e => setFormData({ ...formData, quote_date: e.target.value })} />
              </div>

              <div className="form-field">
                <label className="form-label">{t('Cases.validUntil')}</label>
                <input type="date" className="form-input" value={formData.valid_until}
                  onChange={e => setFormData({ ...formData, valid_until: e.target.value })} />
              </div>

              <div className="form-field">
                <label className="form-label">作成担当 (Prepared By)</label>
                <select className="form-input" value={formData.prepared_by}
                  onChange={e => setFormData({ ...formData, prepared_by: e.target.value })}>
                  <option value="">— 未選択 —</option>
                  {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      [{emp.employee_code}] {emp.employee_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Cases.status')}</label>
                <select className="form-input" value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as QuotationStatus })}>
                  <option value="DRAFT">{t('Cases.QuotationStatus.draft')}</option>
                  <option value="SENT">{t('Cases.QuotationStatus.sent')}</option>
                  <option value="APPROVED">{t('Cases.QuotationStatus.accepted')}</option>
                  <option value="REJECTED">{t('Cases.QuotationStatus.rejected')}</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ margin: 0, fontSize: 14 }}>{t('Cases.quotationLines')}</h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>
                  <Plus size={14} /> {t('Cases.add')}
                </button>
              </div>
              
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 130 }}>{t('Cases.itemType')}</th>
                      <th style={{ width: 190 }}>対象製品 (Product / 型番)</th>
                      <th>{t('Cases.itemDesc')}</th>
                      <th style={{ width: 80 }}>{t('Cases.qty')}</th>
                      <th style={{ width: 110 }}>{t('Cases.unitPrice')}</th>
                      <th style={{ width: 110 }}>{t('Cases.amount')}</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.lines.map((line, index) => (
                      <tr key={index}>
                        <td>
                          <select className="form-input" value={line.item_type} required
                            onChange={e => handleLineChange(index, 'item_type', e.target.value)}>
                            {ITEM_TYPES.map(tType => <option key={tType.value} value={tType.value}>{t(tType.labelKey)}</option>)}
                          </select>
                        </td>
                        <td>
                          <select className="form-input" value={line.product_id || ''}
                            onChange={e => handleProductSelect(index, e.target.value)}>
                            <option value="">— 製品選択 —</option>
                            {filteredProducts.map(p => (
                              <option key={p.product_id} value={p.product_id}>
                                [{p.product_code}] {p.product_name}
                              </option>
                            ))}
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
                      <td colSpan={5} style={{ textAlign: 'right', fontWeight: 600 }}>{t('Cases.totalAmount')}:</td>
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
              <label className="form-label">{t('Cases.notes')}</label>
              <textarea className="form-textarea" rows={3} value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border-default)',
          display: 'flex', justifyContent: 'flex-end', gap: 12, background: 'var(--bg-surface)'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            {t('Cases.cancel')}
          </button>
          <button type="submit" form="quotation-form" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? t('Cases.saving') : t('Cases.save')}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
