'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO, addDays, addMonths, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns'
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react'

type ViewMode = 'day' | 'week1' | 'week2' | 'month'

export default function CompactPlanningToolbar({
    currentDate,
    viewMode,
    activeView
}: {
    currentDate: string
    viewMode: ViewMode
    activeView: 'grid' | 'list'
}) {
    const router = useRouter()
    const current = parseISO(currentDate)

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        let newDate = current
        if (direction === 'today') {
            newDate = new Date()
        } else {
            const isNext = direction === 'next'
            switch (viewMode) {
                case 'day':
                    newDate = isNext ? addDays(current, 1) : subDays(current, 1)
                    break
                case 'week1':
                    newDate = isNext ? addDays(current, 7) : subDays(current, 7)
                    break
                case 'week2':
                    newDate = isNext ? addDays(current, 14) : subDays(current, 14)
                    break
                case 'month':
                    newDate = isNext ? addMonths(current, 1) : subMonths(current, 1)
                    newDate = startOfMonth(newDate) // always go to start of that month
                    break
            }
        }
        
        router.push(`?date=${format(newDate, 'yyyy-MM-dd')}&view=${viewMode}&display=${activeView}`)
    }

    const handleChangeViewMode = (mode: ViewMode) => {
        router.push(`?date=${currentDate}&view=${mode}&display=${activeView}`)
    }

    const handleChangeDisplay = (display: 'grid' | 'list') => {
        router.push(`?date=${currentDate}&view=${viewMode}&display=${display}`)
    }

    // Format date text based on viewMode
    let dateText = ''
    if (viewMode === 'day') {
        dateText = format(current, 'yyyy年MM月dd日')
    } else if (viewMode === 'week1') {
        dateText = `${format(current, 'yyyy年MM月dd日')} 〜 ${format(addDays(current, 6), 'MM月dd日')}`
    } else if (viewMode === 'week2') {
        dateText = `${format(current, 'yyyy年MM月dd日')} 〜 ${format(addDays(current, 13), 'MM月dd日')}`
    } else if (viewMode === 'month') {
        const start = startOfMonth(current)
        const end = endOfMonth(current)
        dateText = `${format(start, 'yyyy年MM月')} (${format(start, 'dd')} 〜 ${format(end, 'dd')})`
    }

    return (
        <div className="flex h-[44px] items-center px-3 gap-2 bg-[var(--mcs-surface)] border-b border-[var(--mcs-border-strong)] shadow-sm shrink-0">
            {/* BRAND */}
            <div className="flex-shrink-0 flex items-center pr-4 border-r border-[var(--mcs-border)]">
                <span className="font-bold text-[14px] text-[var(--mcs-text)] tracking-wider">生産計画</span>
            </div>

            {/* DATE NAV */}
            <div className="flex-1 flex items-center justify-center gap-4">
                <div className="flex items-center bg-[var(--mcs-surface-2)] rounded border border-[var(--mcs-border)] overflow-hidden shadow-sm">
                    <button onClick={() => handleNavigate('prev')} className="p-1.5 hover:bg-[var(--mcs-surface-hover)] text-gray-500 hover:text-gray-800 transition-colors border-r border-[var(--mcs-border)]">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="px-3 py-1 font-bold text-[13px] text-[var(--mcs-primary)] min-w-[140px] text-center font-mono">
                        {dateText}
                    </div>
                    <button onClick={() => handleNavigate('next')} className="p-1.5 hover:bg-[var(--mcs-surface-hover)] text-gray-500 hover:text-gray-800 transition-colors border-l border-[var(--mcs-border)]">
                        <ChevronRight size={16} />
                    </button>
                </div>
                
                <button onClick={() => handleNavigate('today')} className="px-3 py-1 bg-white border border-[var(--mcs-border)] rounded text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                    今日
                </button>
            </div>

            {/* VIEW MODE SELECTOR */}
            <div className="flex-shrink-0 flex items-center bg-[var(--mcs-surface-2)] rounded p-0.5 border border-[var(--mcs-border)] shadow-inner">
                {(['day', 'week1', 'week2', 'month'] as ViewMode[]).map(mode => {
                    const isActive = viewMode === mode
                    const labels: Record<ViewMode, string> = { day: '日', week1: '1週', week2: '2週', month: '月' }
                    return (
                        <button 
                            key={mode}
                            onClick={() => handleChangeViewMode(mode)}
                            className={`px-3 py-1 rounded-[3px] text-[12px] font-bold transition-all ${isActive ? 'bg-[var(--mcs-primary)] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-[var(--mcs-surface-hover)]'}`}
                        >
                            {labels[mode]}
                        </button>
                    )
                })}
            </div>

            {/* DISPLAY TOGGLE */}
            <div className="flex-shrink-0 flex items-center gap-1 pl-2 ml-1 border-l border-[var(--mcs-border)]">
                <button 
                    onClick={() => handleChangeDisplay('list')}
                    className={`p-1.5 rounded transition-colors ${activeView === 'list' ? 'bg-[var(--mcs-primary-light)] text-[var(--mcs-primary)]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    title="List View"
                >
                    <List size={18} />
                </button>
                <button 
                    onClick={() => handleChangeDisplay('grid')}
                    className={`p-1.5 rounded transition-colors ${activeView === 'grid' ? 'bg-[var(--mcs-primary-light)] text-[var(--mcs-primary)]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    title="Grid View"
                >
                    <LayoutGrid size={18} />
                </button>
            </div>
        </div>
    )
}
