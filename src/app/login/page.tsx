'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const t = useTranslations('Login')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? t('invalidCredentials')
        : authError.message
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ background: 'var(--bg-page)' }}
    >
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div
        className="w-full max-w-[380px] card-flat p-6"
        style={{ borderTop: '3px solid var(--accent)' }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span className="text-[20px] font-bold">Y</span>
          </div>
          <h1
            className="text-[18px] font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
          >
            YSDMS NextGen
          </h1>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('systemDescription')}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-md mb-4 text-[11px]"
            style={{ background: 'var(--status-error-bg, rgba(239,68,68,0.1))', color: 'var(--status-error)' }}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label
              className="text-[11px] font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder={t('emailPlaceholder')}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[11px] font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full pr-9"
                placeholder={t('passwordPlaceholder')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary h-[36px] w-full mt-2 flex items-center justify-center gap-2"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span className="text-[12px]">{t('loggingIn')}</span>
            ) : (
              <>
                <LogIn size={15} />
                <span className="text-[12px] font-semibold">{t('login')}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
            © 2026 Yoshida Package Co., Ltd. — YSDMS NextGen v2.0
          </p>
        </div>
      </div>
    </div>
  )
}
