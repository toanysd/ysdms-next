'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  FileText,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import type { LoanKpiSummary } from '../types';

interface LoanKpiCardsProps {
  kpis: LoanKpiSummary;
  selectedFilter?: string;
  onSelectFilter?: (filter: string) => void;
}

export default function LoanKpiCards({
  kpis,
  selectedFilter,
  onSelectFilter,
}: LoanKpiCardsProps) {
  const t = useTranslations('Loans.kpi');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
      {/* 1. 総起票数 */}
      <div
        className="card-flat p-3 flex items-center justify-between cursor-pointer transition-all hover:shadow-sm"
        style={{
          borderLeft: '4px solid var(--accent)',
          background: selectedFilter === 'ALL' ? 'var(--tint-teal-bg)' : undefined,
        }}
        onClick={() => onSelectFilter?.('ALL')}
      >
        <div>
          <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {t('total')}
          </div>
          <div
            className="text-[20px] font-bold mt-0.5"
            style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}
          >
            {kpis.total}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
        >
          <FileText size={18} />
        </div>
      </div>

      {/* 2. 預託保管中 (客先型) — KEY METRIC */}
      <div
        className="card-flat p-3 flex items-center justify-between cursor-pointer transition-all hover:shadow-sm"
        style={{
          borderLeft: '4px solid #10B981',
          background: selectedFilter === 'CUSTOMER_LOAN' ? 'var(--tint-teal-bg)' : undefined,
        }}
        onClick={() => onSelectFilter?.('CUSTOMER_LOAN')}
      >
        <div>
          <div className="text-[11px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <span>{t('custodyCount')}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className="text-[20px] font-bold"
              style={{ color: '#059669', fontFamily: 'monospace' }}
            >
              {kpis.custodyCount}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">型</span>
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#ECFDF5', color: '#10B981' }}
        >
          <ShieldCheck size={18} />
        </div>
      </div>

      {/* 3. 承認・出庫進行中 */}
      <div
        className="card-flat p-3 flex items-center justify-between cursor-pointer transition-all hover:shadow-sm"
        style={{
          borderLeft: '4px solid #3B82F6',
          background: selectedFilter === 'ACTIVE' ? 'var(--tint-blue-bg)' : undefined,
        }}
        onClick={() => onSelectFilter?.('ACTIVE')}
      >
        <div>
          <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {t('pendingApproval')} / {t('inTransit')}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className="text-[20px] font-bold"
              style={{ color: '#2563EB', fontFamily: 'monospace' }}
            >
              {kpis.pendingApproval + kpis.inTransit}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              ({kpis.pendingApproval} 待 / {kpis.inTransit} 送)
            </span>
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--tint-blue-bg)', color: '#3B82F6' }}
        >
          <Truck size={18} />
        </div>
      </div>

      {/* 4. 期限超過 */}
      <div
        className="card-flat p-3 flex items-center justify-between cursor-pointer transition-all hover:shadow-sm"
        style={{
          borderLeft: `4px solid ${kpis.overdue > 0 ? '#EF4444' : '#94A3B8'}`,
          background: selectedFilter === 'OVERDUE' ? 'var(--tint-orange-bg)' : undefined,
        }}
        onClick={() => onSelectFilter?.('OVERDUE')}
      >
        <div>
          <div
            className="text-[11px] font-semibold flex items-center gap-1"
            style={{ color: kpis.overdue > 0 ? '#DC2626' : 'var(--text-muted)' }}
          >
            {t('overdue')}
            {kpis.overdue > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
          </div>
          <div
            className="text-[20px] font-bold mt-0.5"
            style={{
              color: kpis.overdue > 0 ? '#DC2626' : 'var(--text-muted)',
              fontFamily: 'monospace',
            }}
          >
            {kpis.overdue}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: kpis.overdue > 0 ? '#FEF2F2' : 'var(--bg-hover)',
            color: kpis.overdue > 0 ? '#EF4444' : 'var(--text-muted)',
          }}
        >
          <AlertTriangle size={18} />
        </div>
      </div>
    </div>
  );
}
