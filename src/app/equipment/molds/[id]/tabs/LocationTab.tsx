import { MapPin, ArrowDownUp, Clock, User, Building2, LogIn, LogOut, Navigation } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
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
        .eq('physical_mold_id', mold.physical_mold_id)
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
        .eq('asset_id', mold.physical_mold_id)
        .order('moved_at', { ascending: false })
        .range(0, 29),
    ])
    setStatusLogs((statusRes.data as any[]) || [])
    setLocationLogs((locRes.data as any[]) || [])
    setLoading(false)
  }, [mold.physical_mold_id, supabase])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const fetchLookups = async () => {
    if (employees.length === 0) {
      const { data: empData } = await supabase.from('employees').select('employee_id, employee_code, employee_name').order('employee_name')
      if (empData) setEmployees(empData)
    }
    if (rackLayers.length === 0) {
      const { data: rackData } = await supabase.from('rack_layers').select('id, layer_code, racks(rack_code)')
      // sorting logic could be added
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
    if (!selectedEmp) return alert('Nhân viên là bắt buộc / 担当者を入力してください')
    setSaving(true)
    
    const { error } = await supabase.from('equipment_status_logs').insert({
      physical_mold_id: mold.physical_mold_id,
      status: checkModalType,
      employee_id: selectedEmp,
      notes: notes || null
    })
    
    if (!error) {
      const usage = checkModalType === 'IN' ? 'IN_STOCK' : 'OUT_OF_STOCK'
      await supabase.from('physical_molds').update({ usage_status: usage }).eq('physical_mold_id', mold.physical_mold_id)
      setCheckModalType(null)
      window.location.reload()
    } else {
      alert(error.message)
      setSaving(false)
    }
  }

  const handleLocChange = async () => {
    if (!selectedRackLayer || !selectedEmp) return alert('Vị trí và Nhân viên là bắt buộc / 位置と担当者を入力してください')
    if (selectedRackLayer === mold.current_rack_layer_id) return alert('Vị trí không thay đổi / 位置が変わっていません')
    setSaving(true)
    
    const { error } = await supabase.from('asset_location_logs').insert({
      asset_id: mold.physical_mold_id,
      asset_type: 'MOLD',
      old_rack_layer_id: mold.current_rack_layer_id,
      new_rack_layer_id: selectedRackLayer,
      moved_by: selectedEmp,
      notes: notes || null
    })
    
    if (!error) {
      await supabase.from('physical_molds').update({ current_rack_layer_id: selectedRackLayer }).eq('physical_mold_id', mold.physical_mold_id)
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
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
            <ArrowDownUp size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            入出庫履歴 <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Lịch sử nhập xuất</span>
          </h3>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn" style={{ fontSize: 10, padding: '2px 8px', borderColor: 'var(--status-success)', color: 'var(--status-success)' }} onClick={() => openCheckModal('IN')}>
              <LogIn size={12} />
              入庫 IN
            </button>
            <button className="btn" style={{ fontSize: 10, padding: '2px 8px', borderColor: 'var(--status-error)', color: 'var(--status-error)' }} onClick={() => openCheckModal('OUT')}>
              <LogOut size={12} />
              出庫 OUT
            </button>
          </div>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>読み込み中...</div>
          ) : statusLogs.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
              記録なし / Không có dữ liệu
            </div>
          ) : (
            statusLogs.map(log => (
              <div key={log.log_id} style={{
                padding: '6px 14px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  display: 'inline-block', width: 32, textAlign: 'center',
                  padding: '1px 0', borderRadius: 4, fontSize: 10, fontWeight: 800,
                  color: log.status === 'IN' ? 'var(--status-success)' : 'var(--status-error)',
                  background: log.status === 'IN'
                    ? 'color-mix(in srgb, var(--status-success) 12%, transparent)'
                    : 'color-mix(in srgb, var(--status-error) 12%, transparent)',
                }}>
                  {log.status}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 70 }}>
                  {log.logged_at ? new Date(log.logged_at).toLocaleDateString('ja-JP') : '—'}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                  {log.employees?.employee_name || ''}
                </span>
                {log.notes && (
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 'auto' }}>
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
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
            <MapPin size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            位置変更履歴 <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Lịch sử thay đổi vị trí</span>
          </h3>
          <button className="btn" style={{ fontSize: 10, padding: '2px 8px', borderColor: 'var(--accent)', color: 'var(--accent)' }} onClick={openLocModal}>
            <Navigation size={12} />
            位置変更
          </button>
        </div>
        
        {/* Current Location Highlight */}
        <div style={{ padding: '8px 14px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jp)' }}>現在位置:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
            {mold.rack_layers ? `${mold.rack_layers.racks?.rack_code || '?'}-${mold.rack_layers.layer_code}` : '未登録 (Chưa đăng ký)'}
          </span>
        </div>

        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>読み込み中...</div>
          ) : locationLogs.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
              記録なし / Không có dữ liệu
            </div>
          ) : (
            locationLogs.map(log => (
              <div key={log.id} style={{
                padding: '6px 14px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 70 }}>
                  {log.moved_at ? new Date(log.moved_at).toLocaleDateString('ja-JP') : '—'}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                  {log.old_rack_layer
                    ? `${log.old_rack_layer.racks?.rack_code || '?'}-${log.old_rack_layer.layer_code}`
                    : '—'
                  }
                </span>
                <span style={{ fontSize: 10, color: 'var(--accent)' }}>→</span>
                <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700 }}>
                  {log.new_rack_layer
                    ? `${log.new_rack_layer.racks?.rack_code || '?'}-${log.new_rack_layer.layer_code}`
                    : '—'
                  }
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  {log.employees?.employee_name || ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Check IN/OUT Modal */}
      {checkModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCheckModalType(null)}>
          <div className="bg-white rounded-lg shadow-lg w-[400px]" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: checkModalType === 'IN' ? 'var(--status-success)' : 'var(--status-error)' }}>
                {checkModalType === 'IN' ? '入庫 (Check IN)' : '出庫 (Check OUT)'}
              </h3>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>担当者 / Người thực hiện <span style={{ color: 'red' }}>*</span></label>
                <select className="form-input" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
                  <option value="">選択してください</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_code} - {e.employee_name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>備考 / Ghi chú</label>
                <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setCheckModalType(null)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCheckInOut} disabled={saving}>
                {saving ? '保存中...' : '保存 / Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {locModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setLocModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[400px]" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                位置変更 (Change Location)
              </h3>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>移動先 / Vị trí mới <span style={{ color: 'red' }}>*</span></label>
                <select className="form-input" value={selectedRackLayer} onChange={e => setSelectedRackLayer(e.target.value)}>
                  <option value="">選択してください</option>
                  {rackLayers.map(r => <option key={r.id} value={r.id}>{r.racks?.rack_code}-{r.layer_code}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>担当者 / Người thực hiện <span style={{ color: 'red' }}>*</span></label>
                <select className="form-input" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
                  <option value="">選択してください</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_code} - {e.employee_name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>備考 / Ghi chú</label>
                <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setLocModalOpen(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleLocChange} disabled={saving}>
                {saving ? '保存中...' : '保存 / Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
