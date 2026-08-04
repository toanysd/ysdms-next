'use client'

import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function ShipmentBackButton() {
  const router = useRouter()
  const t = useTranslations('Cases')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 'var(--radius-md)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
        }}
      >
        <ArrowLeft size={14} />
        {t('back')}
      </button>

      <Link
        href="/orders/shipments"
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 'var(--radius-md)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
          textDecoration: 'none'
        }}
      >
        <ArrowUpFromLine size={14} />
        {t('list')}
      </Link>
    </div>
  )
}
