'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Briefcase, ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const CASE_TYPES = [
  { value: 'new_tray',          labelJA: '新規トレイ',      labelVI: 'Khay mới' },
  { value: 'repeat_order',      labelJA: '追加注文',        labelVI: 'Đặt lại' },
  { value: 'mold_modification', labelJA: '金型改造',        labelVI: 'Sửa khuôn' },
  { value: 'material_change',   labelJA: '材料変更',        labelVI: 'Đổi vật liệu' },
  { value: 'complaint',         labelJA: 'クレーム',        labelVI: 'Khiếu nại' },
  { value: 'inventory_audit',   labelJA: '棚卸依頼',       labelVI: 'Kiểm kê khuôn' },
  { value: 'tray_review',       labelJA: '収納トレイ検討',  labelVI: 'Xem xét thiết kế tray' },
  { value: 'other',             labelJA: 'その他',          labelVI: 'Khác' },
]

export default function NewCasePage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    case_type: 'new_tray',
    customer_id: '',
    sales_owner_id: '',
    requested_due_date: '',
    instruction_notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [companies, setCompanies] = useState<{company_id: string, company_name: string}[]>([])
  const [employees, setEmployees] = useState<{employee_id: string, employee_name: string}[]>([])

  useEffect(() => {
    async function loadOptions() {
      const [{ data: compData }, { data: empData }] = await Promise.all([
        supabase.from('companies').select('company_id, company_name').order('company_name'),
        supabase.from('employees').select('employee_id, employee_name').order('employee_name')
      ])
      if (compData) setCompanies(compData)
      if (empData) setEmployees(empData as {employee_id: string, employee_name: string}[])
    }
    loadOptions()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です / Tiêu đề là bắt buộc'); return }
    setSaving(true)
    setError(null)

    const { data, error: insertError } = await (supabase as any)
      .from('business_cases')
      .insert({
        title: form.title.trim(),
        case_type: form.case_type,
        status: 'open',
        customer_id: form.customer_id || null,
        sales_owner_id: form.sales_owner_id || null,
        requested_due_date: form.requested_due_date || null,
        instruction_notes: form.instruction_notes || null,
      })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push(`/cases/${data.id}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <Link href="/cases"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)',
            textDecoration: 'none', fontSize: 13 }}>
          <ArrowLeft size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>事案一覧</span>
        </Link>
        <span style={{ color: 'var(--border-strong)' }}>/</span>
        <Briefcase size={18} style={{ color: 'var(--accent)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-jp)', fontSize: 15, fontWeight: 700 }}>新規事案登録</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tạo mới Sự việc</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        {error && (
          <div className="form-callout form-callout--error" style={{ marginBottom: 12 }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-section">
          <div className="form-section-header">
            <Briefcase size={14} className="section-icon" />
            <span style={{ fontFamily: 'var(--font-jp)' }}>基本情報</span>
            <span style={{ marginLeft: 6, opacity: 0.6 }}>Thông tin cơ bản</span>
          </div>
          <div className="form-section-body">
            <div className="form-grid-1" style={{ gap: 12 }}>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-ja">タイトル <span className="label-required">*</span></span>
                  <span className="label-vi">Tiêu đề sự việc (bắt buộc)</span>
                </label>
                <input type="text" className="form-input"
                  placeholder="例: JAE AB30トレイ 新規開発依頼"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-ja">事案種別</span>
                  <span className="label-vi">Loại sự việc</span>
                </label>
                <select className="form-select"
                  value={form.case_type}
                  onChange={e => setForm(f => ({ ...f, case_type: e.target.value }))}>
                  {CASE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.labelJA} / {t.labelVI}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-ja">得意先 <span className="label-required">*</span></span>
                  <span className="label-vi">Khách hàng</span>
                </label>
                <select className="form-select" required
                  value={form.customer_id}
                  onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}>
                  <option value="">-- 選択 / Chọn --</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-ja">営業担当 <span className="label-required">*</span></span>
                  <span className="label-vi">Phụ trách KD</span>
                </label>
                <select className="form-select" required
                  value={form.sales_owner_id}
                  onChange={e => setForm(f => ({ ...f, sales_owner_id: e.target.value }))}>
                  <option value="">-- 選択 / Chọn --</option>
                  {employees.map(e => (
                    <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-ja">希望納期</span>
                  <span className="label-vi">Hạn yêu cầu giao hàng</span>
                </label>
                <input type="date" className="form-input"
                  value={form.requested_due_date}
                  onChange={e => setForm(f => ({ ...f, requested_due_date: e.target.value }))} />
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-ja">指示メモ</span>
                  <span className="label-vi">Ghi chú / chỉ thị ban đầu</span>
                </label>
                <textarea className="form-textarea"
                  placeholder="メールからの引用や担当者メモなど"
                  rows={4}
                  value={form.instruction_notes}
                  onChange={e => setForm(f => ({ ...f, instruction_notes: e.target.value }))} />
              </div>

            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link href="/cases" className="btn btn-secondary">
            <span style={{ fontFamily: 'var(--font-jp)' }}>キャンセル</span>
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}>
            <Save size={14} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{saving ? '保存中...' : '保存して開く'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
