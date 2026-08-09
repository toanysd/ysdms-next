'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Wrench, LogIn, Truck, Scale, Trash2, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export interface EquipmentItemContext {
  id: string
  type: string
  code: string
  name: string
  status: string
  rack: string
  url: string
  isDirect?: boolean
  isBound?: boolean
  isCavMatch?: boolean
}

interface EquipmentContextMenuProps {
  x: number
  y: number
  item: EquipmentItemContext
  onClose: () => void
  onAction: (actionKey: string, item: EquipmentItemContext) => void
}

export function EquipmentContextMenu({ x, y, item, onClose, onAction }: EquipmentContextMenuProps) {
  const t = useTranslations('ProductCenter')
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  // Prevent context menu from rendering off-screen
  const adjustedX = Math.min(x, typeof window !== 'undefined' ? window.innerWidth - 240 : x)
  const adjustedY = Math.min(y, typeof window !== 'undefined' ? window.innerHeight - 260 : y)

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: adjustedY,
        left: adjustedX,
        width: 220,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 8,
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)',
        zIndex: 99999,
        padding: '6px 0',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 11,
      }}
    >
      {/* Menu Header */}
      <div style={{
        padding: '6px 10px',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-surface-2)',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
      }}>
        <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>
          {item.code}
        </span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={12} />
        </button>
      </div>

      {/* Menu Options */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0' }}>
        {/* 1. Create Job */}
        <button
          onClick={() => { onAction('CREATE_JOB', item); onClose() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'var(--text-primary)', textAlign: 'left', fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 10%, transparent)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Wrench size={13} style={{ color: 'var(--accent)' }} />
          <span>{t('createJobAction')}</span>
        </button>

        {/* 2. Check-in */}
        <button
          onClick={() => { onAction('CHECK_IN', item); onClose() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'var(--text-primary)', textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogIn size={13} style={{ color: '#0284C7' }} />
          <span>{t('checkInAction')}</span>
        </button>

        {/* 3. Transfer / Loan */}
        <button
          onClick={() => { onAction('TRANSFER', item); onClose() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'var(--text-primary)', textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Truck size={13} style={{ color: '#8B5CF6' }} />
          <span>{t('transferAction')}</span>
        </button>

        {/* 4. Update Specs & Weight */}
        <button
          onClick={() => { onAction('UPDATE_SPECS', item); onClose() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'var(--text-primary)', textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Scale size={13} style={{ color: '#F59E0B' }} />
          <span>{t('updateSpecsAction')}</span>
        </button>

        <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />

        {/* 5. Scrap */}
        <button
          onClick={() => { onAction('SCRAP', item); onClose() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: '#EF4444', textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'color-mix(in srgb, #EF4444 10%, transparent)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Trash2 size={13} style={{ color: '#EF4444' }} />
          <span>{t('scrapAction')}</span>
        </button>
      </div>

      {/* Footer Link to Detail Page */}
      <div style={{
        padding: '5px 12px', borderTop: '1px solid var(--border-default)',
        display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-surface-2)',
        borderBottomLeftRadius: 7, borderBottomRightRadius: 7,
      }}>
        <Link
          href={item.url}
          onClick={onClose}
          style={{ fontSize: 10, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 600 }}
        >
          Details <ExternalLink size={9} />
        </Link>
      </div>
    </div>
  )
}
