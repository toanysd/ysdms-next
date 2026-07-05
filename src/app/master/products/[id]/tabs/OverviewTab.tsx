import type { ProductDetailData, Company } from '../page'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, PenTool, LayoutTemplate } from 'lucide-react'

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

const STATUS_LABELS: Record<string, { ja: string; vi: string }> = {
  ACTIVE: { ja: '有効', vi: 'Hoạt động' },
  MAINTENANCE: { ja: 'メンテ中', vi: 'Bảo trì' },
  DISPOSED: { ja: '廃止', vi: 'Ngừng' },
}

const DESIGN_STATUS_CONFIG: Record<string, { label: string; labelVi: string; badge: string }> = {
  DRAFT:      { label: '下書き',   labelVi: 'Nháp',       badge: 'badge badge--warning' },
  SUBMITTED:  { label: '提出済',   labelVi: 'Đã gửi',     badge: 'badge badge--info' },
  RELEASED:   { label: 'リリース', labelVi: 'Đã phát hành', badge: 'badge badge--success' },
  APPROVED:   { label: '承認済',   labelVi: 'Đã duyệt',   badge: 'badge badge--success' },
  REJECTED:   { label: '却下',     labelVi: 'Từ chối',     badge: 'badge badge--error' },
  SUPERSEDED: { label: '旧版',     labelVi: 'Đã thay thế', badge: 'badge badge--neutral' },
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
                基本情報 <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">Thông tin cơ bản</span>
              </h3>
              <div className="form-grid-2 gap-3">
                <ReadOnlyField label="製品コード" sub="Mã SP" value={product.product_code} />
                <ReadOnlyField label="製品名" sub="Tên SP" value={product.product_name} />
                <ReadOnlyField label="得意先" sub="Khách hàng" value={
                  product.companies ? (
                    <Link href={`/master/customers/${product.companies.company_id}`} className="text-[var(--accent)] hover:underline font-bold transition-colors">
                      {product.companies.company_code} — {product.companies.company_name}
                    </Link>
                  ) : ''
                } />
                <ReadOnlyField label="顧客製品名" sub="Tên SP khách hàng" value={product.customer_product_name} />
              </div>
            </div>

            <div className="card-flat">
              <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                梱包仕様 <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">Thông số đóng gói</span>
              </h3>
              <div className="form-grid-3 gap-3">
                <ReadOnlyField label="ポケット数" sub="Số pocket" value={product.pocket_count} />
                <ReadOnlyField label="箱入数" sub="Số lượng/hộp" value={product.pieces_per_box} />
                <ReadOnlyField label="箱仕様" sub="Quy cách hộp" value={product.box_spec} />
              </div>
            </div>

            {uniquePlastics.length > 0 && (
              <div className="card-flat">
                <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                  プラスチック仕様 <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">Thông số nhựa (Từ thiết kế)</span>
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
                  備考 <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">Ghi chú</span>
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
              <FieldGroup label="製品コード" sub="Mã SP" required>
                <input
                  type="text"
                  value={formData.product_code || ''}
                  onChange={e => setFormData(f => ({ ...f, product_code: e.target.value.toUpperCase() }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace', fontWeight: 700 }}
                />
              </FieldGroup>
              
              <FieldGroup label="製品名" sub="Tên SP">
                <input
                  type="text"
                  value={formData.product_name || ''}
                  onChange={e => setFormData(f => ({ ...f, product_name: e.target.value }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'var(--font-jp)' }}
                />
              </FieldGroup>

              <FieldGroup label="得意先" sub="Khách hàng" required>
                <SearchableSelect
                  options={customerCompanies.map(c => ({
                    value: c.company_id,
                    label: `${c.company_code} — ${c.company_name}`
                  }))}
                  value={formData.company_id || null}
                  onChange={val => setFormData(f => ({ ...f, company_id: val || '' }))}
                />
              </FieldGroup>

              <FieldGroup label="顧客製品名" sub="Tên SP khách hàng">
                <input
                  type="text"
                  value={formData.customer_product_name || ''}
                  onChange={e => setFormData(f => ({ ...f, customer_product_name: e.target.value || null }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace' }}
                />
              </FieldGroup>

              <FieldGroup label="状態" sub="Trạng thái" required>
                <select
                  value={formData.product_status || 'ACTIVE'}
                  onChange={e => setFormData(f => ({ ...f, product_status: e.target.value as any }))}
                  className="form-input w-full"
                >
                  {Object.keys(STATUS_LABELS).map(k => (
                    <option key={k} value={k}>{STATUS_LABELS[k].ja} / {STATUS_LABELS[k].vi}</option>
                  ))}
                </select>
              </FieldGroup>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

            <p className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-jp)' }}>
              梱包仕様 <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Thông số đóng gói</span>
            </p>
            <div className="form-grid-3 gap-3">
              <FieldGroup label="ポケット数" sub="Số pocket">
                <input
                  type="number"
                  value={formData.pocket_count ?? ''}
                  onChange={e => setFormData(f => ({ ...f, pocket_count: e.target.value ? Number(e.target.value) : null }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace' }}
                />
              </FieldGroup>

              <FieldGroup label="箱入数" sub="Số lượng/hộp">
                <input
                  type="number"
                  value={formData.pieces_per_box ?? ''}
                  onChange={e => setFormData(f => ({ ...f, pieces_per_box: e.target.value ? Number(e.target.value) : null }))}
                  className="form-input w-full"
                  style={{ fontFamily: 'monospace' }}
                />
              </FieldGroup>

              <FieldGroup label="箱仕様" sub="Quy cách hộp">
                <input
                  type="text"
                  value={formData.box_spec || ''}
                  onChange={e => setFormData(f => ({ ...f, box_spec: e.target.value || null }))}
                  className="form-input w-full"
                />
              </FieldGroup>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

            <FieldGroup label="備考" sub="Ghi chú">
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
              設計一覧 <span className="text-[10px] text-[var(--text-muted)] font-normal">Phiên bản thiết kế</span>
            </h3>
            <Link 
              href={`/engineering/designs/${product.product_id}`}
              className="text-[10px] flex items-center gap-1 font-bold text-accent hover:underline"
            >
              詳細 <ExternalLink size={10} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-2">
            {sortedDesigns.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">
                設計版がありません (Không có phiên bản thiết kế)
              </div>
            ) : (
              sortedDesigns.map(rev => {
                const status = (rev.status === 'APPROVED' ? 'RELEASED' : (rev.status || 'DRAFT'))
                const cfg = DESIGN_STATUS_CONFIG[status] || DESIGN_STATUS_CONFIG.DRAFT
                return (
                  <Link
                    key={rev.revision_id}
                    href={`/engineering/designs/revisions/${rev.revision_id}`}
                    title={`Mở chi tiết thiết kế: ${rev.design_code}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                  >
                    <div>
                      <div className="text-[12px] font-bold font-mono text-[var(--accent)] hover:underline">
                        Mở thiết kế: {rev.design_code}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Rev {rev.revision_number} • {rev.design_date || '—'}
                      </div>
                    </div>
                    <span className={`${cfg.badge} text-[9px]`}>
                      {cfg.label}
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
