'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle, Loader2 } from 'lucide-react'
import { addMaintenanceLog } from '@/app/actions/maintenance'

export default function RecordMaintenanceButton({ physicalId, totalShots }: { physicalId: string, totalShots: number }) {
    const t = useTranslations('Maintenance')
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const [actionLog, setActionLog] = useState('')

    const handleLog = () => {
        startTransition(async () => {
            try {
                await addMaintenanceLog({
                    mold_physical_id: physicalId,
                    maintenance_date: new Date().toISOString(),
                    performed_by: 'Maintenance Team',
                    shots_at_maintenance: totalShots,
                    maintenance_type: 'routine',
                    action_taken: actionLog || t('actionContent'),
                    cost: 0
                })
                setIsOpen(false)
            } catch (err: any) {
                alert('Error: ' + err.message)
            }
        })
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-secondary px-2 py-1 flex items-center gap-1 text-[11px] font-bold"
            >
                <CheckCircle size={14} /> {t('maintenanceRecordBtn')}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="card-flat bg-white rounded-lg shadow-xl w-[400px] overflow-hidden flex flex-col font-sans">
                        <div className="p-4 border-b border-[var(--mcs-border)] bg-[var(--tint-teal-bg)] flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-[14px]" style={{ color: 'var(--text-primary)' }}>
                                <CheckCircle size={18} style={{ color: 'var(--accent)' }} />
                                {t('recordModalTitle')}
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="font-bold hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>×</button>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div>
                                <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                                    {t('actionContent')} <span style={{ color: 'var(--status-error)' }}>*</span>
                                </label>
                                <textarea
                                    className="form-textarea w-full text-[13px] p-2"
                                    rows={3}
                                    placeholder={t('actionContent')}
                                    value={actionLog}
                                    onChange={(e) => setActionLog(e.target.value)}
                                />
                            </div>
                            <div className="card-flat bg-[var(--tint-orange-bg)] p-2 text-[11px] rounded border border-[var(--mcs-border)]" style={{ color: 'var(--text-primary)' }}>
                                {t('resetWarning')}
                            </div>
                        </div>
                        <div className="p-3 bg-[var(--tint-teal-bg)]/50 border-t border-[var(--mcs-border)] flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-secondary px-3 py-1.5 text-[12px] font-bold"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleLog}
                                disabled={isPending || !actionLog.trim()}
                                className="btn btn-primary px-3 py-1.5 text-[12px] font-bold flex items-center gap-1 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} {t('saveRecord')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

