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
  const [status, setStatus] = useState(initialStatus || '')

  // Sync state if props change (e.g. navigation / back / forward)
  useEffect(() => {
    setSearch(initialSearch || '')
  }, [initialSearch])

  useEffect(() => {
    setStatus(initialStatus || '')
  }, [initialStatus])

  // Debounced search effect: ONLY push if search changed from current URL
  useEffect(() => {
    const currentUrlSearch = searchParams.get('search') || ''
    if (search === currentUrlSearch) return

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) {
        params.set('search', search)
      } else {
        params.delete('search')
      }
      params.set('page', '1')
      router.push(`?${params.toString()}`)
    }, 400)

    return () => clearTimeout(handler)
  }, [search, searchParams, router])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    const params = new URLSearchParams(searchParams.toString())
    if (newStatus) {
      params.set('status', newStatus)
    } else {
      params.delete('status')
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

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
        onChange={e => handleStatusChange(e.target.value)}
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
