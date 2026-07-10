'use client'

export default function DayPlanGrid({ plans, machines, dateStr }: { plans: any[], machines: any[], dateStr: string }) {
    if (plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--mcs-text-muted)] h-full">
                <p className="text-[14px] tracking-widest uppercase font-bold text-[var(--mcs-text-secondary)]">No plans for {dateStr}</p>
                <p className="text-[11px] mt-1">Dữ liệu trống</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-auto bg-[var(--mcs-surface)]">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[var(--mcs-surface-3)] z-10 shadow-sm">
                    <tr className="text-[11px] text-[var(--mcs-text)] border-b-2 border-[var(--mcs-border-strong)]">
                        <th className="py-[8px] px-3 font-bold min-w-[80px]">機番 <span className="block text-[10px] font-normal text-[var(--mcs-text-muted)] mt-0.5">MÁY</span></th>
                        <th className="py-[8px] px-3 font-bold min-w-[140px]">品番 <span className="block text-[10px] font-normal text-[var(--mcs-text-muted)] mt-0.5">MÃ SP</span></th>
                        <th className="py-[8px] px-3 font-bold text-right min-w-[80px]">数量 <span className="block text-[10px] font-normal text-[var(--mcs-text-muted)] mt-0.5">SL</span></th>
                        <th className="py-[8px] px-3 font-bold text-center min-w-[70px]">シフト <span className="block text-[10px] font-normal text-[var(--mcs-text-muted)] mt-0.5">CA</span></th>
                        <th className="py-[8px] px-3 font-bold min-w-[110px]">型 <span className="block text-[10px] font-normal text-[var(--mcs-text-muted)] mt-0.5">KHUÔN</span></th>
                        <th className="py-[8px] px-3 font-bold min-w-[100px]">担当者 <span className="block text-[10px] font-normal text-[var(--mcs-text-muted)] mt-0.5">THỢ</span></th>
                        <th className="py-[8px] px-3 font-bold text-right min-w-[70px]">時間 <span className="block text-[10px] font-normal text-[var(--mcs-text-muted)] mt-0.5">GIỜ</span></th>
                    </tr>
                </thead>
                <tbody className="text-[12px] text-[var(--mcs-text)]">
                    {plans.map((plan, index) => (
                        <tr key={plan.id} className={`${index % 2 === 0 ? 'bg-[var(--mcs-surface)]' : 'bg-[var(--mcs-surface-2)]'} border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] transition-colors h-[40px] group`}>
                            <td className="px-3 py-[4px] font-mono font-bold text-[var(--mcs-primary)] text-[13px]">{plan.machine_instance?.internal_code}</td>
                            <td className="px-3 py-[4px] font-mono font-bold text-[var(--mcs-text)] truncate max-w-[180px]" title={plan.order_items?.product_pn_raw}>
                                {plan.order_items?.product_pn_raw}
                            </td>
                            <td className="px-3 py-[4px] font-mono tabular-nums font-bold text-right text-[var(--mcs-group-1)] bg-[var(--mcs-primary-light)]/40 shadow-sm border-l border-r border-[var(--mcs-primary-light)]">
                                {plan.planned_quantity?.toLocaleString()}
                            </td>
                            <td className="px-3 py-[4px] text-center">
                                {plan.shift === 'DAY' ? (
                                    <span className="bg-[var(--mcs-info-light)] border border-[var(--mcs-info)]/30 text-[var(--mcs-info-text)] font-bold text-[10px] px-[6px] py-[2px] flex mx-auto w-max rounded-sm shadow-sm">DAY</span>
                                ) : plan.shift === 'NIGHT' ? (
                                    <span className="bg-[#f3e5f5] border border-[#8e44ad]/30 text-[#4a235a] font-bold text-[10px] px-[6px] py-[2px] flex mx-auto w-max rounded-sm shadow-sm">NIGHT</span>
                                ) : <span className="text-[var(--mcs-text-faint)]">-</span>}
                            </td>
                            <td className="px-3 py-[4px] text-[var(--mcs-text-secondary)] font-mono text-[11px] truncate max-w-[130px]" title={plan.mold_physical?.physical_code}>
                                {plan.mold_physical?.physical_code || '-'}
                            </td>
                            <td className="px-3 py-[4px] text-[var(--mcs-text-secondary)]">{plan.operator_name || '-'}</td>
                            <td className="px-3 py-[4px] text-right font-mono tabular-nums text-[var(--mcs-text-secondary)]">
                                {plan.estimated_hours ? <span className="bg-[var(--mcs-surface-3)] px-[4px] py-[2px] rounded border border-[var(--mcs-border)]">{plan.estimated_hours}h</span> : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
