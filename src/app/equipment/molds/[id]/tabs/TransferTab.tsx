'use client'

import { Truck, Calendar, Building2, ArrowRight, Plus } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { MoldDetailData } from '../page'

type ShipLog = {
  ship_id: string
  ship_date: string | null
  ship_status: string | null
  ship_item_name: string | null
  notes: string | null
  created_at: string | null
  from_company?: { company_name: string; company_code: string } | null
  to_company?: { company_name: string; company_code: string } | null
}

type Company = {
  company_id: string
  company_code: string
  company_name: string
}

export function TransferTab({ mold }: { mold: MoldDetailData }) {
  const t = useTranslations()
  const supabase = createClient()
  const [shipLogs, setShipLogs] = useState<ShipLog[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedToCompany, setSelectedToCompany] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedStatus, setSelectedStatus] = useState('SHIPPED')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('equipment_ship_logs')
      .select(`
        *,
        from_company:companies!equipment_ship_logs_from_company_id_fkey(company_name, company_code),
        to_company:companies!equipment_ship_logs_to_company_id_fkey(company_name, company_code)
      `)
      // @ts-ignore - TODO: Phase D
      .eq('legacy_mold_id', mold.physical_mold_id)
      .order('ship_date', { ascending: false })
      .range(0, 49)
    setShipLogs((data as any[]) || [])
    setLoading(false)
  }, [mold.physical_mold_id, supabase])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const openTransferModal = async () => {
    setModalOpen(true)
    setSelectedToCompany('')
    setSelectedDate(new Date().toISOString().split('T')[0])
    setSelectedStatus('SHIPPED')
    setNotes('')
    
    if (companies.length === 0) {
      const { data } = await supabase
        .from('companies')
        .select('company_id, company_code, company_name')
        .eq('is_active', true)
        .order('company_name')
      if (data) {
        setCompanies(data)
      }
    }
  }

  const handleCreateTransfer = async () => {
    if (!selectedToCompany) return alert(t('Equipment.valToCompanyReq'))
    if (selectedToCompany === mold.keeper_company_id) return alert(t('Equipment.valToCompanySame'))
    setSaving(true)

    const { error: shipErr } = await supabase.from('equipment_ship_logs').insert({
      // @ts-ignore - TODO: Phase D
      legacy_mold_id: mold.physical_mold_id,
      from_company_id: mold.keeper_company_id,
      to_company_id: selectedToCompany,
      ship_date: selectedDate,
      ship_item_name: mold.display_name,
      notes: notes || null,
    })

    if (!shipErr) {
      const { error: moldErr } = await supabase
        .from('physical_molds')
        .update({ keeper_company_id: selectedToCompany })
        .eq('physical_mold_id', mold.physical_mold_id)

      if (!moldErr) {
        setModalOpen(false)
        window.location.reload()
      } else {
        alert(moldErr.message)
        setSaving(false)
      }
    } else {
      alert(shipErr.message)
      setSaving(false)
    }
  }

  return (
    <div className="card-flat" style={{ padding: 0 }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          <Truck size={14} style={{ marginRight: 6, verticalAlign: -2, color: 'var(--accent)' }} />
          {t('Equipment.transferHistory')}
        </h3>
        <button
          className="btn btn-primary text-xs font-bold"
          onClick={openTransferModal}
        >
          <Plus size={14} />
          <span>{t('Equipment.createTransfer')}</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>{t('Equipment.date')}</th>
              <th style={{ width: 160 }}>{t('Equipment.fromCompany')}</th>
              <th style={{ width: 30 }}></th>
              <th style={{ width: 160 }}>{t('Equipment.toCompany')}</th>
              <th style={{ width: 90 }}>{t('Equipment.trangThai')}</th>
              <th>{t('Equipment.ghiChu')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{t('Common.loading')}</td></tr>
            ) : shipLogs.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{t('Common.noData')}</td></tr>
            ) : (
              shipLogs.map(log => (
                <tr key={log.ship_id}>
                  <td style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>
                    {log.ship_date ? new Date(log.ship_date).toLocaleDateString('ja-JP') : '—'}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={12} style={{ color: 'var(--text-muted)' }} />
                      {log.from_company?.company_name || '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
                  </td>
                  <td style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={12} />
                      {log.to_company?.company_name || '—'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge--info font-mono text-[11px] font-bold">
                      {log.ship_status || '—'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {log.notes || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Transfer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-[var(--bg-surface)] rounded-lg shadow-xl w-[400px] border border-[var(--border-default)]" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('Equipment.createTransferTitle')}
              </h3>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label">{t('Equipment.fromCompany')} <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  className="form-input text-xs font-bold"
                  value={mold.keeper_company ? `${mold.keeper_company.company_code} - ${mold.keeper_company.company_name}` : t('Common.unregistered')}
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">{t('Equipment.toCompany')} <span style={{ color: 'red' }}>*</span></label>
                <select className="form-select" value={selectedToCompany} onChange={e => setSelectedToCompany(e.target.value)}>
                  <option value="">{t('Common.selectPlaceholder')}</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>
                      {c.company_code} - {c.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">{t('Equipment.transferDate')} <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="date"
                  className="form-input font-mono"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">{t('Equipment.trangThai')}</label>
                <select className="form-select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="ARRIVED">ARRIVED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
              <div>
                <label className="form-label">{t('Equipment.ghiChu')}</label>
                <textarea
                  className="form-textarea"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>{t('Common.cancel')}</button>
              <button className="btn btn-primary" onClick={handleCreateTransfer} disabled={saving}>
                {saving ? t('Common.saving') : t('Common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

