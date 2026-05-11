'use client'

import React from 'react'
import { Package, ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'

interface KPI {
    total_products: number
    total_stock: number
    today_in_count: number
    today_in_qty: number
    today_out_count: number
    today_out_qty: number
}

export default function InventoryKPIRow({ kpi }: { kpi: KPI | null }) {
    const cards = [
        {
            label: { ja: 'トレイ品目', vi: 'Loại Tray' },
            value: kpi?.total_products ?? 0,
            icon: <Package size={22} />,
            color: 'var(--mcs-text)',
            bgGradient: 'linear-gradient(135deg, var(--mcs-surface) 0%, var(--mcs-surface-2) 100%)',
            borderColor: 'var(--mcs-border-strong)',
        },
        {
            label: { ja: '本日入庫', vi: 'Nhập Hôm Nay' },
            value: kpi?.today_in_qty ?? 0,
            sub: `${kpi?.today_in_count ?? 0} 回`,
            icon: <ArrowDownRight size={22} />,
            color: 'var(--mcs-success)',
            bgGradient: 'linear-gradient(135deg, var(--mcs-success-light) 0%, #d5f5e3 100%)',
            borderColor: 'var(--mcs-success)',
        },
        {
            label: { ja: '本日出庫', vi: 'Xuất Hôm Nay' },
            value: kpi?.today_out_qty ?? 0,
            sub: `${kpi?.today_out_count ?? 0} 回`,
            icon: <ArrowUpRight size={22} />,
            color: 'var(--mcs-info)',
            bgGradient: 'linear-gradient(135deg, var(--mcs-info-light) 0%, #d4e6f1 100%)',
            borderColor: 'var(--mcs-info)',
        },
        {
            label: { ja: '総在庫数', vi: 'Tổng Tồn Kho' },
            value: kpi?.total_stock ?? 0,
            icon: <TrendingUp size={22} />,
            color: 'var(--mcs-primary)',
            bgGradient: 'linear-gradient(135deg, var(--mcs-primary-light) 0%, #b2dfdb 100%)',
            borderColor: 'var(--mcs-primary)',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className="relative rounded-xl p-4 shadow-sm border overflow-hidden transition-transform hover:scale-[1.02]"
                    style={{
                        background: card.bgGradient,
                        borderColor: card.borderColor,
                        borderLeftWidth: '4px',
                    }}
                >
                    {/* Icon background watermark */}
                    <div className="absolute -right-2 -bottom-2 opacity-[0.07]" style={{ color: card.color }}>
                        {React.cloneElement(card.icon, { size: 72 })}
                    </div>

                    <div className="flex items-center gap-2 mb-2" style={{ color: card.color }}>
                        {card.icon}
                        <div>
                            <span className="text-xs font-bold block" style={{ color: card.color }}>{card.label.ja}</span>
                            <span className="text-[10px] block" style={{ color: 'var(--mcs-text-muted)' }}>{card.label.vi}</span>
                        </div>
                    </div>

                    <div className="font-mono font-black text-2xl tracking-tight" style={{ color: card.color }}>
                        {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </div>

                    {card.sub && (
                        <div className="text-[11px] font-medium mt-1" style={{ color: 'var(--mcs-text-secondary)' }}>
                            {card.sub}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
