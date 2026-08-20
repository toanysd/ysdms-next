'use client'

import React, { useState, useEffect } from 'react'
import { X, Hammer, Save, Loader2, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export type JobEditData = {
  job_id: string
  job_code: string
  job_name: string | null
  job_status: string | null
  job_category?: string | null
  wo_type?: string | null
  mold_deadline?: string | null
  deadline?: string | null
  responsible_id?: string | null
  notes?: string | null
  equipment_id?: string | null
}

interface EditJobModalProps {
  isOpen: boolean
  job: JobEditData | null
  onClose: () => void
  onSuccess: () => void
}

export function EditJobModal({
  isOpen,
  job,
  onClose,
  onSuccess
}: EditJobModalProps) {
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Array<{ employee_id: string; employee_name: string }>>([])
  const [equipments, setEquipments] = useState<Array<{ equipment_id: string; equipment_code: string; display_name: string }>>([])

  const [formData, setFormData] = useState({
    job_code: '',
    job_name: '',
    job_status: 'NOT_STARTED',
    job_category: 'NEW',
    deadline: '',
    responsible_id: '',
    equipment_id: '',
    notes: ''
  })

  useEffect(() => {
    async function loadMasterData() {
      const [{ data: empData }, { data: eqData }] = await Promise.all([
        supabase.from('employees').select('employee_id, employee_name').order('employee_name', { ascending: true }),
        supabase.from('equipment').select('equipment_id, equipment_code, display_name').limit(100)
      ])
      if (empData) setEmployees(empData)
      if (eqData) setEquipments(eqData)
    }
    if (isOpen) loadMasterData()
  }, [isOpen, supabase])

  useEffect(() => {
    if (!isOpen || !job) return
    setError(null)

    const rawDeadline = job.mold_deadline || job.deadline
    const formattedDeadline = rawDeadline ? rawDeadline.split('T')[0] : ''

    setFormData({
      job_code: job.job_code || '',
      job_name: job.job_name || '',
      job_status: job.job_status || 'NOT_STARTED',
      job_category: job.job_category || job.wo_type || 'NEW',
      deadline: formattedDeadline,
      responsible_id: job.responsible_id || '',
      equipment_id: job.equipment_id || '',
      notes: job.notes || ''
    })
  }, [isOpen, job])

  if (!isOpen || !job) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.job_code.trim()) {
      setError('Jobコードは必須です (Job Code is required)')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: updateErr } = await supabase
        .from('jobs')
        .update({
          job_code: formData.job_code.trim(),
          job_name: formData.job_name.trim() || undefined,
          job_status: formData.job_status,
          job_category: formData.job_category,
          mold_deadline: formData.deadline || undefined,
          deadline: formData.deadline || undefined,
          responsible_id: formData.responsible_id || undefined,
          equipment_id: formData.equipment_id || undefined,
          notes: formData.notes.trim() || undefined
        })
        .eq('job_id', job.job_id)

      if (updateErr) throw new Error(updateErr.message)

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Job情報の更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 640, maxHeight: '90vh',
          background: 'var(--bg-surface)', borderRadius: 10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-purple-bg, var(--bg-surface-2))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Hammer size={18} style={{ color: 'var(--tint-purple-text)' }} />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                加工Job詳細編集 (Chỉnh sửa Tiến độ Job Gia công)
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {job.job_code}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: 20, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{
                padding: '10px 12px', borderRadius: 6, background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid-2" style={{ gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Jobコード (Mã Job) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input font-mono font-bold"
                  value={formData.job_code}
                  onChange={(e) => setFormData({ ...formData, job_code: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Job名 (Tên Job)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.job_name}
                  onChange={(e) => setFormData({ ...formData, job_name: e.target.value })}
                  placeholder="新規金型製作, 改造..."
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  ステータス (Trạng thái Job)
                </label>
                <select
                  className="form-input"
                  value={formData.job_status}
                  onChange={(e) => setFormData({ ...formData, job_status: e.target.value })}
                >
                  <option value="NOT_STARTED">未着手 (Not Started)</option>
                  <option value="IN_PROGRESS">進行中 (In Progress)</option>
                  <option value="COMPLETED">完了 (Completed)</option>
                  <option value="ON_HOLD">保留 (On Hold)</option>
                  <option value="CANCELLED">中止 (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Job種別 (Phân loại Job)
                </label>
                <select
                  className="form-input"
                  value={formData.job_category}
                  onChange={(e) => setFormData({ ...formData, job_category: e.target.value })}
                >
                  <option value="NEW">新規製作 (New Job)</option>
                  <option value="REPAIR">修理 (Repair)</option>
                  <option value="OVERHAUL">オーバーホール (Overhaul)</option>
                  <option value="MODIFICATION">改造 (Modification)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  金型納期 / 完了希望日 (Hạn chót)
                </label>
                <input
                  type="date"
                  className="form-input font-mono"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  担当者 (Người phụ trách)
                </label>
                <select
                  className="form-input"
                  value={formData.responsible_id}
                  onChange={(e) => setFormData({ ...formData, responsible_id: e.target.value })}
                >
                  <option value="">-- 未設定 --</option>
                  {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                対象設備 (Thiết bị liên kết)
              </label>
              <select
                className="form-input font-mono"
                value={formData.equipment_id}
                onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
              >
                <option value="">-- 設備を選択しない --</option>
                {equipments.map(eq => (
                  <option key={eq.equipment_id} value={eq.equipment_id}>
                    {eq.equipment_code} {eq.display_name ? `(${eq.display_name})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                備考・作業指示 (Ghi chú / Chỉ thị gia công)
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Jobのメモ、指示内容..."
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px', borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 8
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{tCommon('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
