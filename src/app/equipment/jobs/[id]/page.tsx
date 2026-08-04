'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle, Box, FileCog, Wrench, Layers, Edit } from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { JobBackButton } from './JobBackButton'
import { JobDetailHeader } from './JobDetailHeader'
import { JobTabNavigation, type TabId } from './JobTabNavigation'

import { OverviewTab } from './tabs/OverviewTab'
import { StepsTab } from './tabs/StepsTab'
import { LogsTab } from './tabs/LogsTab'
import { QuickLinkMoldModal } from '@/components/equipment/QuickLinkMoldModal'

// Placeholder Tabs
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

function TabContent({ tab, job, onRefresh }: { tab: TabId; job: any; onRefresh: () => void }) {
  switch (tab) {
    case 'overview': return <OverviewTab job={job} onRefresh={onRefresh} />
    case 'steps':    return <StepsTab job={job} onRefresh={onRefresh} />
    case 'logs':     return <LogsTab job={job} onRefresh={onRefresh} />
    default:         return null
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string
  const supabase = createClient()

  const [job, setJob] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [showLinkMoldModal, setShowLinkMoldModal] = useState(false)

  const fetchJob = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('jobs')
      .select(`
        *,
        job_types(job_type_name_ja, job_type_name_vi),
        companies!jobs_company_id_fkey(company_name),
        physical_molds(physical_mold_id, system_code, display_name, actual_length_mm, actual_width_mm, actual_height_mm, actual_weight, device_status),
        design_revisions(revision_id, design_code, revision_number, design_length, design_width, design_height, design_depth, cutline_length, cutline_width, cavity_count, pocket_numbers, cavity_pitch_mm, machine_feed_pitch_mm, plastic_type_designed, corner_r, draft_angle, plug_type),
        products!jobs_product_id_fkey(product_id, product_code, product_name, product_name_internal, product_material_specs(material_type, material_grade, thickness_mm, sheet_width_mm)),
        job_steps(
          step_id, step_no, step_name, step_status, track,
          planned_start, planned_end, planned_hours, actual_hours,
          estimated_hours, machining_location, deadline, notes,
          processing_status_id,
          processing_statuses(status_code)
        )
      `)
      .eq('job_id', jobId)
      .single()

    if (err) {
      setError(err.message)
    } else {
      setJob(data)
    }
    setLoading(false)
  }, [jobId, supabase])

  useEffect(() => { fetchJob() }, [fetchJob])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 8 }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>読み込み中...</span>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="card-flat" style={{ padding: 20, textAlign: 'center' }}>
        <AlertTriangle size={24} style={{ color: 'var(--status-error)', marginBottom: 8 }} />
        <div style={{ fontSize: 13, color: 'var(--status-error)', fontWeight: 600 }}>
          {error || 'ジョブが見つかりません'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          ID: {jobId}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Row 1: Back buttons + Header — same visual area */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 10, flexShrink: 0 }}>
          <JobBackButton />
        </div>
        <div style={{ flex: 1 }}>
          <JobDetailHeader job={job} />
          
          {/* ── Workflow Navigation — liên kết các khâu ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
            padding: '2px 0 4px', marginTop: 4,
          }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginRight: 4, fontFamily: 'var(--font-jp)' }}>
              関連:
            </span>
            
            {/* ← Product */}
            {job.products && (
              <Link
                href={`/master/products/${job.products.product_id}`}
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
            {job.products && (
              <Link
                href={`/engineering/designs/${job.products.product_id}`}
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
            {job.design_revisions && job.products && (
              <Link
                href={`/engineering/designs/revisions/${job.design_revisions.revision_id}`}
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
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{job.design_revisions.design_code}</span>
              </Link>
            )}
            {/* ← Physical Mold */}
            {job.physical_molds && (
              <Link
                href={`/equipment/molds/${job.physical_molds.physical_mold_id}`}
                className="hover:underline"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                  fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
                  fontWeight: 600, transition: 'all 0.15s',
                }}
                title="金型を開く"
              >
                <Wrench size={12} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontFamily: 'var(--font-jp)' }}>金型</span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{job.physical_molds.system_code}</span>
              </Link>
            )}

            {/* ← Edit Master 1-Page Link */}
            <Link
              href={`/equipment/jobs/quick-create?editJobId=${job.job_id}`}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
                fontWeight: 700, height: 26, background: 'color-mix(in srgb, var(--accent) 8%, var(--bg-surface))'
              }}
              title="全項目一括編集フォームを開く"
            >
              <Edit size={12} />
              <span>✏️ 全体編集 (1ページ)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Warning Banner for Unlinked Mold Jobs */}
      {!job.physical_molds && !job.job_name.includes('社内作業') && (
        <div style={{
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid var(--status-warning)',
          background: 'color-mix(in srgb, var(--status-warning) 10%, var(--bg-surface))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          fontSize: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: 'var(--status-warning)' }} />
            <span>
              <strong>⚠️ 金型未割り当て:</strong> 加工時間および累積コストを正確に追跡するために物理金型を割り当ててください。
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ height: 26, padding: '0 10px', fontSize: 11, gap: 4 }}
            onClick={() => setShowLinkMoldModal(true)}
          >
            + 金型を割り当てる
          </button>
        </div>
      )}

      {/* Row 2: Tabs */}
      <JobTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Row 3: Tab content — fill remaining space */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 0 }}>
        <TabContent tab={activeTab} job={job} onRefresh={fetchJob} />
      </div>

      {showLinkMoldModal && (
        <QuickLinkMoldModal
          jobId={job.job_id}
          jobCode={job.job_code}
          jobName={job.job_name}
          onClose={() => setShowLinkMoldModal(false)}
          onSuccess={() => fetchJob()}
        />
      )}
    </div>
  )
}
