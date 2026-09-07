'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Factory, Package, BarChart2, AlertCircle } from 'lucide-react';
import { MachineNgRankingItem, ProductNgRankingItem, ParetoItem } from '../actions';

interface Props {
  machineRanking: MachineNgRankingItem[];
  productRanking: ProductNgRankingItem[];
  pareto: ParetoItem[];
  threshold: number;
}

export default function NgRankingTables({
  machineRanking,
  productRanking,
  pareto,
  threshold,
}: Props) {
  const t = useTranslations('NgTrends');

  const formatNum = (num: number) => new Intl.NumberFormat().format(num);

  const getGroupLabel = (nameKey: string) => {
    return (t as any)(nameKey) || nameKey;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Side-by-side Ranking Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Machine Ranking */}
        <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-default)]/60">
            <div className="flex items-center gap-2">
              <Factory size={18} className="text-[var(--accent)]" />
              <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                {t('machineRanking')}
              </h3>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">
              {t('threshold')}: <strong className="font-mono">{threshold}%</strong>
            </span>
          </div>

          <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
            <table className="data-table text-[13px]">
              <thead>
                <tr>
                  <th className="w-12 text-center">{t('rank')}</th>
                  <th>{t('machine')}</th>
                  <th className="text-right">{t('totalOk')}</th>
                  <th className="text-right">{t('totalNg')}</th>
                  <th className="text-right">{t('ngRate')}</th>
                  <th className="text-center w-24">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {machineRanking.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-[var(--text-muted)]">
                      {t('noData')}
                    </td>
                  </tr>
                ) : (
                  machineRanking.map((m) => (
                    <tr
                      key={m.machineId}
                      className={m.isAlert ? 'bg-[var(--status-error)]/5' : ''}
                    >
                      <td className="text-center font-mono font-bold text-[12px] text-[var(--text-muted)]">
                        #{m.rank}
                      </td>
                      <td className="font-bold text-[var(--text-primary)]">
                        {m.machineCode}
                        {m.machineName ? (
                          <span className="text-[11px] text-[var(--text-muted)] ml-1.5 font-normal">
                            ({m.machineName})
                          </span>
                        ) : null}
                      </td>
                      <td className="text-right font-mono text-[var(--accent)]">
                        {formatNum(m.totalOk)}
                      </td>
                      <td className="text-right font-mono text-[var(--status-error)] font-bold">
                        {formatNum(m.totalNg)}
                      </td>
                      <td className="text-right font-mono font-bold">
                        <span
                          className={m.isAlert ? 'text-[var(--status-error)]' : 'text-[var(--text-primary)]'}
                        >
                          {m.ngRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-center">
                        {m.isAlert ? (
                          <span className="badge badge--error text-[10px] px-1.5 py-0.5 font-bold">
                            {t('alertExceeded')}
                          </span>
                        ) : (
                          <span className="badge badge--success text-[10px] px-1.5 py-0.5 font-medium">
                            {t('normal')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Product Ranking */}
        <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-default)]/60">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-[var(--accent)]" />
              <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                {t('productRanking')}
              </h3>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">{t('topDefectProducts')}</span>
          </div>

          <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
            <table className="data-table text-[13px]">
              <thead>
                <tr>
                  <th className="w-12 text-center">{t('rank')}</th>
                  <th>{t('product')}</th>
                  <th>{t('productName')}</th>
                  <th className="text-right">{t('totalOk')}</th>
                  <th className="text-right">{t('totalNg')}</th>
                  <th className="text-right">{t('ngRate')}</th>
                </tr>
              </thead>
              <tbody>
                {productRanking.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-[var(--text-muted)]">
                      {t('noData')}
                    </td>
                  </tr>
                ) : (
                  productRanking.slice(0, 10).map((p) => (
                    <tr key={p.productId}>
                      <td className="text-center font-mono font-bold text-[12px] text-[var(--text-muted)]">
                        #{p.rank}
                      </td>
                      <td>
                        {p.productId !== 'UNKNOWN' ? (
                          <Link
                            href={`/product-center/${p.productId}`}
                            className="font-mono font-bold text-[var(--accent)] hover:underline"
                          >
                            {p.productCode}
                          </Link>
                        ) : (
                          <span className="font-mono text-[var(--text-muted)]">{p.productCode}</span>
                        )}
                      </td>
                      <td className="max-w-[140px] truncate text-[12px] text-[var(--text-secondary)]">
                        {p.productName}
                      </td>
                      <td className="text-right font-mono text-[var(--accent)]">
                        {formatNum(p.totalOk)}
                      </td>
                      <td className="text-right font-mono text-[var(--status-error)] font-bold">
                        {formatNum(p.totalNg)}
                      </td>
                      <td className="text-right font-mono font-bold text-[var(--text-primary)]">
                        {p.ngRate.toFixed(2)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Bottom Pareto Row: Defect Group Cumulative Distribution */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-default)]/60">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-[var(--accent)]" />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              {t('paretoTitle')}
            </h3>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            Vital Few Analysis (80/20 Rule)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table text-[13px]">
            <thead>
              <tr>
                <th className="w-12 text-center">{t('rank')}</th>
                <th>{t('defectGroup')}</th>
                <th className="text-right">{t('count')}</th>
                <th className="text-right">{t('percentage')}</th>
                <th className="text-right">{t('cumulativePercent')}</th>
                <th className="w-48 text-left">{t('cumulativeDist')}</th>
              </tr>
            </thead>
            <tbody>
              {pareto.length === 0 || pareto.every((p) => p.count === 0) ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-[var(--text-muted)]">
                    {t('noData')}
                  </td>
                </tr>
              ) : (
                pareto.map((item, idx) => {
                  const isVitalFew = item.cumulativePct <= 80 || (idx > 0 && pareto[idx - 1].cumulativePct < 80);
                  return (
                    <tr
                      key={item.key}
                      className={isVitalFew ? 'bg-[var(--tint-orange-bg)]/20' : ''}
                    >
                      <td className="text-center font-mono font-bold text-[12px] text-[var(--text-muted)]">
                        #{idx + 1}
                      </td>
                      <td className="font-bold text-[var(--text-primary)]">
                        {getGroupLabel(item.nameKey)}
                        {isVitalFew && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[var(--status-warning)]/15 text-[var(--status-warning)] font-semibold">
                            {t('vitalFew')}
                          </span>
                        )}
                      </td>
                      <td className="text-right font-mono font-bold text-[var(--status-error)]">
                        {formatNum(item.count)} pcs
                      </td>
                      <td className="text-right font-mono font-semibold text-[var(--text-primary)]">
                        {item.pctOfNg}%
                      </td>
                      <td className="text-right font-mono font-bold text-[var(--accent)]">
                        {item.cumulativePct}%
                      </td>
                      <td>
                        <div className="w-full bg-[var(--bg-muted)] h-2 rounded-full overflow-hidden border border-[var(--border-default)]">
                          <div
                            className={`h-full ${isVitalFew ? 'bg-[var(--status-warning)]' : 'bg-[var(--accent)]'}`}
                            style={{ width: `${Math.min(item.cumulativePct, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
