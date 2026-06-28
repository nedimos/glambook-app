import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import type { Salon } from '@/types'
import { StarRating, Badge } from '@/components/ui'

interface SalonCardProps {
  salon: Salon
  variant?: 'horizontal' | 'featured'
}

export const SalonCard = ({ salon, variant = 'horizontal' }: SalonCardProps) => {
  const navigate = useNavigate()

  if (variant === 'featured') {
    return (
      <div
        onClick={() => navigate(`/salons/${salon.slug}`)}
        className="min-w-[220px] bg-dark-card rounded-2xl border border-dark-border border-l-gold border-l-2 overflow-hidden cursor-pointer active:scale-95 transition-transform"
      >
        <div className="h-24 bg-gradient-to-br from-[#1A1500] to-dark flex items-center justify-center text-5xl">
          💇‍♀️
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <div className="font-bold text-sm">{salon.name}</div>
            <Badge label={salon.isVerified ? 'Open' : 'Closed'} variant={salon.isVerified ? 'open' : 'closed'} />
          </div>
          <div className="text-white/40 text-xs mb-2">{salon.type}</div>
          <div className="flex justify-between items-center">
            <StarRating rating={salon.rating} />
            <span className="text-gold text-xs font-bold">from 25 KM</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/salons/${salon.slug}`)}
      className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden cursor-pointer active:scale-[0.99] transition-transform flex"
    >
      <div className="w-24 bg-gradient-to-br from-[#1A1500] to-dark flex items-center justify-center text-4xl shrink-0">
        💇‍♀️
      </div>
      <div className="p-3 flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="font-bold text-sm truncate">{salon.name}</div>
          <Badge label="Open" variant="open" />
        </div>
        <div className="text-white/40 text-xs mt-0.5">{salon.type}</div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {salon.city && (
            <span className="text-[10px] text-gold-light bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5">
              {salon.city}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <StarRating rating={salon.rating} />
          <span className="text-gold text-xs font-bold">from 25 KM</span>
        </div>
      </div>
    </div>
  )
}
