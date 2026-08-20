'use client'

import React, { useState, useEffect } from 'react'
import { X, Package, Save, Loader2, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export type ProductEditData = {
  product_id: string
  product_code: string
  product_name: string | null
  product_name_internal: string | null
  customer_product_name: string | null
  product_description: string | null
  product_status: string
  pocket_count: number | null
  pieces_per_box: number | null
  company_id: string
  notes: string | null
  first_shipment_date: string | null
}

interface EditProductModalProps {
  isOpen: boolean
  product: ProductEditData | null
  onClose: () => void
  onSuccess: () => void
}

export function EditProductModal({
  isOpen,
  product,
  onClose,
  onSuccess
}: EditProductModalProps) {
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companies, setCompanies] = useState<Array<{ company_id: string; company_code: string; company_name: string }>>([])

  const [formData, setFormData] = useState({
    product_code: '',
    product_name_internal: '',
    product_name: '',
    customer_product_name: '',
    product_description: '',
    product_status: 'ACTIVE',
    pocket_count: '',
    pieces_per_box: '',
    company_id: '',
    notes: '',
    first_shipment_date: ''
  })

  // Load companies for customer dropdown
  useEffect(() => {
    async function loadCompanies() {
      const { data } = await supabase
        .from('companies')
        .select('company_id, company_code, company_name')
        .order('company_code', { ascending: true })
      if (data) setCompanies(data)
    }
    if (isOpen) loadCompanies()
  }, [isOpen, supabase])

  useEffect(() => {
    if (!isOpen || !product) return
    setError(null)
    setFormData({
      product_code: product.product_code || '',
      product_name_internal: product.product_name_internal || '',
      product_name: product.product_name || '',
      customer_product_name: product.customer_product_name || '',
      product_description: product.product_description || '',
      product_status: product.product_status || 'ACTIVE',
      pocket_count: product.pocket_count != null ? String(product.pocket_count) : '',
      pieces_per_box: product.pieces_per_box != null ? String(product.pieces_per_box) : '',
      company_id: product.company_id || '',
      notes: product.notes || '',
      first_shipment_date: product.first_shipment_date || ''
    })
  }, [isOpen, product])

  if (!isOpen || !product) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.product_code.trim()) {
      setError('製品コードは必須です (Product Code is required)')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: updateErr } = await supabase
        .from('products')
        .update({
          product_code: formData.product_code.trim(),
          product_name_internal: formData.product_name_internal.trim() || null,
          product_name: formData.product_name.trim() || null,
          customer_product_name: formData.customer_product_name.trim() || null,
          product_description: formData.product_description.trim() || null,
          product_status: formData.product_status,
          pocket_count: formData.pocket_count ? parseInt(formData.pocket_count, 10) : null,
          pieces_per_box: formData.pieces_per_box ? parseInt(formData.pieces_per_box, 10) : null,
          company_id: formData.company_id || product.company_id,
          notes: formData.notes.trim() || null,
          first_shipment_date: formData.first_shipment_date || null
        })
        .eq('product_id', product.product_id)

      if (updateErr) throw new Error(updateErr.message)

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || '製品情報の更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 680, maxHeight: '90vh',
          background: 'var(--bg-surface)', borderRadius: 10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-teal-bg, var(--bg-surface-2))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                製品基本情報編集 (Chỉnh sửa Sản phẩm)
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {product.product_code}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: 20, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{
                padding: '10px 12px', borderRadius: 6, background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid-2" style={{ gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  製品コード (Mã SP) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.product_code}
                  onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                  placeholder="ADY071"
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  社内名称 (Tên nội bộ)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.product_name_internal}
                  onChange={(e) => setFormData({ ...formData, product_name_internal: e.target.value })}
                  placeholder="ADY-071"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  製品名 / 仕様 (Tên chính thức / Quy cách)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="Tên sản phẩm"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  顧客製品名 (Mã / Tên SP Khách hàng)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.customer_product_name}
                  onChange={(e) => setFormData({ ...formData, customer_product_name: e.target.value })}
                  placeholder="DB2-6874-000"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  顧客 (Khách hàng)
                </label>
                <select
                  className="form-input"
                  value={formData.company_id}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                >
                  <option value="">-- 顧客を選択 --</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>
                      {c.company_code} - {c.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  ステータス (Trạng thái)
                </label>
                <select
                  className="form-input"
                  value={formData.product_status}
                  onChange={(e) => setFormData({ ...formData, product_status: e.target.value })}
                >
                  <option value="ACTIVE">有効 (Active)</option>
                  <option value="MAINTENANCE">メンテ中 (Maintenance)</option>
                  <option value="DISPOSED">廃止 (Disposed)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  ポケット数 (Số khay/lỗ)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.pocket_count}
                  onChange={(e) => setFormData({ ...formData, pocket_count: e.target.value })}
                  placeholder="5"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  入数 / 箱 (Số cái / thùng)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.pieces_per_box}
                  onChange={(e) => setFormData({ ...formData, pieces_per_box: e.target.value })}
                  placeholder="100"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  初回出荷日 (Ngày xuất hàng đầu tiên)
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.first_shipment_date}
                  onChange={(e) => setFormData({ ...formData, first_shipment_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                トレイ詳細・仕様説明 (Mô tả chi tiết khay)
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                value={formData.product_description}
                onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                placeholder="309×218 5個入..."
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                備考 (Ghi chú)
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú nội bộ..."
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px', borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 8
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{tCommon('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
