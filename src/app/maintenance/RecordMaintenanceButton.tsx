'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { addMaintenanceLog } from '@/app/actions/maintenance'

export default function RecordMaintenanceButton({ physicalId, totalShots }: { physicalId: string, totalShots: number }) {
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const [actionLog, setActionLog] = useState('Bảo trì định kỳ, vệ sinh, tra dầu khuôn.')

    const handleLog = () => {
        startTransition(async () => {
            try {
                await addMaintenanceLog({
                    mold_physical_id: physicalId,
                    maintenance_date: new Date().toISOString(), // Today
                    performed_by: 'Bảo trì hệ thống',
                    shots_at_maintenance: totalShots, // Đưa số shot hiện tại vào log trước khi reset
                    maintenance_type: 'routine',
                    action_taken: actionLog,
                    cost: 0
                })
                setIsOpen(false)
            } catch (err: any) {
                alert('Lỗi: ' + err.message)
            }
        })
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold px-2 py-1 flex items-center gap-1 text-[10px] rounded transition-colors"
            >
                <CheckCircle size={14} /> Ghi nhận Bảo trì
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-[400px] overflow-hidden flex flex-col font-sans">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle size={18} className="text-blue-600" />
                                Báo cáo Bảo trì Khuôn
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Nội dung thực hiện <span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full text-[12px] p-2 border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    rows={3}
                                    value={actionLog}
                                    onChange={(e) => setActionLog(e.target.value)}
                                />
                            </div>
                            <div className="bg-yellow-50 text-yellow-800 p-2 text-[10px] rounded border border-yellow-200">
                                <b>Lưu ý:</b> Ghi nhận hệ thống sẽ "reset (clear)" số đập về 0 để đóng vai trò trip-meter đếm theo chu kỳ mới.
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-200 rounded"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleLog}
                                disabled={isPending || !actionLog.trim()}
                                className="px-3 py-1.5 text-[12px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Đóng Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
