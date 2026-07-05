'use client'

import { Download } from 'lucide-react'

interface ExportCSVButtonProps {
    data: Record<string, unknown>[]
    filename: string
    headers?: Record<string, string> // { dbColumn: 'Display Header' }
    label?: string
}

/**
 * Client Component: Export mảng dữ liệu ra file CSV với BOM (hỗ trợ tiếng Nhật/Việt)
 */
export default function ExportCSVButton({ data, filename, headers, label }: ExportCSVButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) return

        // Determine columns
        const columns = headers ? Object.keys(headers) : Object.keys(data[0])
        const headerRow = headers
            ? columns.map(col => headers[col])
            : columns

        // Build CSV rows
        const rows = data.map(row =>
            columns.map(col => {
                const val = row[col]
                if (val === null || val === undefined) return ''
                const str = String(val)
                // Escape quotes and wrap if contains comma/newline
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`
                }
                return str
            }).join(',')
        )

        // BOM + Header + Data
        const BOM = '\uFEFF'
        const csv = BOM + headerRow.join(',') + '\n' + rows.join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <button
            onClick={handleExport}
            disabled={!data || data.length === 0}
            className="bg-white hover:bg-teal-50 border border-teal-300 text-teal-700 h-[30px] px-3 flex items-center gap-1.5 text-xs rounded transition-colors shadow-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            title="CSV出力 / Xuất CSV"
        >
            <Download size={14} />
            {label || 'CSV出力'}
        </button>
    )
}
