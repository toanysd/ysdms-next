'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { checkMaterialStock } from '@/app/actions/production-instructions'
import type { PIFormData } from '../new/page'

interface Props {
  form: PIFormData
  update: (p: Partial<PIFormData>) => void
  onBack: () => void
  onSubmit: (status: 'DRAFT' | 'ISSUED') => void
  submitting: boolean
}

export default function Step3MaterialConfirm({ form, update, onBack, onSubmit, submitting }: Props) {
  const t = useTranslations('ProductionInstructions')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const check = async () => {
      if (!form.material_spec || !form.production_site || !form.quantity_ordered) return
      setChecking(true)
      const result = await checkMaterialStock(form.material_spec, form.production_site, form.quantity_ordered)
      update({ material_stock_warning: !result.sufficient, material_stock_qty: result.currentStock })
      setChecking(false)
    }
    check()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const features = [
    form.antistatic && t('featureAntistatic'),
    form.silicon && t('featureSilicone'),
    form.surface_coating && t('featureCoating'),
  ].filter(Boolean)

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('confirmTitle')}</h2>

      {/* Material info */}
      <div className="card-flat p-4 space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{t('materialInfo')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-[var(--text-muted)] font-semibold">{t('material')}:</span> <span className="font-bold text-[var(--accent)]">{form.material_spec || '—'}</span></div>
          <div><span className="text-[var(--text-muted)] font-semibold">{t('materialThickness')}:</span> <span className="font-mono font-bold">{form.material_thickness ? `${form.material_thickness}t` : '—'}</span></div>
          <div><span className="text-[var(--text-muted)] font-semibold">{t('materialWidth')}:</span> <span className="font-mono font-bold">{form.material_width ? `${form.material_width}mm` : '—'}</span></div>
          <div><span className="text-[var(--text-muted)] font-semibold">{t('recycledPct')}:</span> <span className="font-bold">{form.recycled_pct > 0 ? `${form.recycled_pct}%` : t('none')}</span></div>
          {features.length > 0 && (
            <div className="col-span-2"><span className="text-[var(--text-muted)] font-semibold">{t('specialFeatures')}:</span> <span className="font-semibold">{features.join(', ')}</span></div>
          )}
        </div>
      </div>

      {/* Stock check */}
      <div className={`rounded-lg border p-4 ${
        checking ? 'bg-[var(--bg-surface-2)] border-[var(--border-default)]' :
        form.material_stock_warning ? 'bg-[var(--tint-orange-bg)] border-[var(--status-warning)]/40' : 'bg-[var(--tint-teal-bg)] border-[var(--status-success)]/40'
      }`}>
        {checking ? (
          <p className="text-sm text-[var(--text-muted)]">{t('stockChecking')}</p>
        ) : form.material_stock_qty === null ? (
          <p className="text-sm text-[var(--text-muted)]">{t('noStockData')}</p>
        ) : form.material_stock_warning ? (
          <div>
            <p className="text-sm font-bold text-[var(--status-warning)]">⚠️ {t('materialShortageTitle')}</p>
            <p className="text-sm text-[var(--text-primary)] mt-1">
              {t('currentStockInfo', { stock: form.material_stock_qty.toLocaleString(), qty: form.quantity_ordered.toLocaleString() })}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{t('stockShortageNote')}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold text-[var(--status-success)]">✅ {t('materialAvailableTitle')}</p>
            <p className="text-sm text-[var(--text-primary)] mt-1">
              {t('currentStockDetail', { stock: form.material_stock_qty.toLocaleString() })}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card-flat bg-[var(--tint-blue-bg)] border-[var(--status-info)]/30 p-4 text-sm space-y-1.5">
        <p className="font-bold text-[var(--accent)] text-base mb-2">{t('issueSummaryTitle')}</p>
        <p className="text-[var(--text-primary)]">{t('orderInfo')}: <span className="font-mono font-bold text-[var(--accent)]">{form.order_no}</span> / <span className="font-mono font-bold">{form.product_code}</span></p>
        <p className="text-[var(--text-primary)]">{t('siteAndQty')}: <span className="font-semibold">{form.production_site}</span> / <span className="font-mono font-bold">{form.quantity_ordered.toLocaleString()}</span></p>
        <p className="text-[var(--text-primary)]">{t('deliverySite')}: <span className="font-semibold">{form.delivery_site_name}</span></p>
        <p className="text-[var(--text-primary)]">{t('requestedDate')}: <span className="font-mono font-bold">{form.requested_date}</span></p>
        <p className="text-[var(--text-primary)]">{t('template')}: <span className="badge badge--info font-mono font-bold">{form.template_type}</span></p>
        {form.is_first_time && <p className="text-[var(--status-success)] font-bold">✅ {t('isFirstTime')}</p>}
        {form.has_label && <p className="text-[var(--status-success)] font-bold">✅ {t('hasLabel')}</p>}
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="btn btn-secondary font-bold px-4" disabled={submitting}>← {t('back')}</button>
        <div className="flex gap-2">
          <button
            onClick={() => onSubmit('DRAFT')}
            disabled={submitting}
            className="btn btn-secondary font-bold px-4"
          >
            {t('saveDraft')}
          </button>
          <button
            onClick={() => onSubmit('ISSUED')}
            disabled={submitting}
            className="btn btn-primary font-bold px-6"
          >
            {submitting ? t('submitting') : t('issueAction')}
          </button>
        </div>
      </div>
    </div>
  )
}

