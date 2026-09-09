'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, X } from 'lucide-react'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'

interface InventoryFilterBarProps {
  initialSearch?: string
  initialCompanyId?: string
  initialStatus?: string
  companies: { company_id: string; company_name: string; company_code: string | null }[]
  onFilterChange: (filters: { search: string; companyId: string; status: string }) => void
}

export function InventoryFilterBar({
  initialSearch = '',
  initialCompanyId = 'ALL',
  initialStatus = 'ALL',
  companies,
  onFilterChange
}: InventoryFilterBarProps) {
  const t = useTranslations('Inventory')
  const [search, setSearch] = useState(initialSearch)
  const [companyId, setCompanyId] = useState(initialCompanyId)
  const [status, setStatus] = useState(initialStatus)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('inventory_search')

  const handleSearchSubmit = (term: string) => {
    setSearch(term)
    setShowSuggestions(false)
    if (term.trim()) addToHistory(term.trim())
    onFilterChange({ search: term, companyId, status })
  }

  const handleCompanyChange = (cId: string) => {
    setCompanyId(cId)
    onFilterChange({ search, companyId: cId, status })
  }

  const handleStatusChange = (st: string) => {
    setStatus(st)
    onFilterChange({ search, companyId, status: st })
  }

  const handleReset = () => {
    setSearch('')
    setCompanyId('ALL')
    setStatus('ALL')
    onFilterChange({ search: '', companyId: 'ALL', status: 'ALL' })
  }

  return (
    <div
      className="card-flat"
      style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
        {/* Search input */}
        <div className="relative flex-1" style={{ maxWidth: 360 }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            className="form-input form-input-search w-full"
            style={{ paddingLeft: 34, height: 32, fontSize: 13 }}
            placeholder={t('searchPlaceholder') || 'Mã hoặc tên sản phẩm...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(search)
            }}
          />
          <SearchSuggestions
            history={history}
            visible={showSuggestions && history.length > 0}
            onSelect={(term) => handleSearchSubmit(term)}
            onRemove={removeFromHistory}
            onClear={clearHistory}
            onClose={() => setShowSuggestions(false)}
          />
        </div>

        {/* Customer select */}
        <div style={{ minWidth: 160 }}>
          <select
            className="form-input"
            style={{ height: 32, fontSize: 13, padding: '0 8px' }}
            value={companyId}
            onChange={(e) => handleCompanyChange(e.target.value)}
          >
            <option value="ALL">{t('filterAllCustomers')}</option>
            {companies.map((c) => (
              <option key={c.company_id} value={c.company_id}>
                {c.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* Status select */}
        <div style={{ minWidth: 140 }}>
          <select
            className="form-input"
            style={{ height: 32, fontSize: 13, padding: '0 8px' }}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="ALL">{t('filterAllStatus')}</option>
            <option value="IN_STOCK">{t('statusInStock')}</option>
            <option value="LOW_STOCK">{t('statusLowStock')}</option>
            <option value="OUT_OF_STOCK">{t('statusOutOfStock')}</option>
          </select>
        </div>
      </div>

      {/* Clear/Reset button */}
      {(search || companyId !== 'ALL' || status !== 'ALL') && (
        <button
          onClick={handleReset}
          className="btn btn-secondary flex items-center gap-1 text-xs"
          style={{ height: 30, padding: '0 10px' }}
        >
          <X size={13} />
          <span>リセット</span>
        </button>
      )}
    </div>
  )
}
