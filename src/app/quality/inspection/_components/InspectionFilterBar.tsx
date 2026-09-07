'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Filter, RefreshCw, FileDown } from 'lucide-react';
import { MachineOption } from '@/app/quality/ng-trends/actions';

interface Props {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  selectedMachine: string;
  onMachineChange: (mId: string) => void;
  machines: MachineOption[];
  onRefresh: () => void;
  loading: boolean;
}

export default function InspectionFilterBar({
  startDate,
  endDate,
  onDateChange,
  selectedMachine,
  onMachineChange,
  machines,
  onRefresh,
  loading,
}: Props) {
  const tQc = useTranslations('QcInspection');
  const tNg = useTranslations('NgTrends');

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onDateChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  return (
    <div className="card-flat flex flex-wrap items-center justify-between gap-3 p-3.5 shrink-0 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg">
      {/* Left: Presets & Dates */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)]">
          <Calendar size={16} className="text-[var(--accent)]" />
          <span>{tNg('dateRange')}:</span>
        </div>

        <div className="flex items-center gap-1 bg-[var(--bg-muted)] p-1 rounded-md border border-[var(--border-default)]">
          <button
            type="button"
            onClick={() => handlePreset(7)}
            className="px-2.5 py-1 text-[12px] font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)]"
          >
            {tNg('last7Days')}
          </button>
          <button
            type="button"
            onClick={() => handlePreset(30)}
            className="px-2.5 py-1 text-[12px] font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)]"
          >
            {tNg('last30Days')}
          </button>
          <button
            type="button"
            onClick={() => handlePreset(90)}
            className="px-2.5 py-1 text-[12px] font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)]"
          >
            {tNg('last90Days')}
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

        {/* Machine dropdown */}
        <div className="flex items-center gap-1.5 ml-2">
          <Filter size={14} className="text-[var(--text-muted)]" />
          <select
            value={selectedMachine}
            onChange={(e) => onMachineChange(e.target.value)}
            className="form-input text-[13px] py-1 px-2.5 h-8 w-44"
          >
            <option value="">{tNg('allMachines')}</option>
            {machines.map((m) => (
              <option key={m.machine_id} value={m.machine_id}>
                {m.machine_code} {m.machine_name ? `(${m.machine_name})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <a
          href={`/api/qc/monthly-report/pdf?month=${startDate.slice(0, 7)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary h-8 px-3 text-[12px] flex items-center gap-1.5 font-semibold text-[var(--accent)] hover:bg-[var(--tint-teal-bg)]"
        >
          <FileDown size={14} />
          <span>{tQc('downloadMonthlyPdf')}</span>
        </a>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="btn btn-secondary h-8 px-3 text-[12px] flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? '...' : tNg('refresh')}</span>
        </button>
      </div>
    </div>
  );
}
