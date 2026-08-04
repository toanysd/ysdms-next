'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO, addDays, addMonths, subDays, subMonths } from 'date-fns'
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

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
    const t = useTranslations('Planning.Toolbar')
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

    return (
        <div className="flex h-[44px] items-center px-3 gap-2 bg-[var(--bg-surface)] border-b border-[var(--border-default)] shadow-sm shrink-0">
            {/* BRAND */}
            <div className="flex-shrink-0 flex items-center pr-4 border-r border-[var(--border-default)]">
                <span className="font-bold text-[14px] text-[var(--text-primary)] tracking-wider">{t('title')}</span>
            </div>

            {/* DATE NAV */}
            <div className="flex-1 flex items-center justify-center gap-4">
                <div className="flex items-center bg-[var(--bg-surface-2)] rounded border border-[var(--border-default)] overflow-hidden shadow-sm">
                    <button onClick={() => handleNavigate('prev')} className="p-1.5 hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-r border-[var(--border-default)]">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="px-2 py-0.5 font-bold text-[13px] text-[var(--accent)] text-center font-mono flex items-center justify-center gap-1">
                        <input 
                            type="date" 
                            value={localStart}
                            onChange={(e) => setLocalStart(e.target.value)}
                            onBlur={() => commitDateChange('start')}
                            onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('start') }}
                            className="bg-transparent border border-transparent hover:border-[var(--border-default)] focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] rounded px-1.5 py-1 outline-none cursor-text transition-colors text-[var(--text-primary)]"
                        />
                        <span className="text-[var(--text-muted)]">〜</span>
                        <input 
                            type="date" 
                            value={localEnd}
                            onChange={(e) => setLocalEnd(e.target.value)}
                            onBlur={() => commitDateChange('end')}
                            onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('end') }}
                            className="bg-transparent border border-transparent hover:border-[var(--border-default)] focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] rounded px-1.5 py-1 outline-none cursor-text transition-colors text-[var(--text-primary)]"
                        />
                    </div>
                    <button onClick={() => handleNavigate('next')} className="p-1.5 hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-l border-[var(--border-default)]">
                        <ChevronRight size={16} />
                    </button>
                </div>
                
                <button onClick={() => handleNavigate('today')} className="btn btn-secondary py-1 text-[12px] font-bold">
                    {t('today')}
                </button>
            </div>

            {/* VIEW MODE SELECTOR */}
            <div className="flex-shrink-0 flex items-center bg-[var(--bg-surface-2)] rounded p-0.5 border border-[var(--border-default)] shadow-inner">
                {(['day', 'week1', 'week2', 'month'] as ViewMode[]).map(mode => {
                    const isActive = viewMode === mode
                    const modeKeyMap: Record<ViewMode, 'day' | 'week1' | 'week2' | 'month'> = { day: 'day', week1: 'week1', week2: 'week2', month: 'month' }
                    return (
                        <button 
                            key={mode}
                            onClick={() => handleChangeViewMode(mode)}
                            className={`px-3 py-1 rounded-[3px] text-[12px] font-bold transition-all ${isActive ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'}`}
                        >
                            {t(modeKeyMap[mode])}
                        </button>
                    )
                })}
            </div>

            {/* DISPLAY TOGGLE */}
            <div className="flex-shrink-0 flex items-center gap-1 pl-2 ml-1 border-l border-[var(--border-default)]">
                <button 
                    onClick={() => handleChangeDisplay('list')}
                    className={`p-1.5 rounded transition-colors ${activeView === 'list' ? 'bg-[var(--tint-teal-bg)] text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'}`}
                    title={t('listView')}
                >
                    <List size={18} />
                </button>
                <button 
                    onClick={() => handleChangeDisplay('grid')}
                    className={`p-1.5 rounded transition-colors ${activeView === 'grid' ? 'bg-[var(--tint-teal-bg)] text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'}`}
                    title={t('gridView')}
                >
                    <LayoutGrid size={18} />
                </button>
            </div>
        </div>
    )
}

