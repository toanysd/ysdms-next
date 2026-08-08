'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Wrench, MapPin } from 'lucide-react'
import { SectionShell } from './SectionShell'
import Link from 'next/link'

interface SectionEquipmentProps {
  productId: string
}

interface EquipmentItem {
  id: string
  type: string
  code: string
  name: string
  status: string
  rack: string
  url: string
}

const TYPE_LABEL: Record<string, string> = {
  MOLD: '🔧',
  PLUG: '📌',
  CUTTER: '✂️',
  CUTTER_INLINE: '✂️',
  CUTTER_SEPARATE: '✂️',
  WATER_BASE: '💧',
  PRESSURE_BASE: '⚙️',
}

export function SectionEquipment({ productId }: SectionEquipmentProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { data: revs } = await supabase
          .from('design_revisions')
          .select('revision_id')
          .eq('product_id', productId)

        if (!revs || revs.length === 0) {
          setEquipmentList([])
          return
        }

        const revIds = revs.map((r: any) => r.revision_id)

        const [{ data: equipData }, { data: moldsData }] = await Promise.all([
          supabase
            .from('equipment')
            .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, rack_layers(layer_code, racks(rack_code))')
            .in('design_revision_id', revIds),
          supabase
            .from('physical_molds')
            .select('physical_mold_id, system_code, display_name, usage_status, rack_layers(layer_code, racks(rack_code))')
            .limit(20),
        ])

        const list: EquipmentItem[] = []

        if (equipData) {
          equipData.forEach((eq: any) => {
            const rackCode = eq.rack_layers?.racks?.rack_code || ''
            const layerCode = eq.rack_layers?.layer_code || ''
            const rack = [rackCode, layerCode].filter(Boolean).join('-') || '—'
            list.push({
              id: eq.equipment_id,
              type: eq.equipment_type || 'EQUIPMENT',
              code: eq.equipment_code || '',
              name: eq.display_name || '',
              status: eq.usage_status || eq.device_status || '',
              rack,
              url: `/equipment/unified?id=${eq.equipment_id}`,
            })
          })
        }

        if (moldsData) {
          moldsData.forEach((m: any) => {
            const rackCode = m.rack_layers?.racks?.rack_code || ''
            const layerCode = m.rack_layers?.layer_code || ''
            const rack = [rackCode, layerCode].filter(Boolean).join('-') || '—'
            list.push({
              id: m.physical_mold_id,
              type: 'MOLD',
              code: m.system_code || '',
              name: m.display_name || '',
              status: m.usage_status || '',
              rack,
              url: `/equipment/molds/${m.physical_mold_id}`,
            })
          })
        }

        setEquipmentList(list)
      } catch (err) {
        console.error('Error fetching equipment:', err)
      } finally {
        setLoading(false)
      }
    }
    if (productId) loadData()
  }, [productId])

  return (
    <SectionShell
      icon={Wrench}
      titleKey="section4Title"
      accentColor="var(--tint-orange-text)"
      count={equipmentList.length}
      isLoading={loading}
    >
      {equipmentList.length === 0 ? (
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {equipmentList.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 0',
                borderBottom: idx < equipmentList.length - 1 ? '1px solid var(--border-default)' : 'none',
              }}
            >
              {/* Type emoji */}
              <span style={{ fontSize: 13, flexShrink: 0 }}>
                {TYPE_LABEL[item.type?.toUpperCase()] || '📦'}
              </span>

              {/* Code link */}
              <Link
                href={item.url}
                style={{
                  fontFamily: 'monospace', fontWeight: 700, fontSize: 12,
                  color: 'var(--accent)', textDecoration: 'none', flexShrink: 0,
                }}
              >
                {item.code}
              </Link>

              {/* Name */}
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </span>

              {/* Rack location */}
              {item.rack !== '—' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
                  <MapPin size={10} />{item.rack}
                </span>
              )}

              {/* Status badge */}
              <span className="badge badge--neutral" style={{ fontSize: 9, flexShrink: 0 }}>
                {item.status || item.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}