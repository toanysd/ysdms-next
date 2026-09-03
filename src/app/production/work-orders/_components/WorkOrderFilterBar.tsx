'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Props {
  initialSearch?: string
  initialStatus?: string
  initialType?: string
}

export function WorkOrderFilterBar({ initialSearch, initialStatus, initialType }: Props) {
  const t = useTranslations('WorkOrders')
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch || '')
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || '')
  
  const [status, setStatus] = useState(initialStatus || '')
  const [type, setType] = useState(initialType || '')

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

    if (type) {
      params.set('type', type)
    } else {
      params.delete('type')
    }

    // Reset to page 1 on filter change
    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }, [debouncedSearch, status, type, router, searchParams])

  return (
    <div style={{ flexShrink: 0, padding: '0 20px', display: 'flex', gap: 12 }}>
      <div className="relative" style={{ width: 250 }}>
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
        style={{ width: 150 }} 
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="">{t('filter_type')}</option>
        <option value="NEW_SET">NEW_SET</option>
        <option value="REPAIR">REPAIR</option>
        <option value="MODIFICATION">MODIFICATION</option>
        <option value="SAMPLE">SAMPLE</option>
      </select>

      <select 
        className="form-input" 
        style={{ width: 150 }} 
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="">{t('filter_status')}</option>
        <option value="PLANNED">PLANNED</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>
  )
}
