'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createPressLog } from '@/actions/daily-logs'
import { AsyncSearchableSelect, SelectOption } from '@/components/ui/AsyncSearchableSelect'
import { FilePlus } from 'lucide-react'

export default function PressLogForm() {
  const t = useTranslations('DailyLogs')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [operatorId, setOperatorId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const [equipmentId, setEquipmentId] = useState<string | null>(null)
  
  const [qtyOk, setQtyOk] = useState('')
  const [qtyNg, setQtyNg] = useState('')
  const [shotCount, setShotCount] = useState('')
  const [cutterCondition, setCutterCondition] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!operatorId || !date || !qtyOk) return

    setLoading(true)
    setError('')
    try {
      await createPressLog({
        log_date: date,
        operator_id: operatorId,
        product_id: productId || undefined,
        equipment_id: equipmentId || undefined,
        qty_ok: parseInt(qtyOk, 10),
        qty_ng: parseInt(qtyNg || '0', 10),
        shot_count: shotCount ? parseInt(shotCount, 10) : undefined,
        cutter_condition: cutterCondition || undefined,
        notes: notes || undefined
      })
      
      setProductId(null)
      setEquipmentId(null)
      setQtyOk('')
      setQtyNg('')
      setShotCount('')
      setCutterCondition('')
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
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{t('newPressLog')}</h2>
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
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('ngQty')}</span>
            </label>
            <input type="number" min="0" className="form-input mono" style={{ color: 'var(--status-error)' }} value={qtyNg} onChange={(e) => setQtyNg(e.target.value)} placeholder="0" />
          </div>
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('shotCount')}</span>
            </label>
            <input type="number" min="0" className="form-input mono" value={shotCount} onChange={(e) => setShotCount(e.target.value)} />
          </div>
        </div>

        <div className="form-grid-1" style={{ marginTop: '16px' }}>
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('cutterCondition')}</span>
            </label>
            <input type="text" className="form-input" value={cutterCondition} onChange={(e) => setCutterCondition(e.target.value)} />
          </div>
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
