import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (val: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder, disabled }) => {
  const t = useTranslations('Common')
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const effectivePlaceholder = placeholder || t('selectPlaceholder')
  const selectedOption = options.find(o => o.value === value)

  // Filter options
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative w-full text-[12px]" ref={containerRef}>
      <div 
        className={`w-full h-[32px] px-2 border rounded flex items-center justify-between bg-[var(--bg-surface)] ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} border-[var(--border-default)]`}
        onClick={() => { if(!disabled) { setIsOpen(!isOpen); setSearch(''); } }}
      >
        <span className={selectedOption ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)] truncate'}>
          {selectedOption ? selectedOption.label : effectivePlaceholder}
        </span>
        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          {selectedOption && !disabled && (
            <div 
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="hover:text-[var(--status-error)] transition-colors p-0.5"
            >
              <X size={14} />
            </div>
          )}
          <ChevronDown size={14} />
        </div>
      </div>

      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-1 w-full z-50 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded shadow-lg overflow-hidden"
          style={{ maxHeight: '200px', display: 'flex', flexDirection: 'column' }}
        >
          <div className="p-1.5 border-b border-[var(--border-subtle)] flex items-center gap-1.5 bg-[var(--bg-surface-2)]">
            <Search size={12} className="text-[var(--text-muted)]" />
            <input 
              type="text"
              autoFocus
              className="w-full bg-transparent border-none outline-none text-[12px] text-[var(--text-primary)]"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-y-auto p-1 custom-scrollbar" style={{ flex: 1 }}>
            {filtered.length === 0 ? (
              <div className="p-2 text-center text-[var(--text-muted)]">{t('notFound')}</div>
            ) : (
              filtered.map(opt => (
                <div
                  key={opt.value}
                  className={`px-2 py-1.5 cursor-pointer rounded transition-colors ${opt.value === value ? 'bg-[var(--accent)] text-white font-bold' : 'hover:bg-[var(--bg-active)] text-[var(--text-primary)]'}`}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

