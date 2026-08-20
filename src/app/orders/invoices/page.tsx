'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Plus, Search, Filter, RefreshCw,
  DollarSign, AlertCircle, CheckCircle2, Clock,
  Building2, ArrowUpDown, ChevronRight, Eye, CreditCard
} from 'lucide-react'
import { getInvoices } from '@/app/actions/invoice'
import InvoiceDrawer from './_components/InvoiceDrawer'
import AddPaymentModal from './_components/AddPaymentModal'

const STATUS_CONFIG: Record<string, { labelJA: string; labelVI: string; badgeClass: string }> = {
  DRAFT: { labelJA: '下書き', labelVI: 'Bản nháp', badgeClass: 'badge badge--neutral' },
  ISSUED: { labelJA: '発行済', labelVI: 'Đã phát hành', badgeClass: 'badge badge--info' },
  PARTIALLY_PAID: { labelJA: '一部入金', labelVI: 'Thanh toán 1 phần', badgeClass: 'badge badge--warning' },
  PAID: { labelJA: '入金完了', labelVI: 'Đã thanh toán đủ', badgeClass: 'badge badge--success' },
  CANCELLED: { labelJA: '取消', labelVI: 'Đã hủy', badgeClass: 'badge badge--error' },
}

export default function InvoicesPage() {
  const t = useTranslations('invoices')
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)

  // Filters State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [companyFilter, setCompanyFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [companies, setCompanies] = useState<Array<{ company_id: string; company_name: string }>>([])

  // Drawer / Modal State
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const [paymentModalData, setPaymentModalData] = useState<{
    isOpen: boolean
    invoiceId: string
    invoiceNumber: string
    remainingAmount: number
  }>({
    isOpen: false,
    invoiceId: '',
    invoiceNumber: '',
    remainingAmount: 0,
  })

  // Load Companies Lookup
  useEffect(() => {
    async function loadCompanies() {
      const { data } = await supabase
        .from('companies')
        .select('company_id, company_name')
        .order('company_name')
      if (data) setCompanies(data)
    }
    loadCompanies()
  }, [])

  // Fetch Invoices
  const loadData = useCallback(async () => {
    setLoading(true)
    const res = await getInvoices({
      search: search.trim() || undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      company_id: companyFilter || undefined,
      dateRange: fromDate || toDate ? { from: fromDate || undefined, to: toDate || undefined } : undefined,
      page: 1,
      pageSize: 100,
    })
    setLoading(false)
    if (res.success) {
      setInvoices(res.data)
      setTotalCount(res.count)
    }
  }, [search, statusFilter, companyFilter, fromDate, toDate])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData()
    }, 300)
    return () => clearTimeout(timer)
  }, [loadData])

  // Aggregate KPI metrics
  const todayStr = new Date().toISOString().split('T')[0]
  const totalBilled = invoices.reduce((sum, inv) => sum + (Number(inv.net_amount) || Number(inv.total_amount) || 0), 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + (Number(inv.paid_amount) || 0), 0)
  const totalRemaining = invoices.reduce((sum, inv) => sum + (Number(inv.remaining_amount) || 0), 0)
  const overdueCount = invoices.filter(
    (inv) => inv.due_date < todayStr && inv.status !== 'PAID' && inv.status !== 'CANCELLED' && Number(inv.remaining_amount) > 0
  ).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* 1. PageHeader */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--tint-teal-bg, #F0FDFA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #CCFBF1',
            }}
          >
            <FileText size={20} style={{ color: 'var(--accent, #0D9488)' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>
              {t('title')}
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted, #64748B)' }}>
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={loadData}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
            title={t('refresh')}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{t('refresh')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedInvoiceId(null)
              setDrawerOpen(true)
            }}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <Plus size={16} />
            <span>{t('create')}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, flexShrink: 0 }}>
        {/* Total Invoices */}
        <div className="kpi-card" style={{ padding: '10px 14px', borderRadius: 8, background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{t('kpiTotalInvoices')}</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: 2 }}>
            {totalCount.toLocaleString()}
          </div>
        </div>

        {/* Total Billed */}
        <div className="kpi-card" style={{ padding: '10px 14px', borderRadius: 8, background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{t('kpiTotalBilled')}</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: 2 }}>
            ¥{totalBilled.toLocaleString()}
          </div>
        </div>

        {/* Total Paid */}
        <div className="kpi-card" style={{ padding: '10px 14px', borderRadius: 8, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>{t('kpiTotalPaid')}</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: '#16A34A', marginTop: 2 }}>
            ¥{totalPaid.toLocaleString()}
          </div>
        </div>

        {/* Total Remaining Debt */}
        <div className="kpi-card" style={{ padding: '10px 14px', borderRadius: 8, background: totalRemaining > 0 ? '#FFFBEB' : '#F8FAFC', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#92400E' }}>{t('kpiTotalRemaining')}</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: totalRemaining > 0 ? '#D97706' : '#16A34A', marginTop: 2 }}>
            ¥{totalRemaining.toLocaleString()}
          </div>
        </div>

        {/* Overdue Count */}
        <div className="kpi-card" style={{ padding: '10px 14px', borderRadius: 8, background: overdueCount > 0 ? '#FEF2F2' : '#F8FAFC', border: overdueCount > 0 ? '1px solid #FECACA' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: overdueCount > 0 ? '#991B1B' : '#64748B' }}>{t('kpiOverdue')}</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: overdueCount > 0 ? '#DC2626' : '#64748B', marginTop: 2 }}>
            {overdueCount} {t('invoicesCountUnit')}
          </div>
        </div>
      </div>

      {/* 3. FilterBar */}
      <div
        className="card-flat"
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input form-input-search"
            style={{ width: '100%', fontSize: 13 }}
          />
        </div>

        {/* Status Tab / Select */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input"
          style={{ width: 140, fontSize: 13 }}
        >
          <option value="ALL">{t('statusAll')}</option>
          <option value="DRAFT">{t('statusDraft')}</option>
          <option value="ISSUED">{t('statusIssued')}</option>
          <option value="PARTIALLY_PAID">{t('statusPartiallyPaid')}</option>
          <option value="PAID">{t('statusPaid')}</option>
          <option value="CANCELLED">{t('statusCancelled')}</option>
        </select>

        {/* Company Dropdown */}
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="form-input"
          style={{ width: 180, fontSize: 13 }}
        >
          <option value="">{t('allCompanies')}</option>
          {companies.map((c) => (
            <option key={c.company_id} value={c.company_id}>
              {c.company_name}
            </option>
          ))}
        </select>

        {/* From Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="form-input"
          style={{ width: 130, fontSize: 12 }}
          title={t('fromDate')}
        />

        {/* To Date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="form-input"
          style={{ width: 130, fontSize: 12 }}
          title={t('toDate')}
        />

        {(search || statusFilter !== 'ALL' || companyFilter || fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setStatusFilter('ALL')
              setCompanyFilter('')
              setFromDate('')
              setToDate('')
            }}
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '4px 10px' }}
          >
            {t('clearFilter')}
          </button>
        )}
      </div>

      {/* 4. Data Table */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
        <table className="data-table" style={{ margin: 0, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 140 }}>{t('invoice_number')}</th>
              <th>{t('customer')}</th>
              <th style={{ width: 110 }}>{t('invoice_date')}</th>
              <th style={{ width: 110 }}>{t('due_date')}</th>
              <th style={{ width: 120, textAlign: 'right' }}>{t('total_amount')}</th>
              <th style={{ width: 120, textAlign: 'right' }}>{t('paid_amount')}</th>
              <th style={{ width: 120, textAlign: 'right' }}>{t('remaining_amount')}</th>
              <th style={{ width: 110, textAlign: 'center' }}>{t('status')}</th>
              <th style={{ width: 120, textAlign: 'center' }}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
                  <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px auto', display: 'block', color: 'var(--accent)' }} />
                  <span>{t('loading')}</span>
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 48, color: '#64748B' }}>
                  {t('noData')}
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const isOverdue = inv.due_date < todayStr && inv.status !== 'PAID' && inv.status !== 'CANCELLED' && Number(inv.remaining_amount) > 0
                return (
                  <tr key={inv.invoice_id}>
                    {/* Invoice Number (Hyperlink) */}
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInvoiceId(inv.invoice_id)
                          setDrawerOpen(true)
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--accent, #0D9488)',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          fontSize: 13,
                          cursor: 'pointer',
                          padding: 0,
                          textAlign: 'left',
                        }}
                      >
                        {inv.invoice_number}
                      </button>
                    </td>

                    {/* Customer */}
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>
                        {inv.companies?.company_name || '—'}
                      </div>
                      {inv.companies?.company_code && (
                        <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                          {inv.companies.company_code}
                        </div>
                      )}
                    </td>

                    {/* Invoice Date */}
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {inv.invoice_date}
                    </td>

                    {/* Due Date (Highlight if overdue) */}
                    <td>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 12,
                          fontWeight: isOverdue ? 700 : 500,
                          color: isOverdue ? '#DC2626' : '#0F172A',
                          backgroundColor: isOverdue ? '#FEF2F2' : 'transparent',
                          padding: isOverdue ? '2px 6px' : 0,
                          borderRadius: 4,
                        }}
                      >
                        {inv.due_date}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                      ¥{Number(inv.net_amount || inv.total_amount).toLocaleString()}
                    </td>

                    {/* Paid Amount */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#16A34A', fontWeight: 600 }}>
                      ¥{Number(inv.paid_amount || 0).toLocaleString()}
                    </td>

                    {/* Remaining Amount */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: Number(inv.remaining_amount) > 0 ? '#D97706' : '#16A34A' }}>
                      ¥{Number(inv.remaining_amount || 0).toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={STATUS_CONFIG[inv.status]?.badgeClass || 'badge badge--neutral'}>
                        {STATUS_CONFIG[inv.status]?.labelJA || inv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentModalData({
                                isOpen: true,
                                invoiceId: inv.invoice_id,
                                invoiceNumber: inv.invoice_number,
                                remainingAmount: Number(inv.remaining_amount || 0),
                              })
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            title={t('recordPayment')}
                          >
                            <DollarSign size={12} />
                            <span>{t('pay')}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoiceId(inv.invoice_id)
                            setDrawerOpen(true)
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '3px 6px' }}
                          title={t('viewDetail')}
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Drawer (View / Create) */}
      <InvoiceDrawer
        isOpen={drawerOpen}
        invoiceId={selectedInvoiceId}
        onClose={() => setDrawerOpen(false)}
        onSuccess={loadData}
      />

      {/* Quick Add Payment Modal */}
      {paymentModalData.isOpen && (
        <AddPaymentModal
          isOpen={paymentModalData.isOpen}
          invoiceId={paymentModalData.invoiceId}
          invoiceNumber={paymentModalData.invoiceNumber}
          remainingAmount={paymentModalData.remainingAmount}
          onClose={() => setPaymentModalData((p) => ({ ...p, isOpen: false }))}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}
