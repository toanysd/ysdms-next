import React from 'react';
import { useLocale } from 'next-intl';

interface BilingualTitleProps {
  ja: string;
  vi: string;
  className?: string;
  isPageTitle?: boolean;
}

export function BilingualTitle({ ja, vi, className = '', isPageTitle = false }: BilingualTitleProps) {
  const locale = useLocale();
  const jaSize = isPageTitle ? '16px' : '14px';
  const viSize = isPageTitle ? '13px' : '11px';
  
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-semibold text-slate-800" style={{ fontSize: locale === 'vi' ? viSize : jaSize }}>
        {locale === 'vi' ? vi : ja}
      </span>
    </div>
  );
}
