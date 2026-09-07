'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScanLine, ArrowLeft, ArrowUpFromLine, FileDown } from 'lucide-react';
import InspectionFilterBar from './_components/InspectionFilterBar';
import InspectionKpiCards from './_components/InspectionKpiCards';
import ReconciliationTable from './_components/ReconciliationTable';
import {
  getKcsReconciliationData,
  ReconciliationItem,
  ReconciliationSummary,
} from './actions';
import { getActiveMachines, MachineOption } from '@/app/quality/ng-trends/actions';

export default function QualityInspectionPage() {
  const t = useTranslations('QcInspection');
  const tNg = useTranslations('NgTrends');
  const router = useRouter();

  // Date range defaults: 30 days
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedMachine, setSelectedMachine] = useState<string>('');

  // Data state
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<MachineOption[]>([]);
  const [items, setItems] = useState<ReconciliationItem[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary>({
    totalFormingNg: 0,
    totalInspectionNg: 0,
    totalCombinedNg: 0,
    totalOk: 0,
    totalLots: 0,
    matchedCount: 0,
    uninspectedCount: 0,
    passCount: 0,
    failCount: 0,
    conditionalCount: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [machs, recData] = await Promise.all([
        getActiveMachines(),
        getKcsReconciliationData(startDate, endDate, selectedMachine || undefined),
      ]);

      setMachines(machs);
      setItems(recData.reconciliation);
      setSummary(recData.summary);
    } catch (err) {
      console.error('Failed to load reconciliation data:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedMachine]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex flex-col h-full gap-3 p-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* 1. Header */}
      <div className="card-flat flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shrink-0">
        <div className="flex items-center gap-3">
          {/* Back & Up Navigation */}
          <div className="flex items-center gap-1.5 pr-3 border-r border-[var(--border-default)]">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary h-8 px-2.5 text-[12px] flex items-center gap-1"
              title={tNg('back')}
            >
              <ArrowLeft size={14} />
              <span>{tNg('back')}</span>
            </button>
            <Link
              href="/quality"
              className="btn btn-secondary h-8 px-2.5 text-[12px] flex items-center gap-1"
              title={tNg('list')}
            >
              <ArrowUpFromLine size={14} />
              <span>{tNg('list')}</span>
            </Link>
          </div>

          <div className="p-2 rounded-lg bg-[var(--tint-blue-bg)] text-[var(--accent-blue)] shrink-0">
            <ScanLine size={20} />
          </div>

          <div>
            <h1 className="text-[17px] font-bold text-[var(--text-primary)] leading-tight">
              {t('title')}
            </h1>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Action: Monthly Report PDF */}
        <a
          href={`/api/qc/monthly-report/pdf?month=${startDate.slice(0, 7)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary h-8 px-3 text-[12px] flex items-center gap-1.5 font-semibold text-[var(--accent)] hover:bg-[var(--tint-teal-bg)]"
        >
          <FileDown size={14} />
          <span>{t('downloadMonthlyPdf')}</span>
        </a>
      </div>

      {/* 2. Filter Bar */}
      <InspectionFilterBar
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        selectedMachine={selectedMachine}
        onMachineChange={setSelectedMachine}
        machines={machines}
        onRefresh={loadData}
        loading={loading}
      />

      {/* 3. KPI Cards */}
      <InspectionKpiCards summary={summary} />

      {/* 4. Reconciliation Table */}
      <ReconciliationTable items={items} />
    </div>
  );
}
