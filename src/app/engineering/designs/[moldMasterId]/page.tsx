'use client'

import { useTranslations, useLocale } from 'next-intl'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Copy,
  FileText, Ruler, Settings, Building2, FolderOpen,
  ClipboardList, StickyNote, Package, Wrench, ExternalLink, Hammer,
  ArrowUpFromLine, PenTool, Box, Layers
} from 'lucide-react'
import Link from 'next/link'
import { CreateJobModal } from '@/components/equipment/CreateJobModal'
import { DesignJobsList } from '@/components/equipment/DesignJobsList'
import { DesignPhysicalMoldsList } from '@/components/equipment/DesignPhysicalMoldsList'


/* ─────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────── */

type MoldMasterInfo = {
  product_id: string
  product_code: string
  product_name: string | null
  product_name_internal: string | null
  company_id: string | null
  products: {
    product_code: string
    product_name: string
    customer_product_name: string | null
    companies: { company_name: string; company_code: string } | null
  }[] | null
}

type Employee = {
  employee_id: string
  employee_name: string
}

type DesignRevision = {
  revision_id: string
  mold_master_id: string | null
  company_id: string | null
  design_code: string
  revision_number: number | null
  status: string | null
  designer_id: string | null
  designer: string | null
  design_date: string | null
  approved_date: string | null
  design_length: number | null
  design_width: number | null
  design_height: number | null
  design_depth: number | null
  design_weight: string | null
  cutline_length: number | null
  cutline_width: number | null
  cavity_count: number | null
  pocket_numbers: number | null
  cavity_pitch_mm: number | null
  machine_feed_pitch_mm: number | null
  corner_r: string | null
  chamfer_c: string | null
  draft_angle: string | null
  under_depth: string | null
  undercut_spec: string | null
  orientation: string | null
  setup_type: string | null
  plug_type: string | null
  has_separate_cutter: boolean | null
  plastic_type_designed: string | null
  customer_tray_name: string | null
  customer_equipment_no: string | null
  customer_drawing_no: string | null
  tray_info: string | null
  cad_folder_path: string | null
  drawing_pdf_path: string | null
  step_3d_path: string | null
  text_content: string | null
  version_note: string | null
  created_at: string | null
  employees: { employee_name: string } | null
  physical_molds?: { physical_mold_id: string; system_code: string; device_status: string }[] | null
  jobs?: { job_id: string; job_code: string; job_name: string; job_status: string }[] | null
}

type FormData = {
  design_code: string
  revision_number: number | null
  status: string
  designer_id: string
  design_date: string
  approved_date: string
  design_length: string
  design_width: string
  design_height: string
  design_depth: string
  design_weight: string
  cutline_length: string
  cutline_width: string
  cavity_count: string
  pocket_numbers: string
  cavity_pitch_mm: string
  machine_feed_pitch_mm: string
  corner_r: string
  chamfer_c: string
  draft_angle: string
  under_depth: string
  undercut_spec: string
  orientation: string
  setup_type: string
  plug_type: string
  has_separate_cutter: boolean
  plastic_type_designed: string
  customer_tray_name: string
  customer_equipment_no: string
  customer_drawing_no: string
  tray_info: string
  cad_folder_path: string
  drawing_pdf_path: string
  step_3d_path: string
  notes: string
  version_note: string
}

/* ── Status config ────────────────────────────────── */

type StatusKey = 'DRAFT' | 'SUBMITTED' | 'RELEASED' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED'

const STATUS_CONFIG: Record<StatusKey, { label: string; badge: string }> = {
  DRAFT:      { label: '下書き',   badge: 'badge badge--warning' },
  SUBMITTED:  { label: '提出済',   badge: 'badge badge--info' },
  RELEASED:   { label: 'リリース', badge: 'badge badge--success' },
  APPROVED:   { label: '承認済',   badge: 'badge badge--success' },
  REJECTED:   { label: '却下',     badge: 'badge badge--error' },
  SUPERSEDED: { label: '旧版',     badge: 'badge badge--neutral' },
}

const STATUS_OPTIONS: StatusKey[] = ['DRAFT', 'SUBMITTED', 'RELEASED', 'REJECTED', 'SUPERSEDED']

const EMPTY_FORM: FormData = {
  design_code: '', revision_number: null, status: 'DRAFT',
  designer_id: '', design_date: '', approved_date: '',
  design_length: '', design_width: '', design_height: '', design_depth: '',
  design_weight: '', cutline_length: '', cutline_width: '',
  cavity_count: '', pocket_numbers: '', cavity_pitch_mm: '', machine_feed_pitch_mm: '',
  corner_r: '', chamfer_c: '', draft_angle: '',
  under_depth: '', undercut_spec: '', orientation: '', setup_type: '',
  plug_type: 'NONE', has_separate_cutter: false, plastic_type_designed: '',
  customer_tray_name: '', customer_equipment_no: '', customer_drawing_no: '', tray_info: '',
  cad_folder_path: '', drawing_pdf_path: '', step_3d_path: '',
  notes: '', version_note: '',
}

/* ── Helpers ──────────────────────────────────────── */

function fmtDate(d: string | null): string {
  if (!d) return '—'
  return d.substring(0, 10).replace(/-/g, '/')
}

function numOrNull(v: string): number | null {
  if (!v || v.trim() === '') return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

function strOrNull(v: string): string | null {
  return v.trim() === '' ? null : v.trim()
}

/* ═══════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════ */

export default function MoldMasterDesignsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const params = useParams()
  const router = useRouter()
  const moldMasterId = params.moldMasterId as string
  const supabase = createClient()

  /* ── State ────────────────────────────────────────── */
  const [moldMaster, setMoldMaster] = useState<MoldMasterInfo | null>(null)
  const [revisions, setRevisions] = useState<DesignRevision[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Selection state
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(null)
  const [selectedMoldId, setSelectedMoldId] = useState<string | null>(null)

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [jobModalRevId, setJobModalRevId] = useState<string | null>(null)

  /* ── Data fetching ────────────────────────────────── */

  const fetchMoldMaster = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('products')
      .select('*, companies:companies!products_company_id_fkey(company_name, company_code)')
      .eq('product_id', moldMasterId)
      .single()
    if (err) {
      setError(err.message)
    } else {
      setMoldMaster(data as unknown as MoldMasterInfo)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moldMasterId])

  const fetchRevisions = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('design_revisions')
      .select('*, employees!designer_id(employee_name), mold_revisions(physical_molds(physical_mold_id, system_code, device_status)), jobs(job_id, job_code, job_name, job_status)')
      .eq('product_id', moldMasterId)
      .order('revision_number', { ascending: false })
    if (err) {
      setError(err.message)
      setRevisions([])
    } else {
      const formattedData = data?.map(rev => ({
        ...rev,
        physical_molds: rev.mold_revisions?.flatMap((mr: any) => mr.physical_molds || []) || []
      }))
      setRevisions((formattedData as unknown as DesignRevision[]) || [])
    }
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moldMasterId])

  const fetchEmployees = useCallback(async () => {
    const { data } = await supabase
      .from('employees')
      .select('employee_id, employee_name')
      .order('employee_name')
    if (data) setEmployees(data)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchMoldMaster()
    fetchRevisions()
    fetchEmployees()
  }, [fetchMoldMaster, fetchRevisions, fetchEmployees])

  /* ── Derived data ─────────────────────────────────── */

  const firstProduct = moldMaster?.products?.[0] ?? null
  const companyName = firstProduct?.companies?.company_name ?? '—'
  const companyCode = firstProduct?.companies?.company_code ?? ''
  const productCode = firstProduct?.product_code ?? '—'
  const productName = firstProduct?.product_name ?? ''
  const customerProductName = firstProduct?.customer_product_name ?? '—'
  // Get company_id from product's company for inserts
  const derivedCompanyId = (() => {
    // Try to find company_id from the mold_master itself
    if (moldMaster?.company_id) return moldMaster.company_id
    return null
  })()

  /* ── Form helpers ─────────────────────────────────── */

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const revisionToForm = (r: DesignRevision): FormData => ({
    design_code: r.design_code || '',
    revision_number: r.revision_number,
    status: r.status || 'DRAFT',
    designer_id: r.designer_id || '',
    design_date: r.design_date || '',
    approved_date: r.approved_date || '',
    design_length: r.design_length?.toString() ?? '',
    design_width: r.design_width?.toString() ?? '',
    design_height: r.design_height?.toString() ?? '',
    design_depth: r.design_depth?.toString() ?? '',
    design_weight: r.design_weight ?? '',
    cutline_length: r.cutline_length?.toString() ?? '',
    cutline_width: r.cutline_width?.toString() ?? '',
    cavity_count: r.cavity_count?.toString() ?? '',
    pocket_numbers: r.pocket_numbers?.toString() ?? '',
    cavity_pitch_mm: r.cavity_pitch_mm?.toString() ?? '',
    machine_feed_pitch_mm: r.machine_feed_pitch_mm?.toString() ?? '',
    corner_r: r.corner_r ?? '',
    chamfer_c: r.chamfer_c ?? '',
    draft_angle: r.draft_angle ?? '',
    under_depth: r.under_depth ?? '',
    undercut_spec: r.undercut_spec ?? '',
    orientation: r.orientation ?? '',
    setup_type: r.setup_type ?? '',
    plug_type: r.plug_type ?? 'NONE',
    has_separate_cutter: r.has_separate_cutter ?? false,
    plastic_type_designed: r.plastic_type_designed ?? '',
    customer_tray_name: r.customer_tray_name ?? '',
    customer_equipment_no: r.customer_equipment_no ?? '',
    customer_drawing_no: r.customer_drawing_no ?? '',
    tray_info: r.tray_info ?? '',
    cad_folder_path: r.cad_folder_path ?? '',
    drawing_pdf_path: r.drawing_pdf_path ?? '',
    step_3d_path: r.step_3d_path ?? '',
    notes: r.text_content ?? '',
    version_note: r.version_note ?? '',
  })

  const formToPayload = () => ({
    design_code: form.design_code,
    revision_number: form.revision_number,
    status: form.status || 'DRAFT',
    designer_id: strOrNull(form.designer_id),
    design_date: strOrNull(form.design_date),
    approved_date: strOrNull(form.approved_date),
    design_length: numOrNull(form.design_length),
    design_width: numOrNull(form.design_width),
    design_height: numOrNull(form.design_height),
    design_depth: numOrNull(form.design_depth),
    design_weight: strOrNull(form.design_weight),
    cutline_length: numOrNull(form.cutline_length),
    cutline_width: numOrNull(form.cutline_width),
    cavity_count: numOrNull(form.cavity_count) as number | null,
    pocket_numbers: numOrNull(form.pocket_numbers) as number | null,
    cavity_pitch_mm: numOrNull(form.cavity_pitch_mm),
    machine_feed_pitch_mm: numOrNull(form.machine_feed_pitch_mm),
    corner_r: strOrNull(form.corner_r),
    chamfer_c: strOrNull(form.chamfer_c),
    draft_angle: strOrNull(form.draft_angle),
    under_depth: strOrNull(form.under_depth),
    undercut_spec: strOrNull(form.undercut_spec),
    orientation: strOrNull(form.orientation),
    setup_type: strOrNull(form.setup_type),
    plug_type: form.plug_type,
    has_separate_cutter: form.has_separate_cutter,
    plastic_type_designed: strOrNull(form.plastic_type_designed),
    customer_tray_name: strOrNull(form.customer_tray_name),
    customer_equipment_no: strOrNull(form.customer_equipment_no),
    customer_drawing_no: strOrNull(form.customer_drawing_no),
    tray_info: strOrNull(form.tray_info),
    cad_folder_path: strOrNull(form.cad_folder_path),
    drawing_pdf_path: strOrNull(form.drawing_pdf_path),
    step_3d_path: strOrNull(form.step_3d_path),
    text_content: strOrNull(form.notes),
    version_note: strOrNull(form.version_note),
  })

  /* ── Modal actions ────────────────────────────────── */

  const openAddModal = () => {
    const nextRev = revisions.length > 0
      ? Math.max(...revisions.map(r => r.revision_number ?? 0)) + 1
      : 1
    const code = `${moldMaster?.product_code ?? 'DR'}-R${String(nextRev).padStart(2, '0')}`
    setForm({ ...EMPTY_FORM, design_code: code, revision_number: nextRev })
    setEditingId(null)
    setShowModal(true)
  }

  const openEditModal = (rev: DesignRevision) => {
    setForm(revisionToForm(rev))
    setEditingId(rev.revision_id)
    setShowModal(true)
  }

  const handleCopyFromPrevious = () => {
    if (revisions.length === 0) return
    // Get latest revision (first in descending list)
    const latest = revisions[0]
    const copied = revisionToForm(latest)
    const nextRev = Math.max(...revisions.map(r => r.revision_number ?? 0)) + 1
    const code = `${moldMaster?.product_code ?? 'DR'}-R${String(nextRev).padStart(2, '0')}`
    setForm({
      ...copied,
      design_code: code,
      revision_number: nextRev,
      status: 'DRAFT',
      approved_date: '',
      version_note: '',
    })
  }

  const handleSave = async () => {
    if (!form.design_code.trim()) {
      alert('設計コード（Design Code）は必須です。')
      return
    }
    setSaving(true)

    const payload = formToPayload()

    if (editingId) {
      // Update
      const { error: err } = await supabase
        .from('design_revisions')
        .update(payload)
        .eq('revision_id', editingId)
      setSaving(false)
      if (err) { alert(`エラー: ${err.message}`); return }
    } else {
      // Insert
      const { error: err } = await supabase
        .from('design_revisions')
        .insert({
          ...payload,
          product_id: moldMasterId,
          company_id: derivedCompanyId,
        })
      setSaving(false)
      if (err) { alert(`エラー: ${err.message}`); return }
    }
    setShowModal(false)
    fetchRevisions()
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`「${label}」を削除しますか？`)) return
    const { error: err } = await supabase
      .from('design_revisions')
      .delete()
      .eq('revision_id', id)
    if (err) { alert(`エラー: ${err.message}`); return }
    fetchRevisions()
  }

  /* ── Render helpers ───────────────────────────────── */

  const renderBadge = (status: string | null) => {
    const s = status ?? 'DRAFT'
    const key = (s === 'APPROVED' ? 'RELEASED' : s) as StatusKey
    const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG.DRAFT
    return (
      <span className={cfg.badge} style={{ fontSize: 10, padding: '2px 8px', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: 'var(--font-jp)', fontWeight: 700 }}>{cfg.label}</span>
      </span>
    )
  }

  const dimStr = (l: number | null, w: number | null, h: number | null) => {
    if (l == null && w == null && h == null) return '—'
    return `${l ?? '—'}×${w ?? '—'}×${h ?? '—'}`
  }

  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── Back / Up + Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Back = browser back (preserves previous page state) */}
        <button
          onClick={() => router.back()}
          className="btn btn-secondary"
          style={{ height: 30, padding: '0 8px', gap: 3, fontSize: 11 }}
          title="前のページに戻る"
        >
          <ArrowLeft size={13} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>戻る</span>
        </button>
        {/* Up = go to parent list (hierarchy) */}
        <Link
          href="/engineering/designs"
          className="btn btn-secondary"
          style={{ height: 30, padding: '0 8px', gap: 3, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          title="設計版一覧へ"
        >
          <ArrowUpFromLine size={12} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>一覧</span>
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} style={{ color: 'var(--accent)' }} />
            <h1 style={{
              fontSize: 15, fontWeight: 700,
              fontFamily: 'var(--font-jp)',
              color: 'var(--text-primary)', margin: 0,
            }}>
              設計版管理
            </h1>
          </div>
        </div>
      </div>

      {/* ── Top Section: Info & Links ── */}
      {moldMaster && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, alignItems: 'stretch' }}>
          {/* Left: Mold Master Info Card */}
          <div className="card-flat" style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', marginBottom: 8 }}>
              <PenTool size={12} />
              <span style={{ fontFamily: 'var(--font-jp)' }}>製品情報</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>製品コード</span>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {moldMaster.product_code}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>製品名 (社内)</span>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {moldMaster.product_name_internal || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions / Links Card */}
          <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={openAddModal}
            >
              <Plus size={14} />
              新規リビジョン登録
            </button>
            {revisions.length > 0 && (
              <button
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleCopyFromPrevious}
              >
                前版からコピー
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Modal to Add/Edit Revision ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)} />
          <div className="card" style={{
            position: 'relative', width: 900, maxHeight: '90vh', overflowY: 'auto', padding: 0, zIndex: 1,
            display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                {editingId ? 'リビジョン編集' : '新規リビジョン追加'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                
                {/* Left pane: Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  {/* ── Section 1: 基本情報 ── */}
                  <div className="form-section">
                    <div className="form-section-header">
                      <Layers className="section-icon" />
                      <span style={{ fontFamily: 'var(--font-jp)' }}>基本情報</span>
                    </div>
                    <div className="form-section-body">
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label className="form-label">
                            {t('Engineering.designCode')}
                          </label>
                          <input
                            type="text"
                            className="form-input mono"
                            value={form.design_code}
                            onChange={e => setField('design_code', e.target.value)}
                          />
                        </div>
                        {/* Rev Number */}
                        <div className="form-field">
                          <label className="form-label">
                            {t('Engineering.revision')}
                          </label>
                          <input
                            type="number"
                            className="form-input"
                            value={form.revision_number ?? ''}
                            onChange={e => setField('revision_number', e.target.value ? Number(e.target.value) : null)}
                            readOnly={!!editingId}
                          />
                        </div>
                    {/* Status */}
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.trangThai')}
                      </label>
                      <select
                        className="form-input"
                        value={form.status}
                        onChange={e => setField('status', e.target.value)}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-grid-4" style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 10 }}>
                    {/* Designer */}
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.nvThietKe')}
                      </label>
                      <select
                        className="form-input"
                        value={form.designer_id}
                        onChange={e => setField('designer_id', e.target.value)}
                      >
                        <option value="">— 選択 —</option>
                        {employees.map(emp => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.employee_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Design Date */}
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.ngayThietKe')}
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={form.design_date}
                        onChange={e => setField('design_date', e.target.value)}
                      />
                    </div>
                    {/* Approved Date */}
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.ngayDuyet')}
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={form.approved_date}
                        onChange={e => setField('approved_date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: 寸法 & パラメータ ── */}
              <div className="form-section">
                <div className="form-section-header">
                  <Ruler className="section-icon" />
                  <span style={{ fontFamily: 'var(--font-jp)' }}>寸法 & パラメータ</span>
                </div>
                <div className="form-section-body">
                  <div className="form-grid-4" style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {([
                      ['design_length', '長さ L'],
                      ['design_width', '幅 W'],
                      ['design_height', '高さ H'],
                      ['design_depth', '深さ D'],
                    ] as [keyof FormData, string][]).map(([key, ja]) => (
                      <div className="form-field" key={key}>
                        <label className="form-label">
                          {ja}
                        </label>
                        <input
                          type="number" step="any"
                          className="form-input"
                          value={form[key] as string}
                          onChange={e => setField(key, e.target.value as never)}
                          placeholder="mm"
                        />
                      </div>
                    ))}`
                  </div>
                  <div className="form-grid-4" style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 10 }}>
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.khoiLuong')}
                      </label>
                      <input type="text" className="form-input" value={form.design_weight} onChange={e => setField('design_weight', e.target.value)} placeholder="g" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.cutlineL')}
                      </label>
                      <input type="number" step="any" className="form-input" value={form.cutline_length} onChange={e => setField('cutline_length', e.target.value)} placeholder="mm" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.cutlineW')}
                      </label>
                      <input type="number" step="any" className="form-input" value={form.cutline_width} onChange={e => setField('cutline_width', e.target.value)} placeholder="mm" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.cavity')}
                      </label>
                      <input type="number" className="form-input" value={form.cavity_count} onChange={e => setField('cavity_count', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-grid-4" style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 10 }}>
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.pocket')}
                      </label>
                      <input type="number" className="form-input" value={form.pocket_numbers} onChange={e => setField('pocket_numbers', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.cavityPitchMm')}
                      </label>
                      <input type="number" step="any" className="form-input" value={form.cavity_pitch_mm} onChange={e => setField('cavity_pitch_mm', e.target.value)} placeholder="mm" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">
                        {t('Engineering.feedPitchMm')}
                      </label>
                      <input type="number" step="any" className="form-input" value={form.machine_feed_pitch_mm} onChange={e => setField('machine_feed_pitch_mm', e.target.value)} placeholder="mm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 3: 技術詳細 ── */}
              <div className="form-section">
                <div className="form-section-header">
                  <Settings className="section-icon" />
                  <span style={{ fontFamily: 'var(--font-jp)' }}>技術詳細</span>
                </div>
                <div className="form-section-body">
                  <div className="form-grid-4" style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.cornerR')}</label>
                      <input type="text" className="form-input" value={form.corner_r} onChange={e => setField('corner_r', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.chamferC')}</label>
                      <input type="text" className="form-input" value={form.chamfer_c} onChange={e => setField('chamfer_c', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.draftAngle')}</label>
                      <input type="text" className="form-input" value={form.draft_angle} onChange={e => setField('draft_angle', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.underDepth')}</label>
                      <input type="text" className="form-input" value={form.under_depth} onChange={e => setField('under_depth', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-grid-4" style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 10 }}>
                    <div className="form-field" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">{t('Engineering.undercutSpec')}</label>
                      <input type="text" className="form-input" value={form.undercut_spec} onChange={e => setField('undercut_spec', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.orientation')}</label>
                      <input type="text" className="form-input" value={form.orientation} onChange={e => setField('orientation', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.setupType')}</label>
                      <input type="text" className="form-input" value={form.setup_type} onChange={e => setField('setup_type', e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
                      <input
                        type="checkbox"
                        checked={form.plug_type !== 'NONE'}
                        onChange={e => setField('plug_type', e.target.checked ? 'OWNED' : 'NONE')}
                        style={{ width: 15, height: 15, accentColor: 'var(--accent)' }}
                      />
                      <span style={{ fontFamily: 'var(--font-jp)', fontSize: 12, fontWeight: 600 }}>プラグ有</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
                      <input
                        type="checkbox"
                        checked={form.has_separate_cutter}
                        onChange={e => setField('has_separate_cutter', e.target.checked)}
                        style={{ width: 15, height: 15, accentColor: 'var(--accent)' }}
                      />
                      <span style={{ fontFamily: 'var(--font-jp)', fontSize: 12, fontWeight: 600 }}>別カッター</span>
                    </label>
                  </div>
                  <div className="form-grid-2" style={{ marginTop: 10 }}>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.nhuaThietKe')}</label>
                      <input type="text" className="form-input" value={form.plastic_type_designed} onChange={e => setField('plastic_type_designed', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 4: 顧客情報 ── */}
              <div className="form-section">
                <div className="form-section-header">
                  <Building2 className="section-icon" />
                  <span style={{ fontFamily: 'var(--font-jp)' }}>顧客情報</span>
                </div>
                <div className="form-section-body">
                  <div className="form-grid-2">
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.customerTrayName')}</label>
                      <input type="text" className="form-input" value={form.customer_tray_name} onChange={e => setField('customer_tray_name', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.customerEquipmentNo')}</label>
                      <input type="text" className="form-input" value={form.customer_equipment_no} onChange={e => setField('customer_equipment_no', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.customerDrawingNo')}</label>
                      <input type="text" className="form-input" value={form.customer_drawing_no} onChange={e => setField('customer_drawing_no', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.trayInfo')}</label>
                      <input type="text" className="form-input" value={form.tray_info} onChange={e => setField('tray_info', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 5: ファイル & メモ ── */}
              <div className="form-section">
                <div className="form-section-header">
                  <FolderOpen className="section-icon" />
                  <span style={{ fontFamily: 'var(--font-jp)' }}>ファイル & メモ</span>
                </div>
                <div className="form-section-body">
                  <div className="form-grid-2">
                    <div className="form-field" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">{t('Engineering.cadFolderPath')}</label>
                      <input type="text" className="form-input mono" value={form.cad_folder_path} onChange={e => setField('cad_folder_path', e.target.value)} placeholder="\\server\cad\..." />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.drawingPdfPath')}</label>
                      <input type="text" className="form-input mono" value={form.drawing_pdf_path} onChange={e => setField('drawing_pdf_path', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.step3dPath')}</label>
                      <input type="text" className="form-input mono" value={form.step_3d_path} onChange={e => setField('step_3d_path', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-grid-2" style={{ marginTop: 10 }}>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.ghiChu')}</label>
                      <textarea
                        className="form-textarea"
                        value={form.notes}
                        onChange={e => setField('notes', e.target.value)}
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="form-field">
                      <label className="form-label">{t('Engineering.versionNote')}</label>
                      <textarea
                        className="form-textarea"
                        value={form.version_note}
                        onChange={e => setField('version_note', e.target.value)}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Sidebar: Physical Molds and Jobs */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                {editingId && revisions.find(r => r.revision_id === editingId) ? (() => {
                  const currentRev = revisions.find(r => r.revision_id === editingId)!
                  const sortedMolds = [...(currentRev.physical_molds || [])].sort((a, b) => a.system_code.localeCompare(b.system_code))
                  const sortedJobs = [...(currentRev.jobs || [])].sort((a, b) => a.job_code.localeCompare(b.job_code))

                  return (
                    <>
                      {/* Physical Molds Card */}
                      <div className="card-flat">
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--border-default)] pb-2">
                          <h3 className="text-[12px] font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                            <Box size={14} className="text-accent" />
                            物理金型
                          </h3>
                        </div>
                        <div className="flex flex-col gap-2">
                          {sortedMolds.length === 0 ? (
                            <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">データなし</div>
                          ) : (
                            sortedMolds.map(mold => (
                              <Link
                                key={mold.physical_mold_id}
                                href={`/equipment/molds/${mold.physical_mold_id}`}
                                className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                              >
                                <span className="text-[12px] font-bold font-mono text-[var(--text-primary)]">
                                  {mold.system_code}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)]">
                                  {mold.device_status}
                                </span>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Jobs Card */}
                      <div className="card-flat">
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--border-default)] pb-2">
                          <h3 className="text-[12px] font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                            <Hammer size={14} className="text-accent" />
                            ジョブ
                          </h3>
                        </div>
                        <div className="flex flex-col gap-2">
                          {sortedJobs.length === 0 ? (
                            <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">データなし</div>
                          ) : (
                            sortedJobs.map(job => (
                              <Link
                                key={job.job_id}
                                href={`/equipment/jobs/${job.job_id}`}
                                className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                              >
                                <div>
                                  <div className="text-[12px] font-bold font-mono text-[var(--text-primary)]">{job.job_code}</div>
                                  <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[150px]">{job.job_name}</div>
                                </div>
                                <span className="text-[9px] badge badge--neutral">
                                  {job.job_status || 'DRAFT'}
                                </span>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )
                })() : (
                  <div className="text-[11px] text-[var(--text-muted)] p-4 card-flat text-center border border-dashed border-[var(--border-default)]">
                    保存後に表示されます
                  </div>
                )}
              </div>
            </div>
            </div>
            {/* ── Sticky Footer with Workflow Links & Buttons ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderTop: '1px solid var(--border-default)',
              background: 'var(--bg-surface-2)', position: 'sticky', bottom: 0, zIndex: 1,
            }}>
              {/* Left side: Workflow links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {editingId && (
                  <>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-jp)' }}>
                      関連:
                    </span>
                    {moldMaster && (
                      <Link
                        href={`/master/products?search=${encodeURIComponent(moldMaster.product_code)}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                          fontSize: 10, color: 'var(--text-primary)', textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <Package size={10} style={{ color: 'var(--accent)' }} />
                        <span style={{ fontFamily: 'var(--font-jp)' }}>製品</span>
                        <ExternalLink size={8} style={{ opacity: 0.4 }} />
                      </Link>
                    )}
                    {moldMaster?.company_id && (
                      <Link
                        href={`/master/customers/${moldMaster.company_id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                          fontSize: 10, color: 'var(--text-primary)', textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <Building2 size={10} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontFamily: 'var(--font-jp)' }}>得意先</span>
                        <ExternalLink size={8} style={{ opacity: 0.4 }} />
                      </Link>
                    )}
                    <Link
                      href={`/equipment/molds?master=${moldMaster?.product_code || ''}&revision=${form.design_code || ''}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                        background: 'color-mix(in srgb, var(--accent) 8%, var(--bg-surface))',
                        border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                        fontSize: 10, color: 'var(--accent)', textDecoration: 'none',
                        fontWeight: 700,
                      }}
                      title="この設計版の金型を開く"
                    >
                      <Wrench size={10} />
                      <span style={{ fontFamily: 'var(--font-jp)' }}>金型</span>
                      <ExternalLink size={8} style={{ opacity: 0.5 }} />
                    </Link>
                  </>
                )}
              </div>

              {/* Right side: Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  style={{ height: 32, fontSize: 12, padding: '0 14px' }}
                  onClick={() => setShowModal(false)}
                >
                  <span style={{ fontFamily: 'var(--font-jp)' }}>キャンセル</span>
                </button>
                <button
                  className="btn btn-primary"
                  style={{ height: 32, fontSize: 12, padding: '0 14px', opacity: saving ? 0.6 : 1 }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Plus size={14} />
                  <span style={{ fontFamily: 'var(--font-jp)' }}>
                    {saving ? '保存中...' : editingId ? '更新する' : '登録する'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── Bottom Section: Molds & Jobs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16, marginTop: 16 }}>
        <DesignPhysicalMoldsList 
          productId={moldMasterId}
          productCode={moldMaster?.product_code}
          selectedRevisionId={selectedRevisionId}
          selectedMoldId={selectedMoldId}
          onMoldSelect={setSelectedMoldId}
        />
        <DesignJobsList 
          productId={moldMasterId} 
          selectedRevisionId={selectedRevisionId}
          selectedMoldId={selectedMoldId}
        />
      </div>

      {/* ── Job Modal ── */}
      {jobModalRevId && (
        <CreateJobModal
          initialDesignRevisionId={jobModalRevId}
          productId={moldMasterId}
          productCode={moldMaster?.product_code}
          onClose={() => setJobModalRevId(null)}
          onSuccess={(jobId) => {
            setJobModalRevId(null)
            router.push(`/equipment/jobs/${jobId}`)
          }}
        />
      )}
    </div>
  )
}
