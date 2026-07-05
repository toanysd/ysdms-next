'use client'

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

const STATUS_LABELS: Record<string, { ja: string; vi: string; color: string }> = {
  NEW:         { ja: '新規',       vi: 'Mới tạo',       color: 'var(--status-info)' },
  IN_PROGRESS: { ja: '進行中',     vi: 'Đang chạy',     color: 'var(--status-warning)' },
  COMPLETED:   { ja: '完了',       vi: 'Hoàn thành',    color: 'var(--status-success)' },
  CANCELLED:   { ja: 'キャンセル', vi: 'Đã hủy',        color: 'var(--text-muted)' },
}

import React, { Suspense } from 'react'

function JobsPageContent() {
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

  const SortableHeader = ({ col, ja, vi, style }: { col: string, ja: string, vi: string, style?: React.CSSProperties }) => (
    <th 
      style={{ ...style, cursor: 'pointer', userSelect: 'none' }} 
      onClick={() => handleSort(col)}
      title="クリックしてソート / Bấm để sắp xếp"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div>
          <span className="ja">{ja}</span>
          <span className="vi">{vi}</span>
        </div>
        <SortIcon col={col} />
      </div>
    </th>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-4)' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
            title="前のページに戻る / Quay lại trang trước"
          >
            <ArrowLeft size={13} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>戻る</span>
          </button>
          <Link
            href="/equipment/jobs"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            title="一覧へ / Về danh sách Job"
            onClick={() => { setSearch(''); setFilterStatus(''); router.replace('/equipment/jobs') }}
          >
            <ArrowUpFromLine size={12} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>一覧</span>
          </Link>
          <Briefcase size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="ja" style={{ fontSize: 16 }}>ジョブ管理</span>
            <span className="vi" style={{ fontSize: 11 }}>Quản lý Job gia công</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={14} />
          <span className="ja" style={{ fontFamily: 'var(--font-jp)' }}>新規ジョブ</span>
        </button>
      </div>

      {/* ── Toolbar (Search & Filters) ── */}
      <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="コード・名前検索..."
            className="form-input form-input-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && history.length > 0 && (
            <SearchSuggestions
              history={history}
              onSelect={setSearch}
              onRemove={removeFromHistory}
              onClear={clearHistory}
              visible={showSuggestions}
              onClose={() => setShowSuggestions(false)}
            />
          )}
        </div>

        <div style={{ position: 'relative', width: 200 }}>
          <Filter size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-muted)' }} />
          <select
            className="form-input form-input-search"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">全てのステータス</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label.ja}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: 9, color: 'var(--text-muted)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', padding: 0 }}>
        {(urlSearchParams.get('mold') || urlSearchParams.get('revision') || urlSearchParams.get('physical_mold')) && (
          <div className="px-3 py-2 bg-slate-50 border-b text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              <span className="font-bold mr-1">フィルタ:</span>
              <span className="opacity-70 mr-2 text-[10px]">Đang lọc theo:</span>
              {urlSearchParams.get('mold') && (
                <span className="mr-3"><strong className="text-slate-800">Sản phẩm: {urlSearchParams.get('mold')}</strong></span>
              )}
              {urlSearchParams.get('revision') && (
                <span className="mr-3"><strong className="text-slate-800">ID Phiên bản thiết kế: {urlSearchParams.get('revision')}</strong></span>
              )}
              {urlSearchParams.get('physical_mold') && (
                <span><strong className="text-slate-800">ID Khuôn vật lý: {urlSearchParams.get('physical_mold')}</strong></span>
              )}
            </span>
            <button 
              onClick={() => {
                const p = new URLSearchParams(window.location.search)
                p.delete('mold')
                p.delete('revision')
                p.delete('physical_mold')
                router.replace(`${pathname}${p.toString() ? '?' + p.toString() : ''}`)
              }}
              className="text-slate-400 hover:text-slate-800"
              title="Xóa bộ lọc"
            ><X size={14} /></button>
          </div>
        )}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <SortableHeader col="job_code" ja="ジョブコード" vi="Job Code" style={{ width: 140 }} />
                <SortableHeader col="job_name" ja="ジョブ名" vi="Tên Job" style={{ width: 200 }} />
                <th style={{ width: 120 }}>
                  <span className="ja">タイプ</span>
                  <span className="vi">Loại</span>
                </th>
                <th style={{ width: 150 }}>
                  <span className="ja">金型</span>
                  <span className="vi">Khuôn</span>
                </th>
                <th style={{ width: 140 }}>
                  <span className="ja">寸法</span>
                  <span className="vi">Kích thước</span>
                </th>
                <th style={{ width: 120 }}>
                  <span className="ja">素材</span>
                  <span className="vi">Vật liệu</span>
                </th>
                <th style={{ width: 120 }}>
                  <span className="ja">客先</span>
                  <span className="vi">Khách hàng</span>
                </th>
                <SortableHeader col="job_status" ja="状態" vi="Trạng thái" style={{ width: 100 }} />
                <SortableHeader col="overall_progress" ja="進捗" vi="Tiến độ" style={{ width: 100 }} />
                <SortableHeader col="mold_deadline" ja="期限" vi="Hạn" style={{ width: 110 }} />
                <SortableHeader col="created_at" ja="作成日" vi="Ngày tạo" style={{ width: 100 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: 'center' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto', color: 'var(--accent)' }} />
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    データがありません / Không có dữ liệu
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
                            {job.job_types.job_type_name_ja}
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
                          {st.ja}
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
