'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LifecycleStats } from '../actions';

interface LifecycleKpiCardsProps {
  stats: LifecycleStats;
  currentStatusFilter: string;
  onSelectStatus: (status: string) => void;
}

export default function LifecycleKpiCards({
  stats,
  currentStatusFilter,
  onSelectStatus,
}: LifecycleKpiCardsProps) {
  const t = useTranslations('Equipment.Lifecycle');

  const cards = [
    {
      id: 'ALL',
      label: t('kpiTotal'),
      count: stats.total,
      icon: Shield,
      color: '#3B82F6',
      bg: '#EFF6FF',
      activeBorder: '#3B82F6',
    },
    {
      id: 'OVERDUE',
      label: t('kpiOverdue'),
      count: stats.overdue,
      icon: ShieldAlert,
      color: '#DC2626',
      bg: '#FEF2F2',
      activeBorder: '#DC2626',
    },
    {
      id: 'WARNING',
      label: t('kpiWarning'),
      count: stats.warning,
      icon: AlertTriangle,
      color: '#D97706',
      bg: '#FFFBEB',
      activeBorder: '#D97706',
    },
    {
      id: 'NORMAL',
      label: t('kpiNormal'),
      count: stats.normal,
      icon: CheckCircle2,
      color: '#059669',
      bg: '#ECFDF5',
      activeBorder: '#059669',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = currentStatusFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`card-flat p-4 flex items-center justify-between transition-all text-left ${
              isSelected ? 'ring-2 shadow-sm' : 'hover:border-slate-300'
            }`}
            style={{
              background: 'var(--bg-surface)',
              borderColor: isSelected ? card.activeBorder : 'var(--border-subtle)',
            }}
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                {card.label}
              </span>
              <span className="font-mono font-bold text-2xl" style={{ color: card.color }}>
                {card.count.toLocaleString()}
              </span>
            </div>

            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: card.bg }}
            >
              <Icon className="w-6 h-6" style={{ color: card.color }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
