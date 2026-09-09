import Link from 'next/link'
import {
  ArrowLeft, ArrowUpFromLine, Building2, Calendar, FileText,
  AlertCircle, CheckCircle2, ArrowRight, UserCheck, MapPin, Sparkles, Layers
} from 'lucide-react'
import { getQuotationDetailAction, QuotationStatus } from '../actions'
import { QuotationHeaderActions } from './QuotationHeaderActions'

interface QuotationDetailPageProps {
  params: Promise<{ id: string }> | { id: string }
}

const STATUS_BADGES: Record<QuotationStatus, { labelJA: string; bg: string; color: string; border: string }> = {
  DRAFT: { labelJA: '下書き', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
  SENT: { labelJA: '送付済み', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  APPROVED: { labelJA: '承認済み', bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
  CONVERTED: { labelJA: '受注確定', bg: '#F3E8FF', color: '#7E22CE', border: '#D8B4FE' },
  REJECTED: { labelJA: '却下', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  EXPIRED: { labelJA: '期限切れ', bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
}

export default async function QuotationDetailPage({ params }: QuotationDetailPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  const res = await getQuotationDetailAction(id)

  if (!res.success || !res.data) {
    return (
      <div style={{ padding: 24 }}>
        <div className="card-flat" style={{ padding: 32, textAlign: 'center', color: '#DC2626' }}>
          <AlertCircle size={28} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>
            {res.message || '御見積書が見つかりませんでした'}
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: 13, color: 'var(--text-muted)' }}>
            指定された見積ID ({id}) のデータは存在しないか、削除された可能性があります。
          </p>
          <Link href="/orders/quotations" className="btn btn-secondary">
            <ArrowUpFromLine size={14} />
            <span>見積書一覧へ戻る</span>
          </Link>
        </div>
      </div>
    )
  }

  const quotation = res.data
  const statusCfg = STATUS_BADGES[quotation.status] || STATUS_BADGES.DRAFT

  // Tính toán số tiền
  const subtotal = quotation.lines.reduce((sum, line) => sum + (line.amount || 0), 0)
  const grandTotal = quotation.total_amount ? Number(quotation.total_amount) : subtotal
  const taxAmount = Math.max(0, grandTotal - subtotal)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── 1. Page Header (Rule 2 & Rule 3: Compact BackBar) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: 10,
          background: 'var(--bg-surface, #FFFFFF)',
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid var(--border-color, #E2E8F0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Link
            href="/orders/quotations"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 10px', fontSize: 11, gap: 4 }}
          >
            <ArrowLeft size={12} />
            <span>戻る</span>
          </Link>

          <Link
            href="/orders/quotations"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 10px', fontSize: 11, gap: 4 }}
          >
            <ArrowUpFromLine size={12} />
            <span>一覧</span>
          </Link>

          {/* Quotation No */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
            <FileText size={16} style={{ color: 'var(--accent, #0D9488)' }} />
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 900,
                fontSize: 16,
                color: 'var(--accent, #0D9488)',
                letterSpacing: '0.02em',
              }}
            >
              {quotation.quotation_no}
            </span>
            {quotation.revision_no > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'var(--bg-muted, #F1F5F9)',
                  color: 'var(--text-secondary, #475569)',
                  border: '1px solid var(--border-color, #E2E8F0)',
                }}
              >
                Rev.{quotation.revision_no}
              </span>
            )}
          </div>

          {/* Status Badge 6 Colors */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '2px 10px',
              borderRadius: 4,
              background: statusCfg.bg,
              color: statusCfg.color,
              border: `1px solid ${statusCfg.border}`,
              marginLeft: 4,
            }}
          >
            {statusCfg.labelJA}
          </span>
        </div>

        {/* Action Buttons (Client Component) */}
        <QuotationHeaderActions quotation={quotation} />
      </div>

      {/* ── 2. Converted Banner (Chỉ hiện khi status === 'CONVERTED') ── */}
      {quotation.status === 'CONVERTED' && quotation.orders && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            background: '#F3E8FF',
            border: '1px solid #D8B4FE',
            borderRadius: 8,
            color: '#581C87',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} style={{ color: '#7E22CE', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              ✅ この見積書は受注確定済みです。注文番号:
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#6B21A8',
                  marginLeft: 6,
                }}
              >
                {quotation.orders.order_no}
              </span>
            </span>
          </div>

          <Link
            href={`/orders/${quotation.orders.order_id}`}
            className="btn btn-primary"
            style={{
              height: 28,
              padding: '0 14px',
              fontSize: 11,
              fontWeight: 700,
              background: '#7E22CE',
              borderColor: '#6B21A8',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <span>注文詳細へ</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── 3. Top Compact Summary (RULE-UI-10 Paper Style) ── */}
      <div
        className="card-flat"
        style={{
          padding: '12px 16px',
          flexShrink: 0,
          background: 'var(--bg-surface, #FFFFFF)',
          border: '1px solid var(--border-color, #E2E8F0)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px 16px',
            fontSize: 12,
          }}
        >
          {/* Customer */}
          <div>
            <span style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2, fontWeight: 600 }}>
              得意先 (Customer)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} style={{ color: '#64748B' }} />
              <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary, #0F172A)' }}>
                {quotation.companies?.company_name || '得意先未設定'}
              </span>
              {quotation.companies?.company_code && (
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>
                  ({quotation.companies.company_code})
                </span>
              )}
            </div>
          </div>

          {/* Quote Date & Validity */}
          <div>
            <span style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2, fontWeight: 600 }}>
              見積日 / 有効期限 (Date & Validity)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} style={{ color: '#64748B' }} />
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{quotation.quote_date}</span>
              <span style={{ color: '#94A3B8' }}>〜</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: quotation.valid_until ? 'var(--text-primary)' : '#94A3B8' }}>
                {quotation.valid_until || '未設定'}
              </span>
            </div>
          </div>

          {/* Contact & Destination */}
          <div>
            <span style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2, fontWeight: 600 }}>
              納入先 / 客先担当者
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} style={{ color: '#64748B' }} />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {quotation.delivery_destination || '貴社ご指定場所'}
              </span>
              {quotation.customer_contact_name && (
                <span style={{ color: '#64748B', fontSize: 11 }}>
                  ({quotation.customer_contact_name} 様)
                </span>
              )}
            </div>
          </div>

          {/* Prepared By & Grand Total */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2, fontWeight: 600 }}>
              御見積合計金額 (税込)
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 900,
                fontSize: 18,
                color: 'var(--accent, #0D9488)',
              }}
            >
              ¥ {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Main Line Items Table (Paper Style) ── */}
      <div
        className="card-flat"
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-surface, #FFFFFF)',
          border: '1px solid var(--border-color, #E2E8F0)',
        }}
      >
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-color, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-muted, #F8FAFC)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 13 }}>
            <Layers size={15} style={{ color: 'var(--accent, #0D9488)' }} />
            <span>御見積明細書 ({quotation.lines.length} 件)</span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ width: 44, textAlign: 'center' }}>行</th>
                <th style={{ width: 100 }}>種別</th>
                <th>製品名 / 摘要 / 技術仕様</th>
                <th style={{ width: 110, textAlign: 'right' }}>数量</th>
                <th style={{ width: 110, textAlign: 'right' }}>単価 (円)</th>
                <th style={{ width: 130, textAlign: 'right' }}>金額 (円)</th>
                <th style={{ width: 180 }}>備考</th>
              </tr>
            </thead>
            <tbody>
              {quotation.lines.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 28, color: 'var(--text-muted)' }}>
                    明細データが登録されていません
                  </td>
                </tr>
              ) : (
                quotation.lines.map((line) => {
                  const hasProduct = Boolean(line.products)
                  const hasRevision = Boolean(line.design_revisions)

                  return (
                    <tr key={line.line_id}>
                      <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 600, color: '#64748B' }}>
                        {line.line_no}
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--bg-muted, #F1F5F9)',
                            color: '#475569',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          {line.item_type}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {hasProduct && line.products ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Link
                                href={`/product-center/${line.products.product_id}`}
                                style={{
                                  fontFamily: 'monospace',
                                  fontWeight: 800,
                                  color: 'var(--accent, #0D9488)',
                                  textDecoration: 'none',
                                }}
                              >
                                {line.products.product_code}
                              </Link>
                              {line.products.product_name && (
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {line.products.product_name}
                                </span>
                              )}
                            </div>
                          ) : null}

                          {/* CAD Specs SSOT */}
                          {hasRevision && line.design_revisions && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                              {line.design_revisions.design_code && (
                                <span
                                  style={{
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    color: '#0F766E',
                                    background: '#F0FDFA',
                                    padding: '1px 5px',
                                    borderRadius: 3,
                                  }}
                                >
                                  CAD: {line.design_revisions.design_code}
                                </span>
                              )}
                              {line.design_revisions.plastic_type_designed && (
                                <span style={{ color: '#475569', fontSize: 11 }}>
                                  {line.design_revisions.plastic_type_designed}
                                </span>
                              )}
                            </div>
                          )}

                          {line.description && (
                            <div style={{ color: 'var(--text-secondary, #475569)', fontSize: 12 }}>
                              {line.description}
                            </div>
                          )}
                        </div>
                      </td>

                      <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                        {Number(line.quantity).toLocaleString()}
                        {line.quantity_text && (
                          <span style={{ fontSize: 10, color: '#64748B', marginLeft: 3 }}>
                            {line.quantity_text}
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                        ¥ {Number(line.unit_price).toLocaleString()}
                      </td>

                      <td
                        style={{
                          textAlign: 'right',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: 13,
                          color: 'var(--text-primary)',
                        }}
                      >
                        ¥ {Number(line.amount).toLocaleString()}
                      </td>

                      <td style={{ fontSize: 11, color: '#64748B' }}>
                        {line.notes || '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 5. Footer: Totals, Commercial Notes & Signoff (RULE-UI-10) ── */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-color, #E2E8F0)',
            background: 'var(--bg-muted, #F8FAFC)',
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: 20,
            flexShrink: 0,
          }}
        >
          {/* Notes & Commercial Terms */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>
              備考・お取引条件 (Notes & Terms)
            </span>
            <div
              style={{
                fontSize: 12,
                color: quotation.notes ? 'var(--text-primary)' : '#94A3B8',
                whiteSpace: 'pre-line',
                lineHeight: '18px',
                background: 'var(--bg-surface, #FFFFFF)',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #E2E8F0',
                minHeight: 52,
              }}
            >
              {quotation.notes || '特記事項なし'}
            </div>

            {quotation.employees?.employee_name && (
              <div style={{ marginTop: 8, fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserCheck size={13} />
                <span>作成担当: <strong>{quotation.employees.employee_name}</strong></span>
              </div>
            )}
          </div>

          {/* Financial Calculation Summary */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              background: 'var(--bg-surface, #FFFFFF)',
              padding: '10px 14px',
              borderRadius: 6,
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#64748B' }}>小計 (税抜):</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                ¥ {subtotal.toLocaleString()}
              </span>
            </div>

            {taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#64748B' }}>消費税 (10%):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                  ¥ {taxAmount.toLocaleString()}
                </span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '2px solid var(--border-color, #CBD5E1)',
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                御見積合計:
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 20,
                  fontWeight: 900,
                  color: 'var(--accent, #0D9488)',
                }}
              >
                ¥ {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
