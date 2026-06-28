import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageLayout } from '@/components/layout/PageLayout'
import { SalonCard } from '@/components/salon/SalonCard'
import { Input } from '@/components/ui/Input'
import { Spinner, EmptyState } from '@/components/ui'
import { salonsService } from '@/services/salons.service'
import { useAuthStore } from '@/store/auth.store'

const FILTERS = ['All', 'Hair', 'Nails', 'Massage', 'Barber', 'Facial']

export const HomePage = () => {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['salons', search, activeFilter],
    queryFn: () => salonsService.getAll({
      search: search || undefined,
      type: activeFilter === 'All' ? undefined : activeFilter.toLowerCase(),
      limit: 20,
    }),
    staleTime: 30_000,
  })

  const featured = data?.data.filter(s => s.isFeatured) ?? []
  const all = data?.data ?? []

  return (
    <PageLayout>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-gradient-to-b from-[#0D0D0D] to-dark">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold mb-1">
              {user ? `Welcome back, ${user.firstName}` : 'Welcome'}
            </p>
            <h1 className="text-2xl font-black leading-tight">
              Find your <span className="text-gold">perfect</span>
              <br />appointment
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-lg shrink-0">
            ✨
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-base">🔍</span>
          <input
            className="w-full bg-[#161616] border border-dark-border rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/50"
            placeholder="Search salons, services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFilter === f
                  ? 'bg-gold text-dark border-gold'
                  : 'bg-transparent text-white/40 border-dark-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <section className="mt-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold">Featured</h2>
                  <button className="text-gold text-xs">See all</button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                  {featured.map(salon => (
                    <SalonCard key={salon.id} salon={salon} variant="featured" />
                  ))}
                </div>
              </section>
            )}

            {/* Divider */}
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,transparent,#C9A84C44,transparent)' }} />

            {/* All salons */}
            <section>
              <h2 className="text-base font-bold mb-1">Nearby Salons</h2>
              <p className="text-xs text-white/40 mb-4">Mostar · {all.length} salons found</p>

              {all.length === 0 ? (
                <EmptyState icon="🔍" title="No salons found" subtitle="Try a different search or filter" />
              ) : (
                <div className="flex flex-col gap-3">
                  {all.map(salon => (
                    <SalonCard key={salon.id} salon={salon} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </PageLayout>
  )
}
