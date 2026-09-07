'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { MachineOption } from '../actions';

interface Props {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  selectedMachine: string;
  onMachineChange: (mId: string) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  threshold: number;
  onThresholdChange: (val: number) => void;
  machines: MachineOption[];
  onRefresh: () => void;
  loading: boolean;
}

export default function NgTrendFilterBar({
  startDate,
  endDate,
  onDateChange,
  selectedMachine,
  onMachineChange,
  selectedGroup,
  onGroupChange,
  threshold,
  onThresholdChange,
  machines,
  onRefresh,
  loading,
}: Props) {
  const t = useTranslations('NgTrends');

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onDateChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  const defectGroupOptions = [
    { key: 'ALL', label: t('allGroups') },
    { key: 'qty_ng_a', label: t('groupA') },
    { key: 'qty_ng_b', label: t('groupB') },
    { key: 'qty_ng_c', label: t('groupC') },
    { key: 'qty_ng_d', label: t('groupD') },
    { key: 'qty_ng_e', label: t('groupE') },
    { key: 'qty_ng_f', label: t('groupF') },
    { key: 'qty_ng_g', label: t('groupG') },
  ];

  return (
    <div className="card-flat flex flex-col gap-3 p-4 shrink-0 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Date presets and inputs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[13px] font-semibold text-[var(--text-secondary)]">
            <Calendar size={16} className="text-[var(--accent)]" />
            <span>{t('dateRange')}:</span>
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-muted)] p-1 rounded-md border border-[var(--border-default)]">
            <button
              type="button"
              onClick={() => handlePreset(7)}
              className="px-2.5 py-1 text-[12px] font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)]"
            >
              {t('last7Days')}
            </button>
            <button
              type="button"
              onClick={() => handlePreset(30)}
              className="px-2.5 py-1 text-[12px] font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)]"
            >
              {t('last30Days')}
            </button>
            <button
              type="button"
              onClick={() => handlePreset(90)}
              className="px-2.5 py-1 text-[12px] font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)]"
            >
              {t('last90Days')}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[13px]">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateChange(e.target.value, endDate)}
              className="form-input text-[13px] py-1 px-2.5 h-8"
            />
            <span className="text-[var(--text-muted)]">〜</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onDateChange(startDate, e.target.value)}
              className="form-input text-[13px] py-1 px-2.5 h-8"
            />
          </div>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="btn btn-secondary h-8 px-3 text-[12px] flex items-center gap-1.5 ml-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? '...' : t('refresh')}</span>
        </button>
      </div>

      {/* Second row: Filters & Threshold */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[var(--border-default)]/60 text-[13px]">
        {/* Machine dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--text-muted)]" />
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
            {t('machineFilter')}:
          </span>
          <select
            value={selectedMachine}
            onChange={(e) => onMachineChange(e.target.value)}
            className="form-input text-[13px] py-1 px-2.5 h-8 w-44"
          >
            <option value="">{t('allMachines')}</option>
            {machines.map((m) => (
              <option key={m.machine_id} value={m.machine_id}>
                {m.machine_code} {m.machine_name ? `(${m.machine_name})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Defect group dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
            {t('groupFilter')}:
          </span>
          <select
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            className="form-input text-[13px] py-1 px-2.5 h-8 w-48"
          >
            {defectGroupOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Threshold input */}
        <div className="flex items-center gap-2 ml-auto">
          <AlertCircle size={15} className="text-[var(--status-warning)]" />
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
            {t('threshold')}:
          </span>
          <div className="flex items-center">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              value={threshold}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                onThresholdChange(val);
              }}
              className="form-input text-[13px] font-mono font-bold py-1 px-2 h-8 w-20 text-right"
            />
            <span className="ml-1 text-[13px] font-bold text-[var(--text-muted)]">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
