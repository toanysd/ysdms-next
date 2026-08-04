'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'

interface SectionShellProps {
  icon: React.ElementType
  titleKey: string
  accentColor: string
  count?: number
  defaultExpanded?: boolean
  isLoading?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
}

export function SectionShell({
  icon: Icon,
  titleKey,
  accentColor,
  count,
  defaultExpanded = true,
  isLoading = false,
  children,
  actions,
}: SectionShellProps) {
  const t = useTranslations('ProductCenter')
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: 10 }}>
      {/* Header — clickable to expand/collapse */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 0', cursor: 'pointer',
          transition: 'background 0.12s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface-2)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={13} style={{ color: accentColor, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
            {t(titleKey)}
          </span>
          {count !== undefined && (
            <span
              style={{ fontSize: 9, background: `${accentColor}26`, color: accentColor, fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}
            >
              {count}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
          {actions}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
            }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Content — collapsible */}
      <div style={{
        maxHeight: isExpanded ? '3000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32 }}>
            <Loader2 size={16} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : children}
      </div>
    </div>
  )
}
