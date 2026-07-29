'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Package, Plus, Search, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { addProductionLog } from '@/actions/plastics'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@/components/ui/Pagination'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'

type Props = {
  masters: any[]
  rolls: any[]
  jobs: any[]
  machines: any[]
  totalCount: number
  currentPage: number
}

export default function PlasticsClientPage({ masters, rolls, jobs, machines, totalCount, currentPage }: Props) {
  const t = useTranslations('Plastics')
  const tCommon = useTranslations('Common')
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Search state
  const currentQuery = searchParams.get('q') || ''
  const currentSort = searchParams.get('sort') || 'created_at'
  const currentDir = searchParams.get('dir') || 'desc'
  const [searchQuery, setSearchQuery] = useState(currentQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_plastics')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== currentQuery) {
        if (searchQuery.trim().length >= 2) addToHistory(searchQuery.trim())
        const params = new URLSearchParams(searchParams.toString())
        if (searchQuery.trim()) {
          params.set('q', searchQuery.trim())
        } else {
          params.delete('q')
        }
        params.set('page', '1') // reset page on search
        router.push(`/equipment/plastics?${params.toString()}`)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, currentQuery, router, searchParams, addToHistory])

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentSort === column) {
      params.set('dir', currentDir === 'asc' ? 'desc' : 'asc')
    } else {
      params.set('sort', column)
      params.set('dir', 'asc')
    }
    router.push(`/equipment/plastics?${params.toString()}`)
  }

  const renderSortIcon = (column: string) => {
    if (currentSort !== column) return <ArrowUpDown size={12} style={{ opacity: 0.3 }} />
    return currentDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  // Form states
  const [jobId, setJobId] = useState('')
  const [machineId, setMachineId] = useState('')
  const [rollId, setRollId] = useState('')
  
  const [goodPieces, setGoodPieces] = useState<number | ''>('')
  const [scrapPieces, setScrapPieces] = useState<number | ''>('')
  const [cavities, setCavities] = useState<number | ''>(1)
  
  const [metersConsumed, setMetersConsumed] = useState<number | ''>('')
  const [metersRemaining, setMetersRemaining] = useState<number | ''>('')
  const [metersWasted, setMetersWasted] = useState<number | ''>('')

  const handleCalculate = () => {
    if (!machineId || !goodPieces || !cavities) {
      alert('Vui lòng chọn máy, nhập số lượng tốt và số lỗ.')
      return
    }

    const machine = machines.find(m => m.machine_id === machineId)
    const feed = machine?.feed_length_mm || 0
    if (feed <= 0) {
      alert('Máy này chưa có thông số bước tiến nhựa (feed_length_mm).')
      return
    }

    const good = Number(goodPieces) || 0
    const scrap = Number(scrapPieces) || 0
    const cavs = Number(cavities) || 1

    const consumedMeters = (feed * (good + scrap)) / cavs / 1000
    setMetersConsumed(Number(consumedMeters.toFixed(2)))
    
    const wastedMeters = (feed * scrap) / cavs / 1000
    setMetersWasted(Number(wastedMeters.toFixed(2)))
    
    if (rollId) {
      const roll = rolls.find(r => r.id === rollId)
      if (roll) {
        const remaining = roll.current_length_m - consumedMeters
        setMetersRemaining(Number(remaining.toFixed(2)))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rollId || !metersConsumed || metersRemaining === '') return
    
    try {
      setLoading(true)
      await addProductionLog({
        job_id: jobId || undefined,
        roll_id: rollId,
        meters_consumed: Number(metersConsumed),
        meters_remaining: Number(metersRemaining),
        meters_wasted: Number(metersWasted) || 0
      })
      alert('Đã lưu thành công!')
      setIsModalOpen(false)
      // reset form
      setJobId('')
      setMachineId('')
      setRollId('')
      setGoodPieces('')
      setScrapPieces('')
      setCavities(1)
      setMetersConsumed('')
      setMetersRemaining('')
      setMetersWasted('')
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Package size={20} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>{t('title')}</span>
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            {t('addLog')}
          </button>
        </div>
      </div>

      {/* ── FilterBar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={tCommon('searchByCodeOrName')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="form-input form-input-search"
          />
          <SearchSuggestions
            history={history}
            onSelect={(q) => { setSearchQuery(q); setShowSuggestions(false) }}
            onRemove={removeFromHistory}
            onClear={clearHistory}
            visible={showSuggestions && !searchQuery}
            onClose={() => setShowSuggestions(false)}
          />
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('roll_barcode')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Roll Barcode {renderSortIcon('roll_barcode')}
                  </div>
                </th>
                <th onClick={() => handleSort('plastic_id')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Plastic Code {renderSortIcon('plastic_id')}
                  </div>
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Status {renderSortIcon('status')}
                  </div>
                </th>
                <th onClick={() => handleSort('nominal_length_m')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    Nominal (m) {renderSortIcon('nominal_length_m')}
                  </div>
                </th>
                <th onClick={() => handleSort('current_length_m')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    Current (m) {renderSortIcon('current_length_m')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rolls.map(roll => (
                <tr key={roll.id}>
                  <td>
                    <Link 
                      href={`/equipment/plastics/${roll.id}`}
                      style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}
                    >
                      {roll.roll_barcode}
                    </Link>
                  </td>
                  <td>{roll.plastic_master?.plastic_code}</td>
                  <td>
                    <span className="badge badge--neutral">{roll.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>{roll.nominal_length_m}</td>
                  <td style={{ textAlign: 'right', color: 'var(--accent)', fontWeight: 600 }}>{roll.current_length_m}</td>
                </tr>
              ))}
              {rolls.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0' }}>No rolls found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
          <Pagination
            currentPage={currentPage}
            totalRecords={totalCount}
            pageSize={50}
            baseUrl={`/equipment/plastics?q=${encodeURIComponent(currentQuery)}&sort=${currentSort}&dir=${currentDir}`}
          />
        </div>
      </div>

      {/* ── Modal Form ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card-flat" style={{ width: 600, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{t('addLog')}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">{t('job')}</label>
                  <select className="form-input" value={jobId} onChange={e => setJobId(e.target.value)}>
                    <option value="">-- Select Job --</option>
                    {jobs.map(j => (
                      <option key={j.job_id} value={j.job_id}>{j.job_code} - {j.products?.product_code}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-field">
                  <label className="form-label">{t('roll')} *</label>
                  <select className="form-input" value={rollId} onChange={e => setRollId(e.target.value)} required>
                    <option value="">-- Select Roll --</option>
                    {rolls.map(r => (
                      <option key={r.id} value={r.id}>{r.roll_barcode} (Curr: {r.current_length_m}m)</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">{t('machine')}</label>
                  <select className="form-input" value={machineId} onChange={e => setMachineId(e.target.value)}>
                    <option value="">-- Select Machine --</option>
                    {machines.map(m => (
                      <option key={m.machine_id} value={m.machine_id}>{m.machine_name} (Feed: {m.feed_length_mm || 0}mm)</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-section">
                <div className="form-section-header">Auto Calculate</div>
                <div className="form-section-body form-grid-4">
                  <div className="form-field">
                    <label className="form-label">{t('goodPieces')}</label>
                    <input type="number" className="form-input" value={goodPieces} onChange={e => setGoodPieces(Number(e.target.value))} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t('scrapPieces')}</label>
                    <input type="number" className="form-input" value={scrapPieces} onChange={e => setScrapPieces(Number(e.target.value))} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t('cavities')}</label>
                    <input type="number" className="form-input" value={cavities} onChange={e => setCavities(Number(e.target.value))} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={handleCalculate} style={{ width: '100%' }}>
                      {t('calculate')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label className="form-label">{t('metersConsumed')} *</label>
                  <input type="number" step="0.01" className="form-input" value={metersConsumed} onChange={e => setMetersConsumed(Number(e.target.value))} required />
                </div>
                <div className="form-field">
                  <label className="form-label">{t('metersRemaining')} *</label>
                  <input type="number" step="0.01" className="form-input" value={metersRemaining} onChange={e => setMetersRemaining(Number(e.target.value))} required />
                </div>
                <div className="form-field">
                  <label className="form-label">{t('metersWasted')}</label>
                  <input type="number" step="0.01" className="form-input" value={metersWasted} onChange={e => setMetersWasted(Number(e.target.value))} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  {tCommon('cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '...' : tCommon('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
