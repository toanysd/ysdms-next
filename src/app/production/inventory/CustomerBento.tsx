'use client'

import { useTranslations } from 'next-intl'

import React from 'react'
import { Building2 } from 'lucide-react'

interface CustomerStat {
    customer_code: string
    txn_count: number
    total_qty: number
}

export default function CustomerBento({ customers }: { customers: CustomerStat[] }) {
  const t = useTranslations()
    if (!customers || customers.length === 0) return null

    // Color palette for bento cells
    const palette = [
        { bg: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)', border: '#4dd0e1', text: '#00695c' },
        { bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', border: '#66bb6a', text: '#2e7d32' },
        { bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', border: '#ffb74d', text: '#e65100' },
        { bg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', border: '#42a5f5', text: '#1565c0' },
        { bg: 'linear-gradient(135deg, #fce4ec, #f8bbd0)', border: '#ec407a', text: '#ad1457' },
    ]

    return (
        <div className="mt-4">
            <h3 className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--mcs-text-secondary)' }}>
                <Building2 size={14} />
                {t('Common.topKhNhapHomNay')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {customers.map((c, i) => {
                    const p = palette[i % palette.length]
                    return (
                        <div
                            key={c.customer_code}
                            className="rounded-lg p-3 border shadow-sm transition-transform hover:scale-[1.03]"
                            style={{
                                background: p.bg,
                                borderColor: p.border,
                                borderLeftWidth: '3px',
                            }}
                        >
                            <div className="font-black text-sm tracking-wide" style={{ color: p.text }}>
                                {c.customer_code}
                            </div>
                            <div className="font-mono font-bold text-lg mt-1" style={{ color: p.text }}>
                                {c.total_qty.toLocaleString()}
                                <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--mcs-text-muted)' }}>pcs</span>
                            </div>
                            <div className="text-[10px] mt-0.5" style={{ color: 'var(--mcs-text-muted)' }}>
                                {c.txn_count} 回入庫
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
