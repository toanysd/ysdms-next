'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export interface CombinedLogItem {
  key: string;
  schedule_id: string | null;
  log_date: string;
  machine_code: string;
  machine_name: string;
  product_id: string | null;
  product_code: string;
  product_name_internal: string | null;
  operator_name: string;
  qty_ok: number;
  qty_ng_total: number;
  ng_rate: number;
  ng_breakdown: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
  };
  checks_ok_count: number;
  checks_total: number;
  roll_barcode: string | null;
  plastic_code: string | null;
  feed_length_mm: number | null;
  consumed_meters_est: number;
  press_shot_count: number | null;
  cutter_condition: string | null;
}

interface DailyLogsSummaryTableProps {
  items: CombinedLogItem[];
}

export default function DailyLogsSummaryTable({ items }: DailyLogsSummaryTableProps) {
  const t = useTranslations('DailyLogs');

  return (
    <div className="card-flat overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ minWidth: '100px' }}>{t('date')}</th>
              <th style={{ minWidth: '100px' }}>{t('colMachine')}</th>
              <th style={{ minWidth: '150px' }}>{t('product')}</th>
              <th style={{ minWidth: '120px' }}>{t('operator')}</th>
              <th className="text-right" style={{ minWidth: '100px' }}>{t('goodQty')}</th>
              <th className="text-right" style={{ minWidth: '110px' }}>{t('ngQty')}</th>
              <th className="text-right" style={{ minWidth: '90px' }}>{t('colNgRate')}</th>
              <th style={{ minWidth: '150px' }}>{t('colConsumption')}</th>
              <th className="text-right" style={{ minWidth: '110px' }}>{t('shotCount')}</th>
              <th className="text-center" style={{ minWidth: '100px' }}>{t('colPreflight')}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-slate-400">
                  該当する日報データがありません
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const hasNg = item.qty_ng_total > 0;
                const isChecksAllOk = item.checks_ok_count === item.checks_total && item.checks_total > 0;

                return (
                  <tr key={item.key} className="hover:bg-slate-50/80 transition-colors">
                    {/* Date */}
                    <td className="font-mono text-xs">
                      {item.log_date ? format(new Date(item.log_date), 'yyyy-MM-dd') : '—'}
                    </td>

                    {/* Machine */}
                    <td>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {item.machine_code}
                      </span>
                      {item.machine_name && item.machine_name !== item.machine_code && (
                        <span className="text-[11px] text-slate-500 ml-1">
                          ({item.machine_name})
                        </span>
                      )}
                    </td>

                    {/* Product */}
                    <td>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {item.product_name_internal || item.product_code || '—'}
                      </span>
                    </td>

                    {/* Operator */}
                    <td className="text-xs text-slate-700 font-medium">
                      {item.operator_name}
                    </td>

                    {/* Good Output */}
                    <td className="text-right font-mono font-bold text-sm text-emerald-600">
                      {item.qty_ok.toLocaleString()}
                    </td>

                    {/* NG Quantity & Breakdown Tooltip */}
                    <td className="text-right font-mono text-xs">
                      {hasNg ? (
                        <span
                          className="badge badge--error text-xs font-bold"
                          title={`A(成形):${item.ng_breakdown.a}, B(抜き):${item.ng_breakdown.b}, C(スタック):${item.ng_breakdown.c}, D(異物):${item.ng_breakdown.d}, E(キズ):${item.ng_breakdown.e}, F(汚れ):${item.ng_breakdown.f}, G(他):${item.ng_breakdown.g}`}
                        >
                          {item.qty_ng_total.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* NG Rate */}
                    <td className="text-right font-mono text-xs font-semibold">
                      {hasNg ? (
                        <span className={item.ng_rate > 3 ? 'text-red-600 font-bold' : 'text-amber-600'}>
                          {item.ng_rate.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">0.0%</span>
                      )}
                    </td>

                    {/* Consumption (Est / Roll) */}
                    <td>
                      <div className="flex flex-col text-xs font-mono">
                        <span className="font-bold text-slate-900">
                          {item.consumed_meters_est > 0
                            ? `理論: ${item.consumed_meters_est.toFixed(1)} m`
                            : '—'}
                        </span>
                        {item.roll_barcode && (
                          <span className="text-[10px] text-slate-500 truncate max-w-[130px]" title={item.roll_barcode}>
                            {item.roll_barcode}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Press Shot Count & Cutter */}
                    <td className="text-right font-mono text-xs">
                      {item.press_shot_count !== null ? (
                        <div>
                          <span className="font-bold text-slate-800">
                            {item.press_shot_count.toLocaleString()}
                          </span>
                          {item.cutter_condition && (
                            <span className="badge badge--neutral text-[10px] ml-1">
                              {item.cutter_condition}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Preflight Check Status */}
                    <td className="text-center">
                      {item.checks_total > 0 ? (
                        isChecksAllOk ? (
                          <span className="badge badge--success text-[11px] flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            7/7 OK
                          </span>
                        ) : (
                          <span className="badge badge--warning text-[11px] flex items-center justify-center gap-1 font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            {item.checks_ok_count}/{item.checks_total}
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
