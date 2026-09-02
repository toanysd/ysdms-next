'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useCallback, useState, useEffect } from 'react'

export function QCFilterBar() {
  const t = useTranslations('QC')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  
  // Update URL params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(pathname + '?' + createQueryString('search', search))
    }, 400)
    return () => clearTimeout(timer)
  }, [search, router, pathname, createQueryString])

  return (
    <div className="card-flat shrink-0 flex items-center gap-3 p-3">
      {/* Search by Job Code */}
      <div className="relative max-w-sm w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="form-input form-input-search w-full"
          placeholder={t('searchJobCode')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Date filter could go here */}

      {/* Result Filter */}
      <select 
        className="form-input max-w-[150px]"
        value={searchParams.get('result') || ''}
        onChange={(e) => {
          router.push(pathname + '?' + createQueryString('result', e.target.value))
        }}
      >
        <option value="">{t('filterResultAll')}</option>
        <option value="NG">{t('filterResultNG')}</option>
        <option value="PASS">{t('filterResultPass')}</option>
      </select>
    </div>
  )
}
