import { useTranslations } from 'next-intl'
import React, { forwardRef } from 'react'

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelJa?: string;
  labelVi?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, labelJa, labelVi, error, options, placeholder, ...props }, ref) => {
    const displayLabel = label || labelJa || labelVi;
    return (
      <div className="flex flex-col gap-1 w-full">
        {displayLabel && (
          <label className="text-xs font-bold text-[var(--mcs-text)] flex flex-col">
            {displayLabel}
          </label>
        )}
        <select
          ref={ref}
          className={`h-[32px] px-2 text-xs border ${error ? 'border-[var(--mcs-error)]' : 'border-[var(--mcs-border)]'} focus:border-[var(--mcs-primary)] rounded w-full disabled:bg-[var(--mcs-surface-3)] disabled:text-[var(--mcs-text-muted)] ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-[10px] text-[var(--mcs-error)] mt-0.5">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
