import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Calendar, Hash, FileText } from 'lucide-react'

interface Quotation {
  quotation_id: string
  quotation_no: string
  quotation_type: string | null
  status: string
  quote_date: string
  valid_until: string | null
  total_amount: number | null
  company_id: string | null
  case_id: string | null
  companies: { company_name: string } | null
  business_cases: { case_code: string, title: string | null } | null
}

export function QuotationTable({ data }: { data: Quotation[] }) {
  const t = useTranslations('Quotations')

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
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ width: '15%' }}>{t('col_code')}</th>
          <th style={{ width: '20%' }}>{t('col_customer')}</th>
          <th style={{ width: '15%' }}>{t('col_case')}</th>
          <th style={{ width: '10%' }}>{t('col_type')}</th>
          <th style={{ width: '15%', textAlign: 'right' }}>{t('col_amount')}</th>
          <th style={{ width: '10%', textAlign: 'center' }}>{t('col_status')}</th>
          <th style={{ width: '15%', textAlign: 'right' }}>{t('col_date')}</th>
        </tr>
      </thead>
      <tbody>
        {(!data || data.length === 0) ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <FileText size={48} color="var(--border-default)" />
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 14 }}>Chưa có báo giá nào</p>
                <Link href="/sales/quotations/new">
                  <button className="btn btn-secondary flex items-center gap-1.5 cursor-pointer mt-2">
                    Tạo Báo Giá Đầu Tiên
                  </button>
                </Link>
              </div>
            </td>
          </tr>
        ) : (
          data.map((quote) => {
            return (
              <tr key={quote.quotation_id}>
                <td>
                  <Link href={`/sales/quotations/${quote.quotation_id}`} style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Hash size={14} />
                    {quote.quotation_no}
                  </Link>
                </td>
                <td style={{ fontWeight: 600 }}>{quote.companies?.company_name || '-'}</td>
                <td>
                  {quote.business_cases ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Link href={`/cases/${quote.case_id}`} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 12 }}>
                        {quote.business_cases.case_code}
                      </Link>
                      {quote.business_cases.title && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }} className="truncate max-w-[150px]">
                          {quote.business_cases.title}
                        </span>
                      )}
                    </div>
                  ) : '-'}
                </td>
                <td>
                  <span className="badge badge--neutral">{quote.quotation_type || '-'}</span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'monospace' }}>
                  {formatCurrency(quote.total_amount)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {getStatusBadge(quote.status)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, color: 'var(--text-secondary)' }}>
                    <Calendar size={12} />
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {quote.quote_date ? new Date(quote.quote_date).toISOString().split('T')[0] : '-'}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}
