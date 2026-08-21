'use client'

import React, { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createInspectionLog } from '@/actions/inspections'
import { AsyncSearchableSelect, SelectOption } from '@/components/ui/AsyncSearchableSelect'
import { ClipboardCheck } from 'lucide-react'

export default function InspectionForm() {
  const t = useTranslations('DailyInspection')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [inspectorId, setInspectorId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const [orderLineId, setOrderLineId] = useState<string | null>(null)
  
  const [lotSize, setLotSize] = useState('')
  const [sampleSize, setSampleSize] = useState('')
  
  const [ng, setNg] = useState({
    qty_wc: '', qty_sc: '', qty_dt: '', qty_fm: '', 
    qty_bh: '', qty_br: '', qty_sd: '', qty_ot: ''
  })
  
  const [result, setResult] = useState('PASS')
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

  const totalNg = useMemo(() => {
    return Object.values(ng).reduce((acc, val) => acc + (parseInt(val || '0', 10)), 0)
  }, [ng])

  const handleNgChange = (field: keyof typeof ng, val: string) => {
    setNg(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inspectorId || !date) return

    setLoading(true)
    setError('')
    try {
      await createInspectionLog({
        log_date: date,
        inspector_id: inspectorId,
        product_id: productId || undefined,
        order_line_id: orderLineId || undefined,
        lot_size: lotSize ? parseInt(lotSize, 10) : undefined,
        sample_size: sampleSize ? parseInt(sampleSize, 10) : undefined,
        qty_wc: parseInt(ng.qty_wc || '0', 10),
        qty_sc: parseInt(ng.qty_sc || '0', 10),
        qty_dt: parseInt(ng.qty_dt || '0', 10),
        qty_fm: parseInt(ng.qty_fm || '0', 10),
        qty_bh: parseInt(ng.qty_bh || '0', 10),
        qty_br: parseInt(ng.qty_br || '0', 10),
        qty_sd: parseInt(ng.qty_sd || '0', 10),
        qty_ot: parseInt(ng.qty_ot || '0', 10),
        result,
        notes: notes || undefined
      })
      
      setProductId(null)
      setOrderLineId(null)
      setLotSize('')
      setSampleSize('')
      setNg({ qty_wc: '', qty_sc: '', qty_dt: '', qty_fm: '', qty_bh: '', qty_br: '', qty_sd: '', qty_ot: '' })
      setResult('PASS')
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
        <ClipboardCheck className="section-icon" style={{ color: 'var(--accent)' }} />
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{t('newLog')}</h2>
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
            <input
              type="date"
              className="form-input mono"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('inspector')}</span>
              <span className="label-required">*</span>
            </label>
            <AsyncSearchableSelect
              value={inspectorId}
              onChange={setInspectorId}
              fetchOptions={fetchEmployees}
              placeholder="Search inspector..."
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('product')}</span>
            </label>
            <AsyncSearchableSelect
              value={productId}
              onChange={setProductId}
              fetchOptions={fetchProducts}
              placeholder="Search product..."
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('orderLine')}</span>
            </label>
            <input
              type="text"
              className="form-input mono"
              value={orderLineId || ''}
              onChange={(e) => setOrderLineId(e.target.value)}
              placeholder={t('orderLineEmpty')}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t('orderLineHint')}
            </div>
          </div>
        </div>

        <div className="form-grid-2" style={{ marginTop: '10px' }}>
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('lotSize')}</span>
            </label>
            <input
              type="number"
              min="0"
              className="form-input mono"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('sampleSize')}</span>
            </label>
            <input
              type="number"
              min="0"
              className="form-input mono"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
            />
          </div>
        </div>

        {/* 8 NG Categories */}
        <div style={{ marginTop: '20px', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          NG Details
        </div>
        <div className="form-grid-2">
          {['qty_wc', 'qty_sc', 'qty_dt', 'qty_fm', 'qty_bh', 'qty_br', 'qty_sd', 'qty_ot'].map((field) => (
            <div className="form-field" key={field}>
              <label className="form-label">
                <span className="label-ja">{t(field)}</span>
              </label>
              <input
                type="number"
                min="0"
                className="form-input mono"
                value={ng[field as keyof typeof ng]}
                onChange={(e) => handleNgChange(field as keyof typeof ng, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, textAlign: 'right', color: 'var(--status-error)' }}>
          {t('totalNg')}: {totalNg}
        </div>

        <div className="form-grid-1" style={{ marginTop: '16px' }}>
          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('result')}</span>
              <span className="label-required">*</span>
            </label>
            <div className="type-chips">
              <button
                type="button"
                className={`type-chip ${result === 'PASS' ? 'type-chip--active' : ''}`}
                onClick={() => setResult('PASS')}
              >
                {t('pass')}
              </button>
              <button
                type="button"
                className={`type-chip ${result === 'FAIL' ? 'type-chip--active' : ''}`}
                onClick={() => setResult('FAIL')}
              >
                {t('fail')}
              </button>
              <button
                type="button"
                className={`type-chip ${result === 'CONDITIONAL' ? 'type-chip--active' : ''}`}
                onClick={() => setResult('CONDITIONAL')}
              >
                {t('conditional')}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('notes')}</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px', borderTop: '1px solid var(--border-default)' }}>
        <button type="submit" className="btn btn-primary" disabled={loading || !inspectorId}>
          {loading ? '...' : t('save')}
        </button>
      </div>
    </form>
  )
}
