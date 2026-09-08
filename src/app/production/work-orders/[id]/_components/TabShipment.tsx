'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Truck, Plus, PackageCheck, AlertTriangle, FileText, CheckCircle2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createShipment } from '@/app/shipments/_actions/createShipment'

interface TabShipmentProps {
  woId: string
  woCode: string
  productName?: string
  totalProduced: number
}

interface ShipmentRecord {
  shipment_id: string
  work_order_id: string | null
  delivery_note_no: string | null
  ship_date: string
  shipped_quantity: number | null
  delivery_method: string | null
  status: string | null
  notes: string | null
  created_at: string
}

const DELIVERY_METHODS = ['YSD便', '佐川急便', 'ヤマト運輸', '自社引取', 'その他']

export function TabShipment({
  woId,
  woCode,
  productName,
  totalProduced,
}: TabShipmentProps) {
  const t = useTranslations('WorkOrders')
  const supabase = createClient()

  const [shipments, setShipments] = useState<ShipmentRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Form State
  const todayStr = new Date().toISOString().slice(0, 10)
  const [formDate, setFormDate] = useState<string>(todayStr)
  const [formQty, setFormQty] = useState<string>('')
  const [formMethod, setFormMethod] = useState<string>('YSD便')
  const [formNotes, setFormNotes] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchShipments = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('work_order_id', woId)
        .order('ship_date', { ascending: false })

      if (error) {
        console.error('[TabShipment] Fetch error:', error)
      } else {
        setShipments((data as ShipmentRecord[]) || [])
      }
    } catch (err) {
      console.error('[TabShipment] Exception:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, woId])

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  // Calculations
  const totalShipped = shipments.reduce((acc, s) => acc + (Number(s.shipped_quantity) || 0), 0)
  const remainingQty = Math.max(0, totalProduced - totalShipped)
  const isOverShipped = totalProduced > 0 && totalShipped > totalProduced
  const shippingRate = totalProduced > 0 ? ((totalShipped / totalProduced) * 100).toFixed(1) : '0'

  const handleOpenModal = () => {
    setFormDate(todayStr)
    setFormQty(remainingQty > 0 ? String(remainingQty) : '')
    setFormMethod('YSD便')
    setFormNotes('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const qty = Number(formQty)
    if (!qty || isNaN(qty) || qty <= 0) {
      setFormError('数量を正しく入力してください (Số lượng phải lớn hơn 0)')
      return
    }

    if (!formDate) {
      setFormError('出荷日を入力してください (Vui lòng chọn ngày xuất hàng)')
      return
    }

    setSubmitting(true)
    try {
      const res = await createShipment({
        work_order_id: woId,
        ship_date: formDate,
        shipped_quantity: qty,
        delivery_method: formMethod,
        notes: formNotes,
      })

      if (!res.success) {
        setFormError(res.error || '出荷登録に失敗しました')
      } else {
        setIsModalOpen(false)
        await fetchShipments()
      }
    } catch (err: any) {
      setFormError(err?.message || 'システムエラーが発生しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ── 1. KPI Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {/* KPI: Total Shipped */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {t('shippedTotal')}
            </span>
            <Truck size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {totalShipped.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>pcs</span>
          </div>
        </div>

        {/* KPI: Total Produced */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {t('shippedProduced')}
            </span>
            <PackageCheck size={16} style={{ color: '#0EA5E9' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {totalProduced.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>pcs</span>
          </div>
        </div>

        {/* KPI: Remaining to Ship */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {t('shippedRemaining')}
            </span>
            <Clock size={16} style={{ color: remainingQty === 0 ? '#10B981' : '#F59E0B' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: remainingQty === 0 ? '#10B981' : 'var(--text-primary)' }}>
              {remainingQty.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>pcs</span>
          </div>
        </div>

        {/* KPI: Shipping Rate */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {t('shippedRate')}
            </span>
            <CheckCircle2 size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {shippingRate}%
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Over-shipping Warning (if any) ── */}
      {isOverShipped && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10, 
            padding: '10px 14px', 
            borderRadius: 6, 
            backgroundColor: 'var(--tint-orange-bg, #FFF7ED)', 
            border: '1px solid #FDBA74',
            color: '#C2410C',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{t('shippedOverWarning')} ({totalShipped.toLocaleString()} &gt; {totalProduced.toLocaleString()})</span>
        </div>
      )}

      {/* ── 3. Action Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('tabShipments')}
          </span>
          <span className="badge badge--neutral" style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {shipments.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '7px 14px' }}
        >
          <Plus size={15} />
          <span>{t('btnRegisterShipment')}</span>
        </button>
      </div>

      {/* ── 4. Shipments Table ── */}
      <div className="card-flat" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            読み込み中...
          </div>
        ) : shipments.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            <Truck size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <p>{t('noShipments')}</p>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '180px' }}>{t('colDeliveryNoteNo')}</th>
                <th style={{ width: '120px' }}>{t('colShipDate')}</th>
                <th style={{ width: '130px', textAlign: 'right' }}>{t('colShippedQty')}</th>
                <th style={{ width: '140px' }}>{t('colDeliveryMethod')}</th>
                <th style={{ width: '110px' }}>{t('status')}</th>
                <th>{t('notes')}</th>
                <th style={{ width: '140px', textAlign: 'center' }}>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.shipment_id}>
                  {/* Delivery Note No */}
                  <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)' }}>
                    {s.delivery_note_no || '—'}
                  </td>

                  {/* Ship Date */}
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>
                    {s.ship_date || '—'}
                  </td>

                  {/* Shipped Qty */}
                  <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>
                    {(Number(s.shipped_quantity) || 0).toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>pcs</span>
                  </td>

                  {/* Delivery Method */}
                  <td style={{ fontSize: 13 }}>
                    {s.delivery_method || '—'}
                  </td>

                  {/* Status */}
                  <td>
                    <span className="badge badge--success" style={{ fontSize: 11, padding: '2px 8px' }}>
                      {s.status === 'SHIPPED' ? '出荷済' : (s.status || '出荷済')}
                    </span>
                  </td>

                  {/* Notes */}
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {s.notes || '—'}
                  </td>

                  {/* Action: PDF */}
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className="badge badge--neutral"
                      title="Sprint M21-B で実装予定"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        padding: '3px 8px',
                        cursor: 'not-allowed',
                        opacity: 0.8
                      }}
                    >
                      <FileText size={12} />
                      <span>{t('pdfPendingM21B')}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── 5. Create Shipment Modal ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            className="card-flat"
            style={{
              width: '100%',
              maxWidth: 480,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 8,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--tint-teal-bg, #F0FDFA)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('modalShipmentTitle')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Context Summary */}
              <div 
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: 6, 
                  backgroundColor: 'var(--bg-muted, #F8FAFC)', 
                  border: '1px solid var(--border-default)',
                  fontSize: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>WO:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{woCode}</span>
                </div>
                {productName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>製品名:</span>
                    <span style={{ fontWeight: 600 }}>{productName}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>累計生産 / 出荷済:</span>
                  <span style={{ fontFamily: 'monospace' }}>{totalProduced.toLocaleString()} / {totalShipped.toLocaleString()} pcs</span>
                </div>
              </div>

              {/* Error Banner */}
              {formError && (
                <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: '#FEE2E2', color: '#B91C1C', fontSize: 12, fontWeight: 600 }}>
                  {formError}
                </div>
              )}

              {/* Field: Ship Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {t('colShipDate')} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </div>

              {/* Field: Shipped Quantity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {t('colShippedQty')} (pcs) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="例: 500"
                  min="1"
                  step="1"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  required
                  style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14 }}
                />
              </div>

              {/* Field: Delivery Method */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {t('colDeliveryMethod')}
                </label>
                <select
                  className="form-input"
                  value={formMethod}
                  onChange={(e) => setFormMethod(e.target.value)}
                >
                  {DELIVERY_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field: Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {t('notes')}
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="配送メモ・追跡番号・注意事項など"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  {submitting ? '登録中...' : t('btnRegisterShipment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
