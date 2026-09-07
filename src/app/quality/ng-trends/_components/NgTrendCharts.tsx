'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, BarChart3, Calendar, Factory } from 'lucide-react';
import { TimeSeriesPoint, MachineOption } from '../actions';

interface Props {
  timeSeries: TimeSeriesPoint[];
  threshold: number;
  machines: MachineOption[];
  groupBy: 'day' | 'week' | 'month';
  onGroupByChange: (g: 'day' | 'week' | 'month') => void;
}

const DEFECT_COLORS = {
  qty_ng_a: '#EF4444', // 成形不良 (Red)
  qty_ng_b: '#F97316', // 抜きズレ (Orange)
  qty_ng_c: '#F59E0B', // スタッキング (Amber)
  qty_ng_d: '#8B5CF6', // 異物 (Purple)
  qty_ng_e: '#3B82F6', // キズ (Blue)
  qty_ng_f: '#10B981', // 汚れ (Emerald)
  qty_ng_g: '#64748B', // その他 (Slate)
};

export default function NgTrendCharts({
  timeSeries,
  threshold,
  machines,
  groupBy,
  onGroupByChange,
}: Props) {
  const t = useTranslations('NgTrends');

  // Active lines for machines in LineChart
  const [showMachineLines, setShowMachineLines] = useState(false);

  // Group label helper
  const getGroupLabel = (key: string) => {
    switch (key) {
      case 'qty_ng_a': return t('groupA');
      case 'qty_ng_b': return t('groupB');
      case 'qty_ng_c': return t('groupC');
      case 'qty_ng_d': return t('groupD');
      case 'qty_ng_e': return t('groupE');
      case 'qty_ng_f': return t('groupF');
      case 'qty_ng_g': return t('groupG');
      default: return key;
    }
  };

  // Extract all distinct machine codes present in timeSeries
  const availableMachineCodes = useMemo(() => {
    const set = new Set<string>();
    timeSeries.forEach((pt) => {
      if (pt.machineRates) {
        Object.keys(pt.machineRates).forEach((m) => set.add(m));
      }
    });
    return Array.from(set).sort();
  }, [timeSeries]);

  // Flatten timeSeries data so recharts Line can access pt[mCode]
  const lineChartData = useMemo(() => {
    return timeSeries.map((pt) => {
      const row: any = {
        displayDate: pt.displayDate,
        ngRate: pt.ngRate,
        totalOk: pt.totalOk,
        totalNg: pt.totalNg,
      };
      if (pt.machineRates) {
        Object.entries(pt.machineRates).forEach(([mCode, rate]) => {
          row[mCode] = rate;
        });
      }
      return row;
    });
  }, [timeSeries]);

  // Machine line colors generator
  const getMachineColor = (index: number) => {
    const palette = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2', '#4F46E5', '#EA580C'];
    return palette[index % palette.length];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Line Chart: NG Rate (%) over time */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex flex-col shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-[var(--border-default)]/60">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[var(--accent)]" />
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">
              {t('lineChartTitle')}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Granularity Toggle */}
            <div className="flex items-center bg-[var(--bg-muted)] p-0.5 rounded border border-[var(--border-default)] text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => onGroupByChange('day')}
                className={`px-2 py-0.5 rounded ${
                  groupBy === 'day' ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-bold shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                {t('viewByDate')}
              </button>
              <button
                type="button"
                onClick={() => onGroupByChange('week')}
                className={`px-2 py-0.5 rounded ${
                  groupBy === 'week' ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-bold shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                {t('week')}
              </button>
              <button
                type="button"
                onClick={() => onGroupByChange('month')}
                className={`px-2 py-0.5 rounded ${
                  groupBy === 'month' ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-bold shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                {t('month')}
              </button>
            </div>

            {/* Toggle machine lines */}
            {availableMachineCodes.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMachineLines(!showMachineLines)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors ${
                  showMachineLines
                    ? 'bg-[var(--tint-teal-bg)] text-[var(--accent)] border-[var(--accent)] font-bold'
                    : 'border-[var(--border-default)] text-[var(--text-muted)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                {showMachineLines ? t('machineViewOn') : t('machineViewOff')}
              </button>
            )}
          </div>
        </div>

        <div className="h-[280px] w-full">
          {lineChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[13px] text-[var(--text-muted)]">
              {t('noData')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" opacity={0.5} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  unit="%"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  domain={[0, (dataMax: number) => Math.max(Math.ceil(dataMax + 1), Math.ceil(threshold + 1))]}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Number(value || 0).toFixed(2)}%`,
                    name === 'ngRate' ? t('overallAverage') : name,
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-default)',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
                  formatter={(value) => (value === 'ngRate' ? t('overallAverage') : value)}
                />

                {/* Threshold reference line */}
                <ReferenceLine
                  y={threshold}
                  stroke="var(--status-error)"
                  strokeDasharray="4 4"
                  label={{
                    value: `Threshold ${threshold}%`,
                    fill: 'var(--status-error)',
                    fontSize: 10,
                    position: 'top',
                  }}
                />

                {/* Overall NG Rate Line */}
                <Line
                  type="monotone"
                  dataKey="ngRate"
                  name="ngRate"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: 'var(--accent)' }}
                  activeDot={{ r: 5 }}
                />

                {/* Optional Machine-specific Lines */}
                {showMachineLines &&
                  availableMachineCodes.map((mCode, idx) => (
                    <Line
                      key={mCode}
                      type="monotone"
                      dataKey={mCode}
                      name={mCode}
                      stroke={getMachineColor(idx)}
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      dot={false}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Stacked Bar Chart: Defect Group Breakdown */}
      <div className="card-flat p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-default)]/60">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[var(--accent)]" />
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">
              {t('barChartTitle')}
            </h2>
          </div>
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            A〜G 7グループ別
          </span>
        </div>

        <div className="h-[280px] w-full">
          {timeSeries.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[13px] text-[var(--text-muted)]">
              {t('noData')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" opacity={0.5} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} pcs`, getGroupLabel(name)]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-default)',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
                  formatter={(value) => getGroupLabel(value)}
                />

                <Bar dataKey="qty_ng_a" stackId="a" fill={DEFECT_COLORS.qty_ng_a} name="qty_ng_a" />
                <Bar dataKey="qty_ng_b" stackId="a" fill={DEFECT_COLORS.qty_ng_b} name="qty_ng_b" />
                <Bar dataKey="qty_ng_c" stackId="a" fill={DEFECT_COLORS.qty_ng_c} name="qty_ng_c" />
                <Bar dataKey="qty_ng_d" stackId="a" fill={DEFECT_COLORS.qty_ng_d} name="qty_ng_d" />
                <Bar dataKey="qty_ng_e" stackId="a" fill={DEFECT_COLORS.qty_ng_e} name="qty_ng_e" />
                <Bar dataKey="qty_ng_f" stackId="a" fill={DEFECT_COLORS.qty_ng_f} name="qty_ng_f" />
                <Bar dataKey="qty_ng_g" stackId="a" fill={DEFECT_COLORS.qty_ng_g} name="qty_ng_g" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
