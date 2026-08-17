'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { X, Plus, Building2, Package, Check, AlertCircle } from 'lucide-react'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'

type CreateProductModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (productId: string) => void
}

export default function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const t = useTranslations('Products')
  const tPC = useTranslations('ProductCenter')
  const tCommon = useTranslations('Common')
  const tCust = useTranslations('Customers')
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [productCode, setProductCode] = useState('')
  const [productNameInternal, setProductNameInternal] = useState('')
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [productDescription, setProductDescription] = useState('')
  const [customerProductName, setCustomerProductName] = useState('')
  const [productName, setProductName] = useState('')
  const [pocketCount, setPocketCount] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [codeExists, setCodeExists] = useState(false)

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setProductCode('')
      setProductNameInternal('')
      setCompanyId(null)
      setProductDescription('')
      setCustomerProductName('')
      setProductName('')
      setPocketCount('')
      setNotes('')
      setError(null)
      setCodeExists(false)
    }
  }, [isOpen])

  // Auto-format product_code to uppercase compact and product_name_internal
  const handleProductCodeChange = (raw: string) => {
    const compact = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    setProductCode(compact)

    // Auto-generate internal display name if internal name is not customized
    if (!productNameInternal || productNameInternal === raw || productNameInternal === compact) {
      // If starts with letters followed by numbers, add hyphen e.g. TOW009 -> TOW-009
      const match = compact.match(/^([A-Z]+)(\d+)$/)
      if (match) {
        setProductNameInternal(`${match[1]}-${match[2]}`)
      } else {
        setProductNameInternal(compact)
      }
    }
  }

  // Check unique code
  useEffect(() => {
    if (!productCode || productCode.length < 2) {
      setCodeExists(false)
      return
    }

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('product_id')
        .eq('product_code', productCode)
        .maybeSingle()

      setCodeExists(!!data)
    }, 300)

    return () => clearTimeout(timer)
  }, [productCode, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!productCode.trim()) {
      setError(t('productCode') + ' ' + tCommon('required'))
      return
    }

    if (codeExists) {
      setError(t('codeExists') || 'Mã sản phẩm đã tồn tại trong hệ thống')
      return
    }

    if (!companyId) {
      setError(tCust('customer') + ' ' + tCommon('required'))
      return
    }

    setLoading(true)

    try {
      const payload = {
        product_code: productCode.trim(),
        product_name_internal: productNameInternal.trim() || productCode.trim(),
        company_id: companyId,
        product_description: productDescription.trim() || null,
        customer_product_name: customerProductName.trim() || null,
        product_name: productName.trim() || null,
        pocket_count: pocketCount ? parseInt(pocketCount, 10) : null,
        product_status: 'ACTIVE',
        notes: notes.trim() || null,
      }

      const { data, error: insertErr } = await supabase
        .from('products')
        .insert([payload])
        .select('product_id')
        .single()

      if (insertErr) {
        throw new Error(insertErr.message)
      }

      if (data?.product_id) {
        onClose()
        if (onSuccess) {
          onSuccess(data.product_id)
        } else {
          router.push(`/product-center/${data.product_id}`)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16
      }}
      onClick={onClose}
    >
      <div 
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: 620,
          background: 'var(--bg-surface)',
          borderRadius: 8,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--tint-teal-bg, var(--bg-surface-2))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {t('newProductRegistration') || '新規製品登録'}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 6,
                background: 'var(--tint-error-bg, #fee2e2)',
                color: 'var(--status-error, #b91c1c)',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Row 1: Product Code (compact) & Internal Name (with hyphen) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  {t('productCode') || '型番 (Compact)'} <span style={{ color: 'var(--status-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: TOW009, JAE036"
                  value={productCode}
                  onChange={e => handleProductCodeChange(e.target.value)}
                  className="form-input"
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    borderColor: codeExists ? 'var(--status-error)' : undefined
                  }}
                />
                {codeExists && (
                  <span style={{ fontSize: 11, color: 'var(--status-error)', marginTop: 2, display: 'block' }}>
                    ⚠️ {t('codeExists') || 'Mã sản phẩm đã tồn tại'}
                  </span>
                )}
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  {t('internalProductName') || '社内表示名 (ハイフン付)'}
                </label>
                <input
                  type="text"
                  placeholder="例: TOW-009, JAE-036"
                  value={productNameInternal}
                  onChange={e => setProductNameInternal(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace', fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Row 2: Customer (Company) */}
            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                {tCust('customer') || '顧客名'} <span style={{ color: 'var(--status-error)' }}>*</span>
              </label>
              <AsyncSearchableSelect
                value={companyId}
                onChange={setCompanyId}
                placeholder={tCust('selectCustomer') || '顧客を選択...'}
                fetchOptions={async (query) => {
                  let req = supabase
                    .from('companies')
                    .select('company_id, company_name, company_code')
                    .order('company_code', { ascending: true })
                    .limit(30)

                  if (query) {
                    req = req.or(`company_name.ilike.%${query}%,company_code.ilike.%${query}%`)
                  }

                  const { data } = await req
                  return (data || []).map(c => ({
                    value: c.company_id,
                    label: c.company_name,
                    sublabel: c.company_code
                  }))
                }}
              />
            </div>

            {/* Row 3: Working Product Description (品名 / Mô tả làm việc - SSOT for preliminary name) */}
            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                {t('productDescription') || '品名 / 製品説明 (作業用)'}
              </label>
              <input
                type="text"
                placeholder="例: VARANUS向け梱包トレイ 321×254 10個入"
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
                className="form-input"
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>
                ※ 工程票に記載の品名・作業用名称（見積・商談段階で決定した説明）
              </span>
            </div>

            {/* Row 4: Customer Part Name & Official Product Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  {t('customerPartNumber') || '客先品番 / 客先品名'}
                </label>
                <input
                  type="text"
                  placeholder="例: PART-8802-A"
                  value={customerProductName}
                  onChange={e => setCustomerProductName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  {t('officialProductName') || '正式品名 (請求書用)'}
                </label>
                <input
                  type="text"
                  placeholder="未確定の場合は空欄"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 5: Pocket Count & Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  {t('pocketCount') || 'ポケット数'}
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="例: 10"
                  value={pocketCount}
                  onChange={e => setPocketCount(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  {tCommon('notes') || '備考'}
                </label>
                <input
                  type="text"
                  placeholder="特記事項・社内メモ"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface-2)'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              {tCommon('cancel') || 'キャンセル'}
            </button>
            <button
              type="submit"
              disabled={loading || codeExists || !productCode || !companyId}
              className="btn btn-primary"
            >
              {loading ? (
                <span>{tCommon('saving') || '保存中...'}</span>
              ) : (
                <React.Fragment>
                  <Plus size={14} />
                  <span>{t('createProduct') || '製品を作成'}</span>
                </React.Fragment>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
