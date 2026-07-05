'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import Link from 'next/link'

export function MoldBackButton() {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={() => router.back()}
        className="btn btn-secondary"
        style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
        title="前のページに戻る / Quay lại trang trước"
      >
        <ArrowLeft size={13} />
        <span style={{ fontFamily: 'var(--font-jp)' }}>戻る</span>
      </button>
      <Link
        href="/equipment/molds"
        className="btn btn-secondary"
        style={{
          height: 28, padding: '0 8px', gap: 3, fontSize: 11,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
        }}
        title="一覧へ / Về danh sách khuôn"
      >
        <ArrowUpFromLine size={12} />
        <span style={{ fontFamily: 'var(--font-jp)' }}>一覧</span>
      </Link>
    </div>
  )
}
