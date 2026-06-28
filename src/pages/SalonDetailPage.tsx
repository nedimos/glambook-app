import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { StarRating, Badge, GoldDivider, Spinner } from '@/components/ui'
import { salonsService } from '@/services/salons.service'
import { useBookingStore } from '@/store/booking.store'
import type { Service, StaffMember } from '@/types'

type Tab = 'services' | 'staff' | 'info'

export const SalonDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('services')
  const { setSalon, setService, setStaff } = useBookingStore()

  const { data: salon, isLoading } = useQuery({
    queryKey: ['salon', slug],
    queryFn: () => salonsService.getBySlug(slug!),
    enabled: !!slug,
  })

  const handleBookService = (service: Service) => {
    if (!salon) return
    setSalon(salon)
    setService(service)
    navigate('/book')
  }

  const handleBookStaff = (staff: StaffMember) => {
    if (!salon) return
    setSalon(salon)
    setStaff(staff)
    navigate('/book')
  }

  if (isLoading) return (
    <PageLayout hideNav>
      <div className="flex justify-center py-32"><Spinner /></div>
    </PageLayout>
  )

  if (!salon) return (
    <PageLayout hideNav>
      <div className="flex flex-col items-center py-32 gap-4">
        <div className="text-5xl">😕</div>
        <div className="font-bold">Salon not found</div>
        <Button onClick={() => navigate('/')}>Go home</Button>
      </div>
    </PageLayout>
  )

  // Group services by category
  const categories = salon.serviceCategories
  const grouped = categories.map(cat => ({
    category: cat,
    services: salon.services.filter(s => s.categoryId === cat.id),
  })).filter(g => g.services.length > 0)

  const uncategorized = salon.services.filter(s => !s.categoryId)

  return (
    <PageLayout hideNav>
      {/* Hero */}
      <div className="relative h-52 bg-gradient-to-br from-[#1A1500] to-dark flex items-center justify-center text-8xl">
        💇‍♀️
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 bg-black/50 backdrop-blur border border-dark-border rounded-xl px-3 py-2 text-lg">←</button>
        <button className="absolute top-12 right-4 bg-black/50 backdrop-blur border border-dark-border rounded-xl px-3 py-2 text-gold text-lg">♡</button>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark to-transparent" />
      </div>

      <div className="px-5">
        {/* Salon header */}
        <div className="mt-2 mb-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h1 className="text-xl font-black">{salon.name}</h1>
              <p className="text-white/40 text-sm">{salon.type} · {salon.city}</p>
            </div>
            <Badge label="Open" variant="open" />
          </div>
          <div className="flex gap-4 items-center mt-3">
            <StarRating rating={salon.rating} size="md" />
            <span className="text-white/40 text-xs">{salon.reviewCount} reviews</span>
          </div>
          {salon.description && (
            <p className="text-sm text-white/60 mt-3 leading-relaxed">{salon.description}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-border mb-5">
          {(['services', 'staff', 'info'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase capitalize border-b-2 transition-colors ${
                tab === t ? 'border-gold text-gold' : 'border-transparent text-white/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Services */}
        {tab === 'services' && (
          <div className="space-y-6">
            {grouped.map(({ category, services }) => (
              <div key={category.id}>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: category.color }}>
                  {category.name}
                </p>
                <div className="space-y-2">
                  {services.map(service => (
                    <ServiceRow key={service.id} service={service} onBook={handleBookService} />
                  ))}
                </div>
              </div>
            ))}
            {uncategorized.length > 0 && uncategorized.map(service => (
              <ServiceRow key={service.id} service={service} onBook={handleBookService} />
            ))}
          </div>
        )}

        {/* Staff */}
        {tab === 'staff' && (
          <div className="space-y-3">
            {salon.staff.map(member => (
              <div key={member.id} className="bg-dark-card rounded-2xl border border-dark-border p-4 flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A1500] to-dark border border-gold/20 flex items-center justify-center text-2xl shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{member.user.firstName} {member.user.lastName}</div>
                  <div className="text-white/40 text-xs">{member.title}</div>
                  <StarRating rating={member.rating} />
                </div>
                <Button size="sm" variant="outline" onClick={() => handleBookStaff(member)}>
                  Book
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        {tab === 'info' && (
          <div className="space-y-5">
            {[
              { icon: '📍', label: 'Address', value: salon.address || '—' },
              { icon: '📞', label: 'Phone', value: salon.phone || '—' },
              { icon: '🌐', label: 'Website', value: salon.website || '—' },
              { icon: '📸', label: 'Instagram', value: salon.instagram || '—' },
              { icon: '🕐', label: 'Working Hours', value: 'Mon–Sat: 09:00–18:00\nSun: Closed' },
            ].map(item => (
              <div key={item.label} className="flex gap-4 items-start">
                <div className="w-9 h-9 bg-dark-card2 border border-dark-border rounded-xl flex items-center justify-center text-base shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mb-0.5">{item.label}</div>
                  <div className="text-sm whitespace-pre-line">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-28" />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-5 pb-6 pt-4 bg-gradient-to-t from-dark to-transparent">
        <Button fullWidth size="lg" onClick={() => { setSalon(salon); navigate('/book') }}>
          Book Appointment
        </Button>
      </div>
    </PageLayout>
  )
}

const ServiceRow = ({ service, onBook }: { service: Service; onBook: (s: Service) => void }) => (
  <div
    onClick={() => onBook(service)}
    className="bg-dark-card rounded-xl border border-dark-border p-3.5 flex justify-between items-center cursor-pointer active:scale-[0.99] transition-transform"
    style={{ borderLeftColor: service.color, borderLeftWidth: 2 }}
  >
    <div>
      <div className="font-semibold text-sm">{service.name}</div>
      <div className="text-white/40 text-xs mt-0.5">⏱ {service.duration} min</div>
    </div>
    <div className="text-right">
      <div className="text-gold font-bold">{service.price} KM</div>
      <div className="text-gold text-xs mt-0.5">Book →</div>
    </div>
  </div>
)
