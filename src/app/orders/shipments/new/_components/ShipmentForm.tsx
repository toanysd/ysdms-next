'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

type DeliverySite = {
  site_id: string
  site_name: string
}

type OrderLineDetail = {
  line_id: string
  order_id: string
  quantity: number
  order_no: string
  product_name: string
}

export function ShipmentForm({ deliverySites }: { deliverySites: DeliverySite[] }) {
  const t = useTranslations('Shipment')
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  
  // Order Line Search State
  const [orderSearch, setOrderSearch] = useState('')
  const [availableLines, setAvailableLines] = useState<OrderLineDetail[]>([])
  const [selectedLine, setSelectedLine] = useState<OrderLineDetail | null>(null)

  // Form State
  const [shipDate, setShipDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [deliverySiteId, setDeliverySiteId] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('')
  const [deliveryNoteNo, setDeliveryNoteNo] = useState('')
  const [notes, setNotes] = useState('')

  // Async Order Line Search
  useEffect(() => {
    if (orderSearch.length < 2) {
      setAvailableLines([])
      return
    }
    const fetchLines = async () => {
      // 1. Fetch matching orders
      const { data: orders } = await supabase
        .from('orders')
        .select('order_id, order_no')
        .ilike('order_no', `%${orderSearch}%`)
        .limit(10)
      
      if (!orders || orders.length === 0) {
        setAvailableLines([])
        return
      }
      
      const orderIds = orders.map(o => o.order_id)

      // 2. Fetch order lines with products
      const { data: lines } = await supabase
        .from('order_lines')
        .select(`
          line_id,
          order_id,
          quantity,
          products (product_name)
        `)
        .in('order_id', orderIds)
        
      if (!lines) return

      // 3. Fetch existing shipments to filter out already shipped lines
      const { data: existingShipments } = await supabase
        .from('shipments')
        .select('order_line_id')
        .in('order_id', orderIds)
        .not('order_line_id', 'is', null)

      const shippedLineIds = new Set(existingShipments?.map(s => s.order_line_id))

      // 4. Combine and filter
      const finalLines: OrderLineDetail[] = lines
        .filter((l: any) => !shippedLineIds.has(l.line_id))
        .map((l: any) => ({
          line_id: l.line_id,
          order_id: l.order_id,
          quantity: l.quantity,
          order_no: orders.find(o => o.order_id === l.order_id)?.order_no || '',
          product_name: l.products?.product_name || ''
        }))

      setAvailableLines(finalLines)
    }

    const timer = setTimeout(fetchLines, 400)
    return () => clearTimeout(timer)
  }, [orderSearch, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLine || !shipDate || !deliveryMethod) return
    
    setLoading(true)
    const { error } = await supabase.from('shipments').insert({
      order_id: selectedLine.order_id,
      order_line_id: selectedLine.line_id,
      ship_date: shipDate,
      delivery_site_id: deliverySiteId || null,
      delivery_method: deliveryMethod,
      delivery_note_no: deliveryNoteNo || null,
      notes: notes || null,
      status: 'SHIPPED', // Default standard
      shipment_type: 'physical'
    })

    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      router.push('/orders/shipments')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Order Line Selection */}
      <div className="form-section">
        <label className="form-label">{t('selectOrderLine')}</label>
        <div className="flex flex-col gap-2">
          {!selectedLine ? (
            <>
              <input
                type="text"
                className="form-input"
                placeholder={t('searchOrderPlaceholder')}
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
              {availableLines.length > 0 && (
                <div className="border border-slate-200 rounded-md shadow-sm mt-1 max-h-48 overflow-y-auto">
                  {availableLines.map(line => (
                    <div 
                      key={line.line_id} 
                      className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex flex-col gap-1 border-b last:border-b-0"
                      onClick={() => {
                        setSelectedLine(line)
                        setOrderSearch('')
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-mono font-bold text-[var(--accent)]">{line.order_no}</span>
                        <span className="text-xs text-slate-500 font-mono">Qty: {line.quantity}</span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium">
                        {line.product_name || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between bg-[var(--tint-teal-bg)] border border-teal-100 p-3 rounded-md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[14px] font-bold text-[var(--accent)]">
                    {selectedLine.order_no}
                  </span>
                  <span className="text-xs text-slate-600 bg-white px-2 py-0.5 rounded border">
                    Qty: {selectedLine.quantity}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-800">
                  {selectedLine.product_name}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedLine(null)}
                className="text-xs text-slate-500 hover:text-slate-800 underline shrink-0"
              >
                {t('changeBtn')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-section">
          <label className="form-label">{t('shipDate')}</label>
          <input 
            type="date" 
            className="form-input" 
            value={shipDate}
            onChange={(e) => setShipDate(e.target.value)}
            required
          />
        </div>
        <div className="form-section">
          <label className="form-label">{t('deliveryMethod')}</label>
          <select 
            className="form-select" 
            value={deliveryMethod} 
            onChange={(e) => setDeliveryMethod(e.target.value)}
            required
          >
            <option value="">--</option>
            <option value="TRUCK">{t('methodTRUCK')}</option>
            <option value="COURIER">{t('methodDELIVERY_SERVICE')}</option>
            <option value="SELF_PICKUP">{t('methodCUSTOMER_PICKUP')}</option>
            <option value="OTHER">{t('methodOTHER')}</option>
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-section">
          <label className="form-label">{t('deliveryNoteNo')}</label>
          <input 
            type="text" 
            className="form-input font-mono" 
            value={deliveryNoteNo}
            onChange={(e) => setDeliveryNoteNo(e.target.value)}
          />
        </div>
        <div className="form-section">
          <label className="form-label">{t('selectSite')}</label>
          <select 
            className="form-select" 
            value={deliverySiteId} 
            onChange={(e) => setDeliverySiteId(e.target.value)}
          >
            <option value="">{t('noSite')}</option>
            {deliverySites.map(site => (
              <option key={site.site_id} value={site.site_id}>
                {site.site_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">{t('notes')}</label>
        <textarea 
          className="form-textarea" 
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || !selectedLine || !shipDate || !deliveryMethod}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? t('savingBtn') : t('saveBtn')}
        </button>
      </div>
    </form>
  )
}
