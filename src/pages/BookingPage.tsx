import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GoldDivider, Spinner, StarRating } from '@/components/ui'
import { useBookingStore } from '@/store/booking.store'
import { useAuthStore } from '@/store/auth.store'
import { appointmentsService } from '@/services/appointments.service'
import { format, addDays } from 'date-fns'

const STEPS = ['Service', 'Staff', 'Date', 'Time', 'Confirm']

export const BookingPage = () => {
  const navigate = useNavigate()
  const { salon, service, staff, date, timeSlot, setService, setStaff, setDate, setTimeSlot, reset } = useBookingStore()
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState(() => {
    if (service && staff) return 2
    if (service) return 1
    return 0
  })
  const [confirmed, setConfirmed] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<{ note?: string }>()

  if (!salon) { navigate('/'); return null }

  // ─── Date options ──────────────────────────────────────────────────────────
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1)
    return { date: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE'), day: format(d, 'd'), month: format(d, 'MMM') }
  })

  // ─── Slots query ───────────────────────────────────────────────────────────
  const { data: slotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', salon.id, service?.id, staff?.id, date],
    queryFn: () => appointmentsService.getSlots({ salonId: salon.id, serviceId: service!.id, staffId: staff!.id, date: date! }),
    enabled: !!service && !!staff && !!date && step === 3,
  })

  // ─── Book mutation ─────────────────────────────────────────────────────────
  const { mutate: bookAppointment, isPending } = useMutation({
    mutationFn: (note?: string) => appointmentsService.create({
      salonId: salon.id,
      serviceId: service!.id,
      staffId: staff!.id,
      date: date!,
      startTime: timeSlot!,
      note,
    }),
    onSuccess: () => setConfirmed(true),
  })

  const canNext = [
    !!service,
    !!staff,
    !!date,
    !!timeSlot,
    true,
  ][step]

  const next = () => { if (canNext) setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  const back = () => { if (step === 0) navigate(-1); else setStep(s => s - 1) }

  // ─── Confirmed screen ──────────────────────────────────────────────────────
  if (confirmed) return (
    <PageLayout hideNav className="flex flex-col items-center justify-center min-h-screen px-5">
      <div className="text-center">
        <div className="text-7xl mb-6">✨</div>
        <h1 className="text-2xl font-black mb-2">You're booked!</h1>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          Your appointment at <span className="text-gold">{salon.name}</span> is confirmed.
        </p>
        <div className="bg-dark-card border-l-2 border-gold rounded-2xl p-4 text-left mb-8 space-y-3">
          {[
            { label: 'Service', value: service?.name },
            { label: 'With', value: staff ? `${staff.user.firstName} ${staff.user.lastName}` : 'Any available' },
            { label: 'Date', value: date },
            { label: 'Time', value: timeSlot },
            { label: 'Price', value: `${service?.price} KM` },
          ].map(item => (
            <div key={item.label} className="flex justify-between">
              <span className="text-white/40 text-sm">{item.label}</span>
              <span className={`text-sm font-semibold ${item.label === 'Price' ? 'text-gold' : ''}`}>{item.value}</span>
            </div>
          ))}
        </div>
        <Button fullWidth onClick={() => { reset(); navigate('/') }}>Back to Home</Button>
        <div className="mt-3">
          <Button fullWidth variant="outline" onClick={() => navigate('/appointments')}>View My Bookings</Button>
        </div>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout hideNav>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-[#0D0D0D] border-b border-dark-border">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={back} className="text-xl text-white/60">←</button>
          <div className="flex-1">
            <div className="font-bold text-sm">Book at {salon.name}</div>
            <div className="text-white/40 text-xs">Step {step + 1} of {STEPS.length} — {STEPS[step]}</div>
          </div>
        </div>
        {/* Progress */}
        <div className="h-1 bg-dark-border rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'linear-gradient(90deg,#8A6F2E,#C9A84C)' }}
          />
        </div>
        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-[9px] font-semibold uppercase tracking-wider ${i <= step ? 'text-gold' : 'text-white/30'}`}>{s}</span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">

        {/* Step 0: Service */}
        {step === 0 && (
          <div>
            <h2 className="font-bold text-base mb-4">Choose a service</h2>
            <div className="space-y-2">
              {salon.services?.map(s => (
                <div
                  key={s.id}
                  onClick={() => setService(s)}
                  className={`bg-dark-card rounded-xl border p-3.5 flex justify-between items-center cursor-pointer transition-all ${service?.id === s.id ? 'border-gold' : 'border-dark-border'}`}
                >
                  <div className="flex gap-3 items-center">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base transition-all ${service?.id === s.id ? 'bg-gold/10 border-gold' : 'bg-dark-card2 border-dark-border'}`}>✂️</div>
                    <div>
                      <div className="font-semibold text-sm">{s.name}</div>
                      <div className="text-white/40 text-xs">⏱ {s.duration} min</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold font-bold text-sm">{s.price} KM</div>
                    {service?.id === s.id && <div className="text-gold text-xs">✓</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Staff */}
        {step === 1 && (
          <div>
            <h2 className="font-bold text-base mb-4">Choose your stylist</h2>
            <div className="space-y-3">
              <div onClick={() => setStaff({ id: 'any', user: { firstName: 'Any', lastName: 'available', email: '' }, salonId: salon.id, rating: 5, reviewCount: 0, isActive: true })}
                className={`bg-dark-card rounded-2xl border p-4 flex gap-3 items-center cursor-pointer transition-all ${staff?.id === 'any' ? 'border-gold' : 'border-dark-border'}`}>
                <div className="w-12 h-12 rounded-full bg-dark-card2 border border-dark-border flex items-center justify-center text-2xl">⭐</div>
                <div className="flex-1">
                  <div className="font-bold">Any available</div>
                  <div className="text-white/40 text-xs">We'll assign the best fit</div>
                </div>
                {staff?.id === 'any' && <div className="text-gold">✓</div>}
              </div>
              {salon.staff?.map(member => (
                <div key={member.id} onClick={() => setStaff(member)}
                  className={`bg-dark-card rounded-2xl border p-4 flex gap-3 items-center cursor-pointer transition-all ${staff?.id === member.id ? 'border-gold' : 'border-dark-border'}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A1500] to-dark border border-gold/20 flex items-center justify-center text-2xl shrink-0">👤</div>
                  <div className="flex-1">
                    <div className="font-bold">{member.user.firstName} {member.user.lastName}</div>
                    <div className="text-white/40 text-xs">{member.title}</div>
                    <StarRating rating={member.rating} />
                  </div>
                  {staff?.id === member.id && <div className="text-gold text-lg">✓</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <div>
            <h2 className="font-bold text-base mb-4">Pick a date</h2>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-2">
              {dates.map(d => (
                <div key={d.date} onClick={() => setDate(d.date)}
                  className={`shrink-0 w-14 py-3 rounded-2xl border text-center cursor-pointer transition-all ${date === d.date ? 'border-gold bg-gold/10' : 'border-dark-border bg-dark-card'}`}>
                  <div className="text-[10px] text-white/40 uppercase">{d.label}</div>
                  <div className={`text-xl font-bold my-0.5 ${date === d.date ? 'text-gold' : ''}`}>{d.day}</div>
                  <div className="text-[10px] text-white/40">{d.month}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <div>
            <h2 className="font-bold text-base mb-1">Available times</h2>
            <p className="text-white/40 text-xs mb-4">{date} · {service?.duration} min</p>
            {slotsLoading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {(slotsData?.slots ?? []).map(slot => (
                  <div key={slot.time} onClick={() => slot.available && setTimeSlot(slot.time)}
                    className={`py-3 rounded-xl border text-center transition-all ${
                      !slot.available ? 'opacity-30 cursor-not-allowed border-dark-border bg-dark' :
                      timeSlot === slot.time ? 'border-gold bg-gold/10 cursor-pointer' :
                      'border-dark-border bg-dark-card cursor-pointer'
                    }`}>
                    <div className={`font-semibold text-sm ${timeSlot === slot.time ? 'text-gold' : ''}`}>{slot.time}</div>
                    {!slot.available && <div className="text-[9px] text-white/30">Taken</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h2 className="font-bold text-base mb-4">Confirm booking</h2>
            <div className="bg-dark-card border-l-2 border-gold rounded-2xl p-4 mb-5 space-y-3">
              <p className="text-[11px] font-bold tracking-widest uppercase text-gold">Booking summary</p>
              {[
                { label: 'Salon', value: salon.name },
                { label: 'Service', value: service?.name },
                { label: 'Duration', value: `${service?.duration} min` },
                { label: 'Staff', value: staff ? `${staff.user.firstName} ${staff.user.lastName}` : '—' },
                { label: 'Date', value: date },
                { label: 'Time', value: timeSlot },
                { label: 'Price', value: `${service?.price} KM` },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-white/40 text-sm">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.label === 'Price' ? 'text-gold' : ''}`}>{item.value}</span>
                </div>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="bg-yellow-950/50 border border-yellow-500/20 rounded-xl p-3 mb-4 text-xs text-yellow-400">
                ⚠️ You need to be logged in to confirm a booking.{' '}
                <span className="underline cursor-pointer" onClick={() => navigate('/login')}>Login here</span>
              </div>
            )}
            <form onSubmit={handleSubmit(d => bookAppointment(d.note))}>
              <Input label="Note (optional)" placeholder="Any preferences for the stylist..." {...register('note')} />
              <div className="mt-5">
                <Button type="submit" fullWidth size="lg" loading={isPending} disabled={!isAuthenticated}>
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="h-28" />
      </div>

      {/* Sticky next button (steps 0–3) */}
      {step < 4 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-5 pb-6 pt-4 bg-gradient-to-t from-dark to-transparent">
          <Button fullWidth size="lg" onClick={next} disabled={!canNext}>
            Continue →
          </Button>
        </div>
      )}
    </PageLayout>
  )
}
