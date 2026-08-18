'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format, parseISO, addDays, addMonths, subDays, subMonths } from 'date-fns'
import { CalendarRange, ChevronLeft, ChevronRight, LayoutGrid, BarChart2, Filter, Search, Layers, Cpu } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type TimeframeMode = 'week1' | 'week2' | 'month' | 'custom'
export type ViewMode = 'gantt' | 'grid'
export type PerspectiveMode = 'machine' | 'job'
export type TrackFilter = 'ALL' | 'MOLD' | 'PLUG' | 'CUTTER'

interface ToolingScheduleToolbarProps {
    currentDate: string
    endDate: string
    timeframe: TimeframeMode
    activeView: ViewMode
    perspective: PerspectiveMode
    trackFilter: TrackFilter
    searchQuery: string
    totalJobsCount: number
    inProgressCount: number
    overdueCount: number
}

export default function ToolingScheduleToolbar({
    currentDate,
    endDate,
    timeframe,
    activeView,
    perspective,
    trackFilter,
    searchQuery,
    totalJobsCount,
    inProgressCount,
    overdueCount
}: ToolingScheduleToolbarProps) {
    const t = useTranslations('Equipment.Schedule')
    const router = useRouter()
    const current = parseISO(currentDate)

    const [localStart, setLocalStart] = useState(currentDate)
    const [localEnd, setLocalEnd] = useState(endDate)
    const [localSearch, setLocalSearch] = useState(searchQuery)

    useEffect(() => { setLocalStart(currentDate) }, [currentDate])
    useEffect(() => { setLocalEnd(endDate) }, [endDate])
    useEffect(() => { setLocalSearch(searchQuery) }, [searchQuery])

    const updateUrl = (params: {
        from?: string
        to?: string
        timeframe?: string
        view?: string
        perspective?: string
        track?: string
        search?: string
    }) => {
        const fromVal = params.from !== undefined ? params.from : currentDate
        const toVal = params.to !== undefined ? params.to : endDate
        const tfVal = params.timeframe !== undefined ? params.timeframe : timeframe
        const viewVal = params.view !== undefined ? params.view : activeView
        const persVal = params.perspective !== undefined ? params.perspective : perspective
        const trackVal = params.track !== undefined ? params.track : trackFilter
        const searchVal = params.search !== undefined ? params.search : localSearch

        const queryParams = new URLSearchParams()
        if (fromVal) queryParams.set('from', fromVal)
        if (toVal) queryParams.set('to', toVal)
        if (tfVal) queryParams.set('timeframe', tfVal)
        if (viewVal) queryParams.set('view', viewVal)
        if (persVal) queryParams.set('perspective', persVal)
        if (trackVal && trackVal !== 'ALL') queryParams.set('track', trackVal)
        if (searchVal.trim()) queryParams.set('search', searchVal.trim())

        router.push(`?${queryParams.toString()}`)
    }

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        let newStart = current
        let newEnd = parseISO(endDate)
        const duration = Math.round((newEnd.getTime() - newStart.getTime()) / (1000 * 3600 * 24)) + 1

        if (direction === 'today') {
            newStart = new Date()
            newEnd = addDays(newStart, duration - 1)
        } else {
            const isNext = direction === 'next'
            if (timeframe === 'month') {
                newStart = isNext ? addMonths(current, 1) : subMonths(current, 1)
                newEnd = isNext ? addMonths(parseISO(endDate), 1) : subMonths(parseISO(endDate), 1)
            } else {
                newStart = isNext ? addDays(current, duration) : subDays(current, duration)
                newEnd = isNext ? addDays(parseISO(endDate), duration) : subDays(parseISO(endDate), duration)
            }
        }

        updateUrl({
            from: format(newStart, 'yyyy-MM-dd'),
            to: format(newEnd, 'yyyy-MM-dd')
        })
    }

    const commitDateChange = (type: 'start' | 'end') => {
        const newStart = type === 'start' ? localStart : currentDate
        const newEnd = type === 'end' ? localEnd : endDate
        if (newStart === currentDate && newEnd === endDate) return
        updateUrl({ from: newStart, to: newEnd, timeframe: 'custom' })
    }

    const handleTimeframeChange = (newTf: TimeframeMode) => {
        let days = 14
        if (newTf === 'week1') days = 7
        else if (newTf === 'week2') days = 14
        else if (newTf === 'month') days = 30

        const newEnd = addDays(current, days - 1)
        updateUrl({
            from: currentDate,
            to: format(newEnd, 'yyyy-MM-dd'),
            timeframe: newTf
        })
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateUrl({ search: localSearch })
    }

    return (
        <div className="flex flex-col bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md shadow-xs shrink-0 overflow-hidden">
            {/* Top Bar: Title, KPIs, View Toggle */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-default)]">
                {/* Title & Micro KPIs */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight font-jp">
                            {t('title')}
                        </h1>
                        <span className="text-[10px] text-[var(--text-muted)]">{t('subtitle')}</span>
                    </div>

                    <div className="w-px h-6 bg-[var(--border-default)]"></div>

                    {/* Micro KPIs */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1 text-[12px]">
                            <span className="text-[var(--text-muted)] text-[10px]">{t('kpis.totalJobs')}:</span>
                            <span className="font-mono font-bold text-[var(--text-primary)]">{totalJobsCount}</span>
                        </div>
                        <div className="flex items-baseline gap-1 text-[12px]">
                            <span className="text-[var(--text-muted)] text-[10px]">{t('kpis.inProgress')}:</span>
                            <span className="font-mono font-bold text-[var(--status-warning)]">{inProgressCount}</span>
                        </div>
                        {overdueCount > 0 && (
                            <div className="flex items-baseline gap-1 text-[12px]">
                                <span className="text-red-500 text-[10px] font-bold">{t('kpis.overdue')}:</span>
                                <span className="font-mono font-bold text-red-600 animate-pulse">{overdueCount}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Switcher: Gantt vs Excel Grid */}
                <div className="flex items-center gap-2">
                    {/* If in Grid View: Perspective Switcher */}
                    {activeView === 'grid' && (
                        <div className="flex items-center bg-[var(--bg-surface-2)] rounded p-0.5 border border-[var(--border-default)] mr-2">
                            <button
                                onClick={() => updateUrl({ perspective: 'machine' })}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-all ${
                                    perspective === 'machine'
                                        ? 'bg-[var(--accent)] text-white shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                                title={t('byMachine')}
                            >
                                <Cpu size={13} />
                                <span>{t('byMachine')}</span>
                            </button>
                            <button
                                onClick={() => updateUrl({ perspective: 'job' })}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-all ${
                                    perspective === 'job'
                                        ? 'bg-[var(--accent)] text-white shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                                title={t('byJob')}
                            >
                                <Layers size={13} />
                                <span>{t('byJob')}</span>
                            </button>
                        </div>
                    )}

                    {/* View Switcher Tabs */}
                    <div className="flex items-center bg-[var(--bg-surface-2)] rounded p-0.5 border border-[var(--border-default)]">
                        <button
                            onClick={() => updateUrl({ view: 'gantt' })}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-[12px] font-bold transition-all ${
                                activeView === 'gantt'
                                    ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-xs border border-[var(--border-default)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            <BarChart2 size={14} />
                            <span>{t('ganttView')}</span>
                        </button>
                        <button
                            onClick={() => updateUrl({ view: 'grid' })}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-[12px] font-bold transition-all ${
                                activeView === 'grid'
                                    ? 'bg-[var(--tint-teal-bg)] text-[var(--accent)] shadow-xs border border-[var(--accent)]/30'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            <LayoutGrid size={14} />
                            <span>{t('gridView')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Date Nav, Timeframe, Filters & Search */}
            <div className="flex flex-wrap items-center justify-between px-3 py-1.5 gap-2 bg-[var(--bg-surface-2)] text-[12px]">
                {/* Date Navigator */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleNavigate('today')}
                        className="btn btn-secondary py-0.5 px-2 text-[11px] font-bold h-[28px]"
                    >
                        {t('today')}
                    </button>

                    <div className="flex items-center bg-[var(--bg-surface)] rounded border border-[var(--border-default)] overflow-hidden shadow-xs h-[28px]">
                        <button
                            onClick={() => handleNavigate('prev')}
                            className="p-1 hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-r border-[var(--border-default)]"
                            title={t('prevPeriod')}
                        >
                            <ChevronLeft size={15} />
                        </button>
                        <div className="px-1.5 font-bold text-[12px] text-[var(--accent)] font-mono flex items-center gap-1">
                            <input
                                type="date"
                                value={localStart}
                                onChange={(e) => setLocalStart(e.target.value)}
                                onBlur={() => commitDateChange('start')}
                                onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('start') }}
                                className="bg-transparent border border-transparent hover:border-[var(--border-default)] focus:border-[var(--accent)] rounded px-1 py-0.5 outline-none cursor-text transition-colors text-[var(--text-primary)] text-[11px]"
                            />
                            <span className="text-[var(--text-muted)] font-normal">〜</span>
                            <input
                                type="date"
                                value={localEnd}
                                onChange={(e) => setLocalEnd(e.target.value)}
                                onBlur={() => commitDateChange('end')}
                                onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('end') }}
                                className="bg-transparent border border-transparent hover:border-[var(--border-default)] focus:border-[var(--accent)] rounded px-1 py-0.5 outline-none cursor-text transition-colors text-[var(--text-primary)] text-[11px]"
                            />
                        </div>
                        <button
                            onClick={() => handleNavigate('next')}
                            className="p-1 hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-l border-[var(--border-default)]"
                            title={t('nextPeriod')}
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>

                    {/* Timeframe Presets */}
                    <div className="flex items-center bg-[var(--bg-surface)] rounded p-0.5 border border-[var(--border-default)] shadow-inner h-[28px]">
                        {(['week1', 'week2', 'month'] as TimeframeMode[]).map((tf) => (
                            <button
                                key={tf}
                                onClick={() => handleTimeframeChange(tf)}
                                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-bold transition-all ${
                                    timeframe === tf
                                        ? 'bg-[var(--accent)] text-white shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                                }`}
                            >
                                {t(tf)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Track Filter & Search */}
                <div className="flex items-center gap-2">
                    {/* Track filter */}
                    <div className="flex items-center bg-[var(--bg-surface)] rounded p-0.5 border border-[var(--border-default)] h-[28px]">
                        {[
                            { key: 'ALL', label: t('all') },
                            { key: 'MOLD', label: t('moldOnly') },
                            { key: 'PLUG', label: t('plugOnly') },
                            { key: 'CUTTER', label: t('cutterOnly') }
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => updateUrl({ track: item.key })}
                                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium transition-all ${
                                    trackFilter === item.key
                                        ? 'bg-[var(--tint-teal-bg)] text-[var(--accent)] font-bold shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onBlur={() => updateUrl({ search: localSearch })}
                            className="form-input text-[11px] h-[28px] pl-7 pr-2 w-48 rounded bg-[var(--bg-surface)] border-[var(--border-default)] focus:w-60 transition-all"
                        />
                        <Search size={13} className="absolute left-2 top-2 text-[var(--text-muted)]" />
                    </form>
                </div>
            </div>
        </div>
    )
}
