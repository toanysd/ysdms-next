'use client'

import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function ShipmentBackButton() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 'var(--radius-md)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
          fontFamily: 'var(--font-jp)',
        }}
        title="前の画面に戻る"
      >
        <ArrowLeft size={14} />
        戻る
      </button>

      <Link
        href="/orders/shipments"
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 'var(--radius-md)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
          fontFamily: 'var(--font-jp)', textDecoration: 'none'
        }}
        title="出荷一覧へ"
      >
        <ArrowUpFromLine size={14} />
        一覧
      </Link>
    </div>
  )
}
