import React from 'react';
import { BilingualTitle } from './BilingualTitle';

interface PageHeaderProps {
  titleJa: string;
  titleVi: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ titleJa, titleVi, description, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-3">
      <div>
        <BilingualTitle ja={titleJa} vi={titleVi} isPageTitle={true} />
        {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
      </div>
      {actions && (
        <div className="flex gap-2 items-center">
          {actions}
        </div>
      )}
    </div>
  );
}
