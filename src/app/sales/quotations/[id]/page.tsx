import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine, FileText, Calendar, Edit, MapPin, UserCheck, FileDown } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function QuotationDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()
  const t = await getTranslations('Quotations')

  // Fetch header
  const { data: quote, error } = await supabase
    .from('quotations')
    .select(`
      *,
      companies (company_name),
      business_cases (case_code, title)
    `)
    .eq('quotation_id', params.id)
    .single()

  if (error || !quote) {
    notFound()
  }

  // Fetch lines
  const { data: lines } = await supabase
    .from('quotation_lines')
    .select('*')
    .eq('quotation_id', quote.quotation_id)
    .order('line_no', { ascending: true })

  const getStatusBadge = (st: string | null) => {
    switch (st) {
      case 'DRAFT': return <span className="badge badge--neutral font-bold">DRAFT</span>
      case 'SENT': return <span className="badge badge--info font-bold">SENT</span>
      case 'ACCEPTED': return <span className="badge badge--success font-bold">ACCEPTED</span>
      case 'REJECTED': return <span className="badge badge--error font-bold">REJECTED</span>
      case 'EXPIRED': return <span className="badge badge--neutral font-bold" style={{ opacity: 0.7 }}>EXPIRED</span>
      default: return <span className="badge badge--neutral font-bold">{st || 'DRAFT'}</span>
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount == null) return '-'
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* BackBar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/sales/quotations" className="btn btn-secondary" style={{ padding: '6px 10px' }}>
              <ArrowLeft size={16} />
              {t('back')}
            </Link>
            <Link href="/sales/quotations" className="btn btn-secondary" style={{ padding: '6px 10px' }}>
              <ArrowUpFromLine size={16} />
              Up
            </Link>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderLeft: '1px solid var(--border-default)', paddingLeft: 16 }}>
            <FileText size={20} color="var(--accent)" />
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-bold" style={{ fontFamily: 'monospace', margin: 0 }}>
                {quote.quotation_no}
              </h1>
              {quote.revision_no && quote.revision_no > 1 ? (
                <span className="badge badge--warning text-xs px-2 py-0.5 font-mono">
                  Rev.{quote.revision_no}
                </span>
              ) : (
                <span className="badge badge--neutral text-xs px-2 py-0.5 font-mono text-slate-500">
                  Rev.1
                </span>
              )}
            </div>
            {getStatusBadge(quote.status || 'DRAFT')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/api/quotations/${quote.quotation_id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <FileDown size={14} />
            <span>PDFダウンロード</span>
          </a>

          <button className="btn btn-secondary flex items-center gap-1.5" disabled>
            <Edit size={14} />
            Edit (Phase 2)
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Overview Card */}
        <div className="card-flat p-4">
          <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--accent)' }}>1. {t('tab_overview')}</h2>
          
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">{t('col_customer')}</div>
              <div className="font-bold text-[14px]">{quote.companies?.company_name || '-'}</div>
              {quote.customer_contact_name && (
                <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                  <UserCheck size={12} className="text-slate-400" />
                  <span>宛先: {quote.customer_contact_name}</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">送り先 / 納品先</div>
              <div className="font-bold text-[13px] flex items-center gap-1 text-slate-800">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span>{quote.delivery_destination || '御社指定先'}</span>
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">{t('col_type')}</div>
              <div className="font-bold">
                <span className="badge badge--neutral">{quote.quotation_type}</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">版数 (Revision)</div>
              <div className="font-mono font-bold text-slate-800">
                Rev.{quote.revision_no || 1}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">{t('col_date')}</div>
              <div className="font-bold flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                {quote.quote_date ? new Date(quote.quote_date).toISOString().split('T')[0] : '-'}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">{t('col_valid_until')}</div>
              <div className="font-bold flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                {quote.valid_until ? (
                  new Date(quote.valid_until).toISOString().split('T')[0]
                ) : (
                  <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    次回価格改定時まで
                  </span>
                )}
              </div>
            </div>
          </div>

          {(quote.case_id || quote.notes) && (
            <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t border-slate-100">
              {quote.case_id && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">{t('col_case')}</div>
                  <div className="font-bold text-accent">
                    <Link href={`/cases/${quote.case_id}`} className="hover:underline">
                      {quote.business_cases?.case_code}
                    </Link>
                  </div>
                </div>
              )}
              {quote.notes && (
                <div className={!quote.case_id ? "col-span-2" : ""}>
                  <div className="text-xs font-semibold text-slate-500 mb-1">備考・特記事項 (Notes / Terms)</div>
                  <div className="text-sm whitespace-pre-wrap text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 font-mono text-xs">
                    {quote.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lines Card */}
        <div className="card-flat p-4">
          <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--accent)' }}>2. {t('tab_lines')}</h2>
          
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '4%', textAlign: 'center' }}>{t('col_line_no')}</th>
                <th style={{ width: '14%' }}>型番 (Model Code)</th>
                <th style={{ width: '12%' }}>{t('col_item_type')}</th>
                <th style={{ width: '38%' }}>品名・仕様 (Description)</th>
                <th style={{ width: '10%', textAlign: 'right' }}>数量 (Quantity)</th>
                <th style={{ width: '11%', textAlign: 'right' }}>{t('col_unit_price')}</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(!lines || lines.length === 0) ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">No lines</td>
                </tr>
              ) : (
                lines.map((line) => (
                  <tr key={line.line_id}>
                    <td className="text-center font-bold text-slate-500">{line.line_no}</td>
                    <td className="font-mono font-semibold text-slate-800">
                      {line.model_code || '-'}
                    </td>
                    <td>
                      <span className="badge badge--neutral text-xs">{line.item_type}</span>
                    </td>
                    <td>{line.description}</td>
                    <td className="text-right font-mono">
                      {line.quantity_text ? (
                        <span className="font-semibold text-slate-700">{line.quantity_text}</span>
                      ) : (
                        line.quantity
                      )}
                    </td>
                    <td className="text-right font-mono">{formatCurrency(line.unit_price)}</td>
                    <td className="text-right font-mono font-bold">{formatCurrency(line.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 min-w-[300px]">
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-600">{t('col_amount')}:</span>
                <span className="font-mono font-bold text-slate-900 text-2xl">
                  {formatCurrency(quote.total_amount)}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-400 mt-1">
                ※ この御見積り価格には消費税は含まれておりません
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
