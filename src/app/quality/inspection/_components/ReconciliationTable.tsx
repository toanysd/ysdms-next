'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { ReconciliationItem } from '../actions';
import DefectDetailModal from './DefectDetailModal';

interface Props {
  items: ReconciliationItem[];
}

export default function ReconciliationTable({ items }: Props) {
  const t = useTranslations('QcInspection');
  const tNg = useTranslations('NgTrends');
  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null);

  const renderResultBadge = (res: ReconciliationItem['kcsResult']) => {
    switch (res) {
      case 'PASS':
        return <span className="badge badge--success text-[10px] px-1.5 py-0.5 font-bold">{t('passCount')}</span>;
      case 'FAIL':
        return <span className="badge badge--error text-[10px] px-1.5 py-0.5 font-bold">{t('failCount')}</span>;
      case 'CONDITIONAL':
        return <span className="badge badge--warning text-[10px] px-1.5 py-0.5 font-bold">{t('conditionalCount')}</span>;
      default:
        return <span className="badge badge--neutral text-[10px] px-1.5 py-0.5 text-[var(--text-muted)]">{t('unmatched')}</span>;
    }
  };

  const renderMatchedBadge = (method: ReconciliationItem['matchedMethod']) => {
    switch (method) {
      case 'SCHEDULE':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--tint-teal-bg)] text-[var(--accent)] font-semibold border border-[var(--accent)]/30">
            Schedule ID
          </span>
        );
      case 'FALLBACK':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--tint-blue-bg)] text-[var(--accent-blue)] font-semibold border border-[var(--accent-blue)]/30">
            Fallback
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-default)]">
            {t('uninspectedLabel')}
          </span>
        );
    }
  };

  return (
    <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-default)]/60">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[var(--accent)]" />
          <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
            {t('reconcileTable')}
          </h3>
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">
          {items.length} records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table text-[13px]">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{tNg('machine')}</th>
              <th>{tNg('product')}</th>
              <th>{tNg('productName')}</th>
              <th className="text-right">{t('formingOk')}</th>
              <th className="text-right">{t('formingNg')}</th>
              <th className="text-right">{t('deltaNg')}</th>
              <th className="text-right">{t('combinedNg')}</th>
              <th className="text-center">{t('kcsResult')}</th>
              <th>{t('matchedBy')}</th>
              <th>{t('inspector')}</th>
              <th className="text-center w-16">{t('detail')}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-[var(--text-muted)]">
                  {t('noRecords')}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className={item.isDiscrepancyHigh ? 'bg-[var(--status-error)]/5' : ''}
                >
                  <td className="font-mono text-[12px]">{item.logDate}</td>
                  <td className="font-bold text-[var(--text-primary)]">
                    {item.machineCode}
                  </td>
                  <td>
                    {item.productId !== 'UNKNOWN' ? (
                      <Link
                        href={`/product-center/${item.productId}`}
                        className="font-mono font-bold text-[var(--accent)] hover:underline"
                      >
                        {item.productCode}
                      </Link>
                    ) : (
                      <span className="font-mono text-[var(--text-muted)]">{item.productCode}</span>
                    )}
                  </td>
                  <td className="max-w-[150px] truncate text-[12px] text-[var(--text-secondary)]">
                    {item.productName}
                  </td>
                  <td className="text-right font-mono text-[var(--accent)]">
                    {fmt(item.formingOk)}
                  </td>
                  <td className="text-right font-mono text-[var(--status-error)] font-semibold">
                    {fmt(item.formingNg)}
                  </td>
                  <td className="text-right font-mono text-[var(--status-warning)] font-bold">
                    {item.deltaNg > 0 ? `+${fmt(item.deltaNg)}` : '0'}
                  </td>
                  <td className="text-right font-mono text-[var(--status-error)] font-bold">
                    {fmt(item.combinedNg)}
                  </td>
                  <td className="text-center">{renderResultBadge(item.kcsResult)}</td>
                  <td>{renderMatchedBadge(item.matchedMethod)}</td>
                  <td className="text-[12px] text-[var(--text-secondary)]">
                    {item.inspectorName}
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="p-1 rounded hover:bg-[var(--bg-muted)] text-[var(--accent)] transition-colors inline-flex items-center justify-center"
                      title="Chi tiết lỗi"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Defect Detail Modal */}
      <DefectDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
