import api from './api.client'
import type { Salon, SalonDetail, PaginatedResponse } from '@/types'

export interface SalonQuery {
  search?: string
  city?: string
  type?: string
  page?: number
  limit?: number
}

export const salonsService = {
  getAll: async (query: SalonQuery = {}): Promise<PaginatedResponse<Salon>> => {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([k, v]) => v !== undefined && params.set(k, String(v)))
    const res = await api.get(`/salons?${params}`)
    return res.data
  },

  getBySlug: async (slug: string): Promise<SalonDetail> => {
    const res = await api.get(`/salons/${slug}`)
    return res.data
  },

  getMySalons: async (): Promise<Salon[]> => {
    const res = await api.get('/salons/owner/my-salons')
    return res.data
  },

  getDashboard: async (salonId: string) => {
    const res = await api.get(`/salons/${salonId}/dashboard`)
    return res.data
  },

  create: async (data: Partial<Salon>): Promise<Salon> => {
    const res = await api.post('/salons', data)
    return res.data
  },

  update: async (id: string, data: Partial<Salon>): Promise<Salon> => {
    const res = await api.put(`/salons/${id}`, data)
    return res.data
  },
}
