'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Printer,
  Building2,
  Calendar,
  FileText,
  Download,
} from 'lucide-react';
import { SSOT_11_CUSTOMERS, type SsotCustomerPartner, type AnnualAuditRecord } from '../types';
import { getAnnualAuditData } from '../actions';

interface LoanAuditExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoanAuditExportModal({
  isOpen,
  onClose,
}: LoanAuditExportModalProps) {
  const currentYear = new Date().getFullYear();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('shin-ei');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState(false);
  const [auditRecords, setAuditRecords] = useState<AnnualAuditRecord[]>([]);
  const [activePartner, setActivePartner] = useState<SsotCustomerPartner | null>(
    SSOT_11_CUSTOMERS[0]
  );

  // Fetch audit records whenever partner or year changes
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setLoading(true);

    const partner =
      SSOT_11_CUSTOMERS.find((p) => p.id === selectedPartnerId) || null;
    setActivePartner(partner);

    getAnnualAuditData(selectedPartnerId, selectedYear)
      .then((res) => {
        if (mounted) {
          setAuditRecords(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load audit records:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, selectedPartnerId, selectedYear]);

  if (!isOpen) return null;

  // Handle CSV Export with UTF-8 BOM for Excel compatibility
  const handleExportCSV = () => {
    if (auditRecords.length === 0) {
      alert('Không có bản ghi nào để xuất (No records to export).');
      return;
    }

    const partnerName = activePartner?.nameJA || '全社';
    const filename = `貸与設備棚卸調査票_${partnerName}_${selectedYear}年.csv`;

    const headers = [
      'No',
      '客先名 (Customer)',
      '金型コード (Equipment Code)',
      '金型名称 (Equipment Name)',
      '客先資産番号 (Asset No)',
      '保管場所 (Rack Location)',
      '預託ステータス (Custody Status)',
      '預託/貸出日 (Loan Date)',
      '棚卸確認日 (Audit Date)',
      '現品状態 (Condition)',
      '写真確認 (Photo)',
    ];

    const rows = auditRecords.map((r, idx) => [
      idx + 1,
      `"${r.customer_name.replace(/"/g, '""')}"`,
      `"${r.equipment_code}"`,
      `"${(r.equipment_name || '').replace(/"/g, '""')}"`,
      `"${(r.customer_asset_no || '').replace(/"/g, '""')}"`,
      `"${(r.current_rack_location || '').replace(/"/g, '""')}"`,
      `"${r.custody_status_label}"`,
      r.loan_date || '',
      r.last_audit_date || '',
      `"${(r.condition_summary || '').replace(/"/g, '""')}"`,
      r.photo_overall_url ? 'あり (Yes)' : '未登録 (No)',
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

  // Handle Print Audit Sheet
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:p-0" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="card-flat flex flex-col w-full max-w-5xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden print:shadow-none print:max-h-none print:w-full print:rounded-none"
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
              style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                年次棚卸調査リスト・有高確認 (Annual Mold Custody Audit Export)
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Tuân thủ đặc tả SSOT MOLD_CUSTODY_BUSINESS_SPEC v1.0 — Chuẩn kiểm toán 11 đối tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md print:hidden"
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
          <div className="flex flex-wrap items-center gap-3">
            {/* Customer Select */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                客先 (Customer):
              </label>
              <select
                className="form-input text-xs py-1.5 px-3 min-w-[240px]"
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
              >
                {SSOT_11_CUSTOMERS.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    {idx + 1}. {p.nameJA} ({p.evidenceRef})
                  </option>
                ))}
              </select>
            </div>

            {/* Year Select */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                棚卸年度 (Year):
              </label>
              <select
                className="form-input text-xs py-1.5 px-3"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value={currentYear}>{currentYear}年 (令和{currentYear - 2018}年)</option>
                <option value={currentYear - 1}>{currentYear - 1}年 (令和{currentYear - 2019}年)</option>
                <option value={currentYear - 2}>{currentYear - 2}年 (令和{currentYear - 2020}年)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={loading || auditRecords.length === 0}
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
              <span>印刷 / PDF出力 (Print)</span>
            </button>
          </div>
        </div>

        {/* Partner SSOT Context Card */}
        {activePartner && (
          <div
            className="mx-6 mt-4 p-3 rounded-lg border flex items-start justify-between gap-4 text-xs print:mx-0 print:my-2"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--tint-teal-bg)',
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {activePartner.nameJA}
                </span>
                <span className="badge badge--info font-mono text-[11px]">{activePartner.code}</span>
                <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                  [{activePartner.evidenceRef}]
                </span>
              </div>
              <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                <strong>Biểu mẫu đối ứng:</strong> {activePartner.standardDocType}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="block" style={{ color: 'var(--text-muted)' }}>対象金型数 (Total):</span>
              <span className="font-bold text-base font-mono" style={{ color: 'var(--text-primary)' }}>
                {auditRecords.length} 型
              </span>
            </div>
          </div>
        )}

        {/* Content Table Area */}
        <div className="flex-1 overflow-auto p-6 print:p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--text-muted)' }}>
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-2"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <span className="text-xs">Đang tải dữ liệu kiểm kê thường niên...</span>
            </div>
          ) : auditRecords.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <FileText className="w-8 h-8 mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>未登録 / データなし</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Chưa có phiếu mượn/lưu giữ nào phát sinh cho đối tác này trong hệ thống.
              </p>
            </div>
          ) : (
            <table className="data-table w-full text-left border-collapse text-xs">
              <thead>
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3">金型コード (YSD Code)</th>
                  <th className="py-2.5 px-3">金型・トレイ名称 (Mold Name)</th>
                  <th className="py-2.5 px-3">客先資産番号 (Asset No)</th>
                  <th className="py-2.5 px-3">保管場所 (Rack)</th>
                  <th className="py-2.5 px-3 text-center">預託ステータス</th>
                  <th className="py-2.5 px-3">預託日 (Date)</th>
                  <th className="py-2.5 px-3">現品状態 (Condition)</th>
                </tr>
              </thead>
              <tbody>
                {auditRecords.map((r, idx) => (
                  <tr key={r.id}>
                    <td className="py-2 px-3 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                      {r.equipment_code}
                    </td>
                    <td className="py-2 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {r.equipment_name || '—'}
                    </td>
                    <td className="py-2 px-3 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {r.customer_asset_no}
                    </td>
                    <td className="py-2 px-3 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {r.current_rack_location}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`badge ${
                          r.custody_status === 'CUSTODY_ACTIVE'
                            ? 'badge--success'
                            : r.custody_status === 'LOAN_OUT'
                            ? 'badge--warning'
                            : 'badge--neutral'
                        }`}
                      >
                        {r.custody_status_label}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {r.loan_date || '—'}
                    </td>
                    <td className="py-2 px-3" style={{ color: 'var(--text-primary)' }}>
                      {r.condition_summary || '良好'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Formal Audit Signature Box (Displayed on Print and at footer) */}
          <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-xs mb-3 italic" style={{ color: 'var(--text-muted)' }}>
              ※ 本表は客先預託金型および貸与設備の現品実査に基づき作成された年次棚卸確認記録である。
            </p>
            <div className="grid grid-cols-2 gap-8 max-w-lg ml-auto">
              <div
                className="border rounded p-3 text-center"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-canvas)' }}
              >
                <span className="text-[11px] font-semibold block mb-8" style={{ color: 'var(--text-primary)' }}>
                  工場責任者 (Quản đốc xưởng)
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>[ 印 / 署名 ]</span>
              </div>
              <div
                className="border rounded p-3 text-center"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-canvas)' }}
              >
                <span className="text-[11px] font-semibold block mb-8" style={{ color: 'var(--text-primary)' }}>
                  品質保証責任者 (Trưởng phòng QA)
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>[ 印 / 署名 ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t flex items-center justify-between text-xs print:hidden"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-canvas)', color: 'var(--text-muted)' }}
        >
          <span>YSDMS NextGen — Mold Custody & Annual Audit Subsystem</span>
          <button onClick={onClose} className="btn btn-secondary py-1 px-4">
            閉じる (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
