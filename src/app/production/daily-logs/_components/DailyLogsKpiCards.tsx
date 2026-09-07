'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertTriangle, Percent, Disc } from 'lucide-react';

interface DailyLogsKpiCardsProps {
  totalOk: number;
  totalNg: number;
  avgNgRate: number;
  totalMeters: number;
}

export default function DailyLogsKpiCards({
  totalOk,
  totalNg,
  avgNgRate,
  totalMeters,
}: DailyLogsKpiCardsProps) {
  const t = useTranslations('DailyLogs');

  const cards = [
    {
      id: 'ok',
      label: t('kpiTotalOk'),
      value: `${totalOk.toLocaleString()} 個`,
      icon: CheckCircle2,
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      id: 'ng',
      label: t('kpiTotalNg'),
      value: `${totalNg.toLocaleString()} 個`,
      icon: AlertTriangle,
      color: totalNg > 0 ? '#DC2626' : '#64748B',
      bg: totalNg > 0 ? '#FEF2F2' : '#F8FAFC',
    },
    {
      id: 'rate',
      label: t('kpiAvgNgRate'),
      value: `${avgNgRate.toFixed(2)} %`,
      icon: Percent,
      color: avgNgRate > 3 ? '#DC2626' : avgNgRate > 0 ? '#D97706' : '#059669',
      bg: avgNgRate > 3 ? '#FEF2F2' : '#FFFBEB',
    },
    {
      id: 'meters',
      label: t('kpiTotalMeters'),
      value: `${totalMeters.toLocaleString(undefined, { maximumFractionDigits: 1 })} m`,
      icon: Disc,
      color: 'var(--accent)',
      bg: 'var(--tint-teal-bg)',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="card-flat p-4 flex items-center justify-between"
            style={{ background: 'var(--bg-surface)' }}
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                {card.label}
              </span>
              <span className="font-mono font-bold text-xl" style={{ color: card.color }}>
                {card.value}
              </span>
            </div>

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: card.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
