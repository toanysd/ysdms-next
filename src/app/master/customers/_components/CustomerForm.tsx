'use client'

import { useTranslations } from 'next-intl'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save, Loader2, X, Tag, Building2, Phone, Folder, FileText,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
export type CompanyFormData = {
  company_id?: string
  company_code: string
  company_name: string
  company_name_romaji: string
  company_type: string[]
  tel: string
  fax: string
  address: string
  order_folder_path: string
  cad_folder_path: string
  parent_company_id: string
  is_active: boolean
  notes: string
  legacy_id: string
}

// ── API call ──────────────────────────────────────────────────────────────────
async function saveCompany(data: CompanyFormData): Promise<{ success: boolean; error?: string }> {
  const isEdit = !!data.company_id
  const url = isEdit ? `/api/master/companies/${data.company_id}` : `/api/master/companies`
  const body = {
    company_code:        data.company_code.trim(),
    company_name:        data.company_name.trim(),
    company_name_romaji: data.company_name_romaji.trim() || null,
    company_type:        data.company_type,
    tel:                 data.tel.trim() || null,
    fax:                 data.fax.trim() || null,
    address:             data.address.trim() || null,
    order_folder_path:   data.order_folder_path.trim() || null,
    cad_folder_path:     data.cad_folder_path.trim() || null,
    parent_company_id:   data.parent_company_id || null,
    is_active:           data.is_active,
    notes:               data.notes.trim() || null,
    legacy_id:           data.legacy_id.trim() || null,
  }
  try {
    const res = await fetch(url, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json()
    if (!res.ok) return { success: false, error: json.error || `HTTP ${res.status}` }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ── Reusable Field atom ───────────────────────────────────────────────────────
function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="form-field">
      <div className="form-label font-bold text-[12px]" style={{ color: 'var(--text-muted)' }}>
        {label}
        {required && <span style={{ color: 'var(--status-error)', marginLeft: 2 }}>*</span>}
      </div>
      {children}
    </div>
  )
}

// ── TextInput atom ────────────────────────────────────────────────────────────
function TInput({
  value, onChange, placeholder, mono, readOnly, type = 'text',
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; mono?: boolean; readOnly?: boolean; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`form-input${mono ? ' mono font-mono font-bold text-[13px]' : ' text-[13px]'}`}
    />
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  icon: Icon, title, children,
}: {
  icon: React.ElementType; title: string; children: React.ReactNode
}) {
  return (
    <div className="form-section">
      <div className="form-section-header font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
        <Icon className="section-icon" style={{ color: 'var(--accent)' }} />
        {title}
      </div>
      <div className="form-section-body">
        {children}
      </div>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>
  parentCompanies?: { company_id: string; company_code: string; company_name: string }[]
  mode?: 'create' | 'edit' | 'view'
}

// ══════════════════════════════════════════════════════════════════════════════
// Main CompanyForm
// ══════════════════════════════════════════════════════════════════════════════
export function CompanyForm({ initialData, parentCompanies = [], mode = 'edit' }: CompanyFormProps) {
  const tCust = useTranslations('Customers')
  const tMaster = useTranslations('Master')
  const tCommon = useTranslations('Common')

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [editMode, setEditMode] = useState<boolean>(mode !== 'view')

  const companyTypes: { value: string; label: string }[] = [
    { value: 'CUSTOMER',      label: tCust('customer') },
    { value: 'VENDOR',        label: tCust('vendor') },
    { value: 'DELIVERY_SITE', label: tCust('deliverySite') },
    { value: 'KEEPER',        label: tMaster('noiLuuGiuKeeper') },
    { value: 'MAKER',         label: tMaster('loai') },
  ]

  const [data, setData] = useState<CompanyFormData>({
    company_id:          initialData?.company_id,
    company_code:        initialData?.company_code ?? '',
    company_name:        initialData?.company_name ?? '',
    company_name_romaji: initialData?.company_name_romaji ?? '',
    company_type:        initialData?.company_type ?? ['CUSTOMER'],
    tel:                 initialData?.tel ?? '',
    fax:                 initialData?.fax ?? '',
    address:             initialData?.address ?? '',
    order_folder_path:   initialData?.order_folder_path ?? '',
    cad_folder_path:     initialData?.cad_folder_path ?? '',
    parent_company_id:   initialData?.parent_company_id ?? '',
    is_active:           initialData?.is_active ?? true,
    notes:               initialData?.notes ?? '',
    legacy_id:           initialData?.legacy_id ?? '',
  })

  const set = (key: keyof CompanyFormData) => (val: any) => {
    setData(d => ({ ...d, [key]: val }))
    setSaved(false)
  }

  const toggleType = (tVal: string) => {
    setData(d => ({
      ...d,
      company_type: d.company_type.includes(tVal)
        ? d.company_type.filter(x => x !== tVal)
        : [...d.company_type, tVal],
    }))
    setSaved(false)
  }

  const handleSave = () => {
    if (!data.company_code.trim()) { setFormError(tCust('customerCode') + ' *'); return }
    if (!data.company_name.trim()) { setFormError(tCust('companyName') + ' *'); return }
    if (data.company_type.length === 0) { setFormError(tCust('type')); return }
    setFormError(null)
    startTransition(async () => {
      const result = await saveCompany(data)
      if (!result.success) {
        setFormError(result.error || tCommon('save') + ' Error')
      } else {
        setSaved(true)
        router.push('/master/customers')
        router.refresh()
      }
    })
  }

  const ro = !editMode

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 12, marginBottom: 4,
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {mode === 'view' && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="btn btn-secondary"
              style={{ fontSize: 12, height: 30, padding: '0 12px' }}
            >
              {editMode ? (
                <><X size={12} /> {tCommon('cancel')}</>
              ) : (
                <><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> {tCommon('edit')}</>
              )}
            </button>
          )}
        </div>

        {/* Active status toggle */}
        <label className={`active-toggle ${data.is_active ? 'active-toggle--on' : 'active-toggle--off'}`}>
          <input
            type="checkbox"
            checked={data.is_active}
            onChange={e => set('is_active')(e.target.checked)}
            disabled={ro}
          />
          <span style={{ fontSize: 11, fontWeight: 700 }}>
            {data.is_active ? tMaster('activeStatus') : tMaster('inactiveStatus')}
          </span>
        </label>
      </div>

      {/* ── Error callout ── */}
      {formError && (
        <div className="form-callout form-callout--error">
          <X size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          {formError}
        </div>
      )}
      {saved && (
        <div className="form-callout form-callout--success">
          ✓ {tCommon('save')}
        </div>
      )}

      {/* ── Scrollable form body ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>

        {/* 1. 基本情報 */}
        <Section icon={Tag} title={tMaster('machineMasterSub')}>
          <div className="form-grid-2">
            <Field label={tCust('customerCode')} required>
              <TInput
                value={data.company_code}
                onChange={set('company_code')}
                placeholder="VD: SMK-001"
                mono
                readOnly={ro || !!data.company_id}
              />
            </Field>
            <Field label={tCust('companyName')} required>
              <TInput value={data.company_name} onChange={set('company_name')} placeholder="山田製作所株式会社" readOnly={ro} />
            </Field>
            <Field label={tCust('companyNameRomaji')}>
              <TInput value={data.company_name_romaji} onChange={set('company_name_romaji')} placeholder="Yamada Seisakusho Co.,Ltd" readOnly={ro} />
            </Field>
            <Field label="Legacy ID">
              <TInput value={data.legacy_id} onChange={set('legacy_id')} placeholder="ID Access" mono readOnly={ro} />
            </Field>
          </div>
        </Section>

        {/* 2. 会社区分 */}
        <Section icon={Building2} title={tCust('type')}>
          <div className="type-chips flex flex-wrap gap-1.5">
            {companyTypes.map(t => {
              const active = data.company_type.includes(t.value)
              return (
                <button
                  key={t.value}
                  type="button"
                  disabled={ro}
                  onClick={() => toggleType(t.value)}
                  className={`type-chip${active ? ' type-chip--active' : ''} font-bold text-[11px] px-2.5 py-1 rounded cursor-pointer border`}
                  style={{
                    background: active ? 'var(--accent-light)' : 'var(--bg-surface-2)',
                    borderColor: active ? 'var(--accent)' : 'var(--border-default)',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* 3. 連絡先 */}
        <Section icon={Phone} title={tMaster('st')}>
          <div className="form-grid-2">
            <Field label={tCust('tel')}>
              <TInput value={data.tel} onChange={set('tel')} placeholder="054-123-4567" mono readOnly={ro} />
            </Field>
            <Field label="FAX">
              <TInput value={data.fax} onChange={set('fax')} placeholder="054-123-4568" mono readOnly={ro} />
            </Field>
            <Field label={tMaster('diaChi')}>
              <TInput value={data.address} onChange={set('address')} placeholder="Nhập địa chỉ..." readOnly={ro} />
            </Field>
            <Field label={tMaster('parentCompany')}>
              {ro ? (
                <TInput
                  value={parentCompanies.find(p => p.company_id === data.parent_company_id)?.company_name ?? (data.parent_company_id ? '...' : '—')}
                  onChange={() => {}}
                  readOnly
                />
              ) : (
                <select
                  value={data.parent_company_id}
                  onChange={e => set('parent_company_id')(e.target.value)}
                  className="form-select text-[12px]"
                >
                  <option value="">— {tMaster('parentCompany')} —</option>
                  {parentCompanies.map(p => (
                    <option key={p.company_id} value={p.company_id}>
                      [{p.company_code}] {p.company_name}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </Section>

        {/* 4. フォルダパス */}
        <Section icon={Folder} title="Folder Server">
          <div className="form-grid-1">
            <Field label="Order Folder">
              <TInput
                value={data.order_folder_path}
                onChange={set('order_folder_path')}
                placeholder="\\SERVER\ysd-folder\..."
                mono
                readOnly={ro}
              />
            </Field>
            <Field label="CAD Folder">
              <TInput
                value={data.cad_folder_path}
                onChange={set('cad_folder_path')}
                placeholder="\\SERVER\cad-data\..."
                mono
                readOnly={ro}
              />
            </Field>
          </div>
        </Section>

        {/* 5. 備考 */}
        <Section icon={FileText} title="Notes">
          <textarea
            value={data.notes}
            onChange={e => set('notes')(e.target.value)}
            readOnly={ro}
            placeholder="..."
            className="form-textarea text-[12px]"
            rows={3}
          />
        </Section>
      </div>

      {/* ── Actions ── */}
      {editMode && (
        <div className="form-actions" style={{ flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => mode === 'view' ? setEditMode(false) : router.push('/master/customers')}
            className="btn btn-secondary"
            style={{ fontSize: 12 }}
            disabled={isPending}
          >
            {tCommon('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || data.company_type.length === 0}
            className="btn btn-primary"
            style={{ fontSize: 12, minWidth: 120 }}
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isPending ? tCommon('loading') : tCommon('save')}
          </button>
        </div>
      )}
    </div>
  )
}

