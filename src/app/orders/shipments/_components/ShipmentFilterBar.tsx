'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useCallback, useState, useEffect } from 'react'

export function ShipmentFilterBar() {
  const t = useTranslations('Shipment')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [orderNo, setOrderNo] = useState(searchParams.get('order_no') || '')
  const [customer, setCustomer] = useState(searchParams.get('customer') || '')
  
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
      let url = pathname + '?'
      const params = new URLSearchParams(searchParams.toString())
      if (orderNo) params.set('order_no', orderNo)
      else params.delete('order_no')
      if (customer) params.set('customer', customer)
      else params.delete('customer')
      
      router.push(pathname + '?' + params.toString())
    }, 400)
    return () => clearTimeout(timer)
  }, [orderNo, customer, router, pathname, searchParams])

  return (
    <div className="card-flat shrink-0 flex items-center gap-3 p-3 flex-wrap">
      {/* Order No Search */}
      <div className="relative w-48">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="form-input form-input-search w-full"
          placeholder={t('searchOrderNo')}
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
        />
      </div>

      {/* Customer Search */}
      <div className="relative w-48">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="form-input form-input-search w-full"
          placeholder={t('searchCustomer')}
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </div>

      {/* Date filter placeholder */}
      <input 
        type="date" 
        className="form-input w-36"
        value={searchParams.get('from_date') || ''}
        onChange={(e) => router.push(pathname + '?' + createQueryString('from_date', e.target.value))}
      />
      <span className="text-slate-400">-</span>
      <input 
        type="date" 
        className="form-input w-36"
        value={searchParams.get('to_date') || ''}
        onChange={(e) => router.push(pathname + '?' + createQueryString('to_date', e.target.value))}
      />

      {/* Status Filter */}
      <select 
        className="form-select w-32"
        value={searchParams.get('status') || ''}
        onChange={(e) => {
          router.push(pathname + '?' + createQueryString('status', e.target.value))
        }}
      >
        <option value="">{t('filterStatusAll')}</option>
        <option value="PENDING">{t('filterStatusPending')}</option>
        <option value="SHIPPED">{t('filterStatusShipped')}</option>
      </select>
    </div>
  )
}
