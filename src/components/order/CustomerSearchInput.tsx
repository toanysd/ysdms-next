'use client'

import React, { useState, useEffect } from 'react'
import { searchCustomers } from '@/app/actions/customer'

interface Customer {
    id: string;
    customer_code: string;
    delivery_name: string | null;
    delivery_address: string | null;
    requester_code: string | null;
    contact_person: string | null;
    phone: string | null;
}

interface Props {
    onSelect: (customer: Customer | null) => void
    defaultValue?: string
}

export function CustomerSearchInput({ onSelect, defaultValue = '' }: Props) {
    const [query, setQuery] = useState(defaultValue)
    const [results, setResults] = useState<Customer[]>([])
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(async () => {
            // Nếu đang bật gợi ý và có chữ thì auto search
            if (query && open) {
                setIsLoading(true)
                try {
                    const data = await searchCustomers(query)
                    setResults(data)
                } catch (err) {
                    console.error(err)
                } finally {
                    setIsLoading(false)
                }
            } else if (!query) {
                setResults([])
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [query, open])

    const handleSelect = (customer: Customer) => {
        setQuery(`${customer.customer_code} - ${customer.delivery_name || ''}`)
        setResults([])
        setOpen(false)
        onSelect(customer)
    }

    const handleClear = () => {
        setQuery('')
        setResults([])
        onSelect(null)
    }

    return (
        <div className="relative w-full h-[34px]">
            <div className="flex items-center w-full h-full border border-teal-200 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 rounded bg-white overflow-hidden pl-2 pr-1">
                <input
                    type="text"
                    value={query}
                    onFocus={() => setOpen(true)}
                    onChange={e => {
                        setQuery(e.target.value)
                        setOpen(true)
                        if (e.target.value === '') handleClear()
                    }}
                    onBlur={() => setTimeout(() => setOpen(false), 200)}
                    className="w-full h-full outline-none bg-transparent font-mono text-sm text-[var(--mcs-text)]"
                    placeholder="Gõ mã hoặc tên khách..."
                    required
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                        ×
                    </button>
                )}
            </div>

            {open && (results.length > 0 || isLoading) && (
                <ul className="absolute left-0 z-50 w-[400px] bg-white border border-teal-200 rounded shadow-lg mt-1 max-h-64 overflow-auto">
                    {isLoading && (
                        <li className="px-3 py-2 text-sm text-[var(--mcs-text-muted)] italic flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            Đang tìm kiếm...
                        </li>
                    )}

                    {!isLoading && results.map(p => (
                        <li
                            key={p.id}
                            onClick={() => handleSelect(p)}
                            className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-mono font-bold text-emerald-700 text-[13px]">{p.customer_code}</span>
                                <span className="text-[12px] text-[var(--mcs-text)] mt-0.5 truncate">{p.delivery_name || 'No Name'}</span>
                            </div>
                        </li>
                    ))}
                    {!isLoading && results.length === 0 && query.length >= 2 && (
                        <li className="px-3 py-2 text-sm text-amber-600 bg-amber-50">Không tìm thấy khách hàng này</li>
                    )}
                </ul>
            )}
        </div>
    )
}
