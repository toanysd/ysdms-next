'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, ArrowUpFromLine, Layers, CheckCircle2,
  AlertTriangle, Loader2, Box, Building2, Pencil, Save, X, Hammer, FilePlus
} from 'lucide-react'
import Link from 'next/link'
import { OverviewTab } from './tabs/OverviewTab'
import { CreateJobModal } from '@/components/equipment/CreateJobModal'
import { MoldModal } from '@/components/equipment/MoldModal'
import { useTranslations } from 'next-intl'

export type DesignRevisionDetail = {
  revision_id: string
  product_id: string | null
  design_code: string
  revision_number: number | null
  status: string | null
  designer_id: string | null
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
  plastic_id: string | null
  plastic_type_designed: string | null
  customer_tray_name: string | null
  customer_equipment_no: string | null
  customer_drawing_no: string | null
  tray_info: string | null
  cad_folder_path: string | null
  drawing_pdf_path: string | null
  step_3d_path: string | null
  change_summary: string | null
  created_at: string | null
  employees: { employee_name: string } | null
  products: {
    product_code: string
    product_name: string | null
    companies: { company_id: string; company_name: string; company_code: string } | null
  } | null
  equipment?: { equipment_id: string; equipment_code: string; device_status: string }[] | null
  jobs?: { job_id: string; job_code: string; job_name: string; job_status: string }[] | null
}

const STATUS_CONFIG: Record<string, { labelKey: string; badge: string }> = {
  DRAFT:      { labelKey: 'Engineering.Status.DRAFT',       badge: 'badge badge--warning' },
  SUBMITTED:  { labelKey: 'Engineering.Status.SUBMITTED',     badge: 'badge badge--info' },
  RELEASED:   { labelKey: 'Engineering.Status.RELEASED',    badge: 'badge badge--success' },
  APPROVED:   { labelKey: 'Engineering.Status.APPROVED',    badge: 'badge badge--success' },
  REJECTED:   { labelKey: 'Engineering.Status.REJECTED',    badge: 'badge badge--error' },
  SUPERSEDED: { labelKey: 'Engineering.Status.SUPERSEDED',  badge: 'badge badge--neutral' },
}

export default function DesignRevisionDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const router = useRouter()
  const revisionId = params.id as string
  const supabase = createClient()

  const [rev, setRev] = useState<DesignRevisionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<DesignRevisionDetail>>({})

  // Modals
  const [jobModalOpen, setJobModalOpen] = useState(false)
  const [moldModalOpen, setMoldModalOpen] = useState(false)

  const fetchRevision = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('design_revisions')
      .select(`
        *,
        employees!designer_id(employee_name),
        products(product_code, product_name, companies:companies!products_company_id_fkey(company_id, company_name, company_code)),
        jobs(job_id, job_code, job_name, job_status)
      `)
      .eq('revision_id', revisionId)
      .single()

    if (err) {
      setError(err.message)
    } else if (data) {
      let equipment: any[] = []
      // Tìm khuôn theo design_code prefix
      if (equipment.length === 0 && data.design_code) {
        const { data: eqData } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code, device_status')
          .eq('equipment_type', 'MOLD')
          .like('equipment_code', `${data.design_code}%`)
          
        if (eqData && eqData.length > 0) {
          equipment = eqData
        }
      }

      const formatted = {
        ...data,
        equipment
      }
      setRev(formatted as unknown as DesignRevisionDetail)
      setFormData(formatted as unknown as Partial<DesignRevisionDetail>)
    }
    setLoading(false)
  }, [revisionId, supabase])

  useEffect(() => {
    fetchRevision()
  }, [fetchRevision])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm">{t('Engineering.loadingRevisionInfo')}</p>
      </div>
    )
  }

  if (error || !rev) {
    return (
      <div className="card-flat p-6 border-l-4 border-[var(--error)] flex items-start gap-4 mx-4 mt-4">
        <AlertTriangle className="text-[var(--error)]" />
        <div>
          <h3 className="font-bold text-[var(--text-primary)] mb-1">{t('Engineering.errorLoading')}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{error || t('Engineering.revisionNotFound')}</p>
          <button className="btn btn-secondary mt-4" onClick={() => router.back()}>{t('Engineering.back')}</button>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const { equipment, jobs, products, employees, mold_revisions, ...updateData } = formData as any
    const { error: err } = await supabase
      .from('design_revisions')
      .update(updateData)
      .eq('revision_id', revisionId)

    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    setSaving(false)
    setIsEditing(false)
    fetchRevision()
  }

  const st = STATUS_CONFIG[rev.status || 'DRAFT'] || STATUS_CONFIG['DRAFT']
  const customerName = rev.products?.companies?.company_name || '—'

  return (
    <div className="max-w-[1200px] mx-auto p-4 flex flex-col gap-4">
      {/* 1) Navigation Header & Actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="btn btn-secondary flex items-center gap-2"
            style={{ padding: '6px 12px', height: '32px' }}
          >
            <ArrowLeft size={16} />
            <span className="text-[12px] font-bold">{t('Engineering.back')}</span>
          </button>
          <Link 
            href={rev.product_id ? `/engineering/designs/${rev.product_id}` : '/engineering/designs'}
            className="btn btn-secondary flex items-center gap-2"
            style={{ padding: '6px 12px', height: '32px', color: 'var(--text-secondary)' }}
          >
            <ArrowUpFromLine size={16} />
            <span className="text-[12px]">{t('Engineering.list')}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => {
                  setIsEditing(false)
                  setFormData(rev)
                }}
                className="btn btn-secondary"
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
                disabled={saving}
              >
                <X size={14} className="mr-1" /> {t('Engineering.cancel')}
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
                disabled={saving}
              >
                <Save size={14} className="mr-1" /> {saving ? t('Engineering.saving') : t('Engineering.save')}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setMoldModalOpen(true)}
                className="btn btn-secondary text-accent border-accent"
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
              >
                <FilePlus size={14} className="mr-1" /> {t('Engineering.createMold')}
              </button>
              <button 
                onClick={() => setJobModalOpen(true)}
                className="btn btn-secondary text-accent border-accent"
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
              >
                <Hammer size={14} className="mr-1" /> {t('Engineering.createJob')}
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
              >
                <Pencil size={14} className="mr-1" /> {t('Engineering.edit')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2) Detail Header Card */}
      <div className="card-flat flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4" style={{
        background: 'linear-gradient(to right, var(--bg-surface), var(--bg-surface-2))'
      }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface-accent-light)] text-[var(--accent)]">
            <Layers size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-lg font-bold font-mono text-[var(--text-primary)] leading-none">
                {rev.design_code}
              </h1>
              <span className={`text-[10px] ${st.badge}`}>{t(st.labelKey)}</span>
            </div>
            <div className="text-[12px] text-[var(--text-secondary)] flex items-center gap-3">
              <span>{rev.products?.product_name || '—'}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
              <span>{customerName}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions / Info */}
        <div className="flex items-center gap-6 text-[12px]">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[var(--text-muted)] mb-1">{t('Engineering.designedBy')}</span>
            <span className="font-medium text-[var(--text-primary)]">
              {rev.employees?.employee_name || '—'}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[var(--text-muted)] mb-1">{t('Engineering.designDate')}</span>
            <span className="font-mono text-[var(--text-primary)]">
              {rev.design_date ? new Date(rev.design_date).toLocaleDateString('ja-JP') : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* 2.5) Workflow Navigation */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '0 4px',
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>
          {t('Engineering.relatedLinks')}:
        </span>
        
        {/* ← Product */}
        {rev.product_id && (
          <Link
            href={`/master/products/${rev.product_id}`}
            className="hover:underline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="製品マスターを開く"
          >
            <Box size={12} style={{ color: 'var(--text-secondary)' }} />
            <span>{t('Engineering.productMaster')}</span>
          </Link>
        )}

        {/* ← Design Revisions List */}
        {rev.product_id && (
          <Link
            href={`/engineering/designs/${rev.product_id}`}
            className="hover:underline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="すべての設計版を開く"
          >
            <Layers size={12} style={{ color: 'var(--text-secondary)' }} />
            <span>{t('Engineering.designListTab')}</span>
          </Link>
        )}

        {/* ← Customer Info */}
        {rev.products?.companies?.company_id && (
          <Link
            href={`/master/customers/${rev.products.companies.company_id}`}
            className="hover:underline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="顧客情報を開く"
          >
            <Building2 size={12} style={{ color: 'var(--text-secondary)' }} />
            <span>{t('Engineering.customerInfo')}</span>
          </Link>
        )}
      </div>

      {/* 3) Tab Navigation */}
      <div className="flex items-center border-b border-[var(--border-default)]">
        <button className="px-4 py-2 border-b-2 border-[var(--accent)] text-[var(--accent)] text-[13px] font-bold">
          {t('Engineering.overview')}
        </button>
      </div>

      {/* 4) Tab Content */}
      <OverviewTab 
        rev={rev} 
        onRefresh={fetchRevision}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Modals */}
      {jobModalOpen && (
        <CreateJobModal
          initialDesignRevisionId={rev.revision_id}
          productId={rev.product_id!}
          productCode={rev.products?.product_code || ''}
          onClose={() => setJobModalOpen(false)}
          onSuccess={(jobId) => {
            setJobModalOpen(false)
            fetchRevision()
          }}
        />
      )}
      
      <MoldModal
        isOpen={moldModalOpen}
        onClose={() => setMoldModalOpen(false)}
        initialData={{
          mold_revision_id: rev.revision_id,
          mold_revision_label: `${rev.products?.product_code} ${rev.design_code}`,
          equipment_code: rev.design_code + '-M1',
          display_name: rev.products?.product_name || rev.design_code,
          actual_length_mm: rev.design_length?.toString() || '',
          actual_width_mm: rev.design_width?.toString() || '',
          actual_height_mm: rev.design_height?.toString() || '',
          actual_weight: rev.design_weight || '',
          mold_type: 'M',
          piece_count: '1'
        }}
        onSuccess={() => {
          fetchRevision()
        }}
      />
    </div>
  )
}
