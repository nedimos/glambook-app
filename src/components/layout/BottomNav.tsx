import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const navItems = [
  { to: '/', icon: '🏠', label: 'Home', end: true },
  { to: '/appointments', icon: '📅', label: 'Bookings', end: false },
  { to: '/profile', icon: '👤', label: 'Profile', end: false },
]

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-[#0D0D0D] border-t border-dark-border z-50">
    <div className="flex">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            clsx(
              'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-widest uppercase transition-colors',
              isActive ? 'text-gold' : 'text-white/40'
            )
          }
        >
          <span className="text-xl">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
)
