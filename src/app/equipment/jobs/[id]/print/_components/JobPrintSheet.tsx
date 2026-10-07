'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Printer, ArrowLeft, ArrowUpFromLine, ExternalLink, Calendar, Box, Layers, Scissors, CheckCircle2 } from 'lucide-react'
import QRCode from 'qrcode'
import '../print.css'

export interface JobPrintData {
  job: {
    job_id: string
    job_code: string
    job_name: string
    job_status: string | null
    mold_deadline: string | null
    ship_date: string | null
    created_at: string | null
  }
  company?: {
    company_id: string
    company_name: string
    company_code: string
  } | null
  product?: {
    product_id: string
    product_code: string
    product_name: string | null
    product_name_internal: string | null
  } | null
  design?: {
    revision_id: string
    design_code: string
    cutline_length: number | null
    cutline_width: number | null
    corner_r: string | null
    chamfer_c: string | null
    cavity_count: number | null
    plastic_type_designed: string | null
  } | null
  mold?: {
    equipment_id: string
    equipment_code: string
    display_name: string
    rack_code: string | null
    layer_code: string | null
    location_in_factory: string | null
    zone_code: string | null
  } | null
  cutters?: Array<{
    equipment_id: string
    equipment_code: string
    display_name: string
    rack_code: string | null
    layer_code: string | null
    relationship_type: string
  }>
  steps?: Array<{
    step_id: string
    step_no: number
    step_name: string
    step_status: string
    employee_name: string | null
    planned_hours: number | null
    actual_hours: number | null
    notes: string | null
  }>
}

export function JobPrintSheet({ data }: { data: JobPrintData }) {
  const t = useTranslations('JobPrint')
  const router = useRouter()
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  const { job, company, product, design, mold, cutters = [], steps = [] } = data

  useEffect(() => {
    if (typeof window !== 'undefined' && job.job_id) {
      const jobUrl = `${window.location.origin}/equipment/jobs/${job.job_id}`
      QRCode.toDataURL(jobUrl, { width: 80, margin: 0 }, (err, url) => {
        if (!err && url) {
          setQrDataUrl(url)
        }
      })
    }
  }, [job.job_id])

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr)
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
    } catch {
      return dateStr
    }
  }

  return (
    <div className="job-print-wrapper">
      {/* ── Action Toolbar (Screen Only) ── */}
      <div className="job-print-actions no-print">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <ArrowLeft size={14} />
            <span>{t('back')}</span>
          </button>
          <Link
            href="/equipment/jobs"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <ArrowUpFromLine size={14} />
            <span>{t('jobList')}</span>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link
            href={`/worklogs/new?job_id=${job.job_id}`}
            className="btn btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent)' }}
          >
            <ExternalLink size={14} />
            <span>{t('goToNippo')}</span>
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Printer size={16} />
            <span>{t('printButton')}</span>
          </button>
        </div>
      </div>

      {/* ── A4 Print Sheet ── */}
      <div className="job-print-sheet">
        {/* Header Block */}
        <div className="job-header-box">
          <div>
            <h1 className="job-doc-title">{t('docTitle')}</h1>
            <div className="job-doc-subtitle">
              YSD Manufacturing System — Tooling Work Order & Routing Sheet
            </div>
            <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: 'var(--accent, #0284c7)' }}>
              {job.job_name}
            </div>
          </div>

          {/* QR Code */}
          <div className="job-qr-block">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Job QR" width={80} height={80} />
            ) : (
              <div style={{ width: 80, height: 80, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9 }}>QR Code</span>
              </div>
            )}
            <span className="job-qr-text">{t('qrSubtitle')}</span>
          </div>
        </div>

        {/* 1. Basic Information */}
        <div className="job-section">
          <div className="job-section-title">
            <Box size={13} />
            <span>{t('secBasic')}</span>
          </div>
          <div className="job-grid-4">
            <div className="job-cell">
              <span className="job-cell-label">{t('jobCode')}</span>
              <span className="job-cell-value job-cell-mono">{job.job_code}</span>
            </div>
            <div className="job-cell">
              <span className="job-cell-label">{t('issueDate')}</span>
              <span className="job-cell-value job-cell-mono">{formatDate(job.created_at)}</span>
            </div>
            <div className="job-cell">
              <span className="job-cell-label">{t('customer')}</span>
              <span className="job-cell-value">
                {company ? `${company.company_name} (${company.company_code})` : '—'}
              </span>
            </div>
            <div className="job-cell">
              <span className="job-cell-label">{t('product')}</span>
              <span className="job-cell-value">
                {product ? `${product.product_code} / ${product.product_name || product.product_name_internal || ''}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Schedule & Deadlines */}
        <div className="job-section">
          <div className="job-section-title">
            <Calendar size={13} />
            <span>{t('secSchedule')}</span>
          </div>
          <div className="job-grid-2">
            <div className="job-cell">
              <span className="job-cell-label">{t('moldDeadline')}</span>
              <span className="job-cell-value job-cell-mono" style={{ color: '#b91c1c', fontSize: 13 }}>
                {formatDate(job.mold_deadline)}
              </span>
            </div>
            <div className="job-cell">
              <span className="job-cell-label">{t('shipDate')}</span>
              <span className="job-cell-value job-cell-mono" style={{ fontSize: 13 }}>
                {formatDate(job.ship_date)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Design Specs (SSOT) */}
        <div className="job-section">
          <div className="job-section-title">
            <Layers size={13} />
            <span>{t('secSpecs')}</span>
          </div>
          <div className="job-grid-4">
            <div className="job-cell">
              <span className="job-cell-label">{t('cutline')}</span>
              <span className="job-cell-value job-cell-mono">
                {design?.cutline_length && design?.cutline_width
                  ? `${design.cutline_length} × ${design.cutline_width} mm`
                  : '—'}
              </span>
            </div>
            <div className="job-cell">
              <span className="job-cell-label">{t('cornerR')} / {t('chamferC')}</span>
              <span className="job-cell-value job-cell-mono">
                {design?.corner_r ? `R${design.corner_r}` : '—'} / {design?.chamfer_c ? `C${design.chamfer_c}` : '—'}
              </span>
            </div>
            <div className="job-cell">
              <span className="job-cell-label">{t('cavities')}</span>
              <span className="job-cell-value job-cell-mono">
                {design?.cavity_count ? `${design.cavity_count} ヶ取` : '—'}
              </span>
            </div>
            <div className="job-cell">
              <span className="job-cell-label">{t('designCode')}</span>
              <span className="job-cell-value job-cell-mono">
                {design?.design_code || '—'}
              </span>
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '4px 8px', borderTop: '1px solid #cbd5e1' }}>
            <span className="job-cell-label" style={{ display: 'block' }}>{t('plastic')}</span>
            <span className="job-cell-value" style={{ color: '#0369a1' }}>
              {design?.plastic_type_designed || '—'}
            </span>
          </div>
        </div>

        {/* 4. Equipment & Storage Location */}
        <div className="job-section">
          <div className="job-section-title">
            <Scissors size={13} />
            <span>{t('secEquipment')}</span>
          </div>
          <div className="job-grid-2">
            {/* Mold Location */}
            <div className="job-cell">
              <span className="job-cell-label">{t('moldLocation')}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <span className="job-cell-mono" style={{ fontSize: 13, fontWeight: 800 }}>
                  {mold?.equipment_code || '—'}
                </span>
                <span style={{ fontSize: 10, color: '#475569' }}>
                  ({mold?.display_name || '主型'})
                </span>
              </div>
              <div style={{ marginTop: 3, fontWeight: 700, color: '#047857', fontSize: 12 }}>
                📍 {mold?.rack_code ? `棚 ${mold.rack_code} - 段 ${mold.layer_code || '?'}` : '保管場所: 未割当'}
                {mold?.location_in_factory && <span style={{ fontSize: 10, color: '#64748b', marginLeft: 4 }}>({mold.location_in_factory})</span>}
              </div>
            </div>

            {/* Cutter Location */}
            <div className="job-cell">
              <span className="job-cell-label">{t('cutterLocation')}</span>
              {cutters.length > 0 ? (
                cutters.map(cutter => (
                  <div key={cutter.equipment_id} style={{ marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span className="job-cell-mono" style={{ fontSize: 12, fontWeight: 700 }}>
                        {cutter.equipment_code}
                      </span>
                      <span style={{ fontSize: 9, color: '#475569' }}>({cutter.relationship_type})</span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#047857', fontSize: 11 }}>
                      📍 {cutter.rack_code ? `棚 ${cutter.rack_code} - 段 ${cutter.layer_code || '?'}` : '未割当'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ marginTop: 4, color: '#64748b', fontStyle: 'italic' }}>
                  {t('noCutter')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Steps & Work Routing */}
        <div className="job-section">
          <div className="job-section-title">
            <CheckCircle2 size={13} />
            <span>{t('secSteps')}</span>
          </div>
          <table className="job-steps-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>{t('stepNo')}</th>
                <th>{t('stepName')}</th>
                <th style={{ width: 90 }}>{t('status')}</th>
                <th style={{ width: 110 }}>{t('worker')}</th>
                <th style={{ width: 65 }}>{t('plannedHours')}</th>
                <th style={{ width: 65 }}>{t('actualHours')}</th>
              </tr>
            </thead>
            <tbody>
              {steps.length > 0 ? (
                steps.map(step => (
                  <tr key={step.step_id}>
                    <td style={{ textAlign: 'center', fontWeight: 700 }} className="job-cell-mono">
                      {step.step_no}
                    </td>
                    <td style={{ fontWeight: 600 }}>{step.step_name}</td>
                    <td style={{ textAlign: 'center', fontSize: 10 }}>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: 3,
                        background: step.step_status === 'COMPLETED' ? '#dcfce7' : step.step_status === 'IN_PROGRESS' ? '#e0f2fe' : '#f1f5f9',
                        color: step.step_status === 'COMPLETED' ? '#166534' : step.step_status === 'IN_PROGRESS' ? '#0369a1' : '#475569',
                        fontWeight: 700,
                      }}>
                        {step.step_status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {step.employee_name || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }} className="job-cell-mono">
                      {step.planned_hours ? `${step.planned_hours} h` : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }} className="job-cell-mono">
                      {step.actual_hours ? `${step.actual_hours} h` : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: 12 }}>
                    工程データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Sign-off Boxes (Japanese Workshop Standard) */}
        <div style={{ marginTop: 'auto', paddingTop: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            {t('secSignoff')}
          </div>
          <div className="job-signoff-grid">
            <div className="job-signoff-box">
              <div className="job-signoff-header">{t('signCAM')}</div>
              <div className="job-signoff-body">印</div>
            </div>
            <div className="job-signoff-box">
              <div className="job-signoff-header">{t('signMachining')}</div>
              <div className="job-signoff-body">印</div>
            </div>
            <div className="job-signoff-box">
              <div className="job-signoff-header">{t('signAssembly')}</div>
              <div className="job-signoff-body">印</div>
            </div>
            <div className="job-signoff-box">
              <div className="job-signoff-header">{t('signQC')}</div>
              <div className="job-signoff-body">印</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
