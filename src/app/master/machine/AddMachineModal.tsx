'use client'

import { useTransition } from 'react'
import { addMachineAction } from '@/app/actions/machine'
import { X, Loader2 } from 'lucide-react'

export default function AddMachineModal({ onClose, models }: { onClose: () => void, models: any[] }) {
    const [isPending, startTransition] = useTransition()

    const submitForm = (formData: FormData) => {
        startTransition(async () => {
            try {
                await addMachineAction(formData)
                onClose()
            } catch (e) {
                alert('Lỗi khi thêm máy. Vui lòng thử lại.')
            }
        })
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-[16px] backdrop-blur-[2px]">
            <div className="bg-[var(--mcs-surface)] border border-[var(--mcs-border-strong)] rounded-[8px] shadow-[var(--mcs-shadow-lg)] w-full max-w-sm overflow-hidden animate-slide-up">
                <div className="flex justify-between items-center p-[12px] border-b border-[var(--mcs-border)] bg-[var(--mcs-surface-hover)]">
                    <h3 className="text-[14px] font-bold text-[var(--mcs-text)] flex items-center">
                        機械追加 <span className="text-[10px] uppercase text-[var(--mcs-primary)] ml-[8px] bg-[var(--mcs-primary-light)] px-[6px] py-[2px] rounded">Thêm Máy</span>
                    </h3>
                    <button onClick={onClose} className="p-[4px] text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-3)] rounded transition-colors"><X size={16} /></button>
                </div>

                <form action={submitForm} className="p-[16px] space-y-[16px]">
                    <div className="flex flex-col gap-[6px]">
                        <label className="text-[11px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">機番 / 設備名 <span className="font-normal text-[9px]">(Mã máy / Tên hiển thị) *</span></label>
                        <input name="code" required autoFocus placeholder="VD: P-03" className="bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[6px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] placeholder-[var(--mcs-text-muted)] h-[32px] transition-colors" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                        <label className="text-[11px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">設備モデル <span className="font-normal text-[9px]">(Dòng máy) *</span></label>
                        <select name="machine_model_id" required className="bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[6px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[32px] transition-colors">
                            <option value="">-- モデルを選択 (Chọn Model) --</option>
                            {models.map(m => (
                                <option key={m.id} value={m.id}>{m.model_code} - {m.model_name || m.manufacturer} ({m.machine_type?.name_jp})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                        <label className="text-[11px] text-[var(--mcs-text-secondary)] uppercase tracking-wider font-bold">初期状態 <span className="font-normal text-[9px]">(Trạng thái)</span></label>
                        <select name="status" defaultValue="IDLE" className="bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] rounded-[4px] px-[8px] py-[6px] text-[13px] text-[var(--mcs-text)] outline-none focus:border-[var(--mcs-primary)] h-[32px] transition-colors">
                            <option value="IDLE">IDLE (待機中 / Sẵn sàng)</option>
                            <option value="MAINTENANCE">MAINTENANCE (メンテナンス中 / Bảo trì)</option>
                        </select>
                    </div>

                    <div className="pt-[8px]">
                        <button type="submit" disabled={isPending} className="w-full bg-[var(--mcs-primary)] hover:bg-[var(--mcs-primary-hover)] text-white font-bold text-[13px] h-[36px] rounded-[6px] transition-colors flex justify-center items-center gap-[8px] shadow-sm">
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                            登録 (LƯU HỆ THỐNG)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
