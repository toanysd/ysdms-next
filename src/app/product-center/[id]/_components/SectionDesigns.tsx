'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PenTool, FlaskConical, Factory } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SectionShell } from './SectionShell'
import { isPrototypeDesignOrMold } from '@/lib/utils/moldNaming'

interface DesignRevision {
  revision_id: string
  design_code: string | null
  revision_number: number | null
  status: string | null
  design_date: string | null
  created_at: string
  plastic_type_designed: string | null
  designer: string | null
  parent_design_id: string | null
  design_category: string | null
}

const STATUS_BADGE: Record<string, string> = {
  APPROVED: 'badge badge--success',
  RELEASED: 'badge badge--warning',
  REJECTED: 'badge badge--error',
  SUBMITTED: 'badge badge--info',
  DRAFT: 'badge badge--neutral',
  SUPERSEDED: 'badge badge--neutral',
}

interface RevisionTreeNode {
  revision: DesignRevision
  children: DesignRevision[]
}

function buildRevisionTree(revisions: DesignRevision[]): RevisionTreeNode[] {
  const isProto = (rev: DesignRevision) =>
    rev.design_category === 'PROTOTYPE_POCKET' ||
    rev.parent_design_id != null ||
    isPrototypeDesignOrMold({ design_category: rev.design_category, design_code: rev.design_code })

  const massRevs = revisions.filter(r => !isProto(r))
  const protoRevs = revisions.filter(r => isProto(r))

  const protoByParent = new Map<string, DesignRevision[]>()
  const unmatchedProtos: DesignRevision[] = []

  for (const proto of protoRevs) {
    if (proto.parent_design_id) {
      const existing = protoByParent.get(proto.parent_design_id) || []
      existing.push(proto)
      protoByParent.set(proto.parent_design_id, existing)
    } else {
      unmatchedProtos.push(proto)
    }
  }

  const tree: RevisionTreeNode[] = massRevs.map(mass => ({
    revision: mass,
    children: protoByParent.get(mass.revision_id) || [],
  }))

  for (const proto of unmatchedProtos) {
    const alreadyIncluded = tree.some(n =>
      n.revision.revision_id === proto.revision_id ||
      n.children.some(c => c.revision_id === proto.revision_id)
    )
    if (!alreadyIncluded) {
      tree.push({ revision: proto, children: [] })
    }
  }

  return tree
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
          .select('revision_id, design_code, revision_number, status, design_date, created_at, plastic_type_designed, designer, parent_design_id, design_category')
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

  const revisionTree = useMemo(() => buildRevisionTree(revisions), [revisions])

  const renderRevisionRow = (rev: DesignRevision, isChild: boolean = false) => {
    const isProto = rev.design_category === 'PROTOTYPE_POCKET' ||
      rev.parent_design_id != null ||
      isPrototypeDesignOrMold({ design_category: rev.design_category, design_code: rev.design_code })

    return (
      <div
        key={rev.revision_id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '3px 0',
          paddingLeft: isChild ? 16 : 0,
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        {/* 試作 / 正規 badge */}
        {isProto ? (
          <span style={{
            fontSize: 8, padding: '1px 3px', borderRadius: 2, fontWeight: 700,
            background: 'color-mix(in srgb, #F59E0B 15%, transparent)', color: '#B45309',
            display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
          }}>
            <FlaskConical size={8} /> 試作
          </span>
        ) : (
          <span style={{
            fontSize: 8, padding: '1px 3px', borderRadius: 2, fontWeight: 700,
            background: 'color-mix(in srgb, #10B981 15%, transparent)', color: '#047857',
            display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
          }}>
            <Factory size={8} /> 正規
          </span>
        )}

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
  }

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
          {revisionTree.map((node) => (
            <div key={node.revision.revision_id}>
              {renderRevisionRow(node.revision, false)}
              {node.children.map((child) => renderRevisionRow(child, true))}
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
