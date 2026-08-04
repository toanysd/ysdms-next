'use client'

import React, { useState, useMemo } from 'react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { useTranslations } from 'next-intl'
import { EnrichedPendingItem } from '@/types/loading-board'

type UrgencyTab = 'URGENT' | 'SOON' | 'RELAXED' | 'ALL'

export default function OrderSelectionModal({
    pendingItems,
    selectedOrders,
    selectedCell,
    machineCode,
    onToggle,
    onConfirm,
    onClose,
    isSubmitting
}: {
    pendingItems: EnrichedPendingItem[]
    selectedOrders: string[]
    selectedCell: any
    machineCode?: string
    onToggle: (id: string) => void
    onConfirm: () => void
    onClose: () => void
    isSubmitting: boolean
}) {
    const t = useTranslations('Planning.OrderSelection')
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<UrgencyTab>('URGENT')
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
    const [activeDetailItemId, setActiveDetailItemId] = useState<string | null>(null)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate item urgencies and filter by search term
    const processedItems = useMemo(() => {
        const normalize = (str: string) => {
            if (!str) return ''
            return str.toLowerCase()
                .replace(/[\s\-_]+/g, '')
                .normalize('NFKC')
        }

        return pendingItems.map(item => {
            let urgency: UrgencyTab = 'ALL'
            let diffDays = 999
            
            if (item.detail?.delivery_date) {
                const dDate = parseISO(item.detail.delivery_date)
                diffDays = differenceInDays(dDate, today)
                if (diffDays <= 3) urgency = 'URGENT'
                else if (diffDays <= 7) urgency = 'SOON'
                else urgency = 'RELAXED'
            }

            return { ...item, _urgency: urgency, _diffDays: diffDays }
        }).filter(item => {
            if (!searchTerm) return true
            
            const q = normalize(searchTerm)
            const pn = normalize(item.detail?.product_pn_raw || '')
            const slip = normalize(item.detail?.orders?.slip_no || '')
            const customer = normalize(item.detail?.orders?.customers?.name || (item.detail?.product_master as any)?.customer_code || '')
            
            return pn.includes(q) || slip.includes(q) || customer.includes(q)
        })
    }, [pendingItems, searchTerm, today])

    // Tab Counts
    const tabCounts = useMemo(() => {
        const counts = { URGENT: 0, SOON: 0, RELAXED: 0, ALL: processedItems.length }
        processedItems.forEach(i => {
            if (i._urgency === 'URGENT') counts.URGENT++
            else if (i._urgency === 'SOON') counts.SOON++
            else if (i._urgency === 'RELAXED') counts.RELAXED++
        })
        return counts
    }, [processedItems])

    // Filter by Tab and Group by Prefix
    const groupedItems = useMemo(() => {
        const filtered = processedItems.filter(i => activeTab === 'ALL' || i._urgency === activeTab)
        
        filtered.sort((a, b) => a._diffDays - b._diffDays)

        const groups: Record<string, typeof filtered> = {}
        filtered.forEach(item => {
            const raw = item.detail?.product_pn_raw || 'UNKNOWN'
            const firstPart = raw.split('-')[0]
            const prefix = isNaN(Number(firstPart)) ? firstPart : '(数字系)'
            
            if (!groups[prefix]) groups[prefix] = []
            groups[prefix].push(item)
        })
        return groups
    }, [processedItems, activeTab])

    const activeDetailItem = processedItems.find(i => i.order_item_id === activeDetailItemId)

    const headerText = selectedCell 
        ? t('addPlanToMachine', { machine: machineCode || '', date: format(parseISO(selectedCell.dateStr), 'MM/dd') }) 
        : t('unplannedOrders')

    const handleToggleGroup = (prefix: string) => {
        setExpandedGroups(prev => ({ ...prev, [prefix]: prev[prefix] === false ? true : false }))
    }

    const handleSelectGroup = (items: EnrichedPendingItem[]) => {
        const allSelected = items.every(i => selectedOrders.includes(i.order_item_id))
        items.forEach(item => {
            if (allSelected) {
                if (selectedOrders.includes(item.order_item_id)) onToggle(item.order_item_id)
            } else {
                if (!selectedOrders.includes(item.order_item_id)) onToggle(item.order_item_id)
            }
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-start pt-[7.5vh] animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-[95vw] max-w-6xl max-h-[85vh] h-[85vh] bg-[var(--bg-surface)] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[var(--border-default)]"
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex flex-col p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] shrink-0 gap-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-[var(--accent)] flex items-center gap-2">
                                {headerText}
                            </h2>
                            <div className="text-sm text-[var(--text-muted)] mt-1 font-semibold">
                                {t('unplannedOrders')}: <span className="font-bold text-[var(--accent)] font-mono">{pendingItems.length}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] p-2 rounded-full transition-colors focus:outline-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)]">🔍</span>
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input w-full text-sm pl-9 pr-3 py-2 shadow-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* URGENCY TABS */}
                <div className="flex bg-[var(--bg-surface-2)] border-b border-[var(--border-default)] shrink-0 overflow-x-auto hide-scrollbar">
                    <button 
                        onClick={() => setActiveTab('URGENT')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'URGENT' ? 'border-[var(--status-error)] text-[var(--status-error)] bg-[var(--bg-surface)]' : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]'}`}
                    >
                        🔴 {t('urgency.urgent')}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${activeTab === 'URGENT' ? 'badge badge--error font-bold' : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]'}`}>{tabCounts.URGENT}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('SOON')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'SOON' ? 'border-[var(--status-warning)] text-[var(--status-warning)] bg-[var(--bg-surface)]' : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]'}`}
                    >
                        🟡 {t('urgency.soon')}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${activeTab === 'SOON' ? 'badge badge--warning font-bold' : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]'}`}>{tabCounts.SOON}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('RELAXED')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'RELAXED' ? 'border-[var(--status-success)] text-[var(--status-success)] bg-[var(--bg-surface)]' : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]'}`}
                    >
                        🟢 {t('urgency.relaxed')}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${activeTab === 'RELAXED' ? 'badge badge--success font-bold' : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]'}`}>{tabCounts.RELAXED}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'ALL' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-surface)]' : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]'}`}
                    >
                        📋 {t('urgency.all')}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${activeTab === 'ALL' ? 'badge badge--info font-bold' : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]'}`}>{tabCounts.ALL}</span>
                    </button>
                </div>

                {/* MAIN AREA (List + Detail) */}
                <div className="flex-1 flex overflow-hidden bg-[var(--bg-surface-2)]">
                    
                    {/* LEFT: ORDER LIST */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {Object.entries(groupedItems).map(([prefix, items]) => {
                            const isExpanded = expandedGroups[prefix] !== false
                            const groupSelectedCount = items.filter(i => selectedOrders.includes(i.order_item_id)).length
                            const allSelected = items.length > 0 && groupSelectedCount === items.length

                            return (
                                <div key={prefix} className="bg-[var(--bg-surface)] rounded border border-[var(--border-default)] shadow-sm overflow-hidden">
                                    {/* Group Header */}
                                    <div 
                                        className="bg-[var(--bg-surface-2)] flex items-center px-3 py-2 cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-colors"
                                        onClick={() => handleToggleGroup(prefix)}
                                    >
                                        <div className="mr-3" onClick={e => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                checked={allSelected}
                                                onChange={() => handleSelectGroup(items)} 
                                                className="w-4 h-4 text-[var(--accent)] rounded border-[var(--border-default)] focus:ring-[var(--accent)] cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1 font-bold text-[15px] text-[var(--accent)] flex items-center gap-2 font-mono">
                                            <span className={`transform transition-transform text-xs text-[var(--text-muted)] ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                                            {prefix}
                                            <span className="text-[var(--text-muted)] text-sm font-normal">({items.length})</span>
                                            {groupSelectedCount > 0 && (
                                                <span className="ml-2 badge badge--warning font-mono">
                                                    {t('selectedCount', { count: groupSelectedCount })}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Item List (Cards) */}
                                    {isExpanded && (
                                        <div className="flex flex-col divide-y divide-[var(--border-default)]">
                                            {items.map(item => {
                                                const isSelected = selectedOrders.includes(item.order_item_id)
                                                const isActiveDetail = activeDetailItemId === item.order_item_id
                                                
                                                const pnRaw = item.detail?.product_pn_raw || '—'
                                                const slipNo = item.detail?.orders?.slip_no || '—'
                                                const customer = item.detail?.orders?.customers?.name || (item.detail?.product_master as any)?.customer_code || '—'
                                                
                                                const mat = item.detail?.product_master?.material || ''
                                                const thick = item.detail?.product_master?.thickness || ''
                                                const pLen = item.detail?.product_master?.p_length || ''
                                                const pWid = item.detail?.product_master?.p_width || ''
                                                const materialDisplay = mat ? `${mat}${thick ? ` ${thick}t` : ''}` : '—'
                                                const sizeDisplay = pLen && pWid ? `${pLen}×${pWid}` : ''
                                                
                                                const qtyRemain = item.total_requested_qty - item.total_planned_qty
                                                
                                                let deliveryDisplay = '—'
                                                let badgeClass = 'badge badge--neutral'
                                                if (item.detail?.delivery_date) {
                                                    deliveryDisplay = format(parseISO(item.detail.delivery_date), 'MM/dd')
                                                    if (item._urgency === 'URGENT') badgeClass = 'badge badge--error font-bold'
                                                    else if (item._urgency === 'SOON') badgeClass = 'badge badge--warning font-bold'
                                                    else badgeClass = 'badge badge--success'
                                                }

                                                return (
                                                    <div 
                                                        key={item.order_item_id}
                                                        onClick={() => setActiveDetailItemId(item.order_item_id)}
                                                        className={`flex flex-col p-3 cursor-pointer transition-colors border-l-4 ${isSelected ? 'bg-[var(--tint-amber-bg)] border-l-[var(--status-warning)]' : isActiveDetail ? 'bg-[var(--tint-teal-bg)] border-l-[var(--accent)]' : 'bg-[var(--bg-surface)] border-l-transparent hover:bg-[var(--bg-surface-hover)]'}`}
                                                    >
                                                        {/* Line 1 */}
                                                        <div className="flex items-center gap-3">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isSelected}
                                                                onChange={() => onToggle(item.order_item_id)} 
                                                                className="w-4 h-4 text-[var(--accent)] rounded border-[var(--border-default)] focus:ring-[var(--accent)] cursor-pointer"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <div className="font-bold text-[15px] text-[var(--accent)] font-mono truncate w-[160px]" title={pnRaw}>{pnRaw}</div>
                                                            <div className="flex-1 font-mono font-bold text-[var(--text-primary)] text-[14px]">
                                                                {qtyRemain.toLocaleString()} <span className="text-[11px] font-normal text-[var(--text-muted)]">{t('pcsRemaining')}</span>
                                                            </div>
                                                            <div className={`text-[12px] font-mono px-2 py-0.5 rounded border ${badgeClass}`}>
                                                                {t('deliveryDate')}: {deliveryDisplay}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Line 2 */}
                                                        <div className="ml-7 mt-1.5 flex flex-wrap gap-4 text-[12px] text-[var(--text-muted)]">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[var(--text-muted)]">{t('slipNo')}</span> 
                                                                <span className="font-mono font-bold text-[var(--text-primary)]">{slipNo}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[var(--text-muted)]">{t('customer')}</span> 
                                                                <span className="font-bold text-[var(--text-primary)] truncate max-w-[150px]">{customer}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[var(--text-muted)]">{t('materialSize')}</span> 
                                                                <span className="text-[var(--text-primary)] bg-[var(--bg-surface-2)] px-1 rounded font-mono">{materialDisplay} {sizeDisplay}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {Object.keys(groupedItems).length === 0 && (
                            <div className="text-center p-10 text-[var(--text-muted)]">
                                {t('noMatchingOrders')}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DETAIL PANEL */}
                    <div className={`w-[320px] bg-[var(--bg-surface)] border-l border-[var(--border-default)] shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col ${activeDetailItemId ? 'translate-x-0' : 'translate-x-full hidden'}`}>
                        {activeDetailItem ? (
                            <div className="p-4 flex flex-col h-full overflow-y-auto">
                                {/* Header */}
                                <div className="border-b border-[var(--border-default)] pb-3 mb-4">
                                    <h3 className="font-bold text-[16px] text-[var(--accent)] font-mono mb-1">{activeDetailItem.detail?.product_pn_raw}</h3>
                                    <p className="text-sm text-[var(--text-muted)]">{t('customer')} <span className="font-bold text-[var(--text-primary)]">{activeDetailItem.detail?.orders?.customers?.name || (activeDetailItem.detail?.product_master as any)?.customer_code}</span></p>
                                </div>

                                {/* Spec */}
                                <div className="bg-[var(--bg-surface-2)] rounded p-3 mb-4 text-sm border border-[var(--border-default)]">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="text-[var(--text-muted)]">{t('spec.material')}</div>
                                        <div className="font-bold text-right font-mono text-[var(--text-primary)]">{activeDetailItem.detail?.product_master?.material || '—'}</div>
                                        
                                        <div className="text-[var(--text-muted)]">{t('spec.thickness')}</div>
                                        <div className="font-bold text-right font-mono text-[var(--text-primary)]">{activeDetailItem.detail?.product_master?.thickness ? `${activeDetailItem.detail.product_master.thickness}t` : '—'}</div>
                                        
                                        <div className="text-[var(--text-muted)]">{t('spec.size')}</div>
                                        <div className="font-bold text-right font-mono text-[var(--text-primary)]">{activeDetailItem.detail?.product_master?.p_length && activeDetailItem.detail?.product_master?.p_width ? `${activeDetailItem.detail.product_master.p_length} × ${activeDetailItem.detail.product_master.p_width}` : '—'}</div>
                                    </div>
                                </div>

                                {/* History Skeleton */}
                                <div className="flex-1">
                                    <h4 className="font-bold text-[13px] text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                        📋 {t('history.title')}
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="animate-pulse bg-[var(--bg-surface-2)] h-16 rounded border border-[var(--border-default)] p-2 flex flex-col gap-2">
                                            <div className="bg-[var(--border-default)] h-3 w-1/2 rounded"></div>
                                            <div className="bg-[var(--border-default)] h-3 w-3/4 rounded"></div>
                                        </div>
                                        <p className="text-xs text-center text-[var(--text-muted)] mt-2 italic">{t('history.loading')}</p>
                                    </div>
                                </div>
                                
                                {/* Recommendation */}
                                <div className="mt-4 pt-3 border-t border-[var(--border-default)]">
                                    <p className="text-[13px] text-[var(--text-muted)]">💡 {t('recommendedMachine')} <span className="font-bold text-[var(--accent)]">N/A</span></p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-center text-[var(--text-muted)] mt-10">
                                {t('selectOrderHint')}
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] shrink-0">
                    <div className="text-[14px]">
                        <span className="font-bold font-mono text-lg" style={{ color: selectedOrders.length > 0 ? 'var(--status-warning)' : 'var(--text-muted)' }}>
                            {selectedOrders.length}
                        </span> <span className="text-[var(--text-primary)] font-semibold">{t('selected')}</span>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="btn btn-secondary text-sm font-bold"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={selectedOrders.length === 0 || isSubmitting}
                            className={`btn ${selectedOrders.length === 0 ? 'btn-secondary text-[var(--text-muted)] cursor-not-allowed' : 'btn-primary'}`}
                        >
                            {isSubmitting ? t('addingToPlan') : t('addToPlan')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

