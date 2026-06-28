import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { GoldDivider } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'
import { useTranslation } from 'react-i18next'

export const ProfilePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated || !user) return (
    <PageLayout>
      <div className="px-5 pt-14 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-4xl mb-4">👤</div>
        <h1 className="text-xl font-black mb-1">{t('profile.myProfile')}</h1>
        <p className="text-white/40 text-sm mb-8">{t('profile.signInPrompt')}</p>
        <Button fullWidth onClick={() => navigate('/login')}>{t('profile.signIn')}</Button>
        <div className="mt-3 w-full">
          <Button fullWidth variant="outline" onClick={() => navigate('/register')}>{t('profile.createAccount')}</Button>
        </div>
      </div>
    </PageLayout>
  )

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <PageLayout>
      <div className="px-5 pt-14">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-4xl mb-3 border-2 border-gold">
            {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover" /> : '👤'}
          </div>
          <h1 className="text-xl font-black">{user.firstName} {user.lastName}</h1>
          <p className="text-white/40 text-sm">{user.email}</p>

          {/* Stats */}
          <div className="flex gap-6 mt-5 bg-dark-card border border-dark-border rounded-2xl px-6 py-3">
            {[{ label: t('profile.bookings'), value: '0' }, { label: t('profile.favourites'), value: '0' }, { label: t('profile.reviews'), value: '0' }].map((s, i) => (
              <div key={s.label} className="flex gap-6 items-center">
                {i > 0 && <div className="w-px h-8 bg-dark-border" />}
                <div className="text-center">
                  <div className="text-gold font-black text-xl">{s.value}</div>
                  <div className="text-white/40 text-[10px]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {t('profile.menu', { returnObjects: true }).map((item: any) => (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className="w-full bg-dark-card border border-dark-border rounded-2xl px-4 py-3.5 flex gap-3 items-center text-left"
            >
              <div className="w-9 h-9 bg-dark-card2 border border-dark-border rounded-xl flex items-center justify-center text-base shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-white/40 text-xs">{item.sub}</div>
              </div>
              <div className="text-white/30">›</div>
            </button>
          ))}
        </div>

        <GoldDivider />

        <Button fullWidth variant="danger" onClick={handleLogout}>{t('profile.signOut')}</Button>
        <div className="h-4" />
      </div>
    </PageLayout>
  )
}
