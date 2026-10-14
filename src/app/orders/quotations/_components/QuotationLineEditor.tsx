'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Trash2, ArrowUp, ArrowDown, Calculator } from 'lucide-react'

export interface EditableQuotationLine {
  line_id?: string
  line_no: number
  item_type: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  notes?: string
  product_id?: string | null
  design_revision_id?: string | null
  model_code?: string | null
}

export interface QuotationProductRef {
  product_id: string
  product_code: string
  product_name: string
  design_revisions?: { revision_id?: string; design_code?: string | null }[]
}

interface QuotationLineEditorProps {
  lines: EditableQuotationLine[]
  onChange: (lines: EditableQuotationLine[]) => void
  readOnly?: boolean
  products?: QuotationProductRef[]
  defaultProduct?: {
    product_id: string
    product_code: string
    design_revision_id?: string | null
  } | null
}

const ITEM_TYPES = [
  { value: 'MOLD', labelJA: '金型・治具 (MOLD)' },
  { value: 'PRODUCT', labelJA: 'トレイ製品 (PRODUCT)' },
  { value: 'PROTOTYPE', labelJA: '試作成形 (PROTOTYPE)' },
  { value: 'DESIGN_FEE', labelJA: '設計費 (DESIGN_FEE)' },
  { value: 'OTHER', labelJA: '抜型・その他 (OTHER)' },
]

export function QuotationLineEditor({
  lines,
  onChange,
  readOnly = false,
  products = [],
  defaultProduct = null,
}: QuotationLineEditorProps) {
  const t = useTranslations('Quotations')

  const handleLineChange = (index: number, field: keyof EditableQuotationLine, value: any) => {
    const next = [...lines]
    const current = { ...next[index], [field]: value }

    // Auto-calculate amount if quantity or unit_price changes
    if (field === 'quantity' || field === 'unit_price') {
      const q = field === 'quantity' ? Number(value) : Number(current.quantity)
      const p = field === 'unit_price' ? Number(value) : Number(current.unit_price)
      current.amount = Math.round(q * p)
    }

    next[index] = current
    onChange(next)
  }

  const handleProductSelect = (index: number, productId: string) => {
    const next = [...lines]
    const matched = products.find((p) => p.product_id === productId)
    const revId = matched?.design_revisions?.[0]?.revision_id || null
    next[index] = {
      ...next[index],
      product_id: matched ? matched.product_id : null,
      design_revision_id: revId,
      model_code: matched ? matched.product_code : (next[index].model_code || null),
    }
    onChange(next)
  }

  const handleAddLine = () => {
    const newLine: EditableQuotationLine = {
      line_no: lines.length + 1,
      item_type: 'MOLD',
      description: '',
      quantity: 1,
      unit_price: 0,
      amount: 0,
      notes: '',
      product_id: defaultProduct?.product_id || null,
      design_revision_id: defaultProduct?.design_revision_id || null,
      model_code: defaultProduct?.product_code || null,
    }
    onChange([...lines, newLine])
  }

  const handleDeleteLine = (index: number) => {
    const next = lines.filter((_, i) => i !== index).map((l, i) => ({ ...l, line_no: i + 1 }))
    onChange(next)
  }

  const subtotal = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)
  const tax = Math.round(subtotal * 0.10)
  const grandTotal = subtotal + tax

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* ── Table of Lines ── */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-default, #e2e8f0)', borderRadius: 6 }}>
        <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center' }}>No</th>
              <th style={{ width: 135 }}>種別 (Type)</th>
              <th style={{ width: 170 }}>対象製品 (Product / 型番)</th>
              <th>品名・規格仕様 (Description)</th>
              <th style={{ width: 80, textAlign: 'right' }}>数量 (Qty)</th>
              <th style={{ width: 105, textAlign: 'right' }}>単価 (¥)</th>
              <th style={{ width: 115, textAlign: 'right' }}>金額 (¥)</th>
              <th style={{ width: 130 }}>備考 (Notes)</th>
              {!readOnly && <th style={{ width: 40, textAlign: 'center' }}></th>}
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 8 : 9} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                  明細行がありません。「行追加」または「自動計算」をクリックしてください。
                </td>
              </tr>
            ) : (
              lines.map((line, idx) => (
                <tr key={idx}>
                  {/* Line No */}
                  <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {line.line_no}
                  </td>

                  {/* Item Type */}
                  <td>
                    {readOnly ? (
                      <span className="badge badge--neutral" style={{ fontSize: 10 }}>{line.item_type}</span>
                    ) : (
                      <select
                        value={line.item_type}
                        onChange={(e) => handleLineChange(idx, 'item_type', e.target.value)}
                        className="form-input"
                        style={{ height: 26, fontSize: 11, padding: '0 4px' }}
                      >
                        {ITEM_TYPES.map((tItem) => (
                          <option key={tItem.value} value={tItem.value}>{tItem.labelJA}</option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* Target Product / Model Code */}
                  <td>
                    {readOnly ? (
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                        {line.model_code || '—'}
                      </span>
                    ) : products.length > 0 ? (
                      <select
                        value={line.product_id || ''}
                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                        className="form-input"
                        style={{ height: 26, fontSize: 11, padding: '0 4px', fontFamily: 'monospace' }}
                      >
                        <option value="">-- 製品選択 --</option>
                        {products.map((p) => (
                          <option key={p.product_id} value={p.product_id}>
                            {p.product_code} ({p.product_name})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={line.model_code || ''}
                        onChange={(e) => handleLineChange(idx, 'model_code', e.target.value)}
                        className="form-input"
                        placeholder="製品コード..."
                        style={{ height: 26, fontSize: 11, fontFamily: 'monospace' }}
                      />
                    )}
                  </td>

                  {/* Description */}
                  <td>
                    {readOnly ? (
                      <span style={{ fontWeight: 600 }}>{line.description}</span>
                    ) : (
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                        className="form-input"
                        placeholder="例: 真空成形用アルミ金型 A5052 (300x200)"
                        style={{ height: 26, fontSize: 11 }}
                      />
                    )}
                  </td>

                  {/* Quantity */}
                  <td>
                    {readOnly ? (
                      <span style={{ fontFamily: 'monospace', textAlign: 'right', display: 'block' }}>{line.quantity}</span>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleLineChange(idx, 'quantity', Number(e.target.value))}
                        className="form-input"
                        style={{ height: 26, fontSize: 11, textAlign: 'right', fontFamily: 'monospace' }}
                      />
                    )}
                  </td>

                  {/* Unit Price */}
                  <td>
                    {readOnly ? (
                      <span style={{ fontFamily: 'monospace', textAlign: 'right', display: 'block' }}>¥{Number(line.unit_price).toLocaleString()}</span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        value={line.unit_price}
                        onChange={(e) => handleLineChange(idx, 'unit_price', Number(e.target.value))}
                        className="form-input"
                        style={{ height: 26, fontSize: 11, textAlign: 'right', fontFamily: 'monospace' }}
                      />
                    )}
                  </td>

                  {/* Amount */}
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ¥{Number(line.amount).toLocaleString()}
                  </td>

                  {/* Notes */}
                  <td>
                    {readOnly ? (
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{line.notes || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={line.notes || ''}
                        onChange={(e) => handleLineChange(idx, 'notes', e.target.value)}
                        className="form-input"
                        placeholder="備考..."
                        style={{ height: 26, fontSize: 11 }}
                      />
                    )}
                  </td>

                  {/* Actions */}
                  {!readOnly && (
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteLine(idx)}
                        style={{ color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer', padding: 2 }}
                        title="行削除"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Line Button & Total Summary ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {!readOnly && (
          <button
            type="button"
            onClick={handleAddLine}
            className="btn btn-secondary"
            style={{ fontSize: 11, height: 28, gap: 4 }}
          >
            <Plus size={12} /> {t('addItem')}
          </button>
        )}

        <div className="card-flat" style={{ width: 280, padding: '10px 14px', marginLeft: 'auto', background: 'var(--bg-surface-2, #f8fafc)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('subtotal')}</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>¥{subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('taxAmount')}</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>¥{tax.toLocaleString()}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800,
            borderTop: '1px solid var(--border-default, #e2e8f0)', paddingTop: 6, color: 'var(--accent, #0D9488)'
          }}>
            <span>{t('grandTotal')}</span>
            <span style={{ fontFamily: 'monospace' }}>¥{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
