'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EquipmentDetailData } from '../types'
import { useTranslations } from 'next-intl'
import SearchableCombobox, { ComboboxOption } from '@/components/ui/SearchableCombobox'
import {
  CheckCircle2, Loader2, ArrowRight, Truck, Lock, Unlock,
  Search, Calendar, Building, FileText, User
} from 'lucide-react'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

type Step = 1 | 2 | 3 | 4

interface Company {
  company_id: string
  company_name: string
  company_code: string
  company_name_romaji?: string | null
  company_type?: string[] | string | null
}

interface Employee {
  employee_id: string
  employee_name: string
  employee_code: string
}

interface TransportLog {
  history_id: string
  action_date: string
  description: string | null
  from_company_name: string | null
  to_company_name: string | null
  employee_name: string | null
}

export default function TransportModule({ data, onClose, onSuccess }: Props) {
  const t = useTranslations('TransportModule')
  const supabase = createClient()

  // Layout & State
  const targetEquipmentId = data?.equipment_id || (data as any)?.physical_mold_id || (data as any)?.cutter_id || (data as any)?.id

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [unlockDelete, setUnlockDelete] = useState<boolean>(false)
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('')

  // Lookups
  const [companies, setCompanies] = useState<Company[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [historyLogs, setHistoryLogs] = useState<TransportLog[]>([])

  // Form Fields
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [defaultEmpChecked, setDefaultEmpChecked] = useState<boolean>(false)
  
  const [shipDate, setShipDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  // Initialize data
  useEffect(() => {
    const savedEmp = localStorage.getItem('ysd_default_employee_id')
    if (savedEmp) {
      setSelectedEmployeeId(savedEmp)
      setDefaultEmpChecked(true)
    }

    async function loadData() {
      setFetching(true)
      try {
        const [compRes, empRes] = await Promise.all([
          supabase
            .from('companies')
            .select('company_id, company_name, company_code, company_name_romaji, company_type')
            .order('company_name'),
          supabase.from('employees').select('employee_id, employee_name, employee_code').order('employee_name')
        ])

        if (compRes.data) setCompanies(compRes.data)
        if (empRes.data) setEmployees(empRes.data)

        if (targetEquipmentId && targetEquipmentId !== 'undefined') {
          const { data: histData } = await supabase
            .from('equipment_history')
            .select(`
              history_id,
              action_date,
              description,
              from_company:from_company_id(company_name),
              to_company:to_company_id(company_name),
              employees:performed_by(employee_name)
            `)
            .eq('equipment_id', targetEquipmentId)
            .eq('action_type', 'TRANSFER')
            .order('action_date', { ascending: false })
            .limit(50)

          if (histData) {
            const formatted = histData.map((h: any) => ({
              history_id: h.history_id,
              action_date: h.action_date,
              description: h.description,
              from_company_name: h.from_company?.company_name || null,
              to_company_name: h.to_company?.company_name || null,
              employee_name: h.employees?.employee_name || null
            }))
            setHistoryLogs(formatted)
          }
        }
      } catch (err) {
        console.error('Error loading transport data:', err)
      } finally {
        setFetching(false)
      }
    }

    loadData()
  }, [targetEquipmentId, supabase])

  const handleEmpDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setDefaultEmpChecked(checked)
    if (checked && selectedEmployeeId) {
      localStorage.setItem('ysd_default_employee_id', selectedEmployeeId)
    } else {
      localStorage.removeItem('ysd_default_employee_id')
    }
  }

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Lịch sử này sẽ bị xóa khỏi hệ thống. Bạn có chắc chắn?')) return
    try {
      await supabase.from('equipment_history').delete().eq('history_id', logId)
      setHistoryLogs(prev => prev.filter(h => h.history_id !== logId))
    } catch (err: any) {
      alert('Lỗi xóa lịch sử: ' + err.message)
    }
  }

  const handleActionSubmit = async () => {
    if (!targetEquipmentId || targetEquipmentId === 'undefined') {
      setMsg({ type: 'error', text: '⚠️ ' + t('errorInvalidId') })
      return
    }

    if (!selectedEmployeeId) {
      setMsg({ type: 'error', text: '⚠️ ' + t('selectEmployee') })
      return
    }

    if (!selectedCompanyId) {
      setMsg({ type: 'error', text: '⚠️ ' + t('selectCompany') })
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      const nowISO = new Date().toISOString()
      const todayStr = shipDate || nowISO.slice(0, 10)
      const empObj = employees.find(e => e.employee_id === selectedEmployeeId)
      const compObj = companies.find(c => c.company_id === selectedCompanyId)
      const fromCompObj = companies.find(c => c.company_id === data?.keeper_company_id)

      // 1. Update Equipment table — keeper_company_id and returned_date
      if (data?.equipment_id) {
        const { error: eqErr } = await supabase
          .from('equipment')
          .update({
            keeper_company_id: selectedCompanyId,
            returned_date: todayStr
          } as any)
          .eq('equipment_id', targetEquipmentId)

        if (eqErr) throw eqErr
      }

      // Sync data prop in memory
      if (data) {
        data.keeper_company_id = selectedCompanyId
        data.keeper_company = compObj ? { company_name: compObj.company_name, company_code: compObj.company_code } : null
        data.returned_date = todayStr
      }

      // 2. Insert into equipment_history
      const descStr = notes ? `[出荷] ${notes}` : `[出荷] Vận chuyển đến ${compObj?.company_name || 'Công ty đích'}`
      const { data: newHist, error: histErr } = await supabase
        .from('equipment_history')
        .insert({
          equipment_id: targetEquipmentId,
          action_type: 'TRANSFER',
          action_date: todayStr,
          from_company_id: data?.keeper_company_id || null,
          to_company_id: selectedCompanyId,
          performed_by: selectedEmployeeId,
          description: descStr
        } as any)
        .select()
        .single()

      if (histErr) console.warn('History log note:', histErr)

      const newLogItem: TransportLog = {
        history_id: newHist?.history_id || String(Date.now()),
        action_date: todayStr,
        description: descStr,
        from_company_name: fromCompObj?.company_name || null,
        to_company_name: compObj?.company_name || null,
        employee_name: empObj?.employee_name || null
      }
      setHistoryLogs(prev => [newLogItem, ...prev])

      setMsg({ type: 'success', text: t('submitSuccess') })

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

  // Priority sorting for quick chips (Owner, Marudai, YSD branches, key contractors, then alphabetical)
  const priorityCompanies = React.useMemo(() => {
    if (!companies || companies.length === 0) return []

    const isMarudaiOrKeyPartner = (c: Company) => {
      const code = (c.company_code || '').toUpperCase()
      const name = (c.company_name || '').toLowerCase()
      const romaji = (c.company_name_romaji || '').toLowerCase()
      return (
        code.includes('MARUDAI') ||
        name.includes('丸大') ||
        name.includes('マルダイ') ||
        romaji.includes('marudai') ||
        name.includes('坂田') ||
        code.startsWith('YSD') ||
        name.includes('ysd')
      )
    }

    const ownerId = data?.company_id

    const getScore = (c: Company) => {
      if (c.company_id === ownerId) return 100
      if (isMarudaiOrKeyPartner(c)) return 50
      const types = Array.isArray(c.company_type) ? c.company_type.join(' ') : String(c.company_type || '')
      if (types.includes('INTERNAL') || types.includes('FACTORY')) return 40
      if (types.includes('OUTSOURCE') || types.includes('SUPPLIER')) return 30
      return 0
    }

    return [...companies].sort((a, b) => {
      const scoreA = getScore(a)
      const scoreB = getScore(b)
      if (scoreA !== scoreB) return scoreB - scoreA
      return a.company_name.localeCompare(b.company_name, 'ja')
    })
  }, [companies, data?.company_id])

  const topEmployeeChips = employees.slice(0, 12)
  const topCompanyChips = priorityCompanies.slice(0, 12)

  const employeeComboboxOptions: ComboboxOption[] = employees.map(emp => ({
    value: emp.employee_id,
    label: emp.employee_name,
    code: emp.employee_code
  }))

  const companyComboboxOptions: ComboboxOption[] = companies.map(comp => ({
    value: comp.company_id,
    label: comp.company_name,
    code: comp.company_code,
    subLabel: comp.company_name_romaji || undefined
  }))

  // Filtered History
  const filteredHistory = historyLogs.filter(h => {
    if (!searchHistoryQuery) return true
    const q = searchHistoryQuery.toLowerCase()
    return (
      (h.description && h.description.toLowerCase().includes(q)) ||
      (h.employee_name && h.employee_name.toLowerCase().includes(q)) ||
      (h.to_company_name && h.to_company_name.toLowerCase().includes(q)) ||
      (h.from_company_name && h.from_company_name.toLowerCase().includes(q))
    )
  })

  const handleQuickReturn = () => {
    if (data?.company_id) {
      setSelectedCompanyId(data.company_id)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%', minHeight: 520 }}>
      {/* LEFT COLUMN: HISTORY LOGS */}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{t('historyTitle', { defaultMessage: 'Transport History' })}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => setUnlockDelete(!unlockDelete)}
              className="btn btn-secondary"
              style={{ padding: '4px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {unlockDelete ? <Unlock size={12} color="#ef4444" /> : <Lock size={12} />}
              <span>{t('unlock', { defaultMessage: 'Unlock' })}</span>
            </button>

            <div style={{ position: 'relative', width: 150 }}>
              <input
                type="text"
                className="form-input"
                placeholder={t('searchPlaceholder', { defaultMessage: 'Search...' })}
                value={searchHistoryQuery}
                onChange={e => setSearchHistoryQuery(e.target.value)}
                style={{ paddingLeft: 24, paddingRight: 8, height: 28, fontSize: 11 }}
              />
              <Search size={12} style={{ position: 'absolute', left: 7, top: 8, color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 6 }}>
          <table className="data-table" style={{ width: '100%', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colDate', { defaultMessage: 'Date' })}</th>
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colFrom', { defaultMessage: 'From' })}</th>
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colTo', { defaultMessage: 'To' })}</th>
                <th style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{t('colEmployee', { defaultMessage: 'Employee' })}</th>
                <th style={{ padding: '6px 8px' }}>{t('colNotes', { defaultMessage: 'Notes' })}</th>
                {unlockDelete && <th style={{ padding: '6px 4px', width: 32, whiteSpace: 'nowrap' }}>{t('colAction', { defaultMessage: 'Action' })}</th>}
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
                    {t('noData', { defaultMessage: 'No history records' })}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h, i) => (
                  <tr key={h.history_id || i}>
                    <td style={{ padding: '6px 8px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                      {h.action_date ? h.action_date.slice(0, 10) : '-'}
                    </td>
                    <td style={{ padding: '6px 8px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {h.from_company_name || '-'}
                    </td>
                    <td style={{ padding: '6px 8px', fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--accent)' }}>
                      {h.to_company_name || '-'}
                    </td>
                    <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>
                      {h.employee_name || '-'}
                    </td>
                    <td style={{ padding: '6px 8px', color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

      {/* RIGHT COLUMN: ACTION FORM */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: 12,
          background: 'var(--bg-surface)',
          height: '100%'
        }}
      >
        {/* Stepper Bar */}
        <div
          className="card-flat"
          style={{
            padding: '12px 20px',
            background: 'var(--bg-surface-2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {[
            { step: 1, key: 'stepEmployee', titleJA: '担当・日付' },
            { step: 2, key: 'stepCompany', titleJA: '移動先' },
            { step: 3, key: 'stepNotes', titleJA: '備考' },
            { step: 4, key: 'stepConfirm', titleJA: '確認' }
          ].map((s, idx) => {
            const isActive = currentStep === s.step
            const isPassed = currentStep > s.step
            return (
              <React.Fragment key={s.step}>
                <div
                  onClick={() => setCurrentStep(s.step as Step)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    opacity: isActive || isPassed ? 1 : 0.5
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isActive ? '#3b82f6' : isPassed ? '#22c55e' : 'var(--bg-surface)',
                      border: `2px solid ${isActive ? '#3b82f6' : isPassed ? '#22c55e' : 'var(--border-default)'}`,
                      color: isActive || isPassed ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    {isPassed ? <CheckCircle2 size={16} /> : s.step}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 600, color: isActive ? '#3b82f6' : 'var(--text-primary)' }}>
                      {t(s.key as any)}
                    </span>
                  </div>
                </div>

                {idx < 3 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: isPassed ? '#22c55e' : 'var(--border-subtle)',
                      margin: '0 12px'
                    }}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Feedback Msg */}
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

        {/* Form Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          {/* STEP 1: Employee + Ship Date */}
          {currentStep === 1 && (
            <div className="card-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
                  {t('shipDateLabel', { defaultMessage: 'Ship Date' })} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={shipDate}
                  onChange={(e) => setShipDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                    <User size={14} style={{ display: 'inline', marginRight: 4 }} />
                    {t('employeeLabel', { defaultMessage: 'Employee' })} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <input
                      type="checkbox"
                      checked={defaultEmpChecked}
                      onChange={handleEmpDefaultChange}
                    />
                    <span>{t('setAsDefault', { defaultMessage: 'Set as Default' })}</span>
                  </label>
                </div>

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
                            whiteSpace: 'nowrap'
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
                <div style={{ marginTop: 2 }}>
                  <SearchableCombobox
                    options={employeeComboboxOptions}
                    value={selectedEmployeeId}
                    onChange={val => {
                      setSelectedEmployeeId(val)
                      if (defaultEmpChecked && val) localStorage.setItem('ysd_default_employee_id', val)
                    }}
                    placeholder={t('selectEmployee', { defaultMessage: 'Select Employee...' })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Target Company */}
          {currentStep === 2 && (
            <div className="card-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {data?.company_id && (
                <div style={{ padding: 12, background: 'var(--tint-orange-bg)', border: '1px solid var(--tint-orange-border)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-orange-text)' }}>
                    {t('quickReturnTitle', { defaultMessage: 'Quick Return' })}
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickReturn}
                    className="btn btn-secondary"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--tint-orange-border)', color: 'var(--text-primary)' }}
                  >
                    <Truck size={14} style={{ marginRight: 6, color: '#f97316' }} />
                    <span style={{ fontWeight: 700 }}>{t('btnReturnOwner', { defaultMessage: '金型返却 (Trả khuôn về Chủ sở hữu)' })}</span>
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                  <Building size={14} style={{ display: 'inline', marginRight: 4 }} />
                  {t('targetCompanyLabel', { defaultMessage: 'Target Company' })} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                
                {topCompanyChips.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                    {topCompanyChips.map((comp, idx) => {
                      const isSelected = selectedCompanyId === comp.company_id
                      return (
                        <button
                          key={comp.company_id}
                          type="button"
                          onClick={() => setSelectedCompanyId(comp.company_id)}
                          style={{
                            padding: '4px 6px',
                            fontSize: 11,
                            borderRadius: 6,
                            border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                            background: isSelected ? 'var(--tint-blue-bg)' : 'var(--bg-surface-2)',
                            color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span style={{ fontSize: 9, padding: '0 4px', borderRadius: 3, background: isSelected ? 'var(--accent)' : 'var(--border-default)', color: isSelected ? '#fff' : 'var(--text-muted)', fontWeight: 700 }}>
                            {idx + 1}
                          </span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{comp.company_name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
                
                <div style={{ marginTop: 2 }}>
                  <SearchableCombobox
                    options={companyComboboxOptions}
                    value={selectedCompanyId}
                    onChange={val => setSelectedCompanyId(val)}
                    placeholder={t('selectCompany', { defaultMessage: 'Select Company...' })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Notes */}
          {currentStep === 3 && (
            <div className="card-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>
                  <FileText size={14} style={{ display: 'inline', marginRight: 4 }} />
                  {t('notesLabel', { defaultMessage: 'Notes' })}
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="..."
                  style={{ fontSize: 12, resize: 'none' }}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {currentStep === 4 && (
            <div className="card-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('confDate', { defaultMessage: 'Date' })}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{shipDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('confEmployee', { defaultMessage: 'Employee' })}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>
                    {employees.find(e => e.employee_id === selectedEmployeeId)?.employee_name || '-'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('confCompany', { defaultMessage: 'Target Company' })}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                    {companies.find(c => c.company_id === selectedCompanyId)?.company_name || '-'}
                  </span>
                </div>
                {notes && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('confNotes', { defaultMessage: 'Notes' })}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{notes}</span>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleActionSubmit}
                disabled={loading || !selectedEmployeeId || !selectedCompanyId}
                className="btn btn-primary"
                style={{
                  marginTop: 8,
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 700
                }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    <Truck size={18} />
                    {t('btnSubmit', { defaultMessage: 'Confirm & Transfer' })}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as Step)}
            disabled={currentStep === 1 || loading}
          >
            {t('btnBack', { defaultMessage: 'Back' })}
          </button>
          {currentStep < 4 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1) as Step)}
            >
              {t('btnNext', { defaultMessage: 'Next' })} <ArrowRight size={16} style={{ marginLeft: 4 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
