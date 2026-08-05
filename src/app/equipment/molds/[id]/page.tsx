'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle, Save, Box, FileCog, Briefcase, Layers } from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { MoldBackButton } from './BackButton'
import { MoldDetailHeader } from './MoldDetailHeader'
import { MoldTabNavigation, type TabId } from './MoldTabNavigation'
import { OverviewTab } from './tabs/OverviewTab'
import { LocationTab } from './tabs/LocationTab'
import { TransferTab } from './tabs/TransferTab'
import { JobsTab } from './tabs/JobsTab'
import { ReviseMoldModal } from './ReviseMoldModal'

// ─── Shared Type (exported for child components) ──────────────────────────

export type MoldDetailData = {
  physical_mold_id: string
  system_code: string
  display_name: string
  device_status: string | null
  usage_status: string | null
  mold_type: string | null
  piece_count: number | null
  copy_number: number | null
  actual_length_mm: string | null
  actual_width_mm: string | null
  actual_height_mm: string | null
  actual_weight: string | null
  manufacturing_date: string | null
  physical_stamp: string | null
  mold_entry_date: string | null
  disposed_date: string | null
  notes: string | null
  qr_uuid: string | null
  on_checklist: boolean | null
  keeper_company_id: string | null
  current_rack_layer_id: string | null
  mold_revision_id: string
  photo_url: string | null
  last_inventory_date: string | null
  created_at: string | null
  updated_at: string | null

  // Joined data
  mold_revisions: {
    revision_code: string
    revision_name: string | null
    design_revision_id: string | null
    product_id: string | null
    products: {
      product_id: string
      product_code: string
      product_name: string | null
      product_name_internal: string | null
      companies: { company_id: string; company_name: string; company_code: string } | null
    } | null
    design_revisions?: {
      revision_id: string
      design_code: string
      design_length: number | null
      design_width: number | null
      design_height: number | null
      design_depth: number | null
      corner_r: string | null
      chamfer_c: string | null
      draft_angle: string | null
      cutline_length: number | null
      cutline_width: number | null
      cavity_count: number | null
      plastic_master?: {
        plastic_code: string | null
        thickness_mm: number | null
        color_name_normalized: string | null
      } | null
    } | null
  } | null

  rack_layers: {
    layer_code: string
    layer_number: number
    racks: { rack_code: string; rack_name: string | null; location_in_factory: string | null } | null
  } | null

  keeper_company: {
    company_name: string
    company_code: string
  } | null

  jobs: { job_id: string; job_code: string; job_name: string; job_status: string }[] | null
}

// ─── Tab Content Router ───────────────────────────────────────────────────

function TabContent({ 
  tab, mold, isEditing, formData, setFormData 
}: { 
  tab: TabId; mold: MoldDetailData;
  isEditing: boolean;
  formData: Partial<MoldDetailData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<MoldDetailData>>>;
}) {
  switch (tab) {
    case 'overview':  return <OverviewTab mold={mold} isEditing={isEditing} formData={formData} setFormData={setFormData} />
    case 'location':  return <LocationTab mold={mold} />
    case 'transfer':  return <TransferTab mold={mold} />
    case 'jobs':      return <JobsTab mold={mold} />
    case 'teflon':    return <PlaceholderTab name="テフロン" />
    case 'photos':    return <PlaceholderTab name="写真" />
    case 'maintenance': return <PlaceholderTab name="保守" />
    default:          return null
  }
}

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="card-flat" style={{
      padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)',
    }}>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-jp)', marginBottom: 4 }}>
        {name}
      </div>
      <div style={{ fontSize: 11 }}>
        開発中...
      </div>
    </div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────

export default function MoldDetailPage() {
  const params = useParams()
  const moldId = params.id as string
  const supabase = createClient()

  const [mold, setMold] = useState<MoldDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<MoldDetailData>>({})
  const [showReviseModal, setShowReviseModal] = useState(false)

  const fetchMold = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('equipment')
      .select(`
        *,
        design_revisions(
          revision_id,
          design_code,
          product_id,
          products(
            product_id,
            product_code,
            product_name,
            product_name_internal,
            companies:companies!products_company_id_fkey(company_id, company_name, company_code)
          ),
          corner_r, chamfer_c, draft_angle, cutline_length, cutline_width, cavity_count,
          plastic_master(plastic_code, thickness_mm, color_name_normalized)
        ),
        rack_layers!current_rack_layer_id(
          layer_code,
          layer_number,
          racks(rack_code, rack_name, location_in_factory)
        ),
        keeper_company:companies!equipment_keeper_company_id_fkey(
          company_name,
          company_code
        ),
        jobs(job_id, job_code, job_name, job_status)
      `)
      .eq('equipment_id', moldId)
      .single()

    if (err) {
      setError(err.message)
    } else {
      let finalData = {
        ...data,
        physical_mold_id: data.equipment_id,
        system_code: data.equipment_code,
        display_name: data.display_name,
        mold_revision_id: data.design_revision_id,
        mold_revisions: data.design_revisions ? {
          revision_code: data.design_revisions.design_code,
          revision_name: data.design_revisions.design_code,
          design_revision_id: data.design_revisions.revision_id,
          product_id: data.design_revisions.product_id,
          products: data.design_revisions.products,
          design_revisions: data.design_revisions
        } : null
      }
      setMold(finalData as unknown as MoldDetailData)
      setFormData(finalData as unknown as MoldDetailData)
    }
    setLoading(false)
  }, [moldId, supabase])

  useEffect(() => { fetchMold() }, [fetchMold])

  const handleSave = async () => {
    if (!mold) return
    
    const fieldsToUpdate = {
      equipment_code: formData.system_code,
      display_name: formData.display_name,
      device_status: formData.device_status,
      usage_status: formData.usage_status,
      actual_length_mm: formData.actual_length_mm,
      actual_width_mm: formData.actual_width_mm,
      actual_height_mm: formData.actual_height_mm,
      actual_weight: formData.actual_weight,
      manufacturing_date: formData.manufacturing_date,
      mold_type: formData.mold_type,
      piece_count: formData.piece_count ? Number(formData.piece_count) : null,
      notes: formData.notes,
    }

    const { error: updateErr } = await supabase
      .from('equipment')
      .update(fieldsToUpdate)
      .eq('equipment_id', mold.physical_mold_id)

    if (!updateErr) {
      setIsEditing(false)
      fetchMold()
    } else {
      console.error(updateErr)
      alert("Failed to save: " + updateErr.message)
    }
  }

  // ── Loading State ──
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 8 }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>読み込み中...</span>
      </div>
    )
  }

  // ── Error State ──
  if (error || !mold) {
    return (
      <div className="card-flat" style={{ padding: 20, textAlign: 'center' }}>
        <AlertTriangle size={24} style={{ color: 'var(--status-error)', marginBottom: 8 }} />
        <div style={{ fontSize: 13, color: 'var(--status-error)', fontWeight: 600 }}>
          {error || '金型が見つかりません'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          ID: {moldId}
        </div>
      </div>
    )
  }

  // ── Main Render ──
  return (
    <div className="flex flex-col gap-3 relative">
      {/* Navigation */}
      <MoldBackButton />

      {/* Header */}
      <MoldDetailHeader 
        mold={mold} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing}
        onOpenReviseModal={() => setShowReviseModal(true)}
      />

      {/* ── Workflow Navigation — liên kết các khâu ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '2px 0 4px',
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginRight: 4, fontFamily: 'var(--font-jp)' }}>
          関連:
        </span>
        
        {/* ← Product */}
        {mold.mold_revisions?.products && (
          <Link
            href={`/master/products/${mold.mold_revisions.product_id}`}
            className="hover:underline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="製品マスターを開く"
          >
            <Box size={12} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>製品</span>
          </Link>
        )}

        {/* ← Design Revisions List */}
        {mold.mold_revisions?.product_id && (
          <Link
            href={`/engineering/designs/${mold.mold_revisions.product_id}`}
            className="hover:underline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="すべての設計版を開く"
          >
            <Layers size={12} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>設計一覧</span>
          </Link>
        )}

        {/* ← Design Revision */}
        {mold.mold_revisions && (
          <Link
            href={mold.mold_revisions.design_revision_id 
              ? `/engineering/designs/revisions/${mold.mold_revisions.design_revision_id}`
              : `/engineering/designs/${mold.mold_revisions.product_id}?revision=${encodeURIComponent(mold.mold_revisions.revision_code)}`
            }
            className="hover:underline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="設計版を開く"
          >
            <FileCog size={12} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>設計版</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{mold.mold_revisions.revision_code}</span>
          </Link>
        )}

        {/* → Jobs */}
        {mold.mold_revisions?.products && (
          <Link
            href={`/equipment/jobs?search=${encodeURIComponent(mold.system_code)}`}
            className="hover:underline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="加工ジョブを開く"
          >
            <Briefcase size={12} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>ジョブ</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Job</span>
          </Link>
        )}
      </div>

      {/* Tab Navigation */}
      <MoldTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ marginTop: 16 }}>
        <TabContent 
          tab={activeTab} 
          mold={mold} 
          isEditing={isEditing} 
          formData={formData} 
          setFormData={setFormData} 
        />
      </div>

      {showReviseModal && (
        <ReviseMoldModal
          mold={mold}
          onClose={() => setShowReviseModal(false)}
          onSuccess={() => {
            setShowReviseModal(false)
            fetchMold()
          }}
        />
      )}

      {/* Sticky Footer for Edit Mode */}
      {isEditing && (
        <div className="card-flat sticky bottom-0 z-10 flex justify-end gap-2 p-3 mt-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData(mold) }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save
          </button>
        </div>
      )}
    </div>
  )
}
