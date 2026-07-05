'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Hammer, AlertCircle } from 'lucide-react'
import { createMoldJobAction } from '@/app/actions/mold-job'
import { useRouter } from 'next/navigation'

type PhysicalMold = {
  physical_mold_id: string
  display_name: string
  system_code: string
  mold_revisions: {
    design_revision_id: string
    revision_code: string
  } | null
}

type DesignRevision = {
  revision_id: string
  design_code: string
  revision_number: number | null
}

type Props = {
  initialPhysicalMoldId?: string
  initialDesignRevisionId?: string
  productId?: string
  productCode?: string
  design?: DesignRevision
  onClose: () => void
  onSuccess: (jobId: string) => void
}

export function CreateJobModal({
  initialPhysicalMoldId,
  initialDesignRevisionId,
  productId,
  productCode,
  design,
  onClose,
  onSuccess
}: Props) {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [physicalMolds, setPhysicalMolds] = useState<PhysicalMold[]>([])
  const [designRevisions, setDesignRevisions] = useState<DesignRevision[]>([])
  const [jobTypes, setJobTypes] = useState<{ job_type_id: string; job_type_name_ja: string }[]>([])

  // Form State
  const [jobCategory, setJobCategory] = useState<'MOLD' | 'GENERAL'>(initialPhysicalMoldId || initialDesignRevisionId || productId ? 'MOLD' : 'GENERAL')
  const [selectedMoldId, setSelectedMoldId] = useState<string>(initialPhysicalMoldId || '')
  const [selectedDesignId, setSelectedDesignId] = useState<string>(initialDesignRevisionId || '')
  const [jobTypeId, setJobTypeId] = useState<string>('')
  const [jobName, setJobName] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  // Load Reference Data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Load Job Types
      const { data: types } = await supabase
        .from('job_types')
        .select('job_type_id, job_type_name_ja')
        .order('job_type_name_ja')
      if (types) setJobTypes(types)

      // 2. Load Design Revisions (for the dropdown if opened from physical mold)
      let fetchedDesigns: DesignRevision[] = []
      if (productId) {
        const { data: designs } = await supabase
          .from('design_revisions')
          .select('revision_id, design_code, revision_number')
          .eq('product_id', productId)
          .order('revision_number', { ascending: false })
        if (designs) {
          setDesignRevisions(designs)
          fetchedDesigns = designs
        }
      } else if (initialPhysicalMoldId) {
        // If we only have physical mold id, find its master to get designs
        const { data: moldData } = await supabase
          .from('physical_molds')
          .select('mold_revisions(product_id)')
          .eq('physical_mold_id', initialPhysicalMoldId)
          .single()
        
        const mId = moldData?.mold_revisions?.product_id
        if (mId) {
          const { data: designs } = await supabase
            .from('design_revisions')
            .select('revision_id, design_code, revision_number')
            .eq('product_id', mId)
            .order('revision_number', { ascending: false })
          if (designs) {
            setDesignRevisions(designs)
            fetchedDesigns = designs
          }
        }
      } else {
        // Global case - fetch recent
        const { data: designs } = await supabase
          .from('design_revisions')
          .select('revision_id, design_code, revision_number')
          .order('created_at', { ascending: false })
          .limit(200)
        if (designs) {
          setDesignRevisions(designs)
          fetchedDesigns = designs
        }
      }

      // 3. Load Physical Molds
      // Find the currently active design code to filter physical molds
      let activeDesignCode = design?.design_code
      if (!activeDesignCode && (selectedDesignId || initialDesignRevisionId)) {
         const d = fetchedDesigns.find(d => d.revision_id === (selectedDesignId || initialDesignRevisionId))
         if (d) activeDesignCode = d.design_code
      }

      if (activeDesignCode) {
        // Find physical molds that start with the design code (e.g. IRI001-R2-01)
        const { data: mData } = await supabase
            .from('physical_molds')
            .select('physical_mold_id, display_name, system_code, mold_revisions(design_revision_id, revision_code)')
            .neq('device_status', 'DISPOSED')
            .not('system_code', 'ilike', '%POCKET%')
            .ilike('system_code', `${activeDesignCode}%`)
        if (mData) setPhysicalMolds(mData as unknown as PhysicalMold[])
      } else if (productId) {
        // Fallback for product ID if design is not provided
        const { data: mData } = await supabase
            .from('physical_molds')
            .select('physical_mold_id, display_name, system_code, mold_revisions(design_revision_id, revision_code)')
            .neq('device_status', 'DISPOSED')
            .not('system_code', 'ilike', '%POCKET%')
            .ilike('system_code', `${productCode || ''}%`)
        if (mData) setPhysicalMolds(mData as unknown as PhysicalMold[])
      } else if (initialPhysicalMoldId) {
         // Just fetch the one mold
         const { data: mData } = await supabase
            .from('physical_molds')
            .select('physical_mold_id, display_name, system_code, mold_revisions(design_revision_id, revision_code)')
            .eq('physical_mold_id', initialPhysicalMoldId)
         if (mData) setPhysicalMolds(mData as unknown as PhysicalMold[])
      } else {
         // Global case - fetch recent
         const { data: mData } = await supabase
            .from('physical_molds')
            .select('physical_mold_id, display_name, system_code, mold_revisions(design_revision_id, revision_code)')
            .neq('device_status', 'DISPOSED')
            .not('system_code', 'ilike', '%POCKET%')
            .order('created_at', { ascending: false })
            .limit(200)
         if (mData) setPhysicalMolds(mData as unknown as PhysicalMold[])
      }

    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [supabase, productId, initialPhysicalMoldId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-fill logic
  useEffect(() => {
    if (initialDesignRevisionId) {
      setSelectedDesignId(initialDesignRevisionId)
      
      // Auto-select physical mold if there's only one perfectly matching
      const matchingMolds = physicalMolds.filter(m => m.mold_revisions?.design_revision_id === initialDesignRevisionId)
      if (matchingMolds.length === 1 && !selectedMoldId) {
        setSelectedMoldId(matchingMolds[0].physical_mold_id)
      }
    }
  }, [initialDesignRevisionId, physicalMolds, selectedMoldId])

  useEffect(() => {
    if (initialPhysicalMoldId) {
      setSelectedMoldId(initialPhysicalMoldId)
      // Auto-fill the design revision based on what the physical mold currently points to
      const mold = physicalMolds.find(m => m.physical_mold_id === initialPhysicalMoldId)
      if (mold?.mold_revisions?.design_revision_id && !selectedDesignId) {
        setSelectedDesignId(mold.mold_revisions.design_revision_id)
      }
    }
  }, [initialPhysicalMoldId, physicalMolds, selectedDesignId])

  const handleSave = async () => {
    setError(null)
    if (jobCategory === 'MOLD') {
      if (!selectedMoldId && !confirm('物理金型が選択されていません。このままジョブを作成しますか？ / Chưa chọn khuôn vật lý. Bạn có chắc chắn muốn tạo job không?')) {
          return
      }
      if (!selectedDesignId) {
          setError('設計版は必須です / Bắt buộc phải có Phiên bản thiết kế')
          return
      }
    }
    if (!jobTypeId) {
        setError('ジョブタイプは必須です / Bắt buộc chọn Loại Job')
        return
    }

    setSaving(true)
    try {
      // Find the design code to generate job name
      const design = designRevisions.find(d => d.revision_id === selectedDesignId)
      const jType = jobTypes.find(t => t.job_type_id === jobTypeId)
      
      const designCode = jobCategory === 'MOLD' && design ? design.design_code : 'GEN'
      const jTypeName = jType?.job_type_name_ja || 'Job'
      
      const autoJobCode = `JOB-${designCode}-${Date.now().toString().slice(-4)}`
      const autoJobName = jobName || (jobCategory === 'MOLD' ? `${designCode} - ${jTypeName}` : jTypeName)

      const result = await createMoldJobAction({
        job_code: autoJobCode,
        job_name: autoJobName,
        job_type_id: jobTypeId,
        product_id: jobCategory === 'MOLD' ? (productId || null) : null,
        physical_mold_id: jobCategory === 'MOLD' ? (selectedMoldId || null) : null,
        design_revision_id: jobCategory === 'MOLD' ? selectedDesignId : undefined,
        notes: notes || null
      })

      if (result.success) {
        onSuccess(result.job_id)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[500px]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-2">
            <Hammer size={16} style={{ color: 'var(--accent)' }} />
            <h3 className="m-0 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              新規ジョブ作成 <span className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>/ Tạo Job mới</span>
            </h3>
          </div>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer" style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-4">
          {error && (
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs rounded" style={{ background: 'var(--bg-error)', color: 'var(--status-error)' }}>
                <AlertCircle size={14} />
                {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5 text-xs" style={{ color: 'var(--text-muted)' }}>
                データを読み込み中... / Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {/* Category Toggle */}
              {!initialDesignRevisionId && !initialPhysicalMoldId && !productId && (
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="jobCategory" 
                      checked={jobCategory === 'MOLD'} 
                      onChange={() => setJobCategory('MOLD')} 
                    />
                    <span className="text-[12px] font-semibold">金型加工 / Gia công Khuôn</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="jobCategory" 
                      checked={jobCategory === 'GENERAL'} 
                      onChange={() => setJobCategory('GENERAL')} 
                    />
                    <span className="text-[12px] font-semibold">その他業務 / Nghiệp vụ khác</span>
                  </label>
                </div>
              )}

              {/* Context Warning */}
              {jobCategory === 'MOLD' && initialDesignRevisionId && !selectedMoldId && (
                <div className="px-3 py-2 text-[11px] rounded" style={{ background: 'var(--bg-warning)', color: 'var(--status-warning)' }}>
                  ※ 物理金型がリンクされていません。下に金型を選択するか、先に物理金型を登録してください。<br/>
                  (Chưa có khuôn vật lý được liên kết. Vui lòng chọn bên dưới hoặc đăng ký khuôn vật lý mới trước).
                </div>
              )}

              {/* Design Revision (Locked if opened from Design) */}
              {jobCategory === 'MOLD' && (
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                      対象設計版 / Phiên bản thiết kế <span className="text-red-500">*</span>
                  </label>
                  <select 
                      className="form-select" 
                      value={selectedDesignId} 
                      onChange={e => setSelectedDesignId(e.target.value)}
                      disabled={!!initialDesignRevisionId} // Lock if opened from Design
                  >
                    <option value="">-- 選択 / Chọn --</option>
                    {designRevisions.map(d => (
                      <option key={d.revision_id} value={d.revision_id}>
                        {d.design_code} (Rev {d.revision_number})
                      </option>
                    ))}
                  </select>
                  {!!initialDesignRevisionId && (
                      <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                          ※ 設計画面から開いたため、設計版は固定されています。
                      </div>
                  )}
                </div>
              )}

              {/* Physical Mold (Locked if opened from Mold) */}
              {jobCategory === 'MOLD' && (
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                      対象物理金型 / Khuôn vật lý
                  </label>
                  <div className="flex gap-2">
                      <select 
                          className="form-select flex-1" 
                          value={selectedMoldId} 
                          onChange={e => setSelectedMoldId(e.target.value)}
                          disabled={!!initialPhysicalMoldId}
                      >
                      <option value="">-- 未選択 / Chưa chọn --</option>
                      {physicalMolds.map(m => (
                          <option key={m.physical_mold_id} value={m.physical_mold_id}>
                          {m.display_name} ({m.system_code}) - Hiện tại: {m.mold_revisions?.revision_code}
                          </option>
                      ))}
                      </select>
                      {!initialPhysicalMoldId && (
                          <button 
                              className="btn btn-secondary"
                              onClick={() => {
                                  // Close this modal and open mold creation, or navigate there
                                  if (confirm('物理金型の登録画面へ移動しますか？作成後、再度ジョブを作成してください。\nBạn có muốn chuyển đến màn hình đăng ký khuôn? Sau khi tạo xong hãy quay lại tạo job.')) {
                                      const d = designRevisions.find(d => d.revision_id === selectedDesignId)
                                      const revCode = d?.design_code || ''
                                      if (productId) {
                                          router.push(`/equipment/molds?master=${productCode || productId}&revision=${revCode}&action=new`)
                                      } else {
                                          router.push('/equipment/molds?action=new')
                                      }
                                      onClose()
                                  }
                              }}
                          >
                              新規金型登録
                          </button>
                      )}
                  </div>
                </div>
              )}

              {/* Job Type */}
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                    ジョブタイプ / Loại Job <span className="text-red-500">*</span>
                </label>
                <select 
                    className="form-select" 
                    value={jobTypeId} 
                    onChange={e => setJobTypeId(e.target.value)}
                >
                  <option value="">-- 選択 / Chọn --</option>
                  {jobTypes.map(t => (
                    <option key={t.job_type_id} value={t.job_type_id}>
                      {t.job_type_name_ja}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Name (Optional override) */}
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                    ジョブ名 / Tên Job (Tùy chọn)
                </label>
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="自動生成されます / Tự động tạo nếu để trống"
                    value={jobName}
                    onChange={e => setJobName(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                    備考 / Ghi chú
                </label>
                <textarea 
                    className="form-textarea" 
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>キャンセル / Hủy</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? '保存中...' : '作成 / Tạo Job'}
          </button>
        </div>
      </div>
    </div>
  )
}
