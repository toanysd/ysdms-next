import React from 'react';
import { useLocale } from 'next-intl';

interface BilingualLabelProps {
  ja: string;
  vi: string;
  className?: string;
  jaClassName?: string;
  viClassName?: string;
}

export function BilingualLabel({ ja, vi, className = '', jaClassName = '', viClassName = '' }: BilingualLabelProps) {
  const locale = useLocale();
  return (
    <span className={`label block ${className}`}>
      {locale === 'vi' ? (
        <span className={`vi font-vi mt-[1px] ${viClassName}`}>{vi}</span>
      ) : (
        <span className={`ja font-jp text-mcs-text ${jaClassName}`}>{ja}</span>
      )}
    </span>
  );
}
