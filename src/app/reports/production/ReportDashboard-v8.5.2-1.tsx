'use client'

import React, { useState, useTransition, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getProductionReport, ProductionReportRow, ProductionReportResult } from '@/app/actions/reports'
import { FileDown, Search, Loader2 } from 'lucide-react'

// ================================================================
// HELPERS
// ================================================================
function fmtDate(iso: string | null): string {
    if (!iso) return '—'
    const d = new Date(iso)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function fmtNum(n: number | null, unit = ''): string {
    if (n === null || n === undefined) return '—'
    return n.toLocaleString('ja-JP') + (unit ? unit : '')
}

function getAchievementColor(pct: number | null): string {
    if (pct === null) return 'text-[var(--text-muted)]'
    if (pct >= 100) return 'text-[var(--status-success)]'
    if (pct >= 80) return 'text-[var(--status-warning)]'
    return 'text-[var(--status-error)]'
}

function getScrapColor(pct: number | null): string {
    if (pct === null) return 'text-[var(--text-muted)]'
    if (pct <= 2) return 'text-[var(--status-success)]'
    if (pct <= 5) return 'text-[var(--status-warning)]'
    return 'text-[var(--status-error)]'
}

// ================================================================
// CSV EXPORT (Vanilla TS — no external library)
// ================================================================
function exportToCSV(rows: ProductionReportRow[], startDate: string, endDate: string, headers: string[]) {
    const csvRows = rows.map((r) => [
        r.start_time ? new Date(r.start_time).toLocaleString('ja-JP') : '',
        r.end_time ? new Date(r.end_time).toLocaleString('ja-JP') : '',
        r.machine_code ?? '',
        r.machine_name ?? '',
        r.operator_name ?? '',
        r.slip_no ?? '',
        r.product_pn_raw ?? '',
        r.planned_quantity ?? '',
        r.produced_qty ?? '',
        r.scrap_qty ?? '',
        r.achievement_pct !== null ? `${r.achievement_pct}%` : '',
        r.scrap_rate_pct !== null ? `${r.scrap_rate_pct}%` : '',
        r.duration_min ?? '',
    ])

    const bom = '\uFEFF' // UTF-8 BOM cho Excel Nhật Bản
    const csvContent =
        bom +
        [headers, ...csvRows]
            .map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
            )
            .join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `生産実績報告_${startDate}_${endDate}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

function getPresetRange(preset: 'today' | 'week' | 'month'): { start: string; end: string } {
    const today = new Date()
    const end = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

    if (preset === 'today') {
        return { start: end, end }
    }
    if (preset === 'week') {
        const s = new Date(today)
        s.setDate(s.getDate() - 6)
        return { start: s.getFullYear() + '-' + String(s.getMonth() + 1).padStart(2, '0') + '-' + String(s.getDate()).padStart(2, '0'), end }
    }
    // month
    const s = new Date(today)
    s.setDate(s.getDate() - 29)
    return { start: s.getFullYear() + '-' + String(s.getMonth() + 1).padStart(2, '0') + '-' + String(s.getDate()).padStart(2, '0'), end }
}

function KpiCard({
    label,
    value,
    unit,
    colorClass,
}: {
    label: string
    value: string
    unit?: string
    colorClass?: string
}) {
    return (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md py-3 px-4 min-w-[140px] flex-1 shadow-sm transition-shadow hover:shadow-md">
            <div className="text-xs text-[var(--text-muted)] leading-tight mb-2 font-bold">
                {label}
            </div>
            <div className={`text-[22px] font-bold tracking-tight ${colorClass || 'text-[var(--text-primary)]'}`}>
                {value}
                {unit && <span className="text-xs font-normal ml-1 text-[var(--text-muted)]">{unit}</span>}
            </div>
        </div>
    )
}

interface Props {
    initialData: ProductionReportResult
    defaultStartDate: string
    defaultEndDate: string
}

export default function ReportDashboard({ initialData, defaultStartDate, defaultEndDate }: Props) {
    const t = useTranslations('Reports.Production')
    const [startDate, setStartDate] = useState(defaultStartDate)
    const [endDate, setEndDate] = useState(defaultEndDate)
    const [data, setData] = useState<ProductionReportResult>(initialData)
    const [sortCol, setSortCol] = useState<keyof ProductionReportRow>('start_time')
    const [sortAsc, setSortAsc] = useState(false)
    const [filterMachine, setFilterMachine] = useState('')
    const [filterOperator, setFilterOperator] = useState('')
    const [isPending, startTransition] = useTransition()

    // Fetch dữ liệu mới từ Server Action
    const handleSearch = useCallback(() => {
        startTransition(async () => {
            try {
                const result = await getProductionReport(startDate, endDate)
                setData(result)
            } catch (e) {
                console.error(e)
            }
        })
    }, [startDate, endDate])

    const quickFilterClick = (preset: 'today' | 'week' | 'month') => {
        const range = getPresetRange(preset)
        setStartDate(range.start)
        setEndDate(range.end)
        // Tự động gọi search
        startTransition(async () => {
            try {
                const result = await getProductionReport(range.start, range.end)
                setData(result)
            } catch (e) {
                console.error(e)
            }
        })
    }

    // Sort
    const handleSort = (col: keyof ProductionReportRow) => {
        if (sortCol === col) {
            setSortAsc((v) => !v)
        } else {
            setSortCol(col)
            setSortAsc(false)
        }
    }

    const SortIcon = ({ col }: { col: keyof ProductionReportRow }) => {
        if (sortCol !== col) return <span className="opacity-30 inline-block ml-1">⇅</span>
        return <span className="inline-block ml-1 text-[var(--accent)]">{sortAsc ? '↑' : '↓'}</span>
    }

    // Filter + Sort rows
    const displayRows = [...data.rows]
        .filter((r) => {
            const mok = filterMachine
                ? (r.machine_code ?? '').toLowerCase().includes(filterMachine.toLowerCase()) ||
                (r.machine_name ?? '').toLowerCase().includes(filterMachine.toLowerCase())
                : true
            const ook = filterOperator
                ? (r.operator_name ?? '').toLowerCase().includes(filterOperator.toLowerCase())
                : true
            return mok && ook
        })
        .sort((a, b) => {
            const av = a[sortCol]
            const bv = b[sortCol]
            if (av === null || av === undefined) return 1
            if (bv === null || bv === undefined) return -1
            const cmp = av < bv ? -1 : av > bv ? 1 : 0
            return sortAsc ? cmp : -cmp
        })

    const { summary } = data

    const machines = [...new Set(data.rows.map((r) => r.machine_code).filter(Boolean))]
    const operators = [...new Set(data.rows.map((r) => r.operator_name).filter(Boolean))]

    const csvHeadersList = [
        t('headers.startTime'),
        t('headers.endTime'),
        t('headers.machineCode'),
        t('headers.machineName'),
        t('headers.operator'),
        t('headers.slipNo'),
        t('headers.productPn'),
        t('headers.planned'),
        t('headers.produced'),
        t('headers.scrap'),
        t('headers.achievementPct'),
        t('headers.scrapPct'),
        t('headers.durationMin'),
    ]

    return (
        <div className="flex flex-col h-full bg-[var(--bg-surface)] relative inset-0 absolute overflow-hidden">

            {/* ===== DATE FILTER BAR ===== */}
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex flex-wrap items-center gap-4 shrink-0 shadow-sm z-20 relative">
                {/* Preset buttons */}
                <div className="flex bg-[var(--bg-base)] p-1 rounded-md border border-[var(--border-default)]">
                    <button onClick={() => quickFilterClick('today')} className="px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded transition-colors whitespace-nowrap">{t('today')}</button>
                    <button onClick={() => quickFilterClick('week')} className="px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded transition-colors whitespace-nowrap">{t('week')}</button>
                    <button onClick={() => quickFilterClick('month')} className="px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded transition-colors whitespace-nowrap">{t('month')}</button>
                </div>

                <div className="w-px h-6 bg-[var(--border-default)]" />

                {/* Date inputs */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-muted)]">{t('from')}</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-input text-sm font-medium"
                    />
                    <span className="text-xs font-bold text-[var(--text-muted)] mx-1">{t('to')}</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-input text-sm font-medium"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={isPending}
                    className="btn btn-primary flex items-center gap-2 px-5 py-1.5 text-sm"
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    {isPending ? t('loading') : t('searchBtn')}
                </button>

                <div className="flex-1" />

                {/* Quick Filters */}
                <div className="flex gap-2 relative z-30">
                    <select
                        value={filterMachine}
                        onChange={(e) => setFilterMachine(e.target.value)}
                        className="form-select text-sm"
                    >
                        <option value="">{t('allMachines')}</option>
                        {machines.map((m) => (
                            <option key={m} value={m!}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={filterOperator}
                        onChange={(e) => setFilterOperator(e.target.value)}
                        className="form-select text-sm"
                    >
                        <option value="">{t('allOperators')}</option>
                        {operators.map((op) => (
                            <option key={op} value={op!}>{op}</option>
                        ))}
                    </select>
                </div>

                {/* Export CSV */}
                <button
                    onClick={() => exportToCSV(displayRows, startDate, endDate, csvHeadersList)}
                    disabled={displayRows.length === 0}
                    className="btn btn-secondary flex items-center gap-2 px-4 py-1.5 text-sm"
                >
                    <FileDown size={16} />
                    {t('csvExport')}
                </button>
            </div>

            {/* ===== KPI SUMMARY ROW ===== */}
            <div className="flex flex-wrap gap-4 px-4 py-5 bg-[var(--tint-teal-bg)] border-b border-[var(--border-default)] shrink-0 shadow-inner z-10 relative">
                <KpiCard label={t('kpi.completedLogs')} value={fmtNum(summary.total_logs)} unit="件" />
                <KpiCard label={t('kpi.totalPlanned')} value={fmtNum(summary.total_planned)} unit="khay" />
                <KpiCard
                    label={t('kpi.totalProduced')}
                    value={fmtNum(summary.total_produced)}
                    unit="khay"
                    colorClass={Math.max(summary.total_produced, 1) >= Math.max(summary.total_planned, 1) ? 'text-[var(--status-success)]' : 'text-[var(--accent)]'}
                />
                <KpiCard
                    label={t('kpi.totalScrap')}
                    value={fmtNum(summary.total_scrap)}
                    unit="khay"
                    colorClass={summary.total_scrap > 0 ? 'text-[var(--status-error)]' : 'text-[var(--status-success)]'}
                />
                <KpiCard
                    label={t('kpi.avgAchievement')}
                    value={summary.avg_achievement_pct > 0 ? `${summary.avg_achievement_pct}%` : '—'}
                    colorClass={getAchievementColor(summary.avg_achievement_pct)}
                />
                <KpiCard
                    label={t('kpi.overallScrapRate')}
                    value={summary.overall_scrap_rate_pct > 0 ? `${summary.overall_scrap_rate_pct}%` : '0%'}
                    colorClass={getScrapColor(summary.overall_scrap_rate_pct)}
                />
            </div>

            {/* ===== HEADER INFO ===== */}
            <div className="px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-[var(--text-muted)]">
                    {t('recordList')} —{' '}
                    <span className="text-[var(--accent)] font-bold">{t('recordsCount', { count: displayRows.length })}</span>
                    {(filterMachine || filterOperator) && (
                        <span className="text-[var(--status-warning)] ml-2">{t('filterActive')}</span>
                    )}
                </span>
                <span className="text-[11px] font-mono font-medium text-[var(--text-muted)]">
                    {startDate} 〜 {endDate}
                </span>
            </div>

            {/* ===== DATA GRID ===== */}
            <div className={`flex-1 overflow-auto bg-[var(--bg-surface)] relative transition-opacity duration-200 card-flat ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <table className="data-table min-w-full text-xs">
                    <thead>
                        <tr className="cursor-pointer select-none">
                            <th onClick={() => handleSort('start_time')}>{t('tableHeaders.startEnd')} <SortIcon col="start_time" /></th>
                            <th onClick={() => handleSort('machine_code')} className="text-center">{t('tableHeaders.machineNo')} <SortIcon col="machine_code" /></th>
                            <th onClick={() => handleSort('operator_name')}>{t('tableHeaders.operator')} <SortIcon col="operator_name" /></th>
                            <th onClick={() => handleSort('product_pn_raw')}>{t('tableHeaders.productPn')} <SortIcon col="product_pn_raw" /></th>
                            <th onClick={() => handleSort('slip_no')}>{t('tableHeaders.slipNo')} <SortIcon col="slip_no" /></th>
                            <th onClick={() => handleSort('planned_quantity')} className="text-right">{t('tableHeaders.plannedQty')} <SortIcon col="planned_quantity" /></th>
                            <th onClick={() => handleSort('produced_qty')} className="text-right">{t('tableHeaders.producedQty')} <SortIcon col="produced_qty" /></th>
                            <th onClick={() => handleSort('scrap_qty')} className="text-right">{t('tableHeaders.scrapQty')} <SortIcon col="scrap_qty" /></th>
                            <th onClick={() => handleSort('achievement_pct')} className="text-right">{t('tableHeaders.achievementPct')} <SortIcon col="achievement_pct" /></th>
                            <th onClick={() => handleSort('scrap_rate_pct')} className="text-right">{t('tableHeaders.scrapRatePct')} <SortIcon col="scrap_rate_pct" /></th>
                            <th onClick={() => handleSort('duration_min')} className="text-right">{t('tableHeaders.durationMin')} <SortIcon col="duration_min" /></th>
                        </tr>
                    </thead>
                    <tbody className="[&>tr]:border-b [&>tr]:border-[var(--border-subtle)] last:[&>tr]:border-0">
                        {displayRows.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="py-24 text-center">
                                    <div className="text-[var(--text-muted)] font-bold mb-1 text-sm bg-[var(--bg-base)] inline-block px-4 py-2 rounded">
                                        {isPending ? t('loading') : t('noData')}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayRows.map((row) => (
                                <tr key={row.log_id} className="hover:bg-[var(--tint-teal-bg)]/20 transition-colors [&>td]:py-2.5 [&>td]:px-3 [&>td]:border-r [&>td]:border-[var(--border-subtle)] last:[&>td]:border-r-0">
                                    <td className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                        <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{fmtDate(row.start_time)}</div>
                                        <div className="text-[10px] mt-0.5 opacity-80">{fmtDate(row.end_time)}</div>
                                    </td>
                                    <td className="text-center">
                                        {row.machine_code ? (
                                            <Link
                                                href={`/master/machines?search=${encodeURIComponent(row.machine_code || '')}`}
                                                className="badge badge--info font-bold font-mono hover:underline"
                                            >
                                                {row.machine_code}
                                            </Link>
                                        ) : '-'}
                                    </td>
                                    <td className="font-medium text-[13px] max-w-[120px] truncate" style={{ color: 'var(--text-primary)' }}>{row.operator_name || '-'}</td>
                                    <td>
                                        {row.product_pn_raw ? (
                                            <Link
                                                href={`/master/products?search=${encodeURIComponent(row.product_pn_raw || '')}`}
                                                className="font-mono text-[13px] font-bold text-[var(--accent)] hover:underline"
                                            >
                                                {row.product_pn_raw}
                                            </Link>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        {row.slip_no ? (
                                            <Link
                                                href={`/orders?search=${encodeURIComponent(row.slip_no || '')}`}
                                                className="font-mono text-[13px] font-bold text-[var(--accent)] hover:underline"
                                            >
                                                {row.slip_no}
                                            </Link>
                                        ) : '-'}
                                    </td>

                                    <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--text-muted)' }}>{fmtNum(row.planned_quantity)}</td>
                                    <td className="text-right font-mono text-[13px] font-bold text-[var(--accent)]">{fmtNum(row.produced_qty)}</td>
                                    <td className={`text-right font-mono text-[13px] font-bold ${row.scrap_qty && row.scrap_qty > 0 ? 'text-[var(--status-error)]' : 'text-[var(--text-muted)]'}`}>
                                        {row.scrap_qty || '0'}
                                    </td>

                                    <td className={`text-right font-mono text-[13px] font-bold ${getAchievementColor(row.achievement_pct)}`}>
                                        {row.achievement_pct !== null ? `${row.achievement_pct}%` : '-'}
                                    </td>
                                    <td className={`text-right font-mono text-[13px] font-bold ${getScrapColor(row.scrap_rate_pct)}`}>
                                        {row.scrap_rate_pct !== null ? `${row.scrap_rate_pct}%` : '0%'}
                                    </td>
                                    <td className="text-right font-mono text-[13px] font-bold" style={{ color: 'var(--text-muted)' }}>
                                        {row.duration_min !== null ? <span className="bg-[var(--bg-base)] px-1.5 py-0.5 rounded shadow-sm">{row.duration_min}</span> : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
