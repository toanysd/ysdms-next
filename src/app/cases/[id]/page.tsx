'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TechnicalReviewTab from './_components/TechnicalReviewTab'
import SalesTab from './_components/SalesTab'
import type { TechnicalReview, UserRole, Quotation } from './types'
import {
  Briefcase, ArrowLeft, List, ClipboardList, FileSpreadsheet, Factory, FolderOpen,
  Wrench, Edit2, CheckCircle2, Clock, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

// ── Types ──────────────────────────────────────────────────────────────────
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

// ── Config ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { labelKey: string; badgeClass: string }> = {
  open:      { labelKey: 'Cases.Status.open',      badgeClass: 'badge badge--info' },
  in_review: { labelKey: 'Cases.Status.in_review',  badgeClass: 'badge badge--warning' },
  quoted:    { labelKey: 'Cases.Status.quoted',     badgeClass: 'badge badge--neutral' },
  ordered:   { labelKey: 'Cases.Status.ordered',    badgeClass: 'badge badge--success' },
  completed: { labelKey: 'Cases.Status.completed',  badgeClass: 'badge badge--success' },
  closed:    { labelKey: 'Cases.Status.closed',     badgeClass: 'badge badge--neutral' },
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
  { key: 'overview',   iconEl: ClipboardList,   tKey: 'overview' },
  { key: 'technical',  iconEl: Wrench,           tKey: 'technical' },
  { key: 'sales',      iconEl: FileSpreadsheet,  tKey: 'sales' },
  { key: 'production', iconEl: Factory,          tKey: 'production' },
  { key: 'docs',       iconEl: FolderOpen,       tKey: 'docs' },
]

function formatDate(d: string | null) {
  if (!d) return '—'
  return d.substring(0, 10).replace(/-/g, '/')
}

// ── Main Component ───────────────────────────────────────────────────────────────────
export default function CaseDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const caseId = params.id as string

  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  // Khi tab kỹ thuật bấm "Tạo báo giá", set cở này → SalesTab tự mở modal
  const [openSalesModal, setOpenSalesModal] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('sales')
  const [currentUserId, setCurrentUserId] = useState<string>('')

  const fetchCase = React.useCallback(async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || ''
    setCurrentUserId(userId)

    if (userId) {
      try {
        const { data: profile } = await (supabase as any)
          .from('profiles').select('role').eq('id', userId).maybeSingle()
        setCurrentUserRole((profile?.role as UserRole) ?? 'sales')
      } catch {
        setCurrentUserRole('sales')
      }
    }

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
        quotations(*, quotation_lines(*))
      `)
      .eq('id', caseId)
      .single()

    if (error) {
      console.error('Failed to load business case:', error)
    }
    if (!error && data) setCaseData(data as unknown as CaseDetail)
    setLoading(false)
  }, [caseId, supabase])

  useEffect(() => {
    if (caseId) fetchCase()
  }, [caseId, fetchCase])

  // Handler: từ TechnicalReviewSummary → chuyển sang Sales tab và mở modal
  function handleGoToSalesAndOpenModal() {
    setOpenSalesModal(true)
    setActiveTab('sales')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
      {t('Cases.loading')}
    </div>
  )

  if (!caseData) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: 12 }}>
      <AlertCircle size={40} style={{ color: 'var(--status-error)' }} />
      <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('Cases.notFound')}</span>
      <Link href="/cases" className="btn btn-secondary">{t('Cases.backToList')}</Link>
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
          <span>{t('Cases.back')}</span>
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
          <span>{t('Cases.list')}</span>
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
            <span style={{ fontFamily: 'var(--font-jp)' }}>{t(statusCfg.labelKey)}</span>
          </span>
        )}
        <div style={{ flex: 1 }} />
        <button className="btn btn-secondary" style={{ gap: 6, fontSize: 12, padding: '4px 10px' }}>
          <Edit2 size={13} />
          <span>{t('Cases.edit')}</span>
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
                <span className="font-bold text-[12px]">{t(`Cases.Tabs.${tab.tKey}`)}</span>
              </div>
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
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{t('Cases.type')}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: 'var(--text-primary)' }}>
                  {caseData.case_type ? t(`Cases.Types.${caseData.case_type}`) : '—'}
                </div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{t('Cases.customer')}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: 'var(--text-primary)' }}>
                  {caseData.companies?.company_name ?? '—'}
                </div>
                {caseData.companies?.company_code && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    ({caseData.companies.company_code})
                  </div>
                )}
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{t('Cases.requestedDueDate')}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {formatDate(caseData.requested_due_date)}
                </div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{t('Cases.createdDate')}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {formatDate(caseData.created_at)}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <ClipboardList size={14} className="section-icon" />
                <span>{t('Cases.caseInfo')}</span>
              </div>
              <div className="form-section-body">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label">
                      <span>{t('Cases.caseCode')}</span>
                    </label>
                    <input className="form-input mono" readOnly value={caseData.case_code} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">
                      <span>{t('Cases.salesOwnerLabel')}</span>
                    </label>
                    <input className="form-input" readOnly
                      value={caseData.sales_owner?.employee_name ?? '—'} />
                  </div>
                  <div className="form-field form-col-span-2">
                    <label className="form-label">
                      <span>{t('Cases.titleLabel')}</span>
                    </label>
                    <input className="form-input" readOnly value={caseData.title} />
                  </div>
                  {notes && (
                    <div className="form-field form-col-span-2">
                      <label className="form-label">
                        <span>{t('Cases.instructionNotes')}</span>
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
                <span>{t('Cases.progressStage')}</span>
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
                            {t(cfg.labelKey)}
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
            onCreateQuotation={handleGoToSalesAndOpenModal}
          />
        )}

        {/* ====== TAB: SALES ====== */}
        {activeTab === 'sales' && (
          <SalesTab
            caseId={caseId}
            companyId={caseData.companies?.company_id || null}
            quotations={caseData.quotations || []}
            currentUserId={currentUserId}
            openModalOnMount={openSalesModal}
            onModalMounted={() => setOpenSalesModal(false)}
            onRefresh={fetchCase}
          />
        )}

        {/* ====== TAB: PRODUCTION ====== */}
        {activeTab === 'production' && (
          <div className="form-section">
            <div className="form-section-header">
              <Factory size={14} className="section-icon" />
              <span>{t('Cases.productionOrders')}</span>
            </div>
            <div className="form-section-body">
              <div style={{ textAlign: 'center', padding: '40px 0',
                color: 'var(--text-muted)', fontSize: 13 }}>
                {t('Cases.noProductionOrders')}
              </div>
            </div>
          </div>
        )}

        {/* ====== TAB: DOCS ====== */}
        {activeTab === 'docs' && (
          <div className="form-section">
            <div className="form-section-header">
              <FolderOpen size={14} className="section-icon" />
              <span>{t('Cases.rawEmailSnapshot')}</span>
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
                  {t('Cases.noDocs')}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
