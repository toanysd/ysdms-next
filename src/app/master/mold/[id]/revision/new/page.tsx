import Link from 'next/link'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { addRevisionAction, suggestNextRevisionLabel } from '@/app/actions/mold'
import { notFound } from 'next/navigation'
import RevisionFormClient from './RevisionFormClient'

type Props = {
  params: Promise<{ id: string }>
}

export default async function NewRevisionPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Lấy thông tin Khuôn gốc cha
  const { data: moldBase, error } = await supabase
    .from('mold_base')
    .select('id, code, name')
    .eq('id', id)
    .single()

  if (error || !moldBase) {
    notFound()
  }

  // Gợi ý nhãn tiếp theo
  const suggestedLabel = await suggestNextRevisionLabel(id)

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href={`/master/mold/${id}`} className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">新規設計版登録 — {moldBase.code}</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Tạo Phiên bản thiết kế mới</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Hướng dẫn */}
        <div className="mb-6 p-4 bg-[var(--mcs-info-light)] border-l-4 border-[var(--mcs-info)] rounded-r flex flex-col gap-1">
          <span className="ja font-bold text-[12px] text-[var(--mcs-info-text)]">💡 設計版 (Revision) とは？</span>
          <span className="vi text-[11px] text-[var(--mcs-text-secondary)] leading-relaxed">
            Mỗi Revision là một phiên bản thiết kế của khuôn <strong>{moldBase.code}</strong>. 
            Nhập nhãn phiên bản (ví dụ: R1, R2, NO1, TYPE2). Hệ thống sẽ tự động ghép thành mã hệ thống: <strong>{moldBase.code}-R1</strong>.
          </span>
        </div>

        {/* Client Component chứa Form tương tác */}
        <RevisionFormClient
          moldBaseId={moldBase.id}
          moldBaseCode={moldBase.code}
          suggestedLabel={suggestedLabel}
          addRevisionAction={addRevisionAction}
        />
      </div>
    </div>
  )
}
