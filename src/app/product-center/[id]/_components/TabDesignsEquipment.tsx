'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { PenTool, Wrench, MapPin, ExternalLink, Link2, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface TabDesignsEquipmentProps {
  productId: string
}

interface DesignRevision {
  revision_id: string
  design_code: string | null
  revision_number: number | null
  status: string | null
  design_date: string | null
  created_at: string
  plastic_type_designed: string | null
  designer: string | null
  design_length: number | null
  design_width: number | null
  design_height: number | null
  design_depth: number | null
  cutline_length: number | null
  cutline_width: number | null
  cavity_count: number | null
  cavity_pitch_mm: number | null
  machine_feed_pitch_mm: number | null
  orientation: string | null
  setup_type: string | null
  plug_type: string | null
  customer_tray_name: string | null
  tray_info: string | null
}

interface EquipmentItem {
  id: string
  type: string
  code: string
  name: string
  status: string
  rack: string
  isDirect: boolean
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

export function TabDesignsEquipment({ productId }: TabDesignsEquipmentProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [revisions, setRevisions] = useState<DesignRevision[]>([])
  const [selectedRevId, setSelectedRevId] = useState<string | null>(null)
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Fetch Design Revisions
        const { data: revsData } = await supabase
          .from('design_revisions')
          .select(`
            revision_id, design_code, revision_number, status, design_date, created_at, plastic_type_designed, designer,
            design_length, design_width, design_height, design_depth, cutline_length, cutline_width,
            cavity_count, cavity_pitch_mm, machine_feed_pitch_mm, orientation, setup_type, plug_type, customer_tray_name, tray_info
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false })

        if (revsData) {
          const revs = revsData as DesignRevision[]
          setRevisions(revs)
          if (revs.length > 0) setSelectedRevId(revs[0].revision_id)
        }

        const revIds = (revsData || []).map((r: any) => r.revision_id)

        if (revIds.length > 0) {
          // Fetch Equipment (Direct)
          const { data: equipData } = await supabase
            .from('equipment')
            .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, design_revision_id, rack_layers(layer_code, racks(rack_code))')
            .in('design_revision_id', revIds)

          // Fetch Physical Molds (Direct)
          const { data: moldsData } = await supabase
            .from('physical_molds')
            .select('physical_mold_id, system_code, display_name, usage_status, mold_revision_id, rack_layers(layer_code, racks(rack_code))')
            .in('mold_revision_id', revIds)

          const list: EquipmentItem[] = []

          if (moldsData) {
            moldsData.forEach((m: any) => {
              const rackCode = m.rack_layers?.racks?.rack_code || ''
              const layerCode = m.rack_layers?.layer_code || ''
              const rack = [rackCode, layerCode].filter(Boolean).join('-') || '—'
              list.push({
                id: m.physical_mold_id,
                type: 'MOLD',
                code: m.system_code || '',
                name: m.display_name || t('mainMoldName'),
                status: m.usage_status || 'ACTIVE',
                rack,
                isDirect: true,
                url: `/equipment/molds/${m.physical_mold_id}`,
              })
            })
          }

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
                isDirect: true,
                url: `/equipment/unified?id=${eq.equipment_id}`,
              })
            })
          }

          setEquipmentList(list)
        }
      } catch (err) {
        console.error('Error fetching designs & equipment:', err)
      } finally {
        setLoading(false)
      }
    }
    if (productId) loadData()
  }, [productId])

  const selectedRev = revisions.find(r => r.revision_id === selectedRevId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
          {t('designRevisionsAndEquipment')}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {t('drawingsAndEquipmentCount', { drawings: revisions.length, equipment: equipmentList.length })}
        </span>
      </div>

      {revisions.length === 0 ? (
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t('noDesignHistory')}</span>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 35%) 1fr', gap: 12 }}>

          {/* Left Column: Design Revisions List */}
          <div style={{ borderRight: '1px solid var(--border-default)', paddingRight: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
              {t('designRevisionHistory')}
            </div>

            {revisions.map((rev, idx) => {
              const isSelected = rev.revision_id === selectedRevId
              return (
                <div
                  key={rev.revision_id}
                  onClick={() => setSelectedRevId(rev.revision_id)}
                  style={{
                    padding: '6px 8px', cursor: 'pointer', borderRadius: 4,
                    background: isSelected ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                    borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                    marginLeft: -2, transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>
                      {rev.design_code || rev.revision_id.slice(0, 8)}
                    </span>
                    <span className="badge badge--success" style={{ fontSize: 9 }}>
                      {rev.status || 'APPROVED'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    <span>Rev.{rev.revision_number ?? 0}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{rev.design_date || rev.created_at?.slice(0, 10)}</span>
                  </div>

                  {rev.plastic_type_designed && (
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      {t('materialLabel')} <strong>{rev.plastic_type_designed}</strong>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right Column: Unified Production Equipment Set & Tech Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Selected Revision Tech Specs Summary Card */}
            {selectedRev && (
              <div className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, borderBottom: '1px solid var(--border-default)', paddingBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <PenTool size={12} style={{ color: 'var(--accent)' }} /> {t('revisionTechSpecs')} ({selectedRev.design_code || `Rev.${selectedRev.revision_number}`})
                  </span>
                  <Link
                    href={`/engineering/designs/revisions/${selectedRev.revision_id}`}
                    style={{ fontSize: 10, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    {t('viewDesignDetails')} <ExternalLink size={10} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px 12px', fontSize: 11 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('trayDimensions')}</span>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {[selectedRev.design_length, selectedRev.design_width, selectedRev.design_depth || selectedRev.design_height].filter(Boolean).join('×') || '—'} mm
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('cutlineDimensions')}</span>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                      {[selectedRev.cutline_length, selectedRev.cutline_width].filter(Boolean).join('×') || '—'} mm
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('cavityAndPitchLabel')}</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selectedRev.cavity_count ? `${selectedRev.cavity_count} ${t('holes')}` : '—'}
                      {selectedRev.cavity_pitch_mm ? ` (${selectedRev.cavity_pitch_mm}mm)` : ''}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('plasticMaterialLabel')}</span>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedRev.plastic_type_designed || '—'}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('feedPitchLabel')}</span>
                    <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {selectedRev.machine_feed_pitch_mm ? `${selectedRev.machine_feed_pitch_mm}mm` : '—'}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('plugConfigLabel')}</span>
                    <div style={{ fontSize: 11 }}>
                      {selectedRev.plug_type && selectedRev.plug_type !== 'NONE' ? selectedRev.plug_type : t('none')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{t('productionEquipmentSet')} {selectedRev?.design_code ? `(${selectedRev.design_code})` : ''}</span>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 400 }}>
                {t('equipmentSetHelpText')}
              </span>
            </div>

            {equipmentList.length === 0 ? (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('noEquipmentLinked')}</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {equipmentList.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '5px 8px', borderRadius: 4, background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{TYPE_LABEL[item.type?.toUpperCase()] || '📦'}</span>

                    <Link
                      href={item.url}
                      style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      {item.code}
                    </Link>

                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>

                    {/* Direct vs Shared Badge */}
                    {item.isDirect ? (
                      <span style={{ fontSize: 9, background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Sparkles size={9} /> {t('directBinding')}
                      </span>
                    ) : (
                      <span style={{ fontSize: 9, background: 'var(--bg-surface)', color: 'var(--text-muted)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Link2 size={9} /> {t('sharedBinding')}
                      </span>
                    )}

                    {/* Storage Rack Location */}
                    {item.rack !== '—' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-muted)' }}>
                        <MapPin size={10} />{item.rack}
                      </span>
                    )}

                    <span className="badge badge--neutral" style={{ fontSize: 9 }}>
                      {item.status || 'ACTIVE'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}