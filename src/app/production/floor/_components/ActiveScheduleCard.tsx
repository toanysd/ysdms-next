'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Play,
  CheckCircle,
  Disc,
  Layers,
  Wrench,
  AlertTriangle,
  ArrowRightLeft,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { FloorScheduleItem } from '../actions';

interface ActiveScheduleCardProps {
  schedule: FloorScheduleItem | null;
  onStartShift: () => void;
  onMountRoll: () => void;
  onEndShift: () => void;
}

export default function ActiveScheduleCard({
  schedule,
  onStartShift,
  onMountRoll,
  onEndShift,
}: ActiveScheduleCardProps) {
  const t = useTranslations('Floor');

  if (!schedule) {
    return (
      <div
        className="card-flat flex flex-col items-center justify-center p-8 text-center"
        style={{
          minHeight: '260px',
          background: 'var(--bg-surface)',
          border: '2px dashed var(--border-subtle)',
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{ background: 'var(--tint-teal-bg)' }}
        >
          <Layers className="w-7 h-7" style={{ color: 'var(--accent)' }} />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">{t('noActiveJob')}</h3>
        <p className="text-sm text-slate-500 max-w-md">{t('noActiveJobDesc')}</p>
      </div>
    );
  }

  const isInProgress = schedule.status === 'IN_PROGRESS';
  const isPlanned = schedule.status === 'PLANNED';
  const hasRoll = Boolean(schedule.roll_id && schedule.plastic_receipt_roll);

  // Lifecycle status badge
  const lc = schedule.lifecycle;
  const lcStatus = lc?.lifecycle_status || 'NORMAL';

  return (
    <div
      className="card-flat overflow-hidden shadow-sm"
      style={{
        background: 'var(--bg-surface)',
        border: isInProgress ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
      }}
    >
      {/* Top Banner */}
      <div
        className="flex flex-wrap items-center justify-between px-5 py-3 gap-2"
        style={{
          background: isInProgress ? 'var(--tint-teal-bg)' : '#F1F5F9',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          {isInProgress ? (
            <span className="badge badge--success flex items-center gap-1.5 font-bold text-sm px-3 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              {t('statusInProgress')}
            </span>
          ) : (
            <span className="badge badge--info font-bold text-sm px-3 py-1">
              {t('statusPlanned')}
            </span>
          )}

          {schedule.scheduled_start && (
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              開始: {new Date(schedule.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="text-xs font-mono font-bold text-slate-600">
          ID: {schedule.schedule_id.slice(0, 8)}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex flex-col gap-5">
        {/* Row 1: Product Code, Internal Name, Work Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {t('product')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-900">
                {schedule.products?.product_name_internal || schedule.products?.product_code || '—'}
              </span>
              {schedule.products?.product_name && (
                <span className="text-xs text-slate-500 truncate">
                  ({schedule.products.product_name})
                </span>
              )}
            </div>
            {schedule.work_orders?.wo_code && (
              <span className="inline-block mt-1 text-xs font-mono font-semibold text-slate-600">
                {t('workOrder')}: {schedule.work_orders.wo_code}
              </span>
            )}
          </div>

          <div className="flex items-center justify-start md:justify-end gap-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                {t('plannedQty')}
              </span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-900">
                {schedule.planned_quantity ? schedule.planned_quantity.toLocaleString() : '—'}
              </span>
              <span className="text-xs text-slate-500 ml-1">{t('pieces')}</span>
            </div>

            {schedule.actual_quantity !== null && (
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  {t('actualQty')}
                </span>
                <span className="text-xl md:text-2xl font-bold font-mono text-emerald-600">
                  {schedule.actual_quantity.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 ml-1">{t('pieces')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Mold Info & Lifecycle, Machine Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          {/* Mold & Lifecycle */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: '#F1F5F9' }}
            >
              <Wrench className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {t('mold')}
              </span>
              <div className="text-sm font-bold font-mono text-slate-900">
                {schedule.mold?.display_name || schedule.mold?.equipment_code || '—'}
              </div>

              {/* Lifecycle Badge */}
              <div className="mt-1 flex items-center gap-1.5">
                {lcStatus === 'NORMAL' && (
                  <span className="badge badge--success text-[11px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {t('moldLifecycle')}: {t('lifecycleNormal')}
                  </span>
                )}
                {lcStatus === 'WARNING' && (
                  <span className="badge badge--warning text-[11px] flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3 h-3" />
                    {t('moldLifecycle')}: {t('lifecycleWarning')}
                  </span>
                )}
                {lcStatus === 'OVERDUE' && (
                  <span className="badge badge--error text-[11px] flex items-center gap-1 font-bold">
                    <ShieldAlert className="w-3 h-3" />
                    {t('moldLifecycle')}: {t('lifecycleOverdue')}
                  </span>
                )}
                {lc?.pct_life_used !== null && lc?.pct_life_used !== undefined && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({lc.pct_life_used}% 寿命)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Machine Feed Length */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: '#F1F5F9' }}
            >
              <ArrowRightLeft className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {t('feedLength')}
              </span>
              <div className="text-sm font-bold font-mono text-slate-900">
                {schedule.machines?.feed_length_mm
                  ? `${schedule.machines.feed_length_mm} mm`
                  : '— (未設定)'}
              </div>
              <span className="text-[11px] text-slate-500">
                送り長は消費量自動計算に使用されます
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Mounted Roll Info */}
        <div
          className="p-4 rounded-xl flex flex-wrap items-center justify-between gap-3"
          style={{
            background: hasRoll ? 'var(--tint-teal-bg)' : '#FFFBEB',
            border: hasRoll ? '1px solid rgba(13, 148, 136, 0.2)' : '1px solid #FDE68A',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: hasRoll ? 'rgba(13, 148, 136, 0.15)' : '#FEF3C7' }}
            >
              <Disc className="w-5 h-5" style={{ color: hasRoll ? 'var(--accent)' : '#D97706' }} />
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: hasRoll ? 'var(--accent)' : '#B45309' }}>
                {hasRoll ? t('mountedRoll') : t('noRollMounted')}
              </div>
              {hasRoll ? (
                <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {schedule.plastic_receipt_roll?.roll_barcode}
                  </span>
                  {schedule.plastic_receipt_roll?.plastic_master?.plastic_code && (
                    <span className="text-xs text-slate-600 font-medium">
                      ({schedule.plastic_receipt_roll.plastic_master.plastic_code})
                    </span>
                  )}
                  <span className="badge badge--neutral text-xs font-mono">
                    {t('rollLength')}: {schedule.plastic_receipt_roll?.current_length_m?.toLocaleString()} m
                  </span>
                </div>
              ) : (
                <div className="text-xs text-amber-700 mt-0.5">
                  成形開始前または途中で原反をセットしてください
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={onMountRoll}
              className="btn btn-secondary flex items-center gap-2"
              style={{
                minHeight: '44px',
                padding: '0 16px',
                fontWeight: 600,
                borderColor: hasRoll ? 'var(--border-subtle)' : '#F59E0B',
                color: hasRoll ? 'inherit' : '#B45309',
              }}
            >
              <Disc className="w-4 h-4" />
              <span>{hasRoll ? t('changeRollBtn') : t('mountRollBtn')}</span>
            </button>
          </div>
        </div>

        {/* Row 4: 3-Touch Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {isPlanned && (
            <button
              type="button"
              onClick={onStartShift}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              style={{
                minHeight: '54px',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('startShiftBtn')}</span>
            </button>
          )}

          {isInProgress && (
            <>
              <button
                type="button"
                onClick={onMountRoll}
                className="btn btn-secondary flex items-center justify-center gap-2"
                style={{
                  minHeight: '54px',
                  padding: '0 20px',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              >
                <Disc className="w-5 h-5" />
                <span>{hasRoll ? t('changeRollBtn') : t('mountRollBtn')}</span>
              </button>

              <button
                type="button"
                onClick={onEndShift}
                className="btn flex-1 flex items-center justify-center gap-2 text-white"
                style={{
                  minHeight: '54px',
                  fontSize: '16px',
                  fontWeight: 700,
                  background: '#059669',
                  borderColor: '#059669',
                }}
              >
                <CheckCircle className="w-5 h-5" />
                <span>{t('endShiftBtn')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
