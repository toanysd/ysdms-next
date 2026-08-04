'use client'

// @ts-nocheck
import { useTranslations } from 'next-intl'

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

// ─── Label Maps & Helpers ──────────────────────────────────────────────────

const MACHINE_TYPE_STYLES: Record<MachineType, { color: string; bg: string; border: string }> = {
  VACUUM_FORMING:   { color: 'var(--status-info)',    bg: 'color-mix(in srgb, var(--status-info) 12%, transparent)',    border: 'color-mix(in srgb, var(--status-info) 25%, transparent)' },
  PRESSURE_FORMING: { color: 'var(--accent)',         bg: 'color-mix(in srgb, var(--accent) 12%, transparent)',         border: 'color-mix(in srgb, var(--accent) 25%, transparent)' },
  TRIMMING_PRESS:   { color: 'var(--status-warning)', bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)', border: 'color-mix(in srgb, var(--status-warning) 25%, transparent)' },
  CNC_ROUTER:       { color: 'var(--status-success)', bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)', border: 'color-mix(in srgb, var(--status-success) 25%, transparent)' },
  OTHER:            { color: 'var(--text-muted)',     bg: 'color-mix(in srgb, var(--text-muted) 12%, transparent)',     border: 'color-mix(in srgb, var(--text-muted) 25%, transparent)' },
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
  const t = useTranslations()
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

  const getTypeLabel = (type: MachineType) => {
    switch (type) {
      case 'VACUUM_FORMING': return '真空成形 (Vacuum)'
      case 'PRESSURE_FORMING': return '圧空成形 (Pressure)'
      case 'TRIMMING_PRESS': return 'トリミングプレス (Press)'
      case 'CNC_ROUTER': return 'CNCルーター'
      default: return 'その他'
    }
  }

  const getLocationLabel = (loc: Location) => {
    switch (loc) {
      case '1F_FACTORY': return '1F 工場'
      case '2F_OFFICE': return '2F 事務所'
      case 'MOLD_STORAGE': return '金型倉庫'
      case 'WAREHOUSE': return '倉庫'
      default: return loc
    }
  }

  const getGroupLabel = (group: MachineGroup) => {
    switch (group) {
      case 'MAIN': return 'メイン (Main)'
      case 'SUB': return 'サブ (Sub)'
      case 'CNC': return 'CNC'
      case 'PRESS': return 'プレス (Press)'
      default: return group
    }
  }

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
    else setMachines((data || []) as Machine[])
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterGroup, supabase])

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
    const style = MACHINE_TYPE_STYLES[type] || MACHINE_TYPE_STYLES.OTHER
    return (
      <span
        className="inline-flex items-center px-[6px] py-[1px] rounded-full text-[10px] font-bold whitespace-nowrap"
        style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
      >
        {getTypeLabel(type)}
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
      {active ? t('Master.operating') : t('Master.stoppedMaintenance')}
    </span>
  )

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cog size={18} style={{ color: 'var(--accent)' }} />
          <div>
            <h1
              className="text-[15px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
            >
              {t('Master.machineMaster')}
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t('Master.machineMasterSub')}
            </span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="btn btn-primary h-[32px] px-3 text-[12px] font-bold rounded flex items-center gap-1 cursor-pointer"
        >
          <Plus size={14} />
          <span>{t('Common.addNew')}</span>
        </button>
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-flat" style={{ padding: '12px 16px', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('Master.totalMachines')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{machines.length}</div>
        </div>
        <div className="card-flat" style={{ padding: '12px 16px', borderLeft: '4px solid var(--status-success)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('Master.operating')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: 'var(--status-success)' }}>
            {machines.filter(m => m.is_active).length}
          </div>
        </div>
        <div className="card-flat" style={{ padding: '12px 16px', borderLeft: '4px solid var(--status-error)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('Master.stoppedMaintenance')}</div>
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
            {t('Master.filter')}
          </span>

          {/* Machine Type filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as MachineType | '')}
              className="form-input h-[28px] pl-2 pr-6 text-[11px] rounded appearance-none cursor-pointer"
            >
              <option value="">{t('Master.filterMachineType')}</option>
              {(['VACUUM_FORMING', 'PRESSURE_FORMING', 'TRIMMING_PRESS', 'CNC_ROUTER', 'OTHER'] as MachineType[]).map(k => (
                <option key={k} value={k}>{getTypeLabel(k)}</option>
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
              className="form-input h-[28px] pl-2 pr-6 text-[11px] rounded appearance-none cursor-pointer"
            >
              <option value="">{t('Master.filterMachineGroup')}</option>
              {(['MAIN', 'SUB', 'CNC', 'PRESS'] as MachineGroup[]).map(k => (
                <option key={k} value={k}>{getGroupLabel(k)}</option>
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
              className="btn btn-secondary h-[24px] px-2 text-[10px] rounded flex items-center gap-1 cursor-pointer"
            >
              <X size={10} /> {t('Common.clear')}
            </button>
          )}

          <span className="text-[10px] ml-auto font-mono" style={{ color: 'var(--text-muted)' }}>
            {machines.length}
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
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('Master.ma')}</th>
                <th>{t('Master.ten')}</th>
                <th>{t('Master.loai')}</th>
                <th>{t('Master.family')}</th>
                <th>{t('Master.maxSize')}</th>
                <th>NSX / Model</th>
                <th>{t('Master.locationInFactory')}</th>
                <th style={{ textAlign: 'center' }}>{t('Master.trangThai')}</th>
                <th style={{ textAlign: 'center' }}>{t('Master.thaoTac')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    <Loader2 size={16} className="animate-spin inline-block mr-2" />
                    {t('Common.loading')}
                  </td>
                </tr>
              )}
              {!loading && machines.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    {t('Common.noData')}
                  </td>
                </tr>
              )}
              {!loading && machines.map((m) => (
                <tr key={m.machine_id}>
                  {/* Code */}
                  <td className="font-mono font-bold text-[13px]" style={{ color: 'var(--accent)' }}>
                    {m.machine_code}
                  </td>

                  {/* Name */}
                  <td>
                    <div className="font-bold text-[13px]" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                      {m.machine_name}
                    </div>
                  </td>

                  {/* Type badge */}
                  <td>
                    <TypeBadge type={m.machine_type} />
                  </td>

                  {/* Group */}
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-bold text-[12px]">
                      {getGroupLabel(m.machine_group)}
                    </span>
                  </td>

                  {/* Max Size */}
                  <td className="font-mono font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                    {m.max_mold_length && m.max_mold_width
                      ? `${m.max_mold_length} × ${m.max_mold_width} mm`
                      : '—'}
                  </td>
                  {/* Manufacturer / Model */}
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {m.manufacturer || m.model ? (
                      <span className="font-bold text-[12px]">
                        {[m.manufacturer, m.model].filter(Boolean).join(' / ')}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-bold text-[12px]">
                      {getLocationLabel(m.location)}
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
              この操作は取り消せません。
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
                <FieldGroup label="機械コード" required>
                  <input
                    type="text"
                    value={form.machine_code}
                    onChange={e => setForm(f => ({ ...f, machine_code: e.target.value }))}
                    placeholder="MCH-01"
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>

                {/* Machine Name */}
                <FieldGroup label="機械名" required>
                  <input
                    type="text"
                    value={form.machine_name}
                    onChange={e => setForm(f => ({ ...f, machine_name: e.target.value }))}
                    placeholder="成形機 1号機"
                    className="form-input"
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Machine Type */}
                <FieldGroup label="機種" required>
                  <select
                    value={form.machine_type}
                    onChange={e => setForm(f => ({ ...f, machine_type: e.target.value as MachineType }))}
                    className="form-input"
                  >
                    {(['VACUUM_FORMING', 'PRESSURE_FORMING', 'TRIMMING_PRESS', 'CNC_ROUTER', 'OTHER'] as MachineType[]).map(k => (
                      <option key={k} value={k}>{getTypeLabel(k)}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Machine Group */}
                <FieldGroup label="グループ" required>
                  <select
                    value={form.machine_group}
                    onChange={e => setForm(f => ({ ...f, machine_group: e.target.value as MachineGroup }))}
                    className="form-input"
                  >
                    {(['MAIN', 'SUB', 'CNC', 'PRESS'] as MachineGroup[]).map(k => (
                      <option key={k} value={k}>{getGroupLabel(k)}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Location */}
                <FieldGroup label="設置場所" required>
                  <select
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value as Location }))}
                    className="form-input"
                  >
                    {(['1F_FACTORY', '2F_OFFICE', 'MOLD_STORAGE', 'WAREHOUSE'] as Location[]).map(k => (
                      <option key={k} value={k}>{getLocationLabel(k)}</option>
                    ))}
                  </select>
                </FieldGroup>
              </div>

              {/* Manufacturer & Model */}
              <div className="grid grid-cols-3 gap-3">
                <FieldGroup label="メーカー">
                  <input
                    type="text"
                    value={form.manufacturer || ''}
                    onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value || null }))}
                    placeholder="浅野研究所 等"
                    className="form-input"
                  />
                </FieldGroup>
                <FieldGroup label="型式">
                  <input
                    type="text"
                    value={form.model || ''}
                    onChange={e => setForm(f => ({ ...f, model: e.target.value || null }))}
                    placeholder="FK-02S"
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>
                {/* Active toggle */}
                <FieldGroup label="状態">
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
                最大サイズ (mm)
              </p>
              <div className="grid grid-cols-3 gap-3">
                <FieldGroup label="金型長さ" required>
                  <input
                    type="number"
                    value={form.max_mold_length}
                    onChange={e => setForm(f => ({ ...f, max_mold_length: Number(e.target.value) }))}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>
                <FieldGroup label="金型幅" required>
                  <input
                    type="number"
                    value={form.max_mold_width}
                    onChange={e => setForm(f => ({ ...f, max_mold_width: Number(e.target.value) }))}
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>
                <FieldGroup label="シート幅">
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
                <FieldGroup label="備考">
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
  sub?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="form-label">
        {label} {sub && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>{sub}</span>}
        {required && <span style={{ color: 'var(--status-error)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  )
}
