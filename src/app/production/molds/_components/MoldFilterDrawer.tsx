"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { X, Search } from "lucide-react"

interface MoldFilterDrawerProps {
  itemTypes: any[]
  customers: any[]
  racks: any[]
}

export default function MoldFilterDrawer({ itemTypes, customers, racks }: MoldFilterDrawerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  // Local state for filters
  const [typeId, setTypeId] = useState(searchParams.get('type') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [customerId, setCustomerId] = useState(searchParams.get('customer') || '')
  const [rack, setRack] = useState(searchParams.get('rack') || '')
  const [teflon, setTeflon] = useState(searchParams.get('teflon') || '')

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-filter', handleOpen)
    return () => window.removeEventListener('open-filter', handleOpen)
  }, [])

  // Sync state when params change
  useEffect(() => {
    setTypeId(searchParams.get('type') || '')
    setStatus(searchParams.get('status') || '')
    setCustomerId(searchParams.get('customer') || '')
    setRack(searchParams.get('rack') || '')
    setTeflon(searchParams.get('teflon') || '')
  }, [searchParams])

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (typeId) params.set('type', typeId)
    else params.delete('type')
    
    if (status) params.set('status', status)
    else params.delete('status')

    if (customerId) params.set('customer', customerId)
    else params.delete('customer')

    if (rack) params.set('rack', rack)
    else params.delete('rack')

    if (teflon) params.set('teflon', teflon)
    else params.delete('teflon')

    // Always reset to page 1 on new filter
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const handleClear = () => {
    setTypeId('')
    setStatus('')
    setCustomerId('')
    setRack('')
    setTeflon('')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[999] transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[320px] md:w-[400px] bg-white shadow-[-4px_0_12px_rgba(0,0,0,0.1)] z-[1000] flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#eee]">
          <div className="flex flex-col">
            <span className="font-black text-[var(--mcs-text)] flex items-center gap-2">
              <Search size={18} className="text-[var(--mcs-primary)]" />
              詳細絞込
            </span>
            <span className="text-[10px] text-[var(--mcs-text-muted)] italic font-semibold">Tìm kiếm nâng cao</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f5f5f5] text-[var(--mcs-text)] hover:bg-[#e0e0e0] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
          
          {/* Item Type */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-[var(--mcs-text)]">種類</span>
              <span className="text-[10px] text-[var(--mcs-text-muted)] italic">Loại thiết bị</span>
            </div>
            <select 
              value={typeId} 
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full h-10 border border-[#e0e0e0] rounded-lg px-3 text-sm focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] outline-none bg-white"
            >
              <option value="">-- 全て (Tất cả) --</option>
              {itemTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="h-[1px] bg-[#eeeeee]" />

          {/* Status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-[var(--mcs-text)]">状態</span>
              <span className="text-[10px] text-[var(--mcs-text-muted)] italic">Trạng thái IN/OUT</span>
            </div>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 border border-[#e0e0e0] rounded-lg px-3 text-sm focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] outline-none bg-white"
            >
              <option value="">-- 全て (Tất cả) --</option>
              <option value="IN">IN (Trong kho)</option>
              <option value="OUT">OUT (Ngoài kho)</option>
              <option value="AUDIT">AUDIT (Đang kiểm kê)</option>
            </select>
          </div>

          <div className="h-[1px] bg-[#eeeeee]" />

          {/* Customer */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-[var(--mcs-text)]">顧客</span>
              <span className="text-[10px] text-[var(--mcs-text-muted)] italic">Khách hàng</span>
            </div>
            <select 
              value={customerId} 
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full h-10 border border-[#e0e0e0] rounded-lg px-3 text-sm focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] outline-none bg-white"
            >
              <option value="">-- 全て (Tất cả) --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.customer_name_jp} ({c.customer_code})</option>
              ))}
            </select>
          </div>

          <div className="h-[1px] bg-[#eeeeee]" />

          {/* Rack Location */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-[var(--mcs-text)]">保管場所 (ラック)</span>
              <span className="text-[10px] text-[var(--mcs-text-muted)] italic">Vị trí kệ</span>
            </div>
            <select 
              className="w-full h-10 border border-[#e0e0e0] rounded-lg px-3 text-sm focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] outline-none bg-white"
              value={rack}
              onChange={(e) => setRack(e.target.value)}
            >
              <option value="">-- 全て (Tất cả) --</option>
              {racks.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
              ))}
            </select>
          </div>

          <div className="h-[1px] bg-[#eeeeee]" />

          {/* Teflon Status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-[var(--mcs-text)]">テフロン状態</span>
              <span className="text-[10px] text-[var(--mcs-text-muted)] italic">Trạng thái mạ Teflon</span>
            </div>
            <select 
              className="w-full h-10 border border-[#e0e0e0] rounded-lg px-3 text-sm focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] outline-none bg-white"
              value={teflon}
              onChange={(e) => setTeflon(e.target.value)}
            >
              <option value="">-- 全て (Tất cả) --</option>
              <option value="has_teflon">テフロン済 (Đã mạ Teflon)</option>
              <option value="no_teflon">未処理 (Chưa mạ)</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eee] flex items-center gap-3">
          <button 
            onClick={handleClear}
            className="flex-1 h-11 border border-[#e0e0e0] rounded-xl font-bold text-[var(--mcs-text-secondary)] hover:bg-[#f5f5f5] transition-colors"
          >
            クリア (Xóa)
          </button>
          <button 
            onClick={handleApply}
            className="flex-[2] h-11 bg-[var(--mcs-primary)] rounded-xl font-bold text-white hover:bg-[var(--mcs-primary-hover)] transition-colors shadow-sm"
          >
            検索 (Áp dụng)
          </button>
        </div>
      </div>
    </>
  )
}
