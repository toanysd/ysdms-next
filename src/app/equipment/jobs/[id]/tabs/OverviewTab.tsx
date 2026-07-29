'use client'

import { useTranslations, useLocale } from 'next-intl'

import { Clock, Info, Pencil, X, Save, Loader2, Ruler, Box, ExternalLink, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteMoldJobAction } from '@/app/actions/mold-job'

function InfoRow({ ja, vi, value }: { ja: string; vi: string; value: React.ReactNode }) {
  const locale = useLocale()
  const isVi = locale === 'vi'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ width: 140, flexShrink: 0, color: 'var(--text-muted)' }}>
        {isVi ? vi : ja}
      </div>
      <div style={{ fontWeight: 500 }}>{value || '—'}</div>
    </div>
  )
}

// ── Edit Job Modal ──
function EditJobModal({ job, onClose, onSaved }: { job: any; onClose: () => void; onSaved: () => void }) {
  const t = useTranslations()
  const supabase = createClient()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [jobName, setJobName] = useState(job.job_name || '')
  const [priority, setPriority] = useState<string>(job.priority?.toString() || '5')
  const [moldDeadline, setMoldDeadline] = useState(job.mold_deadline?.slice(0, 10) || '')
  const [shipDate, setShipDate] = useState(job.ship_date?.slice(0, 10) || '')
  const [notes, setNotes] = useState(job.notes || '')

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from('jobs')
        .update({
          job_name: jobName,
          priority: parseInt(priority) || 5,
          mold_deadline: moldDeadline || null,
          ship_date: shipDate || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('job_id', job.job_id)

      if (err) throw new Error(err.message)
      onSaved()
    } catch (e: any) {
      setError(e.message || 'エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div className="card" style={{ position: 'relative', width: 480, maxHeight: '80vh', overflowY: 'auto', padding: 0, zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            {t('Equipment.chinhSuaThongTinJob')}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ padding: '8px 12px', background: 'var(--status-error)', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: 12 }}>{error}</div>
          )}

          <div>
            <label className="form-label">
              {t('Equipment.tenJob')}
            </label>
            <input className="form-input" value={jobName} onChange={e => setJobName(e.target.value)} />
          </div>

          <div className="form-grid-2">
            <div>
              <label className="form-label">
                {t('Equipment.mucUuTien')}
              </label>
              <input type="number" min="1" max="10" className="form-input" value={priority} onChange={e => setPriority(e.target.value)} />
            </div>
            <div>
              <label className="form-label">
                {t('Equipment.hanChotKhuon')}
              </label>
              <input type="date" className="form-input" value={moldDeadline} onChange={e => setMoldDeadline(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="form-label">
              {t('Equipment.ngayXuatHang')}
            </label>
            <input type="date" className="form-input" value={shipDate} onChange={e => setShipDate(e.target.value)} />
          </div>

          <div>
            <label className="form-label">
              {t('Equipment.ghiChu')}
            </label>
            <textarea className="form-textarea" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="メモ..." />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '12px 20px', borderTop: '1px solid var(--border-default)' }}>
          <div>
            <button 
              className="btn btn-secondary hover-danger" 
              style={{ padding: '0 8px', height: 32 }}
              onClick={async () => {
                if (window.confirm('このジョブを削除しますか？\nBạn có chắc chắn muốn xóa job này?\n\n※ 削除すると復元できません。 (Hành động này không thể hoàn tác)')) {
                  setSaving(true)
                  const res = await deleteMoldJobAction(job.job_id)
                  if (!res.success) {
                    setError(res.error || 'Xóa thất bại')
                    setSaving(false)
                  } else {
                    router.push('/equipment/jobs')
                  }
                }
              }} 
              disabled={saving}
              title="削除 / Xóa"
            >
              <Trash2 size={14} style={{ color: 'var(--status-error)' }} />
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
              {t('Common.cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              {t('Common.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OverviewTab({ job, onRefresh }: { job: any; onRefresh?: () => void }) {
  const [editing, setEditing] = useState(false)
  const router = useRouter()
  const t = useTranslations()

  const handleSaved = () => {
    setEditing(false)
    onRefresh?.()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Basic Info Card */}
      <div className="card-flat" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Info size={16} style={{ color: 'var(--accent)' }} />
            {t('Equipment.thongTinCoBan')}
          </h3>
          <button
            onClick={() => setEditing(true)}
            style={{
              background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 8px',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
            }}
            title="編集 / Chỉnh sửa"
          >
            <Pencil size={12} />
            {t('Common.edit')}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InfoRow ja="ジョブ名" vi="Tên Job" value={job.job_name} />
          <InfoRow ja="ジョブコード" vi="Mã Job" value={
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{job.job_code}</span>
          } />
          {job.physical_molds && (
            <InfoRow ja="物理金型" vi="Khuôn vật lý" value={
              <Link href={`/equipment/molds/${job.physical_molds.mold_id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }} className="hover:underline">
                {job.physical_molds.display_name} ({job.physical_molds.system_code})
              </Link>
            } />
          )}
          {job.design_revisions && (
            <InfoRow ja="設計リビジョン" vi="Thiết kế" value={
              job.design_revisions.design_id ? (
                <Link href={`/engineering/designs/${job.design_revisions.design_id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }} className="hover:underline">
                  {job.design_revisions.design_code} (Rev {job.design_revisions.revision_number})
                </Link>
              ) : (
                `${job.design_revisions.design_code} (Rev ${job.design_revisions.revision_number})`
              )
            } />
          )}
          {job.products && (
            <InfoRow ja="製品" vi="Sản phẩm" value={
              <Link href={`/master/products/${job.products.product_id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }} className="hover:underline">
                {job.products.product_name || job.products.product_code}
              </Link>
            } />
          )}
          <InfoRow ja="備考" vi="Ghi chú" value={job.notes || '—'} />
        </div>
      </div>

      {/* Mold Dimensions Card */}
      {(job.design_revisions || job.physical_molds) && (
        <div className="card-flat" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ruler size={16} style={{ color: 'var(--accent)' }} />
            {t('Equipment.kichThuocKhuon')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {job.design_revisions && (
                <>
                  {(job.design_revisions.design_length || job.design_revisions.design_width) && (
                    <InfoRow ja="型寸法" vi="Kích thước TK" value={
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {job.design_revisions.design_length || '—'} × {job.design_revisions.design_width || '—'} × {job.design_revisions.design_height || '—'} mm
                      </span>
                    } />
                  )}
                  {(job.design_revisions.cutline_length || job.design_revisions.cutline_width) && (
                    <InfoRow ja="CUTLINE" vi="Cutline" value={
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {job.design_revisions.cutline_length || '—'} × {job.design_revisions.cutline_width || '—'} mm
                      </span>
                    } />
                  )}
                  {job.design_revisions.cavity_count && (
                    <InfoRow ja="キャビティ" vi="Cavity" value={
                      <span style={{ fontFamily: 'monospace' }}>
                        {job.design_revisions.cavity_count} 面{job.design_revisions.pocket_numbers ? ` / ポケット ${job.design_revisions.pocket_numbers}` : ''}{job.design_revisions.cavity_pitch_mm ? ` / ピッチ ${job.design_revisions.cavity_pitch_mm}mm` : ''}
                      </span>
                    } />
                  )}
                  {(job.design_revisions.corner_r || job.design_revisions.draft_angle) && (
                    <InfoRow ja="R/角度" vi="R/Góc" value={
                      <span style={{ fontFamily: 'monospace' }}>
                        {job.design_revisions.corner_r ? `Corner R${job.design_revisions.corner_r}` : ''}{job.design_revisions.draft_angle ? ` / Draft ${job.design_revisions.draft_angle}°` : ''}
                      </span>
                    } />
                  )}
                  {job.design_revisions.plastic_type_designed && (
                    <InfoRow ja="設計樹脂" vi="Nhựa thiết kế" value={
                      <span style={{ fontWeight: 600 }}>{job.design_revisions.plastic_type_designed}</span>
                    } />
                  )}
                </>
              )}
              {job.physical_molds && (job.physical_molds.actual_length_mm || job.physical_molds.actual_width_mm) && (
                <InfoRow ja="実金型寸法" vi="KT khuôn thực" value={
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {job.physical_molds.actual_length_mm || '—'} × {job.physical_molds.actual_width_mm || '—'} × {job.physical_molds.actual_height_mm || '—'} mm
                    {job.physical_molds.actual_weight ? ` (${job.physical_molds.actual_weight}kg)` : ''}
                  </span>
                } />
              )}
            </div>
          </div>
        )}

        {/* Material Info Card */}
        {(job.products?.product_material_specs?.length > 0 || job.design_revisions?.plastic_type_designed) && (
          <div className="card-flat" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Box size={16} style={{ color: 'var(--accent)' }} />
              {t('Equipment.thongTinVatLieu')}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {job.products?.product_material_specs?.map((spec: any, idx: number) => (
                <InfoRow key={idx} ja={spec.component_name || `素材 ${idx + 1}`} vi={`Vật liệu ${idx + 1}`} value={
                  <span style={{ fontFamily: 'monospace' }}>
                    {spec.material_type}{spec.material_grade ? ` ${spec.material_grade}` : ''}
                    {spec.thickness_mm ? ` / ${spec.thickness_mm}mm` : ''}
                    {spec.sheet_width_mm ? ` / W${spec.sheet_width_mm}mm` : ''}
                  </span>
                } />
              ))}
            </div>
          </div>
        )}

        <div className="card-flat" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} style={{ color: 'var(--accent)' }} />
            {t('Equipment.keHoach')}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InfoRow ja="優先度" vi="Mức ưu tiên" value={job.priority || 5} />
            <InfoRow ja="金型期限" vi="Hạn chót khuôn" value={
              <span style={{ fontWeight: 600 }}>
                {job.mold_deadline ? new Date(job.mold_deadline).toLocaleDateString('ja-JP') : '—'}
              </span>
            } />
            <InfoRow ja="出荷日" vi="Ngày xuất hàng" value={
              job.ship_date ? new Date(job.ship_date).toLocaleDateString('ja-JP') : '—'
            } />
            <InfoRow ja="進捗" vi="Tiến độ" value={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 6, background: 'var(--bg-surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${job.overall_progress || 0}%`,
                    background: job.overall_progress === 100 ? 'var(--status-success)' : 'var(--accent)',
                    borderRadius: 3
                  }} />
                </div>
                <span style={{
                  fontWeight: 600, fontFamily: 'monospace',
                  color: job.overall_progress === 100 ? 'var(--status-success)' : 'inherit'
                }}>
                  {job.overall_progress || 0}%
                </span>
              </div>
            } />
            <InfoRow ja="状態" vi="Trạng thái" value={
              <span className="badge" style={{
                backgroundColor: job.job_status === 'COMPLETED' ? 'var(--status-success)' :
                                job.job_status === 'IN_PROGRESS' ? 'var(--status-warning)' :
                                'var(--status-info)',
                color: '#fff'
              }}>
                {job.job_status}
              </span>
            } />
          </div>
        </div>

      {editing && (
        <EditJobModal
          job={job}
          onClose={() => setEditing(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
