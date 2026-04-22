'use client'

import React, { useState, useEffect } from 'react'
import { searchProducts } from '@/app/actions/product'

interface Product {
    id: string; pn: string; customer_code: string; product_name: string;
    material?: string; thickness?: number; length_val?: number; width_val?: number;
    mold_code?: string;
}
interface Props {
    onSelect: (product: Product) => void
    onChangeText?: (val: string) => void
    defaultValue?: string
}

export function ProductSearchInput({ onSelect, onChangeText, defaultValue = '' }: Props) {
    const [query, setQuery] = useState(defaultValue)
    const [results, setResults] = useState<Product[]>([])
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Debounce effect 300ms
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Chỉ tìm nếu chuỗi có độ dài đủ và đang mở dropdown
            if (query && query.length >= 2 && open) {
                setIsLoading(true)
                try {
                    const data = await searchProducts(query)
                    setResults(data)
                } catch (err) {
                    console.error(err)
                } finally {
                    setIsLoading(false)
                }
            } else if (!query || query.length < 2) {
                setResults([])
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query, open, defaultValue])

    const handleSelect = (product: Product) => {
        // Ưu tiên hiển thị Mã Khách Hàng (Customer Code) cho quen mắt bộ phận Sale, nếu không có thì dùng PN nội bộ
        const displayVal = product.customer_code || product.pn || ''
        setQuery(displayVal)
        setResults([])
        setOpen(false)
        onSelect(product)
    }

    return (
        <div className="relative w-full h-[34px]">
            <input
                type="text"
                value={query}
                onFocus={() => {
                    if (query.length >= 2) setOpen(true)
                }}
                onChange={e => {
                    const val = e.target.value;
                    setQuery(val)
                    setOpen(true)
                    if (onChangeText) onChangeText(val)
                }}
                // Timeout 200ms để tránh click list bị blur đóng mất panel
                onBlur={() => setTimeout(() => setOpen(false), 200)}
                className="w-full h-full px-2 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500 font-mono font-bold text-teal-800"
                placeholder="型番入力... (Gõ P/N hoặc SMK...)"
                required
            />

            {open && (results.length > 0 || isLoading || query.length >= 2) && (
                <ul className="absolute left-0 z-50 w-[320px] bg-white border border-teal-200 rounded shadow-lg mt-1 max-h-56 overflow-auto">
                    {isLoading && (
                        <li className="px-3 py-2 text-sm text-[var(--mcs-text-muted)] italic flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            検索中... (Đang tìm...)
                        </li>
                    )}

                    {!isLoading && results.map(p => (
                        <li
                            key={p.id}
                            onClick={() => handleSelect(p)}
                            className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-mono font-bold text-emerald-700 text-[13px]">{p.customer_code || p.pn}</span>
                                <span className="text-[11px] text-[var(--mcs-text-muted)] mt-0.5">
                                    社内コード: <b className="text-teal-900">{p.pn}</b> - {p.product_name || '名称未設定'}
                                </span>
                            </div>
                        </li>
                    ))}
                    {!isLoading && results.length === 0 && query.length >= 2 && (
                        <li className="px-3 py-2 text-sm text-amber-600 bg-amber-50">該当データなし (Không tìm thấy)</li>
                    )}
                </ul>
            )}
        </div>
    )
}
