"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, Sun, Moon, X, QrCode, LogIn, LogOut, User, Loader2, Package, Wrench, Scissors, ArrowRight } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useAuth } from '@/components/AuthProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'

import { Trash2, Clock } from 'lucide-react'

type SearchScope = 'all' | 'tray' | 'mold' | 'cutter' | 'job' | 'design' | 'customer' | 'order'

type GlobalSearchResult = {
  id: string
  type: 'product' | 'mold' | 'cutter' | 'job' | 'design' | 'customer' | 'order'
  code: string
  name: string
  sub?: string
  url: string
}

export default function Topbar() {
  const t = useTranslations('Topbar')
  const tCommon = useTranslations('Common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const supabase = createClient()

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('global_topbar_search')

  const [scope, setScope] = useState<SearchScope>('all')
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GlobalSearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-detect search scope based on current pathname
  useEffect(() => {
    if (pathname.includes('/product-center') || pathname.includes('/master/products')) {
      setScope('tray')
    } else if (pathname.includes('/equipment/molds') || pathname.includes('/master/molds')) {
      setScope('mold')
    } else if (pathname.includes('/equipment/cutting-dies')) {
      setScope('cutter')
    } else if (pathname.includes('/equipment/jobs')) {
      setScope('job')
    } else if (pathname.includes('/engineering/designs')) {
      setScope('design')
    } else if (pathname.includes('/master/customers')) {
      setScope('customer')
    } else if (pathname.includes('/orders')) {
      setScope('order')
    }
  }, [pathname])

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '')
  }, [searchParams])

  // Fast debounced search across Supabase entities
  useEffect(() => {
    const trimmed = searchValue.trim()
    if (!trimmed) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      // Build fuzzy wildcard pattern ignoring spaces, hyphens, and underscores (e.g. jae361R1 -> %jae%361%R%1%)
      const clean = trimmed.replace(/[%_]/g, '\\$&')
      const compact = trimmed.replace(/[\s\-_]/g, '')
      const chunks = compact.match(/[a-zA-Z]+|\d+/g) || [compact]
      const wildcard = '%' + chunks.join('%') + '%'
      const items: GlobalSearchResult[] = []

      try {
        // 1. Products search (Scope: all or tray)
        if (scope === 'all' || scope === 'tray') {
          const { data: prodData } = await supabase
            .from('products')
            .select('product_id, product_code, product_name, product_name_internal, customer_product_name, companies:companies!products_company_id_fkey(company_code)')
            .or(`product_code.ilike.%${clean}%,product_code.ilike.${wildcard},product_name.ilike.%${clean}%,customer_product_name.ilike.%${clean}%,product_name_internal.ilike.%${clean}%,product_name_internal.ilike.${wildcard}`)
            .limit(6)

          if (prodData) {
            prodData.forEach((p: any) => {
              items.push({
                id: p.product_id,
                type: 'product',
                code: p.product_code,
                name: p.product_name_internal || p.product_name || p.customer_product_name || '—',
                sub: p.companies?.company_code ? `KH: ${p.companies.company_code}` : undefined,
                url: `/product-center/${p.product_id}`,
              })
            })
          }
        }

        // 2. Molds search (Scope: all or mold)
        if ((scope === 'all' || scope === 'mold') && items.length < 8) {
          const { data: moldData } = await supabase
            .from('physical_molds')
            .select(`
              physical_mold_id, system_code, display_name, usage_status, mold_revision_id,
              mold_revisions(design_revision_id, design_revisions(product_id, products(product_code)))
            `)
            .or(`system_code.ilike.%${clean}%,system_code.ilike.${wildcard},display_name.ilike.%${clean}%,display_name.ilike.${wildcard}`)
            .limit(4)

          if (moldData) {
            moldData.forEach((m: any) => {
              const targetProductId = m.mold_revisions?.design_revisions?.product_id
              const targetProductCode = m.mold_revisions?.design_revisions?.products?.product_code
              const moldCode = m.system_code || m.display_name || '—'

              items.push({
                id: m.physical_mold_id,
                type: 'mold',
                code: moldCode,
                name: targetProductCode ? `SP: ${targetProductCode} (${m.display_name || moldCode})` : moldCode,
                sub: m.usage_status || undefined,
                url: targetProductId ? `/product-center/${targetProductId}` : `/equipment/molds/${m.physical_mold_id}`,
              })
            })
          }
        }

        // 3. Cutters search (Scope: all or cutter)
        if ((scope === 'all' || scope === 'cutter') && items.length < 8) {
          const { data: cutterData } = await supabase
            .from('equipment')
            .select(`
              equipment_id, equipment_code, display_name, usage_status, design_revision_id,
              design_revisions(product_id, products(product_code))
            `)
            .in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE'])
            .or(`equipment_code.ilike.%${clean}%,equipment_code.ilike.${wildcard},display_name.ilike.%${clean}%,display_name.ilike.${wildcard}`)
            .limit(4)

          if (cutterData) {
            for (const c of cutterData as any[]) {
              let targetProdId = c.design_revisions?.product_id
              let targetProdCode = c.design_revisions?.products?.product_code

              if (!targetProdId) {
                const { data: juncs } = await supabase
                  .from('mold_design_cutters')
                  .select('mold_design_id, design_revisions(product_id, products(product_code))')
                  .eq('cutter_id', c.equipment_id)
                  .limit(1)

                if (juncs && juncs.length > 0) {
                  targetProdId = (juncs[0] as any).design_revisions?.product_id
                  targetProdCode = (juncs[0] as any).design_revisions?.products?.product_code
                }
              }

              items.push({
                id: c.equipment_id,
                type: 'cutter',
                code: c.equipment_code || c.equipment_id,
                name: targetProdCode ? `SP: ${targetProdCode} (${c.display_name || ''})` : (c.display_name || '—'),
                sub: c.usage_status || undefined,
                url: targetProdId ? `/product-center/${targetProdId}` : `/equipment/cutting-dies`,
              })
            }
          }
        }

        // 4. Jobs search (Scope: all or job)
        if ((scope === 'all' || scope === 'job') && items.length < 8) {
          const { data: jobData } = await supabase
            .from('jobs')
            .select('job_id, job_code, job_name, job_status')
            .or(`job_code.ilike.%${clean}%,job_name.ilike.%${clean}%`)
            .limit(4)

          if (jobData) {
            jobData.forEach((j: any) => {
              items.push({
                id: j.job_id,
                type: 'job',
                code: j.job_code,
                name: j.job_name || '—',
                sub: j.job_status || undefined,
                url: `/equipment/jobs?search=${encodeURIComponent(j.job_code)}`,
              })
            })
          }
        }
      } catch (err) {
        console.error('Global search error:', err)
      }

      setResults(items.slice(0, 8))
      setLoading(false)
      setSelectedIndex(-1)
    }, 250)

    return () => clearTimeout(timer)
  }, [searchValue, scope, supabase])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectItem = (item: GlobalSearchResult) => {
    if (searchValue.trim()) {
      addToHistory(searchValue.trim())
    }
    setIsOpen(false)
    router.push(item.url)
  }

  const handleSelectHistoryItem = (term: string) => {
    setSearchValue(term)
    addToHistory(term)
    const params = new URLSearchParams(searchParams.toString())
    params.set('search', term)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
      return
    }

    if (results.length > 0 && isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        return
      }
      if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault()
        handleSelectItem(results[selectedIndex])
        return
      }
    }

    if (e.key === 'Enter') {
      if (searchValue.trim()) {
        addToHistory(searchValue.trim())
      }
      setIsOpen(false)
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

      {/* Center: Global Fast Search Bar with Dropdown */}
      <div ref={containerRef} className="flex-1 max-w-2xl flex items-center relative">
        <div
          className="flex items-center w-full h-[36px] rounded-lg overflow-hidden transition-all"
          style={{
            background: 'var(--bg-surface-2)',
            border: isOpen ? '1px solid var(--accent)' : '1px solid var(--border-default)',
            boxShadow: isOpen ? '0 0 0 2px var(--tint-teal-border)' : 'none'
          }}
        >
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as SearchScope)}
            className="bg-transparent border-none outline-none text-[12px] font-semibold px-2 h-full cursor-pointer min-w-[70px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <option value="all">{t('searchAll')}</option>
            <option value="tray">{t('searchTray')}</option>
            <option value="mold">{t('searchMold')}</option>
            <option value="cutter">{t('searchCutter')}</option>
          </select>
          
          <div className="w-[1px] h-4 mx-1" style={{ background: 'var(--border-default)' }}></div>
          
          <input 
            ref={inputRef}
            type="text" 
            className="flex-1 bg-transparent border-none outline-none px-2 text-[13px] h-full"
            style={{ color: 'var(--text-primary)' }}
            placeholder={t('searchPlaceholder')}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          
          {loading && (
            <Loader2 size={14} className="animate-spin mr-2" style={{ color: 'var(--accent)' }} />
          )}

          {searchValue && !loading && (
            <button 
              className="px-3 transition-colors cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => {
                setSearchValue('')
                setResults([])
                const params = new URLSearchParams(searchParams.toString())
                params.delete('search')
                router.push(`${pathname}?${params.toString()}`)
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Live Search & History Dropdown Overlay */}
        {isOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 44,
            background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
            borderRadius: 8, boxShadow: '0 12px 30px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)',
            zIndex: 100, maxHeight: 380, overflowY: 'auto', padding: '6px 0'
          }}>
            {/* Search History when Query is Empty */}
            {!searchValue.trim() && (
              <div style={{ padding: '8px 12px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: 6, marginBottom: 6, borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                    <Clock size={12} /> {tCommon('recentSearch') || '検索履歴'}
                  </span>
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearHistory(); }}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3
                      }}
                    >
                      <Trash2 size={11} /> {tCommon('clearAll') || 'すべて削除'}
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                    検索履歴はありません
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {history.map((term, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectHistoryItem(term)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                          background: 'var(--bg-surface-2)', transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--tint-teal-bg)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                      >
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={11} style={{ color: 'var(--text-muted)' }} /> {term}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromHistory(term)
                          }}
                          style={{
                            border: 'none', background: 'transparent', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: 2, borderRadius: 4, display: 'flex', alignItems: 'center'
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {searchValue.trim() && loading && results.length === 0 && (
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12 }}>
                <Loader2 size={14} className="animate-spin" />
                <span>検索中...</span>
              </div>
            )}

            {/* No Results Found */}
            {searchValue.trim() && !loading && results.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                <Package size={22} style={{ opacity: 0.4, margin: '0 auto 4px auto' }} />
                <div>該当するデータが見つかりません</div>
              </div>
            )}

            {/* Live Search Results */}
            {results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 12px 2px 12px', letterSpacing: '0.05em' }}>
                  検索結果 ({results.length})
                </div>
                {results.map((item, idx) => {
                  const isHighlighted = idx === selectedIndex

                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{
                        padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', gap: 10,
                        background: isHighlighted ? 'var(--bg-surface-2)' : 'transparent',
                        borderLeft: isHighlighted ? '3px solid var(--accent)' : '3px solid transparent',
                        transition: 'background 0.1s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                        {/* Type Icon Badge */}
                        <div style={{
                          fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                          background: item.type === 'product' ? 'var(--tint-teal-bg)' : item.type === 'mold' ? 'var(--tint-orange-bg)' : 'var(--tint-blue-bg)',
                          color: item.type === 'product' ? 'var(--accent)' : item.type === 'mold' ? 'var(--tint-orange-text)' : 'var(--tint-blue-text)',
                          border: `1px solid ${item.type === 'product' ? 'var(--tint-teal-border)' : item.type === 'mold' ? 'var(--tint-orange-border)' : 'var(--tint-blue-border)'}`
                        }}>
                          {item.type === 'product' ? 'SP' : item.type === 'mold' ? '金型' : '抜型'}
                        </div>

                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 12, color: 'var(--accent)', flexShrink: 0 }}>
                          {item.code}
                        </span>

                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </span>

                        {item.sub && (
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0, background: 'var(--bg-surface-2)', padding: '1px 5px', borderRadius: 3 }}>
                            {item.sub}
                          </span>
                        )}
                      </div>

                      <ArrowRight size={13} style={{ color: isHighlighted ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0, opacity: isHighlighted ? 1 : 0.4 }} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* QR Button */}
        <button
          className="ml-2 w-[36px] h-[36px] rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer"
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
            className="flex items-center gap-2 h-[32px] px-2 rounded-lg transition-colors cursor-pointer"
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
