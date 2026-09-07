'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Search, Disc, CheckCircle2, Circle, QrCode } from 'lucide-react';
import { FloorRollItem, searchFloorRolls } from '../actions';

interface RollMountModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  currentRollId?: string | null;
  onConfirmMount: (rollId: string) => Promise<void>;
}

export default function RollMountModal({
  isOpen,
  onClose,
  scheduleId,
  currentRollId,
  onConfirmMount,
}: RollMountModalProps) {
  const t = useTranslations('Floor');

  const [searchQuery, setSearchQuery] = useState('');
  const [rolls, setRolls] = useState<FloorRollItem[]>([]);
  const [selectedRollId, setSelectedRollId] = useState<string>(currentRollId || '');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRolls('');
      setSelectedRollId(currentRollId || '');
    }
  }, [isOpen, currentRollId]);

  const loadRolls = async (q: string) => {
    setLoading(true);
    try {
      const data = await searchFloorRolls(q);
      setRolls(data);
      if (!selectedRollId && data.length > 0) {
        setSelectedRollId(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    loadRolls(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRollId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirmMount(selectedRollId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="card-flat w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderRadius: '12px' }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--tint-teal-bg)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {t('selectRoll')}
            </h2>
            <p className="text-xs text-slate-500">{t('confirmMountRoll')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-secondary p-2 rounded-full"
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Search Bar / Barcode Input */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('scanOrSearchRoll')}
              className="form-input w-full pl-11 pr-10 text-base"
              style={{ minHeight: '48px' }}
              autoFocus
            />
            <QrCode className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Rolls List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 flex flex-col gap-2">
          {loading ? (
            <div className="text-center py-8 text-sm text-slate-500">読み込み中...</div>
          ) : rolls.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">該当する原反がありません</div>
          ) : (
            rolls.map((r) => {
              const isSelected = r.id === selectedRollId;
              const isCurrent = r.id === currentRollId;

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRollId(r.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'ring-2 shadow-sm'
                      : 'hover:border-slate-300'
                  }`}
                  style={{
                    background: isSelected ? 'var(--tint-teal-bg)' : 'var(--bg-surface)',
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                    minHeight: '68px',
                  }}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--accent)' }} />
                    ) : (
                      <Circle className="w-5 h-5 shrink-0 text-slate-300" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {r.roll_barcode}
                        </span>
                        {isCurrent && (
                          <span className="badge badge--info text-[10px]">現在セット中</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 truncate max-w-sm mt-0.5">
                        {r.plastic_master?.plastic_code || '材料規格なし'}
                        {r.plastic_master?.thickness_mm && ` (${r.plastic_master.thickness_mm}mm × ${r.plastic_master.width_mm || '—'}mm)`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-base text-slate-900">
                      {r.current_length_m?.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">m</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-secondary"
            style={{ minHeight: '48px', minWidth: '100px' }}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedRollId || isSubmitting}
            className="btn btn-primary flex items-center justify-center gap-2"
            style={{ minHeight: '48px', minWidth: '160px', fontSize: '15px', fontWeight: 700 }}
          >
            <Disc className="w-4 h-4" />
            <span>{isSubmitting ? t('mounting') : t('mountSuccess')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
