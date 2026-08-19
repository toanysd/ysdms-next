'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { X, Plus, Building2, Package, Check, AlertCircle, Layers, Hammer, Sparkles, CheckCircle2, Eye, Loader2 } from 'lucide-react'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { createDesignJobAction } from '@/app/actions/design-job'
import { approveDesignRevisionAction } from '@/app/actions/engineering'

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
  const [selectedCompany, setSelectedCompany] = useState<{ value: string; label: string; sublabel?: string } | null>(null)
  const [customerMatchHint, setCustomerMatchHint] = useState<string | null>(null)
  const [isManualCompanySelected, setIsManualCompanySelected] = useState(false)
  const [productDescription, setProductDescription] = useState('')
  const [customerProductName, setCustomerProductName] = useState('')
  const [productName, setProductName] = useState('')
  const [pocketCount, setPocketCount] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [codeExists, setCodeExists] = useState(false)
  const [requiresPrototypeMold, setRequiresPrototypeMold] = useState(false)
  const [isInternalNameCustomized, setIsInternalNameCustomized] = useState(false)

  // Existing product & revision state (when user types existing code like MMT020)
  const [existingProduct, setExistingProduct] = useState<any | null>(null)
  const [existingRevisions, setExistingRevisions] = useState<any[]>([])
  const [loadingRevisions, setLoadingRevisions] = useState(false)
  const [showRevisionsList, setShowRevisionsList] = useState(false)
  const [creatingRevision, setCreatingRevision] = useState(false)

  // Smart suggestion for next product code based on customer's existing products
  const [suggestedProductInfo, setSuggestedProductInfo] = useState<{
    companyName: string
    latestCode: string
    nextCode: string
    nextInternal: string
  } | null>(null)

  // Technical Specs & Approval Option State
  const [designLength, setDesignLength] = useState<string>('')
  const [designWidth, setDesignWidth] = useState<string>('')
  const [designHeight, setDesignHeight] = useState<string>('')
  const [plasticTypeDesigned, setPlasticTypeDesigned] = useState<string>('')
  const [approvalAction, setApprovalAction] = useState<'DRAFT' | 'PROTOTYPE' | 'MASS'>('DRAFT')
  const [targetDeadline, setTargetDeadline] = useState<string>('')

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setProductCode('')
      setProductNameInternal('')
      setCompanyId(null)
      setSelectedCompany(null)
      setCustomerMatchHint(null)
      setIsManualCompanySelected(false)
      setIsInternalNameCustomized(false)
      setProductDescription('')
      setCustomerProductName('')
      setProductName('')
      setPocketCount('')
      setNotes('')
      setError(null)
      setCodeExists(false)
      setExistingProduct(null)
      setExistingRevisions([])
      setShowRevisionsList(false)
      setSuggestedProductInfo(null)
      setRequiresPrototypeMold(false)
      setDesignLength('')
      setDesignWidth('')
      setDesignHeight('')
      setPlasticTypeDesigned('')
      setApprovalAction('DRAFT')
      setTargetDeadline('')
    }
  }, [isOpen])

  // Auto-format product_code to uppercase compact and product_name_internal
  const handleProductCodeChange = (raw: string) => {
    const compact = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    setProductCode(compact)

    // Auto-generate isomorphic internal mold/product code if not manually customized
    if (!isInternalNameCustomized) {
      // If starts with letters followed by numbers, add hyphen e.g. MMT021 -> MMT-021, TOW009 -> TOW-009
      const match = compact.match(/^([A-Z]+)(\d+)([A-Z0-9]*)$/)
      if (match) {
        const prefix = match[1]
        const num = match[2]
        const suffix = match[3]
        setProductNameInternal(suffix ? `${prefix}-${num}${suffix}` : `${prefix}-${num}`)
      } else {
        setProductNameInternal(compact)
      }
    }
  }

  // Check unique code & fetch existing product + design revisions
  useEffect(() => {
    if (!productCode || productCode.length < 2) {
      setCodeExists(false)
      setExistingProduct(null)
      setExistingRevisions([])
      return
    }

    const timer = setTimeout(async () => {
      const { data: prod } = await supabase
        .from('products')
        .select(`
          product_id, product_code, product_name_internal, product_name, product_description, customer_product_name, pocket_count, company_id,
          companies(company_name, company_code)
        `)
        .eq('product_code', productCode)
        .maybeSingle()

      if (prod) {
        setCodeExists(true)
        setExistingProduct(prod)
        // Fetch existing revisions for this product
        setLoadingRevisions(true)
        const { data: revs } = await supabase
          .from('design_revisions')
          .select('revision_id, design_code, revision_number, status, design_category, created_at, design_length, design_width, design_height, plastic_type_designed, tray_info')
          .eq('product_id', prod.product_id)
          .order('revision_number', { ascending: false })

        setExistingRevisions(revs || [])
        setLoadingRevisions(false)
      } else {
        setCodeExists(false)
        setExistingProduct(null)
        setExistingRevisions([])
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [productCode, supabase])

  // Auto-suggest Customer and Next Product Code based on Product Code prefix (e.g. MMT -> MMT-020 -> MMT-021)
  useEffect(() => {
    if (!productCode || productCode.length < 2) {
      setSuggestedProductInfo(null)
      return
    }

    const prefixMatch = productCode.match(/^([A-Z]+)/)
    if (!prefixMatch || prefixMatch[1].length < 2) {
      setSuggestedProductInfo(null)
      return
    }

    const prefix = prefixMatch[1]
    const timer = setTimeout(async () => {
      // 1. Match company by prefix
      const { data: compData } = await supabase
        .from('companies')
        .select('company_id, company_name, company_code')
        .or(`company_code.ilike.${prefix}%,company_code.ilike.%${prefix}%,company_name.ilike.%${prefix}%`)
        .order('company_code', { ascending: true })
        .limit(1)

      let matchedComp = compData && compData.length > 0 ? compData[0] : null
      if (matchedComp && !isManualCompanySelected) {
        setCompanyId(matchedComp.company_id)
        setSelectedCompany({
          value: matchedComp.company_id,
          label: matchedComp.company_name,
          sublabel: matchedComp.company_code
        })
        setCustomerMatchHint(`💡 プレフィックス [${prefix}] から自動選択: ${matchedComp.company_name} (${matchedComp.company_code})`)
      }

      // 2. Scan existing products for this company/prefix to suggest next code
      const { data: prodData } = await supabase
        .from('products')
        .select('product_code, product_name_internal')
        .or(`product_code.ilike.${prefix}%,product_name_internal.ilike.${prefix}%`)
        .order('product_code', { ascending: false })
        .limit(60)

      if (prodData && prodData.length > 0) {
        let maxNum = 0
        let latestCode = ''
        prodData.forEach(p => {
          const numMatch = (p.product_code || '').match(/\d+/)
          if (numMatch) {
            const n = parseInt(numMatch[0], 10)
            if (n > maxNum) {
              maxNum = n
              latestCode = p.product_name_internal || p.product_code
            }
          }
        })

        if (maxNum > 0) {
          const nextNum = maxNum + 1
          const nextNumStr = String(nextNum).padStart(3, '0') // e.g. 021
          const nextCode = `${prefix}${nextNumStr}`
          const nextInternal = `${prefix}-${nextNumStr}`
          setSuggestedProductInfo({
            companyName: matchedComp?.company_name || prefix,
            latestCode: latestCode || `${prefix}-${String(maxNum).padStart(3, '0')}`,
            nextCode,
            nextInternal
          })
        } else {
          setSuggestedProductInfo(null)
        }
      } else {
        setSuggestedProductInfo(null)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [productCode, isManualCompanySelected, supabase])

  // Create next revision for existing product (e.g. MMT-020 -> R1 / R2)
  const handleCreateNextRevision = async () => {
    if (!existingProduct) return
    setCreatingRevision(true)
    setError(null)
    try {
      const maxRev = existingRevisions.length > 0
        ? Math.max(...existingRevisions.map(r => r.revision_number || 0))
        : 0
      const nextRevNumber = maxRev + 1
      const cleanInternal = existingProduct.product_name_internal || existingProduct.product_code
      const nextDesignCode = `${cleanInternal}R${nextRevNumber}`

      const latestRev = existingRevisions[0] || {}

      const { data: newRev, error: revErr } = await supabase
        .from('design_revisions')
        .insert([{
          product_id: existingProduct.product_id,
          company_id: existingProduct.company_id,
          design_code: nextDesignCode,
          revision_number: nextRevNumber,
          status: approvalAction !== 'DRAFT' ? 'APPROVED' : 'DRAFT',
          design_category: (approvalAction === 'PROTOTYPE' || requiresPrototypeMold) ? 'PROTOTYPE_POCKET' : 'MASS_PRODUCTION',
          tray_info: designLength && designWidth ? `${designLength}x${designWidth}x${designHeight || 0}` : latestRev.tray_info,
          customer_tray_name: customerProductName || existingProduct.customer_product_name,
          cavity_count: pocketCount ? parseInt(pocketCount, 10) : existingProduct.pocket_count,
          design_length: designLength ? parseFloat(designLength) : latestRev.design_length,
          design_width: designWidth ? parseFloat(designWidth) : latestRev.design_width,
          design_height: designHeight ? parseFloat(designHeight) : latestRev.design_height,
          plastic_type_designed: plasticTypeDesigned || latestRev.plastic_type_designed,
          change_summary: notes.trim() || `改訂版 R${nextRevNumber} 新規作成`
        }])
        .select('revision_id')
        .single()

      if (revErr) throw revErr

      // Auto-create Design Job for revision
      if (newRev) {
        await createDesignJobAction({
          product_id: existingProduct.product_id,
          product_code: existingProduct.product_code,
          company_id: existingProduct.company_id,
          design_revision_id: newRev.revision_id,
          is_post_production: true,
          modification_number: nextRevNumber,
          requires_prototype_mold: requiresPrototypeMold || approvalAction === 'PROTOTYPE'
        })

        if (approvalAction === 'PROTOTYPE' || approvalAction === 'MASS') {
          await approveDesignRevisionAction({
            revisionId: newRev.revision_id,
            approvalType: approvalAction,
            targetDeadline: targetDeadline || null,
            notes: `Duyệt bản vẽ R${nextRevNumber}`
          })
        }
      }

      onClose()
      if (onSuccess) {
        onSuccess(existingProduct.product_id)
      } else {
        router.push(`/product-center/${existingProduct.product_id}`)
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo phiên bản thiết kế mới')
    } finally {
      setCreatingRevision(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!productCode.trim()) {
      setError(t('productCode') + ' ' + tCommon('required'))
      return
    }

    if (codeExists) {
      setError(t('codeExists') || 'Mã sản phẩm đã tồn tại trong hệ thống. Vui lòng chọn hành động bên dưới.')
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
        requires_prototype_mold: requiresPrototypeMold,
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
        // 1. Auto-create initial Design Revision R0 (SSOT for technical specifications)
        // Rule: R0 (revision_number: 0), design_code: cleanInternal (NO R0 suffix)
        let initialRevisionId: string | null = null
        try {
          const cleanInternal = productNameInternal.trim() || productCode.trim()
          const initialDesignCode = cleanInternal // R0 has NO suffix, e.g. "MMT-021"
          const { data: revData, error: revErr } = await supabase
            .from('design_revisions')
            .insert([{
              product_id: data.product_id,
              company_id: companyId,
              design_code: initialDesignCode,
              revision_number: 0,
              status: approvalAction !== 'DRAFT' ? 'APPROVED' : 'DRAFT',
              design_category: (approvalAction === 'PROTOTYPE' || requiresPrototypeMold) ? 'PROTOTYPE_POCKET' : 'MASS_PRODUCTION',
              tray_info: productDescription.trim() || null,
              customer_tray_name: customerProductName.trim() || null,
              cavity_count: pocketCount ? parseInt(pocketCount, 10) : null,
              design_length: designLength ? parseFloat(designLength) : null,
              design_width: designWidth ? parseFloat(designWidth) : null,
              design_height: designHeight ? parseFloat(designHeight) : null,
              plastic_type_designed: plasticTypeDesigned.trim() || null
            }])
            .select('revision_id')
            .single()

          if (revData) {
            initialRevisionId = revData.revision_id
          }
        } catch (revInsertErr) {
          console.warn('[Warning] Auto-create initial revision R0 failed:', revInsertErr)
        }

        // 2. Auto-create Design Job linked to R0
        try {
          await createDesignJobAction({
            product_id: data.product_id,
            product_code: productCode.trim(),
            company_id: companyId,
            design_revision_id: initialRevisionId,
            requires_prototype_mold: requiresPrototypeMold || approvalAction === 'PROTOTYPE'
          })
        } catch (djErr) {
          console.error('[Warning] Auto-create Design Job failed:', djErr)
        }

        // 3. If approved immediately (PROTOTYPE or MASS), create equipment & manufacturing job
        if (initialRevisionId && (approvalAction === 'PROTOTYPE' || approvalAction === 'MASS')) {
          try {
            await approveDesignRevisionAction({
              revisionId: initialRevisionId,
              approvalType: approvalAction,
              targetDeadline: targetDeadline || null,
              notes: 'Tạo và duyệt trực tiếp khi đăng ký sản phẩm'
            })
          } catch (apprErr) {
            console.error('[Warning] Immediate approval failed:', apprErr)
          }
        }

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

            {/* Smart Suggestion Pill for Next Product Code */}
            {suggestedProductInfo && !codeExists && (
              <div style={{
                padding: '8px 12px',
                borderRadius: 6,
                background: 'var(--tint-teal-bg, #F0FDFA)',
                border: '1px solid var(--tint-teal-border, #99F6E4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11.5,
                gap: 8,
                animation: 'fadeIn 0.2s ease-in-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>
                    <strong>{suggestedProductInfo.companyName}</strong> の最新製品: <code className="font-mono font-bold">{suggestedProductInfo.latestCode}</code>
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>→ 次の推奨コード:</span>
                  <span className="font-mono font-bold text-accent" style={{ background: '#fff', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--tint-teal-border)' }}>
                    {suggestedProductInfo.nextInternal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProductCode(suggestedProductInfo.nextCode)
                    setProductNameInternal(suggestedProductInfo.nextInternal)
                    setIsInternalNameCustomized(false)
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: 10.5, padding: '2px 8px', height: 24, fontWeight: 700, borderColor: 'var(--accent)', color: 'var(--accent)', whiteSpace: 'nowrap' }}
                >
                  ✓ 適用する (Áp dụng)
                </button>
              </div>
            )}

            {/* Existing Product Warning & 3 Action Choices */}
            {codeExists && existingProduct && (
              <div style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: '#FFF7ED',
                border: '1.5px solid #FDBA74',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                animation: 'fadeIn 0.2s ease-in-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={18} style={{ color: '#C2410C', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#9A3412' }}>
                        製品 [{existingProduct.product_name_internal || existingProduct.product_code}] はすでに登録されています
                      </div>
                      <div style={{ fontSize: 11.5, color: '#C2410C' }}>
                        顧客: {existingProduct.companies?.company_name || '—'} ・ 現在の設計版数: {existingRevisions.length}件
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 2 }}>
                  {/* Action 1: Open Latest Design */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      router.push(`/product-center/${existingProduct.product_id}`)
                    }}
                    className="btn btn-secondary"
                    style={{
                      fontSize: 10.5,
                      padding: '6px 6px',
                      justifyContent: 'center',
                      background: '#fff',
                      borderColor: '#FED7AA',
                      color: '#9A3412',
                      fontWeight: 700,
                      gap: 4
                    }}
                  >
                    <Eye size={12} />
                    <span>最新設計を開く ({existingRevisions[0]?.design_code || 'R0'})</span>
                  </button>

                  {/* Action 2: Create Next Revision (R1, R2...) */}
                  <button
                    type="button"
                    onClick={handleCreateNextRevision}
                    disabled={creatingRevision}
                    className="btn btn-primary"
                    style={{
                      fontSize: 10.5,
                      padding: '6px 6px',
                      justifyContent: 'center',
                      background: 'var(--accent)',
                      borderColor: 'var(--accent)',
                      fontWeight: 700,
                      gap: 4
                    }}
                  >
                    {creatingRevision ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    <span>
                      次の改訂版（R{existingRevisions.length > 0 ? Math.max(...existingRevisions.map(r => r.revision_number || 0)) + 1 : 1}）を作成
                    </span>
                  </button>

                  {/* Action 3: Expand Revisions List */}
                  <button
                    type="button"
                    onClick={() => setShowRevisionsList(!showRevisionsList)}
                    className="btn btn-secondary"
                    style={{
                      fontSize: 10.5,
                      padding: '6px 6px',
                      justifyContent: 'center',
                      background: '#fff',
                      borderColor: '#FED7AA',
                      color: '#9A3412',
                      fontWeight: 600,
                      gap: 4
                    }}
                  >
                    <Layers size={12} />
                    <span>版数一覧 ({existingRevisions.length}件) {showRevisionsList ? '▲' : '▼'}</span>
                  </button>
                </div>

                {/* Expanded Revisions Table */}
                {showRevisionsList && (
                  <div style={{ background: '#fff', borderRadius: 6, border: '1px solid #FED7AA', padding: 8, display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 150, overflowY: 'auto' }}>
                    {existingRevisions.map((rev) => (
                      <div
                        key={rev.revision_id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          borderRadius: 4,
                          background: '#FFF7ED',
                          fontSize: 11.5
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>
                            R{rev.revision_number}: {rev.design_code}
                          </span>
                          <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: rev.status === 'APPROVED' ? '#DCFCE7' : '#F1F5F9', color: rev.status === 'APPROVED' ? '#15803D' : '#475569', fontWeight: 700 }}>
                            {rev.status === 'APPROVED' ? '承認済' : '設計中'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            router.push(`/product-center/${existingProduct.product_id}?tab=engineering&revId=${rev.revision_id}`)
                          }}
                          style={{ border: 'none', background: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 11, textDecoration: 'underline', fontWeight: 600 }}
                        >
                          詳細を見る →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  placeholder="例: MMT021, TOW009"
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
                  {t('internalProductName') || '社内製品・金型表示名 (ハイフン付)'}
                </label>
                <input
                  type="text"
                  placeholder="例: MMT-021, TOW-009"
                  value={productNameInternal}
                  onChange={e => {
                    setProductNameInternal(e.target.value)
                    setIsInternalNameCustomized(true)
                  }}
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
                initialOption={selectedCompany}
                onChange={(val) => {
                  setCompanyId(val)
                  if (!val) {
                    setSelectedCompany(null)
                    setCustomerMatchHint(null)
                  } else {
                    setIsManualCompanySelected(true)
                    setCustomerMatchHint(null)
                  }
                }}
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
              {customerMatchHint && (
                <div style={{
                  fontSize: 11,
                  color: '#15803D',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 4,
                  padding: '3px 8px',
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  animation: 'fadeIn 0.2s ease-in-out'
                }}>
                  <span style={{ fontWeight: 600 }}>{customerMatchHint}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyId(null)
                      setSelectedCompany(null)
                      setCustomerMatchHint(null)
                      setIsManualCompanySelected(true)
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', fontWeight: 'bold' }}
                    title="解除"
                  >
                    ✕
                  </button>
                </div>
              )}
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

              {/* 試作ポケット toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 6,
                background: requiresPrototypeMold ? 'var(--tint-orange-bg)' : 'var(--bg-surface-2)',
                border: '1px solid var(--border-default)',
              }}>
                <input
                  type="checkbox"
                  id="prototype-mold-toggle"
                  checked={requiresPrototypeMold}
                  onChange={e => setRequiresPrototypeMold(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                />
                <label htmlFor="prototype-mold-toggle" style={{ fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                  試作ポケット (Cần khuôn thử nghiệm)
                </label>
              </div>
            </div>

            {/* Section: R0 Technical Specs (Optional) */}
            <div style={{
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={13} style={{ color: 'var(--accent)' }} />
                  初版設計仕様 (R0)
                </span>
                <span className="badge badge--info font-mono" style={{ fontSize: 9 }}>
                  {productNameInternal.trim() || productCode.trim() || 'R0'} (初版自動生成)
                </span>
              </div>

              {/* Dimensions + Plastic Type */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 2fr', gap: 8 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>
                    長さ L (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="L (mm)"
                    value={designLength}
                    onChange={e => setDesignLength(e.target.value)}
                    className="form-input"
                    style={{ fontSize: 11, padding: '4px 6px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>
                    幅 W (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="W (mm)"
                    value={designWidth}
                    onChange={e => setDesignWidth(e.target.value)}
                    className="form-input"
                    style={{ fontSize: 11, padding: '4px 6px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>
                    深さ H (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="H (mm)"
                    value={designHeight}
                    onChange={e => setDesignHeight(e.target.value)}
                    className="form-input"
                    style={{ fontSize: 11, padding: '4px 6px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>
                    材料仕様 (Nhựa)
                  </label>
                  <input
                    type="text"
                    placeholder="例: PET 0.5t 透明"
                    value={plasticTypeDesigned}
                    onChange={e => setPlasticTypeDesigned(e.target.value)}
                    className="form-input"
                    style={{ fontSize: 11, padding: '4px 6px' }}
                  />
                </div>
              </div>
            </div>

            {/* Section: Action & Approval Option */}
            <div style={{
              background: approvalAction !== 'DRAFT' ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)',
              border: `1px solid ${approvalAction !== 'DRAFT' ? 'var(--tint-teal-border)' : 'var(--border-default)'}`,
              borderRadius: 6,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                  登録後の進行アクション
                </span>
                {approvalAction !== 'DRAFT' && (
                  <span className="badge badge--success font-bold" style={{ fontSize: 9 }}>
                    金型Job即時生成
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {/* Option 1: Draft (Design in progress) */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: `1px solid ${approvalAction === 'DRAFT' ? 'var(--accent)' : 'var(--border-default)'}`,
                  background: approvalAction === 'DRAFT' ? 'var(--bg-surface)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: approvalAction === 'DRAFT' ? 700 : 500
                }}>
                  <input
                    type="radio"
                    name="approvalAction"
                    value="DRAFT"
                    checked={approvalAction === 'DRAFT'}
                    onChange={() => setApprovalAction('DRAFT')}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span>📐 設計中 (下書き)</span>
                </label>

                {/* Option 2: Prototype Approval */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: `1px solid ${approvalAction === 'PROTOTYPE' ? '#EA580C' : 'var(--border-default)'}`,
                  background: approvalAction === 'PROTOTYPE' ? 'var(--bg-surface)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: approvalAction === 'PROTOTYPE' ? 700 : 500
                }}>
                  <input
                    type="radio"
                    name="approvalAction"
                    value="PROTOTYPE"
                    checked={approvalAction === 'PROTOTYPE'}
                    onChange={() => setApprovalAction('PROTOTYPE')}
                    style={{ accentColor: '#EA580C' }}
                  />
                  <span>🧪 試作金型を即承認</span>
                </label>

                {/* Option 3: Mass Approval */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: `1px solid ${approvalAction === 'MASS' ? '#16A34A' : 'var(--border-default)'}`,
                  background: approvalAction === 'MASS' ? 'var(--bg-surface)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: approvalAction === 'MASS' ? 700 : 500
                }}>
                  <input
                    type="radio"
                    name="approvalAction"
                    value="MASS"
                    checked={approvalAction === 'MASS'}
                    onChange={() => setApprovalAction('MASS')}
                    style={{ accentColor: '#16A34A' }}
                  />
                  <span>🏆 本型を即承認</span>
                </label>
              </div>

              {approvalAction !== 'DRAFT' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    金型納期:
                  </label>
                  <input
                    type="date"
                    value={targetDeadline}
                    onChange={e => setTargetDeadline(e.target.value)}
                    className="form-input"
                    style={{ fontSize: 11, padding: '3px 8px', width: 140 }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    ※ 承認と同時に製造Jobをスケジュール表に配置します
                  </span>
                </div>
              )}
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
