'use client'

import { useState } from 'react'
import AddMachineModal from './AddMachineModal'

export default function MachineTable({ initialData, models }: { initialData: any[], models: any[] }) {
    const [search, setSearch] = useState('')
    const [isAddOpen, setAddOpen] = useState(false)

    // KPI calculation
    const active = initialData.filter(m => m.status === 'active').length
    const maint = initialData.filter(m => m.status === 'maintenance').length

    const filteredData = initialData.filter(m => {
        const name = m.machine_name || ''
        const code = m.internal_code || ''
        const type = m.type_name || m.type_code || ''
        const searchLower = search.toLowerCase()
        return name.toLowerCase().includes(searchLower) ||
            code.toLowerCase().includes(searchLower) ||
            type.toLowerCase().includes(searchLower)
    })

    return (
        <div className="flex flex-col gap-[16px] h-full">
            {isAddOpen && <AddMachineModal onClose={() => setAddOpen(false)} models={models} />}
            <div className="flex justify-between items-center gap-[16px]">
                <div className="flex gap-[12px]">
                    <button onClick={() => setAddOpen(true)} className="bg-[var(--mcs-primary)] hover:bg-[var(--mcs-primary-hover)] text-white text-xs font-bold px-[12px] py-[6px] h-[32px] rounded transition-colors shadow-sm flex items-center justify-center">
                        + 設備追加 <span className="text-[10px] ml-1 font-normal uppercase">(Thêm máy)</span>
                    </button>
                    <input
                        type="text"
                        placeholder="設備検索... (Tìm máy)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] text-[var(--mcs-text)] text-[12px] rounded h-[32px] px-[12px] w-[200px] outline-none focus:border-[var(--mcs-primary)]"
                    />
                </div>

                {/* KPI Grid */}
                <div className="flex gap-[8px]">
                    <div className="bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] border-t-[3px] border-t-[var(--mcs-info)] rounded-[8px] px-[14px] py-[10px] min-w-[100px] shadow-sm">
                        <div className="text-[10px] font-bold text-[var(--mcs-text-secondary)] uppercase">稼働可能 (Sẵn sàng)</div>
                        <div className="text-[24px] font-bold text-[var(--mcs-info)] tabular-nums leading-none mt-[4px]">{active}</div>
                    </div>
                    <div className="bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] border-t-[3px] border-t-[var(--mcs-warning)] rounded-[8px] px-[14px] py-[10px] min-w-[100px] shadow-sm">
                        <div className="text-[10px] font-bold text-[var(--mcs-text-secondary)] uppercase">メンテナンス (Bảo trì)</div>
                        <div className="text-[24px] font-bold text-[var(--mcs-warning)] tabular-nums leading-none mt-[4px]">{maint}</div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[var(--mcs-surface)] rounded border border-[var(--mcs-border)] shadow-sm flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[var(--mcs-surface-3)] z-10 shadow-sm">
                        <tr className="text-[11px] text-[var(--mcs-text)] border-b-2 border-[var(--mcs-border-strong)]">
                            <th className="py-[8px] px-[12px] font-bold text-center w-[50px]">Status</th>
                            <th className="py-[8px] px-[12px] font-bold w-[120px]">Code <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] block mt-[2px]">機番</span></th>
                            <th className="py-[8px] px-[12px] font-bold w-[200px]">Name <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] block mt-[2px]">名前</span></th>
                            <th className="py-[8px] px-[12px] font-bold">Type <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] block mt-[2px]">種類</span></th>
                            <th className="py-[8px] px-[12px] font-bold">Details <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] block mt-[2px]">詳細</span></th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] text-[var(--mcs-text)]">
                        {filteredData.map((m: any, index: number) => (
                            <tr key={m.instance_id || m.internal_code} className={`border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] transition-colors h-[44px] ${index % 2 === 0 ? 'bg-[var(--mcs-surface)]' : 'bg-[var(--mcs-surface-2)]'}`}>
                                <td className="px-[12px] py-[8px] text-center">
                                    {m.status === 'active' && <div className="w-[10px] h-[10px] rounded-full bg-[var(--mcs-info)] mx-auto shadow-[0_0_6px_var(--mcs-info)]" title="Sẵn sàng"></div>}
                                    {m.status === 'maintenance' && <div className="w-3 h-3 rounded-sm bg-[var(--mcs-warning)] mx-auto font-bold text-white text-[9px] flex items-center justify-center shadow-sm" title="Bảo trì">M</div>}
                                </td>
                                <td className="px-[12px] py-[8px] font-mono font-bold text-[13px] text-[var(--mcs-text)]">{m.internal_code}</td>
                                <td className="px-[12px] py-[8px] font-bold text-[var(--mcs-primary)]">{m.machine_name}</td>
                                <td className="px-[12px] py-[8px] text-[var(--mcs-text-secondary)]">
                                    <span className="bg-[var(--mcs-surface-3)] px-[6px] py-[2px] rounded border border-[var(--mcs-border)] text-[10px] font-bold uppercase">{m.type_name_jp || m.type_code}</span>
                                </td>
                                <td className="px-[12px] py-[8px]">
                                    <div className="flex gap-[4px] flex-wrap">
                                        {m.effective_specs && Object.keys(m.effective_specs).length > 0 ? (
                                            Object.entries(m.effective_specs).map(([k, v]) => (
                                                <div key={k} className="bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] text-[10px] px-[4px] py-[2px] rounded flex gap-[4px]">
                                                    <span className="text-[var(--mcs-text-muted)] font-bold">{k}:</span>
                                                    <span className="text-[var(--mcs-text-secondary)] font-mono">{String(v)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-[var(--mcs-text-muted)] italic">未設定 (Chưa cấu hình)</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-[40px] text-[var(--mcs-text-muted)] font-bold text-[13px]">設備が見つかりません。(Không tìm thấy thiết bị nào.)</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
