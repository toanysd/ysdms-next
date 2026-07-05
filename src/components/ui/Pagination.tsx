import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination component — hỗ trợ hai chế độ:
 * 1. URL-driven (Server Components): truyền `baseUrl` + `currentPage`
 * 2. Callback (Client Components): truyền `onPageChange`
 *
 * RULE-DATA-1: Luôn dùng component này cho mọi list page có phân trang.
 */
export type PaginationProps = {
  currentPage: number
  totalRecords: number
  pageSize: number
  /** Chế độ URL-driven: base URL không có ?page=, VD: "/master/customers?q=abc&type=CUSTOMER" */
  baseUrl?: string
  /** Chế độ callback (Client Component) */
  onPageChange?: (page: number) => void
}

export function Pagination({ currentPage, totalRecords, pageSize, baseUrl, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalRecords)

  const prevPage = currentPage - 1
  const nextPage = currentPage + 1
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  // Helper: build URL cho URL-driven mode
  const pageUrl = (p: number) => {
    if (!baseUrl) return '#'
    const url = new URL(baseUrl, 'http://x')
    url.searchParams.set('page', String(p))
    return url.pathname + url.search
  }

  const prevEl = hasPrev ? (
    baseUrl
      ? <Link href={pageUrl(prevPage)} className="relative inline-flex items-center rounded-l-md px-2 py-1.5 text-[var(--text-muted)] ring-1 ring-inset ring-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-colors"><ChevronLeft size={16} /></Link>
      : <button onClick={() => onPageChange?.(prevPage)} className="relative inline-flex items-center rounded-l-md px-2 py-1.5 text-[var(--text-muted)] ring-1 ring-inset ring-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-colors"><ChevronLeft size={16} /></button>
  ) : (
    <span className="relative inline-flex items-center rounded-l-md px-2 py-1.5 text-[var(--text-muted)] ring-1 ring-inset ring-[var(--border-default)] opacity-40 cursor-not-allowed"><ChevronLeft size={16} /></span>
  )

  const nextEl = hasNext ? (
    baseUrl
      ? <Link href={pageUrl(nextPage)} className="relative inline-flex items-center rounded-r-md px-2 py-1.5 text-[var(--text-muted)] ring-1 ring-inset ring-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-colors"><ChevronRight size={16} /></Link>
      : <button onClick={() => onPageChange?.(nextPage)} className="relative inline-flex items-center rounded-r-md px-2 py-1.5 text-[var(--text-muted)] ring-1 ring-inset ring-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-colors"><ChevronRight size={16} /></button>
  ) : (
    <span className="relative inline-flex items-center rounded-r-md px-2 py-1.5 text-[var(--text-muted)] ring-1 ring-inset ring-[var(--border-default)] opacity-40 cursor-not-allowed"><ChevronRight size={16} /></span>
  )

  return (
    <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 sm:px-6 w-full rounded-b-lg shrink-0">
      <div className="flex flex-1 items-center justify-between">
        <p className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-jp)]">
          表示 <span className="font-medium text-[var(--text-primary)]">{startItem}</span> - <span className="font-medium text-[var(--text-primary)]">{endItem}</span> / <span className="font-medium text-[var(--text-primary)]">{totalRecords}</span> 件
          <span className="mx-2 text-[var(--border-default)]">|</span>
          <span className="font-[family-name:var(--font-vi)]">
            Hiển thị <span className="font-medium text-[var(--text-primary)]">{startItem}</span> - <span className="font-medium text-[var(--text-primary)]">{endItem}</span> / <span className="font-medium text-[var(--text-primary)]">{totalRecords}</span> dòng
          </span>
        </p>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          {prevEl}
          <span className="relative inline-flex items-center px-4 py-1.5 text-xs font-medium text-[var(--text-primary)] ring-1 ring-inset ring-[var(--border-default)] bg-[var(--bg-surface-2)]">
            {currentPage} / {totalPages}
          </span>
          {nextEl}
        </nav>
      </div>
    </div>
  )
}
