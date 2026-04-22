'use client'
import { useState, useTransition, useEffect } from 'react'
import { upsertMachineModelAction } from '@/app/actions/machine'
import { X, Loader2 } from 'lucide-react'

export default function ModelSpecForm({ onClose, model, types }: { onClose: () => void, model: any, types: any[] }) {
    const [isPending, startTransition] = useTransition()

    // Khởi tạo state
    const [typeId, setTypeId] = useState(model?.machine_type_id || types[0]?.id || '')
    const [specData, setSpecData] = useState<Record<string, any>>(model?.specs || {})

    // Tìm schema của type đang chọn
    const activeType = types.find(t => t.id === typeId)
    const specFields = activeType?.spec_schema?.fields || []

    // Thay đổi Type sẽ reset spec (nếu tạo mới)
    useEffect(() => {
        if (!model && activeType && activeType.id !== typeId) {
            setSpecData({}) // clear if switching type maliciously
        }
    }, [typeId, activeType, model])

    const handleSpecChange = (key: string, value: string, type: string) => {
        let parsed: any = value
        if (type === 'number') parsed = Number(value)
        if (type === 'boolean') parsed = value === 'true'

        if (type === 'array') {
            parsed = value.split(',').map((s: string) => s.trim())
        }

        setSpecData(prev => ({ ...prev, [key]: parsed }))
    }

    const submitForm = (formData: FormData) => {
        const payload = new FormData()
        if (model?.id) payload.append('id', model.id)
        payload.append('machine_type_id', typeId)
        payload.append('model_code', formData.get('model_code') as string)
        payload.append('model_name', formData.get('model_name') as string)
        payload.append('manufacturer', formData.get('manufacturer') as string)
        payload.append('specs', JSON.stringify(specData))

        startTransition(async () => {
            try {
                await upsertMachineModelAction(payload)
                onClose()
            } catch (e: any) {
                alert('モデル保存エラー (Lỗi lưu Model): ' + e.message)
            }
        })
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-[16px] backdrop-blur-[2px]">
            <div className="bg-[var(--mcs-surface)] border border-[var(--mcs-border-strong)] rounded-[8px] shadow-[var(--mcs-shadow-lg)] w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-[12px] border-b border-[var(--mcs-border)] bg-[var(--mcs-surface-hover)] shrink-0">
                    <h3 className="text-[14px] font-bold text-[var(--mcs-text)] flex items-center">
                        {model ? '設備モデル編集 (Sửa Dòng Máy)' : '設備モデル追加 (Thêm Dòng Máy)'}
                    </h3>
                    <button type="button" onClick={onClose} className="p-[4px] text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-3)] rounded transition-colors"><X size={16} /></button>
                </div>

                <div className="overflow-auto flex-1 p-[20px]">
                    <form action={submitForm} id="model-form" className="space-y-[20px]">
                        {/* BASIC INFO */}
                        <div className="grid grid-cols-2 gap-[16px]">
                            <div className="flex flex-col gap-[6px] col-span-2 md:col-span-1">
                                <label className="text-[11px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">設備種類 <span className="font-normal text-[9px]">(Machine Type)</span></label>
                                <select
                                    value={typeId}
                                    onChange={(e) => setTypeId(e.target.value)}
                                    disabled={!!model} // disable change type if edit
                                    className="bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[6px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[32px] disabled:opacity-60"
                                    required
                                >
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name_vi} ({t.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-[6px] col-span-2 md:col-span-1">
                                <label className="text-[11px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">モデルコード <span className="font-normal text-[9px]">(Model Code) *</span></label>
                                <input name="model_code" defaultValue={model?.model_code} required placeholder="VD: RV74c" className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[6px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] placeholder-[var(--mcs-text-muted)] h-[32px]" />
                            </div>

                            <div className="flex flex-col gap-[6px] col-span-2 md:col-span-1">
                                <label className="text-[11px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">メーカー <span className="font-normal text-[9px]">(Hãng sản xuất)</span></label>
                                <input name="manufacturer" defaultValue={model?.manufacturer} placeholder="VD: ILLIG" className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[6px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] placeholder-[var(--mcs-text-muted)] h-[32px]" />
                            </div>

                            <div className="flex flex-col gap-[6px] col-span-2 md:col-span-1">
                                <label className="text-[11px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">モデル名 <span className="font-normal text-[9px]">(Tên hiển thị)</span></label>
                                <input name="model_name" defaultValue={model?.model_name} placeholder="Tùy chọn..." className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[6px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] placeholder-[var(--mcs-text-muted)] h-[32px]" />
                            </div>
                        </div>

                        {/* DYNAMIC SPECS BẢNG JSON */}
                        {specFields.length > 0 && (
                            <div className="border border-[var(--mcs-border-strong)] rounded-[6px] bg-[var(--mcs-surface-2)] overflow-hidden">
                                <div className="bg-[var(--mcs-surface-3)] px-[12px] py-[8px] border-b border-[var(--mcs-border)]">
                                    <h4 className="text-[12px] font-bold text-[var(--mcs-primary)] uppercase tracking-wider">技術仕様設定 <span className="font-normal text-[10px]">(Cấu hình Specs)</span></h4>
                                </div>
                                <div className="p-[16px] grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                    {specFields.map((field: any) => (
                                        <div key={field.key} className="flex flex-col gap-[4px]">
                                            <label className="text-[11px] text-[var(--mcs-text)] font-semibold flex justify-between">
                                                <span>{field.label_jp} <span className="text-[var(--mcs-text-muted)] font-normal ml-1">({field.label_vi})</span></span>
                                                {field.unit && <span className="text-[var(--mcs-text-muted)] font-mono">[{field.unit}]</span>}
                                            </label>
                                            {field.type === 'boolean' ? (
                                                <select
                                                    value={specData[field.key] !== undefined ? String(specData[field.key]) : ''}
                                                    onChange={e => handleSpecChange(field.key, e.target.value, field.type)}
                                                    className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[12px] h-[30px] outline-none focus:border-[var(--mcs-primary)]"
                                                >
                                                    <option value="">(未設定)</option>
                                                    <option value="true">有 (Có)</option>
                                                    <option value="false">無 (Không)</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type === 'number' ? 'number' : 'text'}
                                                    value={specData[field.key] !== undefined ? (field.type === 'array' ? specData[field.key].join(', ') : specData[field.key]) : ''}
                                                    onChange={e => handleSpecChange(field.key, e.target.value, field.type)}
                                                    placeholder={field.type === 'array' ? 'VD: PP, PS, PET' : ''}
                                                    className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[4px] text-[12px] tabular-nums h-[30px] outline-none focus:border-[var(--mcs-primary)] w-full"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-[16px] border-t border-[var(--mcs-border)] bg-[var(--mcs-surface)] shrink-0 flex justify-end gap-[12px]">
                    <button type="button" onClick={onClose} className="px-[16px] py-[6px] text-[12px] font-bold text-[var(--mcs-text-secondary)] hover:bg-[var(--mcs-surface-3)] rounded transition-colors border border-transparent hover:border-[var(--mcs-border)]">キャンセル (Hủy)</button>
                    <button type="submit" form="model-form" disabled={isPending} className="bg-[var(--mcs-warning)] hover:bg-[var(--mcs-warning-hover)] text-black font-bold text-[12px] px-[20px] py-[6px] rounded-[6px] transition-colors flex items-center gap-[8px] shadow-sm">
                        {isPending ? <Loader2 size={16} className="animate-spin text-black" /> : null}
                        登録 (LƯU)
                    </button>
                </div>
            </div>
        </div>
    )
}
