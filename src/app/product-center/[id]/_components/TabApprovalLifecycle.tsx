'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, Layers, Clock, AlertTriangle, ShieldAlert, Sparkles, RefreshCw, FileCheck } from 'lucide-react'
import { ApprovalTimeline } from './ApprovalTimeline'
import { CreateApprovalLogModal } from './CreateApprovalLogModal'
import { CreateSampleRequestModal } from './CreateSampleRequestModal'
import { UpdateSampleResultModal } from './UpdateSampleResultModal'
import { OverrideLifecycleModal } from './OverrideLifecycleModal'
import { getDesignApprovalLogsByProductId, type DesignApprovalLog } from '@/app/actions/design-approval'
import { getSampleRequests, type SampleRequest } from '@/app/actions/sample-requests'
import { getProductLifecycleLogs, type ProductLifecycleLog } from '@/app/actions/product-lifecycle'

interface TabApprovalLifecycleProps {
  productId: string
  productLifecycleStatus?: string | null
  requiresPrototypeMold?: boolean | null
  designRevisions?: Array<{ revision_id: string; design_code: string | null; status?: string | null }>
  onProductUpdated?: () => void
}

const LIFECYCLE_STAGES = [
  { key: 'DRAFT', labelJA: '構想 (Draft)', labelVI: 'Phác thảo', color: '#64748B' },
  { key: 'DESIGN', labelJA: '設計 (Design)', labelVI: 'Thiết kế CAD', color: '#8B5CF6' },
  { key: 'PROTOTYPE', labelJA: '試作 (Prototype)', labelVI: 'Mẫu thử', color: '#F59E0B' },
  { key: 'APPROVED', labelJA: '承認 (Approved)', labelVI: 'Đã duyệt', color: '#10B981' },
  { key: 'MASS_PRODUCTION', labelJA: '量産 (Mass Prod)', labelVI: 'Sản xuất hàng loạt', color: '#0D9488' },
  { key: 'DISCONTINUED', labelJA: '廃番 (Discontinued)', labelVI: 'Ngừng sản xuất', color: '#EF4444' },
]

export const TabApprovalLifecycle: React.FC<TabApprovalLifecycleProps> = ({
  productId,
  productLifecycleStatus,
  requiresPrototypeMold,
  designRevisions = [],
  onProductUpdated,
}) => {
  const [approvalLogs, setApprovalLogs] = useState<DesignApprovalLog[]>([])
  const [sampleRequests, setSampleRequests] = useState<SampleRequest[]>([])
  const [lifecycleLogs, setLifecycleLogs] = useState<ProductLifecycleLog[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false)
  const [selectedSampleForUpdate, setSelectedSampleForUpdate] = useState<SampleRequest | null>(null)
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false)

  const currentStatus = productLifecycleStatus || 'DRAFT'

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch sample requests, lifecycle logs, and approval logs in parallel via Server Actions
      const [samples, lifecycles, approvals] = await Promise.all([
        getSampleRequests(productId),
        getProductLifecycleLogs(productId),
        getDesignApprovalLogsByProductId(productId),
      ])
      setSampleRequests(samples)
      setLifecycleLogs(lifecycles)
      setApprovalLogs(approvals)
    } catch (err) {
      console.error('Error fetching lifecycle approval data:', err)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDataChanged = () => {
    fetchData()
    if (onProductUpdated) onProductUpdated()
  }

  const currentStageIndex = LIFECYCLE_STAGES.findIndex((s) => s.key === currentStatus)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── 1. Lifecycle Progress Stepper Bar ── */}
      <div className="card-flat" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
              製品ライフサイクル進捗 (Product Lifecycle Status)
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
              {requiresPrototypeMold ? '🧪 試作ポケット必要製品 (Có yêu cầu mẫu thử)' : '⚡ 直送本型承認製品 (Duyệt bản vẽ trực tiếp)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleDataChanged}
              className="btn btn-secondary cursor-pointer"
              style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 4 }}
              title="再読み込み"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>更新</span>
            </button>

            <button
              onClick={() => setIsOverrideModalOpen(true)}
              className="btn cursor-pointer"
              style={{
                height: 26, padding: '0 10px', fontSize: 11, gap: 4,
                background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', borderRadius: 4,
                fontWeight: 700, display: 'flex', alignItems: 'center'
              }}
            >
              <AlertTriangle size={12} />
              <span>手動ステータス変更</span>
            </button>
          </div>
        </div>

        {/* Stepper Graphic */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 8,
          position: 'relative',
        }}>
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCurrent = stage.key === currentStatus
            const isPassed = currentStageIndex >= 0 && idx < currentStageIndex && currentStatus !== 'DISCONTINUED'
            const isDiscontinued = stage.key === 'DISCONTINUED'

            let bg = '#F1F5F9'
            let border = '#E2E8F0'
            let text = '#64748B'

            if (isCurrent) {
              bg = isDiscontinued ? '#FEF2F2' : 'var(--tint-teal-bg, #f0fdfa)'
              border = isDiscontinued ? '#EF4444' : 'var(--accent, #0D9488)'
              text = isDiscontinued ? '#DC2626' : 'var(--accent, #0D9488)'
            } else if (isPassed) {
              bg = '#ECFDF5'
              border = '#A7F3D0'
              text = '#059669'
            }

            return (
              <div
                key={stage.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 4px',
                  borderRadius: 6,
                  background: bg,
                  border: `2px solid ${border}`,
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  {isPassed && <CheckCircle2 size={12} />}
                  <span>{stage.key}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: isCurrent ? 800 : 500, color: text, marginTop: 2 }}>
                  {stage.labelJA}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 2. Quick Action Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className="btn btn-primary cursor-pointer"
            style={{ height: 30, padding: '0 12px', fontSize: 12, gap: 6 }}
          >
            <FileCheck size={14} />
            <span>＋ 承認ログ記録 (Record Approval)</span>
          </button>

          <button
            onClick={() => setIsSampleModalOpen(true)}
            className="btn btn-secondary cursor-pointer"
            style={{ height: 30, padding: '0 12px', fontSize: 12, gap: 6 }}
          >
            <Layers size={14} />
            <span>＋ 試作手配作成 (Request Sample)</span>
          </button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          ※ 承認または試作合格によりライフサイクルが自動遷移します (Auto-transition supported)
        </div>
      </div>

      {/* ── 3. Visual Timeline ── */}
      <ApprovalTimeline
        approvalLogs={approvalLogs}
        sampleRequests={sampleRequests}
        lifecycleLogs={lifecycleLogs}
        onAddApprovalLog={() => setIsApprovalModalOpen(true)}
        onAddSampleRequest={() => setIsSampleModalOpen(true)}
        onUpdateSampleResult={(req) => setSelectedSampleForUpdate(req)}
      />

      {/* ── Modals ── */}
      <CreateApprovalLogModal
        isOpen={isApprovalModalOpen}
        productId={productId}
        designRevisions={designRevisions}
        onClose={() => setIsApprovalModalOpen(false)}
        onSuccess={handleDataChanged}
      />

      <CreateSampleRequestModal
        isOpen={isSampleModalOpen}
        productId={productId}
        designRevisions={designRevisions}
        onClose={() => setIsSampleModalOpen(false)}
        onSuccess={handleDataChanged}
      />

      <UpdateSampleResultModal
        isOpen={!!selectedSampleForUpdate}
        sampleRequest={selectedSampleForUpdate}
        productId={productId}
        onClose={() => setSelectedSampleForUpdate(null)}
        onSuccess={handleDataChanged}
      />

      <OverrideLifecycleModal
        isOpen={isOverrideModalOpen}
        productId={productId}
        currentStatus={currentStatus}
        onClose={() => setIsOverrideModalOpen(false)}
        onSuccess={handleDataChanged}
      />

    </div>
  )
}
