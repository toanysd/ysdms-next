'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, Package, Building2, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { buildFuzzyPatterns } from '@/lib/utils/moldNaming'

type SearchResultItem = {
  product_id: string
  product_code: string
  product_name: string | null
  product_name_internal: string | null
  customer_product_name: string | null
  product_status: string
  companies: {
    company_code: string
    company_name: string
  } | null
}

interface ProductQuickSearchProps {
  currentProductId?: string
}

export function ProductQuickSearch({ currentProductId }: ProductQuickSearchProps) {
  const tPC = useTranslations('ProductCenter')
  const router = useRouter()
  const supabase = createClient()
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('product_center_detail_search')

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search logic
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      const patterns = buildFuzzyPatterns(trimmed)
      const orConditions: string[] = []
      patterns.forEach(pat => {
        orConditions.push(`product_code.ilike.${pat}`)
        orConditions.push(`product_name.ilike.${pat}`)
        orConditions.push(`product_name_internal.ilike.${pat}`)
        orConditions.push(`customer_product_name.ilike.${pat}`)
      })

      const { data, error } = await supabase
        .from('products')
        .select(`
          product_id, product_code, product_name, product_name_internal, customer_product_name, product_status,
          companies:companies!products_company_id_fkey(company_code, company_name)
        `)
        .or(orConditions.join(','))
        .limit(10)

      if (!error && data) {
        setResults(data as unknown as SearchResultItem[])
      } else {
        setResults([])
      }
      setLoading(false)
      setSelectedIndex(-1)
    }, 280)

    return () => clearTimeout(timer)
  }, [query, supabase])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectProduct = (item: SearchResultItem) => {
    if (query.trim()) {
      addToHistory(query.trim())
    }
    setIsOpen(false)
    setQuery('')
    router.push(`/product-center/${item.product_id}`)
  }

  const handleSelectHistoryItem = (term: string) => {
    setQuery(term)
    addToHistory(term)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
      return
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
      }
      return
    }

    if (results.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectProduct(results[selectedIndex])
        } else if (results.length > 0) {
          handleSelectProduct(results[0])
        }
      }
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', minWidth: 200, maxWidth: 320, flex: '1 1 200px' }}>
      {/* Search Input Container */}
      <div style={{
        display: 'flex', alignItems: 'center', height: 26, borderRadius: 5,
        background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
        padding: '0 8px', gap: 6, transition: 'all 0.15s ease',
        boxShadow: isOpen ? '0 0 0 2px var(--tint-teal-border)' : 'none'
      }}>
        <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={tPC('quickSearchPlaceholder')}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: 11, color: 'var(--text-primary)', width: '100%'
          }}
        />
        {loading && <Loader2 size={12} className="animate-spin" style={{ color: 'var(--accent)', flexShrink: 0 }} />}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Dropdown Overlay */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
          zIndex: 100, maxHeight: 380, overflowY: 'auto', padding: '6px 0'
        }}>
          {/* Recent Search Suggestions when Query is Empty */}
          {!query.trim() && (
            <div style={{ padding: '4px 8px' }}>
              <SearchSuggestions
                history={history}
                onSelect={handleSelectHistoryItem}
                onRemove={removeFromHistory}
                onClear={clearHistory}
                visible={true}
                onClose={() => setIsOpen(false)}
              />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', padding: '6px 0 2px 0', borderTop: '1px solid var(--border-subtle)', marginTop: 4 }}>
                {tPC('quickSearchTip')}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {query.trim() && loading && results.length === 0 && (
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 11 }}>
              <Loader2 size={13} className="animate-spin" />
              <span>検索中...</span>
            </div>
          )}

          {/* No Results Found */}
          {query.trim() && !loading && results.length === 0 && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
              <Package size={20} style={{ opacity: 0.4, margin: '0 auto 4px auto' }} />
              <div>該当する製品が見つかりません</div>
            </div>
          )}

          {/* Search Results List */}
          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 10px 2px 10px', letterSpacing: '0.05em' }}>
                検索結果 ({results.length})
              </div>
              {results.map((item, idx) => {
                const isCurrent = item.product_id === currentProductId
                const isHighlighted = idx === selectedIndex

                return (
                  <div
                    key={item.product_id}
                    onClick={() => handleSelectProduct(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', gap: 8,
                      background: isHighlighted ? 'var(--bg-surface-2)' : (isCurrent ? 'var(--tint-teal-bg)' : 'transparent'),
                      borderLeft: isCurrent ? '3px solid var(--accent)' : '3px solid transparent',
                      transition: 'background 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 12, color: 'var(--accent)' }}>
                          {item.product_code}
                        </span>
                        <span className={`badge ${
                          item.product_status === 'ACTIVE' ? 'badge--success' :
                          item.product_status === 'MAINTENANCE' ? 'badge--warning' : 'badge--neutral'
                        }`} style={{ fontSize: 8, padding: '0 4px' }}>
                          {item.product_status}
                        </span>
                        {item.companies && (
                          <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Building2 size={9} />
                            <span>{item.companies.company_code}</span>
                          </span>
                        )}
                        {isCurrent && (
                          <span style={{ fontSize: 8, color: 'var(--accent)', fontWeight: 700, background: 'var(--bg-surface)', padding: '1px 4px', borderRadius: 3, border: '1px solid var(--tint-teal-border)' }}>
                            表示中
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product_name_internal || item.product_name || item.customer_product_name || '—'}
                      </div>
                    </div>

                    <ArrowRight size={12} style={{ color: isHighlighted ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0, opacity: isHighlighted ? 1 : 0.5 }} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
