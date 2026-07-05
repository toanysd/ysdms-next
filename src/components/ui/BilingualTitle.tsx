import React from 'react';

interface BilingualTitleProps {
  ja: string;
  vi: string;
  className?: string;
  isPageTitle?: boolean;
}

export function BilingualTitle({ ja, vi, className = '', isPageTitle = false }: BilingualTitleProps) {
  const jaSize = isPageTitle ? '16px' : '14px';
  const viSize = isPageTitle ? '13px' : '11px';
  
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-semibold text-slate-800" style={{ fontSize: jaSize }}>{ja}</span>
      <span className="font-normal text-slate-500" style={{ fontSize: viSize }}>{vi}</span>
    </div>
  );
}
