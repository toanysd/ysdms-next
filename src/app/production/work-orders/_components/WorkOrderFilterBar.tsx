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
  const [status, setStatus] = useState(initialStatus || '')
  const [type, setType] = useState(initialType || '')

  // Sync state if props change (e.g. navigation / back / forward)
  useEffect(() => {
    setSearch(initialSearch || '')
  }, [initialSearch])

  useEffect(() => {
    setStatus(initialStatus || '')
  }, [initialStatus])

  useEffect(() => {
    setType(initialType || '')
  }, [initialType])

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

  const handleTypeChange = (newType: string) => {
    setType(newType)
    const params = new URLSearchParams(searchParams.toString())
    if (newType) {
      params.set('type', newType)
    } else {
      params.delete('type')
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

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
        onChange={e => handleTypeChange(e.target.value)}
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
        onChange={e => handleStatusChange(e.target.value)}
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
