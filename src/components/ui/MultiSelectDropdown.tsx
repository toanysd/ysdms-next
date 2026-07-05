'use client'

import React, { useState, useEffect, useRef } from 'react'

interface MultiSelectOption {
  id: string
  label: string
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[]
  /** Comma-separated string of selected IDs */
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * コンパクト複数選択ドロップダウン
 * Compact multi-select dropdown for Gantt table cells.
 * Value format: comma-separated IDs ("id1,id2,id3")
 */
export function MultiSelectDropdown({ options, value, onChange, placeholder = '- 選択 -' }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedIds = value ? value.split(',').map((id: string) => id.trim()).filter(Boolean) : []
  const selectedLabels = selectedIds.map((id: string) => options.find((o) => o.id === id)?.label || id)

  const toggle = (id: string) => {
    let newIds = [...selectedIds]
    if (newIds.includes(id)) newIds = newIds.filter(x => x !== id)
    else newIds.push(id)
    onChange(newIds.join(','))
  }

  return (
    <div className="relative" ref={ref} style={{ width: '100%' }}>
      <div 
        onClick={() => setOpen(!open)}
        className="form-input cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ padding: '2px 6px', fontSize: 12, minHeight: 24, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}
        title={selectedLabels.join(', ')}
      >
        {selectedLabels.length > 0 ? selectedLabels.join(', ') : <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>}
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto border rounded shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
          {options.map((opt) => (
            <div 
              key={opt.id} 
              className="px-2 py-1 cursor-pointer flex items-center gap-2 text-[12px] hover:bg-[var(--bg-hover)]"
              onClick={() => toggle(opt.id)}
            >
              <input type="checkbox" checked={selectedIds.includes(opt.id)} readOnly className="cursor-pointer" />
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
