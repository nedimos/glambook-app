import { clsx } from 'clsx'

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string
  variant?: 'gold' | 'open' | 'closed' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

const badgeStyles: Record<string, string> = {
  gold: 'bg-gold/10 text-gold-light border border-gold/30',
  open: 'bg-green-950 text-green-400',
  closed: 'bg-red-950 text-red-400',
  pending: 'bg-yellow-950 text-yellow-400',
  confirmed: 'bg-green-950 text-green-400',
  completed: 'bg-white/5 text-white/50',
  cancelled: 'bg-red-950 text-red-400',
}

export const Badge = ({ label, variant = 'gold' }: BadgeProps) => (
  <span className={clsx('text-[10px] font-bold px-2.5 py-1 rounded-full', badgeStyles[variant])}>
    {label}
  </span>
)

// ─── StarRating ───────────────────────────────────────────────────────────────

export const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => (
  <span className={clsx('text-gold tracking-wider', size === 'sm' ? 'text-xs' : 'text-sm')}>
    {'★'.repeat(Math.floor(rating))}
    {'☆'.repeat(5 - Math.floor(rating))}
    <span className="text-white/40 ml-1">{rating.toFixed(1)}</span>
  </span>
)

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={clsx('animate-spin h-5 w-5 text-gold', className)}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

// ─── Gold Divider ─────────────────────────────────────────────────────────────

export const GoldDivider = ({ className }: { className?: string }) => (
  <div
    className={clsx('h-px my-4', className)}
    style={{ background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)' }}
  />
)

// ─── Empty State ──────────────────────────────────────────────────────────────

export const EmptyState = ({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <div className="font-bold text-lg mb-1">{title}</div>
    {subtitle && <div className="text-sm text-white/40">{subtitle}</div>}
  </div>
)
