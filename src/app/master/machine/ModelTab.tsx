'use client'
import { useState } from 'react'
import ModelSpecForm from './ModelSpecForm'

export default function ModelTab({ models, types }: { models: any[], types: any[] }) {
    const [search, setSearch] = useState('')
    const [isFormOpen, setFormOpen] = useState(false)
    const [editingModel, setEditingModel] = useState<any>(null)

    const filteredModels = models.filter(m =>
        m.model_code?.toLowerCase().includes(search.toLowerCase()) ||
        m.model_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.manufacturer?.toLowerCase().includes(search.toLowerCase())
    )

    const openEdit = (model: any) => {
        setEditingModel(model)
        setFormOpen(true)
    }

    const openAdd = () => {
        setEditingModel(null)
        setFormOpen(true)
    }

    return (
        <div className="flex flex-col gap-[16px] h-full">
            {isFormOpen && <ModelSpecForm onClose={() => setFormOpen(false)} model={editingModel} types={types} />}
            <div className="flex justify-between items-center gap-[16px]">
                <div className="flex gap-[12px]">
                    <button onClick={openAdd} className="bg-[var(--mcs-warning)] hover:bg-[var(--mcs-warning-hover)] text-[var(--mcs-text)] text-xs font-bold px-[12px] py-[6px] h-[32px] rounded transition-colors shadow-sm flex items-center justify-center border border-[var(--mcs-warning)] hover:border-transparent">
                        + 設備モデル追加 <span className="text-[10px] ml-1 font-normal uppercase">(Thêm Dòng)</span>
                    </button>
                    <input
                        type="text"
                        placeholder="設備モデル検索... (Tìm kiếm)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] text-[var(--mcs-text)] text-[12px] rounded h-[32px] px-[12px] w-[240px] outline-none focus:border-[var(--mcs-primary)]"
                    />
                </div>
            </div>

            <div className="w-full bg-[var(--mcs-surface)] rounded border border-[var(--mcs-border)] shadow-sm flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[var(--mcs-surface-3)] z-10 shadow-sm">
                        <tr className="text-[11px] text-[var(--mcs-text)] border-b-2 border-[var(--mcs-border-strong)]">
                            <th className="py-[8px] px-[12px] font-bold w-[120px]">Model Code <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] mt-[2px] block">モデルコード</span></th>
                            <th className="py-[8px] px-[12px] font-bold w-[130px]">Manufacturer <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] mt-[2px] block">メーカー</span></th>
                            <th className="py-[8px] px-[12px] font-bold min-w-[200px]">Type <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] mt-[2px] block">設備種類</span></th>
                            <th className="py-[8px] px-[12px] font-bold max-w-[400px]">Specs <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] mt-[2px] block">技術仕様</span></th>
                            <th className="py-[8px] px-[12px] font-bold text-right w-[80px]">Action <span className="text-[10px] font-normal text-[var(--mcs-text-muted)] mt-[2px] block">操作</span></th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] text-[var(--mcs-text)]">
                        {filteredModels.map((m: any, index: number) => (
                            <tr key={m.id} className={`border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] transition-colors ${index % 2 === 0 ? 'bg-[var(--mcs-surface)]' : 'bg-[var(--mcs-surface-2)]'} h-[48px]`}>
                                <td className="px-[12px] py-[8px] font-mono font-bold text-[13px] text-[var(--mcs-primary)]">{m.model_code}</td>
                                <td className="px-[12px] py-[8px] text-[var(--mcs-text)]">{m.manufacturer || '-'}</td>
                                <td className="px-[12px] py-[8px] text-[var(--mcs-text)]">
                                    <div className="font-bold text-[12px]">{m.machine_type?.name_vi}</div>
                                    <div className="text-[10px] text-[var(--mcs-text-muted)] font-mono">{m.machine_type?.code}</div>
                                </td>
                                <td className="px-[12px] py-[8px] max-w-[400px]">
                                    <div className="flex gap-[4px] flex-wrap max-h-[100px] overflow-y-auto">
                                        {m.specs && Object.keys(m.specs).length > 0 ? (
                                            Object.entries(m.specs).map(([k, v]) => (
                                                <div key={k} className="bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] text-[10px] px-[6px] py-[2px] rounded flex gap-[6px]">
                                                    <span className="text-[var(--mcs-text-muted)] font-bold">{k}:</span>
                                                    <span className="text-[var(--mcs-text-secondary)] font-mono">{String(v)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-[var(--mcs-text-muted)] italic">未設定 (Chưa cấu hình)</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-[12px] py-[8px] text-right">
                                    <button onClick={() => openEdit(m)} className="text-[var(--mcs-info)] hover:text-[var(--mcs-info-hover)] hover:underline font-bold text-[11px]">編集 (Sửa)</button>
                                </td>
                            </tr>
                        ))}
                        {filteredModels.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-[40px] text-[var(--mcs-text-muted)] font-bold text-[12px]">設備モデルが見つかりません。(Hệ thống chưa có Machine Model nào!)</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
