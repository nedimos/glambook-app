// ─── Auth ─────────────────────────────────────────────────────────────────────

export type Role = 'CUSTOMER' | 'EMPLOYEE' | 'MANAGER' | 'SALON_OWNER' | 'ADMIN'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  role: Role
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse extends AuthTokens {
  user: User
}

// ─── Salon ────────────────────────────────────────────────────────────────────

export interface Salon {
  id: string
  name: string
  slug: string
  type: string
  description?: string
  city?: string
  address?: string
  phone?: string
  email?: string
  instagram?: string
  facebook?: string
  website?: string
  logoUrl?: string
  coverUrl?: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isFeatured: boolean
  latitude?: number
  longitude?: number
  _count?: {
    services: number
    staff: number
  }
}

export interface SalonDetail extends Salon {
  services: Service[]
  serviceCategories: ServiceCategory[]
  staff: StaffMember[]
  workingHours: WorkingHours[]
  images: SalonImage[]
  reviews: Review[]
}

export interface SalonImage {
  id: string
  url: string
  caption?: string
  sortOrder: number
}

export interface WorkingHours {
  id: string
  dayOfWeek: DayOfWeek
  openTime: string
  closeTime: string
  isClosed: boolean
}

export type DayOfWeek =
  | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
  | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

// ─── Service ──────────────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string
  name: string
  color: string
  sortOrder: number
}

export interface Service {
  id: string
  salonId: string
  categoryId?: string
  category?: ServiceCategory
  name: string
  description?: string
  duration: number   // minutes
  price: number
  color: string
  isActive: boolean
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export interface StaffMember {
  id: string
  salonId: string
  title?: string
  bio?: string
  rating: number
  reviewCount: number
  isActive: boolean
  user: {
    firstName: string
    lastName: string
    avatarUrl?: string
    email: string
  }
  services?: { service: Service }[]
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | 'PENDING' | 'CONFIRMED' | 'COMPLETED'
  | 'CANCELLED' | 'REJECTED' | 'NO_SHOW'

export interface Appointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  totalPrice: number
  note?: string
  cancelReason?: string
  salon: {
    name: string
    slug: string
    logoUrl?: string
    address?: string
  }
  service: {
    name: string
    duration: number
    price: number
  }
  staff: {
    user: {
      firstName: string
      lastName: string
      avatarUrl?: string
    }
  }
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface CreateAppointmentPayload {
  salonId: string
  serviceId: string
  staffId: string
  date: string       // "2025-07-15"
  startTime: string  // "10:30"
  note?: string
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  rating: number
  comment?: string
  ownerReply?: string
  createdAt: string
  customer: {
    firstName: string
    lastName: string
    avatarUrl?: string
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
