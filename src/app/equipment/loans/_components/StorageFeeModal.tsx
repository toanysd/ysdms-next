'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Coins,
  Printer,
  Building2,
  Calendar,
  FileText,
  Download,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  SSOT_11_CUSTOMERS,
  STANDARD_MOLD_STORAGE_RATE_JPY,
  type SsotCustomerPartner,
  type DormantMoldRecord,
  type StorageFeePartnerSummary,
} from '../types';
import { getDormantMoldsData } from '../actions';

interface StorageFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestReturn?: (record: DormantMoldRecord) => void;
}

export default function StorageFeeModal({
  isOpen,
  onClose,
  onRequestReturn,
}: StorageFeeModalProps) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('ALL');
  const [unitRate, setUnitRate] = useState<number>(STANDARD_MOLD_STORAGE_RATE_JPY);
  const [filterMode, setFilterMode] = useState<'ALL' | 'DORMANT_ONLY'>('DORMANT_ONLY');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<StorageFeePartnerSummary>({
    partner: null,
    totalMoldsCount: 0,
    dormantMoldsCount: 0,
    activeMoldsCount: 0,
    totalAccumulatedFeeJpy: 0,
    standardMonthlyRate: STANDARD_MOLD_STORAGE_RATE_JPY,
    records: [],
  });

  // Fetch dormant mold and fee calculation data
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setLoading(true);

    getDormantMoldsData(selectedPartnerId, unitRate)
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load dormant molds data:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, selectedPartnerId, unitRate]);

  // Active partner metadata
  const activePartner: SsotCustomerPartner | null = useMemo(() => {
    if (selectedPartnerId === 'ALL') return null;
    return SSOT_11_CUSTOMERS.find((p) => p.id === selectedPartnerId) || null;
  }, [selectedPartnerId]);

  // Filtered records based on filterMode
  const displayedRecords = useMemo(() => {
    if (filterMode === 'DORMANT_ONLY') {
      return data.records.filter((r) => r.is_dormant_3y);
    }
    return data.records;
  }, [data.records, filterMode]);

  if (!isOpen) return null;

  // CSV Export with UTF-8 BOM for Japanese Excel compatibility
  const handleExportCSV = () => {
    if (displayedRecords.length === 0) {
      alert('出力対象の金型データがありません (No records to export).');
      return;
    }

    const partnerLabel = activePartner ? activePartner.nameJA : 'SSOT11社全件';
    const nowStr = new Date().toISOString().slice(0, 10);
    const filename = `型保管料算出書_${partnerLabel}_${nowStr}.csv`;

    const headers = [
      'No',
      '客先名 (Customer)',
      '金型コード (Equipment Code)',
      '金型・製品名称 (Mold / Product Name)',
      '客先資産番号 (Asset No)',
      '保管ラック (Rack Location)',
      '最終稼働日 (Last Used Date)',
      '稼働データ元 (Date Source)',
      '経過日数 (Days Inactive)',
      '非稼働月数 (Months Dormant)',
      '判定ステータス (Status)',
      '月額単価_円 (Monthly Rate JPY)',
      '累計保管料_円_税別 (Accumulated Storage Fee JPY)',
      '備考 (Notes)',
    ];

    const rows = displayedRecords.map((r, idx) => [
      idx + 1,
      `"${r.customer_name.replace(/"/g, '""')}"`,
      `"${r.equipment_code}"`,
      `"${(r.equipment_name || '').replace(/"/g, '""')}"`,
      `"${(r.customer_asset_no || '').replace(/"/g, '""')}"`,
      `"${(r.current_rack_location || '').replace(/"/g, '""')}"`,
      r.last_used_date || '',
      r.last_used_source,
      r.days_inactive,
      r.months_dormant,
      r.is_dormant_3y ? '非稼働 3年以上' : '稼働 (<3年)',
      r.monthly_rate_jpy,
      Math.round(r.total_storage_fee_jpy),
      `"${(r.condition_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:p-0"
      style={{ background: 'rgba(0,0,0,0.65)' }}
    >
      <div
        className="card-flat flex flex-col w-full max-w-6xl max-h-[92vh] rounded-lg shadow-2xl overflow-hidden print:shadow-none print:max-h-none print:w-full print:rounded-none"
        style={{ background: 'var(--bg-surface)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b print:bg-transparent"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-canvas)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-md print:hidden"
              style={{ background: 'var(--tint-orange-bg)', color: 'var(--status-warning)' }}
            >
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2
                className="text-base font-bold flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>長期非稼働金型 判定 & 型保管料算出書</span>
                <span className="badge badge--warning text-[11px] font-mono">
                  ≥ 3 Years Inactive
                </span>
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                SSOT MOLD_CUSTODY_BUSINESS_SPEC v1.0 (Topic 3) — Fujikuraモデル基準: 307.5円/型/月
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md print:hidden hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar (Hidden on Print) */}
        <div
          className="p-4 border-b print:hidden flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Customer Select */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                対象客先:
              </label>
              <select
                className="form-input text-xs py-1.5 px-3 min-w-[220px]"
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
              >
                <option value="ALL">全11社合計 (All 11 SSOT Partners)</option>
                {SSOT_11_CUSTOMERS.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    {idx + 1}. {p.nameJA} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Unit Rate Input */}
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                月額単価 (円/型):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input text-xs py-1.5 px-2.5 w-24 font-mono font-bold"
                value={unitRate}
                onChange={(e) => setUnitRate(parseFloat(e.target.value) || 0)}
              />
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                (標準: 307.5円)
              </span>
            </div>

            {/* Filter Toggle: All vs Dormant Only */}
            <div className="flex items-center rounded border p-0.5" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setFilterMode('DORMANT_ONLY')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  filterMode === 'DORMANT_ONLY'
                    ? 'bg-[var(--status-warning)] text-white'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                非稼働 3年以上のみ ({data.dormantMoldsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  filterMode === 'ALL'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                全金型 ({data.totalMoldsCount})
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={loading || displayedRecords.length === 0}
              className="btn btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Download className="w-4 h-4" />
              <span>CSV 出力 (Excel UTF-8)</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={loading}
              className="btn btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Printer className="w-4 h-4" />
              <span>印刷 / 帳票PDF (Print)</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 mx-6 mt-3 rounded-lg border text-xs print:grid-cols-4 print:mx-0 print:my-2"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-canvas)' }}
        >
          <div className="p-2">
            <span className="text-[11px] block" style={{ color: 'var(--text-muted)' }}>
              対象金型総数 (Total):
            </span>
            <span className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {data.totalMoldsCount}{' '}
              <span className="text-xs font-normal text-slate-500">型</span>
            </span>
          </div>

          <div className="p-2">
            <span className="text-[11px] block" style={{ color: 'var(--text-muted)' }}>
              稼働中金型 (Active &lt;3年):
            </span>
            <span className="text-lg font-bold font-mono" style={{ color: 'var(--status-success)' }}>
              {data.activeMoldsCount}{' '}
              <span className="text-xs font-normal text-slate-500">型</span>
            </span>
          </div>

          <div className="p-2">
            <span className="text-[11px] block" style={{ color: 'var(--text-muted)' }}>
              長期非稼働 (≥3年以上):
            </span>
            <span
              className="text-lg font-bold font-mono flex items-center gap-1"
              style={{ color: 'var(--status-warning)' }}
            >
              <AlertTriangle className="w-4 h-4 inline" />
              {data.dormantMoldsCount}{' '}
              <span className="text-xs font-normal text-slate-500">型</span>
            </span>
          </div>

          <div className="p-2 border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-[11px] block font-semibold" style={{ color: 'var(--text-muted)' }}>
              累計型保管料 (税別):
            </span>
            <span
              className="text-lg font-bold font-mono"
              style={{ color: 'var(--accent)' }}
            >
              ¥{Math.round(data.totalAccumulatedFeeJpy).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content Table Area */}
        <div className="flex-1 overflow-auto p-6 print:p-0">
          {loading ? (
            <div
              className="flex flex-col items-center justify-center py-16"
              style={{ color: 'var(--text-muted)' }}
            >
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-2"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <span className="text-xs">
                生産・受注履歴から最終稼働日および保管料を算出中...
              </span>
            </div>
          ) : displayedRecords.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <FileText className="w-8 h-8 mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                該当する金型はありません
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                選択条件（{filterMode === 'DORMANT_ONLY' ? '非稼働3年以上のみ' : '全件'}）に一致する金型が存在しません。
              </p>
            </div>
          ) : (
            <table className="data-table w-full text-left border-collapse text-xs">
              <thead>
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">金型コード (YSD)</th>
                  <th className="py-2.5 px-3">金型・製品名称</th>
                  <th className="py-2.5 px-3">客先名 (Customer)</th>
                  <th className="py-2.5 px-3">棚番 (Rack)</th>
                  <th className="py-2.5 px-3">最終稼働日</th>
                  <th className="py-2.5 px-3 text-center">経過期間</th>
                  <th className="py-2.5 px-3 text-center">稼働判定</th>
                  <th className="py-2.5 px-3 text-right">月額単価</th>
                  <th className="py-2.5 px-3 text-right">累計保管料</th>
                  <th className="py-2.5 px-3 text-center print:hidden">操作</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="py-2 px-3 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                      {r.equipment_code}
                    </td>
                    <td className="py-2 px-3 max-w-[200px] truncate" title={r.equipment_name || ''}>
                      {r.equipment_name || '—'}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-semibold">{r.customer_name}</span>
                      <span className="text-[10px] ml-1 font-mono text-slate-500">[{r.customer_code}]</span>
                    </td>
                    <td className="py-2 px-3 font-mono">
                      {r.current_rack_location || '—'}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {r.last_used_date ? (
                        <div>
                          <span className="font-mono font-bold">{r.last_used_date}</span>
                          <span className="text-[10px] ml-1 text-slate-400 font-mono">({r.last_used_source})</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap font-mono">
                      {r.last_used_date ? (
                        <span>
                          {r.months_dormant} ヶ月 ({r.days_inactive} 日)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      {r.is_dormant_3y ? (
                        <span className="badge badge--warning font-bold text-[11px] inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          非稼働 3年以上
                        </span>
                      ) : r.last_used_date ? (
                        <span className="badge badge--success text-[11px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          稼働 (&lt;3年)
                        </span>
                      ) : (
                        <span className="badge badge--neutral text-[11px]">未稼働</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      ¥{r.monthly_rate_jpy.toFixed(1)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold" style={{ color: r.total_storage_fee_jpy > 0 ? 'var(--status-warning)' : 'var(--text-muted)' }}>
                      ¥{Math.round(r.total_storage_fee_jpy).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center print:hidden">
                      {r.is_dormant_3y && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onRequestReturn) {
                              onRequestReturn(r);
                            } else {
                              alert(`金型 [${r.equipment_code}] の返却・廃棄起票 (Return/Disposal) へ連携します。`);
                            }
                          }}
                          className="btn btn-secondary text-[11px] py-1 px-2 flex items-center gap-1 mx-auto"
                          style={{ borderColor: 'var(--status-warning)', color: 'var(--status-warning)' }}
                          title="客先返却または廃棄起票"
                        >
                          <span>返却/廃棄</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
