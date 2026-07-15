'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TechnicalReviewTab from './_components/TechnicalReviewTab'
import SalesTab from './_components/SalesTab'
import type { TechnicalReview, UserRole, Quotation } from './types'
import {
  Briefcase, ArrowLeft, List,
  ClipboardList, FileSpreadsheet, Factory, FolderOpen,
  Wrench, Edit2, CheckCircle2, Clock, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────
type CaseDetail = {
  id: string
  case_code: string
  title: string
  case_type: string
  status: string
  requested_due_date: string | null
  instruction_notes: string | null
  raw_text_snapshot: string | null
  created_at: string
  updated_at: string | null
  companies: { company_id: string; company_name: string; company_code: string } | null
  sales_owner: { employee_id: string; employee_name: string } | null
  technical_reviews: TechnicalReview[]
  quotations: Quotation[]
}

// ── Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { labelJA: string; labelVI: string; badgeClass: string }> = {
  open:      { labelJA: '新規',     labelVI: 'Mới',         badgeClass: 'badge badge--info' },
  in_review: { labelJA: '検討中',   labelVI: 'Đang xem xét', badgeClass: 'badge badge--warning' },
  quoted:    { labelJA: '見積済',   labelVI: 'Đã báo giá',  badgeClass: 'badge badge--neutral' },
  ordered:   { labelJA: '受注済',   labelVI: 'Có đơn hàng', badgeClass: 'badge badge--success' },
  completed: { labelJA: '完了',     labelVI: 'Hoàn thành',  badgeClass: 'badge badge--success' },
  closed:    { labelJA: 'クローズ', labelVI: 'Đã đóng',     badgeClass: 'badge badge--neutral' },
}

const CASE_TYPE_LABEL: Record<string, string> = {
  new_tray:          '新規トレイ',
  repeat_order:      '追加注文',
  mold_modification: '金型改造',
  material_change:   '材料変更',
  complaint:         'クレーム',
  inventory_audit:   '棚卸依頼',
  tray_review:       '収納検討',
  other:             'その他',
}

const TABS = [
  { key: 'overview',   iconEl: ClipboardList,   labelJA: '概要', labelVI: 'Tổng quan' },
  { key: 'technical',  iconEl: Wrench,           labelJA: '技術', labelVI: 'Kỹ thuật' },
  { key: 'sales',      iconEl: FileSpreadsheet,  labelJA: '販売', labelVI: 'Báo giá & Đơn hàng' },
  { key: 'production', iconEl: Factory,          labelJA: '製造', labelVI: 'Sản xuất' },
  { key: 'docs',       iconEl: FolderOpen,       labelJA: '書類', labelVI: 'Tài liệu' },
]

function formatDate(d: string | null) {
  if (!d) return '—'
  return d.substring(0, 10).replace(/-/g, '/')
}

// ── Main Component ──────────────────────────────────────────────────────
export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const caseId = params.id as string

  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('sales')
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    if (!caseId) return
    const fetchCase = async () => {
      setLoading(true)

      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || ''
      setCurrentUserId(userId)

      if (userId) {
        try {
          const { data: profile } = await (supabase as any)
            .from('profiles').select('role').eq('id', userId).maybeSingle()
          setCurrentUserRole((profile?.role as UserRole) ?? 'sales')
        } catch (err) {
          console.error('Failed to load profile', err)
          setCurrentUserRole('sales')
        }
      }

      // NOTE: quotations table not yet created — removed from select until migration is applied
      const { data, error } = await (supabase as any)
        .from('business_cases')
        .select(`
          id, case_code, title, case_type, status,
          requested_due_date, instruction_notes, raw_text_snapshot,
          created_at, updated_at,
          companies(company_id, company_name, company_code),
          sales_owner:employees!business_cases_sales_owner_id_fkey(employee_id, employee_name),
          technical_reviews(
            id, case_id, version, approval_status,
            product_id, design_revision_id,
            material_spec, thickness_mm, special_requirements,
            mold_option, mold_id, pocket_count,
            cutting_die_option, cutting_die_id, machine_id,
            lead_time_days, cycle_time_sec,
            technical_constraints, rejected_reason,
            approved_by, approved_at,
            requested_by, reviewed_by,
            created_at, updated_at
          ),
          quotations(*)
        `)
        .eq('id', caseId)
        .single()

      if (error) {
        console.error('Failed to load business case:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        })
      }

      if (!error && data) setCaseData(data as unknown as CaseDetail)
      setLoading(false)
    }
    fetchCase()
  }, [caseId, supabase])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
      読み込み中... / Đang tải...
    </div>
  )

  if (!caseData) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: 12 }}>
      <AlertCircle size={40} style={{ color: 'var(--status-error)' }} />
      <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>事案が見つかりません / Không tìm thấy sự việc</span>
      <Link href="/cases" className="btn btn-secondary">← 一覧に戻る</Link>
    </div>
  )

  const statusCfg = STATUS_CONFIG[caseData.status]
  const notes = caseData.instruction_notes || caseData.raw_text_snapshot

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Back Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
        borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <button onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 12,
            padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
          <ArrowLeft size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>戻る</span>
        </button>
        <Link href="/cases"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)',
            fontSize: 12, textDecoration: 'none', padding: '4px 8px',
            borderRadius: 'var(--radius-sm)' }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
            (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
            (e.currentTarget.style.background = 'none')}>
          <List size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>一覧</span>
        </Link>

        <span style={{ color: 'var(--border-strong)', margin: '0 4px' }}>/</span>

        <Briefcase size={14} style={{ color: 'var(--accent)' }} />
        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', fontSize: 13 }}>
          {caseData.case_code}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 360,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {caseData.title}
        </span>
        {statusCfg && (
          <span className={statusCfg.badgeClass} style={{ marginLeft: 4 }}>
            <span style={{ fontFamily: 'var(--font-jp)' }}>{statusCfg.labelJA}</span>
          </span>
        )}

        <div style={{ flex: 1 }} />

        <button className="btn btn-secondary" style={{ gap: 6, fontSize: 12, padding: '4px 10px' }}>
          <Edit2 size={13} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>編集</span>
        </button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="tab-nav" style={{ flexShrink: 0 }}>
        {TABS.map(tab => {
          const IconEl = tab.iconEl
          const active = activeTab === tab.key
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`tab-item ${active ? 'tab-item--active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconEl size={13} />
                <span className="tab-ja">{tab.labelJA}</span>
              </div>
              <span className="tab-vi">{tab.labelVI}</span>
            </button>
          )
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

        {/* ====== TAB: OVERVIEW ====== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <div className="kpi-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jp)' }}>種別</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, fontFamily: 'var(--font-jp)' }}>
                  {CASE_TYPE_LABEL[caseData.case_type] ?? caseData.case_type}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Loại sự việc</div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jp)' }}>得意先</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                  {caseData.companies?.company_name ?? '—'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {caseData.companies?.company_code}
                </div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jp)' }}>希望納期</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontFamily: 'monospace' }}>
                  {formatDate(caseData.requested_due_date)}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hạn yêu cầu giao</div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jp)' }}>作成日</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontFamily: 'monospace' }}>
                  {formatDate(caseData.created_at)}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ngày tạo</div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <ClipboardList size={14} className="section-icon" />
                <span style={{ fontFamily: 'var(--font-jp)' }}>事案情報</span>
                <span style={{ marginLeft: 6, opacity: 0.6 }}>Case Information</span>
              </div>
              <div className="form-section-body">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label">
                      <span className="label-ja">事案コード</span>
                      <span className="label-vi">Mã sự việc</span>
                    </label>
                    <input className="form-input mono" readOnly value={caseData.case_code} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">
                      <span className="label-ja">担当営業</span>
                      <span className="label-vi">Nhân viên phụ trách KD</span>
                    </label>
                    <input className="form-input" readOnly
                      value={caseData.sales_owner?.employee_name ?? '—'} />
                  </div>
                  <div className="form-field form-col-span-2">
                    <label className="form-label">
                      <span className="label-ja">タイトル</span>
                      <span className="label-vi">Tiêu đề sự việc</span>
                    </label>
                    <input className="form-input" readOnly value={caseData.title} />
                  </div>
                  {notes && (
                    <div className="form-field form-col-span-2">
                      <label className="form-label">
                        <span className="label-ja">指示メモ</span>
                        <span className="label-vi">Ghi chú chỉ thị</span>
                      </label>
                      <textarea className="form-textarea" readOnly value={notes}
                        style={{ minHeight: 80 }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <CheckCircle2 size={14} className="section-icon" />
                <span style={{ fontFamily: 'var(--font-jp)' }}>進捗ステージ</span>
                <span style={{ marginLeft: 6, opacity: 0.6 }}>Tiến độ vòng đời</span>
              </div>
              <div className="form-section-body">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {(['open','in_review','quoted','ordered','completed'] as const).map((s, i) => {
                    const cfg = STATUS_CONFIG[s]
                    const isCurrentOrPast =
                      (['open','in_review','quoted','ordered','completed'] as string[])
                        .indexOf(caseData.status) >= i
                    return (
                      <React.Fragment key={s}>
                        <div style={{ display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%',
                            border: '2px solid',
                            borderColor: isCurrentOrPast ? 'var(--accent)' : 'var(--border-default)',
                            background: isCurrentOrPast ? 'var(--accent-light)' : 'var(--bg-surface-2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isCurrentOrPast
                              ? <CheckCircle2 size={14} style={{ color: 'var(--accent)' }} />
                              : <Clock size={14} style={{ color: 'var(--text-muted)' }} />}
                          </div>
                          <span style={{ fontSize: 10, fontFamily: 'var(--font-jp)',
                            color: isCurrentOrPast ? 'var(--accent)' : 'var(--text-muted)',
                            fontWeight: caseData.status === s ? 700 : 400 }}>
                            {cfg.labelJA}
                          </span>
                        </div>
                        {i < 4 && (
                          <div style={{ flex: 1, height: 2, margin: '0 4px', marginBottom: 20,
                            background: isCurrentOrPast ? 'var(--accent)' : 'var(--border-default)',
                            minWidth: 24, maxWidth: 60, opacity: 0.5 }} />
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== TAB: TECHNICAL ====== */}
        {activeTab === 'technical' && (
          <TechnicalReviewTab
            caseId={caseId}
            reviews={caseData.technical_reviews || []}
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
          />
        )}

        {/* ====== TAB: SALES ====== */}
        {activeTab === 'sales' && (
          <SalesTab 
            caseId={caseId} 
            quotations={caseData.quotations || []} 
            currentUserId={currentUserId}
            onRefresh={() => {
              setLoading(true)
              const fetchCase = async () => {
                const { data } = await (supabase as any)
                  .from('business_cases')
                  .select(`
                    id, case_code, title, case_type, status,
                    requested_due_date, raw_text_snapshot,
                    created_at, updated_at,
                    companies(company_id, company_name, company_code),
                    sales_owner:employees!business_cases_sales_owner_id_fkey(employee_id, employee_name),
                    technical_reviews(
                      id, case_id, version, approval_status,
                      product_id, design_revision_id,
                      material_spec, thickness_mm, special_requirements,
                      mold_option, mold_id, pocket_count,
                      cutting_die_option, cutting_die_id, machine_id,
                      lead_time_days, cycle_time_sec,
                      technical_constraints, rejected_reason,
                      approved_by, approved_at,
                      requested_by, reviewed_by,
                      created_at, updated_at
                    ),
                    quotations(*)
                  `)
                  .eq('id', caseId)
                  .single()
                if (data) setCaseData(data as unknown as CaseDetail)
                setLoading(false)
              }
              fetchCase()
            }}
          />
        )}

        {/* ====== TAB: PRODUCTION ====== */}
        {activeTab === 'production' && (
          <div className="form-section">
            <div className="form-section-header">
              <Factory size={14} className="section-icon" />
              <span style={{ fontFamily: 'var(--font-jp)' }}>製造指示</span>
              <span style={{ marginLeft: 6, opacity: 0.6 }}>Production Orders</span>
            </div>
            <div className="form-section-body">
              <div style={{ textAlign: 'center', padding: '40px 0',
                color: 'var(--text-muted)', fontSize: 13 }}>
                製造指示はまだありません / Chưa có chỉ thị sản xuất
              </div>
            </div>
          </div>
        )}

        {/* ====== TAB: DOCS ====== */}
        {activeTab === 'docs' && (
          <div className="form-section">
            <div className="form-section-header">
              <FolderOpen size={14} className="section-icon" />
              <span style={{ fontFamily: 'var(--font-jp)' }}>メール・原文スナップショット</span>
              <span style={{ marginLeft: 6, opacity: 0.6 }}>Raw email / ghi chú gốc</span>
            </div>
            <div className="form-section-body">
              {notes ? (
                <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  color: 'var(--text-secondary)', lineHeight: 1.6, maxHeight: 400,
                  overflowY: 'auto', fontFamily: 'monospace' }}>
                  {notes}
                </pre>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0',
                  color: 'var(--text-muted)', fontSize: 13 }}>
                  書類・添付ファイルがありません / Không có tài liệu đính kèm
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
