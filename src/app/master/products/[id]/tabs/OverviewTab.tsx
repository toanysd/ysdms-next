import type { ProductDetailData, Company, DesignRevisionItem } from '../page'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, PenTool, LayoutTemplate, Layers, Wrench, Sparkles, GitCompare, Scissors, ShieldCheck, CheckCircle2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CreateDesignRevisionModal } from '@/components/engineering/CreateDesignRevisionModal'

function FieldGroup({
  label, sub, required, children,
}: {
  label: string
  sub: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold" style={{ color: 'var(--text-secondary)', marginBottom: 3, fontFamily: 'var(--font-jp)' }}>
        {label}
        {required && <span style={{ color: 'var(--status-error)', marginLeft: 2 }}>*</span>}
        <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4, fontSize: 10 }}>{sub}</span>
      </label>
      {children}
    </div>
  )
}

function ReadOnlyField({ label, sub, value, emptyText = '—', highlighted = false }: { label: string; sub: string; value: React.ReactNode; emptyText?: string; highlighted?: boolean }) {
  return (
    <div style={{
      padding: '8px 12px',
      background: highlighted ? 'var(--tint-orange-bg, #fff7ed)' : 'var(--bg-surface-2)',
      borderRadius: 'var(--radius-sm)',
      border: highlighted ? '1px solid #fdba74' : '1px solid var(--border-subtle)',
      transition: 'all 0.2s ease'
    }}>
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold" style={{ color: highlighted ? '#c2410c' : 'var(--text-muted)', marginBottom: 2, fontFamily: 'var(--font-jp)' }}>
          {label} <span style={{ fontWeight: 400, marginLeft: 4 }}>{sub}</span>
        </label>
        {highlighted && (
          <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-[#ffedd5] text-[#c2410c]">
            MODIFIED
          </span>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: highlighted ? 700 : 500, color: value ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-main)' }}>
        {value || emptyText}
      </div>
    </div>
  )
}

const STATUS_LABELS: Record<string, { ja: string }> = {
  ACTIVE: { ja: '有効' },
  MAINTENANCE: { ja: 'メンテ中' },
  DISPOSED: { ja: '廃止' },
}

const DESIGN_STATUS_CONFIG: Record<string, { tKey: string; badge: string }> = {
  DRAFT:      { tKey: 'DRAFT',       badge: 'badge badge--warning' },
  SUBMITTED:  { tKey: 'SUBMITTED',     badge: 'badge badge--info' },
  RELEASED:   { tKey: 'RELEASED', badge: 'badge badge--success' },
  APPROVED:   { tKey: 'APPROVED',   badge: 'badge badge--success' },
  REJECTED:   { tKey: 'REJECTED',     badge: 'badge badge--error' },
  SUPERSEDED: { tKey: 'SUPERSEDED', badge: 'badge badge--neutral' },
}

export function OverviewTab({
  product,
  isEditing,
  formData,
  setFormData,
  companies,
  onRefresh,
}: {
  product: ProductDetailData
  isEditing: boolean
  formData: Partial<ProductDetailData>
  setFormData: React.Dispatch<React.SetStateAction<Partial<ProductDetailData>>>
  companies: Company[]
  onRefresh?: () => void
}) {
  const t = useTranslations('Master.Products.Overview')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const getProductStatusLabel = (key: string) => {
    switch (key) {
      case 'ACTIVE': return t('statusLabels.ACTIVE')
      case 'MAINTENANCE': return t('statusLabels.MAINTENANCE')
      case 'DISPOSED': return t('statusLabels.DISPOSED')
      default: return key
    }
  }

  const getDesignStatusLabel = (key: string) => {
    switch (key) {
      case 'DRAFT': return t('designStatus.DRAFT')
      case 'SUBMITTED': return t('designStatus.SUBMITTED')
      case 'RELEASED': return t('designStatus.RELEASED')
      case 'APPROVED': return t('designStatus.APPROVED')
      case 'REJECTED': return t('designStatus.REJECTED')
      case 'SUPERSEDED': return t('designStatus.SUPERSEDED')
      default: return key
    }
  }

  const customerCompanies = useMemo(() => {
    return companies.filter(c => {
      if (!c.company_type) return true
      if (Array.isArray(c.company_type)) {
        return c.company_type.some(t => t.toUpperCase().includes('CUSTOMER'))
      }
      return String(c.company_type).toUpperCase().includes('CUSTOMER')
    })
  }, [companies])

  // Sort design revisions by revision number descending
  const sortedDesigns = useMemo(() => {
    if (!product.design_revisions) return []
    return [...product.design_revisions].sort((a, b) => (b.revision_number || 0) - (a.revision_number || 0))
  }, [product.design_revisions])

  // Selected revision state
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(null)

  // Determine active revision
  const activeRevision = useMemo(() => {
    if (!sortedDesigns || sortedDesigns.length === 0) return null
    if (selectedRevisionId) {
      const found = sortedDesigns.find(d => d.revision_id === selectedRevisionId)
      if (found) return found
    }
    // Default to latest approved or top revision
    return sortedDesigns.find(d => d.status === 'APPROVED' || d.status === 'RELEASED') || sortedDesigns[0]
  }, [sortedDesigns, selectedRevisionId])

  // Index of active revision in sorted list
  const activeRevisionIndex = useMemo(() => {
    if (!activeRevision) return -1
    return sortedDesigns.findIndex(d => d.revision_id === activeRevision.revision_id)
  }, [sortedDesigns, activeRevision])

  // Previous revision for diff comparison
  const prevRevision = useMemo(() => {
    if (activeRevisionIndex < 0 || activeRevisionIndex >= sortedDesigns.length - 1) return null
    return sortedDesigns[activeRevisionIndex + 1]
  }, [sortedDesigns, activeRevisionIndex])

  // Compute diffs between active and prev revision
  const diffs = useMemo(() => {
    if (!activeRevision || !prevRevision) return new Set<string>()
    const changed = new Set<string>()

    if (activeRevision.design_length !== prevRevision.design_length || activeRevision.design_width !== prevRevision.design_width || activeRevision.design_height !== prevRevision.design_height) changed.add('moldDimensions')
    if (activeRevision.cutline_length !== prevRevision.cutline_length || activeRevision.cutline_width !== prevRevision.cutline_width) changed.add('cutlineDimensions')
    if (activeRevision.cavity_count !== prevRevision.cavity_count) changed.add('cavityCount')
    if (activeRevision.pitch_mm !== prevRevision.pitch_mm || activeRevision.cavity_pitch_mm !== prevRevision.cavity_pitch_mm) changed.add('pitch')
    if (activeRevision.plug_type !== prevRevision.plug_type || activeRevision.has_plug !== prevRevision.has_plug) changed.add('plugSpec')
    if (activeRevision.has_separate_cutter !== prevRevision.has_separate_cutter) changed.add('cutterSpec')
    if (activeRevision.plastic_type_designed !== prevRevision.plastic_type_designed) changed.add('plasticSpec')

    return changed
  }, [activeRevision, prevRevision])

  // Linked Physical Molds for active revision
  const linkedPhysicalMolds = useMemo(() => {
    if (!activeRevision || !activeRevision.mold_revisions) return []
    const molds: Array<{ physical_mold_id: string; system_code: string; display_name: string; physical_stamp: string | null; usage_status: string | null; piece_count: number | null }> = []
    activeRevision.mold_revisions.forEach(mr => {
      if (mr.physical_molds && Array.isArray(mr.physical_molds)) {
        mr.physical_molds.forEach(pm => molds.push(pm))
      }
    })
    return molds
  }, [activeRevision])

  // Linked Cutters for active revision
  const linkedCutters = useMemo(() => {
    if (!activeRevision || !activeRevision.cutters) return []
    return activeRevision.cutters
  }, [activeRevision])

  const uniquePlastics = useMemo(() => {
    if (!sortedDesigns || sortedDesigns.length === 0) return []
    const plasticsMap = new Map<string, { label: string; designCodes: string[] }>()
    sortedDesigns.forEach(rev => {
      if (rev.plastic_master) {
        const p = rev.plastic_master
        const label = `${p.plastic_code || ''} ${p.thickness_mm ? p.thickness_mm + 'mm' : ''} ${p.color_name_normalized || ''}`.trim()
        if (label) {
          if (!plasticsMap.has(label)) {
            plasticsMap.set(label, { label, designCodes: [] })
          }
          if (!plasticsMap.get(label)!.designCodes.includes(rev.design_code)) {
            plasticsMap.get(label)!.designCodes.push(rev.design_code)
          }
        }
      }
    })
    return Array.from(plasticsMap.values())
  }, [sortedDesigns])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      {/* ── Main Content (Left: 2 Cols) ── */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {!isEditing ? (
          <>
            {/* Basic Info Card */}
            <div className="card-flat">
              <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                {t('basicInfo')} <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">{t('basicInfoSub')}</span>
              </h3>
              <div className="form-grid-2 gap-3">
                <ReadOnlyField label={t('productCode')} sub={t('productCodeSub')} value={product.product_code} />
                <ReadOnlyField label={t('productName')} sub={t('productNameSub')} value={product.product_name} />
                <ReadOnlyField label={t('customer')} sub={t('customerSub')} value={
                  product.companies ? (
                    <Link href={`/master/customers/${product.companies.company_id}`} className="text-[var(--accent)] hover:underline font-bold transition-colors">
                      {product.companies.company_code} — {product.companies.company_name}
                    </Link>
                  ) : ''
                } />
                <ReadOnlyField label={t('customerProductName')} sub={t('customerProductNameSub')} value={product.customer_product_name} />
              </div>
            </div>

            {/* Selected Revision Technical Specs Card */}
            {activeRevision ? (
              <div className="card-flat border-l-4 border-l-[var(--accent)]">
                <div className="flex items-center justify-between mb-3 border-b border-[var(--border-subtle)] pb-2">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-accent" />
                    <h3 className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                      {t('techSpec')} — <span className="font-mono text-accent font-bold">{activeRevision.design_code} (Rev {activeRevision.revision_number})</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {diffs.size > 0 && prevRevision && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <GitCompare size={11} /> {t('diffNotice')} vs Rev {prevRevision.revision_number} ({diffs.size})
                      </span>
                    )}
                    <Link 
                      href={`/engineering/designs/revisions/${activeRevision.revision_id}`}
                      className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      {t('designDetailBtn')} <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>

                {/* Change Summary banner if available */}
                {activeRevision.change_summary && (
                  <div className="mb-3 p-2.5 rounded bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[12px]">
                    <span className="font-bold text-[var(--accent)] mr-2">{t('changeSummary')}:</span>
                    <span className="text-[var(--text-primary)]">{activeRevision.change_summary}</span>
                  </div>
                )}

                {/* Spec Fields Grid */}
                <div className="form-grid-3 gap-3">
                  <ReadOnlyField 
                    label={t('moldDimensions')} 
                    sub="L×W×H (mm)" 
                    highlighted={diffs.has('moldDimensions')}
                    value={
                      activeRevision.design_length || activeRevision.design_width || activeRevision.design_height
                        ? `${activeRevision.design_length || '—'} × ${activeRevision.design_width || '—'} × ${activeRevision.design_height || '—'} mm`
                        : null
                    } 
                  />
                  <ReadOnlyField 
                    label={t('cutlineDimensions')} 
                    sub="L×W (mm)" 
                    highlighted={diffs.has('cutlineDimensions')}
                    value={
                      activeRevision.cutline_length || activeRevision.cutline_width
                        ? `${activeRevision.cutline_length || '—'} × ${activeRevision.cutline_width || '—'} mm`
                        : null
                    } 
                  />
                  <ReadOnlyField 
                    label={t('cavityPitch')} 
                    sub="Pocket / Feed Pitch" 
                    highlighted={diffs.has('cavityCount') || diffs.has('pitch')}
                    value={
                      `${(activeRevision.cavity_count || activeRevision.pocket_numbers) ? (activeRevision.cavity_count || activeRevision.pocket_numbers) + ' Pocket' : '—'} / ${activeRevision.pitch_mm ? activeRevision.pitch_mm + ' mm' : (activeRevision.cavity_pitch_mm ? activeRevision.cavity_pitch_mm + ' mm' : (activeRevision.machine_feed_pitch_mm ? activeRevision.machine_feed_pitch_mm + ' mm' : '—'))}`
                    } 
                  />
                  <ReadOnlyField 
                    label={t('plugSpec')} 
                    sub="Plug Assist" 
                    highlighted={diffs.has('plugSpec')}
                    value={activeRevision.has_plug ? (activeRevision.plug_type || 'あり') : 'なし'} 
                  />
                  <ReadOnlyField 
                    label={t('cutterSpec')} 
                    sub="Separate Cutter" 
                    highlighted={diffs.has('cutterSpec')}
                    value={activeRevision.has_separate_cutter ? '別抜きカッターあり' : 'なし'} 
                  />
                  <ReadOnlyField 
                    label={t('plasticSpec')} 
                    sub="Designed Plastic" 
                    highlighted={diffs.has('plasticSpec')}
                    value={
                      activeRevision.plastic_master 
                        ? `${activeRevision.plastic_master.plastic_code || ''} ${activeRevision.plastic_master.thickness_mm ? activeRevision.plastic_master.thickness_mm + 'mm' : ''} ${activeRevision.plastic_master.color_name_normalized || ''}`.trim()
                        : (activeRevision.plastic_type_designed || null)
                    } 
                  />
                </div>
              </div>
            ) : (
              <div className="card-flat text-center p-6 text-[var(--text-muted)] text-[12px]">
                {t('selectRevisionPrompt')}
              </div>
            )}

            {/* Linked Equipment Section for Selected Revision */}
            <div className="card-flat">
              <h3 className="text-[13px] font-bold mb-3 flex items-center justify-between" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                <span className="flex items-center gap-2">
                  <Wrench size={15} className="text-accent" />
                  {t('linkedEquipment')}
                  <span className="text-[11px] font-normal text-[var(--text-muted)]">{t('linkedEquipmentSub')}</span>
                </span>
                {activeRevision && (
                  <span className="text-[11px] font-mono font-bold text-[var(--accent)]">
                    {activeRevision.design_code}
                  </span>
                )}
              </h3>

              {linkedPhysicalMolds.length === 0 && linkedCutters.length === 0 ? (
                <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">
                  {t('noEquipment')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Physical Molds */}
                  {linkedPhysicalMolds.map(mold => (
                    <div key={mold.physical_mold_id} className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--tint-teal-bg)] text-[var(--accent)] flex items-center gap-1">
                          <Layers size={10} /> {t('physicalMold')}
                        </span>
                        <span className="badge badge--success text-[9px] font-bold">
                          {t('directEquipment')}
                        </span>
                      </div>
                      <div className="text-[13px] font-bold font-mono text-[var(--text-primary)]">
                        {mold.display_name || mold.system_code}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                        <span>Code: {mold.system_code}</span>
                        <span>Stamp: {mold.physical_stamp || '—'}</span>
                      </div>
                    </div>
                  ))}

                  {/* Cutters */}
                  {linkedCutters.map(cutter => (
                    <div key={cutter.cutter_id} className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--tint-blue-bg)] text-blue-700 flex items-center gap-1">
                          <Scissors size={10} /> {t('cutterDie')}
                        </span>
                        <span className="badge badge--info text-[9px] font-bold">
                          {cutter.cutter_type || t('directEquipment')}
                        </span>
                      </div>
                      <div className="text-[13px] font-bold font-mono text-[var(--text-primary)]">
                        {cutter.cutter_name || cutter.cutter_no}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                        <span>No: {cutter.cutter_no}</span>
                        <span>Status: {cutter.usage_status || 'NORMAL'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Package & Plastic Specs */}
            <div className="card-flat">
              <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                {t('packSpec')} <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">{t('packSpecSub')}</span>
              </h3>
              <div className="form-grid-3 gap-3">
                <ReadOnlyField label={t('pocketCount')} sub={t('pocketCountSub')} value={product.pocket_count || activeRevision?.pocket_numbers || activeRevision?.cavity_count} />
                <ReadOnlyField label={t('piecesPerBox')} sub={t('piecesPerBoxSub')} value={product.pieces_per_box} />
                <ReadOnlyField label={t('boxSpec')} sub={t('boxSpecSub')} value={product.box_spec} />
              </div>
            </div>

            {product.notes && (
              <div className="card-flat">
                <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                  {t('notes')} <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">{t('notesSub')}</span>
                </h3>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {product.notes}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Editing Form */
          <div className="card-flat flex flex-col gap-4">
            <div className="form-grid-2 gap-3">
              <FieldGroup label={t('productCode')} sub={t('productCodeSub')} required>
                <input
                  type="text"
                  value={formData.product_code || ''}
                  onChange={e => setFormData(f => ({ ...f, product_code: e.target.value.toUpperCase() }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace', fontWeight: 700 }}
                />
              </FieldGroup>
              
              <FieldGroup label={t('productName')} sub={t('productNameSub')}>
                <input
                  type="text"
                  value={formData.product_name || ''}
                  onChange={e => setFormData(f => ({ ...f, product_name: e.target.value }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'var(--font-jp)' }}
                />
              </FieldGroup>

              <FieldGroup label={t('customer')} sub={t('customerSub')} required>
                <SearchableSelect
                  options={customerCompanies.map(c => ({
                    value: c.company_id,
                    label: `${c.company_code} — ${c.company_name}`
                  }))}
                  value={formData.company_id || null}
                  onChange={val => setFormData(f => ({ ...f, company_id: val || '' }))}
                />
              </FieldGroup>

              <FieldGroup label={t('customerProductName')} sub={t('customerProductNameSub')}>
                <input
                  type="text"
                  value={formData.customer_product_name || ''}
                  onChange={e => setFormData(f => ({ ...f, customer_product_name: e.target.value || null }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace' }}
                />
              </FieldGroup>

              <FieldGroup label={t('status')} sub={t('statusSub')} required>
                <select
                  value={formData.product_status || 'ACTIVE'}
                  onChange={e => setFormData(f => ({ ...f, product_status: e.target.value as any }))}
                  className="form-input w-full"
                >
                  {Object.keys(STATUS_LABELS).map(k => (
                    <option key={k} value={k}>{getProductStatusLabel(k)}</option>
                  ))}
                </select>
              </FieldGroup>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

            <p className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-jp)' }}>
              {t('packSpec')} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{t('packSpecSub')}</span>
            </p>
            <div className="form-grid-3 gap-3">
              <FieldGroup label={t('pocketCount')} sub={t('pocketCountSub')}>
                <input
                  type="number"
                  value={formData.pocket_count ?? ''}
                  onChange={e => setFormData(f => ({ ...f, pocket_count: e.target.value ? Number(e.target.value) : null }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace' }}
                />
              </FieldGroup>

              <FieldGroup label={t('piecesPerBox')} sub={t('piecesPerBoxSub')}>
                <input
                  type="number"
                  value={formData.pieces_per_box ?? ''}
                  onChange={e => setFormData(f => ({ ...f, pieces_per_box: e.target.value ? Number(e.target.value) : null }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace' }}
                />
              </FieldGroup>

              <FieldGroup label={t('boxSpec')} sub={t('boxSpecSub')}>
                <input
                  type="text"
                  value={formData.box_spec || ''}
                  onChange={e => setFormData(f => ({ ...f, box_spec: e.target.value || null }))}
                  className="form-input w-full"
                />
              </FieldGroup>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

            <FieldGroup label={t('notes')} sub={t('notesSub')}>
              <textarea
                value={formData.notes || ''}
                onChange={e => setFormData(f => ({ ...f, notes: e.target.value || null }))}
                rows={3}
                className="form-textarea w-full"
              />
            </FieldGroup>
          </div>
        )}
      </div>

      {/* ── Right Sidebar: Interactive Design Revision Selector ── */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="card-flat">
          <div className="flex items-center justify-between mb-3 border-b border-[var(--border-default)] pb-2">
            <h3 className="text-[12px] font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              <PenTool size={14} className="text-accent" />
              {t('designList')} <span className="text-[10px] text-[var(--text-muted)] font-normal">({sortedDesigns.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="text-[10px] font-bold text-white bg-[var(--accent)] hover:opacity-90 px-2 py-1 rounded flex items-center gap-1 transition-all shadow-sm"
                title="新規改訂作成 (Smart Clone)"
              >
                <Plus size={11} /> {t('addRevision')}
              </button>
              <Link 
                href={`/engineering/designs/${product.product_id}`}
                className="text-[10px] flex items-center gap-1 font-bold text-accent hover:underline"
              >
                {t('designDetailBtn')} <ExternalLink size={10} />
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {sortedDesigns.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">
                {t('noDesigns')}
              </div>
            ) : (
              sortedDesigns.map(rev => {
                const isSelected = activeRevision?.revision_id === rev.revision_id
                const status = (rev.status === 'APPROVED' ? 'RELEASED' : (rev.status || 'DRAFT'))
                const cfg = DESIGN_STATUS_CONFIG[status] || DESIGN_STATUS_CONFIG.DRAFT
                return (
                  <div
                    key={rev.revision_id}
                    onClick={() => setSelectedRevisionId(rev.revision_id)}
                    className={`p-2.5 rounded cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--tint-teal-bg)] shadow-sm'
                        : 'border-[var(--border-subtle)] hover:bg-[var(--bg-surface-2)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold font-mono text-[var(--accent)]">
                          {rev.design_code}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-[var(--accent)] text-white flex items-center gap-0.5">
                            <CheckCircle2 size={9} /> {t('selectedBadge')}
                          </span>
                        )}
                      </div>
                      <span className={`${cfg.badge} text-[9px]`}>
                        {getDesignStatusLabel(cfg.tKey)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mt-1.5">
                      <span>Rev {rev.revision_number} • {rev.design_date || '—'}</span>
                      <Link 
                        href={`/engineering/designs/revisions/${rev.revision_id}`}
                        onClick={e => e.stopPropagation()}
                        className="text-accent hover:underline flex items-center gap-0.5"
                      >
                        {t('details')} <ExternalLink size={9} />
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Create Design Revision Modal (Smart Clone) */}
      <CreateDesignRevisionModal
        productId={product.product_id}
        productCode={product.product_code}
        companyId={product.company_id}
        existingRevisions={sortedDesigns}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          if (onRefresh) onRefresh()
          else window.location.reload()
        }}
      />
    </div>
  )
}

