'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'

interface WorkOrderFilterBarProps {
  initialSearch?: string
  initialStatus?: string
}

export function WorkOrderFilterBar({
  initialSearch = '',
  initialStatus = 'ALL',
}: WorkOrderFilterBarProps) {
  const t = useTranslations('WorkOrders')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory('search_work_orders')

  // Sync state if URL changes externally
  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  const applyFilters = useCallback(
    (newSearch: string, newStatus: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (newSearch) {
        params.set('search', newSearch)
        addToHistory(newSearch)
      } else {
        params.delete('search')
      }

      if (newStatus && newStatus !== 'ALL') {
        params.set('status', newStatus)
      } else {
        params.delete('status')
      }

      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams, addToHistory]
  )

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== initialSearch) {
        applyFilters(search, initialStatus)
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [search, initialSearch, initialStatus, applyFilters])

  const handleStatusChange = (status: string) => {
    applyFilters(search, status)
  }

  const handleClear = () => {
    setSearch('')
    const params = new URLSearchParams()
    router.push(pathname)
  }

  const currentStatus = searchParams.get('status') || initialStatus || 'ALL'

  const tabs = [
    { id: 'ALL', label: 'すべて (Tất cả)' },
    { id: 'PLANNED', label: t('kpiPlanned') },
    { id: 'IN_PROGRESS', label: t('kpiInProgress') },
    { id: 'COMPLETED', label: t('kpiCompleted') },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '0 16px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Status Tabs */}
        <div className="tab-nav" style={{ margin: 0 }}>
          {tabs.map((tab) => {
            const isActive = currentStatus === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-item ${isActive ? 'active' : ''}`}
                onClick={() => handleStatusChange(tab.id)}
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search Input & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="WOコード・製品名で検索..."
              className="form-input"
              style={{
                paddingLeft: 32,
                paddingRight: search ? 28 : 10,
                fontSize: 12,
                height: 32,
                width: '100%',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={14} />
              </button>
            )}

            {showSuggestions && history.length > 0 && (
              <SearchSuggestions
                history={history}
                visible={showSuggestions}
                onClose={() => setShowSuggestions(false)}
                onSelect={(val) => {
                  setSearch(val)
                  applyFilters(val, currentStatus)
                  setShowSuggestions(false)
                }}
                onRemove={removeFromHistory}
                onClear={clearHistory}
              />
            )}
          </div>

          {(search || (currentStatus && currentStatus !== 'ALL')) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
              style={{
                height: 32,
                padding: '0 8px',
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              title="リセット"
            >
              <RotateCcw size={13} />
              <span>クリア</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
