'use client'

import React, { useState, useEffect, useRef, useTransition } from 'react'
import { Search, X, Clock } from 'lucide-react'
import { fetchAllSearchableItems, SearchableItem } from '@/lib/actions/searchActions'
import { searchItems } from '@/lib/utils/searchLogic'
import { useTranslations } from 'next-intl'

interface SmartSearchBoxProps {
  onResults: (results: SearchableItem[], isSearching: boolean) => void
  category?: 'all' | 'mold' | 'cutter'
  autoFocus?: boolean
}

interface HistoryItem {
  query: string
  timestamp: number
}

export function SmartSearchBox({ onResults, category = 'all', autoFocus = false }: SmartSearchBoxProps) {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [allItems, setAllItems] = useState<SearchableItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('Common')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load items and history
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllSearchableItems()
        setAllItems(data)
        // Push initial full list if no query
        if (!query) {
          onResults(data, false)
        }
      } catch (e) {
        console.error('Failed to load searchable items', e)
      } finally {
        setIsLoading(false)
      }
    }
    load()

    const savedHistory = localStorage.getItem('ysdms_search_history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch(e) {}
    }
  }, [])

  // Auto focus
  useEffect(() => {
    if (autoFocus && !isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus, isLoading])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && 
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const executeSearch = (searchQuery: string) => {
    const q = searchQuery.trim()
    startTransition(() => {
      const results = searchItems(allItems, q, category)
      onResults(results, !!q)
    })

    if (q) {
      // Save history
      const newHistory = [{ query: q, timestamp: Date.now() }, ...history.filter(h => h.query !== q)].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem('ysdms_search_history', JSON.stringify(newHistory))
    }
    setShowDropdown(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executeSearch(query)
    } else if (e.key === 'Escape') {
      if (query) {
        setQuery('')
        executeSearch('')
      }
      setShowDropdown(false)
    } else if (e.key === 'ArrowDown') {
      setShowDropdown(true)
    }
  }

  const clearHistoryItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const newHistory = [...history]
    newHistory.splice(index, 1)
    setHistory(newHistory)
    localStorage.setItem('ysdms_search_history', JSON.stringify(newHistory))
  }

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-[var(--mcs-text-muted)]" size={18} />
        <input
          ref={inputRef}
          type="text"
          disabled={isLoading}
          className="w-full h-[40px] pl-10 pr-10 text-sm border-2 border-[var(--mcs-primary)] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--mcs-primary)] bg-[var(--mcs-surface)] text-[var(--mcs-text)] disabled:bg-[var(--mcs-surface-3)]"
          placeholder={isLoading ? t('loading') : t('smartSearchPlaceholder')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            startTransition(() => {
              onResults(searchItems(allItems, e.target.value, category), !!e.target.value)
            })
          }}
          onFocus={() => setShowDropdown(history.length > 0)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button 
            className="absolute right-3 text-[var(--mcs-text-muted)] hover:text-[var(--mcs-error)]"
            onClick={() => { setQuery(''); executeSearch(''); inputRef.current?.focus() }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showDropdown && history.length > 0 && (
        <div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded shadow-lg">
          <div className="flex justify-between items-center px-3 py-2 border-b border-[var(--mcs-border)] bg-[var(--mcs-surface-3)]">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[var(--mcs-text)]">{t('recentSearch')}</span>
            </div>
            <button 
              className="text-xs font-bold text-[var(--mcs-primary)] hover:underline px-2 py-1 rounded hover:bg-[var(--mcs-primary-light)]"
              onClick={() => { setHistory([]); localStorage.removeItem('ysdms_search_history'); setShowDropdown(false) }}
            >
              {t('clearAll')}
            </button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {history.map((h, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[var(--mcs-surface-hover)] border-b border-[var(--mcs-border)] last:border-0"
                onClick={() => { setQuery(h.query); executeSearch(h.query) }}
              >
                <div className="flex items-center gap-2 text-sm text-[var(--mcs-text)] font-mono">
                  <Clock size={14} className="text-[var(--mcs-text-muted)]" />
                  <span>{h.query}</span>
                </div>
                <button 
                  className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-error)] p-1 rounded hover:bg-[var(--mcs-error-light)]"
                  onClick={(e) => clearHistoryItem(e, idx)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
