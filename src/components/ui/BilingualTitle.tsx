import React from 'react';
import { useLocale } from 'next-intl';

interface BilingualTitleProps {
  ja: string;
  vi?: string;
  className?: string;
  isPageTitle?: boolean;
}

export function BilingualTitle({ ja, vi, className = '', isPageTitle = false }: BilingualTitleProps) {
  const locale = useLocale();
  const isVi = locale === 'vi';
  const fontSize = isPageTitle ? (isVi ? '13px' : '16px') : (isVi ? '11px' : '14px');

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-semibold" style={{ color: 'var(--text-primary)', fontSize }}>
        {isVi ? (vi || ja) : ja}
      </span>
    </div>
  );
}

