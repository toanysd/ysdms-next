'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Factory, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ReconciliationSummary } from '../actions';

interface Props {
  summary: ReconciliationSummary;
}

export default function InspectionKpiCards({ summary }: Props) {
  const t = useTranslations('QcInspection');
  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Forming NG */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-1">
            {t('formingNg')}
          </p>
          <p className="text-2xl font-black font-mono text-[var(--status-error)]">
            {fmt(summary.totalFormingNg)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {t('formingOk')}: <span className="font-mono font-bold text-[var(--accent)]">{fmt(summary.totalOk)}</span>
          </p>
        </div>
        <div className="p-3 rounded-full bg-[var(--tint-teal-bg)] text-[var(--accent)]">
          <Factory size={24} />
        </div>
      </div>

      {/* 2. Inspection Added NG */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-1">
            {t('deltaNg')}
          </p>
          <p className="text-2xl font-black font-mono text-[var(--status-warning)]">
            +{fmt(summary.totalInspectionNg)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {t('totalInspected')}: <span className="font-mono font-bold">{summary.matchedCount}</span> / {summary.totalLots}
          </p>
        </div>
        <div className="p-3 rounded-full bg-[var(--tint-orange-bg)] text-[var(--status-warning)]">
          <ShieldCheck size={24} />
        </div>
      </div>

      {/* 3. Combined Total NG */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-1">
            {t('combinedNg')}
          </p>
          <p className="text-3xl font-black font-mono text-[var(--status-error)]">
            {fmt(summary.totalCombinedNg)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            成形 + KCS 追加検出
          </p>
        </div>
        <div className="p-3 rounded-full bg-[var(--tint-red-bg)] text-[var(--status-error)]">
          <AlertTriangle size={24} />
        </div>
      </div>

      {/* 4. Quality Inspection Results */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-1">
            {t('kcsResult')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge badge--success text-[11px] px-2 py-0.5 font-bold">
              PASS: {summary.passCount}
            </span>
            <span className="badge badge--error text-[11px] px-2 py-0.5 font-bold">
              FAIL: {summary.failCount}
            </span>
            {summary.conditionalCount > 0 && (
              <span className="badge badge--warning text-[11px] px-2 py-0.5 font-bold">
                COND: {summary.conditionalCount}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {summary.uninspectedCount > 0 ? `${summary.uninspectedCount} lô chưa kiểm tra KCS` : 'Tất cả đã đối soát'}
          </p>
        </div>
        <div className="p-3 rounded-full bg-[var(--tint-blue-bg)] text-[var(--accent-blue)]">
          <CheckCircle2 size={24} />
        </div>
      </div>
    </div>
  );
}
