'use client'

import { 
  FileText, Ruler, Settings, Building2, FolderOpen, 
  Hammer, Box 
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DesignRevisionDetail } from '../page'

function InfoRow({ labelJa, labelVi, value }: { labelJa: string; labelVi: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mb-1">
        <span className="font-bold font-mono">{labelJa}</span>
        <span className="text-[9px]">{labelVi}</span>
      </span>
      <span className="text-[13px] text-[var(--text-primary)] font-medium">
        {value}
      </span>
    </div>
  )
}

function EditRow({ 
  labelJa, labelVi, value, onChange, type = 'text', options = [] 
}: { 
  labelJa: string, labelVi: string, value: any, onChange: (v: any) => void, type?: 'text'|'number'|'select'|'textarea', options?: {value: string, label: string}[] 
}) {
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mb-1">
        <span className="font-bold font-mono">{labelJa}</span>
        <span className="text-[9px]">{labelVi}</span>
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

function SectionHeader({ icon: Icon, titleJa, titleVi }: { icon: any, titleJa: string, titleVi: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 border-b border-[var(--border-default)] pb-2">
      <Icon size={16} className="text-[var(--accent)]" />
      <h3 className="text-[13px] font-bold text-[var(--text-primary)] font-mono">{titleJa}</h3>
      <span className="text-[10px] text-[var(--text-muted)]">{titleVi}</span>
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
        {p.color_name_normalized && <span className="badge badge--neutral text-[9px]">Màu: {p.color_name_normalized}</span>}
        {p.electrical_property === 'conductive' && <span className="badge badge--success text-[9px]">Dẫn điện</span>}
        {p.electrical_property === 'antistatic' && <span className="badge badge--warning text-[9px]">Chống TM</span>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
      
      {/* LEFT COLUMNS (Main Content) */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Section 1: Dimensions */}
        <div className="card-flat p-5">
          <SectionHeader icon={Ruler} titleJa="寸法 & パラメータ" titleVi="Kích thước & Thông số" />
          <div className="grid grid-cols-2 gap-x-4">
            {isEditing ? (
              <>
                <EditRow labelJa="長さ L" labelVi="Dài (mm)" type="number" value={formData?.design_length} onChange={v => handleChange('design_length', v)} />
                <EditRow labelJa="幅 W" labelVi="Rộng (mm)" type="number" value={formData?.design_width} onChange={v => handleChange('design_width', v)} />
                <EditRow labelJa="高さ H" labelVi="Cao (mm)" type="number" value={formData?.design_height} onChange={v => handleChange('design_height', v)} />
                <EditRow labelJa="深さ D" labelVi="Sâu (mm)" type="number" value={formData?.design_depth} onChange={v => handleChange('design_depth', v)} />
                <EditRow labelJa="重量" labelVi="Khối lượng (g)" type="text" value={formData?.design_weight} onChange={v => handleChange('design_weight', v)} />
                <EditRow labelJa="切断線 L" labelVi="Cutline L (mm)" type="number" value={formData?.cutline_length} onChange={v => handleChange('cutline_length', v)} />
                <EditRow labelJa="切断線 W" labelVi="Cutline W (mm)" type="number" value={formData?.cutline_width} onChange={v => handleChange('cutline_width', v)} />
                <EditRow labelJa="キャビティ数" labelVi="Cavity" type="number" value={formData?.cavity_count} onChange={v => handleChange('cavity_count', v)} />
                <EditRow labelJa="ポケット数" labelVi="Pocket" type="number" value={formData?.pocket_numbers} onChange={v => handleChange('pocket_numbers', v)} />
                <EditRow labelJa="歩み（ピッチ）" labelVi="Cavity Pitch (mm)" type="number" value={formData?.cavity_pitch_mm} onChange={v => handleChange('cavity_pitch_mm', v)} />
                <EditRow labelJa="送り" labelVi="Feed Pitch (mm)" type="number" value={formData?.machine_feed_pitch_mm} onChange={v => handleChange('machine_feed_pitch_mm', v)} />
              </>
            ) : (
              <>
                <InfoRow labelJa="長さ L" labelVi="Dài" value={rev.design_length ? `${rev.design_length} mm` : null} />
                <InfoRow labelJa="幅 W" labelVi="Rộng" value={rev.design_width ? `${rev.design_width} mm` : null} />
                <InfoRow labelJa="高さ H" labelVi="Cao" value={rev.design_height ? `${rev.design_height} mm` : null} />
                <InfoRow labelJa="深さ D" labelVi="Sâu" value={rev.design_depth ? `${rev.design_depth} mm` : null} />
                <InfoRow labelJa="重量" labelVi="Khối lượng" value={rev.design_weight ? `${rev.design_weight} g` : null} />
                <InfoRow labelJa="切断線 L" labelVi="Cutline L" value={rev.cutline_length ? `${rev.cutline_length} mm` : null} />
                <InfoRow labelJa="切断線 W" labelVi="Cutline W" value={rev.cutline_width ? `${rev.cutline_width} mm` : null} />
                <InfoRow labelJa="キャビティ数" labelVi="Cavity" value={rev.cavity_count} />
                <InfoRow labelJa="ポケット数" labelVi="Pocket" value={rev.pocket_numbers} />
                <InfoRow labelJa="歩み（ピッチ）" labelVi="Cavity Pitch" value={rev.cavity_pitch_mm ? `${rev.cavity_pitch_mm} mm` : null} />
                <InfoRow labelJa="送り" labelVi="Feed Pitch" value={rev.machine_feed_pitch_mm ? `${rev.machine_feed_pitch_mm} mm` : null} />
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
                ) : <span className="text-[10px] text-slate-400">Không khớp chuẩn</span>}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Technical Specs */}
        <div className="card-flat p-5">
          <SectionHeader icon={Settings} titleJa="技術詳細" titleVi="Chi tiết kỹ thuật" />
          <div className="grid grid-cols-2 gap-x-4">
            {isEditing ? (
              <>
                <EditRow labelJa="コーナーR" labelVi="Corner R" value={formData?.corner_r} onChange={v => handleChange('corner_r', v)} />
                <EditRow labelJa="面取りC" labelVi="Chamfer C" value={formData?.chamfer_c} onChange={v => handleChange('chamfer_c', v)} />
                <EditRow labelJa="抜き勾配" labelVi="Draft Angle" value={formData?.draft_angle} onChange={v => handleChange('draft_angle', v)} />
                <EditRow labelJa="アンダー深さ" labelVi="Under Depth" value={formData?.under_depth} onChange={v => handleChange('under_depth', v)} />
                <EditRow labelJa="アンダーカット仕様" labelVi="Undercut Spec" value={formData?.undercut_spec} onChange={v => handleChange('undercut_spec', v)} />
                <EditRow labelJa="方向" labelVi="Orientation" value={formData?.orientation} onChange={v => handleChange('orientation', v)} />
                <EditRow labelJa="セットアップ型" labelVi="Setup Type" value={formData?.setup_type} onChange={v => handleChange('setup_type', v)} />
                <EditRow labelJa="プラグ有" labelVi="Có Plug" type="select" options={[{value: 'NONE', label: 'Không'},{value: 'OWNED', label: 'Có'},{value: 'SHARED', label: 'Dùng chung'}]} value={formData?.plug_type} onChange={v => handleChange('plug_type', v)} />
                
                <div className="col-span-2 border-t pt-3 mt-1">
                  <EditRow labelJa="設計用樹脂 (Master)" labelVi="Nhựa thiết kế chuẩn" type="select" 
                    options={plastics.map(p => ({value: p.plastic_id, label: p.plastic_code}))} 
                    value={formData?.plastic_id} onChange={v => handleChange('plastic_id', v)} 
                  />
                  {renderPlasticBadge(chosenPlastic)}
                  
                  <div className="mt-2">
                    <EditRow labelJa="樹脂(手入力)" labelVi="Nhựa (chữ tự do)" type="text" value={formData?.plastic_type_designed} onChange={v => handleChange('plastic_type_designed', v)} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <InfoRow labelJa="コーナーR" labelVi="Corner R" value={rev.corner_r} />
                <InfoRow labelJa="面取りC" labelVi="Chamfer C" value={rev.chamfer_c} />
                <InfoRow labelJa="抜き勾配" labelVi="Draft Angle" value={rev.draft_angle} />
                <InfoRow labelJa="アンダー深さ" labelVi="Under Depth" value={rev.under_depth} />
                <InfoRow labelJa="アンダーカット仕様" labelVi="Undercut Spec" value={rev.undercut_spec} />
                <InfoRow labelJa="方向" labelVi="Orientation" value={rev.orientation} />
                <InfoRow labelJa="セットアップ型" labelVi="Setup Type" value={rev.setup_type} />
                <InfoRow labelJa="プラグ有" labelVi="Có Plug" value={rev.plug_type === 'OWNED' ? 'Yes' : (rev.plug_type === 'SHARED' ? 'Shared' : 'No')} />
                <InfoRow labelJa="別カッター" labelVi="Dao cắt riêng" value={rev.has_separate_cutter ? 'Yes' : 'No'} />
                
                <div className="col-span-2 mt-2 pt-2 border-t">
                  {chosenPlastic ? (
                    <div className="mb-3">
                      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mb-1">
                        <span className="font-bold font-mono">設計用樹脂</span>
                        <span className="text-[9px]">Nhựa thiết kế chuẩn</span>
                      </span>
                      <span className="text-[13px] text-[var(--accent)] font-bold block mb-1">
                        {chosenPlastic.plastic_code}
                      </span>
                      {renderPlasticBadge(chosenPlastic)}
                    </div>
                  ) : (
                    <InfoRow labelJa="設計用樹脂" labelVi="Nhựa thiết kế" value={rev.plastic_type_designed} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 3: Customer Info */}
        <div className="card-flat p-5">
          <SectionHeader icon={Building2} titleJa="顧客情報" titleVi="Thông tin KH" />
          <div className="grid grid-cols-2 gap-x-4">
            {isEditing ? (
              <>
                <EditRow labelJa="トレー名称" labelVi="Tên khay KH" value={formData?.customer_tray_name} onChange={v => handleChange('customer_tray_name', v)} />
                <EditRow labelJa="設備No." labelVi="Mã thiết bị KH" value={formData?.customer_equipment_no} onChange={v => handleChange('customer_equipment_no', v)} />
                <EditRow labelJa="図面No." labelVi="Mã bản vẽ KH" value={formData?.customer_drawing_no} onChange={v => handleChange('customer_drawing_no', v)} />
                <div className="col-span-2">
                  <EditRow labelJa="トレー情報" labelVi="Thông tin khay" type="textarea" value={formData?.tray_info} onChange={v => handleChange('tray_info', v)} />
                </div>
              </>
            ) : (
              <>
                <InfoRow labelJa="トレー名称" labelVi="Tên khay KH" value={rev.customer_tray_name} />
                <InfoRow labelJa="設備No." labelVi="Mã thiết bị KH" value={rev.customer_equipment_no} />
                <InfoRow labelJa="図面No." labelVi="Mã bản vẽ KH" value={rev.customer_drawing_no} />
                <InfoRow labelJa="トレー情報" labelVi="Thông tin khay" value={rev.tray_info} />
              </>
            )}
          </div>
        </div>

        {/* Section 4: Files & Notes */}
        <div className="card-flat p-5">
          <SectionHeader icon={FolderOpen} titleJa="ファイル & メモ" titleVi="File & Ghi chú" />
          <div className="flex flex-col gap-x-4">
            {isEditing ? (
              <>
                <EditRow labelJa="CADフォルダ" labelVi="CAD Folder Path" value={formData?.cad_folder_path} onChange={v => handleChange('cad_folder_path', v)} />
                <EditRow labelJa="図面PDF" labelVi="Drawing PDF Path" value={formData?.drawing_pdf_path} onChange={v => handleChange('drawing_pdf_path', v)} />
                <EditRow labelJa="3D STEP" labelVi="STEP 3D Path" value={formData?.step_3d_path} onChange={v => handleChange('step_3d_path', v)} />
                <EditRow labelJa="版メモ" labelVi="Ghi chú phiên bản" type="textarea" value={formData?.version_note} onChange={v => handleChange('version_note', v)} />
              </>
            ) : (
              <>
                <InfoRow labelJa="CADフォルダ" labelVi="CAD Folder Path" value={rev.cad_folder_path} />
                <InfoRow labelJa="図面PDF" labelVi="Drawing PDF Path" value={rev.drawing_pdf_path} />
                <InfoRow labelJa="3D STEP" labelVi="STEP 3D Path" value={rev.step_3d_path} />
                <InfoRow labelJa="版メモ" labelVi="Ghi chú phiên bản" value={rev.version_note} />
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
            <h3 className="text-[12px] font-bold font-mono text-[var(--text-primary)]">関連金型</h3>
            <span className="text-[10px] text-[var(--text-muted)]">Khuôn liên quan</span>
          </div>
          <div className="flex flex-col gap-2">
            {!rev.physical_molds || rev.physical_molds.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">Không có khuôn</div>
            ) : (
              rev.physical_molds.map(mold => (
                <Link
                  key={mold.physical_mold_id}
                  href={`/equipment/molds/${mold.physical_mold_id}`}
                  title={`Mở chi tiết khuôn: ${mold.system_code}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold font-mono text-[var(--accent)] hover:underline">Mở khuôn: {mold.system_code}</span>
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
            <h3 className="text-[12px] font-bold font-mono text-[var(--text-primary)]">関連ジョブ</h3>
            <span className="text-[10px] text-[var(--text-muted)]">Jobs liên quan</span>
          </div>
          <div className="flex flex-col gap-2">
            {!rev.jobs || rev.jobs.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">Không có job</div>
            ) : (
              rev.jobs.map(job => (
                <Link
                  key={job.job_id}
                  href={`/equipment/jobs/${job.job_id}`}
                  title={`Mở chi tiết job: ${job.job_code}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold font-mono text-[var(--accent)] hover:underline">Mở job: {job.job_code}</span>
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
