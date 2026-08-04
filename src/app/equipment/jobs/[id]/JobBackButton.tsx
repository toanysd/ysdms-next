'use client'

import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function JobBackButton() {
  const router = useRouter()
  const tCommon = useTranslations('Common')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <button
        onClick={() => router.back()}
        className="btn-icon"
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-surface-2)', border: 'none', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', color: 'var(--text-secondary)'
        }}
        title={tCommon('back')}
      >
        <ArrowLeft size={16} />
      </button>

      <Link
        href="/equipment/jobs"
        className="btn-icon"
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-surface-2)', border: 'none', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', color: 'var(--text-secondary)'
        }}
        title={tCommon('list')}
      >
        <ArrowUpFromLine size={16} />
      </Link>
    </div>
  )
}
