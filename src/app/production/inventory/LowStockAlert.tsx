'use client'

import React from 'react'
import { AlertTriangle, TrendingDown, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LowStockAlert({ data }: { data: any[] }) {
    const t = useTranslations('Inventory')
    const CRITICAL_STOCK = 20
    const LOW_STOCK = 50

    // Filter items below LOW_STOCK threshold
    const lowStockItems = data.filter(item => (item.current_stock || 0) < LOW_STOCK)

    if (lowStockItems.length === 0) {
        return (
            <div className="p-10 text-center">
                <div className="bg-[var(--tint-teal-bg)] text-[var(--status-success)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border-default)]">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-[var(--status-success)]">{t('safeStockTitle')}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                    {t('safeStockDesc', { min: LOW_STOCK })}
                </p>
                <div className="mt-6 text-xs text-[var(--text-muted)]">
                    * {t('safeStockNote', { min: LOW_STOCK })}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="bg-[var(--bg-error)] border border-[var(--status-error)]/30 rounded-md p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="text-[var(--status-error)] mt-0.5 shrink-0" size={20} />
                <div>
                    <h3 className="text-[var(--status-error)] font-bold text-base">{t('lowStockTitle')}</h3>
                    <p className="text-sm text-[var(--text-primary)] mt-1">
                        {t('lowStockDesc', { min: LOW_STOCK })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {lowStockItems.map(item => {
                    const stock = item.current_stock || 0
                    const isCritical = stock < CRITICAL_STOCK

                    return (
                        <div key={item.product_id} className={`card-flat p-4 relative overflow-hidden ${isCritical ? 'border-[var(--status-error)]/40 bg-[var(--bg-error)]/40' : 'border-[var(--status-warning)]/40 bg-[var(--tint-orange-bg)]/40'}`}>
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${isCritical ? 'bg-[var(--status-error)]' : 'bg-[var(--status-warning)]'}`}></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                                <div>
                                    <h4 className="font-mono font-bold text-[14px] text-[var(--text-primary)]">{item.product_code}</h4>
                                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{item.product_name}</p>
                                </div>
                                <div className={`font-mono font-bold text-sm px-2.5 py-1 rounded flex items-center gap-1 ${isCritical ? 'bg-[var(--bg-error)] text-[var(--status-error)]' : 'bg-[var(--tint-orange-bg)] text-[var(--status-warning)]'}`}>
                                    <TrendingDown size={14} /> {stock}
                                </div>
                            </div>
                            <div className="pl-2 mt-3 flex items-center justify-between">
                                {isCritical ? (
                                    <span className="badge badge--error font-bold text-[11px]">
                                        {t('criticalBadge')}
                                    </span>
                                ) : (
                                    <span className="badge badge--warning font-bold text-[11px]">
                                        {t('warningBadge')}
                                    </span>
                                )}
                                <span className={`text-xs font-mono font-bold ${isCritical ? 'text-[var(--status-error)]' : 'text-[var(--status-warning)]'}`}>
                                    {t('deficit', { count: LOW_STOCK - stock })}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            <div className="p-3 bg-[var(--bg-surface-2)] text-xs text-[var(--text-muted)] border border-[var(--border-default)] rounded-md">
                <strong>* {t('systemNoteHeader')}:</strong><br/>
                - {t('criticalThresholdNote', { count: CRITICAL_STOCK })}<br/>
                - {t('lowThresholdNote', { count: LOW_STOCK })}
            </div>
        </div>
    )
}

