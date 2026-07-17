'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState, useTransition } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ClipboardList, Clock, Filter, X } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Employee = { employee_id: string; employee_code: string; employee_name: string | null }
type JobOption = { job_id: string; job_code: string; job_name: string | null }

type WorklogRow = {
  log_id: string
  work_date: string | null
  hours_spent: number | null
  is_finished: boolean | null
  notes: string | null
  job_step: {
    step_id: string
    step_no: number | null
    step_name: string | null
    deadline: string | null
    job: { job_id: string; job_code: string; job_name: string | null } | null
  } | null
  employee: { employee_id: string; employee_code: string; employee_name: string | null } | null
}

type Filters = {
  jobFilter: string | null
  empFilter: string | null
  dateFrom: string | null
  dateTo: string | null
  statusFilter: string
}

type Props = {
  logs: WorklogRow[]
  totalCount: number
  page: number
  pageSize: number
  employees: Employee[]
  jobs: JobOption[]
  hoursByJob: Record<string, number>
  filters: Filters
  error: string | null
}

// ── Badge Config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  finished:    { labelJA: '完了',   labelVI: 'Hoàn thành', badgeClass: 'badge badge--success' },
  in_progress: { labelJA: '作業中', labelVI: 'Đang chạy',  badgeClass: 'badge badge--info'    },
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatHours(h: number | null) {
  if (h == null) return '—'
  return `${h.toFixed(1)}h`
}

// ── Sorting helpers ───────────────────────────────────────────────────────────
type SortKey = 'work_date' | 'job_code' | 'step' | 'employee' | 'hours' | 'job_total' | 'status' | null
type SortDir = 'asc' | 'desc'

function getSortValue(log: WorklogRow, key: SortKey, hoursByJob: Record<string, number>): string | number {
  switch (key) {
    case 'work_date':  return log.work_date ?? ''
    case 'job_code':   return log.job_step?.job?.job_code ?? ''
    case 'step':       return log.job_step?.step_no ?? 0
    case 'employee':   return log.employee?.employee_code ?? ''
    case 'hours':      return log.hours_spent ?? 0
    case 'job_total': {
      const jid = log.job_step?.job?.job_id
      return jid ? (hoursByJob[jid] ?? 0) : 0
    }
    case 'status':     return log.is_finished ? 1 : 0
    default:           return ''
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function WorklogTable({
  logs, totalCount, page, pageSize,
  employees, jobs, hoursByJob, filters, error,
}: Props) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const totalPages = Math.ceil(totalCount / pageSize)

  // ── Client-side sorting ─────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortKey(null); setSortDir('asc') }
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }, [sortKey, sortDir])

  const sortedLogs = useMemo(() => {
    if (!sortKey) return logs
    return [...logs].sort((a, b) => {
      const va = getSortValue(a, sortKey, hoursByJob)
      const vb = getSortValue(b, sortKey, hoursByJob)
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [logs, sortKey, sortDir, hoursByJob])

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown size={12} style={{ opacity: 0.35 }} />
    return sortDir === 'asc'
      ? <ArrowUp size={12} style={{ color: 'var(--accent)' }} />
      : <ArrowDown size={12} style={{ color: 'var(--accent)' }} />
  }

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === '' || v === 'all') params.delete(k)
        else params.set(k, v)
      }
      params.delete('page')
      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [router, pathname, searchParams]
  )

  const clearFilters = () => startTransition(() => router.push(pathname))

  const hasFilters = !!(
    filters.jobFilter || filters.empFilter ||
    filters.dateFrom  || filters.dateTo    ||
    filters.statusFilter !== 'all'
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── PageHeader ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ClipboardList size={20} style={{ color: 'var(--accent)' }} />
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            <span className="ja">作業ログ</span>
            <span className="vi">Nhật ký Sản xuất</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <span className="ja">{totalCount.toLocaleString()} 件</span>
            <span className="vi">{totalCount.toLocaleString()} bản ghi</span>
          </span>
          <Link href="/worklogs/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className="ja">＋ 新規作成</span>
            <span className="vi">＋ Tạo mới</span>
          </Link>
        </div>
      </div>

      {/* ── FilterBar ──────────────────────────────────────────────────── */}
      <div className="card-flat" style={{ padding: '10px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Filter size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />

          {/* Job */}
          <select
            className="form-select"
            style={{ minWidth: 200 }}
            value={filters.jobFilter ?? ''}
            onChange={e => updateParams({ job_id: e.target.value || null })}
          >
            <option value="">— Job —</option>
            {jobs.map(j => (
              <option key={j.job_id} value={j.job_id}>
                {j.job_code}{j.job_name ? ` · ${j.job_name}` : ''}
              </option>
            ))}
          </select>

          {/* Nhân viên */}
          <select
            className="form-select"
            style={{ minWidth: 170 }}
            value={filters.empFilter ?? ''}
            onChange={e => updateParams({ employee_id: e.target.value || null })}
          >
            <option value="">— 担当 / Nhân viên —</option>
            {employees.map(e => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.employee_code}{e.employee_name ? ` · ${e.employee_name}` : ''}
              </option>
            ))}
          </select>

          {/* Date range */}
          <input
            type="date" className="form-input" style={{ width: 145 }}
            value={filters.dateFrom ?? ''}
            onChange={e => updateParams({ date_from: e.target.value || null })}
          />
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>～</span>
          <input
            type="date" className="form-input" style={{ width: 145 }}
            value={filters.dateTo ?? ''}
            onChange={e => updateParams({ date_to: e.target.value || null })}
          />

          {/* Status */}
          <select
            className="form-select"
            style={{ minWidth: 160 }}
            value={filters.statusFilter}
            onChange={e => updateParams({ status: e.target.value })}
          >
            <option value="all">— ステータス / Trạng thái —</option>
            <option value="finished">完了 / Hoàn thành</option>
            <option value="in_progress">作業中 / Đang chạy</option>
          </select>

          {hasFilters && (
            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={clearFilters}
            >
              <X size={13} />
              <span className="ja">クリア</span>
              <span className="vi">Xóa lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto' }}>
        {error && (
          <p style={{ color: 'var(--color-error)', padding: 16 }}>{error}</p>
        )}
        <table
          className="data-table"
          style={{ opacity: isPending ? 0.55 : 1, transition: 'opacity 0.15s' }}
        >
          <thead>
            <tr>
              <th style={{ width: 110, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('work_date')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ja">作業日</span>
                  <span className="vi">Ngày làm</span>
                  <SortIcon col="work_date" />
                </div>
              </th>
              <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('job_code')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ja">ジョブ</span>
                  <span className="vi">Job</span>
                  <SortIcon col="job_code" />
                </div>
              </th>
              <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('step')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ja">工程</span>
                  <span className="vi">Bước</span>
                  <SortIcon col="step" />
                </div>
              </th>
              <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('employee')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ja">担当者</span>
                  <span className="vi">Nhân viên</span>
                  <SortIcon col="employee" />
                </div>
              </th>
              <th style={{ width: 90, textAlign: 'right', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('hours')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  <span className="ja">時間</span>
                  <span className="vi">Giờ</span>
                  <SortIcon col="hours" />
                </div>
              </th>
              <th style={{ width: 130, textAlign: 'right', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('job_total')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  <Clock size={12} />
                  <span className="ja">Job合計</span>
                  <span className="vi">Tổng/Job</span>
                  <SortIcon col="job_total" />
                </div>
              </th>
              <th style={{ width: 115, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('status')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="ja">ステータス</span>
                  <span className="vi">Trạng thái</span>
                  <SortIcon col="status" />
                </div>
              </th>
              <th>
                <span className="ja">備考</span>
                <span className="vi">Ghi chú</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-secondary)' }}>
                  <span className="ja">データなし</span>
                  <span className="vi"> — Không có dữ liệu</span>
                </td>
              </tr>
            ) : (
              sortedLogs.map(log => {
                const jobId    = log.job_step?.job?.job_id ?? null
                const jobTotal = jobId ? (hoursByJob[jobId] ?? null) : null
                const statusKey: keyof typeof STATUS_CONFIG =
                  log.is_finished ? 'finished' : 'in_progress'
                const status = STATUS_CONFIG[statusKey]

                return (
                  <tr key={log.log_id}>
                    <td style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {formatDate(log.work_date)}
                    </td>
                    <td>
                      {log.job_step?.job ? (
                        <Link
                          href={`/equipment/jobs/${log.job_step.job.job_id}`}
                          style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', fontSize: 13, textDecoration: 'none' }}
                        >
                          {log.job_step.job.job_code}
                          {log.job_step.job.job_name && (
                            <span style={{ fontWeight: 400, fontFamily: 'inherit', color: 'var(--text-secondary)', marginLeft: 4 }}>
                              {log.job_step.job.job_name}
                            </span>
                          )}
                        </Link>
                      ) : '—'}
                    </td>
                    <td>
                      {log.job_step ? (
                        <span>
                          <span style={{ color: 'var(--text-secondary)', marginRight: 4 }}>#{log.job_step.step_no}</span>
                          {log.job_step.step_name ?? ''}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      {log.employee ? (
                        <>
                          <span style={{ fontWeight: 500 }}>{log.employee.employee_code}</span>
                          {log.employee.employee_name && (
                            <span style={{ color: 'var(--text-secondary)', marginLeft: 4 }}>
                              {log.employee.employee_name}
                            </span>
                          )}
                        </>
                      ) : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {formatHours(log.hours_spent)}
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                      {jobTotal !== null ? formatHours(jobTotal) : '—'}
                    </td>
                    <td>
                      <span className={status.badgeClass}>
                        <span className="ja">{status.labelJA}</span>
                        <span className="vi">{status.labelVI}</span>
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 200 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.notes ?? '—'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexShrink: 0, padding: '4px 0' }}>
          <button
            className="btn-secondary"
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
          >
            ←
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {page} / {totalPages}
          </span>
          <button
            className="btn-secondary"
            disabled={page >= totalPages}
            onClick={() => updateParams({ page: String(page + 1) })}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
