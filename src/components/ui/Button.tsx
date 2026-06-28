import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
          {
            // variants
            'bg-gradient-to-r from-gold to-gold-dim text-dark-DEFAULT hover:opacity-90 active:scale-95': variant === 'primary',
            'border border-gold text-gold hover:bg-gold/10 active:scale-95': variant === 'outline',
            'text-white/60 hover:text-white hover:bg-white/5': variant === 'ghost',
            'border border-red-500/50 text-red-400 hover:bg-red-500/10': variant === 'danger',
            // sizes
            'text-xs px-3 py-2': size === 'sm',
            'text-sm px-4 py-3': size === 'md',
            'text-base px-6 py-4': size === 'lg',
            // full width
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
