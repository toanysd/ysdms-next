'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Truck, MapPin, Loader2, CheckCircle2, Lock, Unlock, Search, Layers, User,
  Calendar, ArrowRight, ArrowLeft
} from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { formatRackLocationDisplay } from '@/lib/utils/moldNaming'
import { useTranslations } from 'next-intl'
import SearchableCombobox, { ComboboxOption } from '@/components/ui/SearchableCombobox'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

interface RelocateHistoryLog {
  history_id: string
  action_date: string
  description: string | null
  employee_name?: string | null
}

interface Employee {
  employee_id: string
  employee_code: string
  employee_name: string
}

interface RackLayer {
  id: string
  layer_code: string
  racks?: { rack_code: string; rack_name: string } | null
}

export default function LocationMoveModule({ data, onClose, onSuccess }: Props) {
  const t = useTranslations('LocationMoveModule')
  const supabase = createClient()

  const targetEquipmentId = data?.equipment_id || (data as any)?.physical_mold_id || (data as any)?.cutter_id || (data as any)?.id

  // Stepper State (Step 1: Employee & Date | Step 2: Target Rack Layer)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [historyLogs, setHistoryLogs] = useState<RelocateHistoryLog[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [rackLayers, setRackLayers] = useState<RackLayer[]>([])

  // Form Fields
  const [actionDate, setActionDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  
  // Target Rack Layer State
  const [targetRackLayerId, setTargetRackLayerId] = useState<string>(data?.current_rack_layer_id || '')
  const [autoCheckIn, setAutoCheckIn] = useState<boolean>(true)
  const [notes, setNotes] = useState<string>('')

  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('')
  const [unlockDelete, setUnlockDelete] = useState<boolean>(false)

  const currentRackText = formatRackLocationDisplay(data?.rack_layers)

  // Load Initial Lookups & History
  useEffect(() => {
    // Saved default employee
    const savedEmp = localStorage.getItem('ysd_default_employee_id')
    if (savedEmp) setSelectedEmployeeId(savedEmp)

    async function loadData() {
      setFetching(true)
      try {
        const [empRes, layersRes] = await Promise.all([
          supabase.from('employees').select('employee_id, employee_code, employee_name').order('employee_name'),
          supabase.from('rack_layers').select('id, layer_code, racks(rack_code, rack_name)').limit(200)
        ])

        if (empRes.data) setEmployees(empRes.data)
        if (layersRes.data) setRackLayers(layersRes.data as any)

        // Fetch History ONLY for RELOCATE events
        if (targetEquipmentId && targetEquipmentId !== 'undefined') {
          const { data: histData } = await supabase
            .from('equipment_history')
            .select(`
              history_id,
              action_type,
              action_date,
              description,
              employees(employee_name)
            `)
            .eq('equipment_id', targetEquipmentId)
            .eq('action_type', 'RELOCATE')
            .order('action_date', { ascending: false })
            .limit(50)

          if (histData) {
            const formatted: RelocateHistoryLog[] = histData.map((h: any) => ({
              history_id: h.history_id,
              action_date: h.action_date || new Date().toISOString().slice(0, 10),
              description: h.description || '',
              employee_name: h.employees?.employee_name || null
            }))
            setHistoryLogs(formatted)
          }
        }
      } catch (err) {
        console.error('Error fetching relocate initial data:', err)
      } finally {
        setFetching(false)
      }
    }

    loadData()
  }, [targetEquipmentId, supabase])

  // Handle Delete History Log
  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Lịch sử di chuyển này sẽ bị xóa khỏi hệ thống. Bạn có chắc chắn?')) return
    try {
      await supabase.from('equipment_history').delete().eq('history_id', logId)
      setHistoryLogs(prev => prev.filter(l => l.history_id !== logId))
    } catch (err: any) {
      alert('Lỗi xóa lịch sử: ' + err.message)
    }
  }

  // Handle Form Submit
  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRackLayerId) {
      setMsg({ type: 'error', text: '⚠️ ' + t('selectNewRack') })
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      const empObj = employees.find(e => e.employee_id === selectedEmployeeId)
      const targetLayerObj = rackLayers.find(r => r.id === targetRackLayerId)
      const newRackCode = targetLayerObj?.layer_code || 'Rack'

      let updatePayload: any = {
        current_rack_layer_id: targetRackLayerId
      }

      if (autoCheckIn) {
        updatePayload.usage_status = 'IN'
      }

      // 1. Update Equipment or Physical Molds table
      if (data?.equipment_id) {
        const { error: eqErr } = await supabase
          .from('equipment')
          .update(updatePayload)
          .eq('equipment_id', targetEquipmentId)

        if (eqErr) throw eqErr
      }

      // 2. Insert into equipment_history (Action Type = RELOCATE)
      const descText = notes || `Thay đổi tầng kệ từ [${currentRackText}] sang vị trí mới [${newRackCode}]`
      const { data: newHist, error: histErr } = await supabase
        .from('equipment_history')
        .insert({
          equipment_id: targetEquipmentId,
          action_type: 'RELOCATE',
          action_date: actionDate,
          performed_by: selectedEmployeeId || null,
          description: descText
        } as any)
        .select()
        .single()

      if (histErr) console.warn('History insert note:', histErr)

      // Add to UI state
      const newLogItem: RelocateHistoryLog = {
        history_id: newHist?.history_id || String(Date.now()),
        action_date: actionDate,
        description: descText,
        employee_name: empObj?.employee_name || null
      }
      setHistoryLogs(prev => [newLogItem, ...prev])

      setMsg({ type: 'success', text: `✅ ${t('successMsg')}` })

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

  // Filtered History
  const filteredHistory = historyLogs.filter(h => {
    if (!searchHistoryQuery) return true
    const q = searchHistoryQuery.toLowerCase()
    return (
      (h.description && h.description.toLowerCase().includes(q)) ||
      (h.employee_name && h.employee_name.toLowerCase().includes(q)) ||
      (h.action_date && h.action_date.includes(q))
    )
  })

  // Options for SearchableCombobox
  const employeeComboboxOptions: ComboboxOption[] = employees.map(emp => ({
    value: emp.employee_id,
    label: emp.employee_name,
    code: emp.employee_code
  }))

  const rackLayerComboboxOptions: ComboboxOption[] = rackLayers.map((rl: any) => ({
    value: rl.id,
    label: rl.layer_code,
    subLabel: rl.racks?.rack_name || 'Kệ'
  }))

  // Quick Chips arrays
  const topEmployeeChips = employees.slice(0, 12)
  const topRackChips = rackLayers.slice(0, 12)

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%', minHeight: 520 }}>
      {/* LEFT COLUMN: RELOCATE HISTORY ONLY (55% Width) */}
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
            <Truck size={16} style={{ color: 'var(--accent)' }} />
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
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colEmployee')}</th>
                <th style={{ padding: '6px 8px' }}>{t('colNotes')}</th>
                {unlockDelete && <th style={{ padding: '6px 4px', width: 32, whiteSpace: 'nowrap' }}>{t('colAction')}</th>}
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={unlockDelete ? 4 : 3} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                    <Loader2 className="animate-spin" size={18} style={{ margin: '0 auto 6px auto' }} />
                    <span>Loading...</span>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={unlockDelete ? 4 : 3} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                    {t('noHistory')}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h, i) => (
                  <tr key={h.history_id || i}>
                    <td style={{ padding: '6px 8px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                      {h.action_date}
                    </td>
                    <td style={{ padding: '6px 8px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {h.employee_name || '-'}
                    </td>
                    <td style={{ padding: '6px 8px', color: 'var(--text-primary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {h.description || '-'}
                    </td>
                    {unlockDelete && (
                      <td style={{ padding: '6px 4px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteLog(h.history_id)}
                          style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: STEPPER LOCATION MOVE FORM (45% Width) */}
      <form
        onSubmit={handleMoveSubmit}
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
            background: 'var(--tint-blue-bg)',
            border: '1px solid var(--tint-blue-border)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>端末 / Thiết bị</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {data?.equipment_code || (data as any)?.system_code || '—'} · {data?.display_name || '—'}
            </div>
          </div>
          <div>
            <span className="badge badge--info" style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px' }}>
              📍 {currentRackText}
            </span>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            style={{
              padding: '4px 10px', fontSize: 11, fontWeight: 700, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: currentStep === 1 ? 'var(--accent)' : 'var(--bg-surface-2)',
              color: currentStep === 1 ? '#fff' : 'var(--text-muted)'
            }}
          >
            1. {t('step1Title')}
          </button>

          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />

          <button
            type="button"
            onClick={() => { if (selectedEmployeeId) setCurrentStep(2) }}
            disabled={!selectedEmployeeId}
            style={{
              padding: '4px 10px', fontSize: 11, fontWeight: 700, borderRadius: 6, border: 'none',
              cursor: selectedEmployeeId ? 'pointer' : 'not-allowed',
              background: currentStep === 2 ? '#38bdf8' : 'var(--bg-surface-2)',
              color: currentStep === 2 ? '#fff' : 'var(--text-muted)'
            }}
          >
            2. {t('step2Title')}
          </button>
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

        {/* STEP 1: DATE & EMPLOYEE SELECTION */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
            {/* Action Date Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                📅 {t('dateLabel')}
              </label>
              <input
                type="date"
                className="form-input"
                value={actionDate}
                onChange={e => setActionDate(e.target.value)}
                style={{ fontSize: 13, height: 36 }}
              />
            </div>

            {/* Employee Section: Quick Chips Grid + Searchable Combobox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                👤 {t('employeeLabel')} <span style={{ color: '#ef4444' }}>*</span>
              </label>

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
                          localStorage.setItem('ysd_default_employee_id', emp.employee_id)
                        }}
                        style={{
                          padding: '6px 8px',
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

              {/* Employee Searchable Combobox (Type code M09 or Name to filter in realtime & Enter to select!) */}
              <div style={{ marginTop: 4 }}>
                <SearchableCombobox
                  options={employeeComboboxOptions}
                  value={selectedEmployeeId}
                  onChange={val => {
                    setSelectedEmployeeId(val)
                    if (val) localStorage.setItem('ysd_default_employee_id', val)
                  }}
                  placeholder={t('selectEmployee')}
                />
              </div>
            </div>

            {/* Next Step Button */}
            <div style={{ marginTop: 'auto', paddingTop: 10, flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedEmployeeId}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '10px 8px',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span>{t('nextStep')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TARGET RACK LAYER SELECTION (Searchable Combobox + Quick Chips) */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
            
            {/* Target Rack Layer Section: Quick Chips Grid + Searchable Combobox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                📍 {t('newRackLabel')} <span style={{ color: '#ef4444' }}>*</span>
              </label>

              {/* Quick Selection Chips for Target Rack Layers */}
              {topRackChips.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('quickSelectRack')}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                    {topRackChips.map((rl: any, idx) => {
                      const isSelected = targetRackLayerId === rl.id
                      return (
                        <button
                          key={rl.id}
                          type="button"
                          onClick={() => setTargetRackLayerId(rl.id)}
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
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'monospace' }}>{rl.layer_code}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Rack Layers Searchable Combobox (Type layer code e.g. 70-0 or 14 to filter realtime & Enter to select!) */}
              <div style={{ marginTop: 4 }}>
                <SearchableCombobox
                  options={rackLayerComboboxOptions}
                  value={targetRackLayerId}
                  onChange={val => setTargetRackLayerId(val)}
                  placeholder={t('typeRackPlaceholder')}
                />
              </div>
            </div>

            {/* Auto Check-in Checkbox */}
            <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
              <input
                type="checkbox"
                checked={autoCheckIn}
                onChange={e => setAutoCheckIn(e.target.checked)}
              />
              <span>{t('autoCheckIn')}</span>
            </label>

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

            {/* Step Navigation Buttons */}
            <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px 8px', fontSize: 12, fontWeight: 600 }}
              >
                <ArrowLeft size={14} />
                <span>{t('backStep')}</span>
              </button>

              <button
                type="submit"
                disabled={loading || !targetRackLayerId}
                className="btn"
                style={{
                  flex: 2,
                  background: '#38bdf8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 8px',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 2px 4px rgba(56, 189, 248, 0.3)',
                  cursor: (loading || !targetRackLayerId) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Truck size={16} />}
                <span>{t('confirmButton')}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
