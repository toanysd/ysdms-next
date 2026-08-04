'use client'

import { useState, useEffect } from 'react'
import { X, Filter, RotateCcw, Building2, Layers, MapPin, Check, Package } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type ProductFilterState = {
  companyId: string
  keeperCompanyId: string
  plasticType: string
  pocketMin: string
  pocketMax: string
  rackCode: string
  status: 'ALL' | 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED'
}

export const INITIAL_PRODUCT_FILTERS: ProductFilterState = {
  companyId: '',
  keeperCompanyId: '',
  plasticType: '',
  pocketMin: '',
  pocketMax: '',
  rackCode: '',
  status: 'ALL',
}

interface Props {
  isOpen: boolean
  onClose: () => void
  filters: ProductFilterState
  onApplyFilters: (newFilters: ProductFilterState) => void
  onResetFilters: () => void
  companiesList: Array<{ company_id: string; company_code: string; company_name: string }>
  plasticTypesList: string[]
}

export default function ProductFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  companiesList,
  plasticTypesList,
}: Props) {
  const tPC = useTranslations('ProductCenter')
  const tMaster = useTranslations('Master')
  const tCommon = useTranslations('Common')

  const [localFilters, setLocalFilters] = useState<ProductFilterState>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  if (!isOpen) return null

  const activeCount = Object.entries(localFilters).filter(([k, v]) => {
    if (k === 'status') return v !== 'ALL'
    return Boolean(v)
  }).length

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters(INITIAL_PRODUCT_FILTERS)
    onResetFilters()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1050,
        background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', justifyContent: 'flex-end', transition: 'all 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 420, height: '100%', borderRadius: 0,
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-default)',
          display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 25px rgba(0,0,0,0.15)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                {tPC('filterDrawerTitle')}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {tPC('filterDrawerDesc')}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 4, borderRadius: 4
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body - Scrollable Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status Filter Tabs */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              {tPC('equipmentStatus') || 'ステータス'}
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: tCommon('all') },
                { id: 'ACTIVE', label: tMaster('activeStatus') },
                { id: 'MAINTENANCE', label: tMaster('maintenanceStatus') },
                { id: 'DISPOSED', label: tMaster('disposedStatus') },
              ].map(st => {
                const active = localFilters.status === st.id
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setLocalFilters(prev => ({ ...prev, status: st.id as any }))}
                    style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                      border: active ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                      background: active ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)',
                      color: active ? 'var(--tint-teal-text)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                  >
                    {st.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Customer / Ordering Company Filter */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <Building2 size={13} style={{ color: 'var(--accent)' }} />
              {tPC('filterCustomer')}
            </label>
            <select
              className="form-input"
              style={{ width: '100%', fontSize: 12, height: 32 }}
              value={localFilters.companyId}
              onChange={e => setLocalFilters(prev => ({ ...prev, companyId: e.target.value }))}
            >
              <option value="">{tPC('selectCompanyPlaceholder')}</option>
              {companiesList.map(c => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_code} - {c.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* Keeper Company Filter */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
              {tPC('keeperCompany')}
            </label>
            <select
              className="form-input"
              style={{ width: '100%', fontSize: 12, height: 32 }}
              value={localFilters.keeperCompanyId}
              onChange={e => setLocalFilters(prev => ({ ...prev, keeperCompanyId: e.target.value }))}
            >
              <option value="">すべての保管会社 (All Keeper Companies)</option>
              {companiesList.slice(0, 30).map(c => (
                <option key={`keeper-${c.company_id}`} value={c.company_id}>
                  {c.company_code} - {c.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* Plastic Material Filter */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <Package size={13} style={{ color: 'var(--accent)' }} />
              {tPC('filterPlastic')}
            </label>
            <select
              className="form-input"
              style={{ width: '100%', fontSize: 12, height: 32 }}
              value={localFilters.plasticType}
              onChange={e => setLocalFilters(prev => ({ ...prev, plasticType: e.target.value }))}
            >
              <option value="">{tPC('selectPlasticPlaceholder')}</option>
              {plasticTypesList.map((pt, idx) => (
                <option key={idx} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* Pocket / Cavity Range */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              {tPC('filterPocketMinMax')}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                className="form-input"
                placeholder="Min"
                style={{ width: '100%', fontSize: 12, height: 32 }}
                value={localFilters.pocketMin}
                onChange={e => setLocalFilters(prev => ({ ...prev, pocketMin: e.target.value }))}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>〜</span>
              <input
                type="number"
                className="form-input"
                placeholder="Max"
                style={{ width: '100%', fontSize: 12, height: 32 }}
                value={localFilters.pocketMax}
                onChange={e => setLocalFilters(prev => ({ ...prev, pocketMax: e.target.value }))}
              />
            </div>
          </div>

          {/* Storage Rack Code */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <MapPin size={13} style={{ color: 'var(--accent)' }} />
              {tPC('filterRack')}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="例: 70, 94, LAYER-702..."
              style={{ width: '100%', fontSize: 12, height: 32 }}
              value={localFilters.rackCode}
              onChange={e => setLocalFilters(prev => ({ ...prev, rackCode: e.target.value }))}
            />
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div style={{
          padding: '14px 18px', borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 12px' }}
          >
            <RotateCcw size={13} />
            {tPC('resetFilters')}
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 16px' }}
          >
            <Check size={13} />
            {tPC('applyFilters')} {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
      </div>
    </div>
  )
}
