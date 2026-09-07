'use server';

import { createClient } from '@/lib/supabase/server';
import { format, parseISO, startOfWeek } from 'date-fns';

export interface DefectGroupItem {
  key: string; // e.g. 'qty_ng_a'
  nameKey: string; // e.g. 'groupA'
  count: number;
  pctOfNg: number;
}

export interface ParetoItem extends DefectGroupItem {
  cumulativePct: number;
}

export interface NgTrendKpiSummary {
  totalOk: number;
  totalNg: number;
  totalOutput: number;
  ngRate: number; // %
  topGroupKey: string;
  topGroupNameKey: string;
  topGroupCount: number;
  topGroupPct: number;
  groups: DefectGroupItem[];
  pareto: ParetoItem[];
}

export interface TimeSeriesPoint {
  period: string;
  displayDate: string;
  totalOk: number;
  totalNg: number;
  totalOutput: number;
  ngRate: number; // %
  qty_ng_a: number;
  qty_ng_b: number;
  qty_ng_c: number;
  qty_ng_d: number;
  qty_ng_e: number;
  qty_ng_f: number;
  qty_ng_g: number;
  machineRates?: Record<string, number>;
}

export interface MachineNgRankingItem {
  rank: number;
  machineId: string;
  machineCode: string;
  machineName: string;
  totalOk: number;
  totalNg: number;
  totalOutput: number;
  ngRate: number;
  isAlert: boolean;
}

export interface ProductNgRankingItem {
  rank: number;
  productId: string;
  productCode: string;
  productName: string;
  totalOk: number;
  totalNg: number;
  totalOutput: number;
  ngRate: number;
}

export interface MachineOption {
  machine_id: string;
  machine_code: string;
  machine_name: string;
}

const DEFECT_KEYS = [
  { key: 'qty_ng_a', nameKey: 'groupA' },
  { key: 'qty_ng_b', nameKey: 'groupB' },
  { key: 'qty_ng_c', nameKey: 'groupC' },
  { key: 'qty_ng_d', nameKey: 'groupD' },
  { key: 'qty_ng_e', nameKey: 'groupE' },
  { key: 'qty_ng_f', nameKey: 'groupF' },
  { key: 'qty_ng_g', nameKey: 'groupG' },
] as const;

/**
 * Fetch all active thermoforming machines for the filter dropdown
 */
export async function getActiveMachines(): Promise<MachineOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('machines')
    .select('machine_id, machine_code, machine_name')
    .eq('is_active', true)
    .order('machine_code', { ascending: true });

  if (error) {
    console.error('Error fetching active machines:', error);
    return [];
  }
  return data || [];
}

/**
 * Common fetcher for forming_daily_logs joined with production_schedules & products
 */
async function fetchRawFormingLogs(dateFrom: string, dateTo: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('forming_daily_logs')
    .select(`
      log_id,
      log_date,
      qty_ok,
      qty_ng_a,
      qty_ng_b,
      qty_ng_c,
      qty_ng_d,
      qty_ng_e,
      qty_ng_f,
      qty_ng_g,
      product_id,
      schedule_id,
      products (
        product_id,
        product_code,
        product_name_internal,
        product_name
      ),
      production_schedules!forming_daily_logs_schedule_id_fkey (
        schedule_id,
        machine_id,
        machines (
          machine_id,
          machine_code,
          machine_name
        )
      )
    `)
    .gte('log_date', dateFrom)
    .lte('log_date', dateTo)
    .order('log_date', { ascending: true });

  if (error) {
    console.error('Error fetching forming daily logs:', error);
    return [];
  }

  return data || [];
}

/**
 * 1. Time Series: Group NG rate and defect group breakdown by day / week / month
 */
export async function getNgTrendTimeSeries(
  dateFrom: string,
  dateTo: string,
  machineId?: string,
  groupBy: 'day' | 'week' | 'month' = 'day'
): Promise<TimeSeriesPoint[]> {
  const rawLogs = await fetchRawFormingLogs(dateFrom, dateTo);

  // Filter by machine if provided
  const logs = machineId
    ? rawLogs.filter((l) => (l.production_schedules as any)?.machine_id === machineId)
    : rawLogs;

  const grouped = new Map<
    string,
    {
      period: string;
      displayDate: string;
      totalOk: number;
      qty_ng_a: number;
      qty_ng_b: number;
      qty_ng_c: number;
      qty_ng_d: number;
      qty_ng_e: number;
      qty_ng_f: number;
      qty_ng_g: number;
      machineStats: Map<string, { ok: number; ng: number }>;
    }
  >();

  for (const log of logs) {
    const logDate = log.log_date;
    if (!logDate) continue;

    let periodKey = logDate;
    let display = logDate;

    try {
      const parsedDate = parseISO(logDate);
      if (groupBy === 'week') {
        const start = startOfWeek(parsedDate, { weekStartsOn: 1 });
        periodKey = format(start, 'yyyy-MM-dd');
        display = `W (${format(start, 'MM/dd')}~)`;
      } else if (groupBy === 'month') {
        periodKey = format(parsedDate, 'yyyy-MM');
        display = format(parsedDate, 'yyyy年MM月');
      }
    } catch {
      periodKey = logDate;
      display = logDate;
    }

    if (!grouped.has(periodKey)) {
      grouped.set(periodKey, {
        period: periodKey,
        displayDate: display,
        totalOk: 0,
        qty_ng_a: 0,
        qty_ng_b: 0,
        qty_ng_c: 0,
        qty_ng_d: 0,
        qty_ng_e: 0,
        qty_ng_f: 0,
        qty_ng_g: 0,
        machineStats: new Map(),
      });
    }

    const bucket = grouped.get(periodKey)!;
    bucket.totalOk += log.qty_ok || 0;
    bucket.qty_ng_a += log.qty_ng_a || 0;
    bucket.qty_ng_b += log.qty_ng_b || 0;
    bucket.qty_ng_c += log.qty_ng_c || 0;
    bucket.qty_ng_d += log.qty_ng_d || 0;
    bucket.qty_ng_e += log.qty_ng_e || 0;
    bucket.qty_ng_f += log.qty_ng_f || 0;
    bucket.qty_ng_g += log.qty_ng_g || 0;

    const rowNg =
      (log.qty_ng_a || 0) +
      (log.qty_ng_b || 0) +
      (log.qty_ng_c || 0) +
      (log.qty_ng_d || 0) +
      (log.qty_ng_e || 0) +
      (log.qty_ng_f || 0) +
      (log.qty_ng_g || 0);

    const mCode = (log.production_schedules as any)?.machines?.machine_code;
    if (mCode) {
      if (!bucket.machineStats.has(mCode)) {
        bucket.machineStats.set(mCode, { ok: 0, ng: 0 });
      }
      const ms = bucket.machineStats.get(mCode)!;
      ms.ok += log.qty_ok || 0;
      ms.ng += rowNg;
    }
  }

  const result: TimeSeriesPoint[] = [];
  for (const [_, b] of grouped.entries()) {
    const totalNg =
      b.qty_ng_a +
      b.qty_ng_b +
      b.qty_ng_c +
      b.qty_ng_d +
      b.qty_ng_e +
      b.qty_ng_f +
      b.qty_ng_g;
    const totalOutput = b.totalOk + totalNg;
    const ngRate = totalOutput > 0 ? Number(((totalNg / totalOutput) * 100).toFixed(2)) : 0;

    const machineRates: Record<string, number> = {};
    for (const [mCode, ms] of b.machineStats.entries()) {
      const mOutput = ms.ok + ms.ng;
      machineRates[mCode] = mOutput > 0 ? Number(((ms.ng / mOutput) * 100).toFixed(2)) : 0;
    }

    result.push({
      period: b.period,
      displayDate: b.displayDate,
      totalOk: b.totalOk,
      totalNg,
      totalOutput,
      ngRate,
      qty_ng_a: b.qty_ng_a,
      qty_ng_b: b.qty_ng_b,
      qty_ng_c: b.qty_ng_c,
      qty_ng_d: b.qty_ng_d,
      qty_ng_e: b.qty_ng_e,
      qty_ng_f: b.qty_ng_f,
      qty_ng_g: b.qty_ng_g,
      machineRates,
    });
  }

  return result.sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * 2. Defect Group Breakdown & Pareto Analysis
 */
export async function getNgGroupBreakdown(
  dateFrom: string,
  dateTo: string,
  machineId?: string
): Promise<{ summary: NgTrendKpiSummary; groupTotals: Record<string, number> }> {
  const rawLogs = await fetchRawFormingLogs(dateFrom, dateTo);
  const logs = machineId
    ? rawLogs.filter((l) => (l.production_schedules as any)?.machine_id === machineId)
    : rawLogs;

  let totalOk = 0;
  const groupTotals: Record<string, number> = {
    qty_ng_a: 0,
    qty_ng_b: 0,
    qty_ng_c: 0,
    qty_ng_d: 0,
    qty_ng_e: 0,
    qty_ng_f: 0,
    qty_ng_g: 0,
  };

  for (const log of logs) {
    totalOk += log.qty_ok || 0;
    groupTotals.qty_ng_a += log.qty_ng_a || 0;
    groupTotals.qty_ng_b += log.qty_ng_b || 0;
    groupTotals.qty_ng_c += log.qty_ng_c || 0;
    groupTotals.qty_ng_d += log.qty_ng_d || 0;
    groupTotals.qty_ng_e += log.qty_ng_e || 0;
    groupTotals.qty_ng_f += log.qty_ng_f || 0;
    groupTotals.qty_ng_g += log.qty_ng_g || 0;
  }

  const totalNg = Object.values(groupTotals).reduce((a, b) => a + b, 0);
  const totalOutput = totalOk + totalNg;
  const ngRate = totalOutput > 0 ? Number(((totalNg / totalOutput) * 100).toFixed(2)) : 0;

  // Groups list sorted by count descending
  const groups: DefectGroupItem[] = DEFECT_KEYS.map((item) => {
    const count = groupTotals[item.key] || 0;
    const pctOfNg = totalNg > 0 ? Number(((count / totalNg) * 100).toFixed(1)) : 0;
    return {
      key: item.key,
      nameKey: item.nameKey,
      count,
      pctOfNg,
    };
  }).sort((a, b) => b.count - a.count);

  // Top defect group
  const topGroup = groups[0] || {
    key: 'qty_ng_a',
    nameKey: 'groupA',
    count: 0,
    pctOfNg: 0,
  };

  // Pareto cumulative percentage
  let cumulativeSum = 0;
  const pareto: ParetoItem[] = groups.map((g) => {
    cumulativeSum += g.count;
    const cumulativePct =
      totalNg > 0 ? Number(((cumulativeSum / totalNg) * 100).toFixed(1)) : 0;
    return {
      ...g,
      cumulativePct,
    };
  });

  return {
    summary: {
      totalOk,
      totalNg,
      totalOutput,
      ngRate,
      topGroupKey: topGroup.key,
      topGroupNameKey: topGroup.nameKey,
      topGroupCount: topGroup.count,
      topGroupPct: topGroup.pctOfNg,
      groups,
      pareto,
    },
    groupTotals,
  };
}

/**
 * 3. Machine Ranking: Ranking machines by NG rate descending
 */
export async function getMachineNgRanking(
  dateFrom: string,
  dateTo: string,
  thresholdPct: number = 3.0
): Promise<MachineNgRankingItem[]> {
  const logs = await fetchRawFormingLogs(dateFrom, dateTo);

  const machineMap = new Map<
    string,
    {
      machineId: string;
      machineCode: string;
      machineName: string;
      totalOk: number;
      totalNg: number;
    }
  >();

  for (const log of logs) {
    const machine = (log.production_schedules as any)?.machines;
    const machineId = machine?.machine_id || (log.production_schedules as any)?.machine_id || 'UNKNOWN';
    const machineCode = machine?.machine_code || 'Chưa gán máy';
    const machineName = machine?.machine_name || '';

    if (!machineMap.has(machineId)) {
      machineMap.set(machineId, {
        machineId,
        machineCode,
        machineName,
        totalOk: 0,
        totalNg: 0,
      });
    }

    const item = machineMap.get(machineId)!;
    item.totalOk += log.qty_ok || 0;
    const rowNg =
      (log.qty_ng_a || 0) +
      (log.qty_ng_b || 0) +
      (log.qty_ng_c || 0) +
      (log.qty_ng_d || 0) +
      (log.qty_ng_e || 0) +
      (log.qty_ng_f || 0) +
      (log.qty_ng_g || 0);
    item.totalNg += rowNg;
  }

  const rankingList: MachineNgRankingItem[] = [];
  for (const [_, item] of machineMap.entries()) {
    const totalOutput = item.totalOk + item.totalNg;
    const ngRate = totalOutput > 0 ? Number(((item.totalNg / totalOutput) * 100).toFixed(2)) : 0;
    rankingList.push({
      rank: 0,
      machineId: item.machineId,
      machineCode: item.machineCode,
      machineName: item.machineName,
      totalOk: item.totalOk,
      totalNg: item.totalNg,
      totalOutput,
      ngRate,
      isAlert: ngRate >= thresholdPct,
    });
  }

  // Sort by NG rate descending (or total NG if rates equal)
  rankingList.sort((a, b) => b.ngRate - a.ngRate || b.totalNg - a.totalNg);
  rankingList.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return rankingList;
}

/**
 * 4. Product Ranking: Ranking products by defect quantity descending
 */
export async function getProductNgRanking(
  dateFrom: string,
  dateTo: string
): Promise<ProductNgRankingItem[]> {
  const logs = await fetchRawFormingLogs(dateFrom, dateTo);

  const productMap = new Map<
    string,
    {
      productId: string;
      productCode: string;
      productName: string;
      totalOk: number;
      totalNg: number;
    }
  >();

  for (const log of logs) {
    const p = log.products as any;
    const productId = log.product_id || p?.product_id || 'UNKNOWN';
    const productCode = p?.product_code || '—';
    const productName = p?.product_name_internal || p?.product_name || '—';

    if (!productMap.has(productId)) {
      productMap.set(productId, {
        productId,
        productCode,
        productName,
        totalOk: 0,
        totalNg: 0,
      });
    }

    const item = productMap.get(productId)!;
    item.totalOk += log.qty_ok || 0;
    const rowNg =
      (log.qty_ng_a || 0) +
      (log.qty_ng_b || 0) +
      (log.qty_ng_c || 0) +
      (log.qty_ng_d || 0) +
      (log.qty_ng_e || 0) +
      (log.qty_ng_f || 0) +
      (log.qty_ng_g || 0);
    item.totalNg += rowNg;
  }

  const rankingList: ProductNgRankingItem[] = [];
  for (const [_, item] of productMap.entries()) {
    const totalOutput = item.totalOk + item.totalNg;
    const ngRate = totalOutput > 0 ? Number(((item.totalNg / totalOutput) * 100).toFixed(2)) : 0;
    rankingList.push({
      rank: 0,
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      totalOk: item.totalOk,
      totalNg: item.totalNg,
      totalOutput,
      ngRate,
    });
  }

  // Sort by Total NG descending
  rankingList.sort((a, b) => b.totalNg - a.totalNg || b.ngRate - a.ngRate);
  rankingList.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return rankingList;
}

/**
 * Single consolidated loader for initial page render or filter changes
 */
export async function getNgTrendsDashboardData(
  dateFrom: string,
  dateTo: string,
  machineId?: string,
  groupBy: 'day' | 'week' | 'month' = 'day',
  thresholdPct: number = 3.0
) {
  const [machines, timeSeries, breakdown, machineRanking, productRanking] = await Promise.all([
    getActiveMachines(),
    getNgTrendTimeSeries(dateFrom, dateTo, machineId, groupBy),
    getNgGroupBreakdown(dateFrom, dateTo, machineId),
    getMachineNgRanking(dateFrom, dateTo, thresholdPct),
    getProductNgRanking(dateFrom, dateTo),
  ]);

  return {
    machines,
    timeSeries,
    summary: breakdown.summary,
    machineRanking,
    productRanking,
  };
}
