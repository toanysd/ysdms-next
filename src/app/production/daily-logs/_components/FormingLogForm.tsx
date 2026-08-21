'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createFormingLog } from '@/actions/daily-logs'
import { AsyncSearchableSelect, SelectOption } from '@/components/ui/AsyncSearchableSelect'
import { FilePlus } from 'lucide-react'

export default function FormingLogForm() {
  const t = useTranslations('DailyLogs')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [operatorId, setOperatorId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const [equipmentId, setEquipmentId] = useState<string | null>(null)
  
  const [qtyOk, setQtyOk] = useState('')
  
  const [checks, setChecks] = useState({
    check_heater: false, check_mold: false, check_cutter: false, 
    check_plug: false, check_frame: false, check_water_base: false, check_stacking: false
  })
  
  const [ng, setNg] = useState({
    qty_ng_a: '', qty_ng_b: '', qty_ng_c: '', qty_ng_d: '', 
    qty_ng_e: '', qty_ng_f: '', qty_ng_g: ''
  })
  
  const [notes, setNotes] = useState('')

  const fetchEmployees = async (q: string): Promise<SelectOption[]> => {
    const res = await fetch(`/api/search/employees?q=${encodeURIComponent(q)}`)
    if (!res.ok) return []
    return res.json()
  }

  const fetchProducts = async (q: string): Promise<SelectOption[]> => {
    const res = await fetch(`/api/search/products?q=${encodeURIComponent(q)}`)
    if (!res.ok) return []
    return res.json()
  }

  const handleCheck = (field: keyof typeof checks, checked: boolean) => {
    setChecks(prev => ({ ...prev, [field]: checked }))
  }

  const handleNgChange = (field: keyof typeof ng, val: string) => {
    setNg(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!operatorId || !date || !qtyOk) return

    setLoading(true)
    setError('')
    try {
      await createFormingLog({
        log_date: date,
        operator_id: operatorId,
        product_id: productId || undefined,
        equipment_id: equipmentId || undefined,
        qty_ok: parseInt(qtyOk, 10),
        qty_ng_a: parseInt(ng.qty_ng_a || '0', 10),
        qty_ng_b: parseInt(ng.qty_ng_b || '0', 10),
        qty_ng_c: parseInt(ng.qty_ng_c || '0', 10),
        qty_ng_d: parseInt(ng.qty_ng_d || '0', 10),
        qty_ng_e: parseInt(ng.qty_ng_e || '0', 10),
        qty_ng_f: parseInt(ng.qty_ng_f || '0', 10),
        qty_ng_g: parseInt(ng.qty_ng_g || '0', 10),
        ...checks,
        notes: notes || undefined
      })
      
      setProductId(null)
      setEquipmentId(null)
      setQtyOk('')
      setNg({ qty_ng_a: '', qty_ng_b: '', qty_ng_c: '', qty_ng_d: '', qty_ng_e: '', qty_ng_f: '', qty_ng_g: '' })
      setChecks({ check_heater: false, check_mold: false, check_cutter: false, check_plug: false, check_frame: false, check_water_base: false, check_stacking: false })
      setNotes('')
      alert(t('successMsg'))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-section">
      <div className="form-section-header">
        <FilePlus className="section-icon" style={{ color: 'var(--accent)' }} />
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{t('newFormingLog')}</h2>
      </div>

      <div className="form-section-body">
        {error && (
          <div className="badge badge--error" style={{ marginBottom: '14px', width: '100%' }}>
            {error}
          </div>
        )}
        
        <div className="form-grid-2">
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('date')}</span>
              <span className="label-required">*</span>
            </label>
            <input type="date" className="form-input mono" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('operator')}</span>
              <span className="label-required">*</span>
            </label>
            <AsyncSearchableSelect value={operatorId} onChange={setOperatorId} fetchOptions={fetchEmployees} placeholder="Search operator..." />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('product')}</span>
            </label>
            <AsyncSearchableSelect value={productId} onChange={setProductId} fetchOptions={fetchProducts} placeholder="Search product..." />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('equipment')}</span>
            </label>
            <input type="text" className="form-input mono" value={equipmentId || ''} onChange={(e) => setEquipmentId(e.target.value)} placeholder={t('equipmentEmpty')} />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{t('equipmentHint')}</div>
          </div>
        </div>

        {/* Checklists */}
        <div style={{ marginTop: '20px', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Pre-Check (稼働前点検)
        </div>
        <div className="form-grid-2" style={{ gap: '6px' }}>
          {[
            { id: 'check_heater', key: 'checkHeater' },
            { id: 'check_mold', key: 'checkMold' },
            { id: 'check_cutter', key: 'checkCutter' },
            { id: 'check_plug', key: 'checkPlug' },
            { id: 'check_frame', key: 'checkFrame' },
            { id: 'check_water_base', key: 'checkWaterBase' },
            { id: 'check_stacking', key: 'checkStacking' },
          ].map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id={item.id} checked={checks[item.id as keyof typeof checks]} onChange={(e) => handleCheck(item.id as keyof typeof checks, e.target.checked)} />
              <label htmlFor={item.id} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {t(item.key)}
              </label>
            </div>
          ))}
        </div>

        {/* Quantities */}
        <div style={{ marginTop: '20px', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Production Quantities
        </div>
        <div className="form-grid-2">
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('goodQty')}</span>
              <span className="label-required">*</span>
            </label>
            <input type="number" min="0" className="form-input mono" style={{ color: 'var(--status-success)' }} value={qtyOk} onChange={(e) => setQtyOk(e.target.value)} required />
          </div>
        </div>
        
        <div className="form-grid-2" style={{ marginTop: '10px' }}>
          {['qty_ng_a', 'qty_ng_b', 'qty_ng_c', 'qty_ng_d', 'qty_ng_e', 'qty_ng_f', 'qty_ng_g'].map((field) => (
            <div className="form-field" key={field}>
              <label className="form-label">
                <span className="label-ja">{t(field)}</span>
              </label>
              <input type="number" min="0" className="form-input mono" value={ng[field as keyof typeof ng]} onChange={(e) => handleNgChange(field as keyof typeof ng, e.target.value)} placeholder="0" />
            </div>
          ))}
        </div>

        <div className="form-grid-1" style={{ marginTop: '16px' }}>
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('notes')}</span>
            </label>
            <input type="text" className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px', borderTop: '1px solid var(--border-default)' }}>
        <button type="submit" className="btn btn-primary" disabled={loading || !operatorId || !qtyOk}>
          {loading ? '...' : t('save')}
        </button>
      </div>
    </form>
  )
}
