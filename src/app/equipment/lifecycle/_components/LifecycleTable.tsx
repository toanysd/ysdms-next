'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, AlertTriangle, ShieldAlert, Wrench, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { LifecycleItem } from '../actions';

interface LifecycleTableProps {
  items: LifecycleItem[];
  onOpenServiceModal: (item: LifecycleItem) => void;
  onOpenDetailModal?: (equipmentId: string) => void;
}

export default function LifecycleTable({
  items,
  onOpenServiceModal,
  onOpenDetailModal,
}: LifecycleTableProps) {
  const t = useTranslations('Equipment.Lifecycle');

  return (
    <div className="card-flat overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ minWidth: '150px' }}>{t('colCode')}</th>
              <th style={{ minWidth: '110px' }}>{t('colType')}</th>
              <th className="text-right" style={{ minWidth: '120px' }}>{t('colTotalShots')}</th>
              <th className="text-right" style={{ minWidth: '130px' }}>{t('colShotsSinceService')}</th>
              <th className="text-right" style={{ minWidth: '110px' }}>{t('colThreshold')}</th>
              <th style={{ minWidth: '170px' }}>{t('colLifeProgress')}</th>
              <th style={{ minWidth: '110px' }}>{t('colStatus')}</th>
              <th className="text-center" style={{ minWidth: '110px' }}>{t('colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400">
                  {t('emptyText')}
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const pct = Math.max(0, item.pct_life_used);
                const isOverdue = item.lifecycle_status === 'OVERDUE';
                const isWarning = item.lifecycle_status === 'WARNING';

                // Bar color
                const barColor = isOverdue ? '#DC2626' : isWarning ? '#D97706' : '#059669';

                return (
                  <tr key={item.equipment_id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Code & Display Name */}
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/equipment/molds/${item.equipment_id}`}
                          className="font-mono font-bold text-sm hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          {item.equipment_code}
                        </Link>
                        {item.display_name && item.display_name !== item.equipment_code && (
                          <span className="text-xs text-slate-500 truncate max-w-[120px]">
                            ({item.display_name})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="badge badge--neutral font-mono text-[11px]">
                        {item.equipment_type}
                      </span>
                    </td>

                    {/* Total Shots */}
                    <td className="text-right font-mono font-semibold text-slate-900 text-sm">
                      {item.total_shots.toLocaleString()}
                    </td>

                    {/* Shots Since Service */}
                    <td className="text-right font-mono font-bold text-sm" style={{ color: barColor }}>
                      {item.current_shots_since_service.toLocaleString()}
                    </td>

                    {/* Threshold */}
                    <td className="text-right font-mono text-xs text-slate-500">
                      {item.maintenance_shot_threshold?.toLocaleString()}
                    </td>

                    {/* Life Progress Bar */}
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-baseline text-xs font-mono">
                          <span className="font-bold" style={{ color: barColor }}>
                            {pct.toFixed(1)}%
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {item.current_shots_since_service.toLocaleString()} / {item.maintenance_shot_threshold?.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, pct)}%`,
                              background: barColor,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      {isOverdue ? (
                        <span className="badge badge--error text-[11px] font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          {t('statusOverdue')}
                        </span>
                      ) : isWarning ? (
                        <span className="badge badge--warning text-[11px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {t('statusWarning')}
                        </span>
                      ) : (
                        <span className="badge badge--success text-[11px] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {t('statusNormal')}
                        </span>
                      )}
                    </td>

                    {/* Action Button: 保守完了 */}
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => onOpenServiceModal(item)}
                        className="btn btn-secondary text-xs flex items-center justify-center gap-1 mx-auto py-1 px-2.5 font-medium hover:border-teal-500"
                        style={{ minHeight: '32px' }}
                        title="点検・刃研ぎ完了を記録"
                      >
                        <Wrench className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t('btnServiceComplete')}</span>
                      </button>
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
