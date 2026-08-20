'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  MapPin, Lock, Unlock,
  Search, Loader2
} from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { useTranslations } from 'next-intl'
import SearchableCombobox, { ComboboxOption } from '@/components/ui/SearchableCombobox'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

interface MovementLog {
  movement_id: string
  movement_type: string
  moved_at: string
  notes: string | null
  destination_name?: string | null
  employee_name?: string | null
}

interface Employee {
  employee_id: string
  employee_code: string
  employee_name: string
}

interface Destination {
  destination_id: string
  destination_name: string
}



// Fallback Default Chips (Rendered immediately on frame 0 to eliminate initial flicker)
const DEFAULT_DESTINATIONS: Destination[] = [
  { destination_id: 'DEST_FORMING_M6', destination_name: '06号成形機' },
  { destination_id: 'DEST_FORMING_M7', destination_name: '07号成形機' },
  { destination_id: 'DEST_FORMING_M8', destination_name: '08号成形機' },
  { destination_id: 'DEST_FORMING_M9', destination_name: '09号成形機 坂田精文堂' },
  { destination_id: 'DEST_FORMING_2F', destination_name: '2F 成形機' },
  { destination_id: 'DEST_OTHER', destination_name: 'その他' },
  { destination_id: 'DEST_TEFLON_VENDOR', destination_name: 'テフロン加工' },
  { destination_id: 'DEST_PRESS', destination_name: 'プレス機' },
  { destination_id: 'DEST_OFFICE_PREP', destination_name: '事務所前-金型準備' },
  { destination_id: 'DEST_SHIPMENT', destination_name: '出荷' },
  { destination_id: 'DEST_TAIWAN_M', destination_name: '台湾成形機' },
  { destination_id: 'DEST_PHOTO_ROOM', destination_name: '金型室-その他' }
]

export default function CheckInOutModule({ data, onClose, onSuccess }: Props) {
  const t = useTranslations('CheckInOutModule')
  const supabase = createClient()

  const targetEquipmentId = data?.equipment_id || (data as any)?.physical_mold_id || (data as any)?.cutter_id || (data as any)?.id

  // Data State initialized with fallback defaults for zero-flicker frame 0 render
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [historyLogs, setHistoryLogs] = useState<MovementLog[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [destinations, setDestinations] = useState<Destination[]>(DEFAULT_DESTINATIONS)


  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [defaultEmpChecked, setDefaultEmpChecked] = useState<boolean>(false)

  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('')
  const [defaultDestChecked, setDefaultDestChecked] = useState<boolean>(false)

  const [notes, setNotes] = useState<string>('')
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('')
  const [unlockDelete, setUnlockDelete] = useState<boolean>(false)



  // Load Initial Lookups & Preferences
  useEffect(() => {
    // Read saved defaults from localStorage
    const savedEmp = localStorage.getItem('ysd_default_employee_id')
    if (savedEmp) {
      setSelectedEmployeeId(savedEmp)
      setDefaultEmpChecked(true)
    }

    const savedDest = localStorage.getItem('ysd_default_destination_id')
    if (savedDest) {
      setSelectedDestinationId(savedDest)
      setDefaultDestChecked(true)
    }

    async function loadInitialData() {
      setFetching(true)
      try {
        const [empRes, destRes] = await Promise.all([
          supabase.from('employees').select('employee_id, employee_code, employee_name').order('employee_name'),
          supabase.from('destinations').select('destination_id, destination_name').order('destination_name')
        ])

        if (empRes.data) setEmployees(empRes.data)
        if (destRes.data && destRes.data.length > 0) setDestinations(destRes.data)

        // Fetch History from equipment_history — only IN/OUT logs for this module
        if (targetEquipmentId && targetEquipmentId !== 'undefined') {
          const { data: historyData } = await supabase
            .from('equipment_history')
            .select(`
              history_id,
              action_type,
              action_date,
              description,
              to_location,
              performed_by,
              employees(employee_name)
            `)
            .eq('equipment_id', targetEquipmentId)
            .in('action_type', ['IN', 'OUT', 'CHECK_IN', 'CHECK_OUT'])
            .order('action_date', { ascending: false })
            .limit(50)

          if (historyData) {
            const formatted = historyData.map((h: any) => ({
              movement_id: h.history_id,
              movement_type: h.action_type || 'OUT',
              moved_at: h.action_date || new Date().toISOString(),
              notes: h.description || '',
              destination_name: h.to_location || null,
              employee_name: h.employees?.employee_name || null
            }))
            setHistoryLogs(formatted)
          }
        }
      } catch (err) {
        console.error('Error fetching checkin/out data:', err)
      } finally {
        setFetching(false)
      }
    }

    loadInitialData()
  }, [targetEquipmentId, supabase])

  // Handle Employee Default Checkbox
  const handleEmpDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setDefaultEmpChecked(checked)
    if (checked && selectedEmployeeId) {
      localStorage.setItem('ysd_default_employee_id', selectedEmployeeId)
    } else {
      localStorage.removeItem('ysd_default_employee_id')
    }
  }

  // Handle Destination Default Checkbox
  const handleDestDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setDefaultDestChecked(checked)
    if (checked && selectedDestinationId) {
      localStorage.setItem('ysd_default_destination_id', selectedDestinationId)
    } else {
      localStorage.removeItem('ysd_default_destination_id')
    }
  }

  // Handle Delete History Log
  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Lịch sử này sẽ bị xóa khỏi hệ thống. Bạn có chắc chắn?')) return
    try {
      await supabase.from('equipment_history').delete().eq('history_id', logId)
      setHistoryLogs(prev => prev.filter(l => l.movement_id !== logId))
    } catch (err: any) {
      alert('Lỗi xóa lịch sử: ' + err.message)
    }
  }

  // Core Action Handlers — Only IN and OUT
  // CheckIn/Out does NOT change keeper_company_id (that's Transport's job)
  // CheckIn/Out does NOT change rack position (that's Rack Move's job)
  const handleAction = async (actionType: 'IN' | 'OUT') => {
    if (!targetEquipmentId || targetEquipmentId === 'undefined') {
      setMsg({ type: 'error', text: '⚠️ Invalid equipment_id' })
      return
    }

    if (!selectedEmployeeId) {
      setMsg({ type: 'error', text: '⚠️ ' + t('selectEmployee') })
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      const nowISO = new Date().toISOString()
      const todayStr = nowISO.slice(0, 10)
      const empObj = employees.find(e => e.employee_id === selectedEmployeeId)
      const destObj = destinations.find(d => d.destination_id === selectedDestinationId)

      const updatedUsageStatus = actionType === 'IN' ? 'IN' : 'OUT'
      const updatedDeviceStatus = actionType === 'IN' ? 'IN_STOCK' : 'OUT_OF_STOCK'

      // 1. Update Equipment table — usage_status, device_status, and returned_date
      if (data?.equipment_id) {
        const { error: eqErr } = await supabase
          .from('equipment')
          .update({
            usage_status: updatedUsageStatus,
            device_status: updatedDeviceStatus,
            returned_date: todayStr
          } as any)
          .eq('equipment_id', targetEquipmentId)

        if (eqErr) console.warn('Equipment update note:', eqErr)
      }



      // Update local data prop in memory
      if (data) {
        data.usage_status = updatedUsageStatus
        data.device_status = updatedDeviceStatus
        data.returned_date = todayStr
      }
      setCurrentStatus(updatedUsageStatus)

      // 2. Insert into equipment_history with structured columns
      const descStr = notes || (destObj ? destObj.destination_name : `${actionType}`)
      const { data: newHist, error: histErr } = await supabase
        .from('equipment_history')
        .insert({
          equipment_id: targetEquipmentId,
          action_type: actionType,
          action_date: todayStr,
          performed_by: selectedEmployeeId || null,
          to_location: destObj?.destination_name || null,
          description: descStr
        } as any)
        .select()
        .single()

      if (histErr) console.warn('Equipment history log insert note:', histErr)

      // Update UI History Log list
      const newLogItem: MovementLog = {
        movement_id: newHist?.history_id || String(Date.now()),
        movement_type: actionType,
        moved_at: nowISO,
        notes: descStr,
        destination_name: destObj?.destination_name || null,
        employee_name: empObj?.employee_name || null
      }
      setHistoryLogs(prev => [newLogItem, ...prev])

      setMsg({ type: 'success', text: `✅ ${actionType} OK!` })

      setTimeout(() => {
        onSuccess()
        onClose()
      }, 800)

    } catch (err: any) {
      setMsg({ type: 'error', text: `❌ ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  // Current status state with auto sync
  const [currentStatus, setCurrentStatus] = useState<string>(data?.usage_status || data?.device_status || 'STORAGE')
  useEffect(() => {
    if (data?.usage_status || data?.device_status) {
      setCurrentStatus(data.usage_status || data.device_status || 'STORAGE')
    }
  }, [data?.usage_status, data?.device_status])

  // Filtered History
  const filteredHistory = historyLogs.filter(h => {
    if (!searchHistoryQuery) return true
    const q = searchHistoryQuery.toLowerCase()
    return (
      (h.notes && h.notes.toLowerCase().includes(q)) ||
      (h.employee_name && h.employee_name.toLowerCase().includes(q)) ||
      (h.destination_name && h.destination_name.toLowerCase().includes(q)) ||
      (h.movement_type && h.movement_type.toLowerCase().includes(q))
    )
  })

  const isOut = currentStatus === 'OUT' || currentStatus === 'OUT_OF_STOCK' || currentStatus === 'MAINTENANCE' || currentStatus === 'BROKEN'

  // Options for SearchableCombobox
  const employeeComboboxOptions: ComboboxOption[] = employees.map(emp => ({
    value: emp.employee_id,
    label: emp.employee_name,
    code: emp.employee_code
  }))

  const destinationComboboxOptions: ComboboxOption[] = destinations.map(dest => ({
    value: dest.destination_id,
    label: dest.destination_name
  }))

  // Quick selection chips items
  const topEmployeeChips = employees.slice(0, 12)
  const topDestinationChips = destinations.slice(0, 12)

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%', minHeight: 520 }}>
      {/* LEFT COLUMN: HISTORY LOGS (55% Width) */}
      <div
        className="card-flat"
        style={{
          flex: 1.1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 12,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          height: '100%'
        }}
      >
        {/* Header Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{t('historyTitle')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => setUnlockDelete(!unlockDelete)}
              className="btn btn-secondary"
              style={{ padding: '4px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {unlockDelete ? <Unlock size={12} color="#ef4444" /> : <Lock size={12} />}
              <span>{t('unlock')}</span>
            </button>

            <div style={{ position: 'relative', width: 150 }}>
              <input
                type="text"
                className="form-input"
                placeholder={t('searchPlaceholder')}
                value={searchHistoryQuery}
                onChange={e => setSearchHistoryQuery(e.target.value)}
                style={{ paddingLeft: 24, paddingRight: 8, height: 28, fontSize: 11 }}
              />
              <Search size={12} style={{ position: 'absolute', left: 7, top: 8, color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        {/* History Table */}
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 6 }}>
          <table className="data-table" style={{ width: '100%', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colTime')}</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', whiteSpace: 'nowrap' }}>{t('colType')}</th>
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colDestination')}</th>
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colEmployee')}</th>
                <th style={{ padding: '6px 8px' }}>{t('colNotes')}</th>
                {unlockDelete && <th style={{ padding: '6px 4px', width: 32, whiteSpace: 'nowrap' }}>{t('colAction')}</th>}
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={unlockDelete ? 6 : 5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                    <Loader2 className="animate-spin" size={18} style={{ margin: '0 auto 6px auto' }} />
                    <span>Loading...</span>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={unlockDelete ? 6 : 5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                    No history records
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h, i) => {
                  const typeUpper = h.movement_type?.toUpperCase() || 'OUT'
                  const isTypeIn = typeUpper === 'IN' || typeUpper === 'CHECK_IN'
                  const isTypeAudit = typeUpper === 'AUDIT'
                  const isTypeRelocate = typeUpper === 'RELOCATE'

                  const badgeClass = isTypeIn
                    ? 'badge badge--success'
                    : isTypeAudit
                    ? 'badge badge--info'
                    : isTypeRelocate
                    ? 'badge badge--neutral'
                    : 'badge badge--warning'

                  return (
                    <tr key={h.movement_id || i}>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                        {h.moved_at ? h.moved_at.slice(0, 10) : '-'}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span className={badgeClass} style={{ fontSize: 10, padding: '2px 6px' }}>
                          {isTypeIn ? 'IN' : isTypeAudit ? 'AUDIT' : isTypeRelocate ? 'MOVE' : 'OUT'}
                        </span>
                      </td>
                      <td style={{ padding: '6px 8px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {h.destination_name || '-'}
                      </td>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>
                        {h.employee_name || '-'}
                      </td>
                      <td style={{ padding: '6px 8px', color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.notes || '-'}
                      </td>
                      {unlockDelete && (
                        <td style={{ padding: '6px 4px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteLog(h.movement_id)}
                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                            title="Xóa"
                          >
                            ✕
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTION FORM & CONTROL BUTTONS (45% Width) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 12,
          background: 'var(--bg-surface)',
          height: '100%'
        }}
      >
        {/* Device Info Banner Header */}
        <div
          className="card-flat"
          style={{
            padding: '8px 12px',
            background: 'var(--tint-teal-bg)',
            border: '1px solid var(--tint-teal-border)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t('deviceInfo')}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {data?.equipment_code || (data as any)?.system_code || '—'} · {data?.display_name || '—'}
            </div>
          </div>
          <div>
            {(() => {
              const hasHistory = historyLogs.length > 0
              const latestAction = hasHistory ? (historyLogs[0].movement_type || '').toUpperCase() : ''
              const isUnverified = data?.device_status === 'UNVERIFIED' || data?.usage_status === 'UNVERIFIED'

              let badgeText = ''
              let badgeClass = 'badge badge--neutral'

              if (!hasHistory) {
                if (isUnverified) {
                  badgeText = '未検証 (Chưa kiểm kê)'
                  badgeClass = 'badge badge--neutral'
                } else {
                  badgeText = '登録済 (Chưa có nhật ký)'
                  badgeClass = 'badge badge--neutral'
                }
              } else if (latestAction === 'OUT' || latestAction === 'CHECK_OUT' || latestAction === 'TRANSFER' || latestAction === 'LOAN') {
                badgeText = t('outStock') || 'OUT (社外)'
                badgeClass = 'badge badge--warning'
              } else if (latestAction === 'IN' || latestAction === 'CHECK_IN' || latestAction === 'RETURN') {
                badgeText = t('inStock') || 'IN (社内)'
                badgeClass = 'badge badge--success'
              } else {
                badgeText = latestAction || '未設定'
                badgeClass = 'badge badge--neutral'
              }

              return (
                <span className={badgeClass} style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px' }}>
                  {badgeText}
                </span>
              )
            })()}
          </div>
        </div>

        {/* Feedback Alert Message */}
        {msg && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              background: msg.type === 'error' ? 'var(--tint-orange-bg)' : 'var(--tint-teal-bg)',
              color: msg.type === 'error' ? 'var(--tint-orange-text)' : 'var(--tint-teal-text)',
              border: `1px solid ${msg.type === 'error' ? 'var(--tint-orange-border)' : 'var(--tint-teal-border)'}`
            }}
          >
            {msg.text}
          </div>
        )}

        {/* Main Controls Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
          
          {/* Employee Section: Quick Chips Grid + Searchable Combobox */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                {t('employeeLabel')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={defaultEmpChecked}
                  onChange={handleEmpDefaultChange}
                />
                <span>{t('setAsDefault')}</span>
              </label>
            </div>

            {/* Quick Selection Chips Grid for Employees */}
            {topEmployeeChips.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {topEmployeeChips.map((emp, idx) => {
                  const isSelected = selectedEmployeeId === emp.employee_id
                  return (
                    <button
                      key={emp.employee_id}
                      type="button"
                      onClick={() => {
                        setSelectedEmployeeId(emp.employee_id)
                        if (defaultEmpChecked) localStorage.setItem('ysd_default_employee_id', emp.employee_id)
                      }}
                      style={{
                        padding: '4px 6px',
                        fontSize: 11,
                        borderRadius: 6,
                        border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                        background: isSelected ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)',
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <span style={{ fontSize: 9, padding: '0 4px', borderRadius: 3, background: isSelected ? 'var(--accent)' : 'var(--border-default)', color: isSelected ? '#fff' : 'var(--text-muted)', fontWeight: 700 }}>
                        {idx + 1}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.employee_name}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Employee Searchable Combobox (Type code M09 or Name to filter in realtime!) */}
            <div style={{ marginTop: 2 }}>
              <SearchableCombobox
                options={employeeComboboxOptions}
                value={selectedEmployeeId}
                onChange={val => {
                  setSelectedEmployeeId(val)
                  if (defaultEmpChecked && val) localStorage.setItem('ysd_default_employee_id', val)
                }}
                placeholder={t('selectEmployee')}
              />
            </div>
          </div>

          {/* Destination Section: Quick Chips Grid + Searchable Combobox */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                {t('destinationLabel')}
              </label>
              <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={defaultDestChecked}
                  onChange={handleDestDefaultChange}
                />
                <span>{t('setAsDefault')}</span>
              </label>
            </div>

            {/* Quick Selection Chips Grid for Destinations */}
            {topDestinationChips.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {topDestinationChips.map((dest, idx) => {
                  const isSelected = selectedDestinationId === dest.destination_id
                  return (
                    <button
                      key={dest.destination_id}
                      type="button"
                      onClick={() => {
                        setSelectedDestinationId(dest.destination_id)
                        if (defaultDestChecked) localStorage.setItem('ysd_default_destination_id', dest.destination_id)
                      }}
                      style={{
                        padding: '4px 6px',
                        fontSize: 11,
                        borderRadius: 6,
                        border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                        background: isSelected ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)',
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <span style={{ fontSize: 9, padding: '0 4px', borderRadius: 3, background: isSelected ? 'var(--accent)' : 'var(--border-default)', color: isSelected ? '#fff' : 'var(--text-muted)', fontWeight: 700 }}>
                        {idx + 1}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{dest.destination_name}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Destination Searchable Combobox */}
            <div style={{ marginTop: 2 }}>
              <SearchableCombobox
                options={destinationComboboxOptions}
                value={selectedDestinationId}
                onChange={val => {
                  setSelectedDestinationId(val)
                  if (defaultDestChecked && val) localStorage.setItem('ysd_default_destination_id', val)
                }}
                placeholder={t('selectDestination')}
              />
            </div>
          </div>

          {/* Notes Textarea */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
              {t('notesLabel')}
            </label>
            <textarea
              className="form-textarea"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="..."
              style={{ fontSize: 12, resize: 'none' }}
            />
          </div>

        </div>

        {/* 2 Action Buttons: IN and OUT only */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 'auto', flexShrink: 0 }}>
          {/* GREEN BUTTON: IN */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('IN')}
            className="btn"
            style={{
              background: '#22c55e',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '14px 8px',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <div>{t('btnIn')}</div>}
          </button>

          {/* ORANGE BUTTON: OUT */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('OUT')}
            className="btn"
            style={{
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '14px 8px',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              boxShadow: '0 2px 4px rgba(249, 115, 22, 0.3)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <div>{t('btnOut')}</div>}
          </button>
        </div>
      </div>
    </div>
  )
}
