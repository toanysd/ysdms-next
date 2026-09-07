'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { X, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { MachineSummary } from '../actions';

interface MachineSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: MachineSummary[];
  selectedMachineId: string | null;
  onSelectMachine: (machineId: string) => void;
}

export default function MachineSelectorModal({
  isOpen,
  onClose,
  machines,
  selectedMachineId,
  onSelectMachine,
}: MachineSelectorModalProps) {
  const t = useTranslations('Floor');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="card-flat w-full max-w-4xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderRadius: '12px' }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--tint-teal-bg)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {t('selectMachine')}
            </h2>
            <p className="text-xs text-slate-500">{t('selectMachinePrompt')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary p-2 rounded-full"
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Machine Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {machines.map((m) => {
              const isSelected = m.machine_id === selectedMachineId;
              const hasActive = m.activeSchedule?.status === 'IN_PROGRESS';
              const hasPlanned = m.activeSchedule?.status === 'PLANNED';

              return (
                <button
                  key={m.machine_id}
                  type="button"
                  onClick={() => {
                    onSelectMachine(m.machine_id);
                    onClose();
                  }}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all text-slate-800 ${
                    isSelected
                      ? 'ring-2 shadow-md'
                      : 'hover:border-slate-400 hover:shadow-sm'
                  }`}
                  style={{
                    minHeight: '96px',
                    background: isSelected ? 'var(--tint-teal-bg)' : 'var(--bg-surface)',
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono font-bold text-base text-slate-900">
                      {m.machine_code}
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  <div className="text-sm font-semibold text-slate-700 truncate mb-2">
                    {m.machine_name}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-xs">
                    {hasActive ? (
                      <span className="badge badge--success flex items-center gap-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {t('statusInProgress')}
                        {m.activeSchedule?.product_code && ` (${m.activeSchedule.product_code})`}
                      </span>
                    ) : hasPlanned ? (
                      <span className="badge badge--info flex items-center gap-1">
                        {t('statusPlanned')}
                        {m.activeSchedule?.product_code && ` (${m.activeSchedule.product_code})`}
                      </span>
                    ) : (
                      <span className="badge badge--neutral">待機 (IDLE)</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="flex justify-end px-6 py-3 border-t"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ minHeight: '44px', minWidth: '100px' }}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
