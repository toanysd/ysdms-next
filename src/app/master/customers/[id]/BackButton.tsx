'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 2,
        color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
      }}
      title="前のページに戻る / Quay lại trang trước"
    >
      <ArrowLeft size={17} />
    </button>
  )
}
