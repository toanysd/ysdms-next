'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { X, Calculator, Sparkles, Building2, Layers, Save, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { QuotationLineEditor, EditableQuotationLine } from './QuotationLineEditor'
import { calculateMoldPrice, calculateTrayUnitPrice, DesignRevisionSpec } from '@/lib/quotation-engine'

interface CreateQuotationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newQuotationId?: string) => void
}

interface CompanyOption {
  company_id: string
  company_code: string
  company_name: string
}

interface ProductOption {
  product_id: string
  product_code: string
  product_name: string
  company_id: string
  design_revisions?: DesignRevisionSpec[]
}

export function CreateQuotationModal({ isOpen, onClose, onSuccess }: CreateQuotationModalProps) {
  const t = useTranslations('Quotations')
  const supabase = createClient()

  // Form State
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quotationNo, setQuotationNo] = useState('')
  const [quotationType, setQuotationType] = useState<'MOLD' | 'TRAY' | 'SET'>('SET')
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().slice(0, 10))
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().slice(0, 10)
  })
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<EditableQuotationLine[]>([])
  const [calculatedExtra, setCalculatedExtra] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate Quotation No
  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      const yymm = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`
      const rnd = Math.floor(100 + Math.random() * 900)
      setQuotationNo(`EST-${yymm}-${rnd}`)
    }
  }, [isOpen])

  // Load Companies & Products
  useEffect(() => {
    if (!isOpen) return
    async function loadMasterData() {
      setLoading(true)
      try {
        const { data: compData } = await supabase
          .from('companies')
          .select('company_id, company_code, company_name')
          .order('company_name', { ascending: true })

        if (compData) setCompanies(compData)

        const { data: prodData } = await supabase
          .from('products')
          .select(`
            product_id, product_code, product_name, company_id,
            design_revisions (
              revision_id, design_code, design_length, design_width, design_height, design_depth,
              cutline_length, cutline_width, corner_r, chamfer_c, pocket_numbers, cavity_count,
              has_separate_cutter, plug_type, plastic_type_designed, machine_feed_pitch_mm
            )
          `)
          .order('product_code', { ascending: true })

        if (prodData) setProducts(prodData as any)
      } catch (err: any) {
        console.error('Error loading master data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMasterData()
  }, [isOpen])

  // Filter products by selected company
  const filteredProducts = useMemo(() => {
    if (!selectedCompanyId) return products
    return products.filter((p) => p.company_id === selectedCompanyId)
  }, [products, selectedCompanyId])

  // Auto-Calculate Line Items from CAD Specs
  const handleAutoCalculate = () => {
    if (!selectedProductId) {
      alert('先に製品を選択してください (Vui lòng chọn sản phẩm trước)')
      return
    }

    const prod = products.find((p) => p.product_id === selectedProductId)
    const revs = prod?.design_revisions || []
    const latestRev = revs.length > 0 ? revs[0] : {}

    const moldResult = calculateMoldPrice(latestRev)
    const trayResult = calculateTrayUnitPrice(latestRev)

    setCalculatedExtra({
      moldCalc: moldResult,
      trayCalc: trayResult,
      appliedRevision: latestRev,
    })

    const generatedLines: EditableQuotationLine[] = []

    if (quotationType === 'MOLD' || quotationType === 'SET') {
      // 1. Mold Base Line
      generatedLines.push({
        line_no: generatedLines.length + 1,
        item_type: 'MOLD',
        description: `真空成形用アルミ金型 (${latestRev.design_length || 300}x${latestRev.design_width || 200}x${latestRev.design_height || 35}mm) Cavity x${latestRev.cavity_count || latestRev.pocket_numbers || 1}`,
        quantity: 1,
        unit_price: moldResult.moldBasePrice,
        amount: moldResult.moldBasePrice,
        notes: `A5052材 CNC切削加工`,
      })

      // 2. Cutter Line
      generatedLines.push({
        line_no: generatedLines.length + 1,
        item_type: 'CUTTER',
        description: `抜型 (Cutline: ${latestRev.cutline_length || 290}x${latestRev.cutline_width || 190}mm R${latestRev.corner_r || 10})`,
        quantity: 1,
        unit_price: moldResult.cutterPrice,
        amount: moldResult.cutterPrice,
        notes: latestRev.has_separate_cutter ? '別体抜型' : 'インライン抜型',
      })

      // 3. Plug Line (if applicable)
      if (moldResult.plugPrice > 0) {
        generatedLines.push({
          line_no: generatedLines.length + 1,
          item_type: 'PLUG',
          description: `プラグアシスト治具 (${latestRev.plug_type || '樹脂プラグ'})`,
          quantity: 1,
          unit_price: moldResult.plugPrice,
          amount: moldResult.plugPrice,
          notes: '成形補助プラグ',
        })
      }

      // 4. Sample Trial Line
      generatedLines.push({
        line_no: generatedLines.length + 1,
        item_type: 'SAMPLE',
        description: `試作成形・サンプル作成一式 (検査レポート付き)`,
        quantity: 1,
        unit_price: 15000,
        amount: 15000,
        notes: '初期サンプル10ショット',
      })
    }

    if (quotationType === 'TRAY' || quotationType === 'SET') {
      // 5. Tray Product Line
      generatedLines.push({
        line_no: generatedLines.length + 1,
        item_type: 'PRODUCT',
        description: `真空成形トレイ製品 (${latestRev.plastic_type_designed || 'PET 0.5t'} / ${trayResult.weightPerPcsGrams}g/枚)`,
        quantity: 5000,
        unit_price: trayResult.suggestedSellingPrice,
        amount: Math.round(5000 * trayResult.suggestedSellingPrice),
        notes: `ロット: 5,000枚基準`,
      })
    }

    setLines(generatedLines)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCompanyId) {
      setError('得意先を選択してください (Vui lòng chọn khách hàng)')
      return
    }
    if (lines.length === 0) {
      setError('少なくとも1つの明細行を入力してください (Vui lòng nhập ít nhất 1 dòng báo giá)')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const subtotal = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)
      const tax = Math.round(subtotal * 0.10)
      const totalAmount = subtotal + tax

      // 1. Insert Quotation Header
      const { data: qData, error: qErr } = await supabase
        .from('quotations')
        .insert({
          quotation_no: quotationNo,
          company_id: selectedCompanyId,
          quotation_type: quotationType,
          quote_date: quoteDate,
          valid_until: validUntil,
          status: 'DRAFT',
          total_amount: totalAmount,
          notes,
          extra_json: calculatedExtra,
        })
        .select('quotation_id')
        .single()

      if (qErr) throw qErr

      const newId = qData.quotation_id

      // 2. Insert Quotation Lines
      const lineRows = lines.map((l, i) => ({
        quotation_id: newId,
        line_no: i + 1,
        item_type: l.item_type,
        description: l.description,
        quantity: l.quantity,
        unit_price: l.unit_price,
        amount: l.amount,
        notes: l.notes,
      }))

      const { error: linesErr } = await supabase.from('quotation_lines').insert(lineRows)
      if (linesErr) throw linesErr

      onSuccess(newId)
      onClose()
    } catch (err: any) {
      console.error('Error saving quotation:', err)
      setError(err?.message || '見積書の保存中にエラーが発生しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: 16,
    }}>
      <div style={{
        background: 'var(--bg-surface, #ffffff)', borderRadius: 8,
        maxWidth: 880, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid var(--border-default, #e2e8f0)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 18px', borderBottom: '1px solid var(--border-default, #e2e8f0)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface-2, #f8fafc)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} style={{ color: 'var(--accent, #0D9488)' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('newQuotation')} (新規御見積書作成)
            </span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ padding: '8px 12px', background: '#FEE2E2', color: '#DC2626', borderRadius: 4, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Top Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {/* Quotation No */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                {t('quotationNo')}
              </label>
              <input
                type="text"
                value={quotationNo}
                onChange={(e) => setQuotationNo(e.target.value)}
                className="form-input"
                required
                style={{ fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>

            {/* Customer */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                {t('customerName')} *
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => {
                  setSelectedCompanyId(e.target.value)
                  setSelectedProductId('')
                }}
                className="form-input"
                required
              >
                <option value="">-- {t('selectCustomer')} --</option>
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>
                    [{c.company_code}] {c.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quotation Type */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                {t('quotationType')}
              </label>
              <select
                value={quotationType}
                onChange={(e) => setQuotationType(e.target.value as any)}
                className="form-input"
              >
                <option value="SET">{t('setQuotation')} (金型＋製品)</option>
                <option value="MOLD">{t('moldQuotation')} (金型・抜型のみ)</option>
                <option value="TRAY">{t('trayQuotation')} (トレイ製品のみ)</option>
              </select>
            </div>

            {/* Quote Date */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                {t('quoteDate')}
              </label>
              <input
                type="date"
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Valid Until */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                {t('validUntil')}
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* ── Auto-Calculation Trigger from Product CAD Specs ── */}
          <div className="card-flat" style={{ padding: '10px 14px', background: 'var(--tint-teal-bg, #f0fdfa)', border: '1px solid var(--tint-teal-border, #99f6e4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
                <Sparkles size={16} style={{ color: 'var(--accent, #0D9488)' }} />
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--tint-teal-text, #0f766e)', display: 'block', marginBottom: 2 }}>
                    CAD仕様から自動見積計算 (Auto-Pricing Engine)
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="form-input"
                    style={{ height: 28, fontSize: 11 }}
                  >
                    <option value="">-- {t('selectProduct')} --</option>
                    {filteredProducts.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        [{p.product_code}] {p.product_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoCalculate}
                className="btn btn-primary"
                style={{ height: 30, padding: '0 14px', fontSize: 11, gap: 5 }}
              >
                <Calculator size={13} />
                <span>{t('autoCalculate')}</span>
              </button>
            </div>
          </div>

          {/* ── Line Items Editor ── */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {t('lineItems')}
            </div>
            <QuotationLineEditor lines={lines} onChange={setLines} />
          </div>

          {/* Notes & Terms */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
              {t('notesAndTerms')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              rows={2}
              placeholder="お取引条件、納入場所、特記事項など..."
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 6, borderTop: '1px solid var(--border-default)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting}
              style={{ fontSize: 12, padding: '6px 16px' }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ fontSize: 12, padding: '6px 18px', gap: 5 }}
            >
              <Save size={13} />
              <span>{submitting ? '保存中...' : t('saveQuotation')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
