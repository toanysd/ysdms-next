import React, { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelJa?: string;
  labelVi?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', labelJa, labelVi, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {(labelJa || labelVi) && (
          <label className="text-xs font-bold text-[var(--mcs-text)] flex flex-col">
            {labelJa && <span className="ja">{labelJa}</span>}
            {labelVi && <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">{labelVi}</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`h-[32px] px-3 text-xs border ${error ? 'border-[var(--mcs-error)]' : 'border-[var(--mcs-border)]'} focus:border-[var(--mcs-primary)] rounded w-full disabled:bg-[var(--mcs-surface-3)] disabled:text-[var(--mcs-text-muted)] ${className}`}
          {...props}
        />
        {error && <span className="text-[10px] text-[var(--mcs-error)] mt-0.5">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
