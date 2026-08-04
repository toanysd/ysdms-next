'use client'

import React from 'react'
import { Package, ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface KPI {
    total_products: number
    total_stock: number
    today_in_count: number
    today_in_qty: number
    today_out_count: number
    today_out_qty: number
}

export default function InventoryKPIRow({ kpi }: { kpi: KPI | null }) {
    const t = useTranslations('Inventory')

    const cards = [
        {
            title: t('kpiTotalTypes'),
            value: kpi?.total_products ?? 0,
            icon: <Package size={22} className="text-[var(--accent)]" />,
            color: 'var(--text-primary)',
            bg: 'var(--bg-surface-2)',
            borderColor: 'var(--border-default)',
        },
        {
            title: t('kpiTodayIn'),
            value: kpi?.today_in_qty ?? 0,
            sub: t('todayCount', { count: kpi?.today_in_count ?? 0 }),
            icon: <ArrowDownRight size={22} className="text-[var(--status-success)]" />,
            color: 'var(--status-success)',
            bg: 'var(--tint-teal-bg)',
            borderColor: 'var(--status-success)',
        },
        {
            title: t('kpiTodayOut'),
            value: kpi?.today_out_qty ?? 0,
            sub: t('todayCount', { count: kpi?.today_out_count ?? 0 }),
            icon: <ArrowUpRight size={22} className="text-[var(--status-info)]" />,
            color: 'var(--status-info)',
            bg: 'var(--tint-blue-bg)',
            borderColor: 'var(--status-info)',
        },
        {
            title: t('kpiTotalStock'),
            value: kpi?.total_stock ?? 0,
            icon: <TrendingUp size={22} className="text-[var(--accent)]" />,
            color: 'var(--accent)',
            bg: 'var(--tint-orange-bg)',
            borderColor: 'var(--accent)',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className="relative rounded-xl p-4 shadow-sm border overflow-hidden transition-transform hover:scale-[1.01]"
                    style={{
                        background: card.bg,
                        borderColor: card.borderColor,
                        borderLeftWidth: '4px',
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        {card.icon}
                        <span className="text-xs font-bold block text-[var(--text-muted)]">{card.title}</span>
                    </div>

                    <div className="font-mono font-black text-2xl tracking-tight text-[var(--text-primary)]">
                        {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </div>

                    {card.sub && (
                        <div className="text-[11px] font-mono font-semibold mt-1 text-[var(--text-muted)]">
                            {card.sub}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

