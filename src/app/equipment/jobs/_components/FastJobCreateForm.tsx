'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  Briefcase, Box, Layers, Scissors, User,
  Calendar, CheckCircle2, AlertCircle, Loader2,
  ArrowLeft, ArrowRight, Printer, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { createFastToolingJobAction } from '@/app/actions/fast-tooling-job'

type CompanyOption = { company_id: string; company_name: string; company_code: string }
type RackLayerOption = { id: string; layer_code: string; rack_code: string }
type EmployeeOption = { employee_id: string; employee_name: string }
type ExistingRevision = {
  revision_id: string
  design_code: string
  cutline_length: number | null
  cutline_width: number | null
  corner_r: string | null
  chamfer_c: string | null
  plastic_type_designed: string | null
}

export function FastJobCreateForm() {
  const t = useTranslations('FastJobCreate')
  const router = useRouter()
  const supabase = createClient()

  // References
  const [loadingRefs, setLoadingRefs] = useState(true)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [rackLayers, setRackLayers] = useState<RackLayerOption[]>([])
  const [employees, setEmployees] = useState<EmployeeOption[]>([])

  // Form State
  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('')
  const [companyId, setCompanyId] = useState('')

  // Revision State
  const [existingRevisions, setExistingRevisions] = useState<ExistingRevision[]>([])
  const [revisionMode, setRevisionMode] = useState<'new' | 'reuse'>('new')
  const [selectedRevisionId, setSelectedRevisionId] = useState('')

  // New Specs
  const [cutlineLength, setCutlineLength] = useState('')
  const [cutlineWidth, setCutlineWidth] = useState('')
  const [cornerR, setCornerR] = useState('')
  const [chamferC, setChamferC] = useState('')
  const [cavityCount, setCavityCount] = useState('1')
  const [plasticType, setPlasticType] = useState('')

  // Equipment & Location
  const [rackLayerId, setRackLayerId] = useState('')
  const [attachCutter, setAttachCutter] = useState(false)
  const [cutterCode, setCutterCode] = useState('')

  // Job
  const [jobName, setJobName] = useState('')
  const [moldDeadline, setMoldDeadline] = useState('')
  const [shipDate, setShipDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')

  // Execution State
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1. Fetch Reference Data
  useEffect(() => {
    async function loadRefs() {
      setLoadingRefs(true)
      try {
        const [compRes, rackRes, empRes] = await Promise.all([
          supabase.from('companies').select('company_id, company_name, company_code').order('company_code'),
          supabase.from('rack_layers').select('id, layer_code, racks(rack_code)').order('layer_code'),
          supabase.from('employees').select('employee_id, employee_name').eq('is_active', true).order('employee_name'),
        ])

        if (compRes.data) {
          setCompanies(compRes.data as CompanyOption[])
        }
        if (rackRes.data) {
          const flatLayers: RackLayerOption[] = rackRes.data.map((r: any) => ({
            id: r.id,
            layer_code: r.layer_code,
            rack_code: r.racks?.rack_code || '',
          }))
          setRackLayers(flatLayers)
        }
        if (empRes.data) {
          setEmployees(empRes.data as EmployeeOption[])
        }
      } catch (err) {
        console.error('Failed to load form references:', err)
      } finally {
        setLoadingRefs(false)
      }
    }
    loadRefs()
  }, [])

  // 2. Auto-fetch Existing Revisions when Product Code changes
  const checkExistingProduct = useCallback(async (code: string) => {
    const clean = code.trim().toUpperCase()
    if (clean.length < 3) {
      setExistingRevisions([])
      setRevisionMode('new')
      return
    }

    const { data: prod } = await supabase
      .from('products')
      .select('product_id, product_name_internal, company_id, design_revisions(revision_id, design_code, cutline_length, cutline_width, corner_r, chamfer_c, plastic_type_designed)')
      .eq('product_code', clean)
      .maybeSingle()

    if (prod) {
      if (prod.product_name_internal && !productName) {
        setProductName(prod.product_name_internal)
      }
      if (prod.company_id && !companyId) {
        setCompanyId(prod.company_id)
      }
      const revs = (prod.design_revisions || []) as ExistingRevision[]
      setExistingRevisions(revs)
      if (revs.length > 0) {
        setRevisionMode('reuse')
        setSelectedRevisionId(revs[0].revision_id)
      }
    } else {
      setExistingRevisions([])
      setRevisionMode('new')
    }
  }, [productName, companyId])

  const handleProductCodeBlur = () => {
    if (productCode) {
      checkExistingProduct(productCode)
      if (!jobName) {
        setJobName(`${productCode.trim().toUpperCase()} 金型製作`)
      }
    }
  }

  // 3. Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)

    const result = await createFastToolingJobAction({
      product_code: productCode,
      product_name_internal: productName || null,
      company_id: companyId,
      reuse_revision: revisionMode === 'reuse',
      selected_revision_id: revisionMode === 'reuse' ? selectedRevisionId : null,
      cutline_length: revisionMode === 'new' && cutlineLength ? parseFloat(cutlineLength) : null,
      cutline_width: revisionMode === 'new' && cutlineWidth ? parseFloat(cutlineWidth) : null,
      corner_r: cornerR || null,
      chamfer_c: chamferC || null,
      cavity_count: cavityCount ? parseInt(cavityCount, 10) : null,
      plastic_type_designed: plasticType || null,
      rack_layer_id: rackLayerId,
      attach_cutter: attachCutter,
      cutter_code: attachCutter ? cutterCode : null,
      job_name: jobName,
      mold_deadline: moldDeadline,
      ship_date: shipDate || null,
      assigned_to: assignedTo || null,
    })

    if (!result.success) {
      setErrorMessage(result.error)
      setSubmitting(false)
      return
    }

    // Success -> redirect to Job Detail
    router.push(`/equipment/jobs/${result.job_id}`)
  }

  if (loadingRefs) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 10 }}>
        <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent)' }} />
        <span>Loading references...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/equipment/jobs" className="btn btn-secondary" style={{ padding: '6px 12px' }}>
            <ArrowLeft size={16} />
            <span>{t('cancel')}</span>
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('title')}
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="card-flat" style={{ padding: '12px 16px', background: 'var(--status-error-bg, #fee2e2)', border: '1px solid var(--status-error, #ef4444)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={18} style={{ color: 'var(--status-error, #ef4444)' }} />
          <span style={{ fontSize: 13, color: 'var(--status-error, #b91c1c)', fontWeight: 600 }}>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Product & Customer */}
      <div className="card-flat" style={{ padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
          <Box size={18} />
          <span>{t('secProduct')}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('productCode')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder={t('productCodePlaceholder')}
              value={productCode}
              onChange={e => setProductCode(e.target.value)}
              onBlur={handleProductCodeBlur}
              style={{ width: '100%', fontFamily: 'monospace', fontWeight: 700 }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('productName')}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={t('productNamePlaceholder')}
              value={productName}
              onChange={e => setProductName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('company')} <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              required
              className="form-select"
              value={companyId}
              onChange={e => setCompanyId(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">{t('companyPlaceholder')}</option>
              {companies.map(c => (
                <option key={c.company_id} value={c.company_id}>
                  [{c.company_code}] {c.company_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Design Specs & Location */}
      <div className="card-flat" style={{ padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
          <Layers size={18} />
          <span>{t('secDesign')}</span>
        </div>

        {/* Radio: Reuse vs New Revision */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface-2)', borderRadius: 6 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', fontWeight: revisionMode === 'reuse' ? 700 : 400 }}>
            <input
              type="radio"
              name="revisionMode"
              value="reuse"
              checked={revisionMode === 'reuse'}
              disabled={existingRevisions.length === 0}
              onChange={() => setRevisionMode('reuse')}
            />
            <span>{t('reuseRevision')} ({existingRevisions.length})</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', fontWeight: revisionMode === 'new' ? 700 : 400 }}>
            <input
              type="radio"
              name="revisionMode"
              value="new"
              checked={revisionMode === 'new'}
              onChange={() => setRevisionMode('new')}
            />
            <span>{t('createNewRevision')}</span>
          </label>
        </div>

        {revisionMode === 'reuse' && existingRevisions.length > 0 ? (
          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('selectRevision')} <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              className="form-select"
              value={selectedRevisionId}
              onChange={e => setSelectedRevisionId(e.target.value)}
              style={{ width: '100%', fontFamily: 'monospace' }}
            >
              {existingRevisions.map(r => (
                <option key={r.revision_id} value={r.revision_id}>
                  {r.design_code} — {r.cutline_length}×{r.cutline_width}mm ({r.plastic_type_designed || '—'})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {t('cutlineL')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required={revisionMode === 'new'}
                className="form-input"
                placeholder="275.0"
                value={cutlineLength}
                onChange={e => setCutlineLength(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {t('cutlineW')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required={revisionMode === 'new'}
                className="form-input"
                placeholder="275.0"
                value={cutlineWidth}
                onChange={e => setCutlineWidth(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {t('cornerR')}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="10R"
                value={cornerR}
                onChange={e => setCornerR(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {t('chamferC')}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="8C"
                value={chamferC}
                onChange={e => setChamferC(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {t('cavityCount')}
              </label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={cavityCount}
                onChange={e => setCavityCount(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {t('plasticType')}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="A-PET 0.5t"
                value={plasticType}
                onChange={e => setPlasticType(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Rack Layer Selector */}
        <div style={{ marginTop: 6 }}>
          <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
            {t('rackLayer')} <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            required
            className="form-select"
            value={rackLayerId}
            onChange={e => setRackLayerId(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">{t('rackLayerPlaceholder')}</option>
            {rackLayers.map(l => (
              <option key={l.id} value={l.id}>
                {l.rack_code ? `[Kệ ${l.rack_code}] ` : ''}{l.layer_code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION 3: Optional Cutter */}
      <div className="card-flat" style={{ padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
            <Scissors size={18} />
            <span>{t('secCutter')}</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={attachCutter}
              onChange={e => setAttachCutter(e.target.checked)}
            />
            <span>{t('attachCutter')}</span>
          </label>
        </div>

        {attachCutter && (
          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('cutterCode')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              required={attachCutter}
              className="form-input"
              placeholder={t('cutterCodePlaceholder')}
              value={cutterCode}
              onChange={e => setCutterCode(e.target.value)}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>
        )}
      </div>

      {/* SECTION 4: Job & Assignment */}
      <div className="card-flat" style={{ padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
          <Briefcase size={18} />
          <span>{t('secJob')}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('jobName')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder={t('jobNamePlaceholder')}
              value={jobName}
              onChange={e => setJobName(e.target.value)}
              style={{ width: '100%', fontWeight: 600 }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('moldDeadline')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              required
              className="form-input"
              value={moldDeadline}
              onChange={e => setMoldDeadline(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('shipDate')}
            </label>
            <input
              type="date"
              className="form-input"
              value={shipDate}
              onChange={e => setShipDate(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {t('assignedTo')}
            </label>
            <select
              className="form-select"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">{t('assignedToPlaceholder')}</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <Link href="/equipment/jobs" className="btn btn-secondary">
          {t('cancel')}
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', fontSize: 14, fontWeight: 700 }}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>{t('submitting')}</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>{t('submitButton')}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
