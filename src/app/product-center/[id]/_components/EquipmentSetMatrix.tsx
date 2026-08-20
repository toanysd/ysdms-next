'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import {
  Wrench, Scissors, Waves, Wind, Square, Layers,
  Pin, CheckCircle2, AlertTriangle, Link2, ExternalLink,
  Sparkles, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { EquipmentTypeIcon, getEquipmentTypeTheme } from '@/components/ui/EquipmentTypeIcon'

interface EquipmentSetMatrixProps {
  productId: string
}

const MOLD_TYPES_ORDER = [
  'MOLD',
  'CUTTER_SEPARATE',
  'CUTTER_INLINE',
  'WATER_BASE',
  'PRESSURE_BASE',
  'FRAME',
  'STACKING',
  'PLUG',
] as const

type MoldType = typeof MOLD_TYPES_ORDER[number]

interface SlotData {
  type: MoldType
  equipment: {
    equipment_id: string
    equipment_code: string
    display_name: string
    device_status: string | null
    usage_status: string | null
    relationship_type: 'SET_MEMBER' | 'SHARED' | 'OWNED'
    notes?: string | null
  } | null
}

const TYPE_CONFIG: Record<MoldType, { labelJA: string; labelVI: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
  MOLD: { labelJA: '成形金型', labelVI: 'Khuôn chính', icon: Wrench },
  CUTTER_SEPARATE: { labelJA: '別抜刀 (Cutter Sep)', labelVI: 'Dao cắt rời', icon: Scissors },
  CUTTER_INLINE: { labelJA: 'インライン刀 (Inline)', labelVI: 'Dao cắt liền', icon: Scissors },
  WATER_BASE: { labelJA: '水冷ベース (Water Base)', labelVI: 'Đế làm mát', icon: Waves },
  PRESSURE_BASE: { labelJA: '圧空ベース (Press Base)', labelVI: 'Đế áp lực', icon: Wind },
  FRAME: { labelJA: 'クランプ枠 (Frame)', labelVI: 'Khung kẹp', icon: Square },
  STACKING: { labelJA: 'スタッキング (Stacking)', labelVI: 'Bộ xếp chồng', icon: Layers },
  PLUG: { labelJA: 'プラグ助走 (Plug)', labelVI: 'Chày ép định hình', icon: Pin },
}

export const EquipmentSetMatrix: React.FC<EquipmentSetMatrixProps> = ({ productId }) => {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [matrix, setMatrix] = useState<SlotData[]>([])
  const [primaryMoldCode, setPrimaryMoldCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatrix = async () => {
    if (!productId) return
    setLoading(true)
    setError(null)

    try {
      // 1. Fetch revisions of this product
      const { data: revs, error: revErr } = await supabase
        .from('design_revisions')
        .select('revision_id, design_code')
        .eq('product_id', productId)

      if (revErr) throw revErr

      const revIds = (revs || []).map((r) => r.revision_id)
      let primaryMold: any = null
      const directEquips: any[] = []

      if (revIds.length > 0) {
        const { data: equips, error: eqErr } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code, display_name, equipment_type, device_status, usage_status, design_revision_id')
          .in('design_revision_id', revIds)

        if (eqErr) throw eqErr

        if (equips) {
          equips.forEach((eq) => {
            directEquips.push(eq)
            if (eq.equipment_type === 'MOLD' && !primaryMold) {
              primaryMold = eq
            }
          })
        }
      }

      setPrimaryMoldCode(primaryMold?.equipment_code || primaryMold?.display_name || null)

      // 2. Fetch assignments connected to primary mold
      const assignedMap = new Map<string, { equipment: any; relationship_type: 'SET_MEMBER' | 'SHARED' }>()

      if (primaryMold) {
        const { data: assignments, error: assErr } = await supabase
          .from('equipment_assignments')
          .select(`
            relationship_type,
            is_default,
            notes,
            relatedEquipment:equipment!equipment_assignments_related_equipment_id_fkey(
              equipment_id, equipment_code, display_name, equipment_type, device_status, usage_status
            )
          `)
          .eq('primary_equipment_id', primaryMold.equipment_id)
          .in('relationship_type', ['SET_MEMBER', 'SHARED'])

        if (assErr) throw assErr

        if (assignments) {
          assignments.forEach((a: any) => {
            const relEq = a.relatedEquipment
            if (relEq && relEq.equipment_type) {
              assignedMap.set(relEq.equipment_type, {
                equipment: relEq,
                relationship_type: (a.relationship_type as 'SET_MEMBER' | 'SHARED') || 'SET_MEMBER',
              })
            }
          })
        }
      }

      // 3. Build 8 slots
      const slots: SlotData[] = MOLD_TYPES_ORDER.map((type) => {
        if (type === 'MOLD') {
          return {
            type,
            equipment: primaryMold
              ? {
                  equipment_id: primaryMold.equipment_id,
                  equipment_code: primaryMold.equipment_code,
                  display_name: primaryMold.display_name,
                  device_status: primaryMold.device_status,
                  usage_status: primaryMold.usage_status,
                  relationship_type: 'SET_MEMBER',
                }
              : null,
          }
        }

        // Check if assigned via assignments
        if (assignedMap.has(type)) {
          const item = assignedMap.get(type)!
          return {
            type,
            equipment: {
              equipment_id: item.equipment.equipment_id,
              equipment_code: item.equipment.equipment_code,
              display_name: item.equipment.display_name,
              device_status: item.equipment.device_status,
              usage_status: item.equipment.usage_status,
              relationship_type: item.relationship_type,
            },
          }
        }

        // Check if direct equipment matching type exists
        const directMatch = directEquips.find((e) => e.equipment_type === type)
        if (directMatch) {
          return {
            type,
            equipment: {
              equipment_id: directMatch.equipment_id,
              equipment_code: directMatch.equipment_code,
              display_name: directMatch.display_name,
              device_status: directMatch.device_status,
              usage_status: directMatch.usage_status,
              relationship_type: 'SET_MEMBER',
            },
          }
        }

        return {
          type,
          equipment: null,
        }
      })

      setMatrix(slots)
    } catch (err: any) {
      console.error('Error fetching EquipmentSetMatrix:', err)
      setError(err?.message || 'Lỗi tải ma trận thiết bị SET')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatrix()
  }, [productId])

  const equippedCount = matrix.filter((s) => s.equipment != null).length

  return (
    <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-teal-border, #99f6e4)' }}>
      {/* Card Header */}
      <div style={{
        background: 'var(--tint-teal-bg, #f0fdfa)',
        borderBottom: '1px solid var(--tint-teal-border, #99f6e4)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wrench size={16} style={{ color: 'var(--accent, #0D9488)' }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('equipmentSetMatrix')}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
              {t('setMatrixSubtitle')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 800, fontFamily: 'monospace',
            padding: '2px 8px', borderRadius: 12,
            background: equippedCount >= 6 ? '#ECFDF5' : '#FFFBEB',
            color: equippedCount >= 6 ? '#059669' : '#D97706',
            border: `1px solid ${equippedCount >= 6 ? '#A7F3D0' : '#FDE68A'}`,
          }}>
            {equippedCount} / 8 構成済
          </span>
          <button
            onClick={fetchMatrix}
            className="btn btn-secondary"
            style={{ height: 24, width: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="再読込 (Làm mới)"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ padding: 12 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} style={{ height: 72, background: 'var(--bg-surface-2, #f8fafc)', borderRadius: 6, border: '1px solid var(--border-default, #e2e8f0)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#DC2626', fontSize: 12 }}>
            <AlertTriangle size={16} style={{ display: 'inline', marginRight: 6 }} />
            {error}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {matrix.map((slot) => {
              const conf = TYPE_CONFIG[slot.type]
              const Icon = conf.icon
              const hasEquip = slot.equipment != null

              return (
                <div
                  key={slot.type}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: hasEquip ? 'var(--bg-surface, #ffffff)' : '#FFF1F2',
                    border: hasEquip
                      ? (slot.equipment?.relationship_type === 'SHARED' ? '1px solid #FDBA74' : '1px solid #A7F3D0')
                      : '1px dashed #FECDD3',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 6,
                    transition: 'all 0.1s ease',
                  }}
                >
                  {/* Slot Header: Type & Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon size={14} style={{ color: hasEquip ? (slot.equipment?.relationship_type === 'SHARED' ? '#D97706' : 'var(--accent)') : '#F43F5E' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {conf.labelJA}
                      </span>
                    </div>

                    {hasEquip ? (
                      slot.equipment?.relationship_type === 'SHARED' ? (
                        <span style={{
                          fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                          background: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5',
                          display: 'flex', alignItems: 'center', gap: 2,
                        }}>
                          <Link2 size={9} />
                          {t('equipmentShared')}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                          background: '#ECFDF5', color: '#059669', border: '1px solid #D1FAE5',
                          display: 'flex', alignItems: 'center', gap: 2,
                        }}>
                          <CheckCircle2 size={9} />
                          {t('equipmentOwned')}
                        </span>
                      )
                    ) : (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                        background: '#FFE4E6', color: '#E11D48', border: '1px solid #FECDD3',
                        display: 'flex', alignItems: 'center', gap: 2,
                      }}>
                        <AlertTriangle size={9} />
                        {t('equipmentMissing')}
                      </span>
                    )}
                  </div>

                  {/* Slot Body: Equipment Code & Name */}
                  <div style={{ minHeight: 30 }}>
                    {hasEquip ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Link
                            href={`/equipment/unified?id=${slot.equipment?.equipment_id}`}
                            style={{
                              fontFamily: 'monospace', fontWeight: 800, fontSize: 12,
                              color: 'var(--accent, #0D9488)', textDecoration: 'none',
                              display: 'flex', alignItems: 'center', gap: 3,
                            }}
                          >
                            {slot.equipment?.equipment_code || slot.equipment?.display_name}
                            <ExternalLink size={10} />
                          </Link>
                          {slot.equipment?.device_status && slot.equipment.device_status !== 'NORMAL' && (
                            <span className="badge badge--warning" style={{ fontSize: 8 }}>
                              {slot.equipment.device_status}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {slot.equipment?.display_name || '—'}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: '#9F1239', fontStyle: 'italic', display: 'flex', alignItems: 'center', height: '100%' }}>
                        — 未割当 / Chưa trang bị —
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
