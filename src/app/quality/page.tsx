'use client'

import { useTranslations } from 'next-intl'

export default function QualityPage() {
  const t = useTranslations('Quality')

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3 bg-[var(--tint-teal-bg)] p-3 rounded-lg border border-[var(--mcs-border)]">
        <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h1>
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </span>
      </div>
      <div className="card-flat px-4 py-8 text-center">
        <p className="text-[13px] font-bold" style={{ color: 'var(--text-muted)' }}>
          {t('inDevelopment')}
        </p>
      </div>
    </div>
  )
}

