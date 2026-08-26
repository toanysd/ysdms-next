'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, RefreshCw, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { revisePhysicalMoldAction } from '@/app/actions/mold-revise'
import type { MoldDetailData } from './page'

type DesignRevision = {
  revision_id: string
  design_code: string
  revision_number: number | null
}

type Props = {
  mold: MoldDetailData
  onClose: () => void
  onSuccess: () => void
}

export function ReviseMoldModal({ mold, onClose, onSuccess }: Props) {
  const t = useTranslations()
  const supabase = createClient()
  const productId = mold.mold_revisions?.product_id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [designRevisions, setDesignRevisions] = useState<DesignRevision[]>([])

  // Form State
  const [selectedDesignId, setSelectedDesignId] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>(mold.display_name)
  const [notes, setNotes] = useState<string>('')

  const loadDesigns = useCallback(async () => {
    if (!productId) {
        setError(t('Equipment.errProductNotFound'))
        setLoading(false)
        return
    }

    try {
      const { data } = await supabase
        .from('design_revisions')
        .select('revision_id, design_code, revision_number')
        .eq('product_id', productId)
        .order('revision_number', { ascending: false })
      
      if (data) setDesignRevisions(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [productId, supabase, t])

  useEffect(() => {
    loadDesigns()
  }, [loadDesigns])

  // Automatically suggest a new name when design is selected
  useEffect(() => {
    if (selectedDesignId) {
        const d = designRevisions.find(x => x.revision_id === selectedDesignId)
        if (d) {
            setDisplayName(`${mold.mold_revisions?.products?.product_code || '金型'} - R${d.revision_number}`)
        }
    }
  }, [selectedDesignId, designRevisions, mold])

  const handleSave = async () => {
    setError(null)
    if (!selectedDesignId) {
        setError(t('Equipment.errSelectNewDesign'))
        return
    }
    if (!displayName) {
        setError(t('Equipment.errEnterNewMoldName'))
        return
    }

    setSaving(true)
    try {
      const result = await revisePhysicalMoldAction({
        equipment_id: mold.equipment_id,
        new_design_revision_id: selectedDesignId,
        new_display_name: displayName,
        notes
      })

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || 'Update failed.')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--bg-surface)] rounded-lg shadow-xl w-[450px] border border-[var(--border-default)]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-[var(--accent)]" />
            <h3 className="m-0 text-sm font-bold text-[var(--text-primary)]">
              {t('Equipment.reviseMoldTitle')}
            </h3>
          </div>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3">
          {error && (
            <div className="px-3 py-2 text-xs rounded flex items-center gap-1.5 bg-[var(--bg-error)] text-[var(--status-error)]">
                <AlertCircle size={14} />
                {error}
            </div>
          )}

          {loading ? (
            <div className="text-center p-5 text-xs text-[var(--text-muted)]">
                {t('Common.loading')}
            </div>
          ) : (
            <>
              {/* Current Status */}
              <div className="px-3 py-2 rounded text-xs bg-[var(--bg-surface-2)]">
                  <div className="text-[var(--text-muted)] font-semibold">{t('Equipment.currentDesign')}:</div>
                  <div className="font-mono font-bold text-[var(--accent)] text-[13px]">{mold.mold_revisions?.revision_code || 'N/A'}</div>
                  <div className="mt-1 text-[var(--text-muted)] font-semibold">{t('Equipment.currentMoldName')}:</div>
                  <div className="font-bold text-[var(--text-primary)] text-[13px]">{mold.display_name}</div>
              </div>

              {/* Design Revision */}
              <div>
                <label className="form-label">
                    {t('Equipment.newDesignRevision')} <span className="text-red-500">*</span>
                </label>
                <select 
                    className="form-select font-mono font-bold" 
                    value={selectedDesignId} 
                    onChange={e => setSelectedDesignId(e.target.value)}
                >
                  <option value="">{t('Common.selectPlaceholder')}</option>
                  {designRevisions.map(d => (
                    <option key={d.revision_id} value={d.revision_id}>
                      {d.design_code} (Rev {d.revision_number})
                    </option>
                  ))}
                </select>
              </div>

              {/* New Display Name */}
              <div>
                <label className="form-label">
                    {t('Equipment.newMoldName')} <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    className="form-input font-bold" 
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">
                    {t('Equipment.reviseReason')}
                </label>
                <textarea 
                    className="form-textarea" 
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={t('Equipment.reviseReasonPlaceholder')}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-default)]">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>{t('Common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? t('Common.saving') : t('Common.update')}
          </button>
        </div>
      </div>
    </div>
  )
}


