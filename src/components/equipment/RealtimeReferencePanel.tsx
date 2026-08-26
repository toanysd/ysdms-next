'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, CheckCircle2, Box, Package, PenTool, Wrench, Briefcase, RefreshCw, ChevronRight } from 'lucide-react'

type Props = {
  customerSearch: string
  productCode: string
  designCode: string
  systemCode: string
  jobCode: string
  onSelectProduct?: (prod: any) => void
  onSelectDesign?: (design: any) => void
  onSelectMold?: (mold: any) => void
  onSelectJob?: (jobId: string) => void
}

export function RealtimeReferencePanel({
  customerSearch,
  productCode,
  designCode,
  systemCode,
  jobCode,
  onSelectProduct,
  onSelectDesign,
  onSelectMold,
  onSelectJob,
}: Props) {
  const t = useTranslations('Equipment.QuickCreate')
  const supabase = createClient()

  // Dynamic state for realtime duplicate matches
  const [existingProduct, setExistingProduct] = useState<any | null>(null)
  const [existingDesigns, setExistingDesigns] = useState<any[]>([])
  const [existingMold, setExistingMold] = useState<any | null>(null)
  const [existingJob, setExistingJob] = useState<any | null>(null)
  const [checking, setChecking] = useState(false)

  function getSearchVariants(term: string): string[] {
  const raw = term.trim()
  if (!raw) return []
  const compact = raw.replace(/[-_\s]/g, '')
  let hyphenated = raw
  if (/^[A-Za-z]+\d+$/.test(compact)) {
    hyphenated = compact.replace(/^([A-Za-z]+)(\d+)$/, '$1-$2')
  }
  const set = new Set([raw, compact, hyphenated])
  return Array.from(set)
}

// Debounced realtime query
  useEffect(() => {
    const timer = setTimeout(async () => {
      setChecking(true)
      const cleanProd = productCode.trim()
      const cleanDesign = designCode.trim()
      const cleanMold = systemCode.trim()
      const cleanJob = jobCode.trim()

      const promises = []

      // 1. Check Product with compact & hyphenated variants (e.g. JAE359 vs JAE-359)
      if (cleanProd) {
        const prodVariants = getSearchVariants(cleanProd)
        const prodCond = prodVariants.flatMap(v => [
          `product_code.ilike.%${v}%`,
          `product_name_internal.ilike.%${v}%`
        ]).join(',')

        promises.push(
          supabase
            .from('products')
            .select('*, companies(company_name, company_code)')
            .or(prodCond)
            .limit(3)
        )
      } else {
        promises.push(Promise.resolve({ data: null }))
      }

      // 2. Check Design Revisions
      if (cleanDesign || cleanProd) {
        const desVariants = getSearchVariants(cleanDesign || cleanProd)
        const desCond = desVariants.map(v => `design_code.ilike.%${v}%`).join(',')

        promises.push(
          supabase
            .from('design_revisions')
            .select('*')
            .or(desCond)
            .order('revision_number', { ascending: false })
            .limit(5)
        )
      } else {
        promises.push(Promise.resolve({ data: null }))
      }

      // 3. Check Physical Molds
      if (cleanMold || cleanProd) {
        const moldVariants = getSearchVariants(cleanMold || cleanProd)
        const moldCond = moldVariants.flatMap(v => [
          `system_code.ilike.%${v}%`,
          `physical_stamp.ilike.%${v}%`
        ]).join(',')

        promises.push(
          supabase
            .from('equipment')
            .select('*')
            .or(moldCond)
            .limit(3)
        )
      } else {
        promises.push(Promise.resolve({ data: null }))
      }

      // 4. Check Jobs
      if (cleanJob) {
        const jobVariants = getSearchVariants(cleanJob)
        const jobCond = jobVariants.map(v => `job_code.ilike.%${v}%`).join(',')

        promises.push(
          supabase
            .from('jobs')
            .select('job_id, job_code, job_name, job_status')
            .or(jobCond)
            .limit(3)
        )
      } else {
        promises.push(Promise.resolve({ data: null }))
      }

      const [prodRes, desRes, moldRes, jobRes] = await Promise.all(promises)

      setExistingProduct(prodRes.data && prodRes.data.length > 0 ? prodRes.data[0] : null)
      setExistingDesigns(desRes.data || [])
      setExistingMold(moldRes.data && moldRes.data.length > 0 ? moldRes.data[0] : null)
      setExistingJob(jobRes.data && jobRes.data.length > 0 ? jobRes.data[0] : null)

      setChecking(false)
    }, 350)

    return () => clearTimeout(timer)
  }, [productCode, designCode, systemCode, jobCode, supabase])

  return (
    <div
      className="card-flat"
      style={{
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'var(--bg-surface)',
        borderLeft: '4px solid var(--accent)',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Box size={15} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
            {t('panelRightTitle')}
          </span>
        </div>
        {checking && <RefreshCw size={12} className="spin" style={{ color: 'var(--text-muted)' }} />}
      </div>

      {/* ── 1. Duplicate Check: Product ── */}
      <div className="card-flat" style={{ padding: 10, fontSize: 11, background: existingProduct ? 'color-mix(in srgb, var(--status-warning) 10%, var(--bg-surface-2))' : 'var(--bg-surface-2)', border: existingProduct ? '1px solid var(--status-warning)' : '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontWeight: 700, color: existingProduct ? 'var(--status-warning-text)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Package size={13} />
            {existingProduct ? t('duplicateDetected') : t('newProduct')}
          </span>
          {existingProduct && (
            <span className="badge badge--warning" style={{ fontSize: 9 }}>DUPLICATE</span>
          )}
        </div>

        {existingProduct ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
            <div>• {t('codeLabel')}: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{existingProduct.product_code}</strong></div>
            <div>• {t('nameLabel')}: {existingProduct.product_name}</div>
            {existingProduct.companies && (
              <div>• {t('custLabel')}: <strong>{existingProduct.companies.company_name}</strong> ({existingProduct.companies.company_code})</div>
            )}

          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>
            {productCode ? `✓ ${t('refProductValid')}` : t('refProductEmpty')}
          </div>
        )}
      </div>

      {/* ── 2. Reference: Existing Design Revisions ── */}
      <div className="card-flat" style={{ padding: 10, fontSize: 11, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}>
        <div style={{ fontWeight: 700, color: '#8B5CF6', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <PenTool size={13} />
          <span>{t('refDesignTitle')} ({existingDesigns.length})</span>
        </div>

        {existingDesigns.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('refDesignEmpty')}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 110, overflowY: 'auto' }}>
            {existingDesigns.map(des => (
              <div
                key={des.revision_id}
                style={{
                  padding: '4px 6px',
                  borderRadius: 4,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{des.design_code}</strong>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 6 }}>Rev {des.revision_number}</span>
                </div>
                <span className="badge badge--info" style={{ fontSize: 9 }}>{des.status || 'APPROVED'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Reference: Physical Mold ── */}
      <div className="card-flat" style={{ padding: 10, fontSize: 11, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}>
        <div style={{ fontWeight: 700, color: '#F59E0B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Wrench size={13} />
          <span>{t('refMoldTitle')}</span>
        </div>

        {existingMold ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>• {t('systemCodeLabel')}: <strong style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{existingMold.system_code}</strong></div>
            <div>• {t('nameLabel')}: {existingMold.display_name}</div>
            <div>• {t('stampLabel')}: {existingMold.physical_stamp || '—'}</div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('refMoldEmpty')}</div>
        )}
      </div>

      {/* ── 4. Duplicate Check: Job ── */}
      <div className="card-flat" style={{ padding: 10, fontSize: 11, background: existingJob ? 'color-mix(in srgb, var(--status-warning) 10%, var(--bg-surface-2))' : 'var(--bg-surface-2)', border: existingJob ? '1px solid var(--status-warning)' : '1px solid var(--border-default)' }}>
        <div style={{ fontWeight: 700, color: existingJob ? 'var(--status-warning-text)' : '#10B981', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Briefcase size={13} />
          <span>{existingJob ? t('refJobDuplicate') : t('refJobTitle')}</span>
        </div>

        {existingJob ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div>
              <strong style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>[{existingJob.job_code}]</strong> {existingJob.job_name}
            </div>
            {onSelectJob && (
              <button
                type="button"
                onClick={() => onSelectJob(existingJob.job_id)}
                className="btn btn-secondary"
                style={{ height: 20, padding: '0 6px', fontSize: 9, gap: 2 }}
              >
                <span>{t('loadJobBtn')}</span>
                <ChevronRight size={10} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('refJobValid')}</div>
        )}
      </div>

    </div>
  )
}
