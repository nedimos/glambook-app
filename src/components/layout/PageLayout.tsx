import { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { clsx } from 'clsx'

interface PageLayoutProps {
  children: ReactNode
  hideNav?: boolean
  className?: string
}

export const PageLayout = ({ children, hideNav = false, className }: PageLayoutProps) => (
  <div className="min-h-screen bg-dark max-w-mobile mx-auto relative">
    <main className={clsx('pb-20', className)}>
      {children}
    </main>
    {!hideNav && <BottomNav />}
  </div>
)
