'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Layers, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface SetEquipmentRow {
  equipment_id: string
  equipment_code: string
  display_name: string | null
  equipment_type: string
  relationship_type: 'PRIMARY' | 'SET_MEMBER' | 'SHARED' | 'DIRECT_REVISION'
  actual_length_mm: string | number | null
  actual_width_mm: string | number | null
  actual_height_mm: string | number | null
  rack_code: string | null
  layer_code: string | null
  status: string | null
}

export function EquipmentSetTab({ job }: { job: any }) {
  const t = useTranslations('Equipment.setTab')
  const supabase = createClient()
  const [items, setItems] = useState<SetEquipmentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadSetEquipment() {
      setLoading(true)
      const map = new Map<string, SetEquipmentRow>()
      const primaryEqId: string | null = job?.equipment_id || null
      const designRevId: string | null = job?.design_revision_id || null

      try {
        // 1. Direct primary equipment on job (if any)
        if (primaryEqId) {
          const { data: primaryEq } = await supabase
            .from('equipment')
            .select(`
              equipment_id,
              equipment_code,
              display_name,
              equipment_type,
              device_status,
              usage_status,
              actual_length_mm,
              actual_width_mm,
              actual_height_mm,
              rack_layers(
                layer_code,
                racks(rack_code)
              )
            `)
            .eq('equipment_id', primaryEqId)
            .maybeSingle()

          if (primaryEq) {
            const rl: any = primaryEq.rack_layers
            map.set(primaryEq.equipment_id, {
              equipment_id: primaryEq.equipment_id,
              equipment_code: primaryEq.equipment_code,
              display_name: primaryEq.display_name,
              equipment_type: primaryEq.equipment_type || 'MOLD',
              relationship_type: 'PRIMARY',
              actual_length_mm: primaryEq.actual_length_mm,
              actual_width_mm: primaryEq.actual_width_mm,
              actual_height_mm: primaryEq.actual_height_mm,
              rack_code: rl?.racks?.rack_code || null,
              layer_code: rl?.layer_code || null,
              status: primaryEq.usage_status || primaryEq.device_status || 'ACTIVE',
            })
          }
        }

        // 2. Equipment directly bound via design_revision_id
        if (designRevId) {
          const { data: revEquips } = await supabase
            .from('equipment')
            .select(`
              equipment_id,
              equipment_code,
              display_name,
              equipment_type,
              device_status,
              usage_status,
              actual_length_mm,
              actual_width_mm,
              actual_height_mm,
              rack_layers(
                layer_code,
                racks(rack_code)
              )
            `)
            .eq('design_revision_id', designRevId)

          if (revEquips) {
            revEquips.forEach((eq: any) => {
              if (!map.has(eq.equipment_id)) {
                const rl: any = eq.rack_layers
                map.set(eq.equipment_id, {
                  equipment_id: eq.equipment_id,
                  equipment_code: eq.equipment_code,
                  display_name: eq.display_name,
                  equipment_type: eq.equipment_type || 'EQUIPMENT',
                  relationship_type: eq.equipment_id === primaryEqId ? 'PRIMARY' : 'DIRECT_REVISION',
                  actual_length_mm: eq.actual_length_mm,
                  actual_width_mm: eq.actual_width_mm,
                  actual_height_mm: eq.actual_height_mm,
                  rack_code: rl?.racks?.rack_code || null,
                  layer_code: rl?.layer_code || null,
                  status: eq.usage_status || eq.device_status || 'ACTIVE',
                })
              }
            })
          }
        }

        // 3. Equipment linked via SSOT public.equipment_assignments (SET_MEMBER & SHARED)
        const seedIds = Array.from(map.keys())
        if (seedIds.length > 0) {
          const { data: assignments } = await supabase
            .from('equipment_assignments')
            .select(`
              assignment_id,
              primary_equipment_id,
              related_equipment_id,
              relationship_type,
              primary_eq:equipment!equipment_assignments_primary_equipment_id_fkey(
                equipment_id,
                equipment_code,
                display_name,
                equipment_type,
                device_status,
                usage_status,
                actual_length_mm,
                actual_width_mm,
                actual_height_mm,
                rack_layers(
                  layer_code,
                  racks(rack_code)
                )
              ),
              related_eq:equipment!equipment_assignments_related_equipment_id_fkey(
                equipment_id,
                equipment_code,
                display_name,
                equipment_type,
                device_status,
                usage_status,
                actual_length_mm,
                actual_width_mm,
                actual_height_mm,
                rack_layers(
                  layer_code,
                  racks(rack_code)
                )
              )
            `)
            .or(`primary_equipment_id.in.(${seedIds.join(',')}),related_equipment_id.in.(${seedIds.join(',')})`)

          if (assignments) {
            assignments.forEach((a: any) => {
              const relType: 'SET_MEMBER' | 'SHARED' =
                a.relationship_type === 'SHARED' ? 'SHARED' : 'SET_MEMBER'

              const candidates = [a.related_eq, a.primary_eq].filter(Boolean)
              candidates.forEach((target: any) => {
                const existing = map.get(target.equipment_id)
                if (!existing) {
                  const rl: any = target.rack_layers
                  map.set(target.equipment_id, {
                    equipment_id: target.equipment_id,
                    equipment_code: target.equipment_code,
                    display_name: target.display_name,
                    equipment_type: target.equipment_type || 'EQUIPMENT',
                    relationship_type: relType,
                    actual_length_mm: target.actual_length_mm,
                    actual_width_mm: target.actual_width_mm,
                    actual_height_mm: target.actual_height_mm,
                    rack_code: rl?.racks?.rack_code || null,
                    layer_code: rl?.layer_code || null,
                    status: target.usage_status || target.device_status || 'ACTIVE',
                  })
                } else if (existing.relationship_type === 'DIRECT_REVISION') {
                  existing.relationship_type = relType
                }
              })
            })
          }
        }

        if (isMounted) {
          setItems(Array.from(map.values()))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSetEquipment()
    return () => {
      isMounted = false
    }
  }, [job?.equipment_id, job?.design_revision_id, supabase])

  const formatDims = (row: SetEquipmentRow) => {
    const l = row.actual_length_mm
    const w = row.actual_width_mm
    const h = row.actual_height_mm
    if (!l && !w && !h) return '—'
    return `${l ?? '—'} × ${w ?? '—'}${h ? ` × ${h}` : ''}`
  }

  const renderRelationBadge = (rel: SetEquipmentRow['relationship_type']) => {
    if (rel === 'PRIMARY') {
      return <span className="badge badge--success" style={{ fontSize: 11, fontWeight: 700 }}>{t('relPrimary')}</span>
    }
    if (rel === 'SHARED') {
      return <span className="badge badge--warning" style={{ fontSize: 11, fontWeight: 700 }}>{t('relShared')}</span>
    }
    if (rel === 'SET_MEMBER') {
      return <span className="badge badge--info" style={{ fontSize: 11, fontWeight: 700 }}>{t('relSetMember')}</span>
    }
    return <span className="badge badge--neutral" style={{ fontSize: 11, fontWeight: 700 }}>{t('relDirectRev')}</span>
  }

  if (loading) {
    return (
      <div className="card-flat" style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Loader2 size={18} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div className="card-flat" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--tint-teal-bg)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Layers size={16} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          {t('title')} ({items.length})
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>{t('colCode')}</th>
              <th>{t('colName')}</th>
              <th>{t('colType')}</th>
              <th>{t('colRelation')}</th>
              <th style={{ textAlign: 'right' }}>{t('colDimensions')}</th>
              <th>{t('colLocation')}</th>
              <th>{t('colStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {t('emptySet')}
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isCutter = ['CUTTER_SEPARATE', 'CUTTER_INLINE', 'CUTTER'].includes(item.equipment_type)
                const detailHref = isCutter
                  ? `/equipment/unified?id=${item.equipment_id}`
                  : `/equipment/molds/${item.equipment_id}`

                return (
                  <tr key={item.equipment_id}>
                    <td>
                      <Link
                        href={detailHref}
                        style={{
                          color: 'var(--accent)',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          fontSize: 13,
                          textDecoration: 'none',
                        }}
                      >
                        {item.equipment_code}
                      </Link>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.display_name || '—'}
                    </td>
                    <td>
                      <span className="badge badge--neutral" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                        {item.equipment_type}
                      </span>
                    </td>
                    <td>{renderRelationBadge(item.relationship_type)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      {formatDims(item)}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-primary)' }}>
                      {item.rack_code || item.layer_code ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} style={{ color: 'var(--accent)' }} />
                          {item.rack_code || ''}{item.layer_code ? ` / ${item.layer_code}` : ''}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <span className="badge badge--info" style={{ fontSize: 11 }}>
                        {item.status || '—'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
