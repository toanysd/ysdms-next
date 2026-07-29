'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { setUserLocale } from '@/actions/locale';

export default function LanguageSwitcher() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'ja' ? 'vi' : 'ja';
    startTransition(async () => {
      await setUserLocale(nextLocale);
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors font-bold text-[12px]"
      style={{
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
        opacity: isPending ? 0.5 : 1
      }}
      title={t('switchLanguage')}
    >
      {locale.toUpperCase()}
    </button>
  );
}
