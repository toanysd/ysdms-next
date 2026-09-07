'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { X, Layers, ShieldCheck, AlertCircle } from 'lucide-react';
import { ReconciliationItem } from '../actions';

interface Props {
  item: ReconciliationItem | null;
  onClose: () => void;
}

export default function DefectDetailModal({ item, onClose }: Props) {
  const tQc = useTranslations('QcInspection');
  const tNg = useTranslations('NgTrends');
  const tDaily = useTranslations('DailyInspection');

  if (!item) return null;

  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  const formingList = [
    { key: 'qty_ng_a', label: tNg('groupA'), count: item.formingDefects.qty_ng_a },
    { key: 'qty_ng_b', label: tNg('groupB'), count: item.formingDefects.qty_ng_b },
    { key: 'qty_ng_c', label: tNg('groupC'), count: item.formingDefects.qty_ng_c },
    { key: 'qty_ng_d', label: tNg('groupD'), count: item.formingDefects.qty_ng_d },
    { key: 'qty_ng_e', label: tNg('groupE'), count: item.formingDefects.qty_ng_e },
    { key: 'qty_ng_f', label: tNg('groupF'), count: item.formingDefects.qty_ng_f },
    { key: 'qty_ng_g', label: tNg('groupG'), count: item.formingDefects.qty_ng_g },
  ];

  const kcsList = [
    { key: 'qty_wc', label: tDaily('qty_wc'), count: item.inspectionDefects.qty_wc },
    { key: 'qty_sc', label: tDaily('qty_sc'), count: item.inspectionDefects.qty_sc },
    { key: 'qty_dt', label: tDaily('qty_dt'), count: item.inspectionDefects.qty_dt },
    { key: 'qty_fm', label: tDaily('qty_fm'), count: item.inspectionDefects.qty_fm },
    { key: 'qty_bh', label: tDaily('qty_bh'), count: item.inspectionDefects.qty_bh },
    { key: 'qty_br', label: tDaily('qty_br'), count: item.inspectionDefects.qty_br },
    { key: 'qty_sd', label: tDaily('qty_sd'), count: item.inspectionDefects.qty_sd },
    { key: 'qty_ot', label: tDaily('qty_ot'), count: item.inspectionDefects.qty_ot },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)] bg-[var(--bg-muted)]">
          <div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
              {tQc('reconcileTable')} — {item.productCode}
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              {item.logDate} | {item.machineCode} | {item.productName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {/* Top Summary Bar */}
          <div className="grid grid-cols-4 gap-3 p-3 rounded-lg bg-[var(--bg-muted)]/50 border border-[var(--border-default)] text-center text-[12px]">
            <div>
              <p className="text-[var(--text-muted)]">{tQc('formingOk')}</p>
              <p className="font-bold font-mono text-[14px] text-[var(--accent)]">{fmt(item.formingOk)}</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">{tQc('formingNg')}</p>
              <p className="font-bold font-mono text-[14px] text-[var(--status-error)]">{fmt(item.formingNg)}</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">{tQc('deltaNg')}</p>
              <p className="font-bold font-mono text-[14px] text-[var(--status-warning)]">+{fmt(item.deltaNg)}</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">{tQc('combinedNg')}</p>
              <p className="font-bold font-mono text-[14px] text-[var(--status-error)]">{fmt(item.combinedNg)}</p>
            </div>
          </div>

          {/* Two-column Defect Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Forming Station Defect Breakdown */}
            <div className="border border-[var(--border-default)] rounded-lg p-3 bg-[var(--bg-surface)]">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[var(--border-default)] font-bold text-[13px] text-[var(--text-primary)]">
                <Layers size={16} className="text-[var(--accent)]" />
                <span>{tQc('forming7Items')}</span>
              </div>
              <div className="space-y-1.5 text-[12px]">
                {formingList.map((f) => (
                  <div
                    key={f.key}
                    className={`flex items-center justify-between p-1.5 rounded ${
                      f.count > 0 ? 'bg-[var(--status-error)]/10 font-semibold' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="font-mono">{f.count} pcs</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: KCS Station Defect Breakdown */}
            <div className="border border-[var(--border-default)] rounded-lg p-3 bg-[var(--bg-surface)]">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[var(--border-default)] font-bold text-[13px] text-[var(--text-primary)]">
                <ShieldCheck size={16} className="text-[var(--status-warning)]" />
                <span>{tQc('kcs8Items')}</span>
              </div>
              <div className="space-y-1.5 text-[12px]">
                {kcsList.map((k) => (
                  <div
                    key={k.key}
                    className={`flex items-center justify-between p-1.5 rounded ${
                      k.count > 0 ? 'bg-[var(--status-warning)]/15 font-semibold text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span>{k.label}</span>
                    <span className="font-mono">{k.count} pcs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes or inspection meta */}
          {item.notes && (
            <div className="p-3 bg-[var(--bg-muted)] rounded-lg border border-[var(--border-default)] text-[12px]">
              <p className="font-bold text-[var(--text-secondary)] mb-1">{tQc('notes')}:</p>
              <p className="text-[var(--text-primary)]">{item.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-default)] flex justify-end bg-[var(--bg-muted)]">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary h-8 px-4 text-[12px]"
          >
            {tQc('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
