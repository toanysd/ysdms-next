import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ClipboardList, Filter, RefreshCw, Calendar, Factory } from 'lucide-react';
import DailyLogsKpiCards from './_components/DailyLogsKpiCards';
import DailyLogsSummaryTable, { CombinedLogItem } from './_components/DailyLogsSummaryTable';
import DailyLogsTable from './_components/DailyLogsTable';
import FormingLogForm from './_components/FormingLogForm';
import PressLogForm from './_components/PressLogForm';

export const dynamic = 'force-dynamic';

interface DailyLogsPageProps {
  searchParams: {
    tab?: string;
    date?: string;
    machine?: string;
    ng?: string;
  };
}

export default async function DailyLogsPage({ searchParams }: DailyLogsPageProps) {
  const supabase = await createClient();
  const t = await getTranslations('DailyLogs');

  const currentTab = searchParams.tab || 'summary';
  const filterDate = searchParams.date || '';
  const filterMachine = searchParams.machine || '';
  const filterNg = searchParams.ng || 'ALL';

  // 1. Fetch active machines for filter dropdown
  const { data: machines } = await supabase
    .from('machines')
    .select('machine_id, machine_code, machine_name')
    .eq('is_active', true)
    .order('machine_code', { ascending: true });

  // 2. Query Forming Logs with joins
  let formingQuery = supabase
    .from('forming_daily_logs')
    .select(`
      *,
      employees!forming_daily_logs_operator_id_fkey (
        employee_name
      ),
      products (
        product_id,
        product_code,
        product_name_internal
      ),
      equipment!forming_daily_logs_equipment_id_fkey (
        equipment_code,
        display_name
      ),
      production_schedules!forming_daily_logs_schedule_id_fkey (
        schedule_id,
        machine_id,
        machines (
          machine_code,
          machine_name,
          feed_length_mm
        ),
        plastic_receipt_roll (
          roll_barcode,
          plastic_master (
            plastic_code
          )
        )
      )
    `)
    .order('log_date', { ascending: false })
    .limit(100);

  if (filterDate) {
    formingQuery = formingQuery.eq('log_date', filterDate);
  }

  const { data: rawFormingLogs } = await formingQuery;
  const formingLogs = rawFormingLogs || [];

  // 3. Query Press Logs with joins
  let pressQuery = supabase
    .from('press_daily_logs')
    .select(`
      *,
      employees!press_daily_logs_operator_id_fkey (
        employee_name
      ),
      products (
        product_id,
        product_code,
        product_name_internal
      ),
      equipment!press_daily_logs_equipment_id_fkey (
        equipment_code,
        display_name
      ),
      production_schedules!press_daily_logs_schedule_id_fkey (
        schedule_id,
        machine_id,
        machines (
          machine_code,
          machine_name
        )
      )
    `)
    .order('log_date', { ascending: false })
    .limit(100);

  if (filterDate) {
    pressQuery = pressQuery.eq('log_date', filterDate);
  }

  const { data: rawPressLogs } = await pressQuery;
  const pressLogs = rawPressLogs || [];

  // Map press logs by schedule_id or log_date + product_id
  const pressBySchedule = new Map<string, any>();
  for (const p of pressLogs) {
    if (p.schedule_id) {
      pressBySchedule.set(p.schedule_id, p);
    }
  }

  // 4. Build Combined Summary Items
  const combinedItems: CombinedLogItem[] = [];

  for (const f of formingLogs) {
    const sched = Array.isArray(f.production_schedules) ? f.production_schedules[0] : f.production_schedules;
    const mach = sched?.machines;
    const prod = Array.isArray(f.products) ? f.products[0] : f.products;
    const emp = Array.isArray(f.employees) ? f.employees[0] : f.employees;
    const press = f.schedule_id ? pressBySchedule.get(f.schedule_id) : null;

    const machCode = mach?.machine_code || '—';
    const machName = mach?.machine_name || '';
    const feedMm = mach?.feed_length_mm || 0;

    // Filter by machine if selected
    if (filterMachine && sched?.machine_id !== filterMachine) {
      continue;
    }

    const ngA = f.qty_ng_a || 0;
    const ngB = f.qty_ng_b || 0;
    const ngC = f.qty_ng_c || 0;
    const ngD = f.qty_ng_d || 0;
    const ngE = f.qty_ng_e || 0;
    const ngF = f.qty_ng_f || 0;
    const ngG = f.qty_ng_g || 0;
    const totalNg = ngA + ngB + ngC + ngD + ngE + ngF + ngG;

    // Filter by NG status
    if (filterNg === 'NG' && totalNg === 0) continue;
    if (filterNg === 'PASS' && totalNg > 0) continue;

    const totalQty = f.qty_ok + totalNg;
    const ngRate = totalQty > 0 ? (totalNg / totalQty) * 100 : 0;
    const estMeters = feedMm > 0 ? (f.qty_ok * feedMm) / 1000 : 0;

    // Check count
    const checkFields = [
      f.check_heater,
      f.check_mold,
      f.check_cutter,
      f.check_plug,
      f.check_frame,
      f.check_water_base,
      f.check_stacking,
    ];
    const checksOkCount = checkFields.filter(Boolean).length;
    const checksTotal = 7;

    const roll = sched?.plastic_receipt_roll;

    combinedItems.push({
      key: f.log_id,
      schedule_id: f.schedule_id,
      log_date: f.log_date,
      machine_code: machCode,
      machine_name: machName,
      product_id: f.product_id,
      product_code: prod?.product_code || '—',
      product_name_internal: prod?.product_name_internal || null,
      operator_name: emp?.employee_name || '—',
      qty_ok: f.qty_ok || 0,
      qty_ng_total: totalNg,
      ng_rate: ngRate,
      ng_breakdown: {
        a: ngA,
        b: ngB,
        c: ngC,
        d: ngD,
        e: ngE,
        f: ngF,
        g: ngG,
      },
      checks_ok_count: checksOkCount,
      checks_total: checksTotal,
      roll_barcode: f.roll_barcode || roll?.roll_barcode || null,
      plastic_code: roll?.plastic_master?.plastic_code || null,
      feed_length_mm: feedMm > 0 ? feedMm : null,
      consumed_meters_est: estMeters,
      press_shot_count: press?.shot_count ?? null,
      cutter_condition: press?.cutter_condition || null,
    });
  }

  // 5. Calculate KPI Metrics
  const totalOk = combinedItems.reduce((acc, item) => acc + item.qty_ok, 0);
  const totalNg = combinedItems.reduce((acc, item) => acc + item.qty_ng_total, 0);
  const totalProduced = totalOk + totalNg;
  const avgNgRate = totalProduced > 0 ? (totalNg / totalProduced) * 100 : 0;
  const totalMeters = combinedItems.reduce((acc, item) => acc + item.consumed_meters_est, 0);

  // Helper to build URL with search params
  const buildUrl = (updates: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    if (currentTab !== 'summary') sp.set('tab', currentTab);
    if (filterDate) sp.set('date', filterDate);
    if (filterMachine) sp.set('machine', filterMachine);
    if (filterNg !== 'ALL') sp.set('ng', filterNg);

    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') sp.delete(k);
      else sp.set(k, v);
    }
    const q = sp.toString();
    return q ? `?${q}` : '/production/daily-logs';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '12px',
        padding: '12px 16px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* 1. PageHeader (flexShrink: 0) */}
      <div
        className="card-flat flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        style={{ flexShrink: 0, background: 'var(--bg-surface)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--tint-teal-bg)' }}
          >
            <ClipboardList className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>

          <div>
            <h1 className="text-base md:text-lg font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
              {t('title')}
            </h1>
            <p className="text-xs text-slate-500 font-medium m-0">
              成形・抜日報 & 実績集計ダッシュボード
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/production/floor"
            className="btn btn-secondary text-xs flex items-center gap-1.5"
            style={{ minHeight: '36px' }}
          >
            <Factory className="w-3.5 h-3.5 text-teal-600" />
            <span>現場タブレットへ</span>
          </Link>
        </div>
      </div>

      {/* 2. Top KPI Cards */}
      <DailyLogsKpiCards
        totalOk={totalOk}
        totalNg={totalNg}
        avgNgRate={avgNgRate}
        totalMeters={totalMeters}
      />

      {/* 3. FilterBar / TabBar (flexShrink: 0) */}
      <div
        className="card-flat flex flex-wrap items-center justify-between gap-3 px-4 py-2.5"
        style={{ flexShrink: 0, background: 'var(--bg-surface)' }}
      >
        {/* Navigation Tabs */}
        <div className="tab-nav flex items-center gap-1">
          <Link
            href={buildUrl({ tab: 'summary' })}
            className={`tab-item ${currentTab === 'summary' ? 'tab-item--active' : ''}`}
          >
            {t('tabSummary')}
          </Link>
          <Link
            href={buildUrl({ tab: 'forming' })}
            className={`tab-item ${currentTab === 'forming' ? 'tab-item--active' : ''}`}
          >
            {t('tabForming')}
          </Link>
          <Link
            href={buildUrl({ tab: 'press' })}
            className={`tab-item ${currentTab === 'press' ? 'tab-item--active' : ''}`}
          >
            {t('tabPress')}
          </Link>
        </div>

        {/* Filters */}
        <form className="flex items-center gap-2 flex-wrap" method="GET">
          <input type="hidden" name="tab" value={currentTab} />

          {/* Date Picker */}
          <div className="relative">
            <input
              type="date"
              name="date"
              defaultValue={filterDate}
              className="form-input text-xs"
              style={{ minHeight: '36px' }}
            />
          </div>

          {/* Machine Select */}
          <select
            name="machine"
            defaultValue={filterMachine}
            className="form-input text-xs font-medium"
            style={{ minHeight: '36px', minWidth: '130px' }}
          >
            <option value="">{t('filterMachine')}</option>
            {(machines || []).map((m) => (
              <option key={m.machine_id} value={m.machine_id}>
                {m.machine_code} ({m.machine_name})
              </option>
            ))}
          </select>

          {/* NG Filter */}
          <select
            name="ng"
            defaultValue={filterNg}
            className="form-input text-xs font-medium"
            style={{ minHeight: '36px', minWidth: '120px' }}
          >
            <option value="ALL">{t('filterNgAll')}</option>
            <option value="NG">{t('filterNgOnly')}</option>
            <option value="PASS">{t('filterPassOnly')}</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary text-xs px-3"
            style={{ minHeight: '36px' }}
          >
            <Filter className="w-3.5 h-3.5 mr-1" />
            絞込
          </button>

          {(filterDate || filterMachine || filterNg !== 'ALL') && (
            <Link
              href={buildUrl({ date: null, machine: null, ng: 'ALL' })}
              className="btn btn-secondary text-xs px-2.5"
              style={{ minHeight: '36px' }}
            >
              クリア
            </Link>
          )}
        </form>
      </div>

      {/* 4. Content Area (flex: 1, overflow: auto) */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentTab === 'summary' && (
          <DailyLogsSummaryTable items={combinedItems} />
        )}

        {currentTab === 'forming' && (
          <>
            <FormingLogForm />
            <DailyLogsTable logs={(formingLogs as any) || []} type="forming" />
          </>
        )}

        {currentTab === 'press' && (
          <>
            <PressLogForm />
            <DailyLogsTable logs={(pressLogs as any) || []} type="press" />
          </>
        )}
      </div>
    </div>
  );
}
