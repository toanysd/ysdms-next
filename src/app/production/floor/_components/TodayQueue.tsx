'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ListOrdered, Clock, CheckCircle2 } from 'lucide-react';
import { FloorScheduleItem } from '../actions';

interface TodayQueueProps {
  schedules: FloorScheduleItem[];
  selectedScheduleId?: string;
  onSelectSchedule: (schedule: FloorScheduleItem) => void;
}

export default function TodayQueue({
  schedules,
  selectedScheduleId,
  onSelectSchedule,
}: TodayQueueProps) {
  const t = useTranslations('Floor');

  return (
    <div
      className="card-flat overflow-hidden"
      style={{ background: 'var(--bg-surface)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: 'var(--border-subtle)', background: '#F8FAFC' }}
      >
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-800">{t('todayQueue')}</h3>
          <span className="badge badge--neutral text-xs">{schedules.length} 件</span>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {schedules.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            {t('queueEmpty')}
          </div>
        ) : (
          schedules.map((item) => {
            const isSelected = item.schedule_id === selectedScheduleId;
            const isInProgress = item.status === 'IN_PROGRESS';
            const isCompleted = item.status === 'COMPLETED';
            const isPlanned = item.status === 'PLANNED';

            return (
              <div
                key={item.schedule_id}
                onClick={() => onSelectSchedule(item)}
                className={`p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-teal-50/60'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Left: Product & Mold */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full shrink-0" style={{
                    background: isInProgress ? 'var(--accent)' : isCompleted ? '#059669' : '#94A3B8'
                  }} />

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {item.products?.product_name_internal || item.products?.product_code || '—'}
                      </span>
                      {item.work_orders?.wo_code && (
                        <span className="text-xs text-slate-500 font-mono">
                          [{item.work_orders.wo_code}]
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                      <span>型: {item.mold?.display_name || item.mold?.equipment_code || '—'}</span>
                      {item.schedule_date && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {item.schedule_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quantity & Status */}
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-xs text-slate-500 block">{t('plannedQty')}</span>
                    <span className="font-mono font-bold text-sm text-slate-800">
                      {item.planned_quantity?.toLocaleString() || '—'} {t('pieces')}
                    </span>
                  </div>

                  {item.actual_quantity !== null && (
                    <div>
                      <span className="text-xs text-slate-500 block">{t('actualQty')}</span>
                      <span className="font-mono font-bold text-sm text-emerald-600">
                        {item.actual_quantity.toLocaleString()} {t('pieces')}
                      </span>
                    </div>
                  )}

                  <div className="min-w-[70px] text-center">
                    {isInProgress && (
                      <span className="badge badge--success text-xs font-bold animate-pulse">
                        {t('statusInProgress')}
                      </span>
                    )}
                    {isPlanned && (
                      <span className="badge badge--info text-xs">
                        {t('statusPlanned')}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="badge badge--neutral text-xs flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {t('statusCompleted')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
