'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Building2 } from 'lucide-react'

interface CustomerStat {
    customer_code: string
    txn_count: number
    total_qty: number
}

export default function CustomerBento({ customers }: { customers: CustomerStat[] }) {
  const t = useTranslations('Inventory')
    if (!customers || customers.length === 0) return null

    // Color palette for bento cells using visual anchor tints
    const palette = [
        { bg: 'var(--tint-teal-bg)', border: 'var(--accent)', text: 'var(--text-primary)' },
        { bg: 'var(--tint-blue-bg)', border: 'var(--status-info)', text: 'var(--text-primary)' },
        { bg: 'var(--tint-orange-bg)', border: 'var(--status-warning)', text: 'var(--text-primary)' },
        { bg: 'var(--tint-purple-bg)', border: 'var(--accent-purple, #8b5cf6)', text: 'var(--text-primary)' },
    ]

    return (
        <div className="mt-4">
            <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-[var(--text-muted)]">
                <Building2 size={14} className="text-[var(--accent)]" />
                {t('topCustomersToday')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {customers.map((c, i) => {
                    const p = palette[i % palette.length]
                    return (
                        <div
                            key={c.customer_code}
                            className="rounded-lg p-3 border shadow-sm transition-transform hover:scale-[1.02]"
                            style={{
                                background: p.bg,
                                borderColor: p.border,
                                borderLeftWidth: '4px',
                            }}
                        >
                            <div className="font-mono font-bold text-sm tracking-wide text-[var(--accent)]">
                                {c.customer_code}
                            </div>
                            <div className="font-mono font-bold text-lg mt-1 text-[var(--text-primary)]">
                                {c.total_qty.toLocaleString()}
                                <span className="text-[11px] font-semibold ml-1 text-[var(--text-muted)]">pcs</span>
                            </div>
                            <div className="text-[11px] mt-0.5 font-semibold text-[var(--text-muted)]">
                                {c.txn_count} {t('timesImported')}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

