import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth.store'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
})

type FormData = z.infer<typeof schema>

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (err: any) {
      setError('email', { message: err?.response?.data?.message || 'Invalid credentials' })
    }
  }

  return (
    <PageLayout hideNav className="flex flex-col justify-center min-h-screen">
      <div className="px-5">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-4xl font-black tracking-wider mb-1" style={{ background: 'linear-gradient(90deg,#C9A84C,#E8D5A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            GLAMBOOK
          </div>
          <p className="text-white/40 text-sm">Your beauty booking platform</p>
        </div>

        <h1 className="text-2xl font-black mb-1">Welcome back</h1>
        <p className="text-white/40 text-sm mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="amra@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="pt-2">
            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Sign In
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold font-semibold">Register</Link>
        </p>

        <button onClick={() => navigate('/')} className="w-full text-center text-sm text-white/30 mt-4">
          Continue as guest
        </button>
      </div>
    </PageLayout>
  )
}
