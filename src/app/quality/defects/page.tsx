'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getNGStatistics } from '@/app/actions/quality'
import type { NGDetailLog } from '@/types/quality'
import { AlertTriangle, PackageX, Search } from 'lucide-react'

export default function DefectsDashboardPage() {
    const t = useTranslations('Quality')
    const [defects, setDefects] = useState<NGDetailLog[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        getNGStatistics().then(res => {
            if (res.data) {
                setDefects(res.data)
            }
        })
    }, [])

    const categoryKeys = ['dimension', 'appearance', 'material', 'packaging', 'other'] as const

    const categoryLabelMap: Record<string, string> = {
        dimension: t('categories.dimension'),
        appearance: t('categories.appearance'),
        material: t('categories.material'),
        packaging: t('categories.packaging'),
        other: t('categories.other')
    }

    const totalNG = defects.reduce((sum, d) => sum + (d.ng_qty || 0), 0)

    const categoryStats = defects.reduce((acc, d) => {
        const cat = d.ng_category || 'other'
        acc[cat] = (acc[cat] || 0) + (d.ng_qty || 0)
        return acc
    }, {} as Record<string, number>)

    const filteredDefects = defects.filter(d => {
        if (!searchQuery) return true
        const ins = d.inspections
        const prodName = ins?.production_lots?.production_orders?.products?.product_name || ''
        const lotNo = ins?.production_lots?.lot_no || ''
        const q = searchQuery.toLowerCase()
        return prodName.toLowerCase().includes(q) || lotNo.toLowerCase().includes(q)
    })

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-7xl mx-auto p-4 gap-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-[var(--tint-red-bg)] border border-[var(--mcs-border)] rounded-lg px-6 py-4 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 badge badge--error rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                            {t('defectsTitle')}
                        </h1>
                        <span className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                            {t('subtitle')}
                        </span>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="text-center">
                        <p className="text-[12px] font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                            {t('totalDefects')}
                        </p>
                        <p className="text-3xl font-black font-mono text-[var(--status-error)]">{totalNG}</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 shrink-0">
                {categoryKeys.map(cat => (
                    <div key={cat} className="card-flat p-4 flex flex-col items-center justify-center gap-1">
                        <span className="text-[12px] font-bold" style={{ color: 'var(--text-muted)' }}>
                            {categoryLabelMap[cat]}
                        </span>
                        <span className="text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>
                            {categoryStats[cat] || 0}
                        </span>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="card-flat flex-1 flex flex-col min-h-0">
                <div className="p-4 border-b border-[var(--mcs-border)] bg-[var(--tint-teal-bg)] flex justify-between items-center shrink-0">
                    <h2 className="font-bold flex items-center gap-2 text-[14px]" style={{ color: 'var(--text-primary)' }}>
                        <PackageX size={18} /> {t('defectHistory')}
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} size={16} />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input pl-9 pr-4 py-1.5 text-[13px] w-64"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="data-table w-full text-left">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 font-bold">{t('headers.inspectionDate')}</th>
                                <th className="px-6 py-3 font-bold">{t('headers.lotProduct')}</th>
                                <th className="px-6 py-3 font-bold">{t('headers.defectCategory')}</th>
                                <th className="px-6 py-3 font-bold text-center">{t('headers.ngQty')}</th>
                                <th className="px-6 py-3 font-bold">{t('headers.description')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDefects.length > 0 ? filteredDefects.map((d: NGDetailLog, i: number) => {
                                const ins = d.inspections
                                const prod = ins?.production_lots?.production_orders?.products
                                const lotNo = ins?.production_lots?.lot_no
                                const date = ins?.inspection_date
                                return (
                                    <tr key={i} className="border-b border-[var(--mcs-border)] hover:bg-[var(--tint-red-bg)]/20 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                                            {date || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold font-mono text-[13px]">
                                                <Link href={`/master/products?search=${encodeURIComponent(prod?.product_name || '')}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
                                                    {prod?.product_name || t('noProduct')}
                                                </Link>
                                            </div>
                                            <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                                Lot: {lotNo || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="badge badge--error text-[12px] font-bold">
                                                {categoryLabelMap[d.ng_category ?? 'other'] ?? d.ng_category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono font-bold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                                            {d.ng_qty}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] max-w-xs truncate" style={{ color: 'var(--text-primary)' }} title={d.ng_description ?? undefined}>
                                            {d.ng_description || '-'}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>
                                        {t('noDefects')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

