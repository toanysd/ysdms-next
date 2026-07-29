'use client'

import { useTranslations, useLocale } from 'next-intl'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Filter, Search,
  ChevronDown, Loader2, Briefcase, Calendar,
  ArrowUp, ArrowDown, ArrowUpDown, X,
  ArrowLeft, ArrowUpFromLine
} from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import Link from 'next/link'
import { CreateJobModal } from '@/components/equipment/CreateJobModal'

type JobRow = {
  job_id: string
  job_code: string
  job_name: string
  job_status: string | null
  overall_progress: number | null
  mold_deadline: string | null
  created_at: string | null
  priority: number | null
  job_types: { job_type_name_ja: string; job_type_name_vi: string } | null
  companies: { company_name: string } | null
  physical_molds: { physical_mold_id: string; display_name: string; system_code: string; actual_length_mm: string | null; actual_width_mm: string | null; actual_height_mm: string | null } | null
  design_revisions: { design_length: number | null; design_width: number | null; design_height: number | null; plastic_type_designed: string | null } | null
  products: { product_id: string; product_code: string; product_name: string | null; product_name_internal: string | null; product_material_specs: { material_type: string }[] } | null
}

const STATUS_LABELS: Record<string, { key: string; color: string }> = {
  NEW:         { key: 'NEW',         color: 'var(--status-info)' },
  IN_PROGRESS: { key: 'IN_PROGRESS', color: 'var(--status-warning)' },
  COMPLETED:   { key: 'COMPLETED',   color: 'var(--status-success)' },
  CANCELLED:   { key: 'CANCELLED',   color: 'var(--text-muted)' },
}

import React, { Suspense } from 'react'

function JobsPageContent() {
  const t = useTranslations('Equipment.Jobs')
  const locale = useLocale()
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()

  const [jobs, setJobs] = useState<JobRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Init from URL params
  const [search, setSearch] = useState(urlSearchParams.get('search') || '')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const filterMold = urlSearchParams.get('mold') || ''
  const filterRevision = urlSearchParams.get('revision') || ''
  const filterPhysicalMold = urlSearchParams.get('physical_mold') || ''
  
  // Sorting state
  const [sortCol, setSortCol] = useState(urlSearchParams.get('sort') || 'created_at')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>((urlSearchParams.get('dir') as 'asc'|'desc') || 'desc')
  
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Pagination & Search
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const PAGE_SIZE = 50
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_jobs')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
      if (search.trim().length >= 2) addToHistory(search.trim())
    }, 500)
    return () => clearTimeout(timer)
  }, [search, addToHistory])

  // ── Write state back to URL so router.back() restores state ──
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      
      if (search) params.set('search', search)
      else params.delete('search')
      
      if (sortCol !== 'created_at') params.set('sort', sortCol)
      else params.delete('sort')
      
      if (sortDir !== 'desc') params.set('dir', sortDir)
      else params.delete('dir')
      
      if (filterStatus) params.set('status', filterStatus)
      else params.delete('status')
      
      const newQS = params.toString()
      const currentQS = new URLSearchParams(window.location.search).toString()
      
      if (newQS !== currentQS) {
        router.replace(`${pathname}${newQS ? '?' + newQS : ''}`, { scroll: false })
      }
    }, 400)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortCol, sortDir, filterStatus])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('jobs')
      .select(`
        job_id,
        job_code,
        job_name,
        job_status,
        overall_progress,
        mold_deadline,
        created_at,
        priority,
        job_types(job_type_name_ja, job_type_name_vi),
        companies!jobs_company_id_fkey(company_name),
        physical_molds(physical_mold_id, display_name, system_code, actual_length_mm, actual_width_mm, actual_height_mm),
        design_revisions!jobs_design_revision_id_fkey(revision_id, design_code, design_length, design_width, design_height, plastic_type_designed),
        products${filterMold ? '!inner' : ''}!jobs_product_id_fkey(product_id, product_code, product_name, product_name_internal, product_material_specs(material_type))
      `, { count: 'exact' })

    if (debouncedSearch) {
      query = query.or(`job_code.ilike.%${debouncedSearch}%,job_name.ilike.%${debouncedSearch}%`)
    }
    if (filterStatus) {
      query = query.eq('job_status', filterStatus)
    }
    if (filterMold) {
      query = query.eq('products.product_code', filterMold)
    }
    if (filterRevision) {
      query = query.eq('design_revision_id', filterRevision)
    }
    if (filterPhysicalMold) {
      query = query.eq('physical_mold_id', filterPhysicalMold)
    }

    // Pagination & Sorting
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to).order(sortCol, { ascending: sortDir === 'asc' })

    const { data, count, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
      setJobs([])
    } else {
      setJobs(data as any[])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [supabase, debouncedSearch, filterStatus, filterMold, page, sortCol, sortDir])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={12} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  const SortableHeader = ({ col, style }: { col: string, style?: React.CSSProperties }) => {
    return (
      <th 
        style={{ ...style, cursor: 'pointer', userSelect: 'none' }} 
        onClick={() => handleSort(col)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div>
            {col === 'job_code' && t('cols.jobCode')}
            {col === 'job_name' && t('cols.jobName')}
            {col === 'job_status' && t('cols.status')}
            {col === 'overall_progress' && t('cols.progress')}
            {col === 'mold_deadline' && t('cols.deadline')}
            {col === 'created_at' && t('cols.createdAt')}
          </div>
          <SortIcon col={col} />
        </div>
      </th>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-4)' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
            title={t('backTitle')}
          >
            <ArrowLeft size={13} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{t('back')}</span>
          </button>
          <Link
            href="/equipment/jobs"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            title={t('listTitle')}
            onClick={() => { setSearch(''); setFilterStatus(''); router.replace('/equipment/jobs') }}
          >
            <ArrowUpFromLine size={12} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{t('list')}</span>
          </Link>
          <Briefcase size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{t('title')}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('subtitle')}</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={14} />
          {t('createJob')}
        </button>
      </div>

      {/* ── Search & Filters ── */}
      <div className="card-flat" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-surface-2)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, position: 'relative' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            className="form-input form-input-search"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <SearchSuggestions
            history={history}
            visible={showSuggestions}
            onSelect={(val) => {
              setSearch(val)
              setShowSuggestions(false)
            }}
            onRemove={removeFromHistory}
            onClear={clearHistory}
            onClose={() => setShowSuggestions(false)}
          />
        </div>
        
        <select
          className="form-input"
          style={{ width: 180 }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">{t('statusAll')}</option>
          <option value="NEW">NEW</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="card-flat" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <SortableHeader col="job_code" style={{ width: 140 }} />
                <SortableHeader col="job_name" />
                <th style={{ width: 100 }}>
                  {t('cols.type')}
                </th>
                <th style={{ width: 150 }}>
                  {t('cols.product')}
                </th>
                <th style={{ width: 140 }}>
                  {t('cols.size')}
                </th>
                <th style={{ width: 120 }}>
                  {t('cols.material')}
                </th>
                <th style={{ width: 120 }}>
                  {t('cols.customer')}
                </th>
                <SortableHeader col="job_status" style={{ width: 100 }} />
                <SortableHeader col="overall_progress" style={{ width: 100 }} />
                <SortableHeader col="mold_deadline" style={{ width: 110 }} />
                <SortableHeader col="created_at" style={{ width: 100 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ padding: 40, textAlign: 'center' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto', color: 'var(--accent)' }} />
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    {t('noData')}
                  </td>
                </tr>
              ) : (
                jobs.map(job => {
                  const st = STATUS_LABELS[job.job_status || ''] || STATUS_LABELS['NEW']
                  return (
                    <tr key={job.job_id}>
                      <td>
                        <Link
                          href={`/equipment/jobs/${job.job_id}`}
                          style={{
                            color: 'var(--accent)', fontWeight: 700,
                            fontFamily: 'monospace', fontSize: 13, textDecoration: 'none'
                          }}
                        >
                          {job.job_code}
                        </Link>
                      </td>
                      <td style={{ fontWeight: 600 }}>{job.job_name}</td>
                      <td>
                        {job.job_types ? (
                          <span style={{ fontFamily: 'var(--font-jp)' }}>
                            {locale === 'vi' ? job.job_types.job_type_name_vi : job.job_types.job_type_name_ja}
                          </span>
                        ) : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {job.physical_molds && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <Link href={`/equipment/molds/${job.physical_molds.physical_mold_id}`} style={{ fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', fontSize: 12 }}>
                                {job.physical_molds.display_name} (VL)
                              </Link>
                            </div>
                          )}
                          {job.products && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <Link href={`/master/products/${job.products.product_id}`} style={{ fontWeight: 600, color: 'var(--status-info)', textDecoration: 'none', fontSize: 12 }}>
                                {job.products.product_code} (SP)
                              </Link>
                            </div>
                          )}
                          {!job.physical_molds && !job.products && <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {(job.design_revisions?.design_length || job.physical_molds?.actual_length_mm) ? (
                            <>
                              {job.design_revisions?.design_length && <span>TK: {job.design_revisions.design_length}×{job.design_revisions.design_width}×{job.design_revisions.design_height}</span>}
                              {job.physical_molds?.actual_length_mm && <span>Thực: {job.physical_molds.actual_length_mm}×{job.physical_molds.actual_width_mm}×{job.physical_molds.actual_height_mm}</span>}
                            </>
                          ) : '—'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 11, color: 'var(--text-secondary)' }}>
                          {job.products?.product_name ? (
                            <>
                              <span style={{ fontWeight: 600 }}>{job.products.product_name}</span>
                              {job.design_revisions?.plastic_type_designed && <span style={{ color: 'var(--status-info)', fontWeight: 500 }}>{job.design_revisions.plastic_type_designed}</span>}
                            </>
                          ) : job.design_revisions?.plastic_type_designed ? (
                            <span style={{ color: 'var(--status-info)', fontWeight: 500 }}>{job.design_revisions.plastic_type_designed}</span>
                          ) : '—'}
                        </div>
                      </td>
                      <td>{job.companies?.company_name || '—'}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: st.color, color: '#fff' }}>
                          {st ? t(`statusLabels.${st.key}`) : job.job_status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, height: 4, background: 'var(--bg-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${job.overall_progress || 0}%`,
                              background: job.job_status === 'COMPLETED' ? 'var(--status-success)' : 'var(--accent)'
                            }} />
                          </div>
                          <span style={{ fontSize: 10, fontFamily: 'monospace' }}>{job.overall_progress || 0}%</span>
                        </div>
                      </td>
                      <td>
                        {job.mold_deadline ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={10} style={{ color: 'var(--text-muted)' }} />
                            {new Date(job.mold_deadline).toLocaleDateString('ja-JP')}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {job.created_at ? new Date(job.created_at).toLocaleDateString('ja-JP') : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && totalRecords > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)' }}>
            <Pagination
              currentPage={page}
              totalRecords={totalRecords}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateJobModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchJobs()
          }}
        />
      )}
    </div>
  )
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  )
}
