import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { MonthlyQCPDFDocument, MonthlyQCPDFProps } from '@/components/pdf/MonthlyQCPDFDocument';
import {
  getNgGroupBreakdown,
  getMachineNgRanking,
  getProductNgRanking,
} from '@/app/quality/ng-trends/actions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get('month') || new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const dateFrom = `${monthParam}-01`;
  const dateTo = `${monthParam}-31`;

  const supabase = await createClient();

  // 1. Fetch forming data from actions
  const [breakdown, machineRanking, productRanking] = await Promise.all([
    getNgGroupBreakdown(dateFrom, dateTo),
    getMachineNgRanking(dateFrom, dateTo, 3.0),
    getProductNgRanking(dateFrom, dateTo),
  ]);

  // 2. Fetch inspection data for reconciliation
  const { data: inspectionLogs } = await supabase
    .from('inspection_daily_logs')
    .select(`
      log_id,
      log_date,
      lot_size,
      sample_size,
      result,
      qty_wc,
      qty_sc,
      qty_dt,
      qty_fm,
      qty_bh,
      qty_br,
      qty_sd,
      qty_ot
    `)
    .gte('log_date', dateFrom)
    .lte('log_date', dateTo);

  let totalInspectionNg = 0;
  let inspectedLotsCount = inspectionLogs?.length || 0;

  if (inspectionLogs) {
    for (const log of inspectionLogs) {
      const rowNg =
        (log.qty_wc || 0) +
        (log.qty_sc || 0) +
        (log.qty_dt || 0) +
        (log.qty_fm || 0) +
        (log.qty_bh || 0) +
        (log.qty_br || 0) +
        (log.qty_sd || 0) +
        (log.qty_ot || 0);
      totalInspectionNg += rowNg;
    }
  }

  const totalFormingNg = breakdown.summary.totalNg;
  const totalCombinedNg = totalFormingNg + totalInspectionNg;

  // Japanese group names mapping
  const groupLabelMap: Record<string, string> = {
    groupA: '成形不良 (A)',
    groupB: '抜きズレ不良 (B)',
    groupC: 'スタッキング不良 (C)',
    groupD: '異物混入 (D)',
    groupE: 'キズ (E)',
    groupF: '汚れ (F)',
    groupG: 'その他 (G)',
  };

  const formattedGroups = breakdown.summary.pareto.map((g) => ({
    key: g.key,
    labelJA: groupLabelMap[g.nameKey] || g.key,
    count: g.count,
    pctOfNg: g.pctOfNg,
    cumulativePct: g.cumulativePct,
  }));

  const pdfProps: MonthlyQCPDFProps = {
    month: monthParam,
    issuedDate: new Date().toISOString().slice(0, 10),
    kpis: {
      totalOk: breakdown.summary.totalOk,
      totalNg: totalCombinedNg,
      totalOutput: breakdown.summary.totalOutput + totalInspectionNg,
      ngRate:
        breakdown.summary.totalOutput + totalInspectionNg > 0
          ? Number(
              (
                (totalCombinedNg /
                  (breakdown.summary.totalOutput + totalInspectionNg)) *
                100
              ).toFixed(2)
            )
          : 0,
    },
    groups: formattedGroups,
    machines: machineRanking,
    products: productRanking,
    reconciliation: {
      totalFormingNg,
      totalInspectionNg,
      totalCombinedNg,
      deltaNg: totalInspectionNg,
      inspectedLotsCount,
    },
  };

  try {
    const buffer = await renderToBuffer(
      React.createElement(MonthlyQCPDFDocument as React.ComponentType<any>, pdfProps)
    );

    const filenameMonth = monthParam.replace('-', '');
    const filename = `QC_Report_${filenameMonth}_YSD.pdf`;

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('Failed to generate Monthly QC PDF:', err);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: err?.message },
      { status: 500 }
    );
  }
}
