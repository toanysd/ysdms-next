// @ts-nocheck
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Pencil, Trash2, X, Save, Power, Filter,
  Cog, ChevronDown, Loader2
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type MachineType = 'VACUUM_FORMING' | 'PRESSURE_FORMING' | 'TRIMMING_PRESS' | 'CNC_ROUTER' | 'OTHER'
type Location = '1F_FACTORY' | '2F_OFFICE' | 'MOLD_STORAGE' | 'WAREHOUSE'
type MachineGroup = 'MAIN' | 'SUB' | 'CNC' | 'PRESS'

type Machine = {
  machine_id: string
  machine_code: string
  machine_name: string
  machine_type: MachineType
  manufacturer: string | null
  model: string | null
  max_mold_length: number
  max_mold_width: number
  max_sheet_width: number | null
  location: Location
  machine_group: MachineGroup
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

type MachineForm = Omit<Machine, 'machine_id' | 'created_at' | 'updated_at'>

// ─── Label Maps ──────────────────────────────────────────────────────────────

const MACHINE_TYPE_LABELS: Record<MachineType, { ja: string; vi: string; color: string; bg: string; border: string }> = {
  VACUUM_FORMING:   { ja: '真空成形',         vi: 'Hút chân không',  color: 'var(--status-info)',    bg: 'color-mix(in srgb, var(--status-info) 12%, transparent)',    border: 'color-mix(in srgb, var(--status-info) 25%, transparent)' },
  PRESSURE_FORMING: { ja: '圧空成形',         vi: 'Ép khí',          color: 'var(--accent)',         bg: 'color-mix(in srgb, var(--accent) 12%, transparent)',         border: 'color-mix(in srgb, var(--accent) 25%, transparent)' },
  TRIMMING_PRESS:   { ja: 'トリミングプレス',  vi: 'Dập cắt',         color: 'var(--status-warning)', bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)', border: 'color-mix(in srgb, var(--status-warning) 25%, transparent)' },
  CNC_ROUTER:       { ja: 'CNCルーター',      vi: 'CNC Router',      color: 'var(--status-success)', bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)', border: 'color-mix(in srgb, var(--status-success) 25%, transparent)' },
  OTHER:            { ja: 'その他',           vi: 'Khác',            color: 'var(--text-muted)',     bg: 'color-mix(in srgb, var(--text-muted) 12%, transparent)',     border: 'color-mix(in srgb, var(--text-muted) 25%, transparent)' },
}

const LOCATION_LABELS: Record<Location, { ja: string; vi: string }> = {
  '1F_FACTORY':   { ja: '1F 工場',    vi: 'Tầng 1 Nhà máy' },
  '2F_OFFICE':    { ja: '2F 事務所',   vi: 'Tầng 2 Văn phòng' },
  'MOLD_STORAGE': { ja: '金型倉庫',    vi: 'Kho khuôn' },
  'WAREHOUSE':    { ja: '倉庫',       vi: 'Kho' },
}

const GROUP_LABELS: Record<MachineGroup, { ja: string; vi: string }> = {
  MAIN:  { ja: 'メイン', vi: 'Chính' },
  SUB:   { ja: 'サブ',   vi: 'Phụ' },
  CNC:   { ja: 'CNC',   vi: 'CNC' },
  PRESS: { ja: 'プレス', vi: 'Dập' },
}

const EMPTY_FORM: MachineForm = {
  machine_code: '',
  machine_name: '',
  machine_type: 'VACUUM_FORMING',
  manufacturer: null,
  model: null,
  max_mold_length: 0,
  max_mold_width: 0,
  max_sheet_width: null,
  location: '1F_FACTORY',
  machine_group: 'MAIN',
  is_active: true,
  notes: null,
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MachinesPage() {
  const supabase = createClient()

  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [filterType, setFilterType] = useState<MachineType | ''>('')
  const [filterGroup, setFilterGroup] = useState<MachineGroup | ''>('')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<MachineForm>({ ...EMPTY_FORM })

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // ─── Data Fetching ──────────────────────────────────────────────────────

  const fetchMachines = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase
      .from('machines')
      .select('*')
      .order('machine_code', { ascending: true })

    if (filterType) query = query.eq('machine_type', filterType)
    if (filterGroup) query = query.eq('machine_group', filterGroup)

    const { data, error: err } = await query
    if (err) setError(err.message)
    else setMachines(data || [])
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterGroup])

  useEffect(() => {
    fetchMachines()
  }, [fetchMachines])

  // ─── CRUD Handlers ──────────────────────────────────────────────────────

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setModalOpen(true)
  }

  const openEdit = (m: Machine) => {
    setEditingId(m.machine_id)
    setForm({
      machine_code: m.machine_code,
      machine_name: m.machine_name,
      machine_type: m.machine_type,
      manufacturer: m.manufacturer,
      model: m.model,
      max_mold_length: m.max_mold_length,
      max_mold_width: m.max_mold_width,
      max_sheet_width: m.max_sheet_width,
      location: m.location,
      machine_group: m.machine_group,
      is_active: m.is_active,
      notes: m.notes,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editingId) {
      const { error: err } = await supabase
        .from('machines')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('machine_id', editingId)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase
        .from('machines')
        .insert([form])
      if (err) { setError(err.message); setSaving(false); return }
    }
    setSaving(false)
    setModalOpen(false)
    fetchMachines()
  }

  const handleDelete = async (id: string) => {
    const { error: err } = await supabase.from('machines').delete().eq('machine_id', id)
    if (err) setError(err.message)
    setDeleteId(null)
    fetchMachines()
  }

  const toggleActive = async (m: Machine) => {
    const { error: err } = await supabase
      .from('machines')
      .update({ is_active: !m.is_active, updated_at: new Date().toISOString() })
      .eq('machine_id', m.machine_id)
    if (err) setError(err.message)
    else fetchMachines()
  }

  // ─── Render Helpers ─────────────────────────────────────────────────────

  const TypeBadge = ({ type }: { type: MachineType }) => {
    const t = MACHINE_TYPE_LABELS[type]
    return (
      <span
        className="inline-flex items-center px-[6px] py-[1px] rounded-full text-[10px] font-bold whitespace-nowrap"
        style={{ color: t.color, background: t.bg, border: `1px solid ${t.border}` }}
      >
        {t.ja}
      </span>
    )
  }

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className="inline-flex items-center px-[6px] py-[1px] rounded-full text-[10px] font-bold uppercase"
      style={{
        color: active ? 'var(--status-success)' : 'var(--text-muted)',
        background: active
          ? 'color-mix(in srgb, var(--status-success) 12%, transparent)'
          : 'color-mix(in srgb, var(--text-muted) 10%, transparent)',
        border: `1px solid ${active
          ? 'color-mix(in srgb, var(--status-success) 25%, transparent)'
          : 'color-mix(in srgb, var(--text-muted) 20%, transparent)'}`,
      }}
    >
      {active ? '稼働中' : '停止'}
    </span>
  )

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cog size={18} style={{ color: 'var(--text-muted)' }} />
          <div>
            <h1
              className="text-[15px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
            >
              機械・設備マスター
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Quản lý Máy móc &amp; Thiết bị
            </span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="h-[32px] px-3 text-[12px] font-bold rounded flex items-center gap-1"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>新規追加</span>
        </button>
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-flat" style={{ padding: '12px 16px', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>総機械数 / Tổng số máy</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace' }}>{machines.length}</div>
        </div>
        <div className="card-flat" style={{ padding: '12px 16px', borderLeft: '4px solid var(--status-success)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>稼働中 / Đang hoạt động</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: 'var(--status-success)' }}>
            {machines.filter(m => m.is_active).length}
          </div>
        </div>
        <div className="card-flat" style={{ padding: '12px 16px', borderLeft: '4px solid var(--status-error)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>停止・メンテ / Ngừng/Bảo trì</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: 'var(--status-error)' }}>
            {machines.filter(m => !m.is_active).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)' }}>
            絞り込み
          </span>

          {/* Machine Type filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as MachineType | '')}
              className="h-[28px] pl-2 pr-6 text-[11px] rounded appearance-none"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <option value="">機種 (全て)</option>
              {(Object.keys(MACHINE_TYPE_LABELS) as MachineType[]).map(k => (
                <option key={k} value={k}>{MACHINE_TYPE_LABELS[k].ja}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-1.5 top-[8px] pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
          </div>

          {/* Machine Group filter */}
          <div className="relative">
            <select
              value={filterGroup}
              onChange={e => setFilterGroup(e.target.value as MachineGroup | '')}
              className="h-[28px] pl-2 pr-6 text-[11px] rounded appearance-none"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <option value="">グループ (全て)</option>
              {(Object.keys(GROUP_LABELS) as MachineGroup[]).map(k => (
                <option key={k} value={k}>{GROUP_LABELS[k].ja}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-1.5 top-[8px] pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
          </div>

          {(filterType || filterGroup) && (
            <button
              onClick={() => { setFilterType(''); setFilterGroup('') }}
              className="h-[24px] px-2 text-[10px] rounded flex items-center gap-1"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={10} /> クリア
            </button>
          )}

          <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>
            {machines.length}件
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="card-flat text-[12px] flex items-center justify-between"
          style={{
            padding: '8px 12px',
            background: 'color-mix(in srgb, var(--status-error) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--status-error) 25%, transparent)',
            color: 'var(--status-error)',
          }}
        >
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--status-error)' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Data Table */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                {[
                  { ja: 'コード', vi: 'Mã', w: 80 },
                  { ja: '機械名', vi: 'Tên máy', w: 180 },
                  { ja: '機種', vi: 'Loại', w: 130 },
                  { ja: 'グループ', vi: 'Nhóm', w: 80 },
                  { ja: '最大サイズ (L×W)', vi: 'Kích thước max', w: 140 },
                  { ja: 'メーカー / 型式', vi: 'NSX / Model', w: 140 },
                  { ja: '設置場所', vi: 'Vị trí', w: 100 },
                  { ja: '状態', vi: 'Status', w: 70 },
                  { ja: '操作', vi: '', w: 100 },
                ].map((col, i) => (
                  <th key={i} style={{ width: col.w }}>
                    {col.ja}
                    {col.vi && (
                      <span
                        style={{
                          fontWeight: 400,
                          marginLeft: 4,
                          fontSize: 9,
                          color: 'var(--text-muted)',
                          opacity: 0.7,
                          textTransform: 'none',
                        }}
                      >
                        {col.vi}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    <Loader2 size={16} className="animate-spin inline-block mr-2" />
                    読み込み中...
                  </td>
                </tr>
              )}
              {!loading && machines.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    データがありません / Không có dữ liệu
                  </td>
                </tr>
              )}
              {!loading && machines.map((m, idx) => (
                <tr key={m.machine_id}>
                  {/* Code */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {m.machine_code}
                  </td>

                  {/* Name */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                      {m.machine_name}
                    </div>
                  </td>

                  {/* Type badge */}
                  <td>
                    <TypeBadge type={m.machine_type} />
                  </td>

                  {/* Group */}
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-jp)' }}>
                      {GROUP_LABELS[m.machine_group]?.ja || m.machine_group}
                    </span>
                  </td>

                  {/* Max Size */}
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                    <span style={{ fontWeight: 600 }}>{m.max_mold_length}</span>
                    <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>×</span>
                    <span style={{ fontWeight: 600 }}>{m.max_mold_width}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10, marginLeft: 2 }}>mm</span>
                    {m.max_sheet_width && (
                      <span style={{ color: 'var(--text-muted)', fontSize: 10, marginLeft: 6 }}>
                        (幅{m.max_sheet_width})
                      </span>
                    )}
                  </td>

                  {/* Manufacturer / Model */}
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {m.manufacturer || m.model ? (
                      <>
                        {m.manufacturer && <span style={{ fontWeight: 600 }}>{m.manufacturer}</span>}
                        {m.manufacturer && m.model && <span style={{ margin: '0 3px', color: 'var(--text-muted)' }}>/</span>}
                        {m.model && <span style={{ color: 'var(--text-muted)' }}>{m.model}</span>}
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>

                  {/* Location */}
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ fontFamily: 'var(--font-jp)' }}>
                      {LOCATION_LABELS[m.location]?.ja || m.location}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge active={m.is_active} />
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(m)}
                        title="編集"
                        className="flex items-center justify-center rounded"
                        style={{
                          width: 32, height: 32,
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => toggleActive(m)}
                        title={m.is_active ? '停止する' : '稼働する'}
                        className="flex items-center justify-center rounded"
                        style={{
                          width: 32, height: 32,
                          background: 'transparent',
                          border: `1px solid ${m.is_active
                            ? 'color-mix(in srgb, var(--status-warning) 40%, transparent)'
                            : 'color-mix(in srgb, var(--status-success) 40%, transparent)'}`,
                          color: m.is_active ? 'var(--status-warning)' : 'var(--status-success)',
                          cursor: 'pointer',
                        }}
                      >
                        <Power size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(m.machine_id)}
                        title="削除"
                        className="flex items-center justify-center rounded"
                        style={{
                          width: 32, height: 32,
                          background: 'transparent',
                          border: '1px solid color-mix(in srgb, var(--status-error) 30%, transparent)',
                          color: 'var(--status-error)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Delete Confirmation Dialog ──────────────────────────────────── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setDeleteId(null)}
        >
          <div
            className="card-flat"
            style={{ padding: 20, width: 360 }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', marginBottom: 4 }}>
              この機械を削除しますか？
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
              Bạn có chắc muốn xóa máy này? Thao tác không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="h-[32px] px-3 text-[12px] rounded"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="h-[32px] px-3 text-[12px] rounded font-bold"
                style={{
                  background: 'var(--status-error)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Modal ────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', paddingTop: 60, overflowY: 'auto' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="card-flat"
            style={{ padding: 0, width: 540, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)',
              }}
            >
              <div>
                <h2
                  className="text-[14px] font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
                >
                  {editingId ? '機械を編集' : '新規機械追加'}
                </h2>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {editingId ? 'Chỉnh sửa máy' : 'Thêm máy mới'}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex items-center justify-center rounded"
                style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 16 }}>
              <div className="grid grid-cols-2 gap-3">
                {/* Machine Code */}
                <FieldGroup label="機械コード" sub="Mã máy" required>
                  <input
                    type="text"
                    value={form.machine_code}
                    onChange={e => setForm(f => ({ ...f, machine_code: e.target.value }))}
                    placeholder="M-01"
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>

                {/* Machine Name */}
                <FieldGroup label="機械名" sub="Tên máy" required>
                  <input
                    type="text"
                    value={form.machine_name}
                    onChange={e => setForm(f => ({ ...f, machine_name: e.target.value }))}
                    placeholder="1号機 (M682)"
                    className="form-input"
                    style={{ fontFamily: 'var(--font-jp)' }}
                  />
                </FieldGroup>

                {/* Machine Type */}
                <FieldGroup label="機種" sub="Loại máy" required>
                  <select
                    value={form.machine_type}
                    onChange={e => setForm(f => ({ ...f, machine_type: e.target.value as MachineType }))}
                    className="form-input"
                  >
                    {(Object.keys(MACHINE_TYPE_LABELS) as MachineType[]).map(k => (
                      <option key={k} value={k}>{MACHINE_TYPE_LABELS[k].ja} / {MACHINE_TYPE_LABELS[k].vi}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Machine Group */}
                <FieldGroup label="グループ" sub="Nhóm" required>
                  <select
                    value={form.machine_group}
                    onChange={e => setForm(f => ({ ...f, machine_group: e.target.value as MachineGroup }))}
                    className="form-input"
                  >
                    {(Object.keys(GROUP_LABELS) as MachineGroup[]).map(k => (
                      <option key={k} value={k}>{GROUP_LABELS[k].ja} / {GROUP_LABELS[k].vi}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Location */}
                <FieldGroup label="設置場所" sub="Vị trí" required>
                  <select
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value as Location }))}
                    className="form-input"
                  >
                    {(Object.keys(LOCATION_LABELS) as Location[]).map(k => (
                      <option key={k} value={k}>{LOCATION_LABELS[k].ja} / {LOCATION_LABELS[k].vi}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Manufacturer */}
                <FieldGroup label="メーカー" sub="Nhà SX">
                  <input
                    type="text"
                    value={form.manufacturer || ''}
                    onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value || null }))}
                    placeholder="—"
                    className="form-input"
                  />
                </FieldGroup>

                {/* Model */}
                <FieldGroup label="型式" sub="Model">
                  <input
                    type="text"
                    value={form.model || ''}
                    onChange={e => setForm(f => ({ ...f, model: e.target.value || null }))}
                    placeholder="—"
                    className="form-input"
                  />
                </FieldGroup>

                {/* Active toggle */}
                <FieldGroup label="状態" sub="Trạng thái">
                  <label className="flex items-center gap-2 h-[32px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                      style={{ accentColor: 'var(--status-success)' }}
                    />
                    <span className="text-[12px]" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                      {form.is_active ? '稼働中' : '停止'}
                    </span>
                  </label>
                </FieldGroup>
              </div>

              {/* Separator */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px 0' }} />

              {/* Size Fields */}
              <p className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)', marginBottom: 8, fontFamily: 'var(--font-jp)' }}>
                最大サイズ <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Kích thước tối đa (mm)</span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                <FieldGroup label="金型長さ" sub="Chiều dài khuôn" required>
                  <input
                    type="number"
                    value={form.max_mold_length}
                    onChange={e => setForm(f => ({ ...f, max_mold_length: Number(e.target.value) }))}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>
                <FieldGroup label="金型幅" sub="Chiều rộng khuôn" required>
                  <input
                    type="number"
                    value={form.max_mold_width}
                    onChange={e => setForm(f => ({ ...f, max_mold_width: Number(e.target.value) }))}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>
                <FieldGroup label="シート幅" sub="Khổ nhựa">
                  <input
                    type="number"
                    value={form.max_sheet_width ?? ''}
                    onChange={e => setForm(f => ({ ...f, max_sheet_width: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="—"
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>
              </div>

              {/* Notes */}
              <div style={{ marginTop: 12 }}>
                <FieldGroup label="備考" sub="Ghi chú">
                  <textarea
                    value={form.notes || ''}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))}
                    rows={2}
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </FieldGroup>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-2"
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)',
              }}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="btn"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.machine_code || !form.machine_name}
                className="btn btn-primary"
                style={{
                  opacity: saving || !form.machine_code || !form.machine_name ? 0.6 : 1,
                  cursor: (!form.machine_code || !form.machine_name) ? 'not-allowed' : 'pointer',
                }}
              >
                {saving && <Loader2 size={12} className="animate-spin" />}
                <Save size={14} />
                <span style={{ fontFamily: 'var(--font-jp)' }}>
                  {editingId ? '更新' : '登録'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Field Group Helper ──────────────────────────────────────────────────────

function FieldGroup({
  label, sub, required, children,
}: {
  label: string
  sub: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="form-label">
        <span className="ja">{label} {required && <span style={{ color: 'var(--status-error)' }}>*</span>}</span>
        <span className="vi">{sub}</span>
      </label>
      {children}
    </div>
  )
}
