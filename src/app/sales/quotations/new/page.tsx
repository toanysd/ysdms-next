'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createQuotationAction } from '../actions'

export default function NewQuotationPage() {
  const t = useTranslations('Quotations')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [lines, setLines] = useState<any[]>([])

  const addLine = () => {
    setLines([...lines, { item_type: 'MOLD', description: '', quantity: 1, unit_price: 0 }])
  }

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index))
  }

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines]
    newLines[index][field] = value
    setLines(newLines)
  }

  const totalAmount = lines.reduce((acc, line) => {
    return acc + (Number(line.quantity) || 0) * (Number(line.unit_price) || 0)
  }, 0)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await createQuotationAction(formData, lines)
      if (res.success && res.data) {
        router.push(`/sales/quotations/${res.data.quotation_id}`)
      } else {
        setError(res.error || 'Unknown error occurred')
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary flex items-center gap-1">
            <ArrowLeft size={16} />
            {t('back')}
          </button>
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            {t('new')}
          </h1>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 20px 16px' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-5xl mx-auto">
          {error && (
            <div className="badge badge--error p-3 text-sm">{error}</div>
          )}

          {/* Section 1: Header */}
          <div className="card-flat p-4">
            <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--accent)' }}>1. {t('tab_overview')}</h2>
            
            <div className="form-grid-2">
              <div>
                <label className="form-label">{t('col_customer')} *</label>
                <input type="text" name="company_id" className="form-input" placeholder="Company UUID..." required />
                <span className="text-xs text-slate-500 mt-1 block">Phase 2: Use async search here</span>
              </div>
              
              <div>
                <label className="form-label">{t('col_case')} (Optional)</label>
                <input type="text" name="case_id" className="form-input" placeholder="Case UUID..." />
              </div>

              <div>
                <label className="form-label">{t('col_type')} *</label>
                <select name="quotation_type" className="form-input" required defaultValue="MOLD_NEW">
                  <option value="MOLD_NEW">MOLD_NEW</option>
                  <option value="MOLD_REMAKE">MOLD_REMAKE</option>
                  <option value="TRAY_REPEAT">TRAY_REPEAT</option>
                  <option value="SERVICE">SERVICE</option>
                  <option value="STORAGE_FEE">STORAGE_FEE</option>
                </select>
              </div>

              <div>
                <label className="form-label">{t('col_date')} *</label>
                <input type="date" name="quote_date" className="form-input" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div>
                <label className="form-label">{t('col_valid_until')}</label>
                <input type="date" name="valid_until" className="form-input" />
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label">Notes</label>
              <textarea name="notes" className="form-textarea" rows={3}></textarea>
            </div>
          </div>

          {/* Section 2: Lines */}
          <div className="card-flat p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-bold" style={{ color: 'var(--accent)' }}>2. {t('tab_lines')}</h2>
              <button type="button" onClick={addLine} className="btn btn-secondary flex items-center gap-1 text-sm">
                <Plus size={14} />
                {t('btn_add_line')}
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>{t('col_line_no')}</th>
                  <th style={{ width: '15%' }}>{t('col_item_type')}</th>
                  <th style={{ width: '35%' }}>{t('col_desc')}</th>
                  <th style={{ width: '10%' }}>{t('col_qty')}</th>
                  <th style={{ width: '15%' }}>{t('col_unit_price')}</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Amount</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No lines added. Click "+ Add Line" to begin.
                    </td>
                  </tr>
                ) : (
                  lines.map((line, index) => {
                    const amount = (Number(line.quantity) || 0) * (Number(line.unit_price) || 0)
                    
                    return (
                      <tr key={index}>
                        <td className="text-center font-bold text-slate-500">{index + 1}</td>
                        <td>
                          <select 
                            className="form-input text-sm px-2 py-1" 
                            value={line.item_type}
                            onChange={(e) => updateLine(index, 'item_type', e.target.value)}
                          >
                            <option value="MOLD">MOLD</option>
                            <option value="PRODUCT">PRODUCT</option>
                            <option value="MATERIAL">MATERIAL</option>
                            <option value="SERVICE">SERVICE</option>
                            <option value="OTHER">OTHER</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-input text-sm px-2 py-1" 
                            placeholder="Description..."
                            value={line.description}
                            onChange={(e) => updateLine(index, 'description', e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-input text-sm px-2 py-1 text-right" 
                            min="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-input text-sm px-2 py-1 text-right" 
                            min="0"
                            value={line.unit_price}
                            onChange={(e) => updateLine(index, 'unit_price', e.target.value)}
                            required
                          />
                        </td>
                        <td className="text-right font-mono font-bold">
                          {new Intl.NumberFormat('ja-JP').format(amount)}
                        </td>
                        <td className="text-center">
                          <button 
                            type="button" 
                            onClick={() => removeLine(index)}
                            className="text-red-500 hover:text-red-700"
                            title={t('btn_remove')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 min-w-[300px]">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-slate-600">{t('col_amount')}:</span>
                  <span className="font-mono font-bold text-slate-900 text-xl">
                    {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Link href="/sales/quotations" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={isPending} className="btn btn-primary flex items-center gap-1.5">
              <Save size={16} />
              {isPending ? 'Saving...' : 'Save Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
