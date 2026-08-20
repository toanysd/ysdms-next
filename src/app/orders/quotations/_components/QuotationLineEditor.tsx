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
}

interface QuotationLineEditorProps {
  lines: EditableQuotationLine[]
  onChange: (lines: EditableQuotationLine[]) => void
  readOnly?: boolean
}

const ITEM_TYPES = [
  { value: 'MOLD', labelJA: '金型 (MOLD)' },
  { value: 'CUTTER', labelJA: '抜型 (CUTTER)' },
  { value: 'PLUG', labelJA: 'プラグ (PLUG)' },
  { value: 'PRODUCT', labelJA: 'トレイ製品 (PRODUCT)' },
  { value: 'SAMPLE', labelJA: '試作成形 (SAMPLE)' },
  { value: 'SHIPPING', labelJA: '運賃・梱包 (SHIPPING)' },
  { value: 'OTHER', labelJA: 'その他 (OTHER)' },
]

export function QuotationLineEditor({ lines, onChange, readOnly = false }: QuotationLineEditorProps) {
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

  const handleAddLine = () => {
    const newLine: EditableQuotationLine = {
      line_no: lines.length + 1,
      item_type: 'MOLD',
      description: '',
      quantity: 1,
      unit_price: 0,
      amount: 0,
      notes: '',
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
              <th style={{ width: 45, textAlign: 'center' }}>No</th>
              <th style={{ width: 140 }}>種別 (Type)</th>
              <th>品名・規格仕様 (Description)</th>
              <th style={{ width: 85, textAlign: 'right' }}>数量 (Qty)</th>
              <th style={{ width: 110, textAlign: 'right' }}>単価 (¥)</th>
              <th style={{ width: 125, textAlign: 'right' }}>金額 (¥)</th>
              <th style={{ width: 140 }}>備考 (Notes)</th>
              {!readOnly && <th style={{ width: 45, textAlign: 'center' }}></th>}
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 7 : 8} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
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
                        {ITEM_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.labelJA}</option>
                        ))}
                      </select>
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
