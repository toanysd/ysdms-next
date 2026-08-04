'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit2, Trash2, Box } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { upsertCutter, deleteCutter } from '../actions'
import { Pagination } from '@/components/ui/Pagination'

interface Company {
  company_id: string
  company_name: string
  company_short_name: string
}

interface MoldDesign {
  design_id: string
  design_code: string
}

interface Cutter {
  cutter_id: string
  cutter_no: string
  cutter_name: string
  cutter_type: string
  cavity_count: string | null
  pitch_mm: number | null
  cutter_length_mm: number | null
  cutter_width_mm: number | null
  cutter_height_mm: number | null
  base_type: string | null
  company_id: string | null
  design_revision_id: string | null
  usage_status: string
  notes: string | null
  companies?: { company_short_name: string } | null
  mold_designs?: { design_code: string } | null
}

export default function CuttersClient({ 
  initialCutters, 
  companies, 
  moldDesigns,
  totalRecords,
  initialPage = 1,
  initialSearch = ''
}: { 
  initialCutters: Cutter[]
  companies: Company[]
  moldDesigns: MoldDesign[]
  totalRecords?: number
  initialPage?: number
  initialSearch?: string
}) {
  const t = useTranslations('Cutters')
  const router = useRouter()
  const [cutters, setCutters] = useState<Cutter[]>(initialCutters)
  const [search, setSearch] = useState(initialSearch)
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    setCutters(initialCutters)
  }, [initialCutters])

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`?page=${page}&q=${encodeURIComponent(search)}`)
    }, 500)
    return () => clearTimeout(timer)
  }, [search, page, router])

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingCutter, setEditingCutter] = useState<Cutter | null>(null)
  
  const [form, setForm] = useState({
    cutter_no: '',
    cutter_name: '',
    cutter_type: 'INLINE',
    cavity_count: '',
    pitch_mm: '' as string | number,
    cutter_length_mm: '' as string | number,
    cutter_width_mm: '' as string | number,
    cutter_height_mm: '' as string | number,
    base_type: 'WOOD_12MM',
    company_id: '',
    design_revision_id: '',
    usage_status: 'ACTIVE',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredCutters = cutters

  const handleOpenModal = (cutter?: Cutter) => {
    if (cutter) {
      setEditingCutter(cutter)
      setForm({
        cutter_no: cutter.cutter_no || '',
        cutter_name: cutter.cutter_name || '',
        cutter_type: cutter.cutter_type || 'INLINE',
        cavity_count: cutter.cavity_count || '',
        pitch_mm: cutter.pitch_mm || '',
        cutter_length_mm: cutter.cutter_length_mm || '',
        cutter_width_mm: cutter.cutter_width_mm || '',
        cutter_height_mm: cutter.cutter_height_mm || '',
        base_type: cutter.base_type || 'WOOD_12MM',
        company_id: cutter.company_id || '',
        design_revision_id: cutter.design_revision_id || '',
        usage_status: cutter.usage_status || 'ACTIVE',
        notes: cutter.notes || ''
      })
    } else {
      setEditingCutter(null)
      setForm({
        cutter_no: '',
        cutter_name: '',
        cutter_type: 'INLINE',
        cavity_count: '',
        pitch_mm: '',
        cutter_length_mm: '',
        cutter_width_mm: '',
        cutter_height_mm: '',
        base_type: 'WOOD_12MM',
        company_id: '',
        design_revision_id: '',
        usage_status: 'ACTIVE',
        notes: ''
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      ...form,
      pitch_mm: form.pitch_mm ? Number(form.pitch_mm) : null,
      cutter_length_mm: form.cutter_length_mm ? Number(form.cutter_length_mm) : null,
      cutter_width_mm: form.cutter_width_mm ? Number(form.cutter_width_mm) : null,
      cutter_height_mm: form.cutter_height_mm ? Number(form.cutter_height_mm) : null,
      company_id: form.company_id || null,
      design_revision_id: form.design_revision_id || null,
      cutter_id: editingCutter?.cutter_id
    }

    const res = await upsertCutter(payload)
    if (res.success) {
      window.location.reload()
    } else {
      alert(`${t('error')}: ${res.error}`)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(t('deleteConfirm', { code }))) return
    const res = await deleteCutter(id)
    if (res.success) {
      setCutters(prev => prev.filter(c => c.cutter_id !== id))
    } else {
      alert(`${t('error')}: ${res.error}`)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface-2)]">
      {/* PageHeader */}
      <div className="bg-[var(--bg-surface)] px-4 py-3 border-b border-[var(--border-default)] flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Box size={18} className="text-[var(--accent)]" />
          <h1 className="text-base font-bold text-[var(--text-primary)]">
            {t('title')}
          </h1>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="btn btn-primary h-8 px-4 text-[13px] flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={14} />
          <span className="font-bold">{t('addNew')}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex justify-between items-center bg-[var(--bg-surface)] p-2 border border-[var(--border-default)] rounded shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-[10px] text-[var(--text-muted)]" />
            <input 
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder={t('searchPlaceholder')}
              className="form-input pl-9 pr-3 py-2 text-sm w-[300px] shadow-sm"
            />
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] rounded shadow-sm border border-[var(--border-default)] overflow-hidden">
          <table className="data-table w-full text-left text-[13px] whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-3 py-2 text-center w-12 text-[10px] uppercase font-bold tracking-wider">No.</th>
                <th className="px-3 py-2 font-bold">{t('cutterNo')}</th>
                <th className="px-3 py-2 font-bold">{t('cutterName')}</th>
                <th className="px-3 py-2 font-bold">{t('customer')}</th>
                <th className="px-3 py-2 font-bold">{t('moldDesign')}</th>
                <th className="px-3 py-2 font-bold">{t('type')}</th>
                <th className="px-3 py-2 font-bold">{t('baseType')}</th>
                <th className="px-3 py-2 font-bold">{t('dimensions')}</th>
                <th className="px-3 py-2 font-bold">{t('status')}</th>
                <th className="px-3 py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCutters.map((c, idx) => {
                let badgeClass = 'badge badge--success'
                let statusLabel = t('statusActive')
                if (c.usage_status === 'NEEDS_MAINTENANCE') {
                  badgeClass = 'badge badge--warning'
                  statusLabel = t('statusMaintenance')
                }
                if (c.usage_status === 'DISCARDED') {
                  badgeClass = 'badge badge--neutral'
                  statusLabel = t('statusDiscarded')
                }

                return (
                  <tr key={c.cutter_id} className="hover:bg-[var(--bg-surface-hover)] transition-colors group">
                    <td className="px-3 py-2 text-center text-[var(--text-muted)] font-mono text-[11px]">{idx + 1}</td>
                    <td className="px-3 py-2 font-bold font-mono text-[14px] text-[var(--accent)]">{c.cutter_no}</td>
                    <td className="px-3 py-2 text-[var(--text-primary)] font-semibold">{c.cutter_name}</td>
                    <td className="px-3 py-2 text-[var(--text-primary)]">
                      {c.companies?.company_short_name || <span className="text-[var(--text-muted)]">-</span>}
                    </td>
                    <td className="px-3 py-2 text-[var(--text-primary)]">
                      {c.mold_designs?.design_code ? (
                        <span className="font-mono text-[12px] font-bold px-1.5 py-0.5 bg-[var(--bg-surface-2)] rounded border border-[var(--border-default)]">
                          {c.mold_designs.design_code}
                        </span>
                      ) : <span className="text-[var(--text-muted)]">-</span>}
                    </td>
                    <td className="px-3 py-2 text-[var(--text-primary)]">
                      <div className="font-semibold text-[13px]">{c.cutter_type === 'INLINE' ? t('typeInline') : t('typeSeparate')}</div>
                    </td>
                    <td className="px-3 py-2 text-[var(--text-primary)]">
                      <div className="font-semibold text-[13px]">{c.base_type === 'ALUMINUM' ? t('baseAluminum') : t('baseWood')}</div>
                    </td>
                    <td className="px-3 py-2 text-[var(--text-primary)] font-mono text-[13px]">
                      {c.cutter_length_mm || '-'} x {c.cutter_width_mm || '-'} x {c.cutter_height_mm || '-'}
                    </td>
                    <td className="px-3 py-2">
                      <span className={badgeClass}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(c)} className="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] rounded transition-colors" title={t('edit')}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.cutter_id, c.cutter_no)} className="p-1 text-[var(--text-muted)] hover:text-[var(--status-error)] rounded transition-colors" title={t('delete')}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredCutters.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-[var(--text-muted)] font-medium">
                    {t('noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalRecords={totalRecords || 0}
            pageSize={50}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg-surface)] rounded-md shadow-xl w-full max-w-2xl overflow-hidden border border-[var(--border-default)] animate-in fade-in zoom-in-95">
            <div className="px-5 py-3 border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--bg-surface-2)]">
              <h2 className="text-[14px] font-bold text-[var(--text-primary)]">
                {editingCutter ? t('editTitle') : t('createTitle')}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-[13px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('cutterNo')} <span className="text-[var(--status-error)]">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={form.cutter_no}
                    onChange={e => setForm({...form, cutter_no: e.target.value})}
                    className="form-input w-full text-[13px] font-mono font-bold text-[var(--accent)]" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('cutterName')} <span className="text-[var(--status-error)]">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={form.cutter_name}
                    onChange={e => setForm({...form, cutter_name: e.target.value})}
                    className="form-input w-full text-[13px] font-semibold" 
                  />
                </div>
              </div>

              {/* Ràng buộc */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--bg-surface-2)] rounded-sm border border-[var(--border-default)]">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('customer')}</label>
                  <select 
                    value={form.company_id}
                    onChange={e => setForm({...form, company_id: e.target.value})}
                    className="form-input w-full text-[13px]"
                  >
                    <option value="">{t('unspecified')}</option>
                    {companies.map(c => (
                      <option key={c.company_id} value={c.company_id}>{c.company_short_name || c.company_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('moldDesign')}</label>
                  <select 
                    value={form.design_revision_id}
                    onChange={e => setForm({...form, design_revision_id: e.target.value})}
                    className="form-input w-full text-[13px]"
                  >
                    <option value="">{t('commonCutter')}</option>
                    {moldDesigns.map(m => (
                      <option key={m.design_id} value={m.design_id}>{m.design_code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--border-default)] pt-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('type')}</label>
                  <select 
                    value={form.cutter_type}
                    onChange={e => setForm({...form, cutter_type: e.target.value})}
                    className="form-input w-full text-[13px]"
                  >
                    <option value="INLINE">{t('typeInline')}</option>
                    <option value="SEPARATE">{t('typeSeparate')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('baseType')}</label>
                  <select 
                    value={form.base_type}
                    onChange={e => setForm({...form, base_type: e.target.value})}
                    className="form-input w-full text-[13px]"
                  >
                    <option value="WOOD_12MM">{t('baseWood')}</option>
                    <option value="ALUMINUM">{t('baseAluminum')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('cavityCount')}</label>
                  <input 
                    type="text" 
                    value={form.cavity_count}
                    onChange={e => setForm({...form, cavity_count: e.target.value})}
                    className="form-input w-full text-[13px] font-mono" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('pitch')}</label>
                  <input 
                    type="number" step="0.1"
                    value={form.pitch_mm}
                    onChange={e => setForm({...form, pitch_mm: e.target.value})}
                    className="form-input w-full text-[13px] font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-default)] pt-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('length')}</label>
                  <input 
                    type="number" step="0.1"
                    value={form.cutter_length_mm}
                    onChange={e => setForm({...form, cutter_length_mm: e.target.value})}
                    className="form-input w-full text-[13px] font-mono" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('width')}</label>
                  <input 
                    type="number" step="0.1"
                    value={form.cutter_width_mm}
                    onChange={e => setForm({...form, cutter_width_mm: e.target.value})}
                    className="form-input w-full text-[13px] font-mono" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('height')}</label>
                  <input 
                    type="number" step="0.1"
                    value={form.cutter_height_mm}
                    onChange={e => setForm({...form, cutter_height_mm: e.target.value})}
                    className="form-input w-full text-[13px] font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--border-default)] pt-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('status')}</label>
                  <select 
                    value={form.usage_status}
                    onChange={e => setForm({...form, usage_status: e.target.value})}
                    className="form-input w-full text-[13px]"
                  >
                    <option value="ACTIVE">{t('statusActive')}</option>
                    <option value="NEEDS_MAINTENANCE">{t('statusMaintenance')}</option>
                    <option value="DISCARDED">{t('statusDiscarded')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[var(--text-muted)]">{t('notes')}</label>
                <textarea 
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  className="form-textarea w-full text-[13px]" 
                  rows={2}
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary text-[13px]">
                  {t('cancel')}
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary text-[13px]">
                  {isSubmitting ? t('saving') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

