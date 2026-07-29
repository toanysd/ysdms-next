'use client'

import { useRef, useState, useEffect } from 'react'
import { Clock, X, Trash2 } from 'lucide-react'

import { useTranslations } from 'next-intl'

type Props = {
  history: string[]
  onSelect: (query: string) => void
  onRemove: (query: string) => void
  onClear: (e?: any) => void
  visible: boolean
  onClose: () => void
}

/**
 * Dropdown showing recent search history.
 * Renders below the search input when focused.
 */
export function SearchSuggestions({ history, onSelect, onRemove, onClear, visible, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslations('Common')

  // Close on outside click
  useEffect(() => {
    if (!visible) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [visible, onClose])

  if (!visible || history.length === 0) return null

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full mt-1 z-40 rounded-md shadow-lg border"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: 'var(--border-subtle)', fontSize: 10 }}
      >
        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Clock size={10} />
          {t('recentSearch')}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onClear() }}
          className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
          style={{ color: 'var(--text-muted)', fontSize: 10 }}
          title={t('clearAll')}
        >
          <Trash2 size={10} />
          {t('clearAll')}
        </button>
      </div>

      {/* Items */}
      <ul className="list-none m-0 p-0" style={{ maxHeight: 200, overflowY: 'auto' }}>
        {history.map((item) => (
          <li
            key={item}
            className="flex items-center justify-between px-3 py-1.5 cursor-pointer"
            style={{ fontSize: 12, color: 'var(--text-primary)' }}
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(item)
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <span className="flex items-center gap-2 truncate">
              <Clock size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              {item}
            </span>
            <button
              className="bg-transparent border-none cursor-pointer p-0.5 rounded"
              style={{ color: 'var(--text-muted)' }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onRemove(item)
              }}
              title={t('delete')}
            >
              <X size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
