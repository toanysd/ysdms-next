'use client'
import { useMemo, useTransition } from 'react'
import { Edit2, Loader2, Trash2 } from 'lucide-react'
import { deleteProductionPlanAction } from '@/app/actions/production'

export default function ExcelPlanGridView({ plans }: { plans: any[] }) {
    const [isPending, startTransition] = useTransition()

    // Xoá mềm với Validation
    const handleDelete = (id: string) => {
        if (!confirm('Bạn có chắc xoá kế hoạch này? (この計画を削除しますか？)')) return
        startTransition(async () => {
            try {
                await deleteProductionPlanAction(id)
            } catch (err: any) {
                alert(err.message)
            }
        })
    }
    // Nhóm theo Thợ -> Máy
    const groupedData = useMemo(() => {
        const opMap: Record<string, Record<string, any[]>> = {}

        plans.forEach(plan => {
            const opName = plan.operator_name || '未割当 (Chưa phân công)'
            const machineName = plan.machine_instance?.internal_code || '不明な設備 (Máy ẩn)'

            if (!opMap[opName]) opMap[opName] = {}
            if (!opMap[opName][machineName]) opMap[opName][machineName] = []

            opMap[opName][machineName].push(plan)
        })

        return opMap
    }, [plans])

    if (plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--mcs-text-muted)] h-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] shadow-sm">
                <p className="text-[14px] tracking-widest uppercase font-bold">データがありません</p>
                <p className="text-[11px] mt-1">Dữ liệu trống / Trống kế hoạch</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-auto bg-[var(--mcs-surface-2)]">
            <div className="flex flex-col gap-[24px] p-[16px] min-w-[800px]">
                {Object.entries(groupedData).map(([opName, machines]) => (
                    <div key={opName} className="flex flex-col bg-[var(--mcs-surface)] border-2 border-[var(--mcs-border-strong)] shadow-sm">

                        {/* Operator Header Block (style header vàng khè / warning box) */}
                        <div className="bg-[var(--mcs-warning-light)] border-b-2 border-[var(--mcs-border-strong)] px-[16px] py-[8px] flex items-center justify-between">
                            <span className="font-bold text-[14px] text-[#856404] uppercase flex items-center gap-[8px]">
                                {opName}担当 <span className="text-[11px] font-normal tracking-wider opacity-80">(Phụ trách)</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px] p-[12px] bg-[var(--mcs-surface)]">
                            {Object.entries(machines).map(([machineName, mPlans]) => {
                                const totalHrs = mPlans.reduce((sum, p) => sum + (Number(p.estimated_hours) || 0), 0)
                                return (
                                    <div key={machineName} className="flex flex-col border border-[var(--mcs-border-strong)] rounded overflow-hidden">
                                        <div className="bg-[var(--mcs-surface-3)] px-[12px] py-[6px] border-b border-[var(--mcs-border-strong)] flex justify-between items-center shrink-0">
                                            <span className="font-bold text-[13px] text-[var(--mcs-text)]">{machineName}</span>
                                            <span className="text-[11px] font-bold text-[var(--mcs-text-secondary)]">合計: <span className="font-mono text-[var(--mcs-primary)]">{totalHrs.toFixed(1)}h</span></span>
                                        </div>

                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-[#f8f9fa] border-b border-[var(--mcs-border)]">
                                                <tr className="text-[10px] text-[var(--mcs-text-secondary)] font-bold uppercase">
                                                    <th className="py-[4px] px-[8px] border-r border-[var(--mcs-border)]">品番 <span className="font-normal opacity-70">(Mã SP)</span></th>
                                                    <th className="py-[4px] px-[8px] border-r border-[var(--mcs-border)] text-right">数量 <span className="font-normal opacity-70">(SL)</span></th>
                                                    <th className="py-[4px] px-[8px] border-r border-[var(--mcs-border)]">金型 <span className="font-normal opacity-70">(Khuôn)</span></th>
                                                    <th className="py-[4px] px-[8px] border-r border-[var(--mcs-border)]">出荷日 <span className="font-normal opacity-70">(Giao)</span></th>
                                                    <th className="py-[4px] px-[8px] border-r border-[var(--mcs-border)]">進捗 <span className="font-normal opacity-70">(Status)</span></th>
                                                    <th className="py-[4px] px-[8px] border-r border-[var(--mcs-border)]">備考 <span className="font-normal opacity-70">(Ghi chú)</span></th>
                                                    <th className="py-[4px] px-[8px] border-r border-[var(--mcs-border)] text-right">時間 <span className="font-normal opacity-70">(Giờ)</span></th>
                                                    <th className="py-[4px] px-[8px] text-center w-[60px]">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[11px] font-mono text-[var(--mcs-text)]">
                                                {mPlans.map((plan, i) => (
                                                    <tr key={plan.id} className={`border-b border-[var(--mcs-border)] ${i % 2 === 0 ? 'bg-white' : 'bg-[var(--mcs-surface-2)]'} hover:bg-[var(--mcs-surface-hover)] h-[32px]`}>
                                                        <td className="px-[8px] py-[2px] border-r border-[var(--mcs-border)] font-bold text-[var(--mcs-primary)] truncate max-w-[150px]" title={plan.order_items?.product_pn_raw}>
                                                            {plan.order_items?.product_pn_raw}
                                                        </td>
                                                        <td className="px-[8px] py-[2px] border-r border-[var(--mcs-border)] text-right tabular-nums text-[var(--mcs-info)] font-bold">
                                                            {plan.planned_quantity?.toLocaleString()}
                                                        </td>
                                                        <td className="px-[8px] py-[2px] border-r border-[var(--mcs-border)] text-[var(--mcs-text-muted)] truncate max-w-[100px]" title={plan.mold_physical?.physical_code}>
                                                            {plan.mold_physical?.physical_code || '-'}
                                                        </td>
                                                        <td className="px-[8px] py-[2px] border-r border-[var(--mcs-border)] text-[var(--mcs-text-secondary)] font-sans text-[10px]">
                                                            {plan.order_items?.delivery_date ? new Date(plan.order_items.delivery_date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }) : '-'}
                                                        </td>
                                                        <td className="px-[8px] py-[2px] border-r border-[var(--mcs-border)] font-sans">
                                                            {plan.status === 'SCHEDULED' ? <span className="bg-[var(--mcs-info-light)] text-[var(--mcs-info)] border border-[var(--mcs-info)] rounded-[3px] text-[9px] px-[4px] py-[1px] font-bold">SCHEDULED</span> :
                                                                plan.status === 'IN_PROGRESS' ? <span className="bg-[var(--mcs-primary-light)] text-[var(--mcs-primary)] border border-[var(--mcs-primary)] rounded-[3px] text-[9px] px-[4px] py-[1px] font-bold">IN_PROGRESS</span> :
                                                                    plan.status === 'COMPLETED' ? <span className="bg-[var(--mcs-success-light)] text-[var(--mcs-success)] border border-[var(--mcs-success)] rounded-[3px] text-[9px] px-[4px] py-[1px] font-bold">COMPLETED</span> :
                                                                        <span className="bg-gray-200 text-gray-600 rounded-[3px] text-[9px] px-[4px] py-[1px] font-bold">DRAFT</span>}
                                                        </td>
                                                        <td className="px-[8px] py-[2px] border-r border-[var(--mcs-border)] text-[var(--mcs-text-secondary)] font-sans truncate max-w-[120px]" title={plan.notes}>
                                                            {plan.notes || '-'}
                                                        </td>
                                                        <td className="px-[8px] py-[2px] border-r border-[var(--mcs-border)] text-right tabular-nums text-[var(--mcs-text-secondary)]">
                                                            {plan.estimated_hours ? `${plan.estimated_hours}h` : '-'}
                                                        </td>
                                                        <td className="px-[8px] py-[2px] text-center">
                                                            <div className="flex items-center justify-center gap-[6px]">
                                                                <button title="Sửa (編集)" className="text-gray-400 hover:text-blue-600 transition-colors" disabled={plan.status === 'IN_PROGRESS' || plan.status === 'COMPLETED'}>
                                                                    <Edit2 size={12} />
                                                                </button>
                                                                <button onClick={() => handleDelete(plan.id)} title="Xóa (削除)" className="text-gray-400 hover:text-red-500 transition-colors" disabled={plan.status === 'IN_PROGRESS' || plan.status === 'COMPLETED' || isPending}>
                                                                    {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
