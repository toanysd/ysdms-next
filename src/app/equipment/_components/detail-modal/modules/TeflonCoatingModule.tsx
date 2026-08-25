'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, CheckCircle2, Clock, Loader2, FileText, ChevronRight, Send, ShieldCheck, History, ArrowRightLeft } from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { useTranslations } from 'next-intl'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
  onRequestRackMove?: () => void  // Callback to open Rack Move after teflon complete
}

type TeflonStep = 1 | 2 | 3 | 4

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

interface TeflonJobLog {
  job_id: string
  job_code: string
  job_status: string
  created_at: string
  ship_date?: string | null
  completed_date?: string | null
  notes?: string | null
}

export default function TeflonCoatingModule({ data, onClose, onSuccess, onRequestRackMove }: Props) {
  const t = useTranslations('EquipmentDetailModal')
  const supabase = createClient()

  // Stepper State
  const [currentStep, setCurrentStep] = useState<TeflonStep>(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const targetEquipmentId = data?.equipment_id || (data as any)?.physical_mold_id || (data as any)?.legacy_cutter_id || (data as any)?.id

  // Lookups
  const [teflonVendors, setTeflonVendors] = useState<Company[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [teflonHistory, setTeflonHistory] = useState<TeflonJobLog[]>([])

  // Form Fields per Step
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [selectedVendorId, setSelectedVendorId] = useState<string>('')
  const [requestDate, setRequestDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [expectedDate, setExpectedDate] = useState<string>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  )
  const [actualDate, setActualDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [cost, setCost] = useState<string>('')
  const [qualityRating, setQualityRating] = useState<string>('EXCELLENT')
  const [notes, setNotes] = useState<string>('')

  // Auto Detect Previous State and Lookup Vendors/Employees
  useEffect(() => {
    async function loadInitialTeflonData() {
      setFetching(true)
      try {
        const [compRes, empRes, jobRes] = await Promise.all([
          supabase.from('companies').select('company_id, company_name, company_code').order('company_name'),
          supabase.from('employees').select('employee_id, employee_name, employee_code').order('employee_name'),
          supabase
            .from('jobs')
            .select('job_id, job_code, job_status, created_at, ship_date, completed_date, notes')
            .eq('equipment_id', targetEquipmentId)
            .eq('job_category', 'EQUIPMENT_REPAIR')
            .order('created_at', { ascending: false })
            .limit(10)
        ])

        if (compRes.data) {
          // Filter companies matching teflon or suppliers
          setTeflonVendors(compRes.data)
          if (compRes.data.length > 0) setSelectedVendorId(compRes.data[0].company_id)
        }

        if (empRes.data) {
          setEmployees(empRes.data)
          if (empRes.data.length > 0) setSelectedEmployeeId(empRes.data[0].employee_id)
        }

        if (jobRes.data && jobRes.data.length > 0) {
          setTeflonHistory(jobRes.data as any)
          const latestJob = jobRes.data[0]
          const status = latestJob.job_status?.toUpperCase()

          // Auto-progression logic
          if (status === 'REQUESTED') setCurrentStep(2)
          else if (status === 'APPROVED') setCurrentStep(3)
          else if (status === 'SENT' || status === 'PROCESSING') setCurrentStep(4)
          else setCurrentStep(1)
        } else {
          setCurrentStep(1)
        }
      } catch (err) {
        console.error('Error loading teflon initial data:', err)
      } finally {
        setFetching(false)
      }
    }

    if (targetEquipmentId && targetEquipmentId !== 'undefined') {
      loadInitialTeflonData()
    } else {
      setFetching(false)
    }
  }, [targetEquipmentId, supabase])

  // Save Step Action Handler
  const handleSaveStep = async (advanceNext: boolean = false) => {
    setLoading(true)
    setMsg(null)

    try {
      const nowISO = new Date().toISOString()
      const empObj = employees.find(e => e.employee_id === selectedEmployeeId)
      const vendorObj = teflonVendors.find(v => v.company_id === selectedVendorId)

      let targetJobStatus = 'REQUESTED'
      let isCompleted = false

      if (currentStep === 1) targetJobStatus = 'REQUESTED'
      else if (currentStep === 2) targetJobStatus = 'APPROVED'
      else if (currentStep === 3) targetJobStatus = 'SENT'
      else if (currentStep === 4) {
        targetJobStatus = 'COMPLETED'
        isCompleted = true
      }

      // 1. Create/Update Job Record
      const jobCode = `TEF-${data?.equipment_code || 'EQ'}-${Date.now().toString().slice(-4)}`
      const { data: jobData, error: jobErr } = await supabase
        .from('jobs')
        .insert({
          equipment_id: targetEquipmentId,
          job_code: jobCode,
          job_name: `✨ テフロン加工 (Mạ Teflon - ${vendorObj?.company_name || 'TEFLON'})`,
          job_category: 'EQUIPMENT_REPAIR',
          job_status: targetJobStatus,
          ship_date: currentStep >= 3 ? requestDate : null,
          completed_date: isCompleted ? actualDate : null,
          deadline: expectedDate,
          notes: notes || `Mạ Teflon Step ${currentStep} (${targetJobStatus})`
        } as any)
        .select()
        .single()

      if (jobErr) console.warn('Job insert note:', jobErr)

      // Save cost to jobs table if Step 4 (COMPLETED)
      if (isCompleted && cost && jobData?.job_id) {
        await supabase
          .from('jobs')
          .update({
            estimated_cost: parseFloat(cost) || null,
            notes: `${notes || ''} | Quality: ${qualityRating} | Cost: ¥${cost}`
          } as any)
          .eq('job_id', jobData.job_id)
      }

      // 2. Equipment State Updates based on Step
      let updatePayload: any = {}

      if (currentStep === 3) {
        // Step 3 (SENT): Auto Check-out to Teflon vendor
        updatePayload = {
          usage_status: 'OUT',
          keeper_company_id: selectedVendorId || data?.keeper_company_id,
          notes: `[✨ テフロン加工中] Đã gửi mạ tại ${vendorObj?.company_name || ''} (${requestDate})`
        }
      } else if (currentStep === 4) {
        // Step 4 (COMPLETED): Return to YSD (company_id), usage_status = IN
        // NOTE: is_teflon column does not exist yet in DB, track via notes
        updatePayload = {
          usage_status: 'IN',
          keeper_company_id: data?.company_id || data?.keeper_company_id,
          notes: `[✨ テフロン済] Mạ hoàn tất ngày ${actualDate}. Đơn vị: ${vendorObj?.company_name || ''}. Chi phí: ¥${cost || 'N/A'}`
        }
      }

      if (Object.keys(updatePayload).length > 0 && targetEquipmentId) {
        await supabase
          .from('equipment')
          .update(updatePayload)
          .eq('equipment_id', targetEquipmentId)
      }

      // 3. Log into equipment_history
      if (targetEquipmentId) {
        await supabase.from('equipment_history').insert({
          equipment_id: targetEquipmentId,
          action_type: isCompleted ? 'MAINTENANCE' : 'REPAIR',
          action_date: requestDate,
          from_company_id: data?.keeper_company_id || null,
          to_company_id: selectedVendorId || null,
          performed_by: selectedEmployeeId || null,
          description: `[✨ テフロン mạ Teflon Step ${currentStep}] ${notes || ''}`
        } as any)
      }

      // Step 3 extras: TRANSFER history (YSD → Vendor) + OUT log
      if (currentStep === 3) {
        // TRANSFER log: Track keeper_company change
        await supabase.from('equipment_history').insert({
          equipment_id: targetEquipmentId,
          action_type: 'TRANSFER',
          action_date: requestDate,
          from_company_id: data?.keeper_company_id || data?.company_id || null,
          to_company_id: selectedVendorId || null,
          performed_by: selectedEmployeeId || null,
          job_id: jobData?.job_id || null,
          description: `[テフロン出荷] Gửi mạ Teflon → ${vendorObj?.company_name || ''}`
        } as any)

        // OUT log
        await supabase.from('equipment_history').insert({
          equipment_id: targetEquipmentId,
          action_type: 'OUT',
          action_date: requestDate,
          performed_by: selectedEmployeeId || null,
          to_company_id: selectedVendorId || null,
          description: `Gửi đi mạ Teflon: ${notes || ''}`
        } as any)
      }

      // Step 4 extras: TRANSFER history (Vendor → YSD) + IN log
      if (currentStep === 4) {
        // TRANSFER log: Vendor returns to YSD
        await supabase.from('equipment_history').insert({
          equipment_id: targetEquipmentId,
          action_type: 'TRANSFER',
          action_date: actualDate,
          from_company_id: selectedVendorId || null,
          to_company_id: data?.company_id || data?.keeper_company_id || null,
          performed_by: selectedEmployeeId || null,
          job_id: jobData?.job_id || null,
          description: `[テフロン返却] Nhận về từ ${vendorObj?.company_name || ''}`
        } as any)

        // IN log
        await supabase.from('equipment_history').insert({
          equipment_id: targetEquipmentId,
          action_type: 'IN',
          action_date: actualDate,
          performed_by: selectedEmployeeId || null,
          description: `Nhận về sau mạ Teflon từ ${vendorObj?.company_name || ''}`
        } as any)
      }

      setMsg({ type: 'success', text: `✅ Step ${currentStep} 保存完了！ (Đã lưu thành công)` })

      if (advanceNext && currentStep < 4) {
        setCurrentStep((currentStep + 1) as TeflonStep)
      } else if (currentStep === 4) {
        // Step 4 complete — prompt user to assign rack position
        setTimeout(() => {
          onSuccess()
          if (onRequestRackMove) {
            onRequestRackMove()  // Open Rack Move dialog
          } else {
            onClose()
          }
        }, 800)
      } else {
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 800)
      }

    } catch (err: any) {
      setMsg({ type: 'error', text: `❌ Lỗi: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      {/* STEPPER TOP BAR (Identical to Image 2) */}
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
          { step: 1, titleJA: '処理依頼', titleVI: 'Yêu cầu mạ' },
          { step: 2, titleJA: '承認済', titleVI: 'Phê duyệt' },
          { step: 3, titleJA: '加工中', titleVI: 'Đang mạ' },
          { step: 4, titleJA: '完了', titleVI: 'Hoàn tất' }
        ].map((s, idx) => {
          const isActive = currentStep === s.step
          const isPassed = currentStep > s.step
          return (
            <React.Fragment key={s.step}>
              <div
                onClick={() => setCurrentStep(s.step as TeflonStep)}
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
                    {s.titleJA}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.titleVI}</span>
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

      {/* TWO COLUMN CONTENT */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 360 }}>
        {/* LEFT COLUMN: STEP FORM */}
        <div
          className="card-flat"
          style={{
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: 16,
            background: 'var(--bg-surface)'
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} />
            <span>
              {currentStep === 1 && '登録: 処理依頼 (Tạo Yêu Cầu Mạ)'}
              {currentStep === 2 && '承認 (Phê Duyệt Khách Hàng / Sếp)'}
              {currentStep === 3 && '発送: 加工中 (Xuất Khuôn Cho Nhà Mạ)'}
              {currentStep === 4 && '受領: 完了 (Nghiệm Thu Hoàn Tất)'}
            </span>
          </div>

          {msg && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                background: msg.type === 'error' ? 'var(--tint-orange-bg)' : 'var(--tint-teal-bg)',
                color: msg.type === 'error' ? 'var(--tint-orange-text)' : 'var(--tint-teal-text)'
              }}
            >
              {msg.text}
            </div>
          )}

          {/* Form Fields according to Step */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {/* Equipment Tag */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-surface-2)', padding: 8, borderRadius: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>金型 (Khuôn):</span>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)' }}>
                {data.equipment_code} · {data.display_name}
              </span>
            </div>

            {/* Employee Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                担当者 (Nhân viên phụ trách) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                className="form-input"
                value={selectedEmployeeId}
                onChange={e => setSelectedEmployeeId(e.target.value)}
                style={{ fontSize: 12 }}
              >
                {employees.map(e => (
                  <option key={e.employee_id} value={e.employee_id}>
                    👤 {e.employee_name} ({e.employee_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Teflon Vendor Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                テフロン業者 (Nhà cung cấp mạ Teflon) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                className="form-input"
                value={selectedVendorId}
                onChange={e => setSelectedVendorId(e.target.value)}
                style={{ fontSize: 12 }}
              >
                {teflonVendors.map(v => (
                  <option key={v.company_id} value={v.company_id}>
                    🏢 {v.company_name} ({v.company_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Pickers based on step */}
            {currentStep <= 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                  希望日 (Ngày mong muốn)
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={requestDate}
                  onChange={e => setRequestDate(e.target.value)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                    発送日 (Ngày gửi đi)
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={requestDate}
                    onChange={e => setRequestDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                    受領予定日 (Dự kiến nhận)
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={expectedDate}
                    onChange={e => setExpectedDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                    受領日 (Ngày nhận về)
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={actualDate}
                    onChange={e => setActualDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                    費用 / Chi phí (¥)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="VD: 50000"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                理由・備考 (Lý do / Ghi chú)
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Khái quát thông tin yêu cầu mạ Teflon..."
                style={{ fontSize: 12, resize: 'none' }}
              />
            </div>
          </div>

          {/* Form Action Buttons (Identical to Image 2) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'auto' }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSaveStep(false)}
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '8px 14px' }}
            >
              閉じで保存 (Lưu và Đóng)
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSaveStep(true)}
              className="btn btn-primary"
              style={{ fontSize: 12, padding: '8px 14px', background: '#3b82f6' }}
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : '保存して次へ (Lưu và Tiếp tục)'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORY TIMELINE */}
        <div
          className="card-flat"
          style={{
            flex: 0.8,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 14,
            background: 'var(--bg-surface)'
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <History size={16} />
            <span>履歴 (Lịch sử mạ)</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fetching ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                <Loader2 className="animate-spin" size={18} style={{ margin: '0 auto 6px auto' }} />
                <span>Đang tải lịch sử mạ...</span>
              </div>
            ) : teflonHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 12 }}>
                <History size={24} style={{ opacity: 0.3, margin: '0 auto 6px auto' }} />
                <div>履歴なし (Chưa có lịch sử)</div>
              </div>
            ) : (
              teflonHistory.map(j => (
                <div
                  key={j.job_id}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: 11,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span style={{ fontFamily: 'monospace' }}>{j.job_code}</span>
                    <span className="badge badge--info" style={{ fontSize: 9 }}>{j.job_status}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                    {j.created_at ? j.created_at.slice(0, 10) : ''}
                  </div>
                  {j.notes && <div style={{ color: 'var(--text-primary)', marginTop: 2 }}>{j.notes}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
