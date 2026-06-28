import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from '@/pages/HomePage'
import { SalonDetailPage } from '@/pages/SalonDetailPage'
import { BookingPage } from '@/pages/BookingPage'
import { AppointmentsPage } from '@/pages/AppointmentsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { LoginPage } from '@/pages/LoginPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div
        className="min-h-screen flex justify-center"
        style={{ background: 'radial-gradient(ellipse at top, #1a1200 0%, #050505 60%)' }}
      >
        <div className="w-full max-w-[430px] min-h-screen bg-dark relative shadow-2xl shadow-black/80">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/salons/:slug" element={<SalonDetailPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
)