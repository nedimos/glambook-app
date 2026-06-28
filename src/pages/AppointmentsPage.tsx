import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Badge, GoldDivider, Spinner, EmptyState } from '@/components/ui'
import { appointmentsService } from '@/services/appointments.service'
import { useAuthStore } from '@/store/auth.store'
import type { Appointment, AppointmentStatus } from '@/types'

const statusVariant: Record<AppointmentStatus, any> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'cancelled',
  NO_SHOW: 'cancelled',
}

export const AppointmentsPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentsService.getMyAppointments(),
    enabled: isAuthenticated,
  })

  const { mutate: cancel } = useMutation({
    mutationFn: (id: string) => appointmentsService.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-appointments'] }),
  })

  const upcoming = appointments.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status))
  const past = appointments.filter(a => ['COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'].includes(a.status))

  if (!isAuthenticated) return (
    <PageLayout>
      <div className="px-5 pt-14">
        <h1 className="text-xl font-black mb-1">My Appointments</h1>
        <EmptyState icon="🔐" title="Login to view bookings" subtitle="Track and manage your appointments" />
        <div className="px-5 mt-4">
          <Button fullWidth onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>
      <div className="px-5 pt-14">
        <h1 className="text-xl font-black mb-1">My Appointments</h1>
        <p className="text-white/40 text-sm mb-6">Manage your bookings</p>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="font-bold text-sm mb-4">Upcoming</h2>
              {upcoming.length === 0 ? (
                <EmptyState icon="📅" title="No upcoming appointments" subtitle="Book a salon visit to get started" />
              ) : (
                <div className="space-y-3">
                  {upcoming.map(a => (
                    <AppointmentCard key={a.id} appointment={a} onCancel={() => cancel(a.id)} />
                  ))}
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section>
                <h2 className="font-bold text-sm mb-4">Past</h2>
                <div className="space-y-3 opacity-70">
                  {past.map(a => (
                    <AppointmentCard key={a.id} appointment={a} past />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}

const AppointmentCard = ({ appointment: a, onCancel, past }: {
  appointment: Appointment
  onCancel?: () => void
  past?: boolean
}) => {
  const navigate = useNavigate()
  return (
    <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden" style={{ borderLeftColor: past ? 'transparent' : '#C9A84C', borderLeftWidth: 3 }}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-bold text-sm">{a.service.name}</div>
            <div className="text-white/40 text-xs mt-0.5">{a.salon.name} · {a.staff.user.firstName} {a.staff.user.lastName}</div>
          </div>
          <Badge label={a.status} variant={statusVariant[a.status]} />
        </div>
        <GoldDivider />
        <div className="flex justify-between items-center">
          <div className="flex gap-5">
            <div>
              <div className="text-[10px] text-white/40 uppercase">Date</div>
              <div className="font-semibold text-xs mt-0.5">{a.date}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase">Time</div>
              <div className="font-semibold text-xs mt-0.5">{a.startTime}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase">Price</div>
              <div className="font-semibold text-xs mt-0.5 text-gold">{a.totalPrice} KM</div>
            </div>
          </div>
          {!past && onCancel && (
            <Button size="sm" variant="danger" onClick={onCancel}>Cancel</Button>
          )}
          {past && (
            <Button size="sm" variant="outline" onClick={() => navigate(`/salons/${a.salon.slug}`)}>Rebook</Button>
          )}
        </div>
      </div>
    </div>
  )
}
