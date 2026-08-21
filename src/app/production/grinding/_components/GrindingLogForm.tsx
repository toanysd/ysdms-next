'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createGrindingLog } from '@/actions/grinding'
import { AsyncSearchableSelect, SelectOption } from '@/components/ui/AsyncSearchableSelect'
import { Plus } from 'lucide-react'

export default function GrindingLogForm() {
  const t = useTranslations('Grinding')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [employeeId, setEmployeeId] = useState<string | null>(null)
  const [weight, setWeight] = useState('')
  const [bagCount, setBagCount] = useState('')
  const [notes, setNotes] = useState('')

  const fetchEmployees = async (q: string): Promise<SelectOption[]> => {
    const res = await fetch(`/api/search/employees?q=${encodeURIComponent(q)}`)
    if (!res.ok) return []
    return res.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId || !weight || !date) return

    setLoading(true)
    setError('')
    try {
      await createGrindingLog({
        log_date: date,
        employee_id: employeeId,
        material_type: 'PS_WHITE',
        weight_kg: parseFloat(weight),
        bag_count: bagCount ? parseInt(bagCount, 10) : undefined,
        notes: notes || undefined
      })
      // Reset form on success except date and employee
      setWeight('')
      setBagCount('')
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
        <Plus className="section-icon" style={{ color: 'var(--accent)' }} />
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
              <span className="label-ja">{t('employee')}</span>
              <span className="label-required">*</span>
            </label>
            <AsyncSearchableSelect
              value={employeeId}
              onChange={setEmployeeId}
              fetchOptions={fetchEmployees}
              placeholder="Search employee..."
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('material')}</span>
            </label>
            <input
              type="text"
              className="form-input"
              value="PS_WHITE"
              readOnly
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('weightKg')}</span>
              <span className="label-required">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              className="form-input mono"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="label-ja">{t('bagCount')}</span>
            </label>
            <input
              type="number"
              className="form-input mono"
              value={bagCount}
              onChange={(e) => setBagCount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-grid-1" style={{ marginTop: '10px' }}>
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
        <button type="submit" className="btn btn-primary" disabled={loading || !employeeId || !weight}>
          {loading ? '...' : t('save')}
        </button>
      </div>
    </form>
  )
}
