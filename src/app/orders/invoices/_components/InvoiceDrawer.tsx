'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  X, Plus, Trash2, CheckCircle2, FileText, Calendar,
  DollarSign, Building2, Layers, AlertCircle, Loader2,
  Clock, CreditCard, ChevronRight, Download
} from 'lucide-react'
import {
  getInvoiceById, createInvoice, updateInvoiceStatus,
  CreateInvoicePayload, InvoiceLineItemInput
} from '@/app/actions/invoice'
import AddPaymentModal from './AddPaymentModal'

interface InvoiceDrawerProps {
  isOpen: boolean
  invoiceId: string | null
  onClose: () => void
  onSuccess: () => void
}

const STATUS_CONFIG: Record<string, { labelJA: string; labelVI: string; badgeClass: string }> = {
  DRAFT: { labelJA: '下書き', labelVI: 'Bản nháp', badgeClass: 'badge badge--neutral' },
  ISSUED: { labelJA: '発行済', labelVI: 'Đã phát hành', badgeClass: 'badge badge--info' },
  PARTIALLY_PAID: { labelJA: '一部入金', labelVI: 'Thanh toán 1 phần', badgeClass: 'badge badge--warning' },
  PAID: { labelJA: '入金完了', labelVI: 'Đã thanh toán đủ', badgeClass: 'badge badge--success' },
  CANCELLED: { labelJA: '取消', labelVI: 'Đã hủy', badgeClass: 'badge badge--error' },
}

export default function InvoiceDrawer({
  isOpen,
  invoiceId,
  onClose,
  onSuccess,
}: InvoiceDrawerProps) {
  const t = useTranslations('invoices')
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'LINES' | 'PAYMENTS'>('LINES')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Invoice Detail Data (for VIEW mode)
  const [invoiceData, setInvoiceData] = useState<any>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Companies & Orders lookup for CREATE mode
  const [companies, setCompanies] = useState<Array<{ company_id: string; company_name: string; company_code: string }>>([])
  const [orders, setOrders] = useState<Array<{ order_id: string; order_no: string; company_id: string }>>([])
  const [shipments, setShipments] = useState<Array<{ shipment_id: string; delivery_note_no: string; order_id: string }>>([])

  // Create Form State
  const [companyId, setCompanyId] = useState<string>('')
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('')
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d.toISOString().split('T')[0]
  })
  const [taxRate, setTaxRate] = useState<number>(0.10)
  const [notes, setNotes] = useState<string>('')
  const [lines, setLines] = useState<InvoiceLineItemInput[]>([
    { description: '', quantity: 1, unit_price: 0 },
  ])

  // Load Companies and detail data
  useEffect(() => {
    if (!isOpen) return

    async function loadMaster() {
      const [{ data: compData }, { data: ordData }, { data: shipData }] = await Promise.all([
        supabase.from('companies').select('company_id, company_name, company_code').order('company_name'),
        supabase.from('orders').select('order_id, order_no, company_id').order('order_date', { ascending: false }).limit(50),
        supabase.from('shipments').select('shipment_id, delivery_note_no, order_id').order('created_at', { ascending: false }).limit(50),
      ])

      if (compData) setCompanies(compData as any)
      if (ordData) setOrders(ordData as any)
      if (shipData) setShipments(shipData as any)
    }

    loadMaster()

    if (invoiceId) {
      fetchInvoiceDetail(invoiceId)
    } else {
      // Reset form
      setInvoiceData(null)
      setCompanyId('')
      setSelectedOrderId('')
      setSelectedShipmentId('')
      setInvoiceDate(new Date().toISOString().split('T')[0])
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      setDueDate(nextMonth.toISOString().split('T')[0])
      setNotes('')
      setLines([{ description: '', quantity: 1, unit_price: 0 }])
      setError(null)
    }
  }, [isOpen, invoiceId])

  const fetchInvoiceDetail = async (id: string) => {
    setLoading(true)
    setError(null)
    const res = await getInvoiceById(id)
    setLoading(false)
    if (res.success && res.data) {
      setInvoiceData(res.data)
    } else {
      setError(res.error || 'Failed to load invoice')
    }
  }

  // Handle auto-population when Order is selected
  const handleOrderChange = async (ordId: string) => {
    setSelectedOrderId(ordId)
    if (!ordId) return

    const matchedOrd = orders.find((o) => o.order_id === ordId)
    if (matchedOrd && !companyId) {
      setCompanyId(matchedOrd.company_id)
    }

    // Fetch order lines
    const { data: ordLines } = await (supabase as any)
      .from('order_lines')
      .select('line_id, quantity, products(product_name, product_code)')
      .eq('order_id', ordId)

    if (ordLines && ordLines.length > 0) {
      setLines(
        ordLines.map((ol: any) => ({
          description: ol.products?.product_name || ol.products?.product_code || 'Sản phẩm',
          quantity: Number(ol.quantity) || 1,
          unit_price: 0,
          order_line_id: ol.line_id,
        }))
      )
    }
  }

  const handleAddLine = () => {
    setLines([...lines, { description: '', quantity: 1, unit_price: 0 }])
  }

  const handleRemoveLine = (idx: number) => {
    if (lines.length === 1) return
    setLines(lines.filter((_, i) => i !== idx))
  }

  const handleLineChange = (idx: number, field: keyof InvoiceLineItemInput, value: any) => {
    const next = [...lines]
    next[idx] = { ...next[idx], [field]: value }
    setLines(next)
  }

  const calculateSubtotal = () => {
    return lines.reduce((acc, l) => acc + (Number(l.quantity) * Number(l.unit_price)), 0)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyId) {
      setError(t('errorSelectCompany') || 'Vui lòng chọn khách hàng')
      return
    }
    if (!dueDate) {
      setError(t('errorDueDateRequired') || 'Vui lòng chọn hạn thanh toán')
      return
    }

    setSaving(true)
    setError(null)

    const payload: CreateInvoicePayload = {
      company_id: companyId,
      order_id: selectedOrderId || null,
      shipment_id: selectedShipmentId || null,
      invoice_date: invoiceDate,
      due_date: dueDate,
      tax_rate: taxRate,
      notes: notes.trim() || null,
      lines: lines.filter((l) => l.description.trim() !== ''),
    }

    const res = await createInvoice(payload)
    setSaving(false)

    if (res.success) {
      onSuccess()
      onClose()
    } else {
      setError(res.error || 'Lỗi khi tạo hóa đơn')
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!invoiceId) return
    const res = await updateInvoiceStatus(invoiceId, newStatus)
    if (res.success) {
      fetchInvoiceDetail(invoiceId)
      onSuccess()
    }
  }

  if (!isOpen) return null

  const subtotal = calculateSubtotal()
  const taxAmount = Math.round(subtotal * taxRate)
  const grandTotal = subtotal + taxAmount

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 9000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          height: '100%',
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideInRight 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--tint-teal-bg, #F0FDFA)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={22} style={{ color: 'var(--accent, #0D9488)' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>
                {invoiceId ? t('invoiceDetail') : t('createInvoice')}
              </h2>
              {invoiceData && (
                <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent, #0D9488)' }}>
                  {invoiceData.invoice_number}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748B',
              padding: 6,
              borderRadius: 6,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 6,
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
                fontSize: 13,
                border: '1px solid #FECACA',
                marginBottom: 16,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, gap: 10 }}>
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent, #0D9488)' }} />
              <span style={{ fontSize: 14, color: '#64748B' }}>{t('loading')}</span>
            </div>
          ) : invoiceId && invoiceData ? (
            /* ═════════════════════════════════════════════════════════════
               MODE VIEW / DETAIL
               ═════════════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Summary Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{t('total_amount')}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: 2 }}>
                    ¥{Number(invoiceData.net_amount || invoiceData.total_amount).toLocaleString()}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>{t('paid_amount')}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: '#16A34A', marginTop: 2 }}>
                    ¥{Number(invoiceData.paid_amount || 0).toLocaleString()}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, background: Number(invoiceData.remaining_amount) > 0 ? '#FFFBEB' : '#F8FAFC', border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#92400E' }}>{t('remaining_amount')}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: Number(invoiceData.remaining_amount) > 0 ? '#D97706' : '#16A34A', marginTop: 2 }}>
                    ¥{Number(invoiceData.remaining_amount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status & Action Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={STATUS_CONFIG[invoiceData.status]?.badgeClass || 'badge badge--neutral'}>
                    {STATUS_CONFIG[invoiceData.status]?.labelJA || invoiceData.status}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748B' }}>
                    {t('due_date')}: <strong style={{ color: '#0F172A' }}>{invoiceData.due_date}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {invoiceData.status !== 'PAID' && invoiceData.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="btn btn-primary"
                      style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <DollarSign size={14} />
                      <span>{t('recordPayment')}</span>
                    </button>
                  )}
                  {invoiceData.status === 'DRAFT' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('ISSUED')}
                      className="btn btn-secondary"
                      style={{ fontSize: 12, padding: '6px 12px' }}
                    >
                      {t('issueInvoice')}
                    </button>
                  )}
                </div>
              </div>

              {/* Meta details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>{t('customer')}</span>
                  <strong style={{ color: '#0F172A' }}>
                    {invoiceData.companies?.company_name} ({invoiceData.companies?.company_code})
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>{t('invoice_date')}</span>
                  <span style={{ color: '#0F172A', fontFamily: 'monospace' }}>{invoiceData.invoice_date}</span>
                </div>
                {invoiceData.orders && (
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>{t('linkedOrder')}</span>
                    <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 600 }}>
                      {invoiceData.orders.order_no}
                    </span>
                  </div>
                )}
                {invoiceData.shipments && (
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>{t('linkedShipment')}</span>
                    <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 600 }}>
                      {invoiceData.shipments.delivery_note_no}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Tabs inside Drawer */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('LINES')}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    border: 'none',
                    background: 'transparent',
                    borderBottom: activeTab === 'LINES' ? '2px solid var(--accent)' : '2px solid transparent',
                    color: activeTab === 'LINES' ? 'var(--accent)' : '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {t('invoiceLines')} ({invoiceData.invoice_lines?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('PAYMENTS')}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    border: 'none',
                    background: 'transparent',
                    borderBottom: activeTab === 'PAYMENTS' ? '2px solid var(--accent)' : '2px solid transparent',
                    color: activeTab === 'PAYMENTS' ? 'var(--accent)' : '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {t('paymentHistory')} ({invoiceData.invoice_payments?.length || 0})
                </button>
              </div>

              {/* Tab Content: Lines */}
              {activeTab === 'LINES' && (
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                  <table className="data-table" style={{ margin: 0, width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th>{t('description')}</th>
                        <th style={{ width: 80, textAlign: 'right' }}>{t('quantity')}</th>
                        <th style={{ width: 100, textAlign: 'right' }}>{t('unit_price')}</th>
                        <th style={{ width: 110, textAlign: 'right' }}>{t('amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(invoiceData.invoice_lines || []).map((line: any, idx: number) => (
                        <tr key={line.line_id || idx}>
                          <td style={{ textAlign: 'center', color: '#64748B', fontSize: 12 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600 }}>{line.description}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{Number(line.quantity).toLocaleString()}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥{Number(line.unit_price).toLocaleString()}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                            ¥{Number(line.line_amount || line.quantity * line.unit_price).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab Content: Payments */}
              {activeTab === 'PAYMENTS' && (
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                  {(!invoiceData.invoice_payments || invoiceData.invoice_payments.length === 0) ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
                      {t('noPaymentsRecorded')}
                    </div>
                  ) : (
                    <table className="data-table" style={{ margin: 0, width: '100%' }}>
                      <thead>
                        <tr>
                          <th>{t('payment_date')}</th>
                          <th>{t('payment_method')}</th>
                          <th>{t('reference_no')}</th>
                          <th style={{ textAlign: 'right' }}>{t('paid_amount')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.invoice_payments.map((p: any) => (
                          <tr key={p.payment_id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.payment_date}</td>
                            <td>
                              <span className="badge badge--neutral" style={{ fontSize: 11 }}>
                                {p.payment_method === 'BANK_TRANSFER' ? t('paymentMethodBank') : p.payment_method}
                              </span>
                            </td>
                            <td style={{ fontSize: 12, color: '#64748B' }}>{p.reference_no || '—'}</td>
                            <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#16A34A' }}>
                              ¥{Number(p.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ═════════════════════════════════════════════════════════════
               MODE CREATE NEW INVOICE
               ═════════════════════════════════════════════════════════════ */
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Company Selector */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  {t('customer')} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  required
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                >
                  <option value="">{t('selectCompanyPlaceholder')}</option>
                  {companies.map((c) => (
                    <option key={c.company_id} value={c.company_id}>
                      {c.company_name} ({c.company_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional: Link Order or Shipment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    {t('importFromOrder')}
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  >
                    <option value="">{t('selectOrderOptional')}</option>
                    {orders
                      .filter((o) => !companyId || o.company_id === companyId)
                      .map((o) => (
                        <option key={o.order_id} value={o.order_id}>
                          {o.order_no}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    {t('importFromShipment')}
                  </label>
                  <select
                    value={selectedShipmentId}
                    onChange={(e) => setSelectedShipmentId(e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  >
                    <option value="">{t('selectShipmentOptional')}</option>
                    {shipments
                      .filter((s) => !selectedOrderId || s.order_id === selectedOrderId)
                      .map((s) => (
                        <option key={s.shipment_id} value={s.shipment_id}>
                          {s.delivery_note_no}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Dates Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    {t('invoice_date')} <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    {t('due_date')} <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    {t('taxRate')}
                  </label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="form-input"
                    style={{ width: '100%' }}
                  >
                    <option value={0.10}>10%</option>
                    <option value={0.08}>8%</option>
                    <option value={0}>0%</option>
                  </select>
                </div>
              </div>

              {/* Invoice Lines Table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    {t('invoiceLines')}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="btn btn-secondary"
                    style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={14} />
                    <span>{t('addLine')}</span>
                  </button>
                </div>

                <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                  <table className="data-table" style={{ margin: 0, width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: 30 }}>#</th>
                        <th>{t('description')}</th>
                        <th style={{ width: 90 }}>{t('quantity')}</th>
                        <th style={{ width: 110 }}>{t('unit_price')} (¥)</th>
                        <th style={{ width: 110, textAlign: 'right' }}>{t('amount')} (¥)</th>
                        <th style={{ width: 36 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((l, idx) => {
                        const lineAmt = Number(l.quantity) * Number(l.unit_price)
                        return (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center', color: '#64748B', fontSize: 12 }}>{idx + 1}</td>
                            <td>
                              <input
                                type="text"
                                required
                                placeholder={t('lineDescPlaceholder')}
                                value={l.description}
                                onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                                className="form-input"
                                style={{ width: '100%', padding: '4px 8px' }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                required
                                min={1}
                                value={l.quantity}
                                onChange={(e) => handleLineChange(idx, 'quantity', Number(e.target.value))}
                                className="form-input"
                                style={{ width: '100%', padding: '4px 8px', fontFamily: 'monospace', textAlign: 'right' }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                required
                                min={0}
                                value={l.unit_price}
                                onChange={(e) => handleLineChange(idx, 'unit_price', Number(e.target.value))}
                                className="form-input"
                                style={{ width: '100%', padding: '4px 8px', fontFamily: 'monospace', textAlign: 'right' }}
                              />
                            </td>
                            <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                              ¥{lineAmt.toLocaleString()}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {lines.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLine(idx)}
                                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444', padding: 2 }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation Breakdown */}
              <div
                style={{
                  alignSelf: 'flex-end',
                  width: 280,
                  backgroundColor: '#F8FAFC',
                  borderRadius: 8,
                  padding: 12,
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B' }}>
                  <span>{t('subtotal')}:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>¥{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B' }}>
                  <span>{t('tax')} ({(taxRate * 100).toFixed(0)}%):</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>¥{taxAmount.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0F172A',
                    borderTop: '1px solid #CBD5E1',
                    paddingTop: 6,
                  }}
                >
                  <span>{t('grandTotal')}:</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--accent, #0D9488)' }}>¥{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  {t('notes')}
                </label>
                <textarea
                  rows={2}
                  placeholder={t('notesPlaceholder')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>{t('saveInvoice')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Add Payment Modal */}
      {invoiceData && (
        <AddPaymentModal
          isOpen={isPaymentModalOpen}
          invoiceId={invoiceData.invoice_id}
          invoiceNumber={invoiceData.invoice_number}
          remainingAmount={Number(invoiceData.remaining_amount || 0)}
          currency={invoiceData.currency || 'JPY'}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => {
            fetchInvoiceDetail(invoiceData.invoice_id)
            onSuccess()
          }}
        />
      )}
    </div>
  )
}
