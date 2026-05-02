'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO, addDays, addMonths, startOfMonth, endOfMonth, subDays, subMonths, startOfWeek } from 'date-fns'
import { LayoutGrid, List, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

type ViewMode = 'day' | 'week1' | 'week2' | 'month'

export default function CompactPlanningToolbar({
    currentDate,
    endDate,
    viewMode,
    activeView
}: {
    currentDate: string
    endDate: string
    viewMode: ViewMode | 'custom'
    activeView: 'grid' | 'list'
}) {
    const router = useRouter()
    const current = parseISO(currentDate)

    const [localStart, setLocalStart] = useState(currentDate)
    const [localEnd, setLocalEnd] = useState(endDate)

    useEffect(() => { setLocalStart(currentDate) }, [currentDate])
    useEffect(() => { setLocalEnd(endDate) }, [endDate])

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        let newStart = current
        let newEnd = parseISO(endDate)
        const duration = Math.round((newEnd.getTime() - newStart.getTime()) / (1000 * 3600 * 24)) + 1

        if (direction === 'today') {
            newStart = new Date()
            newEnd = addDays(newStart, duration - 1)
        } else {
            const isNext = direction === 'next'
            if (viewMode === 'month') {
                newStart = isNext ? addMonths(current, 1) : subMonths(current, 1)
                newEnd = isNext ? addMonths(parseISO(endDate), 1) : subMonths(parseISO(endDate), 1)
            } else {
                newStart = isNext ? addDays(current, duration) : subDays(current, duration)
                newEnd = isNext ? addDays(parseISO(endDate), duration) : subDays(parseISO(endDate), duration)
            }
        }
        
        router.push(`?date=${format(newStart, 'yyyy-MM-dd')}&endDate=${format(newEnd, 'yyyy-MM-dd')}&view=${viewMode}&display=${activeView}`)
    }

    const commitDateChange = (type: 'start' | 'end') => {
        const newStart = type === 'start' ? localStart : currentDate
        const newEnd = type === 'end' ? localEnd : endDate
        if (newStart === currentDate && newEnd === endDate) return;
        router.push(`?date=${newStart}&endDate=${newEnd}&view=custom&display=${activeView}`)
    }

    const handleChangeViewMode = (mode: ViewMode) => {
        router.push(`?date=${currentDate}&view=${mode}&display=${activeView}`)
    }

    const handleChangeDisplay = (display: 'grid' | 'list') => {
        router.push(`?date=${currentDate}&view=${viewMode}&display=${display}`)
    }

    // We do not need endDateText anymore because we show the input
    // but we can keep it empty or remove it.

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
                    <div className="px-2 py-0.5 font-bold text-[13px] text-[var(--mcs-primary)] text-center font-mono flex items-center justify-center gap-1">
                        <input 
                            type="date" 
                            value={localStart}
                            onChange={(e) => setLocalStart(e.target.value)}
                            onBlur={() => commitDateChange('start')}
                            onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('start') }}
                            className="bg-transparent border border-transparent hover:border-gray-300 focus:border-[var(--mcs-primary)] focus:bg-white rounded px-1.5 py-1 outline-none cursor-text transition-colors"
                        />
                        <span className="text-gray-500">〜</span>
                        <input 
                            type="date" 
                            value={localEnd}
                            onChange={(e) => setLocalEnd(e.target.value)}
                            onBlur={() => commitDateChange('end')}
                            onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('end') }}
                            className="bg-transparent border border-transparent hover:border-gray-300 focus:border-[var(--mcs-primary)] focus:bg-white rounded px-1.5 py-1 outline-none cursor-text transition-colors"
                        />
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
