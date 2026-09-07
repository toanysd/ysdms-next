'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, ArrowUpFromLine } from 'lucide-react';
import NgTrendFilterBar from './_components/NgTrendFilterBar';
import NgTrendKpiCards from './_components/NgTrendKpiCards';
import NgTrendCharts from './_components/NgTrendCharts';
import NgRankingTables from './_components/NgRankingTables';
import {
  getNgTrendsDashboardData,
  MachineOption,
  TimeSeriesPoint,
  NgTrendKpiSummary,
  MachineNgRankingItem,
  ProductNgRankingItem,
} from './actions';

export default function NgTrendsPage() {
  const t = useTranslations('NgTrends');
  const router = useRouter();

  // Date range defaults: 30 days
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filters
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // NG Alert Threshold (default 3.0%, persistent via localStorage)
  const [threshold, setThreshold] = useState<number>(3.0);

  // Data state
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<MachineOption[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [summary, setSummary] = useState<NgTrendKpiSummary>({
    totalOk: 0,
    totalNg: 0,
    totalOutput: 0,
    ngRate: 0,
    topGroupKey: 'qty_ng_a',
    topGroupNameKey: 'groupA',
    topGroupCount: 0,
    topGroupPct: 0,
    groups: [],
    pareto: [],
  });
  const [machineRanking, setMachineRanking] = useState<MachineNgRankingItem[]>([]);
  const [productRanking, setProductRanking] = useState<ProductNgRankingItem[]>([]);

  // 1. Initialize threshold from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ysd_ng_threshold');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val > 0) {
          setThreshold(val);
        }
      }
    } catch {
      // Ignore localStorage errors in SSR/strict modes
    }
  }, []);

  // Update and persist threshold
  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    try {
      localStorage.setItem('ysd_ng_threshold', val.toString());
    } catch {
      // Ignore
    }
  };

  // 2. Fetch dashboard data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNgTrendsDashboardData(
        startDate,
        endDate,
        selectedMachine || undefined,
        groupBy,
        threshold
      );

      setMachines(data.machines);
      setTimeSeries(data.timeSeries);
      setSummary(data.summary);
      setMachineRanking(data.machineRanking);
      setProductRanking(data.productRanking);
    } catch (err) {
      console.error('Failed to load NG trends data:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedMachine, groupBy, threshold]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle single group filtering for timeSeries display
  const filteredTimeSeries = React.useMemo(() => {
    if (selectedGroup === 'ALL') return timeSeries;
    return timeSeries.map((pt) => {
      const val = (pt as any)[selectedGroup] || 0;
      const totalNg = val;
      const totalOutput = pt.totalOk + totalNg;
      const ngRate = totalOutput > 0 ? Number(((totalNg / totalOutput) * 100).toFixed(2)) : 0;
      return {
        ...pt,
        totalNg,
        ngRate,
        qty_ng_a: selectedGroup === 'qty_ng_a' ? pt.qty_ng_a : 0,
        qty_ng_b: selectedGroup === 'qty_ng_b' ? pt.qty_ng_b : 0,
        qty_ng_c: selectedGroup === 'qty_ng_c' ? pt.qty_ng_c : 0,
        qty_ng_d: selectedGroup === 'qty_ng_d' ? pt.qty_ng_d : 0,
        qty_ng_e: selectedGroup === 'qty_ng_e' ? pt.qty_ng_e : 0,
        qty_ng_f: selectedGroup === 'qty_ng_f' ? pt.qty_ng_f : 0,
        qty_ng_g: selectedGroup === 'qty_ng_g' ? pt.qty_ng_g : 0,
      };
    });
  }, [timeSeries, selectedGroup]);

  return (
    <div className="flex flex-col h-full gap-3 p-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* 1. Page Header (per AGENTS.md Rule 2 & Navigation Pattern) */}
      <div className="card-flat flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shrink-0">
        <div className="flex items-center gap-3">
          {/* Back & Up Navigation */}
          <div className="flex items-center gap-1.5 pr-3 border-r border-[var(--border-default)]">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary h-8 px-2.5 text-[12px] flex items-center gap-1"
              title={t('back')}
            >
              <ArrowLeft size={14} />
              <span>{t('back')}</span>
            </button>
            <Link
              href="/quality"
              className="btn btn-secondary h-8 px-2.5 text-[12px] flex items-center gap-1"
              title={t('list')}
            >
              <ArrowUpFromLine size={14} />
              <span>{t('list')}</span>
            </Link>
          </div>

          <div className="p-2 rounded-lg bg-[var(--tint-teal-bg)] text-[var(--accent)] shrink-0">
            <TrendingUp size={20} />
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
      </div>

      {/* 2. Filter Bar */}
      <NgTrendFilterBar
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        selectedMachine={selectedMachine}
        onMachineChange={setSelectedMachine}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        threshold={threshold}
        onThresholdChange={handleThresholdChange}
        machines={machines}
        onRefresh={loadData}
        loading={loading}
      />

      {/* 3. KPI Cards */}
      <NgTrendKpiCards summary={summary} threshold={threshold} />

      {/* 4. Charts: Line Chart + Stacked Bar Chart */}
      <NgTrendCharts
        timeSeries={filteredTimeSeries}
        threshold={threshold}
        machines={machines}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
      />

      {/* 5. Ranking Tables: Machine Ranking + Product Ranking + Pareto */}
      <NgRankingTables
        machineRanking={machineRanking}
        productRanking={productRanking}
        pareto={summary.pareto}
        threshold={threshold}
      />
    </div>
  );
}
