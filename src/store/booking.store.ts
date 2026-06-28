import { create } from 'zustand'
import type { Service, StaffMember, Salon } from '@/types'

interface BookingState {
  salon: Salon | null
  service: Service | null
  staff: StaffMember | null
  date: string | null
  timeSlot: string | null

  setSalon: (salon: Salon) => void
  setService: (service: Service) => void
  setStaff: (staff: StaffMember) => void
  setDate: (date: string) => void
  setTimeSlot: (slot: string) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  salon: null,
  service: null,
  staff: null,
  date: null,
  timeSlot: null,

  setSalon: (salon) => set({ salon }),
  setService: (service) => set({ service, staff: null, date: null, timeSlot: null }),
  setStaff: (staff) => set({ staff, date: null, timeSlot: null }),
  setDate: (date) => set({ date, timeSlot: null }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  reset: () => set({ salon: null, service: null, staff: null, date: null, timeSlot: null }),
}))
