'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, AlertTriangle, X, Edit, Box, Layers, PenTool, Building2, Wrench, Hammer } from 'lucide-react'
import { QuickMoldJobInput } from '@/app/actions/quick-mold-job'

type Props = {
  visible: boolean
  editJobId: string | null
  formData: QuickMoldJobInput & { customerName?: string }
  initialData: (QuickMoldJobInput & { customerName?: string }) | null
  onConfirm: () => void
  onClose: () => void
  saving: boolean
}

export function QuickMoldJobConfirmModal({
  visible,
  editJobId,
  formData,
  initialData,
  onConfirm,
  onClose,
  saving
}: Props) {
  const t = useTranslations('Equipment.QuickCreate')

  if (!visible) return null

  // Calculate Field Diffs for Edit Mode
  const diffs: { field: string; label: string; oldVal: string; newVal: string }[] = []

  if (editJobId && initialData) {
    const checkDiff = (key: keyof QuickMoldJobInput, labelKey: string) => {
      const oldV = String(initialData[key] ?? '')
      const newV = String(formData[key] ?? '')
      if (oldV !== newV && (oldV !== '' || newV !== '')) {
        diffs.push({ field: String(key), label: t(labelKey as any), oldVal: oldV || t('emptyValue'), newVal: newV || t('emptyValue') })
      }
    }

    checkDiff('product_code', 'productCodeLabel')
    checkDiff('customer_product_name', 'customerProductNameLabel')
    checkDiff('design_code', 'designCodeLabel')
    checkDiff('design_length', 'lengthLabel')
    checkDiff('design_width', 'widthLabel')
    checkDiff('design_height', 'heightLabel')
    checkDiff('design_depth', 'depthLabel')
    checkDiff('cutline_length', 'cutlineLabel')
    checkDiff('corner_r', 'cornerRLabel')
    checkDiff('system_code', 'systemCodeLabel')
    checkDiff('physical_stamp', 'physicalStampLabel')
    checkDiff('job_code', 'jobCodeLabel')
    checkDiff('job_name', 'jobNameLabel')
    checkDiff('deadline', 'deadlineLabel')
    checkDiff('unit_price', 'priceQuoteLabel')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="card-flat"
        style={{
          width: 680,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 18px',
            background: editJobId ? 'color-mix(in srgb, var(--status-warning) 12%, var(--bg-surface))' : 'color-mix(in srgb, var(--accent) 12%, var(--bg-surface))',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {editJobId ? <Edit size={18} style={{ color: 'var(--status-warning)' }} /> : <CheckCircle2 size={18} style={{ color: 'var(--accent)' }} />}
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
              {t('confirmModalTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: 18, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
            {t('confirmModalSubtitle')}
          </p>

          {/* Diffs Banner if Edit Mode */}
          {editJobId && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 6,
                background: 'color-mix(in srgb, var(--status-warning) 10%, var(--bg-surface-2))',
                border: '1px solid var(--status-warning)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-warning-text)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} />
                <span>{t('changedFields')} ({diffs.length})</span>
              </div>
              {diffs.length === 0 ? (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 120, overflowY: 'auto' }}>
                  {diffs.map((d, idx) => (
                    <div key={idx} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', width: 160 }}>• {d.label}:</span>
                      <span style={{ color: 'var(--status-error)', textDecoration: 'line-through' }}>{d.oldVal}</span>
                      <span>➔</span>
                      <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>{d.newVal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6-Layer Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="card-flat" style={{ padding: 10, fontSize: 11, background: 'var(--bg-surface-2)' }}>
              <strong style={{ color: '#3B82F6', display: 'block', marginBottom: 4 }}>{t('step1Title')}:</strong>
              <div>• {t('productCodeLabel')}: <strong>{formData.product_code}</strong> ({formData.customer_product_name || '—'})</div>
              <div>• {t('customerLabel')}: <strong>{formData.customerName || '—'}</strong></div>
            </div>

            <div className="card-flat" style={{ padding: 10, fontSize: 11, background: 'var(--bg-surface-2)' }}>
              <strong style={{ color: '#8B5CF6', display: 'block', marginBottom: 4 }}>{t('step2Title')}:</strong>
              <div>• {t('designCodeLabel')}: <strong>{formData.design_code}</strong></div>
              <div>• L x W x H: {formData.design_length || '—'} x {formData.design_width || '—'} x {formData.design_height || '—'} mm</div>
              <div>• {t('confirmCutline')}: {formData.cutline_length || '—'} x {formData.cutline_width || '—'}</div>
            </div>

            <div className="card-flat" style={{ padding: 10, fontSize: 11, background: 'var(--bg-surface-2)' }}>
              <strong style={{ color: '#F59E0B', display: 'block', marginBottom: 4 }}>{t('step3Title')}:</strong>
              <div>• {t('systemCodeLabel')}: <strong>{formData.system_code}</strong></div>
              <div>• {t('physicalStampLabel')}: {formData.physical_stamp || '—'}</div>
            </div>

            <div className="card-flat" style={{ padding: 10, fontSize: 11, background: 'var(--bg-surface-2)' }}>
              <strong style={{ color: '#10B981', display: 'block', marginBottom: 4 }}>{t('step4Title')}:</strong>
              <div>• {t('jobCodeLabel')}: <strong>{formData.job_code}</strong></div>
              <div>• {t('jobNameLabel')}: {formData.job_name}</div>
              <div>• {t('deadlineLabel')}: {formData.deadline || '—'}</div>
            </div>
          </div>

          <div className="card-flat" style={{ padding: 10, fontSize: 11, background: 'var(--bg-surface-2)' }}>
            <strong style={{ color: '#EC4899', display: 'block', marginBottom: 4 }}>{t('step5Title')} & {t('step6Title')}:</strong>
            {(() => {
              const componentSteps = formData.steps?.filter(s => s.type_code) || []
              const allSteps = formData.steps || []
              return (
                <>
                  <div>• {t('confirmComponents', { count: componentSteps.length })}: {componentSteps.map(c => `${c.step_name} [${c.type_code}]`).join(', ') || '—'}</div>
                  <div>• {t('confirmAllSteps', { count: allSteps.length })}: {allSteps.map(s => s.step_name).join(' ➔ ') || '—'}</div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '10px 18px',
            background: 'var(--bg-surface-2)',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <button onClick={onClose} disabled={saving} className="btn btn-secondary" style={{ fontSize: 12, height: 30 }}>
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="btn btn-primary"
            style={{
              fontSize: 12,
              height: 30,
              gap: 6,
              background: editJobId ? 'var(--status-warning)' : 'var(--accent)',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={15} />
            <span>{saving ? t('saving') : editJobId ? t('confirmUpdateBtn') : t('confirmCreateBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
