'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Play, CheckSquare, Square, Check, User } from 'lucide-react';
import { FloorScheduleItem } from '../actions';

interface StartShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: FloorScheduleItem | null;
  employees: { employee_id: string; employee_name: string; employee_code: string }[];
  onConfirmStart: (params: {
    scheduleId: string;
    operatorId: string;
    checks: {
      check_heater: boolean;
      check_mold: boolean;
      check_cutter: boolean;
      check_plug: boolean;
      check_frame: boolean;
      check_water_base: boolean;
      check_stacking: boolean;
    };
  }) => Promise<void>;
}

export default function StartShiftModal({
  isOpen,
  onClose,
  schedule,
  employees,
  onConfirmStart,
}: StartShiftModalProps) {
  const t = useTranslations('Floor');
  const tDaily = useTranslations('DailyLogs');

  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(
    employees[0]?.employee_id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checks, setChecks] = useState({
    check_heater: true,
    check_mold: true,
    check_cutter: true,
    check_plug: true,
    check_frame: true,
    check_water_base: true,
    check_stacking: true,
  });

  if (!isOpen || !schedule) return null;

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAllChecks = (val: boolean) => {
    setChecks({
      check_heater: val,
      check_mold: val,
      check_cutter: val,
      check_plug: val,
      check_frame: val,
      check_water_base: val,
      check_stacking: val,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperatorId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirmStart({
        scheduleId: schedule.schedule_id,
        operatorId: selectedOperatorId,
        checks,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkItems: { key: keyof typeof checks; labelJA: string }[] = [
    { key: 'check_heater', labelJA: tDaily('checkHeater') },
    { key: 'check_mold', labelJA: tDaily('checkMold') },
    { key: 'check_cutter', labelJA: tDaily('checkCutter') },
    { key: 'check_plug', labelJA: tDaily('checkPlug') },
    { key: 'check_frame', labelJA: tDaily('checkFrame') },
    { key: 'check_water_base', labelJA: tDaily('checkWaterBase') },
    { key: 'check_stacking', labelJA: tDaily('checkStacking') },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="card-flat w-full max-w-xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderRadius: '12px' }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--tint-teal-bg)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {t('startShiftBtn')}
            </h2>
            <p className="text-xs text-slate-500">
              {schedule.products?.product_name_internal || schedule.products?.product_code || ''} (
              {schedule.planned_quantity?.toLocaleString()} {t('pieces')})
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Operator Picker */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              {t('operator')} *
            </label>
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
              className="form-input w-full text-base font-medium"
              style={{ minHeight: '48px' }}
              required
            >
              <option value="">{t('selectOperator')}</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name} ({emp.employee_code})
                </option>
              ))}
            </select>
          </div>

          {/* 7-point Preflight Checks */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-800">
                {t('preflightCheck')}
              </span>
              <button
                type="button"
                onClick={() => setAllChecks(true)}
                className="btn btn-secondary text-xs flex items-center gap-1 py-1 px-2.5"
                style={{ minHeight: '32px' }}
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('preflightAllOk')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {checkItems.map((item) => {
                const checked = checks[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleCheck(item.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-all ${
                      checked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    {checked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{item.labelJA}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 mt-auto">
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
              type="submit"
              disabled={!selectedOperatorId || isSubmitting}
              className="btn btn-primary flex items-center justify-center gap-2"
              style={{
                minHeight: '48px',
                minWidth: '160px',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSubmitting ? t('starting') : t('startShiftBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
