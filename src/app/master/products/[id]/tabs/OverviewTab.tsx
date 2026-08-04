import type { ProductDetailData, Company } from '../page'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, PenTool, LayoutTemplate } from 'lucide-react'
import { useTranslations } from 'next-intl'

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

function ReadOnlyField({ label, sub, value, emptyText = '—' }: { label: string; sub: string; value: React.ReactNode; emptyText?: string }) {
  return (
    <div style={{ padding: '8px 12px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
      <label className="block text-[10px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 2, fontFamily: 'var(--font-jp)' }}>
        {label} <span style={{ fontWeight: 400, marginLeft: 4 }}>{sub}</span>
      </label>
      <div style={{ fontSize: 13, color: value ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-main)' }}>
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
}: {
  product: ProductDetailData
  isEditing: boolean
  formData: Partial<ProductDetailData>
  setFormData: React.Dispatch<React.SetStateAction<Partial<ProductDetailData>>>
  companies: Company[]
}) {
  const t = useTranslations('Master.Products.Overview')

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
      {/* ── Main Content (Left) ── */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {!isEditing ? (
          <>
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

            <div className="card-flat">
              <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                {t('packSpec')} <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">{t('packSpecSub')}</span>
              </h3>
              <div className="form-grid-3 gap-3">
                <ReadOnlyField label={t('pocketCount')} sub={t('pocketCountSub')} value={product.pocket_count} />
                <ReadOnlyField label={t('piecesPerBox')} sub={t('piecesPerBoxSub')} value={product.pieces_per_box} />
                <ReadOnlyField label={t('boxSpec')} sub={t('boxSpecSub')} value={product.box_spec} />
              </div>
            </div>

            {uniquePlastics.length > 0 && (
              <div className="card-flat">
                <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                  {t('plasticSpec')} <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">{t('plasticSpecSub')}</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {uniquePlastics.map(p => (
                    <div key={p.label} className="flex items-center gap-3 p-2 rounded bg-[var(--bg-surface-2)]">
                      <span className="font-mono text-[13px] font-bold text-[var(--accent)]">{p.label}</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {p.designCodes.map(code => (
                          <span key={code} className="text-[10px] bg-[var(--bg-surface)] border border-[var(--border-default)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

      {/* ── Related Data Sidebar (Right) ── */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="card-flat">
          <div className="flex items-center justify-between mb-3 border-b border-[var(--border-default)] pb-2">
            <h3 className="text-[12px] font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              <PenTool size={14} className="text-accent" />
              {t('designList')} <span className="text-[10px] text-[var(--text-muted)] font-normal">{t('designListSub')}</span>
            </h3>
            <Link 
              href={`/engineering/designs/${product.product_id}`}
              className="text-[10px] flex items-center gap-1 font-bold text-accent hover:underline"
            >
              {t('designDetailBtn')} <ExternalLink size={10} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-2">
            {sortedDesigns.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">
                {t('noDesigns')}
              </div>
            ) : (
              sortedDesigns.map(rev => {
                const status = (rev.status === 'APPROVED' ? 'RELEASED' : (rev.status || 'DRAFT'))
                const cfg = DESIGN_STATUS_CONFIG[status] || DESIGN_STATUS_CONFIG.DRAFT
                return (
                  <Link
                    key={rev.revision_id}
                    href={`/engineering/designs/revisions/${rev.revision_id}`}
                    title={`金型設計詳細: ${rev.design_code}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                  >
                    <div>
                      <div className="text-[12px] font-bold font-mono text-[var(--accent)] hover:underline">
                        {t('openDesign')} {rev.design_code}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Rev {rev.revision_number} • {rev.design_date || '—'}
                      </div>
                    </div>
                    <span className={`${cfg.badge} text-[9px]`}>
                      {getDesignStatusLabel(cfg.tKey)}
                    </span>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
