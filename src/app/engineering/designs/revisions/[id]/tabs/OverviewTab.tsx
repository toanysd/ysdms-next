'use client'

import { useTranslations } from 'next-intl'

import { 
  FileText, Ruler, Settings, Building2, FolderOpen, 
  Hammer, Box 
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DesignRevisionDetail } from '../page'

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mb-1">
        <span className="font-bold font-mono">{label}</span>
      </span>
      <span className="text-[13px] text-[var(--text-primary)] font-medium">
        {value}
      </span>
    </div>
  )
}

function EditRow({ 
  label, value, onChange, type = 'text', options = [] 
}: { 
  label: string, value: any, onChange: (v: any) => void, type?: 'text'|'number'|'select'|'textarea', options?: {value: string, label: string}[] 
}) {
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mb-1">
        <span className="font-bold font-mono">{label}</span>
      </span>
      {type === 'select' ? (
        <select 
          className="form-input w-full text-[12px]" 
          value={value || ''} 
          onChange={e => onChange(e.target.value)}
        >
          <option value="">—</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea 
          className="form-textarea w-full text-[12px]" 
          rows={2} 
          value={value || ''} 
          onChange={e => onChange(e.target.value)} 
        />
      ) : (
        <input 
          type={type} 
          className="form-input w-full text-[12px]" 
          value={value || ''} 
          onChange={e => onChange(type === 'number' && e.target.value ? Number(e.target.value) : e.target.value)} 
        />
      )}
    </div>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 border-b border-[var(--border-default)] pb-2">
      <Icon size={16} className="text-[var(--accent)]" />
      <h3 className="text-[13px] font-bold text-[var(--text-primary)] font-mono">{title}</h3>
    </div>
  )
}

export function OverviewTab({ 
  rev, onRefresh, isEditing, formData, setFormData 
}: { 
  rev: DesignRevisionDetail, 
  onRefresh: () => void,
  isEditing?: boolean,
  formData?: Partial<DesignRevisionDetail>,
  setFormData?: (d: Partial<DesignRevisionDetail>) => void
}) {
  const t = useTranslations('Engineering')
  const supabase = createClient()
  const [cavTypes, setCavTypes] = useState<any[]>([])
  const [plastics, setPlastics] = useState<any[]>([])

  useEffect(() => {
    async function fetchRefData() {
      const [{ data: cavData }, { data: pData }] = await Promise.all([
        supabase.from('cav_types').select('*').order('cav_length_mm', { ascending: false }),
        supabase.from('plastic_master').select('*').eq('is_active', true).order('plastic_code', { ascending: true })
      ])
      if (cavData) setCavTypes(cavData)
      if (pData) setPlastics(pData)
    }
    fetchRefData()
  }, [])

  const handleChange = (field: keyof DesignRevisionDetail, val: any) => {
    if (!setFormData || !formData) return
    const newData = { ...formData, [field]: val }
    setFormData(newData)
  }

  // Derived chosen plastic details
  const chosenPlasticId = isEditing ? formData?.plastic_id : rev.plastic_id
  const chosenPlastic = plastics.find(p => p.plastic_id === chosenPlasticId)

  const renderPlasticBadge = (p: any) => {
    if (!p) return null
    return (
      <div className="flex gap-1 flex-wrap mt-1">
        <span className="badge badge--info text-[9px]">{p.plastic_family}</span>
        <span className="badge badge--neutral text-[9px]">{p.thickness_mm}x{p.width_mm}</span>
        {p.color_name_normalized && <span className="badge badge--neutral text-[9px]">色: {p.color_name_normalized}</span>}
        {p.electrical_property === 'conductive' && <span className="badge badge--success text-[9px]">導電性</span>}
        {p.electrical_property === 'antistatic' && <span className="badge badge--warning text-[9px]">帯電防止</span>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
      
      {/* LEFT COLUMNS (Main Content) */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Section 1: Dimensions */}
        <div className="card-flat p-5">
          <SectionHeader icon={Ruler} title={t('designSpecsTitle')} />
          <div className="grid grid-cols-2 gap-x-4">
            {isEditing ? (
              <>
                <EditRow label={t('chieuDai')} type="number" value={formData?.design_length} onChange={v => handleChange('design_length', v)} />
                <EditRow label={t('chieuRong')} type="number" value={formData?.design_width} onChange={v => handleChange('design_width', v)} />
                <EditRow label={t('chieuCao')} type="number" value={formData?.design_height} onChange={v => handleChange('design_height', v)} />
                <EditRow label={t('chieuSau')} type="number" value={formData?.design_depth} onChange={v => handleChange('design_depth', v)} />
                <EditRow label={t('khoiLuong')} type="text" value={formData?.design_weight} onChange={v => handleChange('design_weight', v)} />
                <EditRow label={t('cutlineL')} type="number" value={formData?.cutline_length} onChange={v => handleChange('cutline_length', v)} />
                <EditRow label={t('cutlineW')} type="number" value={formData?.cutline_width} onChange={v => handleChange('cutline_width', v)} />
                <EditRow label={t('cavity')} type="number" value={formData?.cavity_count} onChange={v => handleChange('cavity_count', v)} />
                <EditRow label={t('pocket')} type="number" value={formData?.pocket_numbers} onChange={v => handleChange('pocket_numbers', v)} />
                <EditRow label={t('cavityPitchMm')} type="number" value={formData?.cavity_pitch_mm} onChange={v => handleChange('cavity_pitch_mm', v)} />
                <EditRow label={t('feedPitchMm')} type="number" value={formData?.machine_feed_pitch_mm} onChange={v => handleChange('machine_feed_pitch_mm', v)} />
              </>
            ) : (
              <>
                <InfoRow label={t('chieuDai')} value={rev.design_length ? `${rev.design_length} mm` : null} />
                <InfoRow label={t('chieuRong')} value={rev.design_width ? `${rev.design_width} mm` : null} />
                <InfoRow label={t('chieuCao')} value={rev.design_height ? `${rev.design_height} mm` : null} />
                <InfoRow label={t('chieuSau')} value={rev.design_depth ? `${rev.design_depth} mm` : null} />
                <InfoRow label={t('khoiLuong')} value={rev.design_weight ? `${rev.design_weight} g` : null} />
                <InfoRow label={t('cutlineL')} value={rev.cutline_length ? `${rev.cutline_length} mm` : null} />
                <InfoRow label={t('cutlineW')} value={rev.cutline_width ? `${rev.cutline_width} mm` : null} />
                <InfoRow label={t('cavity')} value={rev.cavity_count} />
                <InfoRow label={t('pocket')} value={rev.pocket_numbers} />
                <InfoRow label={t('cavityPitchMm')} value={rev.cavity_pitch_mm ? `${rev.cavity_pitch_mm} mm` : null} />
                <InfoRow label={t('feedPitchMm')} value={rev.machine_feed_pitch_mm ? `${rev.machine_feed_pitch_mm} mm` : null} />
              </>
            )}
            
            {/* Auto-detected CAV Type Display */}
            {isEditing && formData?.design_length && formData?.design_width && (
              <div className="col-span-2 mb-3 p-2 bg-slate-50 border rounded flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold">Auto CAV Match:</span>
                {cavTypes.find(c => 
                  (c.cav_length_mm === Number(formData.design_length) && c.cav_width_mm === Number(formData.design_width)) ||
                  (c.cav_length_mm === Number(formData.design_width) && c.cav_width_mm === Number(formData.design_length))
                ) ? (
                  <span className="badge badge--success text-[10px]">{
                    cavTypes.find(c => 
                      (c.cav_length_mm === Number(formData.design_length) && c.cav_width_mm === Number(formData.design_width)) ||
                      (c.cav_length_mm === Number(formData.design_width) && c.cav_width_mm === Number(formData.design_length))
                    )?.cav_code
                  }</span>
                ) : <span className="text-[10px] text-slate-400">標準不一致</span>}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Technical Specs */}
        <div className="card-flat p-5">
          <SectionHeader icon={Settings} title={t('techSpecsTitle')} />
          <div className="grid grid-cols-2 gap-x-4">
            {isEditing ? (
              <>
                <EditRow label={t('cornerR')} value={formData?.corner_r} onChange={v => handleChange('corner_r', v)} />
                <EditRow label={t('chamferC')} value={formData?.chamfer_c} onChange={v => handleChange('chamfer_c', v)} />
                <EditRow label={t('draftAngle')} value={formData?.draft_angle} onChange={v => handleChange('draft_angle', v)} />
                <EditRow label={t('underDepth')} value={formData?.under_depth} onChange={v => handleChange('under_depth', v)} />
                <EditRow label={t('undercutSpec')} value={formData?.undercut_spec} onChange={v => handleChange('undercut_spec', v)} />
                <EditRow label={t('orientation')} value={formData?.orientation} onChange={v => handleChange('orientation', v)} />
                <EditRow label={t('setupType')} value={formData?.setup_type} onChange={v => handleChange('setup_type', v)} />
                <EditRow label={t('plugType')} type="select" options={[{value: 'NONE', label: t('plugOptions.none')},{value: 'OWNED', label: t('plugOptions.owned')},{value: 'SHARED', label: t('plugOptions.shared')}]} value={formData?.plug_type} onChange={v => handleChange('plug_type', v)} />
                
                <div className="col-span-2 border-t pt-3 mt-1">
                  <EditRow label={t('nhuaThietKe')} type="select" 
                    options={plastics.map(p => ({value: p.plastic_id, label: p.plastic_code}))} 
                    value={formData?.plastic_id} onChange={v => handleChange('plastic_id', v)} 
                  />
                  {renderPlasticBadge(chosenPlastic)}
                  
                  <div className="mt-2">
                    <EditRow label={t('nhuaThietKe')} type="text" value={formData?.plastic_type_designed} onChange={v => handleChange('plastic_type_designed', v)} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <InfoRow label={t('cornerR')} value={rev.corner_r} />
                <InfoRow label={t('chamferC')} value={rev.chamfer_c} />
                <InfoRow label={t('draftAngle')} value={rev.draft_angle} />
                <InfoRow label={t('underDepth')} value={rev.under_depth} />
                <InfoRow label={t('undercutSpec')} value={rev.undercut_spec} />
                <InfoRow label={t('orientation')} value={rev.orientation} />
                <InfoRow label={t('setupType')} value={rev.setup_type} />
                <InfoRow label={t('plugType')} value={rev.plug_type === 'OWNED' ? t('plugOptions.owned') : (rev.plug_type === 'SHARED' ? t('plugOptions.shared') : t('plugOptions.none'))} />
                <InfoRow label={t('hasSeparateCutter')} value={rev.has_separate_cutter ? t('yes') : t('no')} />
                
                <div className="col-span-2 mt-2 pt-2 border-t">
                  {chosenPlastic ? (
                    <div className="mb-3">
                      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mb-1">
                        <span className="font-bold font-mono">{t('nhuaThietKe')}</span>
                      </span>
                      <span className="text-[13px] text-[var(--accent)] font-bold block mb-1">
                        {chosenPlastic.plastic_code}
                      </span>
                      {renderPlasticBadge(chosenPlastic)}
                    </div>
                  ) : (
                    <InfoRow label={t('nhuaThietKe')} value={rev.plastic_type_designed} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 3: Customer Info */}
        <div className="card-flat p-5">
          <SectionHeader icon={Building2} title={t('customerInfoTitle')} />
          <div className="grid grid-cols-2 gap-x-4">
            {isEditing ? (
              <>
                <EditRow label={t('customerTrayName')} value={formData?.customer_tray_name} onChange={v => handleChange('customer_tray_name', v)} />
                <EditRow label={t('customerEquipmentNo')} value={formData?.customer_equipment_no} onChange={v => handleChange('customer_equipment_no', v)} />
                <EditRow label={t('customerDrawingNo')} value={formData?.customer_drawing_no} onChange={v => handleChange('customer_drawing_no', v)} />
                <div className="col-span-2">
                  <EditRow label={t('trayInfo')} type="textarea" value={formData?.tray_info} onChange={v => handleChange('tray_info', v)} />
                </div>
              </>
            ) : (
              <>
                <InfoRow label={t('customerTrayName')} value={rev.customer_tray_name} />
                <InfoRow label={t('customerEquipmentNo')} value={rev.customer_equipment_no} />
                <InfoRow label={t('customerDrawingNo')} value={rev.customer_drawing_no} />
                <InfoRow label={t('trayInfo')} value={rev.tray_info} />
              </>
            )}
          </div>
        </div>

        {/* Section 4: Files & Notes */}
        <div className="card-flat p-5">
          <SectionHeader icon={FolderOpen} title={t('filesNotesTitle')} />
          <div className="flex flex-col gap-x-4">
            {isEditing ? (
              <>
                <EditRow label={t('cadFolderPath')} value={formData?.cad_folder_path} onChange={v => handleChange('cad_folder_path', v)} />
                <EditRow label={t('drawingPdfPath')} value={formData?.drawing_pdf_path} onChange={v => handleChange('drawing_pdf_path', v)} />
                <EditRow label={t('step3dPath')} value={formData?.step_3d_path} onChange={v => handleChange('step_3d_path', v)} />
                <EditRow label={t('versionNote')} type="textarea" value={formData?.change_summary} onChange={v => handleChange('change_summary', v)} />
              </>
            ) : (
              <>
                <InfoRow label={t('cadFolderPath')} value={rev.cad_folder_path} />
                <InfoRow label={t('drawingPdfPath')} value={rev.drawing_pdf_path} />
                <InfoRow label={t('step3dPath')} value={rev.step_3d_path} />
                <InfoRow label={t('versionNote')} value={rev.change_summary} />
              </>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (Sidebar Links) */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Physical Molds List */}
        <div className="card-flat p-4">
          <div className="flex items-center gap-2 mb-3 border-b border-[var(--border-default)] pb-2">
            <Box size={14} className="text-[var(--accent)]" />
            <h3 className="text-[12px] font-bold font-mono text-[var(--text-primary)]">{t('relatedMoldsTitle')}</h3>
          </div>
          <div className="flex flex-col gap-2">
            {!rev.equipment || rev.equipment.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">{t('noMolds')}</div>
            ) : (
              rev.equipment.map(mold => (
                <Link
                  key={mold.equipment_id}
                  href={`/equipment/molds/${mold.physical_mold_id}`}
                  title={`金型詳細: ${mold.equipment_code}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold font-mono text-[var(--accent)] hover:underline">{mold.equipment_code}</span>
                  </div>
                  <span className="text-[9px] badge badge--neutral">{mold.device_status || 'NORMAL'}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Jobs List */}
        <div className="card-flat p-4">
          <div className="flex items-center gap-2 mb-3 border-b border-[var(--border-default)] pb-2">
            <Hammer size={14} className="text-[var(--accent)]" />
            <h3 className="text-[12px] font-bold font-mono text-[var(--text-primary)]">{t('relatedJobsTitle')}</h3>
          </div>
          <div className="flex flex-col gap-2">
            {!rev.jobs || rev.jobs.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">{t('noJobs')}</div>
            ) : (
              rev.jobs.map(job => (
                <Link
                  key={job.job_id}
                  href={`/equipment/jobs/${job.job_id}`}
                  title={`ジョブ詳細: ${job.job_code}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold font-mono text-[var(--accent)] hover:underline">{job.job_code}</span>
                    <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[150px]">{job.job_name}</span>
                  </div>
                  <span className="text-[9px] badge badge--neutral">{job.job_status || 'NEW'}</span>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
