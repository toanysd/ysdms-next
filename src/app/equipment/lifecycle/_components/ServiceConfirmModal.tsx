'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Wrench, CheckCircle } from 'lucide-react';
import { LifecycleItem } from '../actions';

interface ServiceConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LifecycleItem | null;
  onConfirmService: (equipmentId: string, totalShots: number) => Promise<void>;
}

export default function ServiceConfirmModal({
  isOpen,
  onClose,
  item,
  onConfirmService,
}: ServiceConfirmModalProps) {
  const t = useTranslations('Equipment.Lifecycle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmService(item.equipment_id, item.total_shots);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="card-flat w-full max-w-lg flex flex-col shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderRadius: '12px' }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--tint-teal-bg)' }}
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-base font-bold text-slate-900">
              {t('serviceModalTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-secondary p-1.5 rounded-full"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-xs text-slate-600">
            {t('serviceModalDesc')}
          </p>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{t('colCode')}:</span>
              <span className="font-mono font-bold text-slate-900">
                {item.display_name || item.equipment_code}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{t('colType')}:</span>
              <span className="badge badge--neutral text-xs font-mono">{item.equipment_type}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{t('colTotalShots')}:</span>
              <span className="font-mono font-bold text-slate-900">
                {item.total_shots.toLocaleString()} shots
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{t('colShotsSinceService')}:</span>
              <span className="font-mono font-bold text-amber-600">
                {item.current_shots_since_service.toLocaleString()} shots
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{t('colThreshold')}:</span>
              <span className="font-mono text-slate-700">
                {item.maintenance_shot_threshold?.toLocaleString()} shots
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 italic bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
            ※ 実行後、この設備の「保守後ショット数」は 0 にリセットされ、状態は「正常 (NORMAL)」に戻ります。
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-3 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-secondary text-sm"
          >
            {t('btnServiceComplete') ? 'キャンセル' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="btn btn-primary flex items-center gap-2 text-sm font-bold"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? '処理中...' : t('confirmService')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
