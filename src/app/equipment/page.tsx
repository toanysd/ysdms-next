'use client';

import { useTranslations } from 'next-intl';

export default function ToolingPage() {
  const t = useTranslations('Equipment');
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
          {t('Home.title')}
        </h1>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('Home.subtitle')}</span>
      </div>
      <div className="card-flat px-4 py-8 text-center">
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{t('Home.devWarning')}</p>
      </div>
    </div>
  )
}
