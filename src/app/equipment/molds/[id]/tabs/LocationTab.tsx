'use client'

import { MapPin, ArrowDownUp, Clock, User, Building2, LogIn, LogOut, Navigation } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { MoldDetailData } from '../page'

type StatusLog = {
  log_id: string
  status: string | null
  logged_at: string | null
  notes: string | null
  destination_id: string | null
  employee_id: string | null
  destinations?: { destination_name: string } | null
  employees?: { employee_name: string; employee_code: string } | null
}

type LocationLog = {
  id: string
  moved_at: string | null
  notes: string | null
  moved_by: string | null
  old_rack_layer_id: string | null
  new_rack_layer_id: string | null
  old_rack_layer?: { layer_code: string; racks: { rack_code: string } | null } | null
  new_rack_layer?: { layer_code: string; racks: { rack_code: string } | null } | null
  employees?: { employee_name: string } | null
}

type Employee = { employee_id: string; employee_code: string; employee_name: string }
type RackLayer = { id: string; layer_code: string; racks: { rack_code: string } | null }

export function LocationTab({ mold }: { mold: MoldDetailData }) {
  const t = useTranslations()
  const supabase = createClient()
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([])
  const [locationLogs, setLocationLogs] = useState<LocationLog[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [employees, setEmployees] = useState<Employee[]>([])
  const [rackLayers, setRackLayers] = useState<RackLayer[]>([])
  
  const [checkModalType, setCheckModalType] = useState<'IN' | 'OUT' | null>(null)
  const [locModalOpen, setLocModalOpen] = useState(false)
  
  const [selectedEmp, setSelectedEmp] = useState('')
  const [selectedRackLayer, setSelectedRackLayer] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const [statusRes, locRes] = await Promise.all([
      supabase
        .from('equipment_status_logs')
        .select('*, destinations(destination_name), employees(employee_name, employee_code)')
        // @ts-ignore - TODO: fix in Phase D equipment migration
        .eq('legacy_mold_id', mold.equipment_id)
        .order('logged_at', { ascending: false })
        .range(0, 29),
      supabase
        .from('asset_location_logs')
        .select(`
          *,
          old_rack_layer:rack_layers!asset_location_logs_old_rack_layer_id_fkey(layer_code, racks(rack_code)),
          new_rack_layer:rack_layers!asset_location_logs_new_rack_layer_id_fkey(layer_code, racks(rack_code)),
          employees!asset_location_logs_moved_by_fkey(employee_name)
        `)
        .eq('asset_id', mold.equipment_id)
        .order('moved_at', { ascending: false })
        .range(0, 29),
    ])
    setStatusLogs((statusRes.data as any[]) || [])
    setLocationLogs((locRes.data as any[]) || [])
    setLoading(false)
  }, [mold.equipment_id, supabase])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const fetchLookups = async () => {
    if (employees.length === 0) {
      const { data: empData } = await supabase.from('employees').select('employee_id, employee_code, employee_name').order('employee_name')
      if (empData) setEmployees(empData)
    }
    if (rackLayers.length === 0) {
      const { data: rackData } = await supabase.from('rack_layers').select('id, layer_code, racks(rack_code)')
      if (rackData) setRackLayers(rackData as any[])
    }
  }

  const openCheckModal = (type: 'IN' | 'OUT') => {
    fetchLookups()
    setCheckModalType(type)
    setSelectedEmp('')
    setNotes('')
  }

  const openLocModal = () => {
    fetchLookups()
    setLocModalOpen(true)
    setSelectedRackLayer(mold.current_rack_layer_id || '')
    setSelectedEmp('')
    setNotes('')
  }

  const handleCheckInOut = async () => {
    if (!selectedEmp) return alert(t('Equipment.valEmployeeReq'))
    setSaving(true)
    
    const { error } = await supabase.from('equipment_status_logs').insert({
      // @ts-ignore - TODO: Phase D
      legacy_mold_id: mold.equipment_id,
      status: checkModalType || 'IN',
      employee_id: selectedEmp,
      notes: notes || null
    })
    
    if (!error) {
      const usage = checkModalType === 'IN' ? 'IN_STOCK' : 'OUT_OF_STOCK'
      await supabase.from('equipment').update({ usage_status: usage === 'IN_STOCK' ? 'IN' : 'OUT' } as any).eq('equipment_id', mold.equipment_id)
      setCheckModalType(null)
      window.location.reload()
    } else {
      alert(error.message)
      setSaving(false)
    }
  }

  const handleLocChange = async () => {
    if (!selectedRackLayer || !selectedEmp) return alert(t('Equipment.valLocAndEmpReq'))
    if (selectedRackLayer === mold.current_rack_layer_id) return alert(t('Equipment.valLocUnchanged'))
    setSaving(true)
    
    const { error } = await supabase.from('asset_location_logs').insert({
      asset_id: mold.equipment_id,
      asset_type: 'MOLD',
      old_rack_layer_id: mold.current_rack_layer_id,
      new_rack_layer_id: selectedRackLayer,
      moved_by: selectedEmp,
      notes: notes || null
    })
    
    if (!error) {
      await supabase.from('equipment').update({ current_rack_layer_id: selectedRackLayer } as any).eq('equipment_id', mold.equipment_id)
      setLocModalOpen(false)
      window.location.reload()
    } else {
      alert(error.message)
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Check IN/OUT History */}
      <div className="card-flat" style={{ padding: 0 }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            <ArrowDownUp size={14} style={{ marginRight: 6, verticalAlign: -2, color: 'var(--accent)' }} />
            {t('Equipment.checkInOutHistory')}
          </h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn text-xs font-bold" style={{ borderColor: 'var(--status-success)', color: 'var(--status-success)' }} onClick={() => openCheckModal('IN')}>
              <LogIn size={14} />
              {t('Equipment.checkIn')}
            </button>
            <button className="btn text-xs font-bold" style={{ borderColor: 'var(--status-error)', color: 'var(--status-error)' }} onClick={() => openCheckModal('OUT')}>
              <LogOut size={14} />
              {t('Equipment.checkOut')}
            </button>
          </div>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{t('Common.loading')}</div>
          ) : statusLogs.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              {t('Common.noData')}
            </div>
          ) : (
            statusLogs.map(log => (
              <div key={log.log_id} style={{
                padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span className={log.status === 'IN' ? 'badge badge--success font-mono font-bold' : 'badge badge--error font-mono font-bold'}>
                  {log.status}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 80, fontFamily: 'monospace' }}>
                  {log.logged_at ? new Date(log.logged_at).toLocaleDateString('ja-JP') : '—'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {log.employees?.employee_name || ''}
                </span>
                {log.notes && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {log.notes}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Location Change History */}
      <div className="card-flat" style={{ padding: 0 }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            <MapPin size={14} style={{ marginRight: 6, verticalAlign: -2, color: 'var(--accent)' }} />
            {t('Equipment.locationHistory')}
          </h3>
          <button className="btn btn-primary text-xs font-bold" onClick={openLocModal}>
            <Navigation size={14} />
            {t('Equipment.changeLocation')}
          </button>
        </div>
        
        {/* Current Location Highlight */}
        <div style={{ padding: '8px 14px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{t('Equipment.currentLocation')}:</span>
          <span className="font-mono font-bold text-[13px] text-[var(--accent)]">
            {mold.rack_layers ? `${mold.rack_layers.racks?.rack_code || '?'}-${mold.rack_layers.layer_code}` : t('Common.unregistered')}
          </span>
        </div>

        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{t('Common.loading')}</div>
          ) : locationLogs.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              {t('Common.noData')}
            </div>
          ) : (
            locationLogs.map(log => (
              <div key={log.id} style={{
                padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 80, fontFamily: 'monospace' }}>
                  {log.moved_at ? new Date(log.moved_at).toLocaleDateString('ja-JP') : '—'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>
                  {log.old_rack_layer
                    ? `${log.old_rack_layer.racks?.rack_code || '?'}-${log.old_rack_layer.layer_code}`
                    : '—'
                  }
                </span>
                <span style={{ fontSize: 12, color: 'var(--accent)' }}>→</span>
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace' }}>
                  {log.new_rack_layer
                    ? `${log.new_rack_layer.racks?.rack_code || '?'}-${log.new_rack_layer.layer_code}`
                    : '—'
                  }
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  {log.employees?.employee_name || ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Check IN/OUT Modal */}
      {checkModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setCheckModalType(null)}>
          <div className="bg-[var(--bg-surface)] rounded-lg shadow-xl w-[400px] border border-[var(--border-default)]" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: checkModalType === 'IN' ? 'var(--status-success)' : 'var(--status-error)' }}>
                {checkModalType === 'IN' ? t('Equipment.checkIn') : t('Equipment.checkOut')}
              </h3>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label">{t('Equipment.operator')} <span style={{ color: 'red' }}>*</span></label>
                <select className="form-input" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
                  <option value="">{t('Common.selectPlaceholder')}</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_code} - {e.employee_name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">{t('Equipment.ghiChu')}</label>
                <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setCheckModalType(null)} disabled={saving}>{t('Common.cancel')}</button>
              <button className="btn btn-primary" onClick={handleCheckInOut} disabled={saving}>
                {saving ? t('Common.saving') : t('Common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {locModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setLocModalOpen(false)}>
          <div className="bg-[var(--bg-surface)] rounded-lg shadow-xl w-[400px] border border-[var(--border-default)]" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('Equipment.changeLocation')}
              </h3>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label">{t('Equipment.newLocation')} <span style={{ color: 'red' }}>*</span></label>
                <select className="form-input" value={selectedRackLayer} onChange={e => setSelectedRackLayer(e.target.value)}>
                  <option value="">{t('Common.selectPlaceholder')}</option>
                  {rackLayers.map(r => <option key={r.id} value={r.id}>{r.racks?.rack_code}-{r.layer_code}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">{t('Equipment.operator')} <span style={{ color: 'red' }}>*</span></label>
                <select className="form-input" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
                  <option value="">{t('Common.selectPlaceholder')}</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_code} - {e.employee_name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">{t('Equipment.ghiChu')}</label>
                <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setLocModalOpen(false)} disabled={saving}>{t('Common.cancel')}</button>
              <button className="btn btn-primary" onClick={handleLocChange} disabled={saving}>
                {saving ? t('Common.saving') : t('Common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

