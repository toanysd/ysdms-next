'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'

export interface ComboboxOption {
  value: string
  label: string
  code?: string
  subLabel?: string
}

interface Props {
  options: ComboboxOption[]
  value: string
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function SearchableCombobox({ options, value, onChange, placeholder = '検索・コード入力...', disabled = false }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Selected Option Object
  const selectedOption = options.find(o => o.value === value)

  // Filter Options in realtime
  const filtered = options.filter(opt => {
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    const matchLabel = opt.label.toLowerCase().includes(q)
    const matchCode = opt.code ? opt.code.toLowerCase().includes(q) : false
    const matchSub = opt.subLabel ? opt.subLabel.toLowerCase().includes(q) : false
    return matchLabel || matchCode || matchSub
  })

  // Sync displayed input text when selectedOption changes externally
  useEffect(() => {
    if (selectedOption) {
      setQuery(selectedOption.label + (selectedOption.code ? ` (${selectedOption.code})` : ''))
    } else if (!isOpen) {
      setQuery('')
    }
  }, [value, selectedOption, isOpen])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        if (selectedOption) {
          setQuery(selectedOption.label + (selectedOption.code ? ` (${selectedOption.code})` : ''))
        } else {
          setQuery('')
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedOption])

  // Reset highlight index when filtered list changes
  useEffect(() => {
    setHighlightIndex(0)
  }, [query])

  // Handle Keyboard Navigation (Up, Down, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered.length > 0 && filtered[highlightIndex]) {
        const item = filtered[highlightIndex]
        onChange(item.value)
        setQuery(item.label + (item.code ? ` (${item.code})` : ''))
        setIsOpen(false)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSelectOption = (opt: ComboboxOption) => {
    onChange(opt.value)
    setQuery(opt.label + (opt.code ? ` (${opt.code})` : ''))
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setQuery('')
    if (inputRef.current) inputRef.current.focus()
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input Box */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          className="form-input"
          value={query}
          onFocus={() => {
            setIsOpen(true)
            inputRef.current?.select()
          }}
          onChange={e => {
            setQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          style={{
            paddingRight: 50,
            paddingLeft: 28,
            height: 34,
            fontSize: 12,
            fontWeight: selectedOption ? 600 : 400,
            borderColor: isOpen ? 'var(--accent)' : undefined
          }}
        />
        <Search size={14} style={{ position: 'absolute', left: 8, color: 'var(--text-muted)' }} />

        <div style={{ position: 'absolute', right: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
              title="Xóa lựa chọn"
            >
              <X size={12} />
            </button>
          )}
          <ChevronDown
            size={14}
            style={{
              color: 'var(--text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {/* Floating Suggestions Dropdown List */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            maxHeight: 220,
            overflowY: 'auto',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
            zIndex: 1200,
            padding: 4
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              Không tìm thấy kết quả nào trùng khớp
            </div>
          ) : (
            filtered.map((opt, idx) => {
              const isSelected = opt.value === value
              const isHighlighted = idx === highlightIndex

              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelectOption(opt)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  style={{
                    padding: '6px 10px',
                    fontSize: 11,
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isHighlighted
                      ? 'var(--bg-surface-2)'
                      : isSelected
                      ? 'var(--tint-teal-bg)'
                      : 'transparent',
                    color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 700 : 400
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>{opt.label}</span>
                    {opt.code && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--bg-surface-2)', padding: '1px 5px', borderRadius: 3 }}>
                        {opt.code}
                      </span>
                    )}
                    {opt.subLabel && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        ({opt.subLabel})
                      </span>
                    )}
                  </div>
                  {isSelected && <Check size={14} color="var(--accent)" />}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
