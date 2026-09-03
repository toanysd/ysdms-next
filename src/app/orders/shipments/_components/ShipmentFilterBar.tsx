'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export function ShipmentFilterBar() {
  const t = useTranslations('Shipment')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [orderNo, setOrderNo] = useState(searchParams.get('order_no') || '')
  const [customer, setCustomer] = useState(searchParams.get('customer') || '')
  const [fromDate, setFromDate] = useState(searchParams.get('from_date') || '')
  const [toDate, setToDate] = useState(searchParams.get('to_date') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')

  const isMounted = useRef(false)

  // Debounce search updates
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (orderNo) params.set('order_no', orderNo)
      if (customer) params.set('customer', customer)
      if (fromDate) params.set('from_date', fromDate)
      if (toDate) params.set('to_date', toDate)
      if (status) params.set('status', status)

      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    }, 400)

    return () => clearTimeout(timer)
  }, [orderNo, customer, fromDate, toDate, status, router, pathname])

  const handleClear = () => {
    setOrderNo('')
    setCustomer('')
    setFromDate('')
    setToDate('')
    setStatus('')
    router.push(pathname)
  }

  const hasFilters = Boolean(orderNo || customer || fromDate || toDate || status)

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

      {/* Date filter */}
      <input 
        type="date" 
        className="form-input w-36"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <span className="text-slate-400">-</span>
      <input 
        type="date" 
        className="form-input w-36"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      {/* Status Filter */}
      <select 
        className="form-select w-36"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">{t('filterStatusAll')}</option>
        <option value="PREPARING">準備中 (Preparing)</option>
        <option value="SHIPPED">{t('filterStatusShipped')}</option>
        <option value="DELIVERED">受領済 (Delivered)</option>
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-secondary flex items-center gap-1 text-xs px-2.5 py-1.5 h-auto"
        >
          <X size={13} />
          <span>クリア</span>
        </button>
      )}
    </div>
  )
}
