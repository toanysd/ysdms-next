'use client'

import React from 'react'
import { CheckCircle2, XCircle, Clock, AlertTriangle, Send, FileCheck, Layers, ArrowRight, UserCheck } from 'lucide-react'
import type { DesignApprovalLog } from '@/app/actions/design-approval'
import type { SampleRequest } from '@/app/actions/sample-requests'
import type { ProductLifecycleLog } from '@/app/actions/product-lifecycle'

interface ApprovalTimelineProps {
  approvalLogs: DesignApprovalLog[]
  sampleRequests: SampleRequest[]
  lifecycleLogs: ProductLifecycleLog[]
  onAddApprovalLog?: () => void
  onAddSampleRequest?: () => void
  onUpdateSampleResult?: (request: SampleRequest) => void
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({
  approvalLogs,
  sampleRequests,
  lifecycleLogs,
  onAddApprovalLog,
  onAddSampleRequest,
  onUpdateSampleResult,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* ── Section 1: Design Approval Logs (Vòng duyệt thiết kế) ── */}
      <div className="card-flat" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 4,
              background: 'var(--tint-teal-bg)', border: '1px solid var(--tint-teal-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
            }}>
              <FileCheck size={14} />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                図面・設計承認履歴 (Lịch sử Phê duyệt Bản vẽ CAD / Layout)
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                {approvalLogs.length} 件の記録
              </span>
            </div>
          </div>
          {onAddApprovalLog && (
            <button
              onClick={onAddApprovalLog}
              className="btn btn-secondary cursor-pointer"
              style={{ height: 24, padding: '0 8px', fontSize: 11, gap: 4 }}
            >
              ＋ 承認ログ記録
            </button>
          )}
        </div>

        {approvalLogs.length === 0 ? (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            承認履歴はまだ記録されていません (Chưa có lịch sử duyệt bản vẽ)
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {approvalLogs.map((log) => {
              const isApproved = log.status === 'APPROVED'
              const isRejected = log.status === 'REJECTED_REVISE'
              const isPending = log.status === 'PENDING'

              return (
                <div
                  key={log.log_id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-surface-2, #f8fafc)',
                    borderLeft: `4px solid ${isApproved ? '#10B981' : isRejected ? '#EF4444' : '#F59E0B'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        padding: '2px 6px', borderRadius: 4,
                        background: '#EEF2F6', color: '#475569'
                      }}>
                        Round #{log.approval_round}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {log.approval_stage === 'LAYOUT' ? 'レイアウト承認 (Duyệt Layout)' :
                         log.approval_stage === 'SAMPLE_POCKET' ? '試作ポケット承認 (Duyệt Mẫu Pocket)' :
                         log.approval_stage === 'MASS_DRAWING' ? '本型図面承認 (Duyệt Bản vẽ Hàng loạt)' :
                         '本型金型承認 (Duyệt Khuôn Hàng loạt)'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`badge ${
                        isApproved ? 'badge--success' : isRejected ? 'badge--error' : 'badge--warning'
                      }`} style={{ fontSize: 10, fontWeight: 700 }}>
                        {isApproved ? '✓ 承認 (APPROVED)' : isRejected ? '✕ 修正要求 (REVISE)' : '⏳ 確認待ち (PENDING)'}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {log.approved_date ? log.approved_date.split('T')[0] : log.created_at.split('T')[0]}
                      </span>
                    </div>
                  </div>

                  {log.customer_feedback && (
                    <div style={{
                      fontSize: 12,
                      color: isRejected ? '#991B1B' : '#1E293B',
                      background: isRejected ? '#FEF2F2' : '#F1F5F9',
                      padding: '6px 8px',
                      borderRadius: 4,
                      lineHeight: 1.4,
                    }}>
                      💬 <strong>顧客フィードバック (Phản hồi KH):</strong> {log.customer_feedback}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>承認担当: {log.approver?.employee_name || '—'}</span>
                    {log.notes && <span>メモ: {log.notes}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Section 2: Sample Requests (Yêu cầu làm mẫu thử Pocket/Full Tray) ── */}
      <div className="card-flat" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 4,
              background: 'var(--tint-orange-bg)', border: '1px solid var(--tint-orange-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tint-orange-text)'
            }}>
              <Layers size={14} />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                試作・サンプル手配 (Yêu cầu Mẫu thử Pocket / Khay mẫu)
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                {sampleRequests.length} 件の要求
              </span>
            </div>
          </div>
          {onAddSampleRequest && (
            <button
              onClick={onAddSampleRequest}
              className="btn btn-secondary cursor-pointer"
              style={{ height: 24, padding: '0 8px', fontSize: 11, gap: 4 }}
            >
              ＋ 試作手配追加
            </button>
          )}
        </div>

        {sampleRequests.length === 0 ? (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            試作手配の記録はありません (Chưa có yêu cầu làm mẫu thử)
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sampleRequests.map((req) => {
              const isOk = req.result_status === 'CUSTOMER_OK'
              const isNg = req.result_status === 'CUSTOMER_NG'
              const isSent = req.result_status === 'SENT_TO_CUSTOMER'

              return (
                <div
                  key={req.request_id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-surface-2, #f8fafc)',
                    borderLeft: `4px solid ${isOk ? '#10B981' : isNg ? '#EF4444' : isSent ? '#F97316' : '#3B82F6'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {req.sample_type === 'POCKET_TEST' ? '🧪 試作ポケット成形 (Pocket Test)' :
                         req.sample_type === 'FULL_TRAY_SAMPLE' ? '📦 フルサイズサンプル (Full Tray Sample)' :
                         '💨 真空成形サンプル (Vacuum Sample)'}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', background: '#E2E8F0', padding: '1px 6px', borderRadius: 4 }}>
                        数量: {req.requested_qty} pcs
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`badge ${
                        isOk ? 'badge--success' : isNg ? 'badge--error' : isSent ? 'badge--warning' : 'badge--info'
                      }`} style={{ fontSize: 10, fontWeight: 700 }}>
                        {isOk ? '✓ 客先合格 (CUSTOMER_OK)' :
                         isNg ? '✕ 客先不合格 (CUSTOMER_NG)' :
                         isSent ? '🚚 客先送付済 (SENT)' :
                         req.result_status === 'IN_MAKING' ? '⚙️ 試作中 (IN_MAKING)' : '📝 依頼済 (REQUESTED)'}
                      </span>

                      {onUpdateSampleResult && (
                        <button
                          onClick={() => onUpdateSampleResult(req)}
                          className="btn btn-secondary cursor-pointer"
                          style={{ height: 22, padding: '0 6px', fontSize: 10 }}
                        >
                          結果更新
                        </button>
                      )}
                    </div>
                  </div>

                  {req.ng_reason && (
                    <div style={{
                      fontSize: 12,
                      color: '#991B1B',
                      background: '#FEF2F2',
                      padding: '6px 8px',
                      borderRadius: 4,
                      lineHeight: 1.4,
                    }}>
                      ⚠️ <strong>NG理由 (Lý do không đạt):</strong> {req.ng_reason}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>希望期日: {req.target_date || '—'}</span>
                    {req.notes && <span>備考: {req.notes}</span>}
                    <span>作成日: {req.created_at.split('T')[0]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Section 3: Product Lifecycle Audit Trail (Lịch sử chuyển đổi vòng đời) ── */}
      <div className="card-flat" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 4,
            background: 'var(--tint-purple-bg)', border: '1px solid var(--tint-purple-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tint-purple-text)'
          }}>
            <Clock size={14} />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              製品ライフサイクル監査ログ (Product Lifecycle Audit Trail)
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
              {lifecycleLogs.length} 件の変更履歴
            </span>
          </div>
        </div>

        {lifecycleLogs.length === 0 ? (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            監査ログはまだありません (Chưa có lịch sử chuyển đổi vòng đời)
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lifecycleLogs.map((log) => {
              const isOverride = log.trigger_event === 'MANUAL_OVERRIDE'

              return (
                <div
                  key={log.log_id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 4,
                    background: 'var(--bg-surface-2, #f8fafc)',
                    border: '1px solid var(--border-subtle, #e2e8f0)',
                    fontSize: 12,
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                        background: isOverride ? '#FEF3C7' : '#EFF6FF',
                        color: isOverride ? '#92400E' : '#1E40AF',
                        border: `1px solid ${isOverride ? '#FDE68A' : '#BFDBFE'}`
                      }}>
                        {log.trigger_event}
                      </span>
                      
                      <span style={{ fontWeight: 700, color: '#475569' }}>
                        {log.from_status || 'INIT'}
                      </span>
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontWeight: 800, color: 'var(--accent)' }}>
                        {log.to_status}
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-primary)', marginTop: 2 }}>
                      {log.reason || '—'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {new Date(log.created_at).toLocaleString('ja-JP')}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748B' }}>
                      {log.employee?.employee_name ? `担当: ${log.employee.employee_name}` : 'SYSTEM'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
