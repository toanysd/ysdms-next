import React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 h-[32px] px-4 py-2'
    
    const variants = {
      primary: 'bg-[var(--mcs-primary)] text-white hover:bg-[var(--mcs-primary-hover)]',
      secondary: 'bg-[var(--mcs-surface-3)] text-[var(--mcs-text)] hover:bg-[var(--mcs-border)] border border-[var(--mcs-border)]',
      danger: 'bg-[var(--mcs-error)] text-white hover:bg-[var(--mcs-error-hover)]',
      ghost: 'bg-transparent text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-hover)]'
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
