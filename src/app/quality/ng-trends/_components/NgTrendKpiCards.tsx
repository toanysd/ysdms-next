'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertTriangle, Activity, Layers, AlertOctagon } from 'lucide-react';
import { NgTrendKpiSummary } from '../actions';

interface Props {
  summary: NgTrendKpiSummary;
  threshold: number;
}

export default function NgTrendKpiCards({ summary, threshold }: Props) {
  const t = useTranslations('NgTrends');

  const isAlert = summary.ngRate >= threshold && summary.totalOutput > 0;

  // Format large numbers
  const formatNum = (num: number) => new Intl.NumberFormat().format(num);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total OK */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-1">
            {t('totalOk')}
          </p>
          <p className="text-2xl font-black font-mono text-[var(--accent)]">
            {formatNum(summary.totalOk)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            / {formatNum(summary.totalOutput)} (Total Output)
          </p>
        </div>
        <div className="p-3 rounded-full bg-[var(--tint-teal-bg)] text-[var(--accent)]">
          <CheckCircle2 size={24} />
        </div>
      </div>

      {/* 2. Total NG */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-1">
            {t('totalNg')}
          </p>
          <p className="text-2xl font-black font-mono text-[var(--status-error)]">
            {formatNum(summary.totalNg)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {summary.groups.length > 0 ? `${summary.groups.filter((g) => g.count > 0).length} nhóm lỗi phát sinh` : '0 nhóm lỗi'}
          </p>
        </div>
        <div className="p-3 rounded-full bg-[var(--tint-red-bg)] text-[var(--status-error)]">
          <AlertTriangle size={24} />
        </div>
      </div>

      {/* 3. NG Rate % */}
      <div
        className={`card-flat p-4 border rounded-lg flex items-center justify-between shadow-sm ${
          isAlert
            ? 'bg-[var(--tint-red-bg)] border-[var(--status-error)]/40'
            : 'bg-[var(--bg-surface)] border-[var(--border-default)]'
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-[12px] font-semibold text-[var(--text-muted)]">{t('ngRate')}</p>
            {isAlert ? (
              <span className="badge badge--error text-[10px] px-1.5 py-0.5 animate-pulse font-bold">
                {t('thresholdAlert')}
              </span>
            ) : (
              <span className="badge badge--success text-[10px] px-1.5 py-0.5 font-bold">
                {t('normal')}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <p
              className={`text-3xl font-black font-mono ${
                isAlert ? 'text-[var(--status-error)]' : 'text-[var(--text-primary)]'
              }`}
            >
              {summary.ngRate.toFixed(2)}%
            </p>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {t('threshold')}: <span className="font-mono font-bold">{threshold.toFixed(1)}%</span>
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${
            isAlert
              ? 'bg-[var(--status-error)]/10 text-[var(--status-error)]'
              : 'bg-[var(--tint-blue-bg)] text-[var(--accent-blue)]'
          }`}
        >
          {isAlert ? <AlertOctagon size={24} /> : <Activity size={24} />}
        </div>
      </div>

      {/* 4. Top Defect Group */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-1">
            {t('topGroup')}
          </p>
          <p className="text-[16px] font-bold text-[var(--text-primary)] truncate max-w-[170px]">
            {summary.topGroupCount > 0 ? (t as any)(summary.topGroupNameKey) : '—'}
          </p>
          <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
            {summary.topGroupCount > 0
              ? `${formatNum(summary.topGroupCount)} pcs (${summary.topGroupPct}%)`
              : 'Không có lỗi'}
          </p>
        </div>
        <div className="p-3 rounded-full bg-[var(--tint-orange-bg)] text-[var(--status-warning)]">
          <Layers size={24} />
        </div>
      </div>
    </div>
  );
}
