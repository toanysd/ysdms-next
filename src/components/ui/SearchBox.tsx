'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'

export function SearchBox({ 
  placeholder = "Tìm kiếm...", 
  historyKey 
}: { 
  placeholder?: string
  historyKey?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const defaultQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(defaultQuery)
  const [isPending, startTransition] = useTransition()
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Use history hook conditionally (we must call it unconditionally but the hook handles undefined keys gracefully)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory(historyKey || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
        // Add to history when searching (if historyKey is provided and query is valid)
        if (historyKey && query.trim().length >= 2) {
          addToHistory(query.trim())
        }
      } else {
        params.delete('q')
      }
      const newQueryString = params.toString()
      if (newQueryString !== searchParams.toString()) {
        startTransition(() => {
          router.replace(`${pathname}?${newQueryString}`)
        })
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [query, router, pathname, searchParams, historyKey, addToHistory])

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Search 
        style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} 
        size={16} 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        className="form-input"
        style={{ width: 250, paddingLeft: 32, paddingRight: query ? 32 : 12, height: 36 }}
      />
      {query && (
        <button
          onClick={() => { setQuery(''); setShowSuggestions(false); }}
          style={{
            position: 'absolute',
            right: 10,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
      {isPending && (
        <div style={{
          position: 'absolute',
          right: query ? 36 : 10,
          width: 14,
          height: 14,
          border: '2px solid var(--accent)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {historyKey && (
        <SearchSuggestions
          history={history}
          visible={showSuggestions && !query}
          onSelect={(q) => { setQuery(q); setShowSuggestions(false); }}
          onRemove={removeFromHistory}
          onClear={clearHistory}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}
