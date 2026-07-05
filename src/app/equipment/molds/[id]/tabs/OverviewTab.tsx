import { FileText, Calendar, Ruler, Hash, Weight, Box, Layers, Activity, Zap, Hammer } from 'lucide-react'
import Link from 'next/link'
import type { MoldDetailData } from '../page'

function InfoRow({ icon: Icon, labelJa, labelVi, value, isEditing, editNode }: {
  icon: typeof FileText; labelJa: string; labelVi: string; value: React.ReactNode;
  isEditing?: boolean;
  editNode?: React.ReactNode;
}) {
  if (!isEditing && !value && value !== 0) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <Icon size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-jp)', minWidth: 80 }}>
        {labelJa}
      </span>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 50 }}>
        {labelVi}
      </span>
      {isEditing && editNode ? (
        <div style={{ flex: 1 }}>{editNode}</div>
      ) : (
        <span className="text-[12px] font-semibold text-[var(--text-primary)]">
          {value}
        </span>
      )}
    </div>
  )
}

function DimCard({ label, vi, value, unit, isEditing, editNode }: { label: string; vi: string; value: string | null; unit: string; isEditing?: boolean; editNode?: React.ReactNode }) {
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-jp)', marginBottom: 2 }}>
        {label}
      </div>
      {isEditing && editNode ? (
        <div style={{ margin: '4px 0' }}>{editNode}</div>
      ) : (
        <div style={{ fontSize: 16, fontWeight: 800, color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {value || '—'}
        </div>
      )}
      <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
        {unit} <span style={{ opacity: 0.6 }}>({vi})</span>
      </div>
    </div>
  )
}

export function OverviewTab({ 
  mold, isEditing, formData, setFormData 
}: { 
  mold: MoldDetailData;
  isEditing?: boolean;
  formData?: Partial<MoldDetailData>;
  setFormData?: React.Dispatch<React.SetStateAction<Partial<MoldDetailData>>>;
}) {
  const rev = mold.mold_revisions
  const product = rev?.products

  const handleChange = (field: keyof MoldDetailData, value: string | null) => {
    if (setFormData) {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {/* Left: Mold Info */}
      <div className="card-flat" style={{ padding: 16 }}>
        <h3 style={{
          fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: 'var(--font-jp)', margin: '0 0 10px 0',
          borderBottom: '1px solid var(--border-default)', paddingBottom: 6,
        }}>
          金型情報 <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Thông tin khuôn</span>
        </h3>

        <InfoRow 
          icon={Hash} labelJa="システムコード" labelVi="Mã hệ thống" value={mold.system_code} 
          isEditing={isEditing}
          editNode={<input className="form-input text-xs w-full" value={formData?.system_code || ''} onChange={e => handleChange('system_code', e.target.value)} />}
        />
        <InfoRow 
          icon={FileText} labelJa="名称" labelVi="Tên" value={mold.display_name} 
          isEditing={isEditing}
          editNode={<input className="form-input text-xs w-full" value={formData?.display_name || ''} onChange={e => handleChange('display_name', e.target.value)} />}
        />
        {/* Device Status */}
        <InfoRow 
          icon={Activity} labelJa="状態" labelVi="Trạng thái" value={mold.device_status} 
          isEditing={isEditing}
          editNode={
            <select className="form-input text-xs w-full" value={formData?.device_status || ''} onChange={e => handleChange('device_status', e.target.value)}>
              <option value="ACTIVE">使用中 (Active)</option>
              <option value="MAINTENANCE">メンテ中 (Maintenance)</option>
              <option value="DISPOSED">廃棄済 (Disposed)</option>
            </select>
          }
        />
        {/* Usage Status */}
        <InfoRow 
          icon={Activity} labelJa="使用状況" labelVi="Sử dụng" value={mold.usage_status} 
          isEditing={isEditing}
          editNode={
            <select className="form-input text-xs w-full" value={formData?.usage_status || ''} onChange={e => handleChange('usage_status', e.target.value)}>
              <option value="IN_STOCK">在庫 (In Stock)</option>
              <option value="IN_USE">使用中 (In Use)</option>
              <option value="OUT_OF_STOCK">出庫済 (Out of Stock)</option>
            </select>
          }
        />
        <InfoRow 
          icon={Box} labelJa="金型タイプ" labelVi="Loại" value={mold.mold_type} 
          isEditing={isEditing}
          editNode={
            <select className="form-input text-xs w-full" value={formData?.mold_type || ''} onChange={e => handleChange('mold_type', e.target.value)}>
              <option value="">未選択</option>
              <option value="INJECTION">INJECTION</option>
              <option value="BLOW">BLOW</option>
              <option value="PRESS">PRESS</option>
            </select>
          }
        />
        <InfoRow 
          icon={Hash} labelJa="ピース数" labelVi="Số miếng" value={mold.piece_count} 
          isEditing={isEditing}
          editNode={<input type="number" className="form-input text-xs w-full" value={formData?.piece_count || ''} onChange={e => handleChange('piece_count', e.target.value)} />}
        />
        <InfoRow icon={Hash} labelJa="コピー番号" labelVi="Bản sao #" value={mold.copy_number} />
        <InfoRow icon={FileText} labelJa="物理刻印" labelVi="Dấu đóng" value={mold.physical_stamp} />
        <InfoRow 
          icon={Calendar} labelJa="製造日" labelVi="Ngày SX" value={mold.manufacturing_date} 
          isEditing={isEditing}
          editNode={<input type="date" className="form-input text-xs w-full" value={formData?.manufacturing_date || ''} onChange={e => handleChange('manufacturing_date', e.target.value)} />}
        />
        <InfoRow icon={Calendar} labelJa="入庫日" labelVi="Ngày nhập" value={mold.mold_entry_date} />
        <InfoRow icon={Calendar} labelJa="廃棄日" labelVi="Ngày thanh lý" value={mold.disposed_date} />

        {(mold.notes || isEditing) && (
          <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-2)', fontSize: 11, color: 'var(--text-secondary)' }}>
            <strong style={{ fontFamily: 'var(--font-jp)' }}>備考:</strong>
            {isEditing ? (
              <textarea className="form-textarea text-xs w-full mt-1" value={formData?.notes || ''} onChange={e => handleChange('notes', e.target.value)} />
            ) : (
              <span style={{ marginLeft: 4 }}>{mold.notes}</span>
            )}
          </div>
        )}
      </div>

      {/* Right: Dimensions & Specs */}
      <div className="card-flat" style={{ padding: 16 }}>
        <h3 style={{
          fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: 'var(--font-jp)', margin: '0 0 10px 0',
          borderBottom: '1px solid var(--border-default)', paddingBottom: 6,
        }}>
          寸法・重量 <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Kích thước & Khối lượng</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <DimCard 
            label="長さ L" vi="Dài" value={mold.actual_length_mm} unit="mm" 
            isEditing={isEditing}
            editNode={<input className="form-input text-xs w-full text-center" value={formData?.actual_length_mm || ''} onChange={e => handleChange('actual_length_mm', e.target.value)} />}
          />
          <DimCard 
            label="幅 W" vi="Rộng" value={mold.actual_width_mm} unit="mm" 
            isEditing={isEditing}
            editNode={<input className="form-input text-xs w-full text-center" value={formData?.actual_width_mm || ''} onChange={e => handleChange('actual_width_mm', e.target.value)} />}
          />
          <DimCard 
            label="高さ H" vi="Cao" value={mold.actual_height_mm} unit="mm" 
            isEditing={isEditing}
            editNode={<input className="form-input text-xs w-full text-center" value={formData?.actual_height_mm || ''} onChange={e => handleChange('actual_height_mm', e.target.value)} />}
          />
        </div>

        <InfoRow 
          icon={Weight} labelJa="重量" labelVi="Khối lượng" value={mold.actual_weight ? `${mold.actual_weight} kg` : null} 
          isEditing={isEditing}
          editNode={
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input className="form-input text-xs w-full" value={formData?.actual_weight || ''} onChange={e => handleChange('actual_weight', e.target.value)} />
              <span>kg</span>
            </div>
          }
        />

        {/* Design revision info (if linked) */}
        {rev && (
          <>
            <h3 style={{
              fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
              fontFamily: 'var(--font-jp)', margin: '16px 0 10px 0',
              borderBottom: '1px solid var(--border-default)', paddingBottom: 6,
            }}>
              設計版リンク <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Liên kết thiết kế</span>
            </h3>
            <InfoRow icon={Layers} labelJa="版コード" labelVi="Mã phiên bản" value={
              <Link href={`/engineering/designs/revisions/${rev.design_revision_id}`} className="text-[var(--accent)] hover:underline font-mono">
                {rev.revision_code}
              </Link>
            } />
            <InfoRow icon={FileText} labelJa="版名称" labelVi="Tên phiên bản" value={rev.revision_name} />
            {product && (
              <InfoRow icon={Layers} labelJa="製品" labelVi="Sản phẩm" value={
                <Link href={`/master/products/${product.product_id}`} title={`Mở sản phẩm: ${product.product_code}`} className="text-[var(--accent)] hover:underline font-mono">
                  {product.product_code}
                </Link>
              } />
            )}

            {rev.design_revisions && (
              <>
                <h3 style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                  fontFamily: 'var(--font-jp)', margin: '16px 0 10px 0',
                  borderBottom: '1px solid var(--border-default)', paddingBottom: 6,
                }}>
                  設計パラメータ <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Thông số Thiết kế Tham chiếu</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                  <InfoRow icon={Ruler} labelJa="設計寸法" labelVi="Kích thước thiết kế" value={
                    rev.design_revisions.design_length ? `${rev.design_revisions.design_length}x${rev.design_revisions.design_width}x${rev.design_revisions.design_height}` : null
                  } />
                  <InfoRow icon={Hash} labelJa="キャビティ数" labelVi="Số CAV" value={rev.design_revisions.cavity_count} />
                  <InfoRow icon={Ruler} labelJa="コーナーR" labelVi="Góc lượn R" value={rev.design_revisions.corner_r} />
                  <InfoRow icon={Ruler} labelJa="面取りC" labelVi="Góc vát C" value={rev.design_revisions.chamfer_c} />
                  <InfoRow icon={Ruler} labelJa="抜き勾配" labelVi="Góc thoát khuôn" value={rev.design_revisions.draft_angle} />
                  <InfoRow icon={Ruler} labelJa="切断線" labelVi="Kích thước dao" value={
                    rev.design_revisions.cutline_length ? `${rev.design_revisions.cutline_length}x${rev.design_revisions.cutline_width}` : null
                  } />
                </div>
                
                {rev.design_revisions.plastic_master && (
                  <div className="mt-3 p-2 bg-[var(--bg-surface-2)] rounded border border-[var(--border-subtle)]">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono font-bold mb-1">
                      設計用樹脂 <span className="text-[9px] font-normal">Nhựa thiết kế chuẩn</span>
                    </div>
                    <div className="text-[12px] font-bold text-[var(--text-primary)]">
                      {rev.design_revisions.plastic_master.plastic_code}
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      <span className="badge badge--neutral text-[9px]">{rev.design_revisions.plastic_master.thickness_mm} mm</span>
                      {rev.design_revisions.plastic_master.color_name_normalized && <span className="badge badge--neutral text-[9px]">Màu: {rev.design_revisions.plastic_master.color_name_normalized}</span>}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      </div>

      {/* Sidebar: Jobs */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="card-flat">
          <div className="flex items-center justify-between mb-3 border-b border-[var(--border-default)] pb-2">
            <h3 className="text-[12px] font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              <Hammer size={14} className="text-accent" />
              ジョブ <span className="text-[10px] text-[var(--text-muted)] font-normal">Jobs</span>
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {!mold.jobs || mold.jobs.length === 0 ? (
              <div className="text-[11px] text-center p-4 text-[var(--text-muted)]">Không có dữ liệu</div>
            ) : (
              mold.jobs.map(job => (
                <Link
                  key={job.job_id}
                  href={`/equipment/jobs/${job.job_id}`}
                  title={`Mở chi tiết job: ${job.job_code}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <div>
                    <div className="text-[12px] font-bold font-mono text-[var(--accent)] hover:underline">Mở job: {job.job_code}</div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[150px]">{job.job_name}</div>
                  </div>
                  <span className="text-[9px] badge badge--neutral">
                    {job.job_status || 'DRAFT'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
