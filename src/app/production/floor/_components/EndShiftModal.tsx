'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, CheckCircle, Calculator, ChevronDown, ChevronUp, Delete } from 'lucide-react';
import { FloorScheduleItem } from '../actions';

interface EndShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: FloorScheduleItem | null;
  onConfirmEnd: (params: {
    scheduleId: string;
    actualQuantity: number;
    consumedMeters: number;
    notes?: string;
    ng: {
      qty_ng_a: number;
      qty_ng_b: number;
      qty_ng_c: number;
      qty_ng_d: number;
      qty_ng_e: number;
      qty_ng_f: number;
      qty_ng_g: number;
    };
    shotCount?: number;
  }) => Promise<void>;
}

export default function EndShiftModal({
  isOpen,
  onClose,
  schedule,
  onConfirmEnd,
}: EndShiftModalProps) {
  const t = useTranslations('Floor');
  const tDaily = useTranslations('DailyLogs');

  const [qtyString, setQtyString] = useState('');
  const [consumedMeters, setConsumedMeters] = useState<string>('0');
  const [showNgBreakdown, setShowNgBreakdown] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ng, setNg] = useState({
    qty_ng_a: 0,
    qty_ng_b: 0,
    qty_ng_c: 0,
    qty_ng_d: 0,
    qty_ng_e: 0,
    qty_ng_f: 0,
    qty_ng_g: 0,
  });

  useEffect(() => {
    if (isOpen && schedule) {
      const initialQty = schedule.planned_quantity ? String(schedule.planned_quantity) : '';
      setQtyString(initialQty);
      const feedMm = schedule.machines?.feed_length_mm || 0;
      if (feedMm > 0 && schedule.planned_quantity) {
        const estM = ((schedule.planned_quantity * feedMm) / 1000).toFixed(1);
        setConsumedMeters(estM);
      } else {
        setConsumedMeters('0');
      }
      setNotes('');
      setNg({
        qty_ng_a: 0,
        qty_ng_b: 0,
        qty_ng_c: 0,
        qty_ng_d: 0,
        qty_ng_e: 0,
        qty_ng_f: 0,
        qty_ng_g: 0,
      });
    }
  }, [isOpen, schedule]);

  if (!isOpen || !schedule) return null;

  const actualQtyNum = parseInt(qtyString || '0', 10);
  const feedLengthMm = schedule.machines?.feed_length_mm || 0;
  const suggestedMeters =
    feedLengthMm > 0 ? ((actualQtyNum * feedLengthMm) / 1000).toFixed(1) : '0';

  // Numpad handler
  const handleNumpadPress = (val: string) => {
    if (val === 'CLEAR') {
      setQtyString('');
      if (feedLengthMm > 0) setConsumedMeters('0');
      return;
    }
    if (val === 'BACKSPACE') {
      const updated = qtyString.slice(0, -1);
      setQtyString(updated);
      const num = parseInt(updated || '0', 10);
      if (feedLengthMm > 0) {
        setConsumedMeters(((num * feedLengthMm) / 1000).toFixed(1));
      }
      return;
    }
    // Append digit (max 7 digits)
    if (qtyString.length >= 7) return;
    const updated = qtyString + val;
    setQtyString(updated);
    const num = parseInt(updated || '0', 10);
    if (feedLengthMm > 0) {
      setConsumedMeters(((num * feedLengthMm) / 1000).toFixed(1));
    }
  };

  const handleNgChange = (key: keyof typeof ng, val: number) => {
    setNg((prev) => ({ ...prev, [key]: Math.max(0, val) }));
  };

  const totalNg = Object.values(ng).reduce((acc, v) => acc + v, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actualQtyNum <= 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirmEnd({
        scheduleId: schedule.schedule_id,
        actualQuantity: actualQtyNum,
        consumedMeters: parseFloat(consumedMeters || '0'),
        notes: notes || undefined,
        ng,
        shotCount: actualQtyNum,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const ngFields: { key: keyof typeof ng; labelJA: string }[] = [
    { key: 'qty_ng_a', labelJA: tDaily('qty_ng_a') },
    { key: 'qty_ng_b', labelJA: tDaily('qty_ng_b') },
    { key: 'qty_ng_c', labelJA: tDaily('qty_ng_c') },
    { key: 'qty_ng_d', labelJA: tDaily('qty_ng_d') },
    { key: 'qty_ng_e', labelJA: tDaily('qty_ng_e') },
    { key: 'qty_ng_f', labelJA: tDaily('qty_ng_f') },
    { key: 'qty_ng_g', labelJA: tDaily('qty_ng_g') },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="card-flat w-full max-w-3xl flex flex-col max-h-[95vh] shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderRadius: '12px' }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--tint-teal-bg)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {t('reportOutputTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {schedule.products?.product_name_internal || schedule.products?.product_code || ''} | {t('plannedQty')}: {schedule.planned_quantity?.toLocaleString()} {t('pieces')}
            </p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Main Grid: Left Numpad & Actual Qty, Right Consumption & NG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Big Numpad Entry */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                {t('inputActualQty')} *
              </label>

              {/* Display Box */}
              <div
                className="w-full rounded-xl border-2 px-4 py-3 text-right font-mono font-bold text-3xl mb-3 shadow-inner"
                style={{
                  background: '#F8FAFC',
                  borderColor: 'var(--accent)',
                  color: 'var(--text-primary)',
                  minHeight: '60px',
                }}
              >
                {qtyString ? parseInt(qtyString, 10).toLocaleString() : '0'}
                <span className="text-sm text-slate-500 ml-2">{t('pieces')}</span>
              </div>

              {/* Big Touch Numpad */}
              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleNumpadPress(digit)}
                    className="btn btn-secondary text-2xl font-mono font-bold flex items-center justify-center rounded-xl transition-transform active:scale-95 shadow-sm"
                    style={{ minHeight: '58px', background: '#FFFFFF' }}
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNumpadPress('CLEAR')}
                  className="btn btn-secondary text-sm font-bold text-red-600 flex items-center justify-center rounded-xl active:scale-95"
                  style={{ minHeight: '58px', background: '#FEF2F2' }}
                >
                  {t('clear')}
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadPress('0')}
                  className="btn btn-secondary text-2xl font-mono font-bold flex items-center justify-center rounded-xl active:scale-95 shadow-sm"
                  style={{ minHeight: '58px', background: '#FFFFFF' }}
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadPress('BACKSPACE')}
                  className="btn btn-secondary text-base font-bold text-slate-700 flex items-center justify-center rounded-xl active:scale-95"
                  style={{ minHeight: '58px', background: '#F1F5F9' }}
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right: Consumption Formula & Meters */}
            <div className="flex flex-col gap-4">
              {/* Consumption Formula Card */}
              <div
                className="p-4 rounded-xl border flex flex-col gap-2.5"
                style={{ background: 'var(--tint-teal-bg)', borderColor: 'rgba(13, 148, 136, 0.25)' }}
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    {t('suggestedConsumption')}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  式: ({actualQtyNum.toLocaleString()} pcs × {feedLengthMm || 0} mm) / 1000 ={' '}
                  <strong className="font-mono text-sm text-slate-900">{suggestedMeters} m</strong>
                </div>

                <div className="mt-1">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('consumedMeters')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={consumedMeters}
                      onChange={(e) => setConsumedMeters(e.target.value)}
                      className="form-input flex-1 font-mono font-bold text-base text-right"
                      style={{ minHeight: '44px' }}
                      required
                    />
                    <span className="text-xs text-slate-600 font-bold">m</span>
                    <button
                      type="button"
                      onClick={() => setConsumedMeters(suggestedMeters)}
                      className="btn btn-secondary text-xs px-2.5"
                      style={{ minHeight: '44px' }}
                      title="理論値にリセット"
                    >
                      リセット
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {t('meterAdjustHint')}
                  </span>
                </div>
              </div>

              {/* Notes input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                  rows={2}
                  className="form-textarea w-full text-sm"
                />
              </div>

              {/* NG Breakdown Accordion Toggle */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowNgBreakdown(!showNgBreakdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 text-left text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{t('ngBreakdown')}</span>
                    {totalNg > 0 && (
                      <span className="badge badge--error text-[11px]">
                        {t('totalNg')}: {totalNg} {t('pieces')}
                      </span>
                    )}
                  </div>
                  {showNgBreakdown ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {showNgBreakdown && (
                  <div className="p-3 bg-white grid grid-cols-2 gap-2 border-t border-slate-200">
                    {ngFields.map((field) => (
                      <div key={field.key} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-600 truncate">{field.labelJA}</span>
                        <input
                          type="number"
                          min="0"
                          value={ng[field.key] || ''}
                          onChange={(e) =>
                            handleNgChange(field.key, parseInt(e.target.value || '0', 10))
                          }
                          className="form-input w-20 text-xs font-mono text-right"
                          style={{ minHeight: '32px' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div
            className="flex items-center justify-end gap-3 pt-3 border-t mt-auto"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
              style={{ minHeight: '50px', minWidth: '110px' }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={actualQtyNum <= 0 || isSubmitting}
              className="btn flex items-center justify-center gap-2 text-white shadow-md"
              style={{
                minHeight: '50px',
                minWidth: '200px',
                fontSize: '16px',
                fontWeight: 700,
                background: '#059669',
                borderColor: '#059669',
              }}
            >
              <CheckCircle className="w-5 h-5" />
              <span>{isSubmitting ? t('submitting') : t('confirmComplete')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
