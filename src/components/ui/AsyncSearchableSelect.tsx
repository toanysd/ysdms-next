'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Search, X, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface SelectOption {
  value: string
  label: string
  sublabel?: string
}

export interface AsyncSearchableSelectProps {
  /** Hàm fetch options từ server — nhận query string, trả về options */
  fetchOptions: (query: string) => Promise<SelectOption[]>
  value: string | null
  onChange: (val: string | null) => void
  placeholder?: string
  disabled?: boolean
  /** Số ký tự tối thiểu để bắt đầu search (default 0 = load ngay khi mở) */
  minChars?: number
  /** Debounce ms (default 300) */
  debounceMs?: number
}

/**
 * AsyncSearchableSelect — RULE-DATA-4 & RULE-DATA-5
 *
 * Dùng khi nguồn dữ liệu > 50 records (companies, products, employees...).
 * KHÔNG pre-load toàn bộ — chỉ gọi API khi gõ, trả về max 20 kết quả.
 *
 * Cách dùng:
 * ```tsx
 * <AsyncSearchableSelect
 *   fetchOptions={async (q) => {
 *     const res = await fetch(`/api/search/companies?q=${q}&type=CUSTOMER&limit=20`)
 *     const { data } = await res.json()
 *     return data
 *   }}
 *   value={selectedId}
 *   onChange={setSelectedId}
 * />
 * ```
 */
export const AsyncSearchableSelect: React.FC<AsyncSearchableSelectProps> = ({
  fetchOptions,
  value,
  onChange,
  placeholder,
  disabled = false,
  minChars = 0,
  debounceMs = 300,
}) => {
  const t = useTranslations('Common')
  const displayPlaceholder = placeholder || t('selectPlaceholder')
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState<SelectOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cacheRef = useRef<Map<string, SelectOption[]>>(new Map())

  // Load options khi gõ (debounced + cached)
  const loadOptions = useCallback(async (query: string) => {
    if (query.length < minChars && query.length > 0) return

    const cacheKey = query.toLowerCase()
    if (cacheRef.current.has(cacheKey)) {
      setOptions(cacheRef.current.get(cacheKey)!)
      return
    }

    setLoading(true)
    try {
      const result = await fetchOptions(query)
      cacheRef.current.set(cacheKey, result)
      setOptions(result)
      // Nếu đang có value nhưng chưa có label, tìm trong kết quả
      if (value && !selectedOption) {
        const found = result.find(o => o.value === value)
        if (found) setSelectedOption(found)
      }
    } catch {
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [fetchOptions, minChars, value, selectedOption])

  // Debounce search
  useEffect(() => {
    if (!isOpen) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => loadOptions(search), debounceMs)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, isOpen, loadOptions, debounceMs])

  // Load ngay khi mở
  useEffect(() => {
    if (isOpen && options.length === 0 && !loading) {
      loadOptions('')
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Click outside
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSelect = (opt: SelectOption) => {
    setSelectedOption(opt)
    onChange(opt.value)
    setIsOpen(false)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOption(null)
    onChange(null)
  }

  return (
    <div className="relative w-full text-[12px]" ref={containerRef}>
      {/* Trigger */}
      <div
        className={`w-full h-[32px] px-2 border rounded flex items-center justify-between bg-[var(--bg-surface)] ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} border-[var(--border-default)]`}
        onClick={() => { if (!disabled) { setIsOpen(!isOpen); setSearch('') } }}
      >
        <span className={selectedOption ? 'text-[var(--text-primary)] truncate' : 'text-[var(--text-muted)] truncate'}>
          {selectedOption ? selectedOption.label : displayPlaceholder}
        </span>
        <div className="flex items-center gap-1 text-[var(--text-muted)] shrink-0">
          {selectedOption && !disabled && (
            <div onClick={handleClear} className="hover:text-[var(--status-error)] transition-colors p-0.5">
              <X size={14} />
            </div>
          )}
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-full z-50 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded shadow-lg overflow-hidden"
          style={{ maxHeight: '240px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Search input */}
          <div className="p-1.5 border-b border-[var(--border-subtle)] flex items-center gap-1.5 bg-[var(--bg-surface-2)] shrink-0">
            <Search size={12} className="text-[var(--text-muted)]" />
            <input
              type="text"
              autoFocus
              className="w-full bg-transparent border-none outline-none text-[12px] text-[var(--text-primary)]"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading && <Loader2 size={12} className="text-[var(--text-muted)] animate-spin shrink-0" />}
          </div>

          {/* Options list */}
          <div className="overflow-y-auto p-1 custom-scrollbar" style={{ flex: 1 }}>
            {loading && options.length === 0 ? (
              <div className="p-3 text-center text-[var(--text-muted)] flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> {t('loading')}
              </div>
            ) : options.length === 0 ? (
              <div className="p-2 text-center text-[var(--text-muted)]">{t('notFound')}</div>
            ) : (
              options.map(opt => (
                <div
                  key={opt.value}
                  className={`px-2 py-1.5 cursor-pointer rounded transition-colors ${opt.value === value ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--bg-active)] text-[var(--text-primary)]'}`}
                  onClick={() => handleSelect(opt)}
                >
                  <div className="truncate">{opt.label}</div>
                  {opt.sublabel && (
                    <div className={`text-[10px] truncate ${opt.value === value ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {opt.sublabel}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          {!loading && options.length > 0 && (
            <div className="px-2 py-1 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[10px] text-[var(--text-muted)] shrink-0">
              {search ? t('resultsFor', { count: options.length, search }) : t('typeToSearch', { count: options.length })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
