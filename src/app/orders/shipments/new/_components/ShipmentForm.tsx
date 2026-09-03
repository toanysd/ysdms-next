'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Save, AlertCircle } from 'lucide-react'
import { createShipmentAction, searchOrderLinesAction } from '../../actions'

type DeliverySite = {
  site_id: string
  site_name: string
}

type OrderLineDetail = {
  line_id: string
  order_id: string
  quantity: number
  shipped_qty: number
  remaining_qty: number
  order_no: string
  customer_name: string
  product_code: string
  product_name: string
  unit: string
}

interface ShipmentFormProps {
  deliverySites: DeliverySite[]
  initialOrder?: any
  initialLines?: OrderLineDetail[]
}

export function ShipmentForm({ deliverySites, initialOrder, initialLines = [] }: ShipmentFormProps) {
  const t = useTranslations('Shipment')
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  
  // Order Line Search State
  const [orderSearch, setOrderSearch] = useState('')
  const [availableLines, setAvailableLines] = useState<OrderLineDetail[]>(initialLines)
  const [selectedLine, setSelectedLine] = useState<OrderLineDetail | null>(() => {
    return initialLines.length > 0 ? initialLines[0] : null
  })

  // Form State
  const [quantity, setQuantity] = useState<number | ''>(() => {
    return initialLines.length > 0 ? initialLines[0].remaining_qty : ''
  })
  const [shipDate, setShipDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [deliverySiteId, setDeliverySiteId] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('TRUCK')
  const [deliveryNoteNo, setDeliveryNoteNo] = useState(() => {
    const d = new Date()
    const yy = String(d.getFullYear()).slice(-2)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const rnd = Math.floor(1000 + Math.random() * 9000)
    return `DN-${yy}${mm}${dd}-${rnd}`
  })
  const [notes, setNotes] = useState('')

  // Async Order Line Search
  useEffect(() => {
    if (orderSearch.length < 2) {
      setAvailableLines([])
      return
    }
    const fetchLines = async () => {
      const results = await searchOrderLinesAction(orderSearch)
      setAvailableLines(results as any)
    }

    const timer = setTimeout(fetchLines, 400)
    return () => clearTimeout(timer)
  }, [orderSearch])

  const handleSelectLine = (line: OrderLineDetail) => {
    setSelectedLine(line)
    setQuantity(line.remaining_qty)
    setOrderSearch('')

    if (!deliveryNoteNo) {
      const d = new Date()
      const yy = String(d.getFullYear()).slice(-2)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const rnd = Math.floor(1000 + Math.random() * 9000)
      setDeliveryNoteNo(`DN-${yy}${mm}${dd}-${rnd}`)
    }
  }

  const isQtyInvalid = selectedLine && (Number(quantity) <= 0 || Number(quantity) > selectedLine.remaining_qty)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLine || !shipDate || !deliveryMethod || isQtyInvalid) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append('order_line_id', selectedLine.line_id)
    formData.append('order_id', selectedLine.order_id)
    formData.append('quantity', String(quantity))
    formData.append('ship_date', shipDate)
    if (deliverySiteId) formData.append('delivery_site_id', deliverySiteId)
    formData.append('delivery_method', deliveryMethod)
    if (deliveryNoteNo) formData.append('delivery_note_no', deliveryNoteNo)
    if (notes) formData.append('notes', notes)

    const result = await createShipmentAction(formData)

    setLoading(false)
    if (!result.success) {
      alert(result.error)
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
                <div className="border border-slate-200 rounded-md shadow-sm mt-1 max-h-56 overflow-y-auto">
                  {availableLines.map(line => (
                    <div 
                      key={line.line_id} 
                      className="px-3 py-2.5 hover:bg-slate-50 cursor-pointer flex flex-col gap-1 border-b last:border-b-0"
                      onClick={() => handleSelectLine(line)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-mono font-bold text-[var(--accent)]">{line.order_no}</span>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-slate-500">発注: {line.quantity}</span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            残: {line.remaining_qty} {line.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-700 font-medium">
                        {line.customer_name ? `${line.customer_name} — ` : ''}{line.product_name || line.product_code || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2 bg-[var(--tint-teal-bg)] border border-teal-200 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[14px] font-bold text-[var(--accent)]">
                    {selectedLine.order_no}
                  </span>
                  {selectedLine.customer_name && (
                    <span className="text-xs text-slate-600 font-medium">
                      ({selectedLine.customer_name})
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedLine(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline shrink-0"
                >
                  {t('changeBtn')}
                </button>
              </div>

              <div className="text-sm font-medium text-slate-800">
                {selectedLine.product_name || selectedLine.product_code}
              </div>

              {/* Delivery Stats Bar */}
              <div className="grid grid-cols-3 gap-2 mt-1 pt-2 border-t border-teal-100 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">発注総数</span>
                  <span className="font-bold text-slate-800">{selectedLine.quantity.toLocaleString()} {selectedLine.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">出荷済</span>
                  <span className="font-bold text-slate-700">{selectedLine.shipped_qty.toLocaleString()} {selectedLine.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">未出荷残数</span>
                  <span className="font-bold text-emerald-700">{selectedLine.remaining_qty.toLocaleString()} {selectedLine.unit}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Partial Delivery Quantity Input */}
      {selectedLine && (
        <div className="form-section bg-slate-50 p-3 rounded-md border border-slate-200">
          <label className="form-label flex items-center justify-between">
            <span>出荷数量 (今回の出荷数)</span>
            <span className="text-xs text-slate-500 font-normal">
              上限: {selectedLine.remaining_qty.toLocaleString()} {selectedLine.unit}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              className="form-input font-mono font-bold text-sm w-48"
              value={quantity}
              min={1}
              max={selectedLine.remaining_qty}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              required
            />
            <span className="text-xs text-slate-600 font-medium">{selectedLine.unit}</span>
            <button
              type="button"
              className="btn btn-secondary text-xs px-2 py-1 h-auto"
              onClick={() => setQuantity(selectedLine.remaining_qty)}
            >
              全数出荷 ({selectedLine.remaining_qty})
            </button>
          </div>

          {isQtyInvalid && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold mt-1.5">
              <AlertCircle size={13} />
              <span>出荷数量は 1 〜 {selectedLine.remaining_qty.toLocaleString()} の範囲で入力してください。</span>
            </div>
          )}
        </div>
      )}

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
            <option value="TRUCK">{t('methodTRUCK')}</option>
            <option value="COURIER">{t('methodDELIVERY_SERVICE')}</option>
            <option value="SELF_PICKUP">{t('methodCUSTOMER_PICKUP')}</option>
            <option value="OTHER">{t('methodOTHER')}</option>
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-section">
          <label className="form-label">{t('deliveryNoteNo')} (納品書番号)</label>
          <input 
            type="text" 
            className="form-input font-mono" 
            placeholder="DN-YYMMDD-XXXX"
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
          disabled={loading || !selectedLine || !shipDate || !deliveryMethod || Boolean(isQtyInvalid)}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? t('savingBtn') : t('saveBtn')}
        </button>
      </div>
    </form>
  )
}
