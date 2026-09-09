'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { X, Calculator, Sparkles, Building2, Layers, Save, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { QuotationLineEditor, EditableQuotationLine } from './QuotationLineEditor'
import {
  calculateMoldPrice,
  calculateTrayUnitPrice,
  resolveDimensions,
  resolvePlasticSpec,
  DesignRevisionSpec,
} from '@/lib/quotation-engine'

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

  // M26: Mold Pricing Options State
  const [freeSampleTrial, setFreeSampleTrial] = useState(false)
  const [isExistingCutter, setIsExistingCutter] = useState(false)
  const [moldConstruction, setMoldConstruction] = useState<'TOP_FLANGE' | 'SKIRTED'>('TOP_FLANGE')
  const [moldApplication, setMoldApplication] = useState<'STANDARD' | 'DEDICATED'>('STANDARD')
  const [toastNotification, setToastNotification] = useState<{
    message: string
    description?: string
  } | null>(null)

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => setToastNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toastNotification])

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
              has_separate_cutter, plug_type, plastic_type_designed, machine_feed_pitch_mm,
              thickness_mm, legacy_specs
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

  // When product changes, auto-set company if empty
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId)
    if (productId && !selectedCompanyId) {
      const prod = products.find((p) => p.product_id === productId)
      if (prod && prod.company_id) {
        setSelectedCompanyId(prod.company_id)
      }
    }
  }

  // Auto-Calculate Line Items from CAD Specs
  const handleAutoCalculate = () => {
    if (!selectedProductId) {
      alert('先に製品を選択してください (Vui lòng chọn sản phẩm trước)')
      return
    }

    const prod = products.find((p) => p.product_id === selectedProductId)
    const revs = prod?.design_revisions || []
    const latestRev = revs.length > 0 ? revs[0] : {}
    const company = companies.find((c) => c.company_id === selectedCompanyId)
    const companyCode = company?.company_code

    const targetLot = 5000 // Standard baseline lot for quotation
    const moldResult = calculateMoldPrice(latestRev, {
      constructionType: moldConstruction,
      applicationType: moldApplication,
      isExistingCutter,
      freeSampleTrial,
      firstLotQuantity: targetLot,
    })
    const trayResult = calculateTrayUnitPrice(latestRev, {
      lotQuantity: targetLot,
      companyCode,
    })

    const dim = resolveDimensions(latestRev)
    const plastic = resolvePlasticSpec(latestRev)

    setCalculatedExtra({
      moldCalc: moldResult,
      trayCalc: trayResult,
      appliedRevision: latestRev,
      moldOptions: {
        constructionType: moldConstruction,
        applicationType: moldApplication,
        isExistingCutter,
        freeSampleTrial,
      },
    })

    const generatedLines: EditableQuotationLine[] = []

    if (quotationType === 'MOLD' || quotationType === 'SET') {
      // 1. Mold Base Line
      const moldTypeLabel = `${moldConstruction === 'TOP_FLANGE' ? '天フランジ' : 'スカート付き'}${moldApplication === 'STANDARD' ? '汎用' : '専用'}`
      generatedLines.push({
        line_no: generatedLines.length + 1,
        item_type: 'MOLD',
        description: `真空成形用アルミ金型一式 (${dim.length}x${dim.width}x${dim.height}mm Cavity x${dim.cavityCount})`,
        quantity: 1,
        unit_price: moldResult.moldBasePrice,
        amount: moldResult.moldBasePrice,
        notes: `${moldTypeLabel}型 (A5052材 CNC切削加工)${moldResult.lotDiscount > 0 ? ` ※発注ロット値引き -¥${moldResult.lotDiscount.toLocaleString()} 適用済` : ''}`,
      })

      // 2. Cutter Line
      const cutterDesc = isExistingCutter
        ? '既存抜型を使用 (新規抜型費用なし)'
        : latestRev.has_separate_cutter
        ? '別体抜型 (独立トムソン刃)'
        : 'インライン抜型一式 (金型基本価格に含む)'

      generatedLines.push({
        line_no: generatedLines.length + 1,
        item_type: 'CUTTER',
        description: `抜型 (Cutline: ${dim.cutlineLength}x${dim.cutlineWidth}mm R${dim.cornerR})`,
        quantity: 1,
        unit_price: moldResult.cutterPrice,
        amount: moldResult.cutterPrice,
        notes: cutterDesc,
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
        description: `試作成形・サンプル作成一式 (${freeSampleTrial ? '無償提供 2〜10枚' : '検査レポート付き'})`,
        quantity: 1,
        unit_price: moldResult.samplePrice,
        amount: moldResult.samplePrice,
        notes: freeSampleTrial ? '無償提供 (費用なし)' : '初期サンプル10ショット',
      })
    }

    if (quotationType === 'TRAY' || quotationType === 'SET') {
      // 5. Tray Product Line
      const plasticLabel = latestRev.plastic_type_designed || `${plastic.spec.label} ${plastic.thicknessMm}t`
      generatedLines.push({
        line_no: generatedLines.length + 1,
        item_type: 'PRODUCT',
        description: `真空成形トレイ製品 (${plasticLabel} / ${trayResult.weightPerPcsGrams}g/枚)`,
        quantity: targetLot,
        unit_price: trayResult.suggestedSellingPrice,
        amount: Math.round(targetLot * trayResult.suggestedSellingPrice),
        notes: `ロット: ${targetLot.toLocaleString()}枚基準 (材料: ¥${trayResult.rawMaterialCostPerPcs} + 包装: ¥${trayResult.packingCostPerPcs} + 成形: ¥${trayResult.formingProcessCostPerPcs})`,
      })
    }

    setLines(generatedLines)

    let toastSummary = ''
    if (quotationType === 'MOLD') {
      toastSummary = `金型合計: ¥${moldResult.totalToolingPrice.toLocaleString()} (型本体: ¥${moldResult.moldBasePrice.toLocaleString()})`
    } else if (quotationType === 'TRAY') {
      toastSummary = `トレイ単価: ¥${trayResult.suggestedSellingPrice}/枚 (ロット: ${targetLot.toLocaleString()}枚)`
    } else {
      toastSummary = `金型合計: ¥${moldResult.totalToolingPrice.toLocaleString()} / トレイ単価: ¥${trayResult.suggestedSellingPrice}/枚`
    }

    setToastNotification({
      message: `CAD仕様から自動計算しました ✅ (${toastSummary})`,
      description: quotationType === 'TRAY' ? trayResult.breakdownSummary : quotationType === 'MOLD' ? moldResult.breakdownSummary : `${moldResult.breakdownSummary} ｜ ${trayResult.breakdownSummary}`,
    })
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
          <div
            className="card-flat"
            style={{
              padding: '12px 14px',
              background: 'var(--tint-teal-bg, #f0fdfa)',
              border: '1px solid var(--tint-teal-border, #99f6e4)',
              borderRadius: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {/* Header & Product Select & Calc Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
                <Sparkles size={16} style={{ color: 'var(--accent, #0D9488)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--tint-teal-text, #0f766e)', display: 'block', marginBottom: 2 }}>
                    CAD仕様から自動見積計算 (Auto-Pricing Engine)
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
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
                style={{ height: 30, padding: '0 16px', fontSize: 12, fontWeight: 600, gap: 6 }}
              >
                <Calculator size={14} />
                <span>{t('autoCalculate')}</span>
              </button>
            </div>

            {/* M26: Mold Pricing Options Controls (when quotationType includes MOLD) */}
            {(quotationType === 'MOLD' || quotationType === 'SET') && (
              <div
                style={{
                  padding: '8px 10px',
                  background: 'rgba(255, 255, 255, 0.75)',
                  borderRadius: 4,
                  border: '1px dashed var(--tint-teal-border, #99f6e4)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 14,
                  fontSize: 11,
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--tint-teal-text, #0f766e)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Layers size={13} /> 金型設定:
                </span>

                {/* Structure: TOP_FLANGE vs SKIRTED */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>構造:</span>
                  <select
                    value={moldConstruction}
                    onChange={(e) => setMoldConstruction(e.target.value as any)}
                    className="form-input"
                    style={{ height: 24, padding: '0 6px', fontSize: 11 }}
                  >
                    <option value="TOP_FLANGE">天フランジ型 (Top Flange)</option>
                    <option value="SKIRTED">スカート付き型 (Skirted)</option>
                  </select>
                </div>

                {/* Application: STANDARD vs DEDICATED */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>用途:</span>
                  <select
                    value={moldApplication}
                    onChange={(e) => setMoldApplication(e.target.value as any)}
                    className="form-input"
                    style={{ height: 24, padding: '0 6px', fontSize: 11 }}
                  >
                    <option value="STANDARD">汎用型 (標準)</option>
                    <option value="DEDICATED">専用型 (Dedicated)</option>
                  </select>
                </div>

                {/* Checkbox: Existing Cutter */}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={isExistingCutter}
                    onChange={(e) => setIsExistingCutter(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: isExistingCutter ? 700 : 400, color: isExistingCutter ? '#0D9488' : 'var(--text-primary)' }}>
                    既存抜型を使用 (-¥50,000)
                  </span>
                </label>

                {/* Checkbox: Free Sample Trial */}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={freeSampleTrial}
                    onChange={(e) => setFreeSampleTrial(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: freeSampleTrial ? 700 : 400, color: freeSampleTrial ? '#0D9488' : 'var(--text-primary)' }}>
                    サンプル無償提供 (¥0)
                  </span>
                </label>
              </div>
            )}

            {/* M26: Visual Toast Feedback Banner */}
            {toastNotification && (
              <div
                style={{
                  padding: '8px 12px',
                  background: '#ECFDF5',
                  border: '1px solid #6EE7B7',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CheckCircle2 size={16} style={{ color: '#059669', marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>
                      {toastNotification.message}
                    </div>
                    {toastNotification.description && (
                      <div style={{ fontSize: 11, color: '#047857', marginTop: 2 }}>
                        {toastNotification.description}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setToastNotification(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#059669', padding: 0 }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
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
