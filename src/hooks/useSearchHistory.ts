'use client'

import { useState, useCallback, useEffect } from 'react'

const MAX_ITEMS = 10

/**
 * Custom hook to manage search history in localStorage.
 * Each page/table should use a unique storageKey.
 *
 * @param storageKey - Unique key for localStorage (e.g. 'search_products', 'search_molds')
 * @param maxItems - Maximum number of history items to keep (default 10)
 */
export function useSearchHistory(storageKey: string, maxItems = MAX_ITEMS) {
  const [history, setHistory] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    }
  }, [storageKey])

  const saveToStorage = useCallback((items: string[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch {
      // Ignore quota errors
    }
  }, [storageKey])

  const addToHistory = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed || trimmed.length < 2) return

    setHistory(prev => {
      // Remove duplicates, add to front, limit size
      const filtered = prev.filter(item => item !== trimmed)
      const updated = [trimmed, ...filtered].slice(0, maxItems)
      saveToStorage(updated)
      return updated
    })
  }, [maxItems, saveToStorage])

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item !== query)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // Ignore
    }
  }, [storageKey])

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
