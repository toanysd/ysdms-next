'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  CreditCard, Search, RefreshCw, AlertTriangle,
  Building2, ArrowRight, DollarSign, CheckCircle2,
  Clock, ShieldAlert, FileText, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { getCustomerDebtSummary } from '@/app/actions/invoice'

export default function CustomerDebtPage() {
  const t = useTranslations('debt')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debtSummaries, setDebtSummaries] = useState<any[]>([])

  const loadData = useCallback(async () => {
    setLoading(true)
    const res = await getCustomerDebtSummary(search.trim() || undefined)
    setLoading(false)
    if (res.success) {
      setDebtSummaries(res.data)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData()
    }, 300)
    return () => clearTimeout(timer)
  }, [loadData])

  // KPI Calculations
  const totalCustomers = debtSummaries.length
  const totalBilled = debtSummaries.reduce((sum, d) => sum + (Number(d.total_billed) || 0), 0)
  const totalPaid = debtSummaries.reduce((sum, d) => sum + (Number(d.total_paid) || 0), 0)
  const totalRemaining = debtSummaries.reduce((sum, d) => sum + (Number(d.total_remaining) || 0), 0)
  const overdueCustomersCount = debtSummaries.filter((d) => d.overdue_count > 0).length

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
              background: 'var(--tint-orange-bg, #FFFBEB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #FDE68A',
            }}
          >
            <CreditCard size={20} style={{ color: '#D97706' }} />
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
          <Link
            href="/orders/invoices"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}
          >
            <FileText size={15} />
            <span>{t('viewInvoicesList')}</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, flexShrink: 0 }}>
        {/* Total Customers */}
        <div className="kpi-card" style={{ padding: '10px 14px', borderRadius: 8, background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{t('kpiTotalCustomers')}</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: 2 }}>
            {totalCustomers} {t('companyCountUnit')}
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

        {/* Overdue Customers */}
        <div className="kpi-card" style={{ padding: '10px 14px', borderRadius: 8, background: overdueCustomersCount > 0 ? '#FEF2F2' : '#F8FAFC', border: overdueCustomersCount > 0 ? '1px solid #FECACA' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: overdueCustomersCount > 0 ? '#991B1B' : '#64748B' }}>{t('kpiOverdueCustomers')}</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: overdueCustomersCount > 0 ? '#DC2626' : '#64748B', marginTop: 2 }}>
            {overdueCustomersCount} {t('companyCountUnit')}
          </div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="card-flat" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder={t('searchCustomerPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input form-input-search"
            style={{ width: '100%', fontSize: 13 }}
          />
        </div>
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '4px 10px' }}
          >
            {t('clear')}
          </button>
        )}
      </div>

      {/* 4. Customer Debt Table */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
        <table className="data-table" style={{ margin: 0, width: '100%' }}>
          <thead>
            <tr>
              <th>{t('customer')}</th>
              <th style={{ width: 110, textAlign: 'center' }}>{t('totalInvoices')}</th>
              <th style={{ width: 140, textAlign: 'right' }}>{t('totalBilled')}</th>
              <th style={{ width: 140, textAlign: 'right' }}>{t('totalPaid')}</th>
              <th style={{ width: 150, textAlign: 'right' }}>{t('totalRemainingDebt')}</th>
              <th style={{ width: 120, textAlign: 'center' }}>{t('overdueInvoices')}</th>
              <th style={{ width: 140, textAlign: 'center' }}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
                  <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px auto', display: 'block', color: 'var(--accent)' }} />
                  <span>{t('loading')}</span>
                </td>
              </tr>
            ) : debtSummaries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#64748B' }}>
                  {t('noDebtData')}
                </td>
              </tr>
            ) : (
              debtSummaries.map((item) => {
                const hasOverdue = item.overdue_count > 0
                return (
                  <tr
                    key={item.company_id}
                    style={{
                      backgroundColor: hasOverdue ? '#FFFBEB' : 'transparent',
                    }}
                  >
                    {/* Customer Name + Code */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {hasOverdue && <AlertTriangle size={14} style={{ color: '#D97706', flexShrink: 0 }} />}
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>
                            {item.company_name}
                          </div>
                          {item.company_code && (
                            <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                              {item.company_code}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Total Invoices Count */}
                    <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>
                      {item.total_invoices}
                    </td>

                    {/* Total Billed */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                      ¥{Number(item.total_billed).toLocaleString()}
                    </td>

                    {/* Total Paid */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#16A34A', fontWeight: 600 }}>
                      ¥{Number(item.total_paid).toLocaleString()}
                    </td>

                    {/* Total Remaining Debt */}
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: Number(item.total_remaining) > 0 ? '#D97706' : '#16A34A' }}>
                      ¥{Number(item.total_remaining).toLocaleString()}
                    </td>

                    {/* Overdue Count */}
                    <td style={{ textAlign: 'center' }}>
                      {hasOverdue ? (
                        <span className="badge badge--error" style={{ fontSize: 11 }}>
                          {item.overdue_count} {t('overdueBadge')}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94A3B8' }}>0</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <Link
                        href={`/orders/invoices`}
                        className="btn btn-secondary"
                        style={{
                          padding: '3px 10px',
                          fontSize: 11,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          textDecoration: 'none',
                        }}
                      >
                        <span>{t('viewInvoices')}</span>
                        <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
