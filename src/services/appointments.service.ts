import api from './api.client'
import type { Appointment, TimeSlot, CreateAppointmentPayload } from '@/types'

export const appointmentsService = {
  getSlots: async (params: {
    salonId: string
    serviceId: string
    staffId: string
    date: string
  }): Promise<{ slots: TimeSlot[]; date: string }> => {
    const query = new URLSearchParams(params)
    const res = await api.get(`/appointments/slots?${query}`)
    return res.data
  },

  create: async (data: CreateAppointmentPayload): Promise<Appointment> => {
    const res = await api.post('/appointments', data)
    return res.data
  },

  getMyAppointments: async (status?: string): Promise<Appointment[]> => {
    const params = status ? `?status=${status}` : ''
    const res = await api.get(`/appointments/my${params}`)
    return res.data
  },

  cancel: async (id: string, reason?: string): Promise<Appointment> => {
    const res = await api.put(`/appointments/${id}/cancel`, { reason })
    return res.data
  },

  getSalonAppointments: async (salonId: string, from?: string, to?: string) => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const res = await api.get(`/appointments/salon/${salonId}?${params}`)
    return res.data
  },

  updateStatus: async (id: string, status: string, salonId: string) => {
    const res = await api.put(`/appointments/${id}/status`, { status, salonId })
    return res.data
  },
}
