'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Building2,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react'
import { CompanyFormModal } from '@/components/master/CompanyFormModal'

/* ═══════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════ */
type CompanyType = 'CUSTOMER' | 'SUPPLIER' | 'SUBCONTRACTOR' | 'INTERNAL' | 'MOLD_OWNER'

interface Company {
  company_id: string
  company_code: string
  company_name: string
  company_name_romaji: string | null
  company_type: CompanyType[]
  order_folder_path: string | null
  cad_folder_path: string | null
  address: string | null
  tel: string | null
  fax: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

interface CompanyForm {
  company_code: string
  company_name: string
  company_name_romaji: string
  company_type: CompanyType[]
  address: string
  tel: string
  fax: string
  notes: string
}

/* ═══════════════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════════════ */
const COMPANY_TYPE_LABELS: Record<CompanyType, { ja: string; vi: string }> = {
  CUSTOMER:      { ja: '得意先',     vi: 'Khách hàng' },
  SUPPLIER:      { ja: '仕入先',     vi: 'Nhà cung cấp' },
  SUBCONTRACTOR: { ja: '外注',       vi: 'Gia công ngoài' },
  INTERNAL:      { ja: '自社',       vi: 'Nội bộ' },
  MOLD_OWNER:    { ja: '金型持主',   vi: 'Chủ khuôn' },
}

const COMPANY_TYPE_COLORS: Record<CompanyType, { bg: string; text: string }> = {
  CUSTOMER:      { bg: 'var(--status-info-bg)',    text: 'var(--status-info-text)' },
  SUPPLIER:      { bg: 'var(--status-warning-bg)', text: 'var(--status-warning-text)' },
  SUBCONTRACTOR: { bg: 'var(--status-error-bg)',   text: 'var(--status-error-text)' },
  INTERNAL:      { bg: 'var(--status-success-bg)', text: 'var(--status-success-text)' },
  MOLD_OWNER:    { bg: 'var(--status-neutral-bg)', text: 'var(--text-secondary)' },
}

const FILTER_TABS: { key: CompanyType | 'ALL'; ja: string; vi: string }[] = [
  { key: 'ALL',           ja: '全て',     vi: 'Tất cả' },
  { key: 'CUSTOMER',      ja: '得意先',   vi: 'Khách hàng' },
  { key: 'SUPPLIER',      ja: '仕入先',   vi: 'NCC' },
  { key: 'SUBCONTRACTOR', ja: '外注',     vi: 'Gia công' },
  { key: 'MOLD_OWNER',    ja: '金型持主', vi: 'Chủ khuôn' },
]

const ALL_TYPES: CompanyType[] = ['CUSTOMER', 'SUPPLIER', 'SUBCONTRACTOR', 'INTERNAL', 'MOLD_OWNER']

/* ═══════════════════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════════════════ */
export default function CompaniesPage() {
  const supabase = createClient()

  /* ── State ──────────────────────────────────────────────────────────── */
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<CompanyType | 'ALL'>('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  /* ── Fetch Data ─────────────────────────────────────────────────────── */
  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    let allData: Company[] = []
    let hasMore = true
    let page = 0

    while (hasMore) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('company_code', { ascending: true })
        .range(page * 1000, (page + 1) * 1000 - 1)

      if (error) break
      if (data) {
        allData = [...allData, ...(data as Company[])]
        if (data.length < 1000) {
          hasMore = false
        } else {
          page++
        }
      } else {
        hasMore = false
      }
    }
    
    setCompanies(allData)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  /* ── Filtered & Searched ────────────────────────────────────────────── */
  const filteredCompanies = useMemo(() => {
    let list = companies

    // Filter by type tab
    if (activeFilter !== 'ALL') {
      list = list.filter((c) => c.company_type?.includes(activeFilter))
    }

    // Search by name or code
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (c) =>
          c.company_code.toLowerCase().includes(q) ||
          c.company_name.toLowerCase().includes(q) ||
          (c.company_name_romaji && c.company_name_romaji.toLowerCase().includes(q))
      )
    }

    return list
  }, [companies, activeFilter, searchQuery])

  /* ── Tab counts ─────────────────────────────────────────────────────── */
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: companies.length }
    for (const t of ALL_TYPES) {
      counts[t] = companies.filter((c) => c.company_type?.includes(t)).length
    }
    return counts
  }, [companies])

  /* ── Modal handlers ─────────────────────────────────────────────────── */
  /* ── Modal handlers ─────────────────────────────────────────────────── */
  const openAddModal = () => {
    setEditingId(null)
    setModalOpen(true)
  }

  const openEditModal = (company: Company) => {
    setEditingId(company.company_id)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
  }

  /* ── Toggle Active ──────────────────────────────────────────────────── */
  const toggleActive = async (company: Company) => {
    await supabase
      .from('companies')
      .update({ is_active: !company.is_active, updated_at: new Date().toISOString() })
      .eq('company_id', company.company_id)
    fetchCompanies()
  }

  /* ── Delete ─────────────────────────────────────────────────────────── */
  const handleDelete = async (id: string) => {
    await supabase.from('companies').delete().eq('company_id', id)
    setDeleteConfirm(null)
    fetchCompanies()
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-3">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h1
              className="text-[15px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
            >
              会社・得意先マスター
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Quản lý Công ty &amp; Khách hàng
            </span>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="h-[32px] px-3 text-[12px] font-semibold rounded flex items-center gap-1.5 cursor-pointer border-none"
          style={{ background: 'var(--accent)', color: 'var(--text-inverse)' }}
        >
          <Plus size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>新規追加</span>
        </button>
      </div>

      {/* ── Filter Tabs + Search ──────────────────────────────────────── */}
      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className="h-[28px] px-2.5 text-[11px] font-semibold rounded cursor-pointer border-none flex items-center gap-1.5"
                  style={{
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-jp)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {tab.ja}
                  <span
                    className="text-[9px] rounded-full min-w-[18px] h-[16px] flex items-center justify-center"
                    style={{
                      background: isActive ? 'var(--accent)' : 'var(--bg-surface-3)',
                      color: isActive ? 'var(--text-inverse)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-vi)',
                      padding: '0 4px',
                    }}
                  >
                    {tabCounts[tab.key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="コード・名前で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[28px] text-[12px] rounded pl-7 pr-2"
              style={{
                width: '220px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Data Table ────────────────────────────────────────────────── */}
      <div className="card-flat overflow-hidden">
        <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>
                  <span className="ja">コード</span>
                  <span className="vi">Mã</span>
                </th>
                <th style={{ width: '220px' }}>
                  <span className="ja">会社名</span>
                  <span className="vi">Tên công ty</span>
                </th>
                <th style={{ width: '200px' }}>
                  <span className="ja">ローマ字</span>
                  <span className="vi">Romaji</span>
                </th>
                <th style={{ width: '220px' }}>
                  <span className="ja">種別</span>
                  <span className="vi">Loại</span>
                </th>
                <th style={{ width: '120px' }}>
                  <span className="ja">電話番号</span>
                  <span className="vi">SĐT</span>
                </th>
                <th style={{ width: '70px', textAlign: 'center' }}>
                  <span className="ja">状態</span>
                  <span className="vi">Trạng thái</span>
                </th>
                <th style={{ width: '90px', textAlign: 'center' }}>
                  <span className="ja">操作</span>
                  <span className="vi">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-[12px]">読み込み中...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    <span className="text-[12px]">データなし / Không có dữ liệu</span>
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCompanies.map((company) => (
                  <tr key={company.company_id}>
                    {/* Code */}
                    <td>
                      <span
                        className="font-mono font-bold text-[12px]"
                        style={{ color: 'var(--accent)' }}
                      >
                        {company.company_code}
                      </span>
                    </td>

                    {/* Name */}
                    <td>
                      <span
                        className="font-semibold text-[12px]"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
                      >
                        {company.company_name}
                      </span>
                    </td>

                    {/* Romaji */}
                    <td>
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {company.company_name_romaji || '—'}
                      </span>
                    </td>

                    {/* Type badges */}
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {company.company_type?.map((type) => {
                          const colors = COMPANY_TYPE_COLORS[type]
                          const labels = COMPANY_TYPE_LABELS[type]
                          return (
                            <span
                              key={type}
                              className="rounded-full font-semibold"
                              style={{
                                display: 'inline-block',
                                fontSize: '10px',
                                padding: '1px 7px',
                                background: colors?.bg || 'var(--status-neutral-bg)',
                                color: colors?.text || 'var(--text-secondary)',
                                lineHeight: '1.6',
                              }}
                            >
                              {labels?.ja || type}
                            </span>
                          )
                        })}
                      </div>
                    </td>

                    {/* Tel */}
                    <td>
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {company.tel || '—'}
                      </span>
                    </td>

                    {/* Active status */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => toggleActive(company)}
                        className="cursor-pointer border-none bg-transparent p-0"
                        title={company.is_active ? '有効 / Đang hoạt động' : '無効 / Ngưng hoạt động'}
                      >
                        {company.is_active ? (
                          <ToggleRight size={20} style={{ color: 'var(--status-success)' }} />
                        ) : (
                          <ToggleLeft size={20} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(company)}
                          className="flex items-center justify-center rounded cursor-pointer"
                          style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid var(--border-default)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-secondary)',
                            transition: 'all 120ms ease',
                          }}
                          title="編集 / Chỉnh sửa"
                        >
                          <Edit2 size={13} />
                        </button>
                        {deleteConfirm === company.company_id ? (
                          <button
                            onClick={() => handleDelete(company.company_id)}
                            className="flex items-center justify-center rounded cursor-pointer text-[10px] font-bold"
                            style={{
                              height: '28px',
                              padding: '0 8px',
                              border: 'none',
                              background: 'var(--status-error)',
                              color: '#fff',
                            }}
                          >
                            確認
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(company.company_id)}
                            className="flex items-center justify-center rounded cursor-pointer"
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid var(--border-default)',
                              background: 'var(--bg-surface)',
                              color: 'var(--text-muted)',
                              transition: 'all 120ms ease',
                            }}
                            title="削除 / Xóa"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Row count footer */}
        {!loading && (
          <div
            className="flex items-center justify-between px-3 py-1.5"
            style={{
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-2)',
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}
          >
            <span>
              {filteredCompanies.length} / {companies.length} 件
            </span>
            <span style={{ fontFamily: 'var(--font-jp)' }}>
              {activeFilter !== 'ALL'
                ? `フィルター: ${FILTER_TABS.find((t) => t.key === activeFilter)?.ja}`
                : '全件表示'}
            </span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
         Add / Edit Modal
         ═══════════════════════════════════════════════════════════════════ */}
      <CompanyFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSaved={(id) => {
          closeModal()
          fetchCompanies()
        }}
        initialCompanyId={editingId}
      />
    </div>
  )
}
