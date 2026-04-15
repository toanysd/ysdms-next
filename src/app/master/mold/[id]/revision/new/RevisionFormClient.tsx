'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Save, Sparkles } from 'lucide-react'

type Props = {
  moldBaseId: string
  moldBaseCode: string
  suggestedLabel: string
  addRevisionAction: (formData: FormData) => Promise<void>
}

export default function RevisionFormClient({ moldBaseId, moldBaseCode, suggestedLabel, addRevisionAction }: Props) {
  const [versionLabel, setVersionLabel] = useState(suggestedLabel)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Live preview: Mã hệ thống sẽ được tự sinh
  const previewCode = versionLabel.trim() ? `${moldBaseCode}-${versionLabel.trim()}` : ''
  // Nhãn hiển thị thân thiện (dấu cách thay vì dấu gạch)
  const displayLabel = versionLabel.trim() ? `${moldBaseCode} ${versionLabel.trim()}` : ''

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      await addRevisionAction(formData)
      // Nếu thành công, Server Action sẽ redirect tự động
    } catch (err: any) {
      setErrorMsg(err?.message || 'Lỗi không xác định')
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Hidden fields cho Server Action */}
      <input type="hidden" name="mold_base_id" value={moldBaseId} />
      <input type="hidden" name="mold_base_code" value={moldBaseCode} />

      <div className="flex flex-col gap-4">

        {/* Nhãn phiên bản (version_label) */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-bold">
            <span className="ja">版ラベル <span className="text-[var(--mcs-error)]">*</span></span>
            <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Nhãn phiên bản (VD: R1, R2, NO1, TYPE2)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="version_label"
              required
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              className="w-full h-[38px] font-mono text-sm pl-3 pr-10"
              placeholder="VD: R1"
            />
            {suggestedLabel && versionLabel === suggestedLabel && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-[var(--mcs-primary)] font-bold">
                <Sparkles size={12} />
                Auto
              </span>
            )}
          </div>
          {suggestedLabel && (
            <span className="text-[10px] text-[var(--mcs-text-muted)] flex items-center gap-1">
              <Sparkles size={10} />
              Gợi ý tự động: <strong>{suggestedLabel}</strong> (Có thể thay đổi)
            </span>
          )}
        </div>

        {/* Live Preview: Mã hệ thống tự sinh */}
        {previewCode && (
          <div className="p-3 bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] rounded-lg">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[var(--mcs-text-muted)] text-[10px] font-bold uppercase tracking-wide">
                  <span className="ja">システムコード</span> <span className="vi">/ Mã hệ thống (DB)</span>
                </span>
                <span className="font-mono font-bold text-[14px] text-[var(--mcs-text)]">{previewCode}</span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[var(--mcs-text-muted)] text-[10px] font-bold uppercase tracking-wide">
                  <span className="ja">表示名</span> <span className="vi">/ Hiển thị UI</span>
                </span>
                <span className="font-bold text-[14px] text-[var(--mcs-primary)]">{displayLabel}</span>
              </div>
            </div>
          </div>
        )}

        {/* Ngày phê duyệt (approved_date) */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-bold">
            <span className="ja">承認日</span>
            <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Ngày phê duyệt (Để trống nếu chưa duyệt)</span>
          </label>
          <input
            type="date"
            name="approved_date"
            className="w-full h-[38px] text-sm"
          />
        </div>

      </div>

      {/* Thông báo lỗi */}
      {errorMsg && (
        <div className="p-3 bg-[var(--mcs-error-light)] border border-[var(--mcs-error)] border-opacity-30 rounded text-[var(--mcs-error-text)] text-[12px] font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Nút hành động */}
      <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6">
        <Link href={`/master/mold/${moldBaseId}`}>
          <button type="button" className="h-[34px] px-4 rounded border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-2)] transition-colors">
            <span className="ja">キャンセル</span>
            <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-4px]">Hủy bỏ</span>
          </button>
        </Link>

        <button
          type="submit"
          disabled={isSubmitting || !versionLabel.trim()}
          className="h-[34px] px-6 rounded bg-[var(--mcs-primary)] text-white font-bold hover:bg-[var(--mcs-primary-hover)] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          <div className="flex flex-col leading-none mt-[2px]">
            <span className="ja">{isSubmitting ? '処理中...' : '保存'}</span>
            <span className="vi text-[9px] font-normal opacity-80 block mt-[1px]">{isSubmitting ? 'Đang lưu...' : 'Lưu Revision'}</span>
          </div>
        </button>
      </div>
    </form>
  )
}
