'use client'

import { useTranslations, useLocale } from 'next-intl'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save, Loader2, X, Tag, Building2, Phone, Folder, FileText,
  ChevronDown, ChevronUp,
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

const COMPANY_TYPES: { value: string; ja: string; vi: string }[] = [
  { value: 'CUSTOMER',      ja: '得意先',    vi: 'Khách hàng' },
  { value: 'VENDOR',        ja: '仕入先',    vi: 'Nhà cung cấp' },
  { value: 'DELIVERY_SITE', ja: '納入先',    vi: 'Điểm giao hàng' },
  { value: 'KEEPER',        ja: '預り先',    vi: 'Đơn vị lưu giữ' },
  { value: 'MAKER',         ja: 'メーカー',  vi: 'Nhà sản xuất' },
]

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
  ja, vi, required, children,
}: { ja: string; vi: string; required?: boolean; children: React.ReactNode }) {
  const locale = useLocale()
  return (
    <div className="form-field">
      <div className="form-label">
        {locale === 'vi' ? vi : ja}
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
      className={`form-input${mono ? ' mono' : ''}`}
    />
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  icon: Icon, ja, vi, children,
}: {
  icon: React.ElementType; ja: string; vi: string; children: React.ReactNode
}) {
  const locale = useLocale()
  return (
    <div className="form-section">
      <div className="form-section-header">
        <Icon className="section-icon" />
        {locale === 'vi' ? vi : ja}
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
  const t = useTranslations()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [editMode, setEditMode] = useState<boolean>(mode !== 'view')
  const [leftExpanded, setLeftExpanded] = useState(false) // mobile only

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

  const toggleType = (t: string) => {
    setData(d => ({
      ...d,
      company_type: d.company_type.includes(t)
        ? d.company_type.filter(x => x !== t)
        : [...d.company_type, t],
    }))
    setSaved(false)
  }

  const handleSave = () => {
    if (!data.company_code.trim()) { setFormError('company_code は必須です / Mã công ty bắt buộc'); return }
    if (!data.company_name.trim()) { setFormError('会社名は必須です / Tên công ty bắt buộc'); return }
    if (data.company_type.length === 0) { setFormError('会社区分を選択してください / Chọn ít nhất 1 loại'); return }
    setFormError(null)
    startTransition(async () => {
      const result = await saveCompany(data)
      if (!result.success) {
        setFormError(result.error || '保存失敗 / Lưu thất bại')
      } else {
        setSaved(true)
        router.push('/master/customers')
        router.refresh()
      }
    })
  }

  const ro = !editMode // read-only shorthand

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
              className={`btn ${editMode ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ fontSize: 12, height: 30, padding: '0 12px' }}
            >
              {editMode ? (
                <><X size={12} /> キャンセル</>
              ) : (
                <><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> 編集 / Sửa</>
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
          <span style={{ fontSize: 11, fontWeight: 600 }}>
            {data.is_active ? '✓ 取引中 / Active' : '停止中 / Inactive'}
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
          ✓ 保存しました / Đã lưu thành công
        </div>
      )}

      {/* ── Scrollable form body ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>

        {/* 1. 基本情報 */}
        <Section icon={Tag} ja="基本情報" vi="Thông tin nhận diện">
          <div className="form-grid-2">
            <Field ja="顧客コード" vi="Mã công ty" required>
              <TInput
                value={data.company_code}
                onChange={set('company_code')}
                placeholder="VD: SMK-001"
                mono
                readOnly={ro || !!data.company_id}
              />
            </Field>
            <Field ja="会社名 (日本語)" vi="Tên công ty (JP)" required>
              <TInput value={data.company_name} onChange={set('company_name')} placeholder="例：山田製作所株式会社" readOnly={ro} />
            </Field>
            <Field ja="会社名 (ローマ字)" vi="Tên Romaji / English">
              <TInput value={data.company_name_romaji} onChange={set('company_name_romaji')} placeholder="VD: Yamada Seisakusho Co.,Ltd" readOnly={ro} />
            </Field>
            <Field ja="旧システムID" vi="ID hệ thống cũ (Access)">
              <TInput value={data.legacy_id} onChange={set('legacy_id')} placeholder="ID từ Access cũ" mono readOnly={ro} />
            </Field>
          </div>
        </Section>

        {/* 2. 会社区分 */}
        <Section icon={Building2} ja="会社区分" vi="Loại công ty (chọn nhiều)">
          <div className="type-chips">
            {COMPANY_TYPES.map(t => {
              const active = data.company_type.includes(t.value)
              return (
                <button
                  key={t.value}
                  type="button"
                  disabled={ro}
                  onClick={() => toggleType(t.value)}
                  className={`type-chip${active ? ' type-chip--active' : ''}`}
                >
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{t.ja}</span>
                  <span style={{ fontSize: 9, opacity: 0.7 }}>/ {t.vi}</span>
                </button>
              )
            })}
          </div>
          {data.company_type.length === 0 && !ro && (
            <p style={{ fontSize: 11, color: 'var(--status-error)', marginTop: 4 }}>
              ⚠ 1つ以上選択してください / Chọn ít nhất 1 loại
            </p>
          )}
        </Section>

        {/* 3. 連絡先 */}
        <Section icon={Phone} ja="連絡先" vi="Thông tin liên hệ">
          <div className="form-grid-2">
            <Field ja="電話番号" vi="Số điện thoại">
              <TInput value={data.tel} onChange={set('tel')} placeholder="054-123-4567" mono readOnly={ro} />
            </Field>
            <Field ja="FAX" vi="Số Fax">
              <TInput value={data.fax} onChange={set('fax')} placeholder="054-123-4568" mono readOnly={ro} />
            </Field>
            <Field ja="住所" vi="Địa chỉ">
              <TInput value={data.address} onChange={set('address')} placeholder="Nhập địa chỉ..." readOnly={ro} />
            </Field>
            <Field ja="親会社" vi="Công ty mẹ (nếu là chi nhánh)">
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
                  className="form-select"
                >
                  <option value="">— 親会社なし / Không có —</option>
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
        <Section icon={Folder} ja="フォルダパス" vi="Đường dẫn thư mục">
          <div className="form-grid-1">
            <Field ja="注文書フォルダ" vi="Thư mục đơn hàng trên server">
              <TInput
                value={data.order_folder_path}
                onChange={set('order_folder_path')}
                placeholder="\\SERVER\ysd-folder\新SMK注文書"
                mono
                readOnly={ro}
              />
            </Field>
            <Field ja="CADフォルダ" vi="Thư mục bản vẽ CAD">
              <TInput
                value={data.cad_folder_path}
                onChange={set('cad_folder_path')}
                placeholder="\\SERVER\cad-data\SMK"
                mono
                readOnly={ro}
              />
            </Field>
          </div>
        </Section>

        {/* 5. 備考 */}
        <Section icon={FileText} ja="備考" vi="Ghi chú">
          <textarea
            value={data.notes}
            onChange={e => set('notes')(e.target.value)}
            readOnly={ro}
            placeholder="Ghi chú thêm về công ty này..."
            className="form-textarea"
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
            キャンセル / Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || data.company_type.length === 0}
            className="btn btn-primary"
            style={{ fontSize: 12, minWidth: 120 }}
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isPending ? '保存中...' : '保存 / Lưu'}
          </button>
        </div>
      )}
    </div>
  )
}
