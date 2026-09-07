'use server';

import { createClient } from '@/lib/supabase/server';

export interface FormingDefects {
  qty_ng_a: number;
  qty_ng_b: number;
  qty_ng_c: number;
  qty_ng_d: number;
  qty_ng_e: number;
  qty_ng_f: number;
  qty_ng_g: number;
}

export interface KcsDefects {
  qty_wc: number;
  qty_sc: number;
  qty_dt: number;
  qty_fm: number;
  qty_bh: number;
  qty_br: number;
  qty_sd: number;
  qty_ot: number;
}

export interface ReconciliationItem {
  id: string;
  logDate: string;
  scheduleId: string | null;
  machineId: string | null;
  machineCode: string;
  machineName: string;
  productId: string;
  productCode: string;
  productName: string;
  formingOk: number;
  formingNg: number;
  formingDefects: FormingDefects;
  inspectionNg: number;
  inspectionDefects: KcsDefects;
  combinedNg: number;
  deltaNg: number; // additional NG found by KCS
  lotSize: number | null;
  sampleSize: number | null;
  kcsResult: 'PASS' | 'FAIL' | 'CONDITIONAL' | 'UNINSPECTED';
  inspectorName: string;
  matchedMethod: 'SCHEDULE' | 'FALLBACK' | 'UNMATCHED';
  isDiscrepancyHigh: boolean;
  notes: string | null;
}

export interface ReconciliationSummary {
  totalFormingNg: number;
  totalInspectionNg: number;
  totalCombinedNg: number;
  totalOk: number;
  totalLots: number;
  matchedCount: number;
  uninspectedCount: number;
  passCount: number;
  failCount: number;
  conditionalCount: number;
}

export async function getKcsReconciliationData(
  dateFrom: string,
  dateTo: string,
  machineId?: string
) {
  const supabase = await createClient();

  // 1. Fetch Forming Daily Logs in date range
  const { data: formingLogs, error: fErr } = await supabase
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
      notes,
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
    .order('log_date', { ascending: false });

  if (fErr) {
    console.error('Error querying forming_daily_logs:', fErr);
  }

  // 2. Fetch Inspection Daily Logs in date range
  const { data: rawInspectionLogs, error: iErr } = await supabase
    .from('inspection_daily_logs')
    .select(`
      log_id,
      log_date,
      product_id,
      order_line_id,
      inspector_id,
      lot_size,
      sample_size,
      result,
      disposition,
      notes,
      qty_wc,
      qty_sc,
      qty_dt,
      qty_fm,
      qty_bh,
      qty_br,
      qty_sd,
      qty_ot,
      employees!inspection_daily_logs_inspector_id_fkey (
        employee_name
      ),
      products (
        product_id,
        product_code,
        product_name_internal,
        product_name
      )
    `)
    .gte('log_date', dateFrom)
    .lte('log_date', dateTo)
    .order('log_date', { ascending: false });

  if (iErr) {
    console.error('Error querying inspection_daily_logs:', iErr);
  }

  // Cast inspection logs to handle optional schedule_id from Migration 095 safely
  const inspectionLogs = (rawInspectionLogs || []) as any[];

  // 3. Index inspection logs: by schedule_id and by product_id + log_date
  const inspectionBySchedule = new Map<string, any[]>();
  const inspectionByProductDate = new Map<string, any[]>();
  const usedInspectionLogIds = new Set<string>();

  for (const ins of inspectionLogs) {
    if (ins.schedule_id) {
      if (!inspectionBySchedule.has(ins.schedule_id)) {
        inspectionBySchedule.set(ins.schedule_id, []);
      }
      inspectionBySchedule.get(ins.schedule_id)!.push(ins);
    }

    if (ins.product_id && ins.log_date) {
      const key = `${ins.product_id}_${ins.log_date}`;
      if (!inspectionByProductDate.has(key)) {
        inspectionByProductDate.set(key, []);
      }
      inspectionByProductDate.get(key)!.push(ins);
    }
  }

  // 4. Reconcile forming logs with inspection logs
  const results: ReconciliationItem[] = [];
  let totalFormingNg = 0;
  let totalInspectionNg = 0;
  let totalOk = 0;
  let passCount = 0;
  let failCount = 0;
  let conditionalCount = 0;
  let matchedCount = 0;

  for (const f of formingLogs || []) {
    const machine = (f.production_schedules as any)?.machines;
    const fMachineId = machine?.machine_id || (f.production_schedules as any)?.machine_id || null;
    const machineCode = machine?.machine_code || '—';
    const machineName = machine?.machine_name || '';

    // Apply machine filter if specified
    if (machineId && fMachineId !== machineId) {
      continue;
    }

    const prod = f.products as any;
    const productId = f.product_id || prod?.product_id || 'UNKNOWN';
    const productCode = prod?.product_code || '—';
    const productName = prod?.product_name_internal || prod?.product_name || '—';

    const formingDefects: FormingDefects = {
      qty_ng_a: f.qty_ng_a || 0,
      qty_ng_b: f.qty_ng_b || 0,
      qty_ng_c: f.qty_ng_c || 0,
      qty_ng_d: f.qty_ng_d || 0,
      qty_ng_e: f.qty_ng_e || 0,
      qty_ng_f: f.qty_ng_f || 0,
      qty_ng_g: f.qty_ng_g || 0,
    };
    const rowFormingNg = Object.values(formingDefects).reduce((a, b) => a + b, 0);
    const rowOk = f.qty_ok || 0;

    totalFormingNg += rowFormingNg;
    totalOk += rowOk;

    // Match inspection log
    let matchedIns: any = null;
    let matchType: 'SCHEDULE' | 'FALLBACK' | 'UNMATCHED' = 'UNMATCHED';

    if (f.schedule_id && inspectionBySchedule.has(f.schedule_id)) {
      const candidates = inspectionBySchedule.get(f.schedule_id)!;
      matchedIns = candidates.find((c) => !usedInspectionLogIds.has(c.log_id)) || candidates[0];
      if (matchedIns) {
        matchType = 'SCHEDULE';
        usedInspectionLogIds.add(matchedIns.log_id);
      }
    }

    if (!matchedIns && f.product_id && f.log_date) {
      const key = `${f.product_id}_${f.log_date}`;
      if (inspectionByProductDate.has(key)) {
        const candidates = inspectionByProductDate.get(key)!;
        matchedIns = candidates.find((c) => !usedInspectionLogIds.has(c.log_id)) || candidates[0];
        if (matchedIns) {
          matchType = 'FALLBACK';
          usedInspectionLogIds.add(matchedIns.log_id);
        }
      }
    }

    const inspectionDefects: KcsDefects = {
      qty_wc: matchedIns?.qty_wc || 0,
      qty_sc: matchedIns?.qty_sc || 0,
      qty_dt: matchedIns?.qty_dt || 0,
      qty_fm: matchedIns?.qty_fm || 0,
      qty_bh: matchedIns?.qty_bh || 0,
      qty_br: matchedIns?.qty_br || 0,
      qty_sd: matchedIns?.qty_sd || 0,
      qty_ot: matchedIns?.qty_ot || 0,
    };

    const rowInspectionNg = Object.values(inspectionDefects).reduce((a, b) => a + b, 0);
    totalInspectionNg += rowInspectionNg;

    const combinedNg = rowFormingNg + rowInspectionNg;
    const deltaNg = rowInspectionNg; // extra NG found in inspection

    let kcsResult: 'PASS' | 'FAIL' | 'CONDITIONAL' | 'UNINSPECTED' = 'UNINSPECTED';
    if (matchedIns) {
      matchedCount++;
      const res = (matchedIns.result || '').toUpperCase();
      if (res === 'FAIL') {
        kcsResult = 'FAIL';
        failCount++;
      } else if (res === 'CONDITIONAL') {
        kcsResult = 'CONDITIONAL';
        conditionalCount++;
      } else {
        kcsResult = 'PASS';
        passCount++;
      }
    }

    // High discrepancy flag: if KCS found > 5 defects or > 20% of forming quantity
    const isDiscrepancyHigh =
      kcsResult === 'FAIL' ||
      (rowInspectionNg > 5 && rowInspectionNg > rowFormingNg * 0.2);

    results.push({
      id: f.log_id,
      logDate: f.log_date,
      scheduleId: f.schedule_id,
      machineId: fMachineId,
      machineCode,
      machineName,
      productId,
      productCode,
      productName,
      formingOk: rowOk,
      formingNg: rowFormingNg,
      formingDefects,
      inspectionNg: rowInspectionNg,
      inspectionDefects,
      combinedNg,
      deltaNg,
      lotSize: matchedIns?.lot_size || null,
      sampleSize: matchedIns?.sample_size || null,
      kcsResult,
      inspectorName: matchedIns?.employees?.employee_name || (matchedIns ? 'KCS担当' : '—'),
      matchedMethod: matchType,
      isDiscrepancyHigh,
      notes: matchedIns?.notes || f.notes || null,
    });
  }

  const totalCombinedNg = totalFormingNg + totalInspectionNg;
  const totalLots = results.length;
  const uninspectedCount = totalLots - matchedCount;

  const summary: ReconciliationSummary = {
    totalFormingNg,
    totalInspectionNg,
    totalCombinedNg,
    totalOk,
    totalLots,
    matchedCount,
    uninspectedCount,
    passCount,
    failCount,
    conditionalCount,
  };

  return {
    reconciliation: results,
    summary,
  };
}
