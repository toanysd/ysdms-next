'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function MoldBackButton() {
  const router = useRouter()
  const tCommon = useTranslations('Common')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={() => router.back()}
        className="btn btn-secondary"
        style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
        title={tCommon('back')}
      >
        <ArrowLeft size={13} />
        <span style={{ fontFamily: 'var(--font-jp)' }}>{tCommon('back')}</span>
      </button>
      <Link
        href="/equipment/molds"
        className="btn btn-secondary"
        style={{
          height: 28, padding: '0 8px', gap: 3, fontSize: 11,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
        }}
        title={tCommon('list')}
      >
        <ArrowUpFromLine size={12} />
        <span style={{ fontFamily: 'var(--font-jp)' }}>{tCommon('list')}</span>
      </Link>
    </div>
  )
}
