'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Wrench, X, Calendar, User, FileText, CheckCircle2, Loader2, Sparkles, Hammer } from 'lucide-react'

interface QuickAddRepairJobModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productCode: string
  equipment: {
    equipment_id: string
    equipment_code: string
    display_name: string
    equipment_type: string
  } | null
  onCreated: () => void
}

export function QuickAddRepairJobModal({
  isOpen,
  onClose,
  productId,
  productCode,
  equipment,
  onCreated,
}: QuickAddRepairJobModalProps) {
  const t = useTranslations('ProductCenter')
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const [jobCategory, setJobCategory] = useState<'REPAIR' | 'MAINTENANCE' | 'REMAKE'>('REPAIR')
  const [jobTitle, setJobTitle] = useState('')
  const [instructionSource, setInstructionSource] = useState('')
  const [deadline, setDeadline] = useState('')
  const [responsibleId, setResponsibleId] = useState('')
  const [estimatedHours, setEstimatedHours] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [updateStampSuffix, setUpdateStampSuffix] = useState(false)
  const [newStampSuffix, setNewStampSuffix] = useState('R1')

  const [employees, setEmployees] = useState<{ employee_id: string; employee_name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    async function loadEmployees() {
      const { data } = await supabase
        .from('employees')
        .select('employee_id, employee_name')
        .eq('is_active', true)
        .order('employee_name')
      if (data) setEmployees(data)
    }
    loadEmployees()

    // Default title based on equipment
    if (equipment) {
      if (jobCategory === 'REPAIR') {
        setJobTitle(`${equipment.equipment_type === 'MOLD' ? '金型改修' : '設備改修'}: ${equipment.display_name || equipment.equipment_code}`)
      } else if (jobCategory === 'MAINTENANCE') {
        setJobTitle(`定期保守: ${equipment.display_name || equipment.equipment_code}`)
      } else {
        setJobTitle(`再製作: ${equipment.display_name || equipment.equipment_code}`)
      }
    }
  }, [isOpen, equipment, jobCategory, supabase])

  if (!isOpen || !equipment) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobTitle.trim()) {
      setError('Vui lòng nhập tên công việc')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // 1. Generate clean job_code
      const rand = Math.floor(1000 + Math.random() * 9000)
      const cleanEquip = equipment.equipment_code.replace(/[^A-Z0-9]/gi, '').toUpperCase()
      const prefix = jobCategory === 'REPAIR' ? 'REP' : jobCategory === 'MAINTENANCE' ? 'MNT' : 'RMK'
      const jobCode = `JOB-${prefix}-${cleanEquip}-${rand}`

      const combinedNotes = [
        instructionSource.trim() ? `【指示元】${instructionSource.trim()}` : null,
        notes.trim() ? notes.trim() : null,
      ].filter(Boolean).join('\n\n')

      // 2. Insert Job
      const { data: newJob, error: jobErr } = await supabase
        .from('jobs')
        .insert({
          job_code: jobCode,
          job_name: jobTitle.trim(),
          product_id: productId,
          equipment_id: equipment.equipment_id,
          job_status: 'NEW',
          job_category: jobCategory,
          deadline: deadline || null,
          mold_deadline: deadline || null,
          estimated_hours: estimatedHours ? Number(estimatedHours) : null,
          responsible_id: responsibleId || null,
          notes: combinedNotes || null,
        })
        .select('job_id')
        .single()

      if (jobErr || !newJob) {
        throw new Error(jobErr?.message || 'Lỗi khi tạo Job')
      }

      // 3. Create initial step for this job
      const stepName = jobCategory === 'REPAIR' ? '改修加工・修正' : jobCategory === 'MAINTENANCE' ? '点検・メンテナンス' : '部品再製作'
      await supabase.from('job_steps').insert({
        job_id: newJob.job_id,
        step_no: 1,
        step_name: stepName,
        condition: 'EXISTING',
        arrangement: 'NOT_REQUIRED',
        manufacture_location: 'IN_HOUSE',
        estimated_hours: estimatedHours ? Number(estimatedHours) : null,
        deadline: deadline || null,
      })

      // 4. Update physical_stamp if selected (e.g. MOLD updated with R1 stamp)
      if (updateStampSuffix && newStampSuffix.trim()) {
        const currentStamp = equipment.display_name || equipment.equipment_code
        const cleanStamp = currentStamp.replace(/\s*R\d+$/i, '').trim()
        const updatedDisplayName = `${cleanStamp} ${newStampSuffix.trim().toUpperCase()}`
        
        await supabase
          .from('equipment')
          .update({
            display_name: updatedDisplayName,
            physical_stamp: updatedDisplayName,
            updated_at: new Date().toISOString()
          })
          .eq('equipment_id', equipment.equipment_id)
      }

      onCreated()
      onClose()
    } catch (err: any) {
      console.error('Error creating repair job:', err)
      setError(err.message || 'Không thể tạo Job')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 580,
          background: 'var(--bg-surface)',
          borderRadius: 8,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-orange-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: '#fff', border: '1px solid var(--tint-orange-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--tint-orange-text)',
              }}
            >
              <Wrench size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('createRepairJobTitle')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                対象設備: <strong className="font-mono text-slate-800">{equipment.display_name || equipment.equipment_code}</strong> ({equipment.equipment_type})
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {error && (
            <div style={{ padding: '8px 12px', background: 'var(--tint-error-bg)', color: 'var(--tint-error-text)', fontSize: 12, borderRadius: 4 }}>
              {error}
            </div>
          )}

          {/* Job Category Tabs */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>{t('jobCategory')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setJobCategory('REPAIR')}
                className={`btn ${jobCategory === 'REPAIR' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 11, padding: '6px 4px', justifyContent: 'center' }}
              >
                🔧 改修 (Repair)
              </button>
              <button
                type="button"
                onClick={() => setJobCategory('MAINTENANCE')}
                className={`btn ${jobCategory === 'MAINTENANCE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 11, padding: '6px 4px', justifyContent: 'center' }}
              >
                🧹 保守 (Maint)
              </button>
              <button
                type="button"
                onClick={() => setJobCategory('REMAKE')}
                className={`btn ${jobCategory === 'REMAKE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 11, padding: '6px 4px', justifyContent: 'center' }}
              >
                🔄 再製作 (Remake)
              </button>
            </div>
          </div>

          {/* Job Name */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
              ジョブ名 / 修正内容 <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="例: 金型改修: 下深さ -0.5mm 修正"
              required
              style={{ fontSize: 13, fontWeight: 600 }}
            />
          </div>

          {/* Instruction Source */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
              {t('instructionSource')}
            </label>
            <input
              type="text"
              className="form-input"
              value={instructionSource}
              onChange={(e) => setInstructionSource(e.target.value)}
              placeholder={t('instructionSourcePlaceholder')}
              style={{ fontSize: 12 }}
            />
          </div>

          {/* Grid: Deadline & Responsible */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                完了希望日 (納期)
              </label>
              <input
                type="date"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                担当者
              </label>
              <select
                className="form-input"
                value={responsibleId}
                onChange={(e) => setResponsibleId(e.target.value)}
                style={{ fontSize: 12 }}
              >
                <option value="">— 選択なし —</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimated Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                {t('estimatedHours')} (h)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="例: 2.5"
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            {/* Stamp suffix option for Molds */}
            {equipment.equipment_type === 'MOLD' && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginTop: 14 }}>
                  <input
                    type="checkbox"
                    checked={updateStampSuffix}
                    onChange={(e) => setUpdateStampSuffix(e.target.checked)}
                  />
                  <span>金型打刻・名称を更新</span>
                </label>
                {updateStampSuffix && (
                  <input
                    type="text"
                    className="form-input"
                    value={newStampSuffix}
                    onChange={(e) => setNewStampSuffix(e.target.value)}
                    placeholder="R1, R2..."
                    style={{ fontFamily: 'monospace', fontSize: 11, marginTop: 4, height: 26 }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
              詳細指示・備考
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="作業内容、注意点、加工箇所など..."
              style={{ fontSize: 12 }}
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              gap: 8, marginTop: 8, paddingTop: 12,
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
              style={{ fontSize: 12 }}
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ fontSize: 12, gap: 6 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>{saving ? '保存中...' : 'ジョブを登録'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
