'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO, addDays, addMonths, subDays, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, LayoutGrid, BarChart2, Search, ClipboardList, Printer, Sparkles, Briefcase, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ManufacturingSheetOCRModal } from '@/components/ocr/ManufacturingSheetOCRModal'
import { DailyWorklogQuickModal } from '@/components/worklogs/DailyWorklogQuickModal'
import { EditStepModal } from '@/app/equipment/jobs/[id]/tabs/EditStepModal'
import CreateProductModal from '@/app/product-center/_components/CreateProductModal'

export type TimeframeMode = 'week1' | 'week2' | 'month' | 'custom'
export type ViewMode = 'gantt' | 'grid'
export type PerspectiveMode = 'machine' | 'job'
export type TrackFilter = 'ALL' | 'DESIGN' | 'MOLD' | 'PLUG' | 'CUTTER'

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

    // Modals
    const [isOCRModalOpen, setIsOCRModalOpen] = useState(false)
    const [isWorklogModalOpen, setIsWorklogModalOpen] = useState(false)
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [worklogJobId, setWorklogJobId] = useState<string | null>(null)

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
        <>
            {/* ─── 2-ROW TOOLBAR ─── */}
            <div className="flex flex-col bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md shadow-xs shrink-0">

                {/* ── ROW 1: Title / KPI / Date Nav / Timeframe / Track Filter / Search / View Switcher ── */}
                <div className="flex items-center gap-2 px-2.5 py-1 min-h-[40px] border-b border-[var(--border-default)]/40 flex-wrap">

                    {/* Title + KPI */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[13px]">📅</span>
                            <h1 className="text-[13px] font-bold text-[var(--text-primary)] leading-tight font-jp whitespace-nowrap">
                                {t('title')}
                            </h1>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs whitespace-nowrap">
                            <span className="text-[var(--text-muted)]">総:</span>
                            <span className="font-bold text-[var(--text-primary)]">{totalJobsCount}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-[var(--status-warning)] font-bold">進:{inProgressCount}</span>
                            {overdueCount > 0 && (
                                <>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-red-600 font-bold animate-pulse">遅:{overdueCount}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Date Navigator */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={() => handleNavigate('today')}
                            className="btn btn-secondary py-0.5 px-2 text-[10.5px] font-bold h-[26px]"
                        >
                            {t('today')}
                        </button>
                        <div className="flex items-center bg-[var(--bg-surface-2)] rounded border border-[var(--border-default)] overflow-hidden shadow-2xs h-[26px]">
                            <button
                                onClick={() => handleNavigate('prev')}
                                className="p-1 hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-r border-[var(--border-default)]"
                                title={t('prevPeriod')}
                            >
                                <ChevronLeft size={13} />
                            </button>
                            <div className="px-1 font-bold text-[11px] text-[var(--accent)] font-mono flex items-center gap-0.5">
                                <input
                                    type="date"
                                    value={localStart}
                                    onChange={(e) => setLocalStart(e.target.value)}
                                    onBlur={() => commitDateChange('start')}
                                    onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('start') }}
                                    className="bg-transparent border border-transparent hover:border-[var(--border-default)] focus:border-[var(--accent)] rounded px-0.5 py-0.5 outline-none cursor-text transition-colors text-[var(--text-primary)] text-[10.5px] w-[102px]"
                                />
                                <span className="text-[var(--text-muted)] font-normal text-[10px]">〜</span>
                                <input
                                    type="date"
                                    value={localEnd}
                                    onChange={(e) => setLocalEnd(e.target.value)}
                                    onBlur={() => commitDateChange('end')}
                                    onKeyDown={(e) => { if (e.key === 'Enter') commitDateChange('end') }}
                                    className="bg-transparent border border-transparent hover:border-[var(--border-default)] focus:border-[var(--accent)] rounded px-0.5 py-0.5 outline-none cursor-text transition-colors text-[var(--text-primary)] text-[10.5px] w-[102px]"
                                />
                            </div>
                            <button
                                onClick={() => handleNavigate('next')}
                                className="p-1 hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-l border-[var(--border-default)]"
                                title={t('nextPeriod')}
                            >
                                <ChevronRight size={13} />
                            </button>
                        </div>
                        {/* Timeframe Presets */}
                        <div className="flex items-center bg-[var(--bg-surface-2)] rounded p-0.5 border border-[var(--border-default)] shadow-2xs h-[26px]">
                            {(['week1', 'week2', 'month'] as TimeframeMode[]).map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => handleTimeframeChange(tf)}
                                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold transition-all ${
                                        timeframe === tf
                                            ? 'bg-[var(--accent)] text-white shadow-2xs'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    {t(tf)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Track Filter */}
                    <div className="flex items-center bg-[var(--bg-surface-2)] rounded p-0.5 border border-[var(--border-default)] h-[26px] shrink-0">
                        {[
                            { key: 'ALL', label: t('all') },
                            { key: 'DESIGN', label: '設計のみ' },
                            { key: 'MOLD', label: t('moldOnly') },
                            { key: 'PLUG', label: t('plugOnly') },
                            { key: 'CUTTER', label: t('cutterOnly') }
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => updateUrl({ track: item.key })}
                                className={`px-1.5 py-0.2 rounded text-[10px] font-medium transition-all ${
                                    trackFilter === item.key
                                        ? 'bg-[var(--tint-teal-bg)] text-[var(--accent)] font-bold shadow-2xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="relative shrink-0">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onBlur={() => updateUrl({ search: localSearch })}
                            className="form-input text-[10.5px] h-[26px] pl-6 pr-2 w-28 focus:w-40 rounded bg-[var(--bg-surface)] border-[var(--border-default)] transition-all"
                        />
                        <Search size={11} className="absolute left-1.5 top-2 text-[var(--text-muted)]" />
                    </form>

                    {/* ── View Switcher — ml-auto chốt phải, luôn hiển thị ── */}
                    <div className="flex items-center ml-auto shrink-0">
                        <div className="flex items-center bg-[var(--bg-surface-2)] rounded p-0.5 border-2 border-[var(--accent)]/30 h-[28px] shadow-sm">
                            <button
                                onClick={() => updateUrl({ view: 'gantt' })}
                                className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                    activeView === 'gantt'
                                        ? 'bg-[var(--accent)] text-white shadow-sm'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                                }`}
                                title="ガントチャート表示"
                            >
                                <BarChart2 size={13} />
                                <span className="whitespace-nowrap">ガント</span>
                            </button>
                            <button
                                onClick={() => updateUrl({ view: 'grid' })}
                                className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                    activeView === 'grid'
                                        ? 'bg-[var(--tint-teal-bg)] text-[var(--accent)] shadow-sm border border-[var(--accent)]/40'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                                }`}
                                title="グリッド（カレンダー）表示"
                            >
                                <LayoutGrid size={13} />
                                <span className="whitespace-nowrap">グリッド</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── ROW 2: Action Buttons ── */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 min-h-[34px] flex-wrap">

                    {/* + 新規製品・設計 */}
                    <button
                        type="button"
                        onClick={() => setIsCreateProductOpen(true)}
                        className="btn btn-primary text-[10.5px] px-2.5 h-[26px] flex items-center gap-1 font-bold shadow-2xs cursor-pointer"
                        title="新規製品の登録＆設計Job（10工程）の自動生成"
                    >
                        <Plus size={12} />
                        <span className="whitespace-nowrap">新規製品・設計</span>
                    </button>

                    {/* 日報入力 */}
                    <button
                        type="button"
                        onClick={() => { setWorklogJobId(null); setIsWorklogModalOpen(true) }}
                        className="btn text-[10.5px] px-2.5 h-[26px] flex items-center gap-1 font-bold shadow-2xs border border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--tint-teal-bg)] hover:brightness-95 cursor-pointer"
                        title="日報・作業ログを記録（設計・金型・社内作業など）"
                    >
                        <ClipboardList size={12} />
                        <span className="whitespace-nowrap">日報入力</span>
                    </button>

                    {/* 社内作業 */}
                    <button
                        type="button"
                        onClick={() => { setWorklogJobId('caeb4ec3-065a-4653-b69a-19e6dbc4287a'); setIsWorklogModalOpen(true) }}
                        className="btn text-[10.5px] px-2.5 h-[26px] flex items-center gap-1 font-bold shadow-2xs border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                        title="社内作業（5S・保全・金型管理など）の日報を直接入力"
                    >
                        <Briefcase size={12} />
                        <span className="whitespace-nowrap">社内作業</span>
                    </button>

                    {/* 日報印刷 */}
                    <button
                        type="button"
                        onClick={() => setIsPrintModalOpen(true)}
                        className="btn text-[10.5px] px-2.5 h-[26px] flex items-center gap-1 font-bold shadow-2xs border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 cursor-pointer"
                        title="本日の日報記録書を確認・印刷・PDF出力"
                    >
                        <Printer size={12} />
                        <span className="whitespace-nowrap">日報印刷</span>
                    </button>

                    {/* AI 工程票取込 */}
                    <button
                        type="button"
                        onClick={() => setIsOCRModalOpen(true)}
                        className="btn btn-primary text-[10.5px] px-2.5 h-[26px] flex items-center gap-1 shadow-2xs font-bold cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', color: '#ffffff' }}
                        title="新規金型製造工程票 AI OCR 取込"
                    >
                        <Sparkles size={12} className="text-amber-300" />
                        <span className="whitespace-nowrap">AI 工程票取込</span>
                    </button>

                    {/* Excel Grid Export link — secondary */}
                    <span className="ml-auto text-[10px] text-[var(--text-muted)] whitespace-nowrap hidden xl:inline">
                        {activeView === 'grid' ? '📊 Excelグリッド表示中' : ''}
                    </span>
                </div>
            </div>

            {/* ─── MODALS ─── */}
            {isOCRModalOpen && (
                <ManufacturingSheetOCRModal
                    isOpen={isOCRModalOpen}
                    onClose={() => setIsOCRModalOpen(false)}
                    onSuccess={() => { setIsOCRModalOpen(false); router.refresh() }}
                />
            )}

            {isWorklogModalOpen && (
                <EditStepModal
                    jobId={worklogJobId || null}
                    step={null}
                    nextStepNo={1}
                    onClose={() => { setIsWorklogModalOpen(false); setWorklogJobId(null); router.refresh() }}
                    onSaved={() => { router.refresh() }}
                />
            )}

            {isPrintModalOpen && (
                <DailyWorklogQuickModal
                    isOpen={isPrintModalOpen}
                    onClose={() => setIsPrintModalOpen(false)}
                    initialDate={format(new Date(), 'yyyy-MM-dd')}
                />
            )}

            <CreateProductModal
                isOpen={isCreateProductOpen}
                onClose={() => setIsCreateProductOpen(false)}
                onSuccess={() => { setIsCreateProductOpen(false); router.refresh() }}
            />
        </>
    )
}
