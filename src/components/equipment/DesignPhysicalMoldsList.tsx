'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Wrench, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type PhysicalMold = {
  physical_mold_id: string
  system_code: string
  display_name: string
  device_status: string
  created_at: string
  mold_revisions?: {
    design_revision_id: string
  } | null
}

export function DesignPhysicalMoldsList({ 
  productId,
  productCode,
  selectedRevisionId,
  selectedMoldId,
  onMoldSelect
}: { 
  productId?: string
  productCode?: string
  selectedRevisionId: string | null
  selectedMoldId: string | null
  onMoldSelect: (id: string | null) => void
}) {
  const t = useTranslations('Engineering')
  const supabase = createClient()
  const [molds, setMolds] = useState<PhysicalMold[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMolds = useCallback(async () => {
    setLoading(true)

    let req = supabase
      .from('physical_molds')
      .select('physical_mold_id, system_code, display_name, device_status, created_at, mold_revisions!inner(design_revision_id, design_revisions!inner(product_id))')

    if (selectedRevisionId) {
      req = req.eq('mold_revisions.design_revision_id', selectedRevisionId)
    } else if (productId) {
      req = req.eq('mold_revisions.design_revisions.product_id', productId)
    } else if (productCode) {
      req = req.ilike('system_code', `${productCode}%`)
    } else {
      setMolds([])
      setLoading(false)
      return
    }

    const { data, error } = await req.order('created_at', { ascending: false })

    if (!error && data) {
      setMolds(data as unknown as PhysicalMold[])
    } else {
      setMolds([])
    }
    setLoading(false)
  }, [productId, productCode, selectedRevisionId, supabase])

  useEffect(() => {
    fetchMolds()
  }, [fetchMolds])

  if (loading) {
    return <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('loading')}</div>
  }

  return (
    <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Wrench size={14} style={{ color: 'var(--accent)' }} />
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>{t('relatedMolds')} ({molds.length})</h3>
        {selectedRevisionId ? (
          <span className="badge badge--info" style={{ fontSize: 10, marginLeft: 'auto', fontWeight: 600 }}>
            Filtered by Revision
          </span>
        ) : null}
      </div>
      <div style={{ overflowX: 'auto', maxHeight: 400 }}>
        {molds.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            {t('noRelatedMolds')}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('systemCode')}</th>
                <th>{t('displayName')}</th>
                <th>{t('statusLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {molds.map(mold => {
                const isSelected = selectedMoldId === mold.physical_mold_id
                return (
                  <tr 
                    key={mold.physical_mold_id}
                    onClick={() => onMoldSelect(isSelected ? null : mold.physical_mold_id)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : undefined,
                      borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent'
                    }}
                    className="hover:bg-[var(--bg-surface-2)] transition-colors"
                  >
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                      <Link href={`/equipment/molds/${mold.physical_mold_id}`} style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {mold.system_code}
                          <ExternalLink size={10} />
                      </Link>
                    </td>
                    <td style={{ fontSize: 12 }}>{mold.display_name}</td>
                    <td style={{ fontSize: 11 }}>{mold.device_status}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
