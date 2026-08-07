'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, Loader2, Camera, CheckCircle, ChevronRight, Trash2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { useTranslations } from 'next-intl'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

interface Company {
  company_id: string
  company_name: string
  company_code: string
}

interface Employee {
  employee_id: string
  employee_name: string
  employee_code: string
}

export default function ScrapDisposalModule({ data, onClose, onSuccess }: Props) {
  const t = useTranslations('ScrapDisposalModule')
  const supabase = createClient()

  // State
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Lookups
  const [companies, setCompanies] = useState<Company[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  // Step 1: Plan State
  const [scrapMethod, setScrapMethod] = useState<'IN_HOUSE' | 'EXTERNAL'>('IN_HOUSE')
  const [targetCompanyId, setTargetCompanyId] = useState<string>('')
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10))
  const [employeeId, setEmployeeId] = useState<string>('')
  const [planNotes, setPlanNotes] = useState('')

  // Step 2: Execute State
  const [actualDisposedDate, setActualDisposedDate] = useState(new Date().toISOString().slice(0, 10))
  const [cost, setCost] = useState<string>('')
  const [executeNotes, setExecuteNotes] = useState('')

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [{ data: compData }, { data: empData }, { data: historyData }] = await Promise.all([
          supabase.from('companies').select('*').order('company_name'),
          supabase.from('employees').select('*').order('employee_name'),
          supabase.from('equipment_history')
            .select('*')
            .eq('equipment_id', data.equipment_id)
            .in('action_type', ['SCRAP_PLANNED', 'DISPOSE'])
            .order('action_date', { ascending: false })
            .limit(1)
        ])

        if (compData) setCompanies(compData)
        if (empData) setEmployees(empData)

        if (historyData && historyData.length > 0) {
          if (historyData[0].action_type === 'SCRAP_PLANNED') {
            setCurrentStep(2)
          } else if (historyData[0].action_type === 'DISPOSE') {
            // Already disposed - we could show a final step or just let them see execute form as readonly, 
            // but for now we just default to step 2
            setCurrentStep(2)
          }
        }
      } catch (err) {
        console.error('Error loading data', err)
      } finally {
        setFetching(false)
      }
    }
    loadInitialData()
  }, [data.equipment_id, supabase])

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      if (scrapMethod === 'EXTERNAL' && !targetCompanyId) {
        throw new Error(t('errorSelectCompany') || 'Please select a company.')
      }

      const desc = `[${t('scrapPlan') || 'Scrap Plan'}] Method: ${scrapMethod}${scrapMethod === 'EXTERNAL' ? `, Vendor: ${targetCompanyId}` : ''}. Scheduled: ${scheduledDate}. Notes: ${planNotes}`
      
      const { error } = await supabase.from('equipment_history').insert({
        equipment_id: data.equipment_id,
        action_type: 'SCRAP_PLANNED',
        action_date: scheduledDate,
        description: desc,
        to_company_id: scrapMethod === 'EXTERNAL' ? targetCompanyId : null,
        performed_by: employeeId || null
      })

      if (error) throw error

      setMsg({ type: 'success', text: t('planSavedSuccess') || '✅ Plan saved successfully.' })
      setTimeout(() => {
        setMsg(null)
        setCurrentStep(2)
      }, 1000)
    } catch (err: any) {
      setMsg({ type: 'error', text: `❌ ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm(t('confirmWarning') || '⚠️ 警告: この設備を本当に廃棄（DISPOSED）にしますか？\nHành động này sẽ không thể hoàn tác.')) return

    setLoading(true)
    setMsg(null)

    try {
      // 1. Update equipment
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          usage_status: 'DISPOSED',
          device_status: 'DISPOSED',
          disposed_date: actualDisposedDate
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      // 2. Insert log
      const desc = `[${t('disposed') || 'Disposed'}] Cost: ¥${cost}. Notes: ${executeNotes}`
      const { error: err2 } = await supabase.from('equipment_history').insert({
        equipment_id: data.equipment_id,
        action_type: 'DISPOSE',
        action_date: actualDisposedDate,
        description: desc,
        performed_by: employeeId || null // use same employee as step 1 if not changed
      })

      if (err2) throw err2

      setMsg({ type: 'success', text: t('disposalSuccess') || '✅ 設備の廃棄処理を完了しました。' })
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (err: any) {
      setMsg({ type: 'error', text: `❌ ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoClick = () => {
    alert(t('photoFeatureAlert') || '写真機能は次のフェーズで実装します / Tính năng chụp ảnh sẽ được xây dựng trong phase tiếp theo')
  }

  if (fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13 }}>
      {/* Warning Banner */}
      <div style={{ 
        padding: 12, 
        background: 'var(--tint-orange-bg, #fff7ed)', 
        border: '1px solid var(--tint-orange-border, #fed7aa)', 
        borderRadius: 6, 
        color: 'var(--tint-orange-text, #c2410c)', 
        display: 'flex', gap: 10, alignItems: 'flex-start' 
      }}>
        <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 600 }}>{t('warningTitle') || '⚠️ 設備廃棄の手続き (Quy trình Hủy thiết bị)'}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {t('warningDesc') || 'Sau khi hủy, thiết bị sẽ chuyển sang trạng thái DISPOSED và không thể sử dụng tiếp. Đây là hành động không thể hoàn tác.'}
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {msg && (
        <div style={{
          padding: '10px 14px', borderRadius: 6, fontWeight: 600,
          background: msg.type === 'error' ? 'var(--tint-red-bg, #fef2f2)' : 'var(--tint-teal-bg, #f0fdf4)',
          color: msg.type === 'error' ? 'var(--tint-red-text, #b91c1c)' : 'var(--tint-teal-text, #15803d)'
        }}>
          {msg.text}
        </div>
      )}

      {/* Stepper Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: currentStep === 2 ? 'pointer' : 'default' }} onClick={() => currentStep === 2 && setCurrentStep(1)}>
          <div style={{ 
            width: 28, height: 28, borderRadius: 14, 
            background: 'var(--accent)',
            color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>
            {currentStep > 1 ? <CheckCircle size={16} /> : '1'}
          </div>
          <div style={{ fontWeight: currentStep === 1 ? 600 : 400, color: 'var(--text-main)' }}>
            {t('step1Plan') || 'Plan (廃棄計画 / Lập kế hoạch)'}
          </div>
        </div>
        
        <div style={{ width: 40, height: 2, background: currentStep >= 2 ? 'var(--accent)' : 'var(--border-color, #e5e7eb)', margin: '0 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 28, height: 28, borderRadius: 14, 
            background: currentStep >= 2 ? 'var(--accent)' : 'var(--bg-surface-hover, #f3f4f6)',
            color: currentStep >= 2 ? 'white' : 'var(--text-muted, #9ca3af)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>2</div>
          <div style={{ fontWeight: currentStep === 2 ? 600 : 400, color: currentStep >= 2 ? 'var(--text-main)' : 'var(--text-muted, #9ca3af)' }}>
            {t('step2Execute') || 'Execute (廃棄実行 / Thực hiện hủy)'}
          </div>
        </div>
      </div>

      {/* STEP 1: PLAN */}
      {currentStep === 1 && (
        <form onSubmit={handlePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('scrapMethod') || 'Scrap Method (処理方法)'}</label>
              <select className="form-input" value={scrapMethod} onChange={e => setScrapMethod(e.target.value as 'IN_HOUSE' | 'EXTERNAL')}>
                <option value="IN_HOUSE">{t('inHouse') || 'IN_HOUSE (自社処理 / Tự hủy)'}</option>
                <option value="EXTERNAL">{t('external') || 'EXTERNAL (外注処理 / Thuê ngoài)'}</option>
              </select>
            </div>

            {scrapMethod === 'EXTERNAL' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>{t('externalCompany') || 'External Company (外注先)'}</label>
                <select className="form-input" value={targetCompanyId} onChange={e => setTargetCompanyId(e.target.value)} required>
                  <option value="">-- {t('selectCompany') || 'Select a company'} --</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>{c.company_code} - {c.company_name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('scheduledDate') || 'Scheduled Date (予定日)'}</label>
              <input type="date" className="form-input" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('employee') || 'Employee (担当者)'}</label>
              <select className="form-input" value={employeeId} onChange={e => setEmployeeId(e.target.value)} required>
                <option value="">-- {t('selectEmployee') || 'Select an employee'} --</option>
                {employees.map(e => (
                  <option key={e.employee_id} value={e.employee_id}>{e.employee_name} ({e.employee_code})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('planNotes') || 'Notes (備考)'}</label>
              <textarea className="form-input" rows={2} value={planNotes} onChange={e => setPlanNotes(e.target.value)} placeholder={t('planNotesPlaceholder') || 'Enter reason or plan details...'} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : <>{t('savePlanBtn') || 'Save Plan'} <ChevronRight size={16} /></>}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: EXECUTE */}
      {currentStep === 2 && (
        <form onSubmit={handleExecuteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('actualDisposedDate') || 'Actual Disposed Date (廃棄日)'}</label>
              <input type="date" className="form-input" value={actualDisposedDate} onChange={e => setActualDisposedDate(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('cost') || 'Cost (¥) / 費用'}</label>
              <input type="number" min="0" step="1" className="form-input" value={cost} onChange={e => setCost(e.target.value)} placeholder="0" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('executeNotes') || 'Final Notes (最終備考)'}</label>
              <textarea className="form-input" rows={2} value={executeNotes} onChange={e => setExecuteNotes(e.target.value)} placeholder={t('executeNotesPlaceholder') || 'Enter final details...'} />
            </div>

            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={handlePhotoClick} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-surface-hover)', border: '1px dashed var(--border-color)', width: '100%', justifyContent: 'center' }}>
                <Camera size={16} />
                {t('addPhoto') || '📷 写真を追加 (Chụp ảnh bằng chứng)'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary">
              {t('backBtn') || 'Back'}
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                {t('cancel') || 'Cancel'}
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: 'var(--tint-red-text, #dc2626)', borderColor: 'var(--tint-red-text, #dc2626)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Trash2 size={16} /> {t('confirmExecuteBtn') || 'Confirm Disposal'}</>}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
