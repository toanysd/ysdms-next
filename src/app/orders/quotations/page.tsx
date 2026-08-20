'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Plus, Search, Filter, Download, ExternalLink,
  RefreshCw, CheckCircle2, Clock, XCircle, AlertCircle, Building2
} from 'lucide-react'
import Link from 'next/link'
import { CreateQuotationModal } from './_components/CreateQuotationModal'

interface QuotationItem {
  quotation_id: string
  quotation_no: string
  quote_date: string
  valid_until?: string | null
  status: string
  quotation_type?: string | null
  total_amount?: number | null
  notes?: string | null
  companies?: {
    company_id: string
    company_name: string
    company_code: string
  } | null
  employees?: {
    employee_name: string
  } | null
}

const STATUS_BADGE: Record<string, { labelJA: string; badgeClass: string; bg: string; color: string }> = {
  DRAFT: { labelJA: '下書き (Draft)', badgeClass: 'badge badge--neutral', bg: '#F1F5F9', color: '#475569' },
  SENT: { labelJA: '送付済 (Sent)', badgeClass: 'badge badge--info', bg: '#EFF6FF', color: '#2563EB' },
  ACCEPTED: { labelJA: '受注承諾 (Accepted)', badgeClass: 'badge badge--success', bg: '#ECFDF5', color: '#059669' },
  REJECTED: { labelJA: '失注 (Rejected)', badgeClass: 'badge badge--error', bg: '#FEF2F2', color: '#DC2626' },
  EXPIRED: { labelJA: '期限切れ (Expired)', badgeClass: 'badge badge--warning', bg: '#FFFBEB', color: '#D97706' },
}

export default function QuotationsPage() {
  const t = useTranslations('Quotations')
  const supabase = createClient()

  const [quotations, setQuotations] = useState<QuotationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const fetchQuotations = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          quotation_id, quotation_no, quote_date, valid_until,
          status, quotation_type, total_amount, notes,
          companies:companies!quotations_company_id_fkey ( company_id, company_name, company_code ),
          employees:employees!quotations_prepared_by_fkey ( employee_name )
        `)
        .order('quote_date', { ascending: false })

      if (error) throw error
      if (data) setQuotations(data as any)
    } catch (err: any) {
      console.error('Error fetching quotations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuotations()
  }, [fetchQuotations])

  // Filtered List
  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchSearch =
        searchQuery === '' ||
        q.quotation_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.companies?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.companies?.company_code || '').toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'ALL' || q.status === statusFilter
      const matchType = typeFilter === 'ALL' || q.quotation_type === typeFilter

      return matchSearch && matchStatus && matchType
    })
  }, [quotations, searchQuery, statusFilter, typeFilter])

  // Summary Metrics
  const { totalQuotes, totalAmount, sentCount, acceptedCount } = useMemo(() => {
    let amt = 0
    let sent = 0
    let acc = 0

    quotations.forEach((q) => {
      amt += Number(q.total_amount) || 0
      if (q.status === 'SENT') sent++
      if (q.status === 'ACCEPTED') acc++
    })

    return {
      totalQuotes: quotations.length,
      totalAmount: amt,
      sentCount: sent,
      acceptedCount: acc,
    }
  }, [quotations])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── 1. Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={22} style={{ color: 'var(--accent, #0D9488)' }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {t('title')} (Quotation Management)
            </h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              真空成形金型・抜型および成形品トレイの御見積書作成・PDF出力
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
            style={{ height: 32, padding: '0 14px', fontSize: 12, gap: 5 }}
          >
            <Plus size={14} />
            <span>{t('newQuotation')}</span>
          </button>
          <button
            onClick={fetchQuotations}
            className="btn btn-secondary"
            style={{ height: 32, width: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="再読込 (Làm mới)"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── 2. Summary KPI Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 10,
        flexShrink: 0,
      }}>
        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--accent, #0D9488)', background: 'var(--tint-teal-bg, #f0fdfa)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            📋 {t('quotationList')} (Tổng Báo Giá)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {loading ? '...' : `${totalQuotes} 件`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #3B82F6', background: '#EFF6FF' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            💴 {t('totalAmount')} (Tổng Giá Trị Báo Giá)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#1E40AF' }}>
            {loading ? '...' : `¥ ${totalAmount.toLocaleString()}`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #F59E0B', background: '#FFFBEB' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            📤 {t('sent')} (Đang Chờ Phản Hồi)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#D97706' }}>
            {loading ? '...' : `${sentCount} 件`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #059669', background: '#ECFDF5' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            🎉 {t('accepted')} (Đã Chốt / Đặt Hàng)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#059669' }}>
            {loading ? '...' : `${acceptedCount} 件`}
          </div>
        </div>
      </div>

      {/* ── 3. Filter Bar ── */}
      <div className="card-flat" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="見積番号、得意先名で検索..."
            className="form-input"
            style={{ height: 28, fontSize: 12 }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{t('quotationStatus')}:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ height: 28, fontSize: 11 }}
          >
            <option value="ALL">すべて (All Status)</option>
            <option value="DRAFT">下書き (Draft)</option>
            <option value="SENT">送付済 (Sent)</option>
            <option value="ACCEPTED">受注承諾 (Accepted)</option>
            <option value="REJECTED">失注 (Rejected)</option>
          </select>
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{t('quotationType')}:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input"
            style={{ height: 28, fontSize: 11 }}
          >
            <option value="ALL">すべての種別</option>
            <option value="SET">金型＋製品 (SET)</option>
            <option value="MOLD">金型・抜型のみ (MOLD)</option>
            <option value="TRAY">トレイ製品のみ (TRAY)</option>
          </select>
        </div>
      </div>

      {/* ── 4. Main Data Table ── */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <RefreshCw size={18} className="animate-spin" style={{ margin: '0 auto 8px' }} />
            御見積書データを読込中...
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            <FileText size={28} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
            <div>{t('noQuotationsFound')}</div>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ width: 130 }}>{t('quotationNo')}</th>
                <th>{t('customerName')}</th>
                <th style={{ width: 100 }}>{t('quoteDate')}</th>
                <th style={{ width: 100 }}>{t('validUntil')}</th>
                <th style={{ width: 110 }}>{t('quotationType')}</th>
                <th style={{ width: 130, textAlign: 'right' }}>{t('totalAmount')}</th>
                <th style={{ width: 120, textAlign: 'center' }}>{t('quotationStatus')}</th>
                <th style={{ width: 100, textAlign: 'center' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((q) => {
                const statusConf = STATUS_BADGE[q.status] || STATUS_BADGE.DRAFT
                return (
                  <tr key={q.quotation_id}>
                    {/* Quotation No (Clickable Link) */}
                    <td>
                      <Link
                        href={`/orders/quotations/${q.quotation_id}`}
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: 13,
                          color: 'var(--accent, #0D9488)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {q.quotation_no}
                        <ExternalLink size={11} />
                      </Link>
                    </td>

                    {/* Customer Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {q.companies?.company_name || '得意先未設定'}
                        </span>
                        {q.companies?.company_code && (
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            ({q.companies.company_code})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quote Date */}
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {q.quote_date}
                    </td>

                    {/* Valid Until */}
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {q.valid_until || '—'}
                    </td>

                    {/* Quotation Type */}
                    <td>
                      <span className="badge badge--neutral" style={{ fontSize: 9 }}>
                        {q.quotation_type === 'SET' ? '金型＋製品' : q.quotation_type === 'MOLD' ? '金型・抜型' : q.quotation_type === 'TRAY' ? 'トレイ製品' : q.quotation_type || '—'}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>
                      ¥ {Number(q.total_amount || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: statusConf.bg, color: statusConf.color,
                      }}>
                        {statusConf.labelJA}
                      </span>
                    </td>

                    {/* Actions: PDF Download */}
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={`/api/quotations/${q.quotation_id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ height: 24, padding: '0 8px', fontSize: 10, gap: 3, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                        title="見積書PDF出力"
                      >
                        <Download size={11} />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create Quotation Modal ── */}
      <CreateQuotationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchQuotations()
        }}
      />

    </div>
  )
}
