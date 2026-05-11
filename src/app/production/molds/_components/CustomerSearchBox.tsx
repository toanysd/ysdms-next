"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CustomerSearchBox({
  value,
  onChange,
  initialCustomers
}: {
  value: string
  onChange: (id: string) => void
  initialCustomers: any[]
}) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<any[]>(initialCustomers)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  useEffect(() => {
    // If value changes from outside (or initial load), we might want to find the name
    if (!value) setQuery("")
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchCustomers = async () => {
      if (!query.trim()) {
        setResults(initialCustomers)
        return
      }
      setLoading(true)
      const { data } = await supabase
        .from('customers')
        .select('id, customer_name_jp, customer_code')
        .ilike('customer_name_jp', `%${query}%`)
        .limit(20)
      
      if (data) setResults(data)
      setLoading(false)
    }

    const delayDebounceFn = setTimeout(() => {
      if (isOpen) {
        searchCustomers()
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, isOpen, initialCustomers, supabase])

  const selectedName = value 
    ? (results.find(c => c.id === value)?.customer_name_jp || 'Đã chọn khách hàng')
    : '-- Khách hàng --'

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className="py-1.5 px-3 text-sm border border-slate-300 rounded bg-white w-[200px] cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate mr-2">{isOpen ? "Tìm kiếm..." : selectedName}</span>
        <span className="text-slate-400 text-xs">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 left-0 w-[250px] bg-white border border-slate-300 shadow-lg rounded overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              autoFocus
              className="w-full text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Nhập tên khách hàng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="max-h-[200px] overflow-y-auto">
            {value && (
              <div 
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
              >
                ✕ Bỏ chọn khách hàng
              </div>
            )}
            
            {loading ? (
              <div className="px-3 py-2 text-sm text-slate-500">Đang tìm...</div>
            ) : results.length > 0 ? (
              results.map(c => (
                <div 
                  key={c.id} 
                  className={`px-3 py-1.5 text-sm hover:bg-teal-50 cursor-pointer ${value === c.id ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-700'}`}
                  onClick={() => {
                    onChange(c.id)
                    setIsOpen(false)
                  }}
                >
                  <div className="truncate">{c.customer_name_jp}</div>
                  <div className="text-[10px] text-slate-400">{c.customer_code}</div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500">Không tìm thấy</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
