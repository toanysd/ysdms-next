'use client'

import React, { useState, useTransition, useCallback } from 'react'
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
    if (pct === null) return 'text-[var(--mcs-text-muted)]'
    if (pct >= 100) return 'text-green-600'
    if (pct >= 80) return 'text-yellow-600'
    return 'text-red-500'
}

function getScrapColor(pct: number | null): string {
    if (pct === null) return 'text-[var(--mcs-text-muted)]'
    if (pct <= 2) return 'text-green-600'
    if (pct <= 5) return 'text-yellow-600'
    return 'text-red-500'
}

// ================================================================
// CSV EXPORT (Vanilla TS — no external library)
// ================================================================
function exportToCSV(rows: ProductionReportRow[], startDate: string, endDate: string) {
    const headers = [
        '開始日時 (Bắt đầu)',
        '終了日時 (Kết thúc)',
        '機械コード (Mã Máy)',
        '機械名 (Tên Máy)',
        'オペレーター (Người Vận Hành)',
        '受注No (Số Phiếu)',
        '品番 (Mã Sản Phẩm)',
        '計画数 (KH)',
        '良品数 (Thực tế)',
        '不良数 (Phế Liệu)',
        '達成率% (Đạt KH%)',
        '不良率% (Tỷ lệ Phế%)',
        '稼働時間/分 (Thời Gian Phút)',
    ]

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
    labelJa,
    labelVi,
    value,
    unit,
    colorClass,
}: {
    labelJa: string
    labelVi: string
    value: string
    unit?: string
    colorClass?: string
}) {
    return (
        <div className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md py-3 px-4 min-w-[140px] flex-1 shadow-sm transition-shadow hover:shadow-md">
            <div className="text-xs text-[var(--mcs-text-muted)] leading-tight mb-2">
                <span className="font-bold">{labelJa}</span>
                <span className="block text-[10px] font-normal mt-0.5">{labelVi}</span>
            </div>
            <div className={`text-[22px] font-bold tracking-tight ${colorClass || 'text-[var(--mcs-text)]'}`}>
                {value}
                {unit && <span className="text-xs font-normal ml-1 text-[var(--mcs-text-muted)]">{unit}</span>}
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
        return <span className="inline-block ml-1 text-[var(--mcs-primary)]">{sortAsc ? '↑' : '↓'}</span>
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

    return (
        <div className="flex flex-col h-full bg-slate-50 relative inset-0 absolute overflow-hidden">

            {/* ===== DATE FILTER BAR ===== */}
            <div className="px-4 py-3 bg-[var(--mcs-surface)] border-b border-[var(--mcs-border)] flex flex-wrap items-center gap-4 shrink-0 shadow-sm z-20 relative">
                {/* Preset buttons */}
                <div className="flex bg-[var(--mcs-surface-2)] p-1 rounded-md border border-[var(--mcs-border)]">
                    <button onClick={() => quickFilterClick('today')} className="px-3 py-1.5 text-xs font-bold text-[var(--mcs-text)] hover:bg-[var(--mcs-surface)] rounded transition-colors whitespace-nowrap">本日 (Hôm nay)</button>
                    <button onClick={() => quickFilterClick('week')} className="px-3 py-1.5 text-xs font-bold text-[var(--mcs-text)] hover:bg-[var(--mcs-surface)] rounded transition-colors whitespace-nowrap">今週 (Tuần)</button>
                    <button onClick={() => quickFilterClick('month')} className="px-3 py-1.5 text-xs font-bold text-[var(--mcs-text)] hover:bg-[var(--mcs-surface)] rounded transition-colors whitespace-nowrap">今月 (Tháng)</button>
                </div>

                <div className="w-px h-6 bg-[var(--mcs-border)]" />

                {/* Date inputs */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--mcs-text-muted)]">期間 <span className="font-normal">(Từ)</span></span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-2 py-1.5 text-sm font-medium border border-[var(--mcs-border)] rounded outline-none focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] bg-[var(--mcs-surface)] transition-all"
                    />
                    <span className="text-xs font-bold text-[var(--mcs-text-muted)] mx-1">〜 <span className="font-normal">(Đến)</span></span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-2 py-1.5 text-sm font-medium border border-[var(--mcs-border)] rounded outline-none focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] bg-[var(--mcs-surface)] transition-all"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-1.5 bg-[var(--mcs-primary)] text-white font-bold rounded text-sm hover:brightness-110 transition-all disabled:opacity-60 shadow-sm"
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    {isPending ? '読込中…' : '検索 (Xem)'}
                </button>

                <div className="flex-1" />

                {/* Quick Filters */}
                <div className="flex gap-2 relative z-30">
                    <select
                        value={filterMachine}
                        onChange={(e) => setFilterMachine(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-[var(--mcs-border)] bg-[var(--mcs-surface-2)] rounded outline-none focus:border-[var(--mcs-primary)]"
                    >
                        <option value="">全機械 (Tất cả Máy)</option>
                        {machines.map((m) => (
                            <option key={m} value={m!}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={filterOperator}
                        onChange={(e) => setFilterOperator(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-[var(--mcs-border)] bg-[var(--mcs-surface-2)] rounded outline-none focus:border-[var(--mcs-primary)]"
                    >
                        <option value="">全担当者 (Tất cả T.Viên)</option>
                        {operators.map((op) => (
                            <option key={op} value={op!}>{op}</option>
                        ))}
                    </select>
                </div>

                {/* Export CSV */}
                <button
                    onClick={() => exportToCSV(displayRows, startDate, endDate)}
                    disabled={displayRows.length === 0}
                    className="flex items-center gap-2 px-4 py-1.5 border border-[var(--mcs-primary)] text-[var(--mcs-primary)] font-bold rounded text-sm hover:bg-[var(--mcs-surface-2)] transition-colors disabled:opacity-50 disabled:bg-transparent"
                >
                    <FileDown size={16} />
                    CSV出力 (Xuất)
                </button>
            </div>

            {/* ===== KPI SUMMARY ROW ===== */}
            <div className="flex flex-wrap gap-4 px-4 py-5 bg-slate-100 border-b border-[var(--mcs-border)] shrink-0 shadow-inner z-10 relative">
                <KpiCard labelJa="対象レコード数" labelVi="Số ca hoàn thành" value={fmtNum(summary.total_logs)} unit="件" />
                <KpiCard labelJa="計画総数" labelVi="Tổng KH máy" value={fmtNum(summary.total_planned)} unit="khay" />
                <KpiCard
                    labelJa="良品総数"
                    labelVi="Lượng thành phẩm"
                    value={fmtNum(summary.total_produced)}
                    unit="khay"
                    colorClass={Math.max(summary.total_produced, 1) >= Math.max(summary.total_planned, 1) ? 'text-green-600' : 'text-blue-700'}
                />
                <KpiCard
                    labelJa="不良品総数"
                    labelVi="Lượng phế phẩm"
                    value={fmtNum(summary.total_scrap)}
                    unit="khay"
                    colorClass={summary.total_scrap > 0 ? 'text-red-500' : 'text-green-600'}
                />
                <KpiCard
                    labelJa="平均達成率"
                    labelVi="Tỷ lệ đạt Kế hoạch"
                    value={summary.avg_achievement_pct > 0 ? `${summary.avg_achievement_pct}%` : '—'}
                    colorClass={getAchievementColor(summary.avg_achievement_pct)}
                />
                <KpiCard
                    labelJa="総不良率"
                    labelVi="Trung bình Hao hụt"
                    value={summary.overall_scrap_rate_pct > 0 ? `${summary.overall_scrap_rate_pct}%` : '0%'}
                    colorClass={getScrapColor(summary.overall_scrap_rate_pct)}
                />
            </div>

            {/* ===== HEADER INFO ===== */}
            <div className="px-4 py-2 bg-[var(--mcs-surface)] border-b border-[var(--mcs-border)] flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-[var(--mcs-text-muted)]">
                    実績一覧 (Danh sách Ca Sản Xuất) —{' '}
                    <span className="text-[var(--mcs-primary)]">{displayRows.length} bản ghi</span>
                    {(filterMachine || filterOperator) && (
                        <span className="text-yellow-600 ml-2">▲ フィルター適用中 (Đang lọc)</span>
                    )}
                </span>
                <span className="text-[11px] font-mono font-medium text-[var(--mcs-text-muted)]">
                    {startDate} 〜 {endDate}
                </span>
            </div>

            {/* ===== DATA GRID ===== */}
            <div className={`flex-1 overflow-auto bg-[var(--mcs-surface)] relative transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-20 w-full">
                        <tr className="[&>th]:py-3 [&>th]:px-3 [&>th]:font-bold [&>th]:text-slate-600 [&>th]:border-r [&>th]:border-slate-200 last:[&>th]:border-r-0 cursor-pointer select-none">
                            <th onClick={() => handleSort('start_time')} className="hover:bg-slate-100 transition-colors">開始/終了 (Bắt đầu/Kết thúc) <SortIcon col="start_time" /></th>
                            <th onClick={() => handleSort('machine_code')} className="text-center hover:bg-slate-100 transition-colors">機番 (Mã Máy) <SortIcon col="machine_code" /></th>
                            <th onClick={() => handleSort('operator_name')} className="hover:bg-slate-100 transition-colors">担当者 (Vận Hành) <SortIcon col="operator_name" /></th>
                            <th onClick={() => handleSort('product_pn_raw')} className="hover:bg-slate-100 transition-colors">品番 (Mã SP) <SortIcon col="product_pn_raw" /></th>
                            <th onClick={() => handleSort('slip_no')} className="hover:bg-slate-100 transition-colors">受注No (Số Phiếu) <SortIcon col="slip_no" /></th>
                            <th onClick={() => handleSort('planned_quantity')} className="text-right hover:bg-slate-100 transition-colors">計画数 (Kế hoạch) <SortIcon col="planned_quantity" /></th>
                            <th onClick={() => handleSort('produced_qty')} className="text-right hover:bg-slate-100 transition-colors">良品数 (Thực tế) <SortIcon col="produced_qty" /></th>
                            <th onClick={() => handleSort('scrap_qty')} className="text-right hover:bg-slate-100 transition-colors">不良 (Phế) <SortIcon col="scrap_qty" /></th>
                            <th onClick={() => handleSort('achievement_pct')} className="text-right hover:bg-slate-100 transition-colors">達成% (T.Lệ Đạt) <SortIcon col="achievement_pct" /></th>
                            <th onClick={() => handleSort('scrap_rate_pct')} className="text-right hover:bg-slate-100 transition-colors">不良% (T.Lệ Phế) <SortIcon col="scrap_rate_pct" /></th>
                            <th onClick={() => handleSort('duration_min')} className="text-right hover:bg-slate-100 transition-colors">稼働(分) (T.gian) <SortIcon col="duration_min" /></th>
                        </tr>
                    </thead>
                    <tbody className="[&>tr]:border-b [&>tr]:border-slate-100 last:[&>tr]:border-0">
                        {displayRows.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="py-24 text-center">
                                    <div className="text-slate-500 font-bold mb-1 text-sm bg-slate-50 inline-block px-4 py-2 rounded">
                                        {isPending ? 'データ読込中… / Đang tải dữ liệu…' : 'データなし / Không có dữ liệu'}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayRows.map((row) => (
                                <tr key={row.log_id} className="hover:bg-blue-50/40 transition-colors [&>td]:py-2.5 [&>td]:px-3 [&>td]:border-r [&>td]:border-slate-50 last:[&>td]:border-r-0">
                                    <td className="text-[11px] text-slate-500">
                                        <div className="font-semibold text-slate-700">{fmtDate(row.start_time)}</div>
                                        <div className="text-[10px] mt-0.5 opacity-80">{fmtDate(row.end_time)}</div>
                                    </td>
                                    <td className="text-center">
                                        {row.machine_code ? (
                                            <span className="bg-[var(--mcs-surface-2)] text-[var(--mcs-primary)] border border-teal-100 px-2.5 py-0.5 rounded font-bold">{row.machine_code}</span>
                                        ) : '-'}
                                    </td>
                                    <td className="font-medium text-slate-700 max-w-[120px] truncate">{row.operator_name || '-'}</td>
                                    <td className="font-mono text-[11px] font-bold text-slate-800 tracking-tight">{row.product_pn_raw || '-'}</td>
                                    <td className="text-slate-600 font-medium text-[11px]">{row.slip_no || '-'}</td>

                                    <td className="text-right text-slate-400 font-medium">{fmtNum(row.planned_quantity)}</td>
                                    <td className="text-right font-bold text-[var(--mcs-primary)] text-[13px]">{fmtNum(row.produced_qty)}</td>
                                    <td className={`text-right font-medium ${row.scrap_qty && row.scrap_qty > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                                        {row.scrap_qty || '0'}
                                    </td>

                                    <td className={`text-right font-bold ${getAchievementColor(row.achievement_pct)}`}>
                                        {row.achievement_pct !== null ? `${row.achievement_pct}%` : '-'}
                                    </td>
                                    <td className={`text-right font-bold ${getScrapColor(row.scrap_rate_pct)}`}>
                                        {row.scrap_rate_pct !== null ? `${row.scrap_rate_pct}%` : '0%'}
                                    </td>
                                    <td className="text-right text-slate-500">
                                        {row.duration_min !== null ? <span className="bg-slate-100 px-1.5 py-0.5 rounded shadow-sm">{row.duration_min}</span> : '-'}
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
