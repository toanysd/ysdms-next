'use client'

import React, { useState, useMemo } from 'react'
import { format, parseISO, differenceInDays } from 'date-fns'
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
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<UrgencyTab>('URGENT')
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
    const [activeDetailItemId, setActiveDetailItemId] = useState<string | null>(null)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate item urgencies and filter by search term
    const processedItems = useMemo(() => {
        // Hàm chuẩn hóa chuỗi để search fuzzy
        const normalize = (str: string) => {
            if (!str) return ''
            return str.toLowerCase()
                .replace(/[\s\-_]+/g, '') // Bỏ khoảng trắng, gạch nối, gạch dưới
                .normalize('NFKC')        // Chuẩn hóa ký tự Unicode (tiếng Nhật fullwidth -> halfwidth)
        }

        return pendingItems.map(item => {
            let urgency: UrgencyTab = 'ALL'
            let diffDays = 999
            
            // Fix delivery_date mapping as requested
            if (item.detail?.delivery_date) {
                const dDate = parseISO(item.detail.delivery_date)
                diffDays = differenceInDays(dDate, today)
                if (diffDays <= 3) urgency = 'URGENT'
                else if (diffDays <= 7) urgency = 'SOON'
                else urgency = 'RELAXED'
            }

            return { ...item, _urgency: urgency, _diffDays: diffDays }
        }).filter(item => {
            // Search filter
            if (!searchTerm) return true
            
            const q = normalize(searchTerm)
            const pn = normalize(item.detail?.product_pn_raw || '')
            const slip = normalize(item.detail?.orders?.slip_no || '')
            const customer = normalize(item.detail?.orders?.customers?.name || item.detail?.product_master?.customer_code || '')
            
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

    // If URGENT tab is empty initially, we should probably auto-switch to ALL.
    // Handled in a simple effect if needed, but keeping user choice is fine.

    // Filter by Tab and Group by Prefix
    const groupedItems = useMemo(() => {
        const filtered = processedItems.filter(i => activeTab === 'ALL' || i._urgency === activeTab)
        
        // Sort inside group: Urgent first (diffDays asc)
        filtered.sort((a, b) => a._diffDays - b._diffDays)

        const groups: Record<string, typeof filtered> = {}
        filtered.forEach(item => {
            const raw = item.detail?.product_pn_raw || 'UNKNOWN'
            const firstPart = raw.split('-')[0]
            // Fix prefix logic
            const prefix = isNaN(Number(firstPart)) ? firstPart : '(数字系)'
            
            if (!groups[prefix]) groups[prefix] = []
            groups[prefix].push(item)
        })
        return groups
    }, [processedItems, activeTab])

    const activeDetailItem = processedItems.find(i => i.order_item_id === activeDetailItemId)

    const headerText = selectedCell ? `[🏭 ${machineCode}] [📅 ${format(parseISO(selectedCell.dateStr), 'MM/dd')}] への計画追加` : '未計画注文'

    const handleToggleGroup = (prefix: string) => {
        setExpandedGroups(prev => ({ ...prev, [prefix]: prev[prefix] === false ? true : false })) // Default is true (expanded) if undefined
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
                className="w-[95vw] max-w-6xl max-h-[85vh] h-[85vh] bg-[var(--mcs-bg)] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[var(--mcs-border-strong)]"
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex flex-col p-4 border-b border-[var(--mcs-border-strong)] bg-white shrink-0 gap-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-[var(--mcs-primary)] flex items-center gap-2">
                                {headerText}
                            </h2>
                            <div className="text-sm text-gray-500 mt-1">
                                未計画注文 (Chưa lên kế hoạch): <span className="font-bold text-[var(--mcs-primary)]">{pendingItems.length}件</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                        <input 
                            type="text" 
                            placeholder="品番・得意先・注文番号で検索... (Tìm mã khuôn, khách hàng, mã đơn)" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-sm pl-9 pr-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-[var(--mcs-primary)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* URGENCY TABS */}
                <div className="flex bg-gray-100 border-b border-[var(--mcs-border)] shrink-0 overflow-x-auto hide-scrollbar">
                    <button 
                        onClick={() => setActiveTab('URGENT')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'URGENT' ? 'border-red-500 text-red-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        🔴 至急 <span className="text-[11px] font-normal">(≤3日)</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>{tabCounts.URGENT}件</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('SOON')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'SOON' ? 'border-amber-500 text-amber-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        🟡 近日 <span className="text-[11px] font-normal">(4-7日)</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'SOON' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}`}>{tabCounts.SOON}件</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('RELAXED')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'RELAXED' ? 'border-emerald-500 text-emerald-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        🟢 余裕 <span className="text-[11px] font-normal">(&gt;7日)</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'RELAXED' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>{tabCounts.RELAXED}件</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'ALL' ? 'border-[var(--mcs-primary)] text-[var(--mcs-primary)] bg-white' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        📋 全て <span className="text-[11px] font-normal">(Tất cả)</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'ALL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{tabCounts.ALL}件</span>
                    </button>
                </div>

                {/* MAIN AREA (List + Detail) */}
                <div className="flex-1 flex overflow-hidden bg-gray-50">
                    
                    {/* LEFT: ORDER LIST */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {Object.entries(groupedItems).map(([prefix, items]) => {
                            const isExpanded = expandedGroups[prefix] !== false
                            const groupSelectedCount = items.filter(i => selectedOrders.includes(i.order_item_id)).length
                            const allSelected = items.length > 0 && groupSelectedCount === items.length

                            return (
                                <div key={prefix} className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
                                    {/* Group Header */}
                                    <div 
                                        className="bg-gray-100 flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors"
                                        onClick={() => handleToggleGroup(prefix)}
                                    >
                                        <div className="mr-3" onClick={e => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                checked={allSelected}
                                                onChange={() => handleSelectGroup(items)} 
                                                className="w-4 h-4 text-[var(--mcs-primary)] rounded border-gray-400 focus:ring-[var(--mcs-primary)] cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1 font-bold text-[15px] text-[var(--mcs-primary)] flex items-center gap-2">
                                            <span className={`transform transition-transform text-xs text-gray-500 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                                            {prefix}
                                            <span className="text-gray-500 text-sm font-normal">({items.length}件)</span>
                                            {groupSelectedCount > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                                    {groupSelectedCount}選択済
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Item List (Cards) */}
                                    {isExpanded && (
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            {items.map(item => {
                                                const isSelected = selectedOrders.includes(item.order_item_id)
                                                const isActiveDetail = activeDetailItemId === item.order_item_id
                                                
                                                const pnRaw = item.detail?.product_pn_raw || '—'
                                                const slipNo = item.detail?.orders?.slip_no || '—'
                                                const customer = item.detail?.orders?.customers?.name || item.detail?.product_master?.customer_code || '—'
                                                
                                                const mat = item.detail?.product_master?.material || ''
                                                const thick = item.detail?.product_master?.thickness || ''
                                                const pLen = item.detail?.product_master?.p_length || ''
                                                const pWid = item.detail?.product_master?.p_width || ''
                                                const materialDisplay = mat ? `${mat}${thick ? ` ${thick}t` : ''}` : '—'
                                                const sizeDisplay = pLen && pWid ? `${pLen}×${pWid}` : ''
                                                
                                                const qtyRemain = item.total_requested_qty - item.total_planned_qty
                                                
                                                let deliveryDisplay = '—'
                                                let badgeClass = 'bg-gray-100 text-gray-600 border-gray-200'
                                                if (item.detail?.delivery_date) {
                                                    deliveryDisplay = format(parseISO(item.detail.delivery_date), 'MM/dd')
                                                    if (item._urgency === 'URGENT') badgeClass = 'bg-red-50 text-red-600 border-red-200 font-bold'
                                                    else if (item._urgency === 'SOON') badgeClass = 'bg-amber-50 text-amber-600 border-amber-200 font-bold'
                                                    else badgeClass = 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                }

                                                return (
                                                    <div 
                                                        key={item.order_item_id}
                                                        onClick={() => setActiveDetailItemId(item.order_item_id)}
                                                        className={`flex flex-col p-3 cursor-pointer transition-colors border-l-4 ${isSelected ? 'bg-yellow-50/70 border-l-yellow-400' : isActiveDetail ? 'bg-blue-50 border-l-blue-400' : 'bg-white border-l-transparent hover:bg-gray-50'}`}
                                                    >
                                                        {/* Line 1 */}
                                                        <div className="flex items-center gap-3">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isSelected}
                                                                onChange={() => onToggle(item.order_item_id)} 
                                                                className="w-4 h-4 text-[var(--mcs-primary)] rounded border-gray-300 focus:ring-[var(--mcs-primary)] cursor-pointer"
                                                                onClick={(e) => e.stopPropagation()} // Let the row click handle detail, checkbox click handles select
                                                            />
                                                            <div className="font-bold text-[15px] text-teal-700 truncate w-[160px]" title={pnRaw}>{pnRaw}</div>
                                                            <div className="flex-1 font-mono font-bold text-gray-800">
                                                                {qtyRemain.toLocaleString()} <span className="text-[11px] font-normal text-gray-500">個残 (Còn)</span>
                                                            </div>
                                                            <div className={`text-[12px] px-2 py-0.5 rounded border ${badgeClass}`}>
                                                                納期: {deliveryDisplay}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Line 2 */}
                                                        <div className="ml-7 mt-1.5 flex flex-wrap gap-4 text-[12px] text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-400">注文番号:</span> 
                                                                <span className="font-mono font-bold text-gray-700">{slipNo}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-400">得意先:</span> 
                                                                <span className="font-bold text-gray-700 truncate max-w-[150px]">{customer}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-400">材質/寸法:</span> 
                                                                <span className="text-gray-700 bg-gray-100 px-1 rounded">{materialDisplay} {sizeDisplay}</span>
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
                            <div className="text-center p-10 text-gray-500">
                                条件に一致する注文がありません。(Không có đơn hàng phù hợp)
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DETAIL PANEL */}
                    <div className={`w-[320px] bg-white border-l border-gray-300 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col ${activeDetailItemId ? 'translate-x-0' : 'translate-x-full hidden'}`}>
                        {activeDetailItem ? (
                            <div className="p-4 flex flex-col h-full overflow-y-auto">
                                {/* Header */}
                                <div className="border-b border-gray-200 pb-3 mb-4">
                                    <h3 className="font-bold text-[16px] text-[var(--mcs-primary)] mb-1">{activeDetailItem.detail?.product_pn_raw}</h3>
                                    <p className="text-sm text-gray-600">得意先: <span className="font-bold">{activeDetailItem.detail?.orders?.customers?.name || activeDetailItem.detail?.product_master?.customer_code}</span></p>
                                </div>

                                {/* Spec */}
                                <div className="bg-gray-50 rounded p-3 mb-4 text-sm border border-gray-100">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="text-gray-500">材質 (Vật liệu)</div>
                                        <div className="font-bold text-right">{activeDetailItem.detail?.product_master?.material || '—'}</div>
                                        
                                        <div className="text-gray-500">厚み (Độ dày)</div>
                                        <div className="font-bold text-right">{activeDetailItem.detail?.product_master?.thickness ? `${activeDetailItem.detail.product_master.thickness}t` : '—'}</div>
                                        
                                        <div className="text-gray-500">サイズ (Kích thước)</div>
                                        <div className="font-bold text-right">{activeDetailItem.detail?.product_master?.p_length && activeDetailItem.detail?.product_master?.p_width ? `${activeDetailItem.detail.product_master.p_length} × ${activeDetailItem.detail.product_master.p_width}` : '—'}</div>
                                    </div>
                                </div>

                                {/* History Skeleton */}
                                <div className="flex-1">
                                    <h4 className="font-bold text-[13px] text-gray-700 mb-2 flex items-center gap-2">
                                        📋 生産履歴 (Lịch sử sản xuất)
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="animate-pulse bg-gray-100 h-16 rounded border border-gray-200 p-2 flex flex-col gap-2">
                                            <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                                            <div className="bg-gray-200 h-3 w-3/4 rounded"></div>
                                        </div>
                                        <div className="animate-pulse bg-gray-100 h-16 rounded border border-gray-200 p-2 flex flex-col gap-2">
                                            <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                                            <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
                                        </div>
                                        <p className="text-xs text-center text-gray-400 mt-2 italic">※ データを取得中... (Đang tải dữ liệu)</p>
                                    </div>
                                </div>
                                
                                {/* Recommendation */}
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <p className="text-[13px] text-gray-600">💡 推奨機械 (Máy đề xuất): <span className="font-bold text-teal-600">N/A</span></p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-400 mt-10">
                                詳細を見るには注文を選択してください。<br/>(Chọn một đơn hàng để xem chi tiết)
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between p-4 border-t border-[var(--mcs-border-strong)] bg-white shrink-0">
                    <div className="text-[14px]">
                        <span className={`font-bold ${selectedOrders.length > 0 ? 'text-yellow-600 text-lg' : 'text-gray-400'}`}>
                            {selectedOrders.length}件
                        </span> <span className="text-gray-600">選択中 (Đã chọn)</span>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 rounded text-sm font-bold text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            キャンセル (Hủy)
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={selectedOrders.length === 0 || isSubmitting}
                            className={`px-6 py-2 rounded text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${selectedOrders.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[var(--mcs-primary)] text-white hover:bg-[var(--mcs-primary-hover)] hover:shadow-md'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin text-lg leading-none">⏳</span> 処理中...
                                </>
                            ) : (
                                <>
                                    ✓ 計画に追加 (Thêm vào Lịch)
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
