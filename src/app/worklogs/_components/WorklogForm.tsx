'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { ClipboardList, Save, X } from 'lucide-react'
import { createWorklog } from '../_actions/createWorklog'

// ── Types ───────────────────────────────────────────────────────────────────
type Employee = {
  employee_id: string
  employee_code: string
  employee_name: string | null
}

type JobStep = {
  step_id: string
  step_no: number | null
  step_name: string | null
  deadline: string | null
  job: { job_id: string; job_code: string; job_name: string | null } | null
}

type Props = {
  employees: Employee[]
  jobSteps: JobStep[]
}

// ── Component ────────────────────────────────────────────────────────────────
export default function WorklogForm({ employees, jobSteps }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  // WL-06: today default
  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createWorklog(formData)
      if (result?.error) {
        setServerError(result.error)
      } else {
        router.push('/worklogs')
        router.refresh()
      }
    })
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* PageHeader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <ClipboardList size={20} style={{ color: 'var(--accent)' }} />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
          <span className="ja">作業ログ — 新規登録</span>
          <span className="vi">Nhật ký — Tạo mới</span>
        </h1>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit}>
        <div className="card-flat" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {serverError && (
            <div style={{ padding: '10px 14px', borderRadius: 6, background: 'var(--color-error-bg, #fef2f2)', color: 'var(--color-error)', fontSize: 13 }}>
              {serverError}
            </div>
          )}

          {/* ── Row 1: Ngày làm việc + Nhân viên */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" htmlFor="work_date">
                <span className="ja">作業日 <span style={{ color: 'var(--color-error)' }}>*</span></span>
                <span className="vi">Ngày làm việc <span style={{ color: 'var(--color-error)' }}>*</span></span>
              </label>
              <input
                id="work_date"
                name="work_date"
                type="date"
                className="form-input"
                defaultValue={today}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" htmlFor="employee_id">
                <span className="ja">担当者 <span style={{ color: 'var(--color-error)' }}>*</span></span>
                <span className="vi">Nhân viên <span style={{ color: 'var(--color-error)' }}>*</span></span>
              </label>
              <select id="employee_id" name="employee_id" className="form-select" required>
                <option value="">— Chọn nhân viên / 担当者を選択 —</option>
                {employees.map(e => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {e.employee_code}{e.employee_name ? ` · ${e.employee_name}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Row 2: Bước công việc */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="form-label" htmlFor="job_step_id">
              <span className="ja">工程ステップ <span style={{ color: 'var(--color-error)' }}>*</span></span>
              <span className="vi">Bước công việc <span style={{ color: 'var(--color-error)' }}>*</span></span>
            </label>
            <select id="job_step_id" name="job_step_id" className="form-select" required>
              <option value="">— Chọn bước / 工程を選択 —</option>
              {jobSteps.map(s => {
                const jobLabel = s.job
                  ? `[${s.job.job_code}] `
                  : ''
                const stepLabel = `#${s.step_no ?? '?'} ${s.step_name ?? ''}`
                const deadline = s.deadline ? ` (DL: ${s.deadline})` : ''
                return (
                  <option key={s.step_id} value={s.step_id}>
                    {jobLabel}{stepLabel}{deadline}
                  </option>
                )
              })}
            </select>
          </div>

          {/* ── Row 3: Số giờ + Trạng thái */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" htmlFor="hours_spent">
                <span className="ja">作業時間 (h) <span style={{ color: 'var(--color-error)' }}>*</span></span>
                <span className="vi">Số giờ làm <span style={{ color: 'var(--color-error)' }}>*</span></span>
              </label>
              <input
                id="hours_spent"
                name="hours_spent"
                type="number"
                className="form-input"
                min="0.5"
                max="24"
                step="0.5"
                placeholder="8.0"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* WL-07: Checkbox is_finished */}
              <label className="form-label">
                <span className="ja">ステータス</span>
                <span className="vi">Trạng thái</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="is_finished"
                  value="true"
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13 }}>
                  <span className="ja">工程完了</span>
                  <span className="vi">Hoàn thành bước này</span>
                </span>
              </label>
            </div>
          </div>

          {/* ── Row 4: Ghi chú */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="form-label" htmlFor="notes">
              <span className="ja">備考</span>
              <span className="vi">Ghi chú</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              rows={3}
              placeholder="作業内容、特記事項など... / Nội dung công việc, ghi chú thêm..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* ── Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => router.back()}
              disabled={isPending}
            >
              <X size={15} />
              <span className="ja">キャンセル</span>
              <span className="vi">Hủy</span>
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              disabled={isPending}
            >
              <Save size={15} />
              <span className="ja">{isPending ? '登録中…' : '登録する'}</span>
              <span className="vi">{isPending ? 'Đang lưu…' : 'Lưu'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
