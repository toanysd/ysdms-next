'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { X, Plus, PenTool, AlertCircle, Sparkles, Layers } from 'lucide-react'
import { createDesignJobAction } from '@/app/actions/design-job'

type CreateDesignRevisionModalProps = {
  isOpen: boolean
  productId: string
  parentRevision?: any | null
  subMode?: 'NEXT_MASS' | 'PROTO_FROM_MASS' | 'PROTO_SUCCESSION' | 'PROMOTE_TO_MASS' | string
  onClose: () => void
  onSuccess: (revisionId: string) => void
}

export function CreateDesignRevisionModal({
  isOpen,
  productId,
  parentRevision,
  subMode = 'NEXT_MASS',
  onClose,
  onSuccess
}: CreateDesignRevisionModalProps) {
  const t = useTranslations('ProductCenter')
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Array<{ employee_id: string; employee_name: string }>>([])

  // Form Fields
  const [productCode, setProductCode] = useState('')
  const [isPostProduction, setIsPostProduction] = useState(false)
  const [modificationNumber, setModificationNumber] = useState(1)
  const [designCode, setDesignCode] = useState('')
  const [revisionNumber, setRevisionNumber] = useState<number>(1)
  const [designCategory, setDesignCategory] = useState<string>('MASS')
  const [status, setStatus] = useState<string>('DRAFT')
  const [designerId, setDesignerId] = useState<string>('')
  const [plasticTypeDesigned, setPlasticTypeDesigned] = useState('')
  const [designLength, setDesignLength] = useState('')
  const [designWidth, setDesignWidth] = useState('')
  const [designHeight, setDesignHeight] = useState('')
  const [designDepth, setDesignDepth] = useState('')
  const [cutlineLength, setCutlineLength] = useState('')
  const [cutlineWidth, setCutlineWidth] = useState('')
  const [cavityCount, setCavityCount] = useState('')
  const [plugType, setPlugType] = useState('')
  const [hasSeparateCutter, setHasSeparateCutter] = useState(false)
  const [cornerR, setCornerR] = useState('')
  const [chamferC, setChamferC] = useState('')
  const [draftAngle, setDraftAngle] = useState('')
  const [changeSummary, setChangeSummary] = useState('')

  // Load employees
  useEffect(() => {
    async function loadEmps() {
      const { data } = await supabase
        .from('employees')
        .select('employee_id, employee_name')
        .order('employee_name', { ascending: true })
      if (data) setEmployees(data)
    }
    if (isOpen) loadEmps()
  }, [isOpen, supabase])

  // Initialize form when opened
  useEffect(() => {
    if (!isOpen) return

    setError(null)

    async function initForm() {
      // 1. Fetch product
      const { data: prod } = await supabase
        .from('products')
        .select('product_code, product_name_internal, company_id')
        .eq('product_id', productId)
        .single()

      if (prod) {
        setProductCode(prod.product_code || '')
      }

      // 2. Fetch existing revisions count to calculate next revision number
      const { data: revs } = await supabase
        .from('design_revisions')
        .select('revision_id, revision_number, design_code, design_category')
        .eq('product_id', productId)
        .order('revision_number', { ascending: false, nullsFirst: false })

      const maxRevNum = revs && revs.length > 0 ? (revs[0].revision_number || 0) : 0
      const nextNum = maxRevNum + 1
      setRevisionNumber(nextNum)

      const baseCode = prod?.product_name_internal || prod?.product_code || 'PRD'

      // Set category & code based on subMode
      if (subMode === 'PROTO_FROM_MASS' || subMode === 'PROTO_SUCCESSION') {
        setDesignCategory('PROTOTYPE_POCKET')
        setDesignCode(`${baseCode}-P${nextNum}`)
      } else {
        setDesignCategory('MASS')
        setDesignCode(`${baseCode}-R${nextNum}`)
      }

      // 3. Post-Production Auto-Detection (Option C)
      if (parentRevision) {
        const isParentApproved = parentRevision.status === 'APPROVED'

        // Check if parent revision has physical equipment
        const { count: equipCount } = await supabase
          .from('equipment')
          .select('equipment_id', { count: 'exact', head: true })
          .eq('design_revision_id', parentRevision.revision_id)

        // Check if product has manufacturing / shop jobs
        const { count: moldJobCount } = await supabase
          .from('jobs')
          .select('job_id', { count: 'exact', head: true })
          .eq('product_id', productId)
          .neq('job_category', 'DESIGN')

        const detectedPostProd = isParentApproved && ((equipCount || 0) > 0 || (moldJobCount || 0) > 0)
        setIsPostProduction(detectedPostProd)

        // Count how many DESIGN jobs exist to compute modification number
        const { count: designJobsCount } = await supabase
          .from('jobs')
          .select('job_id', { count: 'exact', head: true })
          .eq('product_id', productId)
          .eq('job_category', 'DESIGN')

        setModificationNumber(Math.max(1, designJobsCount || 1))

        // Copy values from parentRevision
        setPlasticTypeDesigned(parentRevision.plastic_type_designed || '')
        setDesignLength(parentRevision.design_length != null ? parentRevision.design_length.toString() : '')
        setDesignWidth(parentRevision.design_width != null ? parentRevision.design_width.toString() : '')
        setDesignHeight(parentRevision.design_height != null ? parentRevision.design_height.toString() : '')
        setDesignDepth(parentRevision.design_depth != null ? parentRevision.design_depth.toString() : '')
        setCutlineLength(parentRevision.cutline_length != null ? parentRevision.cutline_length.toString() : '')
        setCutlineWidth(parentRevision.cutline_width != null ? parentRevision.cutline_width.toString() : '')
        setCavityCount(parentRevision.cavity_count != null ? parentRevision.cavity_count.toString() : '')
        setPlugType(parentRevision.plug_type || '')
        setHasSeparateCutter(parentRevision.has_separate_cutter || false)
        setCornerR(parentRevision.corner_r || '')
        setChamferC(parentRevision.chamfer_c || '')
        setDraftAngle(parentRevision.draft_angle || '')
      } else {
        setIsPostProduction(false)
        setPlasticTypeDesigned('')
        setDesignLength('')
        setDesignWidth('')
        setDesignHeight('')
        setDesignDepth('')
        setCutlineLength('')
        setCutlineWidth('')
        setCavityCount('')
        setPlugType('')
        setHasSeparateCutter(false)
        setCornerR('')
        setChamferC('')
        setDraftAngle('')
      }
    }

    initForm()
  }, [isOpen, productId, parentRevision, subMode, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!designCode.trim()) {
      setError('Mã thiết kế (Design Code) là bắt buộc')
      return
    }

    setLoading(true)

    try {
      // Get product's company_id and product_code
      const { data: prod } = await supabase
        .from('products')
        .select('company_id, product_code')
        .eq('product_id', productId)
        .single()

      const payload = {
        product_id: productId,
        company_id: prod?.company_id || null,
        design_code: designCode.trim(),
        revision_number: revisionNumber,
        design_category: designCategory,
        parent_design_id: parentRevision?.revision_id || null,
        status: status || 'DRAFT',
        designer_id: designerId || null,
        plastic_type_designed: plasticTypeDesigned.trim() || null,
        design_length: designLength ? parseFloat(designLength) : null,
        design_width: designWidth ? parseFloat(designWidth) : null,
        design_height: designHeight ? parseFloat(designHeight) : null,
        design_depth: designDepth ? parseFloat(designDepth) : null,
        cutline_length: cutlineLength ? parseFloat(cutlineLength) : null,
        cutline_width: cutlineWidth ? parseFloat(cutlineWidth) : null,
        cavity_count: cavityCount ? parseInt(cavityCount, 10) : null,
        plug_type: plugType || null,
        has_separate_cutter: hasSeparateCutter,
        corner_r: cornerR.trim() || null,
        chamfer_c: chamferC.trim() || null,
        draft_angle: draftAngle.trim() || null,
        change_summary: changeSummary.trim() || null,
      }

      const { data, error: insertErr } = await supabase
        .from('design_revisions')
        .insert([payload])
        .select('revision_id')
        .single()

      if (insertErr) {
        throw new Error(insertErr.message)
      }

      if (data?.revision_id) {
        // If post-production modification: create a dedicated new Design Job
        if (isPostProduction) {
          try {
            await createDesignJobAction({
              product_id: productId,
              product_code: prod?.product_code || productCode,
              company_id: prod?.company_id || null,
              design_revision_id: data.revision_id,
              is_post_production: true,
              modification_number: modificationNumber,
            })
          } catch (djErr) {
            console.error('[Warning] Failed to auto-create post-production Design Job:', djErr)
          }
        } else {
          // If pre-approval revision: link active initial Design Job to this new revision
          try {
            await supabase
              .from('jobs')
              .update({ design_revision_id: data.revision_id })
              .eq('product_id', productId)
              .eq('job_category', 'DESIGN')
              .not('notes', 'ilike', '%POST_PRODUCTION%')
          } catch (linkErr) {
            console.error('[Warning] Failed to update initial design job revision FK:', linkErr)
          }
        }

        onSuccess(data.revision_id)
        onClose()
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo bản thiết kế')
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
          maxWidth: 680,
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
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--tint-teal-bg, var(--bg-surface-2))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PenTool size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {subMode === 'PROTO_FROM_MASS' ? '新規試作リビジョン (Prototype)' : '新規設計リビジョン (New Design Revision)'}
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

        {/* Body Form */}
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

            {/* Post-Production Revision Indicator & Toggle (Option C) */}
            {parentRevision && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 6,
                background: isPostProduction ? 'var(--tint-orange-bg, #fff7ed)' : 'var(--tint-teal-bg, #f0fdf4)',
                border: `1px solid ${isPostProduction ? 'var(--tint-orange-border, #fed7aa)' : 'var(--tint-teal-border, #bbf7d0)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={isPostProduction}
                      onChange={e => setIsPostProduction(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                    />
                    <span>{isPostProduction ? '🔴 設計変更 (POST-PRODUCTION — Sửa đổi sau sản xuất)' : '🟢 初回設計 (PRE-APPROVAL — Chỉnh sửa trước duyệt)'}</span>
                  </label>
                  {isPostProduction && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--accent)',
                      fontFamily: 'monospace',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'var(--bg-surface)'
                    }}>
                      Tạo Job: DES-{productCode.replace(/-/g, '')}-MOD{modificationNumber}
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                  {isPostProduction
                    ? `Kế thừa từ [${parentRevision.design_code || 'Rev.' + parentRevision.revision_number}]. Tự động tạo Design Job mới với 10 công đoạn để tính chi phí nhân công riêng.`
                    : `Kế thừa từ [${parentRevision.design_code || 'Rev.' + parentRevision.revision_number}]. Tiếp tục sử dụng Design Job ban đầu để ghi nhật ký.`}
                </p>
              </div>
            )}

            {/* Row 1: Design Code & Revision Number & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  {t('designCode') || '図面コード (Design Code)'} <span style={{ color: 'var(--status-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={designCode}
                  onChange={e => setDesignCode(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace', fontWeight: 700 }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  Rev. No.
                </label>
                <input
                  type="number"
                  min="0"
                  value={revisionNumber}
                  onChange={e => setRevisionNumber(parseInt(e.target.value, 10) || 0)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  区分 (Category)
                </label>
                <select
                  value={designCategory}
                  onChange={e => setDesignCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="MASS">量産本型 (Mass)</option>
                  <option value="PROTOTYPE_POCKET">試作型 (Prototype)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Status & Designer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  ステータス (Status)
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="DRAFT">DRAFT (下書き)</option>
                  <option value="SUBMITTED">SUBMITTED (提出済)</option>
                  <option value="RELEASED">RELEASED (リリース)</option>
                  <option value="APPROVED">APPROVED (承認済)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  設計担当 (Designer)
                </label>
                <select
                  value={designerId}
                  onChange={e => setDesignerId(e.target.value)}
                  className="form-input"
                >
                  <option value="">-- 担当者を選択 --</option>
                  {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Plastic Material (SSOT) */}
            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                {t('plasticMaterialLabel') || '材質 (Plastic Material)'} (SSOT)
              </label>
              <input
                type="text"
                placeholder="例: PET 透明 0.5mm [640] 帯電防止付"
                value={plasticTypeDesigned}
                onChange={e => setPlasticTypeDesigned(e.target.value)}
                className="form-input"
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            {/* Row 4: Cutline Dimensions (製品寸法) & Cavity Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  製品長 L (Cutline mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="例: 321"
                  value={cutlineLength}
                  onChange={e => setCutlineLength(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  製品幅 W (Cutline mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="例: 254"
                  value={cutlineWidth}
                  onChange={e => setCutlineWidth(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  取数 (Cavity Count)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="例: 2"
                  value={cavityCount}
                  onChange={e => setCavityCount(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* Row 5: Mold Dimensions (型寸法) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  型寸法 長 (L mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="例: 590"
                  value={designLength}
                  onChange={e => setDesignLength(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  型寸法 幅 (W mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="例: 350"
                  value={designWidth}
                  onChange={e => setDesignWidth(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  型寸法 高 (H mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="例: 80"
                  value={designHeight}
                  onChange={e => setDesignHeight(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  絞り深さ (Depth mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="例: 25"
                  value={designDepth}
                  onChange={e => setDesignDepth(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* Row 6: Plug & Separate Cutter (別抜き) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  プラグ仕様 (Plug Type)
                </label>
                <input
                  type="text"
                  placeholder="例: ベニヤ木板, シリコン, なし"
                  value={plugType}
                  onChange={e => setPlugType(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                  別抜き加工 (Separate Cutter)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={hasSeparateCutter}
                    onChange={e => setHasSeparateCutter(e.target.checked)}
                  />
                  <span>別抜き機使用 (Press Machine) — 抜型 CUTTER_SEPARATE</span>
                </label>
              </div>
            </div>

            {/* Row 7: Change Summary */}
            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'block' }}>
                変更概要 / 備考 (Change Summary)
              </label>
              <textarea
                rows={2}
                placeholder="変更内容や特記事項を入力..."
                value={changeSummary}
                onChange={e => setChangeSummary(e.target.value)}
                className="form-textarea"
                style={{ fontSize: 12 }}
              />
            </div>
          </div>

          {/* Footer */}
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
              disabled={loading || !designCode}
              className="btn btn-primary"
            >
              {loading ? (
                <span>{tCommon('saving') || '保存中...'}</span>
              ) : (
                <React.Fragment>
                  <Plus size={14} />
                  <span>リビジョンを作成</span>
                </React.Fragment>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
