'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, ArrowUpFromLine, FileText, Download, Save,
  Building2, Calendar, CheckCircle2, Clock, XCircle, AlertCircle,
  Calculator, Sparkles, RefreshCw, Layers
} from 'lucide-react'
import Link from 'next/link'
import { QuotationLineEditor, EditableQuotationLine } from '../_components/QuotationLineEditor'

interface QuotationDetailPageProps {
  params: Promise<{ id: string }>
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', labelJA: '下書き (Draft)', bg: '#F1F5F9', color: '#475569' },
  { value: 'SENT', labelJA: '送付済 (Sent)', bg: '#EFF6FF', color: '#2563EB' },
  { value: 'ACCEPTED', labelJA: '受注承諾 (Accepted)', bg: '#ECFDF5', color: '#059669' },
  { value: 'REJECTED', labelJA: '失注 (Rejected)', bg: '#FEF2F2', color: '#DC2626' },
  { value: 'EXPIRED', labelJA: '期限切れ (Expired)', bg: '#FFFBEB', color: '#D97706' },
]

export default function QuotationDetailPage({ params }: QuotationDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const t = useTranslations('Quotations')
  const supabase = createClient()

  const [quotation, setQuotation] = useState<any>(null)
  const [lines, setLines] = useState<EditableQuotationLine[]>([])
  const [status, setStatus] = useState('DRAFT')
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQuotation = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch Header
      const { data: qData, error: qErr } = await supabase
        .from('quotations')
        .select(`
          *,
          companies:companies!quotations_company_id_fkey ( company_id, company_name, company_code, tel, address ),
          employees:employees!quotations_prepared_by_fkey ( employee_id, employee_name )
        `)
        .eq('quotation_id', id)
        .single()

      if (qErr) throw qErr
      if (qData) {
        setQuotation(qData)
        setStatus(qData.status || 'DRAFT')
        setNotes(qData.notes || '')
        setValidUntil(qData.valid_until || '')
      }

      // 2. Fetch Lines
      const { data: lineData, error: lErr } = await supabase
        .from('quotation_lines')
        .select('*')
        .eq('quotation_id', id)
        .order('line_no', { ascending: true })

      if (lErr) throw lErr
      if (lineData) {
        setLines(lineData.map((l: any, idx: number) => ({
          line_id: l.line_id,
          line_no: l.line_no || idx + 1,
          item_type: l.item_type || 'MOLD',
          description: l.description || '',
          quantity: Number(l.quantity) || 1,
          unit_price: Number(l.unit_price) || 0,
          amount: Number(l.amount) || 0,
          notes: l.notes || '',
        })))
      }
    } catch (err: any) {
      console.error('Error loading quotation detail:', err)
      setError(err?.message || '見積書データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuotation()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    setError(null)

    try {
      const subtotal = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)
      const tax = Math.round(subtotal * 0.10)
      const totalAmount = subtotal + tax

      // 1. Update Header
      const { error: hErr } = await supabase
        .from('quotations')
        .update({
          status,
          notes,
          valid_until: validUntil || null,
          total_amount: totalAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('quotation_id', id)

      if (hErr) throw hErr

      // 2. Replace lines: delete old lines and re-insert
      const { error: delErr } = await supabase.from('quotation_lines').delete().eq('quotation_id', id)
      if (delErr) throw delErr

      if (lines.length > 0) {
        const lineRows = lines.map((l, i) => ({
          quotation_id: id,
          line_no: i + 1,
          item_type: l.item_type,
          description: l.description,
          quantity: l.quantity,
          unit_price: l.unit_price,
          amount: l.amount,
          notes: l.notes,
        }))

        const { error: insErr } = await supabase.from('quotation_lines').insert(lineRows)
        if (insErr) throw insErr
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving quotation changes:', err)
      setError(err?.message || '保存中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
        御見積書を読込中...
      </div>
    )
  }

  if (error || !quotation) {
    return (
      <div className="card-flat" style={{ padding: 24, textAlign: 'center', color: '#DC2626' }}>
        <AlertCircle size={20} style={{ margin: '0 auto 8px' }} />
        {error || '見積書が見つかりませんでした'}
        <div style={{ marginTop: 12 }}>
          <Link href="/orders/quotations" className="btn btn-secondary">
            {t('backToList')}
          </Link>
        </div>
      </div>
    )
  }

  const statusConf = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]
  const extraJson = quotation.extra_json

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── 1. BackBar & Navigation ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 10px', fontSize: 11, gap: 4 }}
          >
            <ArrowLeft size={12} />
            <span>戻る</span>
          </button>
          <Link
            href="/orders/quotations"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 10px', fontSize: 11, gap: 4 }}
          >
            <ArrowUpFromLine size={12} />
            <span>{t('quotationList')}</span>
          </Link>

          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: 'var(--accent, #0D9488)', marginLeft: 6 }}>
            {quotation.quotation_no}
          </span>

          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
            background: statusConf.bg, color: statusConf.color,
          }}>
            {statusConf.labelJA}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saveSuccess && (
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} /> 保存しました
            </span>
          )}

          <a
            href={`/api/quotations/${quotation.quotation_id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 12px', fontSize: 11, gap: 4, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <Download size={12} />
            <span>{t('exportPdf')}</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ height: 28, padding: '0 14px', fontSize: 11, gap: 4 }}
          >
            <Save size={12} />
            <span>{saving ? '保存中...' : '変更を保存'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Top Summary Card ── */}
      <div className="card-flat" style={{ padding: 14, flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {/* Customer */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('customerName')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
                {quotation.companies?.company_name || '得意先未設定'}
              </span>
            </div>
            {quotation.companies?.address && (
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{quotation.companies.address}</span>
            )}
          </div>

          {/* Quote Date & Validity */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('quoteDate')} / {t('validUntil')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>{quotation.quote_date}</span>
              <span style={{ color: 'var(--text-muted)' }}>〜</span>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="form-input"
                style={{ height: 24, fontSize: 11, width: 130 }}
              />
            </div>
          </div>

          {/* Status Select */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('updateStatus')}
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-input"
              style={{ height: 26, fontSize: 11 }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.labelJA}</option>
              ))}
            </select>
          </div>

          {/* Total Amount Badge */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('grandTotal')}
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 18, color: 'var(--accent, #0D9488)' }}>
              ¥ {Number(quotation.total_amount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. CAD Specs Breakdown (if available in extra_json) ── */}
      {extraJson?.appliedRevision && (
        <div className="card-flat" style={{ padding: '10px 14px', background: 'var(--tint-teal-bg, #f0fdfa)', border: '1px solid var(--tint-teal-border, #99f6e4)', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tint-teal-text, #0f766e)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Sparkles size={13} />
            <span>適用CAD仕様・原価積算パラメータ</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, fontSize: 11 }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>設計コード: </span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{extraJson.appliedRevision.design_code || '—'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>金型寸法: </span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {extraJson.appliedRevision.design_length} × {extraJson.appliedRevision.design_width} × {extraJson.appliedRevision.design_height || 35} mm
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Cutline: </span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {extraJson.appliedRevision.cutline_length} × {extraJson.appliedRevision.cutline_width} mm
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>樹脂規格: </span>
              <span style={{ fontWeight: 700 }}>{extraJson.appliedRevision.plastic_type_designed || '—'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Main Line Items Editor ── */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto', padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileText size={15} style={{ color: 'var(--accent, #0D9488)' }} />
          <span>{t('lineItems')}</span>
        </div>

        <QuotationLineEditor lines={lines} onChange={setLines} />

        {/* Commercial Notes */}
        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
            {t('notesAndTerms')}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-textarea"
            rows={3}
            placeholder="お取引条件、納入場所、特記事項など..."
          />
        </div>
      </div>

    </div>
  )
}
