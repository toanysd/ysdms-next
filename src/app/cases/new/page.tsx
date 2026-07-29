'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Briefcase, ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const CASE_TYPES = [
  { value: 'new_tray' },
  { value: 'repeat_order' },
  { value: 'mold_modification' },
  { value: 'material_change' },
  { value: 'complaint' },
  { value: 'inventory_audit' },
  { value: 'tray_review' },
  { value: 'other' },
]

export default function NewCasePage() {
  const t = useTranslations()
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    case_type: 'new_tray',
    customer_id: '',
    sales_owner_id: '',
    requested_due_date: '',
    instruction_notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [companies, setCompanies] = useState<{company_id: string, company_name: string}[]>([])
  const [employees, setEmployees] = useState<{employee_id: string, employee_name: string}[]>([])

  useEffect(() => {
    async function loadOptions() {
      const [{ data: compData }, { data: empData }] = await Promise.all([
        supabase.from('companies').select('company_id, company_name').order('company_name'),
        supabase.from('employees').select('employee_id, employee_name').order('employee_name')
      ])
      if (compData) setCompanies(compData)
      if (empData) setEmployees(empData as {employee_id: string, employee_name: string}[])
    }
    loadOptions()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError(t('Cases.titleRequiredError')); return }
    setSaving(true)
    setError(null)

    const { data, error: insertError } = await (supabase as any)
      .from('business_cases')
      .insert({
        title: form.title.trim(),
        case_type: form.case_type,
        status: 'open',
        customer_id: form.customer_id || null,
        sales_owner_id: form.sales_owner_id || null,
        requested_due_date: form.requested_due_date || null,
        raw_text_snapshot: form.instruction_notes || null,
      })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push(`/cases/${data.id}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <Link href="/cases"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)',
            textDecoration: 'none', fontSize: 13 }}>
          <ArrowLeft size={14} />
          <span>{t('Cases.caseList')}</span>
        </Link>
        <span style={{ color: 'var(--border-strong)' }}>/</span>
        <Briefcase size={18} style={{ color: 'var(--accent)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{t('Cases.newCaseRegistration')}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        {error && (
          <div className="form-callout form-callout--error" style={{ marginBottom: 12 }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-section">
          <div className="form-section-header">
            <Briefcase size={14} className="section-icon" />
            <span>{t('Cases.basicInfo')}</span>
          </div>
          <div className="form-section-body">
            <div className="form-grid-1" style={{ gap: 12 }}>

              <div className="form-field">
                <label className="form-label">
                  <span>{t('Cases.titleRequired')}</span>
                </label>
                <input type="text" className="form-input"
                  placeholder={t('Cases.placeholderTitle')}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span>{t('Cases.caseType')}</span>
                </label>
                <select className="form-select"
                  value={form.case_type}
                  onChange={e => setForm(f => ({ ...f, case_type: e.target.value }))}>
                  {CASE_TYPES.map(tType => (
                    <option key={tType.value} value={tType.value}>
                      {t('Cases.Types.' + tType.value)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span>{t('Cases.customerRequired')}</span>
                </label>
                <select className="form-select" required
                  value={form.customer_id}
                  onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}>
                  <option value="">{t('Cases.selectPlaceholder')}</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span>{t('Cases.salesOwnerRequired')}</span>
                </label>
                <select className="form-select" required
                  value={form.sales_owner_id}
                  onChange={e => setForm(f => ({ ...f, sales_owner_id: e.target.value }))}>
                  <option value="">{t('Cases.selectPlaceholder')}</option>
                  {employees.map(e => (
                    <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span>{t('Cases.requestedDueDate')}</span>
                </label>
                <input type="date" className="form-input"
                  value={form.requested_due_date}
                  onChange={e => setForm(f => ({ ...f, requested_due_date: e.target.value }))} />
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span>{t('Cases.instructionNotes')}</span>
                </label>
                <textarea className="form-textarea"
                  placeholder={t('Cases.placeholderNotes')}
                  rows={4}
                  value={form.instruction_notes}
                  onChange={e => setForm(f => ({ ...f, instruction_notes: e.target.value }))} />
              </div>

            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link href="/cases" className="btn btn-secondary">
            <span>{t('Cases.cancel')}</span>
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}>
            <Save size={14} />
            <span>{saving ? t('Cases.saving') : t('Cases.saveAndOpen')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
