'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { upsertUnifiedMold, type UnifiedMoldPayload } from '@/app/actions/mold'
import { CustomerSearchInput } from '@/components/order/CustomerSearchInput'

type Section = 'BASE' | 'DESIGN' | 'PHYSICAL'

interface Props {
  isOpen: boolean
  onClose: () => void
  editPhysicalId?: string | null
  customers: any[]
  itemTypes: any[]
  racks: any[]
  allLayers: any[]
}

const SECTIONS: { id: Section; labelKey: string; icon: string }[] = [
  { id: 'BASE', labelKey: 'base', icon: '🏭' },
  { id: 'DESIGN', labelKey: 'design', icon: '📐' },
  { id: 'PHYSICAL', labelKey: 'physical', icon: '📦' },
]

const inputCls = 'w-full min-h-[40px] px-3 border border-[var(--border-default)] rounded-lg bg-white text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors'
const labelCls = 'text-xs font-bold text-[var(--text-muted)] mb-1 flex items-baseline gap-1'

export default function UnifiedMoldDrawer({ isOpen, onClose, editPhysicalId, customers, itemTypes, racks, allLayers }: Props) {
  const locale = useLocale()
  const tEquipment = useTranslations('Equipment')
  const isVi = locale === 'vi'
  const tText = (vi: string, ja: string) => isVi ? vi : ja
  const [activeSection, setActiveSection] = useState<Section>('BASE')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [createNewRevision, setCreateNewRevision] = useState(false)

  // Form state
  const [form, setForm] = useState<UnifiedMoldPayload>({
    code: '', name: '', company_id: '', mold_class: '', base_notes: '',
    design_for_plastic_type: '', cutline_x: null, cutline_y: null, corner_r: '', chamfer_c: '',
    pocket_numbers: null, pitch: null, under_depth: null, under_angle: '', draft_angle: '',
    mold_orientation: '', mold_setup_type: '', separate_cutter: false, plug: false,
    customer_drawing_no: '', customer_equipment_no: '', customer_tray_name: '', tray_info: '',
    design_length: null, design_width: null, design_height: null, design_depth: null,
    design_weight: null, piece_count: null, cavid: '', data_input: '', text_content: '',
    physical_code: '', cavity: 1, item_type_id: '', rack_layer_id: '', status: 'ACTIVE',
    keeper_company: '', physical_notes: '',
  })

  const [selectedRackId, setSelectedRackId] = useState('')
  const filteredLayers = allLayers.filter(l => l.rack_id === selectedRackId)

  const isEditMode = !!editPhysicalId

  // Load existing data for edit
  useEffect(() => {
    if (!isOpen || !editPhysicalId) return
    setLoading(true)
    const supabase = createClient()
    supabase.from('physical_molds').select(`*, mold_revisions (*, products (*)), cav_types (id, cav_name), rack_layers (id, code, label, rack_id)`)
      .eq('physical_mold_id', editPhysicalId).single()
      .then(({ data }) => {
        if (!data) { setLoading(false); return }
        const rev = Array.isArray(data.mold_revisions) ? data.mold_revisions[0] : data.mold_revisions
        const base = rev?.products
        const rl = Array.isArray(data.rack_layers) ? data.rack_layers[0] : data.rack_layers

        setForm({
          code: base?.product_code || '', name: base?.product_name_internal || '', company_id: base?.company_id || '',
          mold_class: base?.mold_class || '', base_notes: base?.notes || '',
          design_for_plastic_type: rev?.design_for_plastic_type || '',
          cutline_x: rev?.cutline_x, cutline_y: rev?.cutline_y,
          corner_r: rev?.corner_r || '', chamfer_c: rev?.chamfer_c || '',
          pocket_numbers: rev?.pocket_numbers, pitch: rev?.pitch, under_depth: rev?.under_depth,
          under_angle: rev?.under_angle || '', draft_angle: rev?.draft_angle || '',
          mold_orientation: rev?.mold_orientation || '', mold_setup_type: rev?.mold_setup_type || '',
          separate_cutter: rev?.separate_cutter || false, plug: rev?.plug || false,
          customer_drawing_no: rev?.customer_drawing_no || '', customer_equipment_no: rev?.customer_equipment_no || '',
          customer_tray_name: rev?.customer_tray_name || '', tray_info: rev?.tray_info || '',
          design_length: rev?.design_length, design_width: rev?.design_width,
          design_height: rev?.design_height, design_depth: rev?.design_depth,
          design_weight: rev?.design_weight, piece_count: rev?.piece_count,
          cavid: rev?.cavid || '', data_input: rev?.data_input || '', text_content: rev?.text_content || '',
          physical_code: data.system_code || '', cavity: 1,
          item_type_id: data.cav_type_id || '', rack_layer_id: data.current_rack_layer_id || '',
          status: data.device_status || 'ACTIVE', keeper_company: data.keeper_company_id || '',
          physical_notes: data.notes || '',
          existing_base_id: base?.product_id, existing_revision_id: rev?.revision_id, existing_physical_id: data.physical_mold_id,
        })
        if (rl?.rack_id) setSelectedRackId(rl.rack_id)
        setLoading(false)
      })
  }, [isOpen, editPhysicalId])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setActiveSection('BASE')
      setError(null)
      setSuccess(false)
      setCreateNewRevision(false)
      setSelectedRackId('')
      setForm({ code: '', name: '', company_id: '', mold_class: '', base_notes: '',
        design_for_plastic_type: '', cutline_x: null, cutline_y: null, corner_r: '', chamfer_c: '',
        pocket_numbers: null, pitch: null, under_depth: null, under_angle: '', draft_angle: '',
        mold_orientation: '', mold_setup_type: '', separate_cutter: false, plug: false,
        customer_drawing_no: '', customer_equipment_no: '', customer_tray_name: '', tray_info: '',
        design_length: null, design_width: null, design_height: null, design_depth: null,
        design_weight: null, piece_count: null, cavid: '', data_input: '', text_content: '',
        physical_code: '', cavity: 1, item_type_id: '', rack_layer_id: '', status: 'ACTIVE',
        keeper_company: '', physical_notes: '' })
    }
  }, [isOpen])

  const updateField = useCallback((field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = async () => {
    if (!form.code.trim()) { setError('Mã khuôn (コード) là bắt buộc'); setActiveSection('BASE'); return }
    setIsSubmitting(true)
    setError(null)
    const result = await upsertUnifiedMold({ ...form, create_new_revision: createNewRevision })
    setIsSubmitting(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => onClose(), 1200)
    } else {
      setError(result.error || 'Lỗi không xác định')
    }
  }

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isSubmitting) onClose() }
    if (isOpen) window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const renderNumInput = (label: string, jp: string, field: string, unit?: string) => (
    <div className="flex flex-col">
      <label className={labelCls}><span>{tText(label, jp)}</span></label>
      <div className="relative">
        <input type="number" step="any" value={(form as any)[field] ?? ''} onChange={e => updateField(field, e.target.value === '' ? null : Number(e.target.value))} className={inputCls} disabled={isSubmitting} />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">{unit}</span>}
      </div>
    </div>
  )

  const renderTextInput = (label: string, jp: string, field: string, required?: boolean) => (
    <div className="flex flex-col">
      <label className={labelCls}><span>{tText(label, jp)}{required ? ' *' : ''}</span></label>
      <input type="text" value={(form as any)[field] || ''} onChange={e => updateField(field, e.target.value)} className={inputCls} disabled={isSubmitting} />
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[700px] bg-white shadow-2xl flex flex-col border-l border-[var(--border-default)]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-teal-200 text-[10px] font-bold tracking-widest mb-0.5">
              {isEditMode ? tText('CHỈNH SỬA KHUÔN', '金型編集') : tText('TẠO KHUÔN MỚI', '金型登録')}
            </div>
            <h2 className="text-lg font-bold">{form.code || tText('Mới', '新規')}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg">✕</button>
        </div>

        {/* Section Nav */}
        <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-surface-2)] shrink-0">
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 border-b-2 transition-all ${
                activeSection === s.id ? 'border-[var(--accent)] bg-white text-[var(--accent)] font-bold' : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
              }`}>
              <span className="text-base">{s.icon}</span>
              <span className="text-[11px] font-bold">{tEquipment(`sections.${s.labelKey}`)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[var(--bg-page)]">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-[var(--text-muted)] text-sm">{tText('Đang tải...', '読み込み中...')}</div>
          ) : (
            <>
              {/* SECTION: BASE */}
              {activeSection === 'BASE' && (
                <div className="space-y-4">
                  <SectionHeader labelKey="base" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderTextInput('Mã khuôn', 'コード', 'code', true)}
                    {renderTextInput('Tên khuôn', '名前', 'name')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className={labelCls}><span>{tText('Khách hàng', '顧客')}</span></label>
                      {(() => {
                        const cust = customers.find((c: any) => c.company_id === form.company_id);
                        const defaultVal = cust ? `${cust.company_code} - ${cust.company_name || ''}` : '';
                        return (
                          <div className={isSubmitting ? "pointer-events-none opacity-50" : ""}>
                            <CustomerSearchInput 
                              defaultValue={defaultVal}
                              onSelect={(customer) => updateField('company_id', customer ? customer.company_id : '')} 
                            />
                          </div>
                        );
                      })()}
                    </div>
                    {renderTextInput('Phân loại', '分類', 'mold_class')}
                  </div>
                  <div className="flex flex-col">
                    <label className={labelCls}><span>{tText('Ghi chú', 'メモ')}</span></label>
                    <textarea value={form.base_notes || ''} onChange={e => updateField('base_notes', e.target.value)} rows={2} className={inputCls + ' resize-none'} disabled={isSubmitting} />
                  </div>
                </div>
              )}

              {/* SECTION: DESIGN */}
              {activeSection === 'DESIGN' && (
                <div className="space-y-5">
                  <SectionHeader labelKey="design" />

                  {isEditMode && (
                    <div className="flex items-center gap-3 p-3 bg-[var(--status-warning-bg)] border border-[var(--status-warning)] rounded-lg">
                      <input type="checkbox" checked={createNewRevision} onChange={e => setCreateNewRevision(e.target.checked)} className="w-4 h-4 accent-amber-600" />
                      <div>
                        <div className="text-xs font-bold text-[var(--status-warning-text)]">{tText('Tạo Phiên bản mới', '新しいリビジョンを作成')}</div>
                        <div className="text-[10px] text-[var(--status-warning)]">{tText('Thay đổi sẽ tạo revision mới (VD: R2), giữ nguyên thiết kế cũ.', '変更は新しいリビジョンを作成します。')}</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                    <div className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">{tText('Kích thước', '寸法')}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {renderNumInput('Dài', '長さ', 'design_length', 'mm')}
                      {renderNumInput('Rộng', '幅', 'design_width', 'mm')}
                      {renderNumInput('Cao', '高さ', 'design_height', 'mm')}
                      {renderNumInput('Sâu', '深さ', 'design_depth', 'mm')}
                      {renderNumInput('Nặng', '重量', 'design_weight', 'kg')}
                      {renderNumInput('Số miếng', '個数', 'piece_count')}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                    <div className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">{tText('Đường cắt', 'カットライン')}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {renderNumInput('Cắt X', 'X', 'cutline_x', 'mm')}
                      {renderNumInput('Cắt Y', 'Y', 'cutline_y', 'mm')}
                      {renderTextInput('Góc R', 'コーナーR', 'corner_r')}
                      {renderTextInput('Vát C', '面取りC', 'chamfer_c')}
                      {renderNumInput('Số túi', 'ポケット', 'pocket_numbers')}
                      {renderNumInput('Bước', 'ピッチ', 'pitch', 'mm')}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                    <div className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">{tText('Cài đặt khuôn', '金型設定')}</div>
                    <div className="grid grid-cols-2 gap-3">
                      {renderTextInput('Hướng khuôn', '向き', 'mold_orientation')}
                      {renderTextInput('Kiểu lắp', 'セットアップ', 'mold_setup_type')}
                      {renderTextInput('Góc undercut', 'アンダー角', 'under_angle')}
                      {renderNumInput('Sâu undercut', 'アンダー深', 'under_depth', 'mm')}
                      {renderTextInput('Góc thoát', '抜き角', 'draft_angle')}
                      {renderTextInput('Loại nhựa', 'プラ種類', 'design_for_plastic_type')}
                    </div>
                    <div className="flex gap-6 pt-2">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.separate_cutter || false} onChange={e => updateField('separate_cutter', e.target.checked)} className="w-4 h-4 accent-teal-600" /><span className="text-xs text-[var(--text-primary)]">{tText('Dao riêng', '別カッター')}</span></label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.plug || false} onChange={e => updateField('plug', e.target.checked)} className="w-4 h-4 accent-teal-600" /><span className="text-xs text-[var(--text-primary)]">{tText('Plug', 'プラグ')}</span></label>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                    <div className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">🥡 {tText('Thông tin Khay', 'トレイ情報')}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {renderTextInput('Tên khay KH', '顧客トレイ名', 'customer_tray_name')}
                      {renderTextInput('Chi tiết khay', 'トレイ情報', 'tray_info')}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                    <div className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">{tText('Bản vẽ', '図面')}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {renderTextInput('Số bản vẽ KH', '顧客図面No', 'customer_drawing_no')}
                      {renderTextInput('Số thiết bị KH', '顧客設備No', 'customer_equipment_no')}
                      {renderTextInput('CAVID', 'CAVID', 'cavid')}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: PHYSICAL */}
              {activeSection === 'PHYSICAL' && (
                <div className="space-y-4">
                  <SectionHeader labelKey="physical" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderTextInput('Mã khắc', '刻印コード', 'physical_code')}
                    {renderNumInput('Cavity', 'キャビティ', 'cavity')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className={labelCls}><span>{tText('Loại', '種類')}</span></label>
                      <select value={form.item_type_id || ''} onChange={e => updateField('item_type_id', e.target.value)} className={inputCls} disabled={isSubmitting}>
                        <option value="">-- 選択 --</option>
                        {itemTypes.map((it: any) => <option key={it.id} value={it.id}>{it.name}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className={labelCls}><span>{tText('Trạng thái', '状態')}</span></label>
                      <select value={form.status || 'ACTIVE'} onChange={e => updateField('status', e.target.value)} className={inputCls} disabled={isSubmitting}>
                        <option value="ACTIVE">ACTIVE ({tText('Hoạt động', '稼働')})</option>
                        <option value="REPAIR">REPAIR ({tText('Sửa chữa', '修理')})</option>
                        <option value="DISPOSED">DISPOSED ({tText('Thanh lý', '廃棄')})</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                    <div className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">{tText('Vị trí kho', '保管場所')}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className={labelCls}><span>{tText('Giá kệ', 'ラック')}</span></label>
                        <select value={selectedRackId} onChange={e => { setSelectedRackId(e.target.value); updateField('rack_layer_id', '') }} className={inputCls} disabled={isSubmitting}>
                          <option value="">-- 選択 --</option>
                          {racks.map((r: any) => <option key={r.id} value={r.id}>{r.code} - {r.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className={labelCls}><span>{tText('Tầng', 'レイヤー')}</span></label>
                        <select value={form.rack_layer_id || ''} onChange={e => updateField('rack_layer_id', e.target.value)} className={inputCls} disabled={!selectedRackId || isSubmitting}>
                          <option value="">-- 選択 --</option>
                          {filteredLayers.map((l: any) => <option key={l.id} value={l.id}>{l.code} - {l.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className={labelCls}><span>{tText('Công ty giữ', '保管会社')}</span></label>
                      {(() => {
                        const keeperCust = customers.find((c: any) => c.company_id === form.keeper_company);
                        const defaultVal = keeperCust ? `${keeperCust.company_code} - ${keeperCust.company_name || ''}` : '';
                        return (
                          <div className={isSubmitting ? "pointer-events-none opacity-50" : ""}>
                            <CustomerSearchInput 
                              defaultValue={defaultVal}
                              onSelect={(customer) => updateField('keeper_company', customer ? customer.company_id : '')} 
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className={labelCls}><span>{tText('Ghi chú vật lý', 'メモ')}</span></label>
                    <textarea value={form.physical_notes || ''} onChange={e => updateField('physical_notes', e.target.value)} rows={2} className={inputCls + ' resize-none'} disabled={isSubmitting} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[var(--border-default)] shrink-0 space-y-2">
          {error && <div className="p-2 bg-[var(--status-error-bg)] border border-[var(--status-error)] rounded-lg text-[var(--status-error-text)] text-xs font-medium">⚠️ {error}</div>}
          {success && <div className="p-2 bg-[var(--status-success-bg)] border border-[var(--status-success)] rounded-lg text-[var(--status-success-text)] text-xs font-bold text-center">{tText('✅ Lưu thành công!', '✅ 保存完了')}</div>}
          <div className="flex gap-3">
            <button onClick={onClose} disabled={isSubmitting} className="flex-1 min-h-[44px] bg-white text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-hover)] rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
              {tText('Hủy', 'キャンセル')}
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting || success} className="flex-1 min-h-[44px] bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 rounded-lg font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
              {isSubmitting ? (<><Spinner /> {tText('Đang xử lý...', '処理中...')}</>) : success ? (tText('✅ Hoàn thành', '✅ 完了')) : (tText('Lưu →', '保存 →'))}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function SectionHeader({ labelKey }: { labelKey: 'base' | 'design' | 'physical' }) {
  const tEquipment = useTranslations('Equipment')
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="w-1 h-5 bg-teal-500 rounded-full" />
      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{tEquipment(`sections.${labelKey}`)}</span>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
