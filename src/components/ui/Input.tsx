import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold tracking-widest uppercase text-white/50">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'bg-[#161616] border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200',
            'focus:border-gold/60 focus:ring-1 focus:ring-gold/20',
            error ? 'border-red-500/60' : 'border-dark-border',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
