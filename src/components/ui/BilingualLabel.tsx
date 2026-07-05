import React from 'react';

interface BilingualLabelProps {
  ja: string;
  vi: string;
  className?: string;
  jaClassName?: string;
  viClassName?: string;
}

export function BilingualLabel({ ja, vi, className = '', jaClassName = '', viClassName = '' }: BilingualLabelProps) {
  return (
    <span className={`label block ${className}`}>
      <span className={`ja font-jp text-mcs-text ${jaClassName}`}>{ja}</span>
      <span className={`vi font-vi mt-[1px] ${viClassName}`}>{vi}</span>
    </span>
  );
}
