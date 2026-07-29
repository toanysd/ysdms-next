'use client'

import { useTranslations } from 'next-intl'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, ArrowLeft, Loader2, FileText, Wrench, Package, Layers } from 'lucide-react'

import { moldRevisionSchema, MoldRevisionFormValues } from '@/lib/validations/master'
import { upsertMoldRevisionAction } from '@/app/actions/mold'
import { ProductSearchInput } from '@/components/order/ProductSearchInput'

interface Props {
  initialData?: any
  moldBaseId: string
  moldBaseCode: string
  suggestedLabel?: string
}

export function MoldRevisionForm({ initialData, moldBaseId, moldBaseCode, suggestedLabel }: Props) {
  const t = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = !!initialData?.id

  // Default values
  const defaultValues: Partial<MoldRevisionFormValues> = {
    id: initialData?.id,
    mold_base_id: moldBaseId,
    product_id: initialData?.product_id || '',
    revision_code: initialData?.revision_code || `${moldBaseCode}-${suggestedLabel || 'R1'}`,
    version_label: initialData?.version_label || suggestedLabel || 'R1',
    approved_date: initialData?.approved_date || '',
    version_note: initialData?.version_note || '',
    design_length: initialData?.design_length || undefined,
    design_width: initialData?.design_width || undefined,
    design_height: initialData?.design_height || undefined,
    design_depth: initialData?.design_depth || undefined,
    design_weight: initialData?.design_weight || undefined,
    cutline_x: initialData?.cutline_x || undefined,
    cutline_y: initialData?.cutline_y || undefined,
    corner_r: initialData?.corner_r || '',
    chamfer_c: initialData?.chamfer_c || '',
    draft_angle: initialData?.draft_angle || '',
    cavid: initialData?.cavid || '',
    design_for_plastic_type: initialData?.design_for_plastic_type || '',
    data_input: initialData?.data_input || '',
    customer_drawing_no: initialData?.customer_drawing_no || '',
    customer_equipment_no: initialData?.customer_equipment_no || '',
    customer_tray_name: initialData?.customer_tray_name || '',
  }

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<MoldRevisionFormValues>({
    resolver: zodResolver(moldRevisionSchema),
    defaultValues,
  })

  // Theo dõi version_label để cập nhật revision_code tương ứng (nếu chưa lưu)
  React.useEffect(() => {
    if (!isEdit) {
      const subscription = watch((value, { name, type }) => {
        if (name === 'version_label') {
          setValue('revision_code', `${moldBaseCode}-${value.version_label || ''}`, { shouldValidate: true })
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [watch, isEdit, moldBaseCode, setValue])

  const onSubmit = async (data: MoldRevisionFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await upsertMoldRevisionAction(data)
      if (result.success) {
        alert(isEdit ? 'Cập nhật phiên bản thành công!' : 'Tạo phiên bản mới thành công!')
        router.push(`/master/mold/${moldBaseId}`)
        router.refresh()
      } else {
        alert(result.error || 'Đã có lỗi xảy ra')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper Input Component
  const Input = ({ label, name, type = 'text', required = false, placeholder = '' }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-bold">
        {label} {required && <span className="text-[var(--mcs-error)]">*</span>}
      </label>
      <input
        type={type}
        {...register(name, { valueAsNumber: type === 'number' ? true : false })}
        className="w-full h-[32px] text-sm px-2 border border-[var(--mcs-border)] rounded bg-white focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)] outline-none transition-all"
        placeholder={placeholder}
      />
      {errors[name as keyof MoldRevisionFormValues] && (
        <p className="text-[10px] text-[var(--mcs-error)] mt-1">
          {(() => {
            const msg = (errors[name as keyof MoldRevisionFormValues] as any)?.message;
            if (!msg) return null;
            return msg.startsWith('req') || msg.startsWith('invalid') ? t(`Common.validation.${msg}`) : msg;
          })()}
        </p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-5xl mx-auto w-full">
      
      {/* Header */}
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.back()} className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span>{isEdit ? t('Master.editDesignRevision') : t('Master.addDesignRevision')}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary h-[32px] px-6 flex items-center gap-2 text-xs font-bold disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{t('Master.save')}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-6 bg-[var(--mcs-surface-2)]">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CỘT 1: Thông tin cơ bản */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-lg border border-[var(--mcs-border)] shadow-sm">
              <h3 className="text-[13px] font-bold text-[var(--mcs-primary)] mb-4 flex items-center gap-2 border-b border-[var(--mcs-border)] pb-2">
                <FileText size={16} /> {t('Master.identityInfo')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1 w-full pb-2 border-b border-[var(--mcs-border)]">
                  <label className="text-[12px] font-bold text-amber-600 flex flex-col">
                    {t('Master.tray')}
                  </label>
                  <ProductSearchInput 
                    defaultValue={watch('product_id') || ''} 
                    onSelect={(product) => setValue('product_id', product ? product.id : '', { shouldValidate: true })}
                  />
                  <p className="text-[10px] text-[var(--mcs-text-muted)] mt-1 italic">
                    {t('Master.trayExplanation')}
                  </p>
                </div>
                
                <Input name="revision_code" label={t('Master.revisionCode')} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input name="version_label" label={t('Master.versionLabel')} required />
                  <Input name="approved_date" type="date" label={t('Master.approvedDate')} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold">
                    {t('Master.notes')}
                  </label>
                  <textarea
                    {...register('version_note')}
                    className="w-full h-[60px] text-sm p-2 border border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)] outline-none resize-none"
                    placeholder={t('Master.notesPlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Thông tin Tham chiếu Khách hàng */}
            <div className="bg-white p-4 rounded-lg border border-[var(--mcs-border)] shadow-sm">
              <h3 className="text-[13px] font-bold text-amber-600 mb-4 flex items-center gap-2 border-b border-[var(--mcs-border)] pb-2">
                <Package size={16} /> {t('Master.customerReference')}
              </h3>
              
              <div className="space-y-4">
                <Input name="customer_drawing_no" label={t('Master.customerDrawingNo')} />
                <Input name="customer_equipment_no" label={t('Master.customerEquipmentNo')} />
                <Input name="customer_tray_name" label={t('Master.customerTrayName')} />
              </div>
            </div>
          </div>

          {/* CỘT 2: Kích thước 3D & Trọng lượng */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-lg border border-[var(--mcs-border)] shadow-sm h-full">
              <h3 className="text-[13px] font-bold text-[var(--mcs-success)] mb-4 flex items-center gap-2 border-b border-[var(--mcs-border)] pb-2">
                <Wrench size={16} /> {t('Master.dimensionsAndSpecs')}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input name="design_length" type="number" label={t('Master.designLength')} />
                  <Input name="design_width" type="number" label={t('Master.designWidth')} />
                  <Input name="design_height" type="number" label={t('Master.designHeight')} />
                  <Input name="design_depth" type="number" label={t('Master.designDepth')} />
                  <Input name="design_weight" type="number" label={t('Master.designWeight')} />
                </div>
                
                <hr className="border-[var(--mcs-border)] my-2" />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input name="cutline_x" type="number" label={t('Master.cutlineX')} />
                  <Input name="cutline_y" type="number" label={t('Master.cutlineY')} />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 3: Chi tiết Kỹ thuật */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-lg border border-[var(--mcs-border)] shadow-sm h-full">
              <h3 className="text-[13px] font-bold text-blue-600 mb-4 flex items-center gap-2 border-b border-[var(--mcs-border)] pb-2">
                <Layers size={16} /> {t('Master.engineeringAndFinish')}
              </h3>
              
              <div className="space-y-4">
                <Input name="design_for_plastic_type" label={t('Master.designForPlasticType')} />
                <Input name="cavid" label={t('Master.cavid')} />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input name="corner_r" label={t('Master.cornerR')} />
                  <Input name="chamfer_c" label={t('Master.chamferC')} />
                </div>
                
                <Input name="draft_angle" label={t('Master.draftAngle')} />
                <Input name="data_input" label={t('Master.dataInput')} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  )
}
