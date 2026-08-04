'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { Plus, Trash2, Save, X, ArrowLeft, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { upsertOrderAction, OrderHeaderInput, OrderLineInput } from '@/app/actions/orders'
import { useTranslations } from 'next-intl'

type DesignRevisionOption = {
  revision_id: string
  design_code: string
  plastic_type_designed: string | null
  cutline_length: number | null
  cutline_width: number | null
  cavity_count: number | null
  status: string | null
}

type OrderFormProps = {
  initialOrder?: {
    header: OrderHeaderInput
    lines: OrderLineInput[]
  }
  isEditing?: boolean
  onCancel?: () => void
  onSuccess?: (orderId: string) => void
}

export function OrderForm({ initialOrder, isEditing = false, onCancel, onSuccess }: OrderFormProps) {
  const t = useTranslations('Orders')
  const tCommon = useTranslations('Common')
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [header, setHeader] = useState<OrderHeaderInput>(
    initialOrder?.header || {
      company_id: '',
      order_no: '',
      order_date: new Date().toISOString().split('T')[0],
      requested_delivery: null,
      order_type: 'PRODUCT',
      customer_order_no: '',
      lot_no: '',
      notes: '',
      order_status: 'NEW'
    }
  )

  const [lines, setLines] = useState<OrderLineInput[]>(
    initialOrder?.lines || [
      {
        product_id: null,
        design_revision_id: null,
        delivery_site_id: null,
        line_no: 1,
        quantity: 0,
        unit: 'PCS',
        due_date: '',
        ship_date: '',
        is_free_sample: false,
        charge_type: 'PAID',
        packing_style: '',
        shipping_notes: ''
      }
    ]
  )

  // Revision options per product
  const [productRevisions, setProductRevisions] = useState<Record<string, DesignRevisionOption[]>>({})
  // Material info per revision
  const [revisionDetails, setRevisionDetails] = useState<Record<string, any>>({})
  // Toggle revision selector visibility per line
  const [showRevisionPicker, setShowRevisionPicker] = useState<Record<number, boolean>>({})

  // Tự động load sites khi chọn company_id
  const [availableSites, setAvailableSites] = useState<{value: string, label: string, sublabel?: string}[]>([])

  useEffect(() => {
    if (header.company_id) {
      supabase.from('delivery_sites')
        .select('site_id, site_code, site_name, contact_person')
        .eq('company_id', header.company_id)
        .eq('is_active', true)
        .then(({ data }) => {
          if (data) {
            setAvailableSites(data.map(d => ({
              value: d.site_id,
              label: d.site_name,
              sublabel: `${d.site_code} - ${d.contact_person || ''}`
            })))
          }
        })
    } else {
      setAvailableSites([])
    }
  }, [header.company_id, supabase])

  // Load revisions for a product
  const loadRevisionsForProduct = useCallback(async (productId: string) => {
    if (!productId || productRevisions[productId]) return
    
    // Lookup mold_master_id from product first
    const { data: product } = await (supabase as any)
      .from('products')
      .select('product_id, product_code, mold_master_id')
      .eq('product_id', productId)
      .single()
    
    if (!product?.mold_master_id) {
      // No mold master linked — try direct product_id on design_revisions
      const { data: revs } = await (supabase as any)
        .from('design_revisions')
        .select('revision_id, design_code, plastic_type_designed, cutline_length, cutline_width, cavity_count, status')
        .eq('product_id', productId)
        .order('design_code', { ascending: false })
      
      setProductRevisions(prev => ({ ...prev, [productId]: (revs || []) as DesignRevisionOption[] }))
      return
    }

    const { data: revs } = await (supabase as any)
      .from('design_revisions')
      .select('revision_id, design_code, plastic_type_designed, cutline_length, cutline_width, cavity_count, status')
      .eq('mold_master_id', product.mold_master_id)
      .order('design_code', { ascending: false })
    
    setProductRevisions(prev => ({ ...prev, [productId]: (revs || []) as DesignRevisionOption[] }))
  }, [productRevisions, supabase])

  // Load material detail for a specific revision
  const loadRevisionDetail = useCallback(async (revisionId: string) => {
    if (!revisionId || revisionDetails[revisionId]) return
    
    const { data } = await (supabase as any)
      .from('design_revisions')
      .select(`
        revision_id,
        design_code,
        cutline_length,
        cutline_width,
        cavity_count,
        plastic_type_designed,
        plastic_master:plastic_master_id(plastic_code, thickness_mm, color_name_normalized)
      `)
      .eq('revision_id', revisionId)
      .single()
    
    if (data) {
      setRevisionDetails(prev => ({ ...prev, [revisionId]: data }))
    }
  }, [revisionDetails, supabase])

  // Effect to load revisions for initial lines
  useEffect(() => {
    lines.forEach(l => {
      if (l.product_id) {
        loadRevisionsForProduct(l.product_id)
      }
      if (l.design_revision_id) {
        loadRevisionDetail(l.design_revision_id)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddLine = () => {
    const prevLine = lines.length > 0 ? lines[lines.length - 1] : null;
    setLines([
      ...lines, 
      {
        product_id: null,
        design_revision_id: null,
        delivery_site_id: null,
        line_no: lines.length > 0 ? Math.max(...lines.map(l => l.line_no)) + 1 : 1,
        quantity: 0,
        unit: 'PCS',
        due_date: prevLine ? prevLine.due_date : '',
        ship_date: '',
        is_free_sample: false,
        charge_type: 'PAID',
        packing_style: '',
        shipping_notes: ''
      }
    ])
  }

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index))
  }

  const handleLineChange = (index: number, field: keyof OrderLineInput, value: any) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }
    
    // When product changes: load revisions, auto-select latest, reset old revision
    if (field === 'product_id') {
      newLines[index].design_revision_id = null
      setLines(newLines)
      if (value) {
        loadRevisionsForProduct(value).then(() => {
          // Auto-select latest revision after load
          setLines(prev => {
            const updated = [...prev]
            const revs = productRevisions[value]
            if (revs && revs.length > 0) {
              updated[index] = { ...updated[index], design_revision_id: revs[0].revision_id }
              loadRevisionDetail(revs[0].revision_id)
            }
            return updated
          })
        })
      }
      return
    }
    
    // When revision changes: load its detail
    if (field === 'design_revision_id' && value) {
      loadRevisionDetail(value)
    }
    
    setLines(newLines)
  }

  // Auto-select revision when productRevisions loads for a product
  useEffect(() => {
    setLines(prev => {
      let changed = false
      const updated = prev.map(l => {
        if (l.product_id && !l.design_revision_id) {
          const revs = productRevisions[l.product_id]
          if (revs && revs.length > 0) {
            changed = true
            loadRevisionDetail(revs[0].revision_id)
            return { ...l, design_revision_id: revs[0].revision_id }
          }
        }
        return l
      })
      return changed ? updated : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productRevisions])

  const submitOrder = async (status: string) => {
    setLoading(true)
    setError(null)

    if (!header.company_id) {
      setError(t('errorSelectCustomer'))
      setLoading(false)
      return
    }

    if (lines.length === 0) {
      setError(t('errorLineRequired'))
      setLoading(false)
      return
    }

    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].product_id) {
        setError(t('errorProductRequired', { lineNo: lines[i].line_no }))
        setLoading(false)
        return
      }
      if (lines[i].quantity <= 0) {
        setError(t('errorQtyRequired', { lineNo: lines[i].line_no }))
        setLoading(false)
        return
      }
    }

    const { success, orderId, error: submitError } = await upsertOrderAction(
      { ...header, requested_delivery: null, order_status: status }, 
      lines
    )

    if (success && orderId) {
      if (onSuccess) onSuccess(orderId)
      else router.push(`/orders/${orderId}`)
    } else {
      setError(submitError || t('errorSave'))
    }
    setLoading(false)
  }

  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault()
    submitOrder('NEW')
  }

  const handleConfirmOrder = (e: React.MouseEvent) => {
    e.preventDefault()
    if (confirm(t('confirmOrderConfirm'))) {
      submitOrder('CONFIRMED')
    }
  }

  // Helper: get revision info for a line
  const getRevisionInfo = (line: OrderLineInput) => {
    if (!line.product_id) return null
    const revs = productRevisions[line.product_id]
    if (!revs || revs.length === 0) return null
    
    const selectedRevId = line.design_revision_id
    const selectedRev = selectedRevId ? revs.find(r => r.revision_id === selectedRevId) : revs[0]
    const detail = selectedRevId ? revisionDetails[selectedRevId] : null
    const hasMultiple = revs.length > 1
    
    return { revs, selectedRev, detail, hasMultiple }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {error && (
        <div className="badge badge--error" style={{ padding: '12px 16px', marginBottom: 20, width: '100%' }}>
          {error}
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="card-flat" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: 8, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('commonInfo')}
          </h3>
        </div>
        <div className="grid grid-cols-6 gap-x-4 gap-y-3">
          {/* Hàng 1 */}
          <div className="form-field col-span-2">
            <label className="form-label" style={{ marginBottom: 4 }}>
              {t('customerRequired')}
            </label>
            <AsyncSearchableSelect
              value={header.company_id || null}
              onChange={(v) => setHeader({ ...header, company_id: v || '' })}
              placeholder={t('customerPlaceholder')}
              fetchOptions={async (q) => {
                const { data } = await supabase
                  .from('companies')
                  .select('company_id, company_name, company_code')
                  .ilike('company_name', `%${q}%`)
                  .limit(20)
                return (data || []).map((c: any) => ({
                  value: c.company_id,
                  label: c.company_name,
                  sublabel: c.company_code
                }))
              }}
            />
          </div>

          <div className="form-field col-span-1">
            <label className="form-label" style={{ marginBottom: 4 }}>
              {t('internalOrderNo')}
            </label>
            <input type="text" className="form-input" style={{ fontFamily: 'monospace', fontSize: 13 }} placeholder={t('autoGenerate')} value={header.order_no} onChange={e => setHeader({...header, order_no: e.target.value})} />
          </div>

          <div className="form-field col-span-1">
            <label className="form-label" style={{ marginBottom: 4 }}>
              {t('customerPO')}
            </label>
            <input type="text" className="form-input" style={{ fontSize: 13 }} value={header.customer_order_no || ''} onChange={e => setHeader({...header, customer_order_no: e.target.value})} />
          </div>

          <div className="form-field col-span-1">
            <label className="form-label" style={{ marginBottom: 4 }}>
              {t('orderType')}
            </label>
            <select className="form-input" style={{ fontSize: 13 }} value={header.order_type || 'PRODUCT'} onChange={e => setHeader({...header, order_type: e.target.value})}>
              <option value="PRODUCT">{t('orderTypeProduct')}</option>
              <option value="MOLD">{t('orderTypeMold')}</option>
            </select>
          </div>

          <div className="form-field col-span-1">
            <label className="form-label" style={{ marginBottom: 4 }}>
              {t('orderDate')}
            </label>
            <input type="date" className="form-input" style={{ fontSize: 13 }} value={header.order_date || ''} onChange={e => setHeader({...header, order_date: e.target.value})} />
          </div>

          {/* Hàng 2 */}
          <div className="form-field col-span-1">
            <label className="form-label" style={{ marginBottom: 4 }}>
              {t('lotNo')}
            </label>
            <input type="text" className="form-input" style={{ fontSize: 13 }} value={header.lot_no || ''} onChange={e => setHeader({...header, lot_no: e.target.value})} />
          </div>

          <div className="form-field col-span-3">
            <label className="form-label" style={{ marginBottom: 4 }}>
              {t('notes')}
            </label>
            <textarea 
              className="form-textarea" 
              style={{ height: '36px', minHeight: '36px', resize: 'vertical', fontSize: 13, padding: '8px 12px' }} 
              placeholder={t('notesPlaceholder')}
              value={header.notes || ''} 
              onChange={e => setHeader({...header, notes: e.target.value})} 
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {['1面取', '別抜き', '袋詰め', '箱詰め'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const current = header.notes || ''
                    const newNotes = current ? (current.includes(tag) ? current : current + (current.endsWith(' ') ? '' : ' ') + tag) : tag
                    setHeader({...header, notes: newNotes})
                  }}
                  className="px-2 py-[2px] rounded text-[11px] font-bold transition-colors"
                  style={{
                    background: (header.notes || '').includes(tag) ? 'var(--accent)' : 'var(--bg-surface-2)',
                    color: (header.notes || '').includes(tag) ? 'white' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: (header.notes || '').includes(tag) ? 'var(--accent)' : 'var(--border-default)',
                  }}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="col-span-2"></div>
        </div>
      </div>

      {/* LINES SECTION */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('orderDetails')}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lines.map((line, idx) => {
            const revInfo = getRevisionInfo(line)
            const detail = revInfo?.detail
            const pm = detail?.plastic_master
            const hasMultipleRevs = revInfo?.hasMultiple || false
            const selectedRev = revInfo?.selectedRev
            const isRevPickerOpen = showRevisionPicker[idx] || false
            
            return (
              <div key={idx} className="card-flat" style={{ position: 'relative', padding: '12px 16px' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--bg-page)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  #{line.line_no}
                </div>
                
                <button 
                  type="button" 
                  onClick={() => handleRemoveLine(idx)} 
                  style={{ position: 'absolute', top: 12, right: 12, color: 'var(--status-error)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }}
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-7 gap-4" style={{ paddingLeft: 32, paddingRight: 32 }}>
                  {/* Hàng 1 */}
                  <div className="col-span-3 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>{t('productName')} *</label>
                    <AsyncSearchableSelect
                      value={line.product_id}
                      onChange={(v) => handleLineChange(idx, 'product_id', v)}
                      placeholder={t('searchProductPlaceholder')}
                      fetchOptions={async (q) => {
                        const { data } = await supabase
                          .from('products')
                          .select('product_id, product_code, product_name')
                          .ilike('product_code', `%${q}%`)
                          .limit(20)
                        return (data || []).map((p: any) => ({
                          value: p.product_id,
                          label: p.product_code,
                          sublabel: p.product_name
                        }))
                      }}
                    />
                  </div>
                  <div className="col-span-1 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>{t('quantity')} *</label>
                    <input type="number" className="form-input" style={{ fontSize: 13 }} required value={line.quantity || ''} onChange={e => handleLineChange(idx, 'quantity', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-1 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>{t('itemType')}</label>
                    <select className="form-input" style={{ fontSize: 13 }} value={line.charge_type || 'PAID'} onChange={e => {
                      handleLineChange(idx, 'charge_type', e.target.value)
                      handleLineChange(idx, 'is_free_sample', e.target.value !== 'PAID')
                    }}>
                      <option value="PAID">{t('chargeTypePaid')}</option>
                      <option value="FREE">{t('chargeTypeFree')}</option>
                      <option value="OFFICE_SAMPLE">{t('chargeTypeOffice')}</option>
                    </select>
                  </div>
                  <div className="col-span-1 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>{t('ngayXuat')}</label>
                    <input type="date" className="form-input" style={{ fontSize: 13 }} value={line.ship_date || ''} onChange={e => handleLineChange(idx, 'ship_date', e.target.value)} />
                  </div>
                  <div className="col-span-1 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4, fontWeight: 700, color: 'var(--accent)' }}>{t('deliveryDate')}</label>
                    <input type="date" className="form-input" style={{ fontSize: 13, borderColor: 'var(--accent-light)', fontWeight: 600 }} value={line.due_date || ''} onChange={e => handleLineChange(idx, 'due_date', e.target.value)} />
                  </div>

                  {/* Hàng 2 */}
                  <div className="col-span-3 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>{t('iaIemGiaoHang')}</label>
                    <select className="form-input" style={{ fontSize: 13 }} value={line.delivery_site_id || ''} onChange={e => handleLineChange(idx, 'delivery_site_id', e.target.value)}>
                      <option value="">{t('selectDeliverySitePlaceholder')}</option>
                      {availableSites.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>{t('soThung')}</label>
                    <input type="text" className="form-input" style={{ fontSize: 13 }} placeholder={t('packingStylePlaceholder')} value={line.packing_style || ''} onChange={e => handleLineChange(idx, 'packing_style', e.target.value)} />
                  </div>
                  <div className="col-span-3 form-field">
                    <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>{t('packingNotes')}</label>
                    <input type="text" className="form-input" style={{ fontSize: 13 }} value={line.shipping_notes || ''} onChange={e => handleLineChange(idx, 'shipping_notes', e.target.value)} />
                  </div>
                </div>

                {/* Hàng 3: Revision info + Material tag */}
                {line.product_id && (
                  <div style={{ paddingLeft: 32, paddingRight: 32, marginTop: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                    {/* Revision badge — auto-selected */}
                    {selectedRev && (
                      <span 
                        style={{ 
                          fontSize: 10, fontFamily: 'monospace', fontWeight: 600,
                          background: hasMultipleRevs ? 'var(--status-warning-bg)' : 'var(--bg-surface-2)', 
                          color: hasMultipleRevs ? 'var(--status-warning)' : 'var(--text-secondary)',
                          padding: '2px 8px', borderRadius: 'var(--radius-sm)', 
                          cursor: hasMultipleRevs ? 'pointer' : 'default',
                          border: hasMultipleRevs ? '1px solid var(--status-warning)' : '1px solid transparent',
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}
                        onClick={() => hasMultipleRevs && setShowRevisionPicker(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      >
                        {t('designRevPrefix')} {selectedRev.design_code}
                        {selectedRev.plastic_type_designed && ` (${selectedRev.plastic_type_designed})`}
                        {hasMultipleRevs && (
                          isRevPickerOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                        )}
                        {hasMultipleRevs && (
                          <span style={{ fontSize: 9, opacity: 0.7 }}>
                            ({revInfo!.revs.length})
                          </span>
                        )}
                      </span>
                    )}
                    
                    {/* Material info from selected revision */}
                    {detail && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--bg-surface-2)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                        {pm?.plastic_code || detail.plastic_type_designed || 'N/A'} | {pm?.thickness_mm ? `${pm.thickness_mm}mm` : 'N/A'} | CUT: {detail.cutline_length || '?'}&times;{detail.cutline_width || '?'} | CAV: {detail.cavity_count || '?'}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Revision picker dropdown (only when multiple revisions) */}
                {isRevPickerOpen && hasMultipleRevs && revInfo && (
                  <div style={{ paddingLeft: 32, paddingRight: 32, marginTop: 6 }}>
                    <div style={{ 
                      background: 'var(--bg-surface)', border: '1px solid var(--border-default)', 
                      borderRadius: 'var(--radius-sm)', padding: 6, maxHeight: 150, overflowY: 'auto' 
                    }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, paddingLeft: 4 }}>
                        {t('selectDesignRev')}
                      </div>
                      {revInfo.revs.map(rev => {
                        const isSelected = line.design_revision_id === rev.revision_id
                        return (
                          <button
                            key={rev.revision_id}
                            type="button"
                            onClick={() => {
                              handleLineChange(idx, 'design_revision_id', rev.revision_id)
                              setShowRevisionPicker(prev => ({ ...prev, [idx]: false }))
                            }}
                            style={{
                              display: 'block', width: '100%', textAlign: 'left',
                              padding: '4px 8px', fontSize: 11, fontFamily: 'monospace',
                              background: isSelected ? 'var(--accent-subtle)' : 'transparent',
                              color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                              fontWeight: isSelected ? 700 : 400,
                              border: 'none', borderRadius: 4, cursor: 'pointer',
                              marginBottom: 2,
                            }}
                          >
                            {rev.design_code}
                            {rev.plastic_type_designed && (
                              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> — {rev.plastic_type_designed}</span>
                            )}
                            {rev.cutline_length && rev.cutline_width && (
                              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> | CUT: {rev.cutline_length}×{rev.cutline_width}</span>
                            )}
                            {rev.status && (
                              <span style={{ marginLeft: 6, fontSize: 9, padding: '1px 4px', borderRadius: 3,
                                background: rev.status === 'APPROVED' ? 'var(--status-success-bg)' : 'var(--bg-page)',
                                color: rev.status === 'APPROVED' ? 'var(--status-success)' : 'var(--text-muted)',
                              }}>
                                {rev.status}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {lines.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: 8, marginTop: 8 }}>
            {t('noOrderLinesInstruction')}
          </div>
        )}

        <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12, marginTop: 12 }} onClick={handleAddLine}>
          <Plus size={15} style={{ marginRight: 6 }} /> {t('addLine')}
        </button>
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel || (() => router.back())} disabled={loading}>
          {onCancel ? <X size={16} style={{ marginRight: 6 }} /> : <ArrowLeft size={16} style={{ marginRight: 6 }} />}
          {tCommon('cancel')}
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={handleSaveDraft} disabled={loading}>
            <Save size={16} style={{ marginRight: 6 }} />
            {loading ? t('saving') : t('saveDraft')}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleConfirmOrder} disabled={loading}>
            <Send size={16} style={{ marginRight: 6 }} />
            {loading ? t('saving') : t('confirmOrder')}
          </button>
        </div>
      </div>
    </form>
  )
}
