import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine, FileText, Calendar, Edit } from 'lucide-react'
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

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'DRAFT': return <span className="badge badge--neutral font-bold">DRAFT</span>
      case 'SENT': return <span className="badge badge--info font-bold">SENT</span>
      case 'ACCEPTED': return <span className="badge badge--success font-bold">ACCEPTED</span>
      case 'REJECTED': return <span className="badge badge--error font-bold">REJECTED</span>
      case 'EXPIRED': return <span className="badge badge--neutral font-bold" style={{ opacity: 0.7 }}>EXPIRED</span>
      default: return <span className="badge badge--neutral font-bold">{st}</span>
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
            <h1 className="text-[18px] font-bold" style={{ fontFamily: 'monospace', margin: 0 }}>
              {quote.quotation_no}
            </h1>
            {getStatusBadge(quote.status || 'DRAFT')}
          </div>
        </div>

        <button className="btn btn-secondary flex items-center gap-1.5" disabled>
          <Edit size={14} />
          Edit (Phase 2)
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Overview Card */}
        <div className="card-flat p-4">
          <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--accent)' }}>1. {t('tab_overview')}</h2>
          
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">{t('col_customer')}</div>
              <div className="font-bold">{quote.companies?.company_name || '-'}</div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">{t('col_type')}</div>
              <div className="font-bold">
                <span className="badge badge--neutral">{quote.quotation_type}</span>
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
                {quote.valid_until ? new Date(quote.valid_until).toISOString().split('T')[0] : '-'}
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
                  <div className="text-xs font-semibold text-slate-500 mb-1">Notes</div>
                  <div className="text-sm whitespace-pre-wrap text-slate-700">{quote.notes}</div>
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
                <th style={{ width: '5%', textAlign: 'center' }}>{t('col_line_no')}</th>
                <th style={{ width: '15%' }}>{t('col_item_type')}</th>
                <th style={{ width: '40%' }}>{t('col_desc')}</th>
                <th style={{ width: '10%', textAlign: 'right' }}>{t('col_qty')}</th>
                <th style={{ width: '15%', textAlign: 'right' }}>{t('col_unit_price')}</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(!lines || lines.length === 0) ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">No lines</td>
                </tr>
              ) : (
                lines.map((line) => (
                  <tr key={line.line_id}>
                    <td className="text-center font-bold text-slate-500">{line.line_no}</td>
                    <td>
                      <span className="badge badge--neutral">{line.item_type}</span>
                    </td>
                    <td>{line.description}</td>
                    <td className="text-right font-mono">{line.quantity}</td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
