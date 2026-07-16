'use client'

import { useRouter } from 'next/navigation'
import { ClipboardList } from 'lucide-react'
import { WorklogFormShared } from '@/components/worklogs/WorklogFormShared'

/**
 * Wrapper trang /worklogs/new — dùng WorklogFormShared ở chế độ page (free-select Job).
 * Server Component cha (page.tsx) đã load employees + jobSteps; file này chỉ còn
 * chịu trách nhiệm điều hướng sau khi submit thành công.
 */
export default function WorklogForm() {
  const router = useRouter()

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* PageHeader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <ClipboardList size={20} style={{ color: 'var(--accent)' }} />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
          <span className="ja">作業ログ — 新規登録</span>
          <span className="vi"> / Nhật ký — Tạo mới</span>
        </h1>
      </div>

      <WorklogFormShared
        mode="page"
        onSuccess={(path) => {
          router.push(path || '/worklogs')
          router.refresh()
        }}
        onCancel={() => router.back()}
      />
    </div>
  )
}
