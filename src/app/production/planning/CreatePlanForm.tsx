'use client'

import { useTransition, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createProductionPlanAction, getProductPhysicalMolds, ProductionPlanInsert } from '@/app/actions/production'
import { getMachineTrayCompatibility } from '@/app/actions/machine'
import { Loader2, X } from 'lucide-react'

const planSchema = z.object({
    order_item_id: z.string(),
    machine_instance_id: z.string().min(1, 'Vui lòng chọn máy'),
    mold_physical_id: z.string().min(1, 'Vui lòng gán khuôn'),
    planned_date: z.string().min(1, 'Chọn ngày chạy'),
    planned_quantity: z.number().min(1, 'SL phải lớn hơn 0'),
    estimated_shots: z.number().optional(),
    estimated_hours: z.number().optional(),
    operator_name: z.string().optional(),
    notes: z.string().optional()
})

type PlanFormValues = z.infer<typeof planSchema>

export default function CreatePlanForm({ item, onClose }: { item: any, onClose: () => void }) {
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
            planned_quantity: Math.max(0, item.total_requested_qty - item.total_planned_qty),
            planned_date: new Date().toISOString().split('T')[0]
        }
    })

    const onSubmit = (data: PlanFormValues) => {
        startTransition(async () => {
            try {
                await createProductionPlanAction(data as ProductionPlanInsert)
                onClose()
            } catch (e: any) {
                alert(e.message || 'Lỗi tạo kế hoạch')
            }
        })
    }

    return (
        <div className="absolute md:fixed bottom-0 md:bottom-[8px] left-0 md:left-auto right-0 bg-[var(--mcs-surface)] border-t md:border border-[var(--mcs-border-strong)] shadow-[var(--mcs-shadow-lg)] md:rounded-[8px] p-[16px] pb-[24px] md:pb-[16px] w-full md:w-[480px]">
            <div className="flex justify-between items-center mb-[12px] pb-[8px] border-b border-[var(--mcs-divider)]">
                <h3 className="text-[14px] font-bold text-[var(--mcs-text)] flex items-center">
                    計画作成フォーム
                    <span className="text-[10px] uppercase text-[var(--mcs-primary)] ml-[8px] bg-[var(--mcs-primary-light)] px-[6px] py-[2px] rounded">Tạo Lịch</span>
                </h3>
                <button onClick={onClose} className="p-[2px] text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-hover)] rounded transition-colors"><X size={16} /></button>
            </div>

            <div className="mb-[16px] p-[8px] bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] rounded animate-slide-down">
                <div className="text-[11px] font-mono text-[var(--mcs-text-secondary)] mb-[2px]">{item.detail?.orders?.slip_no}</div>
                <div className="text-[14px] font-bold text-[var(--mcs-text)]">{item.detail?.product_pn_raw}</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[12px]">
                <input type="hidden" {...register('order_item_id')} />

                <div className="flex flex-col gap-[4px]">
                    <label className="text-[11px] font-bold text-[var(--mcs-text)] flex"><span className="w-[120px]">稼働設備 <span className="font-normal text-[9px]">(Máy)</span></span><span className="text-[10px] text-[var(--mcs-text-muted)] font-normal ml-[8px] tracking-wider uppercase">互換性 (Tương thích)</span></label>
                    <select
                        {...register('machine_instance_id')}
                        className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[30px]"
                        disabled={isLoadingSpecs}
                    >
                        <option value="">-- 設備選択 (Chọn máy) --</option>
                        {machines.map((m) => (
                            <option key={m.machine_instance?.id} value={m.machine_instance?.id}>
                                {m.machine_instance?.internal_code} - {m.machine_instance?.name}
                            </option>
                        ))}
                    </select>
                    {errors.machine_instance_id && <p className="text-[10px] text-[var(--mcs-error)] mt-[2px]">{errors.machine_instance_id.message}</p>}
                </div>

                <div className="flex flex-col gap-[4px]">
                    <label className="text-[11px] font-bold text-[var(--mcs-text)] flex"><span className="w-[120px]">金型 <span className="font-normal text-[9px]">(Khuôn)</span></span><span className="text-[10px] text-[var(--mcs-text-muted)] font-normal ml-[8px] tracking-wider uppercase">物理指定 (Chỉ định vật lý)</span></label>
                    <select
                        {...register('mold_physical_id')}
                        className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[30px]"
                        disabled={isLoadingSpecs}
                    >
                        <option value="">-- 金型選択 (Chỉ định khuôn) --</option>
                        {molds.map((mold) => (
                            <option key={mold.id} value={mold.id}>
                                {mold.physical_code} ({mold.status})
                            </option>
                        ))}
                    </select>
                    {errors.mold_physical_id && <p className="text-[10px] text-[var(--mcs-error)] mt-[2px]">{errors.mold_physical_id.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                    <div className="flex flex-col gap-[4px]">
                        <label className="text-[10px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">生産数量 <span className="font-normal text-[9px]">(Số lượng)</span></label>
                        <input type="number" {...register('planned_quantity', { valueAsNumber: true })} className="w-full bg-[var(--mcs-surface-hover)] border border-[var(--mcs-border-strong)] rounded-[4px] px-[8px] py-[4px] text-[14px] font-mono tabular-nums text-[var(--mcs-primary)] font-bold outline-none focus:border-[var(--mcs-primary)] h-[30px]" />
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <label className="text-[10px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">予定時間 <span className="font-normal text-[9px]">(Giờ)</span></label>
                        <input type="number" step="0.1" {...register('estimated_hours', { valueAsNumber: true })} placeholder="VD: 5.5" className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[13px] tabular-nums text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[30px]" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                    <div className="flex flex-col gap-[4px] bg-[var(--mcs-surface-hover)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px]">
                        <label className="text-[10px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">出荷日 <span className="font-normal text-[9px]">(Ngày xuất hàng)</span></label>
                        <div className="text-[12px] font-bold text-[var(--mcs-primary)] h-[22px] flex items-center">
                            {item.delivery_date ? new Date(item.delivery_date).toLocaleDateString('ja-JP') : '-'}
                        </div>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <label className="text-[10px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">稼働日 <span className="font-normal text-[9px]">(Ngày chạy)</span></label>
                        <input type="date" {...register('planned_date')} className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[12px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[30px]" />
                    </div>
                </div>

                <div className="flex flex-col gap-[4px] mt-[4px]">
                    <label className="text-[10px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">担当者 <span className="font-normal text-[9px]">(Thợ)</span></label>
                    <input type="text" {...register('operator_name')} placeholder="Tên thợ..." className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[30px]" />
                </div>

                <div className="flex flex-col gap-[4px] mt-[4px]">
                    <label className="text-[10px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">備考 <span className="font-normal text-[9px]">(Ghi chú)</span></label>
                    <input type="text" {...register('notes')} placeholder="Ghi chú sx..." className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[30px]" />
                </div>

                <button
                    disabled={isPending || isLoadingSpecs}
                    type="submit"
                    className="mt-[16px] w-full bg-[var(--mcs-primary)] hover:bg-[var(--mcs-primary-hover)] text-white font-bold text-[12px] py-[6px] h-[34px] rounded-[6px] transition-colors flex justify-center items-center gap-[8px] shadow-sm">
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                    登録 <span className="text-[10px] font-normal ml-1 uppercase">(Lưu kế hoạch)</span>
                </button>
            </form>
        </div>
    )
}
