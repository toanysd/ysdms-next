'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Search, Loader2, Link2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { linkJobToPhysicalMoldAction } from '@/app/actions/mold-job'

type PhysicalMoldOption = {
  equipment_id: string
  display_name: string
  equipment_code: string
  customer_name?: string | null
}

export function QuickLinkMoldModal({
  jobId,
  jobCode,
  jobName,
  onClose,
  onSuccess,
}: {
  jobId: string
  jobCode: string
  jobName: string
  onClose: () => void
  onSuccess: () => void
}) {
  const t = useTranslations('Equipment.QuickLinkMold')
  const tCommon = useTranslations('Common')
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const [molds, setMolds] = useState<PhysicalMoldOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMoldId, setSelectedMoldId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function searchMolds() {
      setLoading(true)
      let req = supabase
        .from('equipment')
        .select(`
          equipment_id,
          display_name,
          equipment_code
        `)
        .eq('equipment_type', 'MOLD')
        .order('display_name')
        .limit(20)

      if (search.trim()) {
        req = req.or(`display_name.ilike.%${search.trim()}%,equipment_code.ilike.%${search.trim()}%`)
      }

      const { data } = await req
      if (data) {
        setMolds(data.map(m => ({
          equipment_id: m.equipment_id,
          display_name: m.display_name,
          equipment_code: m.equipment_code,
        })))
      }
      setLoading(false)
    }

    const timer = setTimeout(searchMolds, 300)
    return () => clearTimeout(timer)
  }, [search, supabase])

  const handleLink = async () => {
    if (!selectedMoldId) return
    setSubmitting(true)
    setError(null)
    const res = await linkJobToPhysicalMoldAction(jobId, selectedMoldId)
    setSubmitting(false)
    if (!res.success) {
      setError(res.error || t('failedToLink'))
    } else {
      onSuccess()
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{ width: '100%', maxWidth: 540, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link2 size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                {t('title')}
              </h2>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {t('jobPrefix')} <strong style={{ color: 'var(--accent)' }}>[{jobCode}] {jobName}</strong>
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 30 }}
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Body: Mold list */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {error && (
            <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--status-error) 12%, transparent)', color: 'var(--status-error)', fontSize: 12, borderRadius: 6, marginBottom: 8 }}>
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 8px', color: 'var(--accent)' }} />
              {t('searching')}
            </div>
          ) : molds.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              {t('noMoldsFound')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {molds.map(m => {
                const isSelected = selectedMoldId === m.equipment_id
                return (
                  <div
                    key={m.equipment_id}
                    onClick={() => setSelectedMoldId(m.equipment_id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                      background: isSelected ? 'color-mix(in srgb, var(--accent) 8%, var(--bg-surface))' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                        {m.display_name}
                      </div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {t('systemCodeLabel')} {m.equipment_code}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--bg-surface-2)' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>{tCommon('cancel')}</button>
          <button
            className="btn btn-primary"
            disabled={!selectedMoldId || submitting}
            onClick={handleLink}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
            <span>{t('linkBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

