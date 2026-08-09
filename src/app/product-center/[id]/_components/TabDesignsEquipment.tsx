'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  PenTool, Wrench, MapPin, ExternalLink, Link2, Sparkles, FlaskConical, Factory,
  LayoutGrid, List, CheckSquare, Square, ArrowLeftRight, Check, X, RefreshCw,
  Plus, ChevronDown, Box, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { isPrototypeDesignOrMold, formatCutterDisplayCode, formatRackLocationDisplay } from '@/lib/utils/moldNaming'
import { EquipmentTypeIcon, getEquipmentTypeTheme } from '@/components/ui/EquipmentTypeIcon'
import { EquipmentContextMenu, EquipmentItemContext } from './EquipmentContextMenu'
import { CenteredQuickJobWizardModal, QuickWizardMode } from './CenteredQuickJobWizardModal'

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
  parent_design_id: string | null
  design_category: string | null
}

interface RevisionTreeNode {
  revision: DesignRevision
  children: DesignRevision[]
}

interface EquipmentItem {
  id: string
  type: string
  code: string
  name: string
  status: string
  rack: string
  isDirect: boolean
  isBound: boolean
  isCavMatch: boolean
  url: string
}

type CategoryTab = 'ALL' | 'MOLD' | 'CUTTER' | 'WATER_BASE' | 'PRESSURE_BASE' | 'FRAME' | 'PLUG'

/** Build a tree structure: mass production revisions at top level, prototype children nested */
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

function parseDimensionPair(text: string | null | undefined): { l: number; w: number } | null {
  if (!text) return null
  const match = text.match(/(\d{3,4})\s*[\*x×X\-_]\s*(\d{3,4})/)
  if (match) {
    return { l: parseInt(match[1]), w: parseInt(match[2]) }
  }
  return null
}

export function TabDesignsEquipment({ productId }: TabDesignsEquipmentProps) {
  const router = useRouter()
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [revisions, setRevisions] = useState<DesignRevision[]>([])
  const [selectedRevId, setSelectedRevId] = useState<string | null>(null)
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([])
  const [loading, setLoading] = useState(true)

  // Interactive View States
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null)
  const [reassigningItem, setReassigningItem] = useState<EquipmentItem | null>(null)

  // Dropdown & Modal Interactive States
  const [showDesignMenu, setShowDesignMenu] = useState(false)
  const [showMoldPromptDialog, setShowMoldPromptDialog] = useState(false)

  // Right Click Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: EquipmentItem } | null>(null)

  // Centered Accordion Wizard Modal State
  const [centeredWizardModal, setCenteredWizardModal] = useState<{
    isOpen: boolean
    mode: QuickWizardMode
    subMode?: string
    targetEquipment?: EquipmentItem | null
  }>({ isOpen: false, mode: 'CREATE_DESIGN' })

  // 1. Load Design Revisions for product
  const loadRevisions = async () => {
    setLoading(true)
    try {
      const { data: revsData } = await supabase
        .from('design_revisions')
        .select(`
          revision_id, design_code, revision_number, status, design_date, created_at, plastic_type_designed, designer,
          design_length, design_width, design_height, design_depth, cutline_length, cutline_width,
          cavity_count, cavity_pitch_mm, machine_feed_pitch_mm, orientation, setup_type, plug_type,
          customer_tray_name, tray_info, parent_design_id, design_category
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (revsData && revsData.length > 0) {
        const revs = revsData as DesignRevision[]
        setRevisions(revs)
        if (!selectedRevId || !revs.some(r => r.revision_id === selectedRevId)) {
          setSelectedRevId(revs[0].revision_id)
        }
      } else {
        setRevisions([])
        setSelectedRevId(null)
      }
    } catch (err) {
      console.error('Error fetching design revisions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) loadRevisions()
  }, [productId])

  // 2. Load Production Equipment Set dynamically per selected revision + CAV Spec Matching
  const fetchEquipmentSet = async () => {
    if (!selectedRevId) {
      setEquipmentList([])
      return
    }

    try {
      const selectedRev = revisions.find(r => r.revision_id === selectedRevId)
      const targetL = selectedRev?.design_length || selectedRev?.cutline_length || null
      const targetW = selectedRev?.design_width || selectedRev?.cutline_width || null

      const equipMap = new Map<string, EquipmentItem>()

      // A. Direct equipment linked strictly to the selected design revision
      const { data: equipData } = await supabase
        .from('equipment')
        .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, design_revision_id, actual_length_mm, actual_width_mm, rack_layers(layer_code, racks(rack_code))')
        .eq('design_revision_id', selectedRevId)

      if (equipData && equipData.length > 0) {
        equipData.forEach((eq: any) => {
          const isCutter = ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(String(eq.equipment_type || '').toUpperCase())
          const displayCode = isCutter ? formatCutterDisplayCode(eq.equipment_code) : (eq.equipment_code || '—')
          const rack = formatRackLocationDisplay(eq.rack_layers)

          equipMap.set(eq.equipment_id, {
            id: eq.equipment_id,
            type: eq.equipment_type || 'EQUIPMENT',
            code: displayCode,
            name: eq.display_name || '',
            status: eq.usage_status || eq.device_status || 'ACTIVE',
            rack,
            isDirect: true,
            isBound: true,
            isCavMatch: false,
            url: `/equipment/unified?id=${eq.equipment_id}`,
          })
        })
      }

      // B. Shared cutters via mold_design_cutters junction table
      const { data: juncs } = await supabase
        .from('mold_design_cutters')
        .select('cutter_id')
        .eq('mold_design_id', selectedRevId)

      if (juncs && juncs.length > 0) {
        const juncCutterIds = juncs.map(j => j.cutter_id).filter(Boolean)
        if (juncCutterIds.length > 0) {
          const { data: sCutters } = await supabase
            .from('equipment')
            .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, rack_layers(layer_code, racks(rack_code))')
            .or(`equipment_id.in.(${juncCutterIds.join(',')}),legacy_cutter_id.in.(${juncCutterIds.join(',')})`)

          if (sCutters && sCutters.length > 0) {
            sCutters.forEach((sc: any) => {
              if (!equipMap.has(sc.equipment_id)) {
                const displayCode = formatCutterDisplayCode(sc.equipment_code)
                const rack = formatRackLocationDisplay(sc.rack_layers)

                equipMap.set(sc.equipment_id, {
                  id: sc.equipment_id,
                  type: sc.equipment_type || 'CUTTER',
                  code: displayCode,
                  name: sc.display_name || '',
                  status: sc.usage_status || sc.device_status || 'ACTIVE',
                  rack,
                  isDirect: false,
                  isBound: true,
                  isCavMatch: false,
                  url: `/equipment/unified?id=${sc.equipment_id}`,
                })
              }
            })
          }
        }
      }

      // C. CAV Spec Match Candidates (Shared Water base, Pressure base, Frame, Plugs)
      if (targetL && targetW) {
        const { data: auxCandidates } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, actual_length_mm, actual_width_mm, design_revision_id, rack_layers(layer_code, racks(rack_code))')
          .not('equipment_type', 'in', '("MOLD","CUTTER","CUTTER_SEPARATE","CUTTER_INLINE","抜型")')

        if (auxCandidates && auxCandidates.length > 0) {
          auxCandidates.forEach((aux: any) => {
            if (equipMap.has(aux.equipment_id)) return

            let l = aux.actual_length_mm ? Number(aux.actual_length_mm) : null
            let w = aux.actual_width_mm ? Number(aux.actual_width_mm) : null
            if (!l || !w) {
              const parsed = parseDimensionPair(aux.equipment_code) || parseDimensionPair(aux.display_name)
              if (parsed) { l = parsed.l; w = parsed.w }
            }

            const isMatch = (l === targetL && w === targetW) || (l === targetW && w === targetL)
            if (isMatch) {
              const rack = formatRackLocationDisplay(aux.rack_layers)
              const isAlreadyBoundToThisRev = aux.design_revision_id === selectedRevId

              equipMap.set(aux.equipment_id, {
                id: aux.equipment_id,
                type: aux.equipment_type || 'AUXILIARY',
                code: aux.equipment_code || '—',
                name: aux.display_name || '',
                status: aux.usage_status || aux.device_status || 'ACTIVE',
                rack,
                isDirect: isAlreadyBoundToThisRev,
                isBound: isAlreadyBoundToThisRev,
                isCavMatch: true,
                url: `/equipment/unified?id=${aux.equipment_id}`,
              })
            }
          })
        }
      }

      setEquipmentList(Array.from(equipMap.values()))
    } catch (err) {
      console.error('Error loading equipment set for revision:', err)
    }
  }

  useEffect(() => {
    fetchEquipmentSet()
  }, [selectedRevId, revisions])

  // Toggle Windows-style Linkage Checkbox
  const handleToggleBinding = async (item: EquipmentItem) => {
    if (!selectedRevId || isTogglingId) return

    setIsTogglingId(item.id)
    try {
      const isCutter = ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(String(item.type || '').toUpperCase())

      if (item.isBound) {
        if (confirm(t('confirmUnassign'))) {
          if (isCutter) {
            await supabase
              .from('mold_design_cutters')
              .delete()
              .eq('mold_design_id', selectedRevId)
              .eq('cutter_id', item.id)
          }
          await supabase
            .from('equipment')
            .update({ design_revision_id: null })
            .eq('equipment_id', item.id)

          await fetchEquipmentSet()
        }
      } else {
        if (isCutter) {
          await supabase
            .from('mold_design_cutters')
            .upsert({ mold_design_id: selectedRevId, cutter_id: item.id })
        } else {
          await supabase
            .from('equipment')
            .update({ design_revision_id: selectedRevId })
            .eq('equipment_id', item.id)
        }
        await fetchEquipmentSet()
      }
    } catch (err) {
      console.error('Error toggling linkage:', err)
    } finally {
      setIsTogglingId(null)
    }
  }

  // Reassign Linkage to another revision
  const handleReassignToRevision = async (targetRevId: string) => {
    if (!reassigningItem || isTogglingId) return

    setIsTogglingId(reassigningItem.id)
    try {
      const isCutter = ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(String(reassigningItem.type || '').toUpperCase())

      if (isCutter) {
        if (selectedRevId) {
          await supabase
            .from('mold_design_cutters')
            .delete()
            .eq('mold_design_id', selectedRevId)
            .eq('cutter_id', reassigningItem.id)
        }
        await supabase
          .from('mold_design_cutters')
          .upsert({ mold_design_id: targetRevId, cutter_id: reassigningItem.id })
      } else {
        await supabase
          .from('equipment')
          .update({ design_revision_id: targetRevId })
          .eq('equipment_id', reassigningItem.id)
      }

      setReassigningItem(null)
      await fetchEquipmentSet()
    } catch (err) {
      console.error('Error reassigning equipment:', err)
    } finally {
      setIsTogglingId(null)
    }
  }

  // Action 1: Create Design Handler -> Opens Centered Accordion Wizard Modal right on page
  const handleTriggerCreateDesign = (subMode: string) => {
    setShowDesignMenu(false)
    setCenteredWizardModal({
      isOpen: true,
      mode: 'CREATE_DESIGN',
      subMode,
    })
  }

  // Action 2: Add Equipment / Mold Handler with Existing Mold Prompt
  const handleTriggerAddEquipment = () => {
    const existingMolds = equipmentList.filter(item => ['MOLD', '金型'].includes(String(item.type || '').toUpperCase()) && item.isBound)

    if (existingMolds.length > 0) {
      setShowMoldPromptDialog(true)
    } else {
      setCenteredWizardModal({
        isOpen: true,
        mode: 'CREATE_MOLD',
        subMode: 'NEW_MOLD_UNIT',
      })
    }
  }

  // Right-Click Context Menu Action Dispatcher
  const handleContextMenuAction = async (actionKey: string, item: EquipmentItemContext) => {
    const target: EquipmentItem = equipmentList.find(e => e.id === item.id) || {
      ...item,
      isDirect: item.isDirect ?? false,
      isBound: item.isBound ?? false,
      isCavMatch: item.isCavMatch ?? false,
    }

    if (actionKey === 'CREATE_JOB') {
      setCenteredWizardModal({
        isOpen: true,
        mode: 'CREATE_JOB',
        subMode: 'OVERHAUL_JOB',
        targetEquipment: target,
      })
    } else if (actionKey === 'CHECK_IN') {
      await supabase.from('equipment').update({ usage_status: 'IN_STOCK' }).eq('equipment_id', item.id)
      await fetchEquipmentSet()
    } else if (actionKey === 'TRANSFER' || actionKey === 'UPDATE_SPECS') {
      setCenteredWizardModal({
        isOpen: true,
        mode: 'UPDATE_EQUIPMENT',
        targetEquipment: target,
      })
    } else if (actionKey === 'SCRAP') {
      if (confirm(`Scrap equipment ${item.code}?`)) {
        await supabase.from('equipment').update({ usage_status: 'SCRAPPED' }).eq('equipment_id', item.id)
        await fetchEquipmentSet()
      }
    }
  }

  const selectedRev = revisions.find(r => r.revision_id === selectedRevId)
  const revisionTree = useMemo(() => buildRevisionTree(revisions), [revisions])

  const filteredEquipment = useMemo(() => {
    if (activeCategory === 'ALL') return equipmentList
    return equipmentList.filter(item => {
      const tUpper = String(item.type || '').toUpperCase()
      if (activeCategory === 'MOLD') return ['MOLD', '金型'].includes(tUpper)
      if (activeCategory === 'CUTTER') return ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(tUpper)
      if (activeCategory === 'WATER_BASE') return tUpper === 'WATER_BASE'
      if (activeCategory === 'PRESSURE_BASE') return tUpper === 'PRESSURE_BASE'
      if (activeCategory === 'FRAME') return tUpper === 'FRAME'
      if (activeCategory === 'PLUG') return ['PLUG', 'STACKING', 'AUXILIARY'].includes(tUpper)
      return true
    })
  }, [equipmentList, activeCategory])

  const categoryCounts = useMemo(() => {
    const counts = { ALL: equipmentList.length, MOLD: 0, CUTTER: 0, WATER_BASE: 0, PRESSURE_BASE: 0, FRAME: 0, PLUG: 0 }
    equipmentList.forEach(item => {
      const tUpper = String(item.type || '').toUpperCase()
      if (['MOLD', '金型'].includes(tUpper)) counts.MOLD++
      else if (['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(tUpper)) counts.CUTTER++
      else if (tUpper === 'WATER_BASE') counts.WATER_BASE++
      else if (tUpper === 'PRESSURE_BASE') counts.PRESSURE_BASE++
      else if (tUpper === 'FRAME') counts.FRAME++
      else counts.PLUG++
    })
    return counts
  }, [equipmentList])

  /** Render a single revision row item */
  const renderRevisionItem = (rev: DesignRevision, isChild: boolean = false) => {
    const isSelected = rev.revision_id === selectedRevId
    const isProto = rev.design_category === 'PROTOTYPE_POCKET' ||
      rev.parent_design_id != null ||
      isPrototypeDesignOrMold({ design_category: rev.design_category, design_code: rev.design_code })

    return (
      <div
        key={rev.revision_id}
        onClick={() => setSelectedRevId(rev.revision_id)}
        style={{
          padding: '6px 8px', cursor: 'pointer', borderRadius: 4,
          background: isSelected ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
          borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
          marginLeft: isChild ? 16 : -2, transition: 'all 0.1s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isProto ? (
            <span style={{
              fontSize: 9, padding: '1px 4px', borderRadius: 3, fontWeight: 700,
              background: 'color-mix(in srgb, #F59E0B 15%, transparent)', color: '#B45309',
              display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
            }}>
              <FlaskConical size={9} /> 試作
            </span>
          ) : (
            <span style={{
              fontSize: 9, padding: '1px 4px', borderRadius: 3, fontWeight: 700,
              background: 'color-mix(in srgb, #10B981 15%, transparent)', color: '#047857',
              display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
            }}>
              <Factory size={9} /> 正規
            </span>
          )}

          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)', flex: 1 }}>
            {rev.design_code || rev.revision_id.slice(0, 8)}
          </span>

          <span className={STATUS_BADGE[rev.status || ''] || 'badge badge--neutral'} style={{ fontSize: 9 }}>
            {rev.status || '—'}
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
  }

  const STATUS_BADGE: Record<string, string> = {
    APPROVED: 'badge badge--success',
    RELEASED: 'badge badge--warning',
    REJECTED: 'badge badge--error',
    SUBMITTED: 'badge badge--info',
    DRAFT: 'badge badge--neutral',
    SUPERSEDED: 'badge badge--neutral',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>

      {/* Main Header + Action Suite */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
          {t('designRevisionsAndEquipment')}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Action 1: Create Design Dropdown Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDesignMenu(!showDesignMenu)}
              className="btn btn-primary"
              style={{ fontSize: 11, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={12} /> {t('createNewDesign')} <ChevronDown size={11} />
            </button>

            {showDesignMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 230,
                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                borderRadius: 6, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 9999,
                display: 'flex', flexDirection: 'column', padding: '4px 0', fontSize: 11
              }}>
                <button
                  onClick={() => handleTriggerCreateDesign('NEXT_MASS')}
                  style={{ padding: '6px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  ➕ {t('nextMassRevision')}
                </button>
                <button
                  onClick={() => handleTriggerCreateDesign('PROTO_FROM_MASS')}
                  style={{ padding: '6px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  🧪 {t('protoFromMass')}
                </button>
                <button
                  onClick={() => handleTriggerCreateDesign('PROTO_SUCCESSION')}
                  style={{ padding: '6px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  🔬 {t('protoSuccession')}
                </button>
                <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />
                <button
                  onClick={() => handleTriggerCreateDesign('PROMOTE_TO_MASS')}
                  style={{ padding: '6px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: 'var(--accent)', fontWeight: 700 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 10%, transparent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  🚀 {t('promoteProtoToMass')}
                </button>
              </div>
            )}
          </div>

          {/* Action 2: Add Equipment / Mold Button */}
          <button
            onClick={handleTriggerAddEquipment}
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Box size={12} style={{ color: 'var(--accent)' }} /> {t('addEquipmentOrMold')}
          </button>
        </div>
      </div>

      {revisions.length === 0 ? (
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t('noDesignHistory')}</span>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 34%) 1fr', gap: 12 }}>

          {/* Left Column: Design Revisions Tree */}
          <div style={{ borderRight: '1px solid var(--border-default)', paddingRight: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
              {t('designRevisionHistory')}
            </div>

            {revisionTree.map((node) => (
              <div key={node.revision.revision_id}>
                {renderRevisionItem(node.revision, false)}
                {node.children.map((child) => (
                  <div key={child.revision_id} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 6, top: 0, bottom: '50%',
                      borderLeft: '1px dashed var(--border-default)',
                      borderBottom: '1px dashed var(--border-default)',
                      width: 8, height: '50%',
                    }} />
                    {renderRevisionItem(child, true)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right Column: Unified Production Equipment Set Manager */}
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

            {/* Equipment Set Header & Category Filter Tabs + Grid/List View Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('productionEquipmentSet')} {selectedRev?.design_code ? `(${selectedRev.design_code})` : ''}
                </span>

                {/* Grid vs List View Mode Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-surface-2)', padding: 2, borderRadius: 4, border: '1px solid var(--border-default)' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '2px 6px', border: 'none', borderRadius: 3, cursor: 'pointer',
                      background: viewMode === 'grid' ? 'var(--accent)' : 'transparent',
                      color: viewMode === 'grid' ? '#FFF' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600,
                    }}
                    title="Grid Card View"
                  >
                    <LayoutGrid size={11} /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '2px 6px', border: 'none', borderRadius: 3, cursor: 'pointer',
                      background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
                      color: viewMode === 'list' ? '#FFF' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600,
                    }}
                    title="Compact List View"
                  >
                    <List size={11} /> List
                  </button>
                </div>
              </div>

              {/* Equipment Category Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                {([
                  { key: 'ALL', label: t('allEquipmentCategory'), count: categoryCounts.ALL },
                  { key: 'MOLD', label: t('moldsCategory'), count: categoryCounts.MOLD },
                  { key: 'CUTTER', label: t('cuttersCategory'), count: categoryCounts.CUTTER },
                  { key: 'WATER_BASE', label: t('waterBaseCategory'), count: categoryCounts.WATER_BASE },
                  { key: 'PRESSURE_BASE', label: t('pressureBaseCategory'), count: categoryCounts.PRESSURE_BASE },
                  { key: 'FRAME', label: t('frameCategory'), count: categoryCounts.FRAME },
                  { key: 'PLUG', label: t('plugCategory'), count: categoryCounts.PLUG },
                ] as const).map(tab => {
                  const isActive = activeCategory === tab.key
                  const theme = getEquipmentTypeTheme(tab.key === 'ALL' ? null : tab.key)

                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveCategory(tab.key)}
                      style={{
                        padding: '3px 9px', borderRadius: 14, fontSize: 10, fontWeight: isActive ? 700 : 600,
                        border: `1px solid ${isActive ? theme.borderColor : 'var(--border-default)'}`,
                        background: isActive ? theme.bg : 'var(--bg-surface)',
                        color: isActive ? theme.color : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.12s ease', display: 'flex', alignItems: 'center', gap: 4,
                        boxShadow: isActive ? `0 1px 3px ${theme.color}25` : 'none'
                      }}
                    >
                      <EquipmentTypeIcon type={tab.key === 'ALL' ? null : tab.key} size={11} />
                      <span>{tab.label}</span>
                      <span style={{ fontSize: 9, opacity: 0.85, fontFamily: 'monospace' }}>({tab.count})</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Equipment Items List / Grid */}
            {filteredEquipment.length === 0 ? (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '10px 0' }}>{t('noEquipmentLinked')}</span>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW (Interactive Equipment Cards) */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {filteredEquipment.map(item => {
                  const isLoadingThis = isTogglingId === item.id
                  const theme = getEquipmentTypeTheme(item.type)

                  return (
                    <div
                      key={item.id}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        setContextMenu({ x: e.clientX, y: e.clientY, item })
                      }}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: 6, padding: 8, borderRadius: 6,
                        background: item.isBound ? 'var(--bg-surface-2)' : 'color-mix(in srgb, var(--bg-surface) 60%, transparent)',
                        border: item.isBound ? `1px solid ${theme.borderColor}` : '1px dashed var(--border-default)',
                        boxShadow: item.isBound ? `inset 0 3px 0 0 ${theme.color}` : 'none',
                        position: 'relative', transition: 'all 0.12s ease', cursor: 'context-menu'
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                          <button
                            onClick={() => handleToggleBinding(item)}
                            disabled={isLoadingThis}
                            style={{
                              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                              color: item.isBound ? theme.color : 'var(--text-muted)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title={item.isBound ? t('confirmUnassign') : t('unassignedLink')}
                          >
                            {isLoadingThis ? (
                              <RefreshCw size={14} className="spin" />
                            ) : item.isBound ? (
                              <CheckSquare size={15} style={{ color: theme.color }} />
                            ) : (
                              <Square size={15} />
                            )}
                          </button>

                          <EquipmentTypeIcon type={item.type} size={15} />

                          <Link
                            href={item.url}
                            style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: theme.color, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {item.code}
                          </Link>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 9, background: theme.bg, color: theme.color, border: `1px solid ${theme.borderColor}`, padding: '0 5px', borderRadius: 8, fontWeight: 700 }}>
                            {theme.labelJA}
                          </span>
                          <span className="badge badge--neutral" style={{ fontSize: 9 }}>
                            {item.status || 'ACTIVE'}
                          </span>
                        </div>
                      </div>

                      {/* Name & Location */}
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', minHeight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name || '—'}
                      </div>

                      {/* Footer: Binding State Badges + Reassign Action */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid var(--border-default)', fontSize: 9 }}>
                        {item.isDirect ? (
                          <span style={{ color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Sparkles size={9} /> {t('directBinding')}
                          </span>
                        ) : item.isCavMatch ? (
                          <span style={{ color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Link2 size={9} /> {t('cavCandidate')}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Link2 size={9} /> {t('sharedBinding')}
                          </span>
                        )}

                        {item.rack !== '—' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--text-muted)' }}>
                            <MapPin size={9} />{item.rack}
                          </span>
                        )}

                        <button
                          onClick={() => setReassigningItem(item)}
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: 'var(--text-secondary)', fontSize: 9, display: 'flex', alignItems: 'center', gap: 2,
                            padding: '1px 4px', borderRadius: 3
                          }}
                          title={t('reassignLink')}
                        >
                          <ArrowLeftRight size={9} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* LIST VIEW (Compact Rows) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {filteredEquipment.map(item => {
                  const isLoadingThis = isTogglingId === item.id
                  const theme = getEquipmentTypeTheme(item.type)

                  return (
                    <div
                      key={item.id}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        setContextMenu({ x: e.clientX, y: e.clientY, item })
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 4,
                        background: item.isBound ? theme.bg : 'color-mix(in srgb, var(--bg-surface) 60%, transparent)',
                        border: item.isBound ? `1px solid ${theme.borderColor}` : '1px dashed var(--border-default)',
                        cursor: 'context-menu'
                      }}
                    >
                      <button
                        onClick={() => handleToggleBinding(item)}
                        disabled={isLoadingThis}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: item.isBound ? theme.color : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                      >
                        {isLoadingThis ? (
                          <RefreshCw size={13} className="spin" />
                        ) : item.isBound ? (
                          <CheckSquare size={14} style={{ color: theme.color }} />
                        ) : (
                          <Square size={14} />
                        )}
                      </button>

                      <EquipmentTypeIcon type={item.type} size={15} />

                      <Link
                        href={item.url}
                        style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: theme.color, textDecoration: 'none' }}
                      >
                        {item.code}
                      </Link>

                      <span style={{ fontSize: 9, background: theme.bg, color: theme.color, border: `1px solid ${theme.borderColor}`, padding: '0 5px', borderRadius: 8, fontWeight: 700, flexShrink: 0 }}>
                        {theme.labelJA}
                      </span>

                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>

                      {item.isDirect ? (
                        <span style={{ fontSize: 9, background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Sparkles size={9} /> {t('directBinding')}
                        </span>
                      ) : item.isCavMatch ? (
                        <span style={{ fontSize: 9, background: 'color-mix(in srgb, #D97706 15%, transparent)', color: '#D97706', padding: '1px 5px', borderRadius: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Link2 size={9} /> {t('cavCandidate')}
                        </span>
                      ) : (
                        <span style={{ fontSize: 9, background: 'var(--bg-surface)', color: 'var(--text-muted)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Link2 size={9} /> {t('sharedBinding')}
                        </span>
                      )}

                      {item.rack !== '—' && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-muted)' }}>
                          <MapPin size={10} />{item.rack}
                        </span>
                      )}

                      <span className="badge badge--neutral" style={{ fontSize: 9 }}>
                        {item.status || 'ACTIVE'}
                      </span>

                      <button
                        onClick={() => setReassigningItem(item)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '2px 4px' }}
                        title={t('reassignLink')}
                      >
                        <ArrowLeftRight size={11} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Dialog Prompt for Existing Mold Detection */}
      {showMoldPromptDialog && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div className="card" style={{ width: 420, padding: 16, background: 'var(--bg-surface)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
              <AlertCircle size={18} style={{ color: '#F59E0B' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('existingMoldDetectedTitle')}
              </span>
            </div>

            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {t('existingMoldDetectedDesc')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowMoldPromptDialog(false)
                  setCenteredWizardModal({ isOpen: true, mode: 'CREATE_MOLD', subMode: 'NEW_MOLD_UNIT' })
                }}
                style={{ fontSize: 11, justifyContent: 'flex-start', padding: '8px 12px' }}
              >
                ➕ {t('createNewMoldUnit')}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowMoldPromptDialog(false)
                  const target = equipmentList.find(e => ['MOLD', '金型'].includes(String(e.type || '').toUpperCase()))
                  setCenteredWizardModal({ isOpen: true, mode: 'CREATE_JOB', subMode: 'OVERHAUL_JOB', targetEquipment: target || null })
                }}
                style={{ fontSize: 11, justifyContent: 'flex-start', padding: '8px 12px' }}
              >
                🛠️ {t('createModificationJob')}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
              <button className="btn btn-secondary" style={{ fontSize: 11 }} onClick={() => setShowMoldPromptDialog(false)}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Context Menu */}
      {contextMenu && (
        <EquipmentContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
          onAction={handleContextMenuAction}
        />
      )}

      {/* Centered Accordion Wizard Popup Modal */}
      <CenteredQuickJobWizardModal
        isOpen={centeredWizardModal.isOpen}
        mode={centeredWizardModal.mode}
        subMode={centeredWizardModal.subMode}
        productId={productId}
        selectedRev={selectedRev || null}
        targetEquipment={centeredWizardModal.targetEquipment || null}
        onClose={() => setCenteredWizardModal({ isOpen: false, mode: 'CREATE_DESIGN' })}
        onSuccess={async () => {
          await loadRevisions()
          await fetchEquipmentSet()
        }}
      />

    </div>
  )
}