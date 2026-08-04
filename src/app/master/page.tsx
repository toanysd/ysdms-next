'use client'

import { useTranslations } from 'next-intl'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
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

const COMPANY_TYPE_COLORS: Record<CompanyType, { bg: string; text: string }> = {
  CUSTOMER:      { bg: 'var(--status-info-bg)',    text: 'var(--status-info-text)' },
  SUPPLIER:      { bg: 'var(--status-warning-bg)', text: 'var(--status-warning-text)' },
  SUBCONTRACTOR: { bg: 'var(--status-error-bg)',   text: 'var(--status-error-text)' },
  INTERNAL:      { bg: 'var(--status-success-bg)', text: 'var(--status-success-text)' },
  MOLD_OWNER:    { bg: 'var(--status-neutral-bg)', text: 'var(--text-secondary)' },
}

const FILTER_TAB_KEYS: (CompanyType | 'ALL')[] = ['ALL', 'CUSTOMER', 'SUPPLIER', 'SUBCONTRACTOR', 'MOLD_OWNER']
const ALL_TYPES: CompanyType[] = ['CUSTOMER', 'SUPPLIER', 'SUBCONTRACTOR', 'INTERNAL', 'MOLD_OWNER']

/* ═══════════════════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════════════════ */
export default function CompaniesPage() {
  const t = useTranslations()
  const supabase = createClient()

  /* ── State ──────────────────────────────────────────────────────────── */
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
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
  }, [supabase])

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
    for (const type of ALL_TYPES) {
      counts[type] = companies.filter((c) => c.company_type?.includes(type)).length
    }
    return counts
  }, [companies])

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

  const getTypeLabel = (type: CompanyType) => {
    switch (type) {
      case 'CUSTOMER': return t('Customers.customer')
      case 'SUPPLIER': return t('Customers.vendor')
      case 'SUBCONTRACTOR': return t('Master.loai')
      case 'INTERNAL': return t('Master.chinh')
      case 'MOLD_OWNER': return t('Master.khachHangChuSoHuu')
      default: return type
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Building2 size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h1
              className="text-[15px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
            >
              {t('Master.companyMaster')}
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t('Master.companyMasterSub')}
            </span>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn-primary h-[32px] px-3 text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>{t('Common.addNew')}</span>
        </button>
      </div>

      {/* ── Filter Tabs + Search ──────────────────────────────────────── */}
      <div className="card-flat shrink-0" style={{ padding: '8px 12px' }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {FILTER_TAB_KEYS.map((key) => {
              const isActive = activeFilter === key
              const label = key === 'ALL' ? t('Common.all') : getTypeLabel(key)
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className="h-[28px] px-2.5 text-[11px] font-semibold rounded cursor-pointer border-none flex items-center gap-1.5"
                  style={{
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {label}
                  <span
                    className="text-[9px] rounded-full min-w-[18px] h-[16px] flex items-center justify-center font-mono font-bold"
                    style={{
                      background: isActive ? 'var(--accent)' : 'var(--bg-surface-3)',
                      color: isActive ? 'var(--text-inverse)' : 'var(--text-muted)',
                      padding: '0 4px',
                    }}
                  >
                    {tabCounts[key] ?? 0}
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
              placeholder={t('Master.searchCompany')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input form-input-search text-[12px] rounded pl-7 pr-2"
              style={{ width: '220px', height: '28px' }}
            />
          </div>
        </div>
      </div>

      {/* ── Data Table ────────────────────────────────────────────────── */}
      <div className="card-flat flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('Master.ma')}</th>
                <th>{t('Master.tenCongTy')}</th>
                <th className="hidden md:table-cell">{t('Master.romaji')}</th>
                <th>{t('Master.loai')}</th>
                <th className="hidden lg:table-cell">{t('Master.st')}</th>
                <th style={{ textAlign: 'center' }}>{t('Master.trangThai')}</th>
                <th style={{ textAlign: 'center' }}>{t('Master.thaoTac')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-[12px]">{t('Common.loading')}</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    <span className="text-[12px]">{t('Common.noData')}</span>
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCompanies.map((company) => (
                  <tr key={company.company_id}>
                    {/* Code */}
                    <td>
                      <span
                        className="font-mono font-bold text-[13px]"
                        style={{ color: 'var(--accent)' }}
                      >
                        {company.company_code}
                      </span>
                    </td>

                    {/* Name */}
                    <td>
                      <span
                        className="font-bold text-[13px]"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
                      >
                        {company.company_name}
                      </span>
                    </td>

                    {/* Romaji */}
                    <td className="hidden md:table-cell">
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {company.company_name_romaji || '—'}
                      </span>
                    </td>

                    {/* Type badges */}
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {company.company_type?.map((type) => {
                          const colors = COMPANY_TYPE_COLORS[type]
                          return (
                            <span
                              key={type}
                              className="rounded-full font-bold"
                              style={{
                                display: 'inline-block',
                                fontSize: '10px',
                                padding: '1px 7px',
                                background: colors?.bg || 'var(--status-neutral-bg)',
                                color: colors?.text || 'var(--text-secondary)',
                                lineHeight: '1.6',
                              }}
                            >
                              {getTypeLabel(type)}
                            </span>
                          )
                        })}
                      </div>
                    </td>

                    {/* Tel */}
                    <td className="hidden lg:table-cell">
                      <span className="text-[12px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {company.tel || '—'}
                      </span>
                    </td>

                    {/* Active status */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => toggleActive(company)}
                        className="cursor-pointer border-none bg-transparent p-0"
                        title={company.is_active ? t('Master.activeStatus') : t('Master.inactiveStatus')}
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
                          className="btn btn-secondary flex items-center justify-center rounded cursor-pointer"
                          style={{
                            width: '28px',
                            height: '28px',
                            padding: 0,
                          }}
                          title={t('Common.edit')}
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
                            {t('Master.confirmDelete')}
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(company.company_id)}
                            className="btn btn-secondary flex items-center justify-center rounded cursor-pointer"
                            style={{
                              width: '28px',
                              height: '28px',
                              padding: 0,
                              color: 'var(--text-muted)',
                            }}
                            title={t('Common.delete')}
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
            className="flex items-center justify-between px-3 py-1.5 shrink-0"
            style={{
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-2)',
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}
          >
            <span className="font-mono">
              {filteredCompanies.length} / {companies.length}
            </span>
            <span>
              {activeFilter !== 'ALL'
                ? `${t('Master.filter')}: ${getTypeLabel(activeFilter)}`
                : t('Master.allCount')}
            </span>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ────────────────────────────────────────────── */}
      <CompanyFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSaved={() => {
          closeModal()
          fetchCompanies()
        }}
        initialCompanyId={editingId}
      />
    </div>
  )
}

