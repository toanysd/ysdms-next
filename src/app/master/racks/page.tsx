'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Layers,
  Trash2,
  MapPin,
  Package,
  X,
  Loader2,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type RackLayer = {
  id: string
  rack_id: string
  layer_number: number
  layer_code: string
  notes: string | null
}

type Rack = {
  id: string
  rack_code: string
  rack_name: string
  location_in_factory: string
  notes: string | null
  created_at: string
  rack_layers: RackLayer[]
}

const LOCATIONS = [
  { value: 'MOLD_STORAGE', key: 'locMoldStorage' },
  { value: '1F_FACTORY', key: 'loc1FFactory' },
  { value: 'WAREHOUSE', key: 'locWarehouse' },
] as const

type LocationValue = (typeof LOCATIONS)[number]['value']

function getLocationLabel(loc: string) {
  return LOCATIONS.find((l) => l.value === loc) ?? { value: loc, key: loc }
}

function getLocationColor(loc: string): string {
  switch (loc) {
    case 'MOLD_STORAGE':
      return 'var(--status-info)'
    case '1F_FACTORY':
      return 'var(--status-success)'
    case 'WAREHOUSE':
      return 'var(--status-warning)'
    default:
      return 'var(--text-muted)'
  }
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function RacksPage() {
  const tMaster = useTranslations('Master')
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const [racks, setRacks] = useState<Rack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Modal state
  const [showAddRack, setShowAddRack] = useState(false)
  const [addLayerRackId, setAddLayerRackId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // New rack form
  const [newRack, setNewRack] = useState({ rack_code: '', rack_name: '', location_in_factory: 'MOLD_STORAGE' as LocationValue, notes: '' })

  /* ---- Fetch ---- */
  const fetchRacks = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('racks')
      .select('*, rack_layers(*)')
      .order('rack_code')

    if (err) {
      setError(err.message)
    } else {
      // Sort layers within each rack
      const sorted = (data as Rack[]).map((r) => ({
        ...r,
        rack_layers: [...r.rack_layers].sort((a, b) => a.layer_number - b.layer_number),
      }))
      setRacks(sorted)
      setError(null)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchRacks()
  }, [fetchRacks])

  /* ---- Handlers ---- */
  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /* ---- Add Rack ---- */
  const handleAddRack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRack.rack_code.trim()) return
    setSaving(true)

    const { error: err } = await supabase.from('racks').insert([
      {
        rack_code: newRack.rack_code.trim().toUpperCase(),
        rack_name: newRack.rack_name.trim() || newRack.rack_code.trim().toUpperCase(),
        location_in_factory: newRack.location_in_factory,
        notes: newRack.notes.trim() || null,
      },
    ])

    setSaving(false)
    if (err) {
      alert('Error: ' + err.message)
    } else {
      setNewRack({ rack_code: '', rack_name: '', location_in_factory: 'MOLD_STORAGE', notes: '' })
      setShowAddRack(false)
      fetchRacks()
    }
  }

  /* ---- Add Layer ---- */
  const handleAddLayer = async (rackId: string, layerNumber: number, layerCode: string, notes: string) => {
    setSaving(true)

    const { error: err } = await supabase.from('rack_layers').insert([
      {
        rack_id: rackId,
        layer_number: layerNumber,
        layer_code: layerCode.trim().toUpperCase(),
        notes: notes.trim() || null,
      },
    ])

    setSaving(false)
    if (err) {
      alert('Error: ' + err.message)
    } else {
      setAddLayerRackId(null)
      fetchRacks()
    }
  }

  /* ---- Delete Layer ---- */
  const handleDeleteLayer = async (layerId: string) => {
    if (!confirm(tMaster('deleteLayerConfirm'))) return
    const { error: err } = await supabase.from('rack_layers').delete().eq('id', layerId)
    if (err) { alert('Error: ' + err.message); return }
    fetchRacks()
  }

  /* ---- Delete Rack ---- */
  const handleDeleteRack = async (rack: Rack) => {
    if (rack.rack_layers.length > 0) {
      alert(tMaster('deleteRackConfirm'))
      return
    }
    if (!confirm(tMaster('deleteRackConfirm'))) return
    const { error: err } = await supabase.from('racks').delete().eq('id', rack.id)
    if (err) { alert('Error: ' + err.message); return }
    fetchRacks()
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="flex flex-col gap-3">
      {/* ---- Page Header ---- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h1
              className="text-[15px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
            >
              {tMaster('rackMaster')}
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {tMaster('rackMasterSub')}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddRack(true)}
          className="btn btn-primary h-[32px] px-3 text-[12px] rounded flex items-center gap-1.5 font-bold cursor-pointer"
        >
          <Plus size={14} />
          <span>{tMaster('addRack')}</span>
        </button>
      </div>

      {/* ---- Summary Bar ---- */}
      <div
        className="card-flat flex items-center gap-6"
        style={{ padding: '10px 16px' }}
      >
        {LOCATIONS.map((loc) => {
          const count = racks.filter((r) => r.location_in_factory === loc.value).length
          return (
            <div key={loc.value} className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: getLocationColor(loc.value),
                }}
              />
              <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {tMaster(loc.key)}
              </span>
              <span
                className="text-[12px] font-mono font-bold ml-1"
                style={{ color: getLocationColor(loc.value) }}
              >
                {count}
              </span>
            </div>
          )
        })}
        <div className="flex-1" />
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {tMaster('totalRacks')}: <strong style={{ color: 'var(--text-primary)' }} className="font-mono">{racks.length}</strong>
        </span>
      </div>

      {/* ---- Loading / Error ---- */}
      {loading && (
        <div className="card-flat flex items-center justify-center" style={{ padding: '40px 16px' }}>
          <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
          <span className="text-[12px] ml-2" style={{ color: 'var(--text-muted)' }}>{tCommon('loading')}</span>
        </div>
      )}

      {error && (
        <div
          className="card-flat text-center"
          style={{ padding: '16px', color: 'var(--status-error)', fontSize: 12 }}
        >
          {error}
        </div>
      )}

      {/* ---- Rack Grid ---- */}
      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 12,
          }}
        >
          {racks.length === 0 && (
            <div
              className="card-flat text-center"
              style={{ padding: '40px 16px', gridColumn: '1 / -1' }}
            >
              <Package size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {tMaster('noRacks')}
              </p>
            </div>
          )}

          {racks.map((rack) => {
            const expanded = expandedIds.has(rack.id)
            const loc = getLocationLabel(rack.location_in_factory)
            const locColor = getLocationColor(rack.location_in_factory)

            return (
              <div
                key={rack.id}
                className="card-flat"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderLeft: `3px solid ${locColor}`,
                }}
              >
                {/* ---- Rack Header ---- */}
                <div
                  onClick={() => toggle(rack.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 12px 10px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {expanded ? (
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  ) : (
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  )}

                  {/* Code & Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[14px] font-bold font-mono"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {rack.rack_code}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {rack.rack_name}
                      </span>
                    </div>
                    {rack.notes && (
                      <div
                        className="text-[10px] mt-0.5 truncate"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {rack.notes}
                      </div>
                    )}
                  </div>

                  {/* Layer count badge */}
                  <div
                    className="flex items-center gap-1 rounded-full"
                    style={{
                      padding: '2px 8px',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0,
                    }}
                  >
                    <Layers size={11} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {rack.rack_layers.length}
                    </span>
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{tMaster('layerUnit')}</span>
                  </div>

                  {/* Location badge */}
                  <div
                    className="rounded-full flex items-center gap-1"
                    style={{
                      padding: '2px 8px',
                      background: `${locColor}18`,
                      border: `1px solid ${locColor}40`,
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={10} style={{ color: locColor }} />
                    <span className="text-[10px] font-bold" style={{ color: locColor }}>
                      {tMaster(loc.key)}
                    </span>
                  </div>
                </div>

                {/* ---- Expanded Layers ---- */}
                {expanded && (
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-2)',
                    }}
                  >
                    {/* Layer list — physical rack visualization */}
                    {rack.rack_layers.length === 0 ? (
                      <div
                        className="text-center text-[11px]"
                        style={{ padding: '16px 12px', color: 'var(--text-muted)' }}
                      >
                        {tMaster('noLayers')}
                      </div>
                    ) : (
                      <div style={{ padding: '6px 12px 4px' }}>
                        {rack.rack_layers.map((layer, idx) => (
                          <div
                            key={layer.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '5px 8px',
                              marginBottom: 3,
                              background: idx % 2 === 0 ? 'var(--bg-surface)' : 'transparent',
                              borderRadius: 4,
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {/* Visual shelf icon */}
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 4,
                                background: `${locColor}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <span className="text-[10px] font-bold" style={{ color: locColor }}>
                                L{layer.layer_number}
                              </span>
                            </div>

                            <span
                              className="text-[12px] font-mono font-bold"
                              style={{ color: 'var(--text-primary)', flex: 1 }}
                            >
                              {layer.layer_code}
                            </span>

                            {layer.notes && (
                              <span
                                className="text-[10px] truncate"
                                style={{ color: 'var(--text-muted)', maxWidth: 100 }}
                              >
                                {layer.notes}
                              </span>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteLayer(layer.id)
                              }}
                              className="rounded"
                              style={{
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                                flexShrink: 0,
                              }}
                              title={tMaster('deleteLayer')}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 12px 8px',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setAddLayerRackId(rack.id)
                        }}
                        disabled={saving}
                        className="rounded flex items-center gap-1"
                        style={{
                          height: 26,
                          padding: '0 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          border: '1px dashed var(--border-default)',
                          background: 'var(--bg-surface)',
                          color: 'var(--accent)',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={12} />
                        <span>{tMaster('addLayer')}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRack(rack)
                        }}
                        className="rounded flex items-center gap-1"
                        style={{
                          height: 26,
                          padding: '0 8px',
                          fontSize: 11,
                          border: '1px solid var(--border-default)',
                          background: 'transparent',
                          color: 'var(--status-error)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={11} />
                        <span>{tMaster('deleteRack')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ================================================================ */}
      {/*  Add Rack Modal                                                   */}
      {/* ================================================================ */}
      {showAddRack && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
          }}
          onClick={() => setShowAddRack(false)}
        >
          <div
            className="card-flat"
            style={{
              width: 420,
              maxWidth: '90vw',
              padding: 0,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)',
              }}
            >
              <div>
                <div
                  className="text-[13px] font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tMaster('addNewRack')}
                </div>
              </div>
              <button
                onClick={() => setShowAddRack(false)}
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  borderRadius: 4,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Rack code */}
              <div>
                <label
                  className="text-[11px] font-bold block mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {tMaster('rackCode')}
                </label>
                <input
                  type="text"
                  value={newRack.rack_code}
                  onChange={(e) => setNewRack((p) => ({ ...p, rack_code: e.target.value }))}
                  placeholder={tMaster('exampleRackCode')}
                  className="rounded"
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 10px',
                    fontSize: 13,
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Rack name */}
              <div>
                <label
                  className="text-[11px] font-bold block mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {tMaster('rackName')}
                </label>
                <input
                  type="text"
                  value={newRack.rack_name}
                  onChange={(e) => setNewRack((p) => ({ ...p, rack_name: e.target.value }))}
                  placeholder={tMaster('exampleRackName')}
                  className="rounded"
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 10px',
                    fontSize: 13,
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Location */}
              <div>
                <label
                  className="text-[11px] font-bold block mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {tMaster('locationInFactory')}
                </label>
                <select
                  value={newRack.location_in_factory}
                  onChange={(e) => setNewRack((p) => ({ ...p, location_in_factory: e.target.value as LocationValue }))}
                  className="rounded"
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 8px',
                    fontSize: 12,
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {tMaster(loc.key)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  className="text-[11px] font-bold block mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {tCommon('notes')}
                </label>
                <input
                  type="text"
                  value={newRack.notes}
                  onChange={(e) => setNewRack((p) => ({ ...p, notes: e.target.value }))}
                  placeholder={tMaster('optional')}
                  className="rounded"
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 10px',
                    fontSize: 12,
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                padding: '12px 16px',
                borderTop: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)',
              }}
            >
              <button
                onClick={() => setShowAddRack(false)}
                className="rounded"
                style={{
                  height: 32,
                  padding: '0 14px',
                  fontSize: 12,
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleAddRack}
                disabled={saving || !newRack.rack_code.trim() || !newRack.rack_name.trim()}
                className="rounded flex items-center gap-1.5"
                style={{
                  height: 32,
                  padding: '0 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  border: 'none',
                  background: !newRack.rack_code.trim() || !newRack.rack_name.trim() ? 'var(--border-default)' : 'var(--accent)',
                  color: '#fff',
                  cursor: !newRack.rack_code.trim() || !newRack.rack_name.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {saving && <Loader2 size={12} className="animate-spin" />}
                {tCommon('add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
