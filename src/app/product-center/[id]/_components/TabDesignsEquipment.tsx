'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  PenTool, Wrench, MapPin, ExternalLink, Link2, Sparkles, FlaskConical, Factory,
  LayoutGrid, List, CheckSquare, Square, ArrowLeftRight, Check, X, RefreshCw,
  Plus, ChevronDown, Box, AlertCircle, Settings
} from 'lucide-react'
import Link from 'next/link'
import { isPrototypeDesignOrMold, formatCutterDisplayCode, formatRackLocationDisplay } from '@/lib/utils/moldNaming'
import { EquipmentTypeIcon, getEquipmentTypeTheme } from '@/components/ui/EquipmentTypeIcon'
import { EquipmentContextMenu, EquipmentItemContext } from './EquipmentContextMenu'
import { CenteredQuickJobWizardModal, QuickWizardMode } from './CenteredQuickJobWizardModal'
import { EquipmentJobDrawer } from './EquipmentJobDrawer'
import { CreateDesignRevisionModal } from './CreateDesignRevisionModal'
import { EditDesignRevisionModal, EditDesignRevisionData } from '@/components/engineering/EditDesignRevisionModal'
import { EditEquipmentModal, EquipmentEditData } from '@/app/equipment/_components/detail-modal/EditEquipmentModal'

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
  n_jobs?: number
  recent_jobs?: { job_id: string; job_code: string; job_name: string; job_status: string }[]
}

type CategoryTab = 'ALL' | 'MOLD' | 'CUTTER' | 'WATER_BASE' | 'PRESSURE_BASE' | 'FRAME' | 'PLUG'

/** Build a tree structure: mass production revisions at top level, prototype children nested */
function buildRevisionTree(revisions: DesignRevision[]): RevisionTreeNode[] {
  const isProto = (rev: DesignRevision) =>
    rev.design_category === 'PROTOTYPE_POCKET' ||
    rev.parent_design_id != null ||
    isPrototypeDesignOrMold({ design_category: rev.design_category, design_code: rev.design_code })

  const topRevs = revisions.filter(r => !isProto(r))
  const protoRevs = revisions.filter(r => isProto(r))

  return topRevs.map(parent => ({
    revision: parent,
    children: protoRevs.filter(c => c.parent_design_id === parent.revision_id),
  }))
}

function parseDimensionPair(str: string | null | undefined): { l: number; w: number } | null {
  if (!str) return null
  const match = str.match(/(\d{3,4})\s*[x×X]\s*(\d{3,4})/)
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

  // Dropdown & Modal Interactive States
  const [showDesignMenu, setShowDesignMenu] = useState(false)
  const [isCreateDesignModalOpen, setIsCreateDesignModalOpen] = useState(false)
  const [designSubMode, setDesignSubMode] = useState<string>('NEXT_MASS')

  // Right Click Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: EquipmentItem } | null>(null)

  // Centered Accordion Wizard Modal State
  const [centeredWizardModal, setCenteredWizardModal] = useState<{
    isOpen: boolean
    mode: QuickWizardMode
    subMode?: string
    targetEquipment?: EquipmentItem | null
  }>({ isOpen: false, mode: 'CREATE_DESIGN' })

  // SIDE-OVER DRAWER STATE
  const [drawerEquipment, setDrawerEquipment] = useState<EquipmentItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Edit Modal States
  const [editingRevision, setEditingRevision] = useState<EditDesignRevisionData | null>(null)
  const [editingEquipment, setEditingEquipment] = useState<EquipmentEditData | null>(null)

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
    loadRevisions()
  }, [productId])

  const selectedRev = useMemo(() => {
    return revisions.find(r => r.revision_id === selectedRevId) || null
  }, [revisions, selectedRevId])

  const revisionTree = useMemo(() => {
    return buildRevisionTree(revisions)
  }, [revisions])

  // 2. Load Production Equipment Set dynamically per selected revision + CAV Spec Matching
  const fetchEquipmentSet = async () => {
    if (!selectedRevId) {
      setEquipmentList([])
      return
    }

    try {
      const targetRev = revisions.find(r => r.revision_id === selectedRevId)
      const targetL = targetRev?.design_length ? Number(targetRev.design_length) : null
      const targetW = targetRev?.design_width ? Number(targetRev.design_width) : null

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

      const equipList = Array.from(equipMap.values())
      if (equipList.length > 0) {
        const equipIds = equipList.map(e => e.id)
        const { data: allJobs } = await supabase
          .from('jobs')
          .select('job_id, equipment_id, job_code, job_name, job_status, created_at')
          .in('equipment_id', equipIds)
          .order('created_at', { ascending: false })

        if (allJobs && allJobs.length > 0) {
          const jobGroupMap = new Map<string, any[]>()
          allJobs.forEach(j => {
            if (j.equipment_id) {
              if (!jobGroupMap.has(j.equipment_id)) jobGroupMap.set(j.equipment_id, [])
              jobGroupMap.get(j.equipment_id)!.push(j)
            }
          })

          equipList.forEach(item => {
            const jobsForEquip = jobGroupMap.get(item.id) || []
            item.n_jobs = jobsForEquip.length
            item.recent_jobs = jobsForEquip.slice(0, 3)
          })
        }
      }

      setEquipmentList(equipList)
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
      console.error('Error toggling equipment binding:', err)
    } finally {
      setIsTogglingId(null)
    }
  }

  // Trigger Creation Modal Options
  const handleTriggerCreateDesign = (subMode: string) => {
    setShowDesignMenu(false)
    setDesignSubMode(subMode)
    setIsCreateDesignModalOpen(true)
  }

  const handleTriggerAddEquipment = () => {
    setCenteredWizardModal({ isOpen: true, mode: 'CREATE_MOLD' })
  }

  // Filter equipment by active category tab
  const filteredEquipment = useMemo(() => {
    if (activeCategory === 'ALL') return equipmentList
    return equipmentList.filter(item => {
      const t = String(item.type || '').toUpperCase()
      if (activeCategory === 'MOLD') return t === 'MOLD' || t === '金型'
      if (activeCategory === 'CUTTER') return ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(t)
      if (activeCategory === 'WATER_BASE') return t === 'WATER_BASE'
      if (activeCategory === 'PRESSURE_BASE') return t === 'PRESSURE_BASE'
      if (activeCategory === 'FRAME') return t === 'FRAME'
      if (activeCategory === 'PLUG') return t === 'PLUG'
      return true
    })
  }, [equipmentList, activeCategory])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { ALL: equipmentList.length, MOLD: 0, CUTTER: 0, WATER_BASE: 0, PRESSURE_BASE: 0, FRAME: 0, PLUG: 0 }
    equipmentList.forEach(item => {
      const t = String(item.type || '').toUpperCase()
      if (t === 'MOLD' || t === '金型') counts.MOLD++
      else if (['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(t)) counts.CUTTER++
      else if (t === 'WATER_BASE') counts.WATER_BASE++
      else if (t === 'PRESSURE_BASE') counts.PRESSURE_BASE++
      else if (t === 'FRAME') counts.FRAME++
      else if (t === 'PLUG') counts.PLUG++
    })
    return counts
  }, [equipmentList])

  // Render a revision item in the left tree
  const renderRevisionItem = (rev: DesignRevision, isChild: boolean) => {
    const isSelected = rev.revision_id === selectedRevId
    const isProto = rev.design_category === 'PROTOTYPE_POCKET' || rev.parent_design_id != null || isPrototypeDesignOrMold({ design_category: rev.design_category, design_code: rev.design_code })

    return (
      <div
        key={rev.revision_id}
        onClick={() => setSelectedRevId(rev.revision_id)}
        style={{
          padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
          background: isSelected ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
          borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
          marginBottom: 4, transition: 'all 0.12s ease',
          marginLeft: isChild ? 14 : 0,
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 28%) 1fr', gap: 12 }}>

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setEditingRevision(selectedRev as EditDesignRevisionData)}
                      className="btn btn-secondary cursor-pointer"
                      style={{ fontSize: 10, padding: '2px 6px', height: 20, gap: 2, display: 'inline-flex', alignItems: 'center' }}
                      title="図面情報を編集 (Sửa thiết kế)"
                    >
                      <span>図面編集 (Sửa)</span>
                    </button>
                    <Link
                      href={`/engineering/designs/revisions/${selectedRev.revision_id}`}
                      style={{ fontSize: 10, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                      {t('viewDesignDetails')} <ExternalLink size={10} />
                    </Link>
                  </div>
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
                      }}
                    >
                      <span>{tab.label}</span>
                      <span style={{ fontSize: 9, opacity: 0.85, fontWeight: 700 }}>({tab.count})</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Equipment Set Cards Display (SPACIOUS GRID OR LIST VIEW - CLICK TO OPEN SIDE DRAWER) */}
            {filteredEquipment.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, border: '1px dashed var(--border-default)', borderRadius: 6 }}>
                {t('noEquipmentInCategory')}
              </div>
            ) : viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                {filteredEquipment.map(item => {
                  const isLoadingThis = isTogglingId === item.id
                  const theme = getEquipmentTypeTheme(item.type)

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setDrawerEquipment(item)
                        setIsDrawerOpen(true)
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        setContextMenu({ x: e.clientX, y: e.clientY, item })
                      }}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: 6, padding: 10, borderRadius: 6,
                        background: item.isBound ? 'var(--bg-surface-2)' : 'color-mix(in srgb, var(--bg-surface) 60%, transparent)',
                        border: item.isBound ? `1px solid ${theme.borderColor}` : '1px dashed var(--border-default)',
                        boxShadow: item.isBound ? `inset 0 3px 0 0 ${theme.color}` : 'none',
                        position: 'relative', transition: 'all 0.12s ease', cursor: 'pointer'
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleBinding(item)
                            }}
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
                            onClick={e => e.stopPropagation()}
                            style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: theme.color, textDecoration: 'none' }}
                          >
                            {item.code}
                          </Link>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {/* JOB COUNT PILL BADGE - CLICK OPENS SIDE DRAWER */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDrawerEquipment(item)
                              setIsDrawerOpen(true)
                            }}
                            style={{
                              fontSize: 9, padding: '1px 6px', borderRadius: 8, fontWeight: 700,
                              border: `1px solid ${item.n_jobs ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : 'var(--border-default)'}`,
                              background: item.n_jobs ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--bg-surface-2)',
                              color: item.n_jobs ? 'var(--accent)' : 'var(--text-muted)',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, transition: 'all 0.12s ease'
                            }}
                            title={item.recent_jobs && item.recent_jobs.length > 0
                              ? `【Job履歴 - 全${item.n_jobs}件】\n` + item.recent_jobs.map(j => `• ${j.job_code} [${j.job_status}]: ${j.job_name || '名称未設定'}`).join('\n') + '\n\nクリックして Job Side Drawer を開く'
                              : 'Job未登録 - クリックして開く'
                            }
                          >
                            <Settings size={9} />
                            <span>Job:{item.n_jobs || 0}</span>
                          </button>

                          <span style={{ fontSize: 9, background: theme.bg, color: theme.color, border: `1px solid ${theme.borderColor}`, padding: '0 5px', borderRadius: 8, fontWeight: 700 }}>
                            {theme.labelJA}
                          </span>
                        </div>
                      </div>

                      {/* Name & Location (SPACIOUS NO TRUNCATION DISPLAY) */}
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', wordBreak: 'break-word', whiteSpace: 'normal', minHeight: 20 }}>
                        {item.name || '—'}
                      </div>

                      {/* Footer: Binding State Badges */}
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

                        <span style={{ color: 'var(--text-secondary)', fontSize: 9, display: 'flex', alignItems: 'center', gap: 2 }}>
                          Job進捗 <ChevronDown size={9} style={{ transform: 'rotate(-90deg)' }} />
                        </span>
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
                      onClick={() => {
                        setDrawerEquipment(item)
                        setIsDrawerOpen(true)
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        setContextMenu({ x: e.clientX, y: e.clientY, item })
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 4,
                        background: item.isBound ? theme.bg : 'color-mix(in srgb, var(--bg-surface) 60%, transparent)',
                        border: item.isBound ? `1px solid ${theme.borderColor}` : '1px dashed var(--border-default)',
                        cursor: 'pointer'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleBinding(item)
                        }}
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
                        onClick={e => e.stopPropagation()}
                        style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: theme.color, textDecoration: 'none' }}
                      >
                        {item.code}
                      </Link>

                      <span style={{ fontSize: 9, background: theme.bg, color: theme.color, border: `1px solid ${theme.borderColor}`, padding: '0 5px', borderRadius: 8, fontWeight: 700, flexShrink: 0 }}>
                        {theme.labelJA}
                      </span>

                      {/* JOB COUNT PILL BADGE */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDrawerEquipment(item)
                          setIsDrawerOpen(true)
                        }}
                        style={{
                          fontSize: 9, padding: '1px 5px', borderRadius: 8, fontWeight: 700,
                          border: `1px solid ${item.n_jobs ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : 'var(--border-default)'}`,
                          background: item.n_jobs ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg-surface-2)',
                          color: item.n_jobs ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, transition: 'all 0.12s ease', flexShrink: 0
                        }}
                      >
                        <Settings size={9} />
                        <span>Job:{item.n_jobs || 0}</span>
                      </button>

                      <span style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', flex: 1, minWidth: 0 }}>
                        {item.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Right Click Context Menu */}
      {contextMenu && (
        <EquipmentContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={{
            id: contextMenu.item.id,
            type: contextMenu.item.type,
            code: contextMenu.item.code,
            name: contextMenu.item.name,
            status: contextMenu.item.status,
            rack: contextMenu.item.rack,
            url: contextMenu.item.url,
          }}
          onClose={() => setContextMenu(null)}
          onAction={async (actionKey, item) => {
            setContextMenu(null)
            if (actionKey === 'INSPECT') {
              router.push(item.url)
            } else if (actionKey === 'QUICK_JOB') {
              setDrawerEquipment(contextMenu.item)
              setIsDrawerOpen(true)
            } else if (actionKey === 'CREATE_JOB') {
              setCenteredWizardModal({
                isOpen: true,
                mode: 'CREATE_JOB',
                subMode: 'OVERHAUL_JOB',
                targetEquipment: contextMenu.item,
              })
            } else if (actionKey === 'CHECK_IN') {
              await supabase.from('equipment').update({ usage_status: 'IN_STOCK' }).eq('equipment_id', item.id)
              fetchEquipmentSet()
            } else if (actionKey === 'TRANSFER' || actionKey === 'UPDATE_SPECS') {
              setCenteredWizardModal({
                isOpen: true,
                mode: 'UPDATE_EQUIPMENT',
                targetEquipment: contextMenu.item,
              })
            } else if (actionKey === 'SCRAP') {
              if (confirm(`設備 ${item.code} を廃棄しますか?`)) {
                await supabase.from('equipment').update({ usage_status: 'SCRAPPED' }).eq('equipment_id', item.id)
                fetchEquipmentSet()
              }
            }
          }}
        />
      )}

      {/* Centered Quick Wizard Modal Component */}
      <CenteredQuickJobWizardModal
        isOpen={centeredWizardModal.isOpen}
        mode={centeredWizardModal.mode}
        subMode={centeredWizardModal.subMode}
        productId={productId}
        selectedRev={selectedRev}
        targetEquipment={centeredWizardModal.targetEquipment || null}
        onClose={() => setCenteredWizardModal({ isOpen: false, mode: 'CREATE_DESIGN' })}
        onSuccess={() => {
          fetchEquipmentSet()
        }}
      />

      {/* Side-Over Right Drawer for Equipment Processing Jobs */}
      <EquipmentJobDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        equipment={drawerEquipment}
        onOpenJobWizard={(mode, targetEquip) => {
          setIsDrawerOpen(false)
          setCenteredWizardModal({ isOpen: true, mode, targetEquipment: targetEquip })
        }}
      />
      {/* Create Design Revision Modal */}
      <CreateDesignRevisionModal
        isOpen={isCreateDesignModalOpen}
        productId={productId}
        parentRevision={selectedRev}
        subMode={designSubMode}
        onClose={() => setIsCreateDesignModalOpen(false)}
        onSuccess={(newRevId) => {
          setIsCreateDesignModalOpen(false)
          loadRevisions()
          setSelectedRevId(newRevId)
        }}
      />

      {/* Edit Design Revision Modal */}
      <EditDesignRevisionModal
        isOpen={!!editingRevision}
        revision={editingRevision}
        onClose={() => setEditingRevision(null)}
        onSuccess={() => {
          loadRevisions()
          router.refresh()
        }}
      />

      {/* Edit Equipment Specs Modal */}
      <EditEquipmentModal
        isOpen={!!editingEquipment}
        equipment={editingEquipment}
        onClose={() => setEditingEquipment(null)}
        onSuccess={() => {
          fetchEquipmentSet()
          router.refresh()
        }}
      />

    </div>
  )
}