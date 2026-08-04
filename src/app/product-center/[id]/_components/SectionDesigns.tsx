'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PenTool } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SectionShell } from './SectionShell'

interface DesignRevision {
  revision_id: string
  design_code: string | null
  revision_number: number | null
  status: string | null
  design_date: string | null
  created_at: string
  plastic_type_designed: string | null
  designer: string | null
}

const STATUS_BADGE: Record<string, string> = {
  APPROVED: 'badge badge--success',
  RELEASED: 'badge badge--warning',
  REJECTED: 'badge badge--error',
  SUBMITTED: 'badge badge--info',
  DRAFT: 'badge badge--neutral',
  SUPERSEDED: 'badge badge--neutral',
}

export function SectionDesigns({ productId }: { productId: string }) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()
  const [revisions, setRevisions] = useState<DesignRevision[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDesigns() {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('design_revisions')
          .select('revision_id, design_code, revision_number, status, design_date, created_at, plastic_type_designed, designer')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) setRevisions(data as DesignRevision[])
      } catch (error) {
        console.error('Error fetching design revisions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) fetchDesigns()
  }, [productId])

  return (
    <SectionShell
      titleKey="section3Title"
      icon={PenTool}
      accentColor="var(--tint-teal-text)"
      count={revisions.length}
      isLoading={isLoading}
    >
      {revisions.length === 0 ? (
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>「―」</span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {revisions.map((rev, index) => {
            return (
              <div
                key={rev.revision_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '3px 0',
                  borderBottom: '1px solid var(--border-default)',
                }}
              >
                <Link
                  href={`/engineering/designs/revisions/${rev.revision_id}`}
                  style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                >
                  {rev.design_code || rev.revision_id.slice(0, 8)}
                </Link>
                {rev.revision_number !== null && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Rev.{rev.revision_number}
                  </span>
                )}
                <span className={STATUS_BADGE[rev.status || ''] || 'badge badge--neutral'} style={{ fontSize: 9 }}>
                  {rev.status || '—'}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {rev.design_date || (rev.created_at ? new Date(rev.created_at).toLocaleDateString() : '')}
                  {rev.plastic_type_designed && (
                    <span style={{ fontSize: 9, opacity: 0.8 }}>{rev.plastic_type_designed}</span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </SectionShell>
  )
}
