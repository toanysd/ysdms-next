'use client'

import { useTransition, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { createProductionPlanAction, getProductPhysicalMolds, ProductionPlanInsert } from '@/app/actions/production'
import { getMachineTrayCompatibility } from '@/app/actions/machine'
import { Loader2, X } from 'lucide-react'

const planSchema = z.object({
    order_item_id: z.string(),
    machine_instance_id: z.string().min(1, 'Select machine'),
    mold_physical_id: z.string().min(1, 'Select mold'),
    planned_date: z.string().min(1, 'Select date'),
    planned_quantity: z.number().min(1, 'Quantity must be > 0'),
    estimated_shots: z.number().optional(),
    estimated_hours: z.number().optional(),
    operator_name: z.string().optional(),
    notes: z.string().optional()
})

type PlanFormValues = z.infer<typeof planSchema>

export default function CreatePlanForm({ item, onClose }: { item: any, onClose: () => void }) {
    const t = useTranslations('Planning.CreateForm')
    const [isPending, startTransition] = useTransition()
    const [machines, setMachines] = useState<any[]>([])
    const [molds, setMolds] = useState<any[]>([])
    const [isLoadingSpecs, setIsLoadingSpecs] = useState(true)

    useEffect(() => {
        if (item?.detail?.product_id) {
            setIsLoadingSpecs(true)
            Promise.all([
                getMachineTrayCompatibility(item.detail.product_id),
                getProductPhysicalMolds(item.detail.product_id)
            ]).then(([machRes, moldRes]) => {
                setMachines(machRes || [])
                setMolds(moldRes || [])
            }).finally(() => setIsLoadingSpecs(false))
        }
    }, [item])

    const { register, handleSubmit, formState: { errors } } = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            order_item_id: item.order_item_id,
            planned_quantity: Math.max(0, (item.total_requested_qty || item.total_ordered || 0) - (item.total_planned || 0)),
            planned_date: new Date().toISOString().split('T')[0]
        }
    })

    const onSubmit = (data: PlanFormValues) => {
        startTransition(async () => {
            try {
                await createProductionPlanAction(data as ProductionPlanInsert)
                onClose()
            } catch (e: any) {
                alert(e.message || 'Error creating plan')
            }
        })
    }

    return (
        <div className="absolute md:fixed bottom-0 md:bottom-[8px] left-0 md:left-auto right-0 bg-[var(--bg-surface)] border-t md:border border-[var(--border-default)] shadow-lg md:rounded-[8px] p-[16px] pb-[24px] md:pb-[16px] w-full md:w-[480px] z-50">
            <div className="flex justify-between items-center mb-[12px] pb-[8px] border-b border-[var(--border-default)]">
                <h3 className="text-[14px] font-bold text-[var(--text-primary)] flex items-center">
                    {t('title')}
                    <span className="text-[10px] uppercase text-[var(--accent)] ml-[8px] bg-[var(--tint-teal-bg)] px-[6px] py-[2px] rounded font-mono font-bold">{t('titleTag')}</span>
                </h3>
                <button onClick={onClose} className="p-[2px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded transition-colors"><X size={16} /></button>
            </div>

            <div className="mb-[16px] p-[8px] bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded">
                <div className="text-[11px] font-mono text-[var(--text-muted)] mb-[2px]">{item.detail?.orders?.slip_no}</div>
                <div className="text-[14px] font-bold font-mono text-[var(--accent)]">{item.detail?.product_pn_raw}</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[12px]">
                <input type="hidden" {...register('order_item_id')} />

                <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-semibold text-[var(--text-muted)] flex justify-between">
                        <span>{t('machineLabel')}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-normal tracking-wider uppercase">{t('compatibility')}</span>
                    </label>
                    <select
                        {...register('machine_instance_id')}
                        className="form-input w-full text-[13px] h-[32px]"
                        disabled={isLoadingSpecs}
                    >
                        <option value="">{t('selectMachine')}</option>
                        {machines.map((m) => (
                            <option key={m.machine_instance?.id} value={m.machine_instance?.id}>
                                {m.machine_instance?.internal_code} - {m.machine_instance?.name}
                            </option>
                        ))}
                    </select>
                    {errors.machine_instance_id && <p className="text-[11px] text-[var(--status-error)] mt-[2px]">{t('valMachineReq')}</p>}
                </div>

                <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-semibold text-[var(--text-muted)] flex justify-between">
                        <span>{t('moldLabel')}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-normal tracking-wider uppercase">{t('physicalSpec')}</span>
                    </label>
                    <select
                        {...register('mold_physical_id')}
                        className="form-input w-full text-[13px] h-[32px]"
                        disabled={isLoadingSpecs}
                    >
                        <option value="">{t('selectMold')}</option>
                        {molds.map((mold) => (
                            <option key={mold.id} value={mold.id}>
                                {mold.physical_code || mold.system_code} ({mold.status || mold.device_status || 'ACTIVE'})
                            </option>
                        ))}
                    </select>
                    {errors.mold_physical_id && <p className="text-[11px] text-[var(--status-error)] mt-[2px]">{t('valMoldReq')}</p>}
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                    <div className="flex flex-col gap-[4px]">
                        <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{t('quantityLabel')}</label>
                        <input type="number" {...register('planned_quantity', { valueAsNumber: true })} className="form-input w-full text-[14px] font-mono font-bold text-[var(--accent)] h-[32px]" />
                        {errors.planned_quantity && <p className="text-[11px] text-[var(--status-error)] mt-[2px]">{t('valQtyReq')}</p>}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{t('hoursLabel')}</label>
                        <input type="number" step="0.1" {...register('estimated_hours', { valueAsNumber: true })} placeholder="5.5" className="form-input w-full text-[13px] font-mono h-[32px]" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                    <div className="flex flex-col gap-[4px] bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded px-[8px] py-[4px]">
                        <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{t('shipDateLabel')}</label>
                        <div className="text-[13px] font-bold font-mono text-[var(--accent)] h-[22px] flex items-center">
                            {item.delivery_date ? new Date(item.delivery_date).toLocaleDateString('ja-JP') : '-'}
                        </div>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{t('runDateLabel')}</label>
                        <input type="date" {...register('planned_date')} className="form-input w-full text-[12px] font-mono h-[32px]" />
                        {errors.planned_date && <p className="text-[11px] text-[var(--status-error)] mt-[2px]">{t('valDateReq')}</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-[4px] mt-[4px]">
                    <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{t('operatorLabel')}</label>
                    <input type="text" {...register('operator_name')} placeholder={t('operatorPlaceholder')} className="form-input w-full text-[13px] h-[32px]" />
                </div>

                <div className="flex flex-col gap-[4px] mt-[4px]">
                    <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{t('notesLabel')}</label>
                    <input type="text" {...register('notes')} placeholder={t('notesPlaceholder')} className="form-input w-full text-[13px] h-[32px]" />
                </div>

                <button
                    disabled={isPending || isLoadingSpecs}
                    type="submit"
                    className="btn btn-primary mt-[16px] w-full h-[36px] text-[13px] font-bold justify-center">
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                    {t('savePlan')}
                </button>
            </form>
        </div>
    )
}

