'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Props {
  initialSearch?: string
  initialStatus?: string
}

export function QuotationFilterBar({ initialSearch, initialStatus }: Props) {
  const t = useTranslations('Quotations')
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch || '')
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || '')
  
  const [status, setStatus] = useState(initialStatus || '')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }

    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    // Reset to page 1 on filter change
    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }, [debouncedSearch, status, router, searchParams])

  return (
    <div style={{ flexShrink: 0, padding: '0 20px', display: 'flex', gap: 12 }}>
      <div className="relative" style={{ width: 280 }}>
        <Search className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
        <input 
          type="text" 
          className="form-input form-input-search" 
          placeholder={t('search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      <select 
        className="form-input" 
        style={{ width: 160 }} 
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="">{t('filter_status')}</option>
        <option value="DRAFT">DRAFT</option>
        <option value="SENT">SENT</option>
        <option value="ACCEPTED">ACCEPTED</option>
        <option value="REJECTED">REJECTED</option>
        <option value="EXPIRED">EXPIRED</option>
      </select>
    </div>
  )
}
