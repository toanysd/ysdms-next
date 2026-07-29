"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, Sun, Moon, X, QrCode, LogIn, LogOut, User } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useAuth } from '@/components/AuthProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export default function Topbar() {
  const t = useTranslations('Topbar')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(searchParams.toString())
      if (searchValue) params.set('search', searchValue)
      else params.delete('search')
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  return (
    <div
      className="h-[48px] flex items-center justify-between px-4 shrink-0 z-40 relative"
      style={{
        background: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left: Module Info */}
      <div className="hidden md:flex items-center gap-3">
        <div
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <Search size={15} />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {t('title')}
            <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>v2.0</span>
          </span>
        </div>
      </div>

      <div className="hidden md:block w-[1px] h-6 mx-4" style={{ background: 'var(--border-default)' }}></div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-2xl flex items-center">
        <div
          className="flex items-center w-full h-[36px] rounded-lg overflow-hidden transition-all"
          style={{
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
          }}
        >
          <select
            className="bg-transparent border-none outline-none text-[12px] font-semibold px-2 h-full cursor-pointer min-w-[70px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <option value="all">{t('searchAll')}</option>
            <option value="mold">{t('searchMold')}</option>
            <option value="cutter">{t('searchCutter')}</option>
            <option value="tray">{t('searchTray')}</option>
          </select>
          
          <div className="w-[1px] h-4 mx-1" style={{ background: 'var(--border-default)' }}></div>
          
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none px-2 text-[13px] h-full"
            style={{ color: 'var(--text-primary)' }}
            placeholder={t('searchPlaceholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
          
          {searchValue && (
            <button 
              className="px-3 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => {
                setSearchValue('')
                const params = new URLSearchParams(searchParams.toString())
                params.delete('search')
                router.push(`${pathname}?${params.toString()}`)
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* QR Button */}
        <button
          className="ml-2 w-[36px] h-[36px] rounded-lg flex items-center justify-center shrink-0 transition-colors"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
        >
          <QrCode size={17} />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="hidden md:flex items-center gap-1.5 ml-4 shrink-0">
        {/* Filter */}
        <button 
          onClick={() => window.dispatchEvent(new Event('open-filter'))}
          className="theme-toggle"
          title={t('filterTooltip')}
        >
          <SlidersHorizontal size={15} />
        </button>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={theme === 'light' ? t('darkMode') : t('lightMode')}
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Divider */}
        <div className="w-[1px] h-5 mx-1" style={{ background: 'var(--border-default)' }}></div>

        {/* Auth */}
        {user ? (
          <button
            onClick={signOut}
            className="flex items-center gap-2 h-[32px] px-2 rounded-lg transition-colors"
            style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}
            title={t('logout')}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <User size={12} />
            </div>
            <span className="text-[10px] font-semibold whitespace-nowrap max-w-[100px] truncate" style={{ color: 'var(--text-primary)' }}>
              {user.email?.split('@')[0]}
            </span>
            <LogOut size={12} style={{ color: 'var(--text-muted)' }} />
          </button>
        ) : (
          <a
            href="/login"
            className="flex items-center gap-2 h-[32px] px-2 rounded-lg transition-colors"
            style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <LogIn size={12} />
            </div>
            <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{t('login')}</span>
          </a>
        )}
      </div>
    </div>
  )
}
