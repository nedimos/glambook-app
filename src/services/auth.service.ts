import api from './api.client'
import type { AuthResponse } from '@/types'

export const authService = {
  register: async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
  }): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data)
    return res.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  me: async () => {
    const res = await api.get('/auth/me')
    return res.data.user
  },
}
