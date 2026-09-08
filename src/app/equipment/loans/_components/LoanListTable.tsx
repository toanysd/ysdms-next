'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  FileText,
  Printer,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import type { EquipmentLoanItem, LoanType, LoanStatus } from '../types';

interface LoanListTableProps {
  loans: EquipmentLoanItem[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onOpenApprove: (loan: EquipmentLoanItem) => void;
  onOpenReject: (loan: EquipmentLoanItem) => void;
  onOpenDispatch: (loan: EquipmentLoanItem) => void;
  onOpenReturn: (loan: EquipmentLoanItem) => void;
  loading?: boolean;
}

type SortField = 'loan_code' | 'loan_date' | 'scheduled_return_date' | 'status';
type SortDir = 'asc' | 'desc';

export default function LoanListTable({
  loans,
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  onOpenApprove,
  onOpenReject,
  onOpenDispatch,
  onOpenReturn,
  loading = false,
}: LoanListTableProps) {
  const t = useTranslations('Loans');

  // Client sort for table header interactivity (default descending by date - Rule 7.1)
  const [sortField, setSortField] = useState<SortField>('loan_date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedLoans = React.useMemo(() => {
    const list = [...loans];
    list.sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [loans, sortField, sortDir]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="text-slate-400 opacity-60" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp size={12} className="text-[var(--accent)]" />
    ) : (
      <ArrowDown size={12} className="text-[var(--accent)]" />
    );
  };

  const getLoanTypeBadge = (type: LoanType) => {
    switch (type) {
      case 'CUSTOMER_LOAN':
        return (
          <span
            className="badge inline-flex items-center gap-1 font-bold text-[11px]"
            style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
          >
            <ShieldCheck size={12} />
            {t('types.CUSTOMER_LOAN')}
          </span>
        );
      case 'RETURN_TO_CUSTOMER':
        return (
          <span
            className="badge inline-flex items-center gap-1 font-bold text-[11px]"
            style={{ background: 'var(--tint-orange-bg)', color: '#C2410C', border: '1px solid #FED7AA' }}
          >
            <ArrowRight size={12} />
            {t('types.RETURN_TO_CUSTOMER')}
          </span>
        );
      case 'OUTSOURCE_PROCESSING':
        return (
          <span
            className="badge inline-flex items-center gap-1 font-bold text-[11px]"
            style={{ background: '#FAF5FF', color: '#7E22CE', border: '1px solid #E9D5FF' }}
          >
            <Clock size={12} />
            {t('types.OUTSOURCE_PROCESSING')}
          </span>
        );
      default:
        return <span className="badge badge--neutral">{type}</span>;
    }
  };

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <span className="badge badge--warning">{t('status.PENDING_APPROVAL')}</span>;
      case 'APPROVED':
        return <span className="badge badge--info">{t('status.APPROVED')}</span>;
      case 'IN_TRANSIT':
        return (
          <span
            className="badge inline-flex items-center gap-1"
            style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #93C5FD' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('status.IN_TRANSIT')}
          </span>
        );
      case 'RETURNED':
        return <span className="badge badge--success">{t('status.RETURNED')}</span>;
      case 'REJECTED':
        return <span className="badge badge--error">{t('status.REJECTED')}</span>;
      case 'CANCELLED':
        return <span className="badge badge--neutral">{t('status.CANCELLED')}</span>;
      default:
        return <span className="badge badge--neutral">{status}</span>;
    }
  };

  return (
    <div className="card-flat flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto flex-1">
        <table className="data-table w-full">
          <thead>
            <tr>
              {/* 1. 管理番号 (Cột chính Hyperlink) */}
              <th
                onClick={() => handleSort('loan_code')}
                className="cursor-pointer select-none text-left whitespace-nowrap"
                style={{ width: '130px' }}
              >
                <div className="flex items-center gap-1">
                  <span>{t('table.loanCode')}</span>
                  {renderSortIcon('loan_code')}
                </div>
              </th>

              {/* 2. 区分 */}
              <th className="text-left whitespace-nowrap" style={{ width: '130px' }}>
                {t('table.type')}
              </th>

              {/* 3. 対象金型 */}
              <th className="text-left" style={{ minWidth: '180px' }}>
                {t('table.equipment')}
              </th>

              {/* 4. 移動方向 */}
              <th className="text-left" style={{ minWidth: '220px' }}>
                {t('table.fromTo')}
              </th>

              {/* 5. 起票日 */}
              <th
                onClick={() => handleSort('loan_date')}
                className="cursor-pointer select-none text-left whitespace-nowrap"
                style={{ width: '105px' }}
              >
                <div className="flex items-center gap-1">
                  <span>{t('table.loanDate')}</span>
                  {renderSortIcon('loan_date')}
                </div>
              </th>

              {/* 6. 返却予定日 */}
              <th
                onClick={() => handleSort('scheduled_return_date')}
                className="cursor-pointer select-none text-left whitespace-nowrap"
                style={{ width: '120px' }}
              >
                <div className="flex items-center gap-1">
                  <span>{t('table.scheduledReturnDate')}</span>
                  {renderSortIcon('scheduled_return_date')}
                </div>
              </th>

              {/* 7. ステータス */}
              <th
                onClick={() => handleSort('status')}
                className="cursor-pointer select-none text-center whitespace-nowrap"
                style={{ width: '120px' }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{t('table.status')}</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              {/* 8. 有効証憑 */}
              <th className="text-center whitespace-nowrap" style={{ width: '110px' }}>
                {t('table.validDoc')}
              </th>

              {/* 9. 操作 */}
              <th className="text-right whitespace-nowrap" style={{ width: '170px' }}>
                {t('table.actions')}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[var(--text-muted)]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin text-[var(--accent)] font-bold">⟳</span>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedLoans.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[var(--text-muted)]">
                  {t('table.noData')}
                </td>
              </tr>
            ) : (
              sortedLoans.map((item) => {
                return (
                  <tr key={item.loan_id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    {/* 1. 管理番号 (Hyperlink theo chuẩn AGENTS.md) */}
                    <td className="whitespace-nowrap">
                      <Link
                        href={`/equipment/loans/${item.loan_id}`}
                        className="font-mono font-bold text-[13px] hover:underline"
                        style={{ color: 'var(--accent)' }}
                      >
                        {item.loan_code}
                      </Link>
                    </td>

                    {/* 2. 区分 */}
                    <td className="whitespace-nowrap">{getLoanTypeBadge(item.loan_type)}</td>

                    {/* 3. 対象金型 */}
                    <td>
                      <div className="flex flex-col">
                        <span
                          className="font-mono font-bold text-[13px]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {item.equipment_code}
                        </span>
                        {item.equipment_name && (
                          <span
                            className="text-[11px] truncate max-w-[200px]"
                            style={{ color: 'var(--text-muted)' }}
                            title={item.equipment_name}
                          >
                            {item.equipment_name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 4. 移動方向 */}
                    <td>
                      <div className="flex items-center gap-1.5 text-[12px] flex-wrap">
                        <span
                          className="font-semibold truncate max-w-[120px]"
                          style={{ color: 'var(--text-primary)' }}
                          title={item.from_company_name || '---'}
                        >
                          {item.from_company_name || '---'}
                        </span>
                        <ArrowRight size={12} className="text-slate-400 shrink-0" />
                        <span
                          className="font-semibold truncate max-w-[120px]"
                          style={{ color: 'var(--text-primary)' }}
                          title={item.to_company_name || '---'}
                        >
                          {item.to_company_name || '---'}
                        </span>
                      </div>
                    </td>

                    {/* 5. 起票日 */}
                    <td className="whitespace-nowrap font-mono text-[12px]">
                      {item.loan_date ? item.loan_date.slice(0, 10) : '—'}
                    </td>

                    {/* 6. 返却予定日 */}
                    <td className="whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono text-[12px]">
                          {item.scheduled_return_date
                            ? item.scheduled_return_date.slice(0, 10)
                            : '—'}
                        </span>
                        {item.is_overdue && (
                          <span
                            className="badge badge--error text-[10px] py-0 px-1 font-bold mt-0.5"
                            style={{ width: 'fit-content' }}
                          >
                            {t('table.overdueBadge', { days: item.days_overdue })}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 7. ステータス */}
                    <td className="text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* 8. 有効証憑 (棚卸調査監査用) */}
                    <td className="text-center whitespace-nowrap">
                      {item.has_valid_loan_document ? (
                        <span
                          className="badge badge--success inline-flex items-center gap-1 text-[11px] py-0.5 px-1.5 font-bold"
                          title={t('table.validDocBadge')}
                        >
                          <CheckCircle2 size={12} />
                          <span>{t('table.validDocBadge')}</span>
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[12px]">
                          {t('table.noValidDoc')}
                        </span>
                      )}
                    </td>

                    {/* 9. 操作 */}
                    <td className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Contextual Workflow Action */}
                        {item.status === 'PENDING_APPROVAL' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenApprove(item)}
                              className="btn btn-primary text-[11px] py-0.5 px-2 h-[26px]"
                            >
                              {t('actions.approve')}
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenReject(item)}
                              className="btn btn-secondary text-[11px] py-0.5 px-2 h-[26px] text-red-600 hover:text-red-700"
                            >
                              {t('actions.reject')}
                            </button>
                          </>
                        )}

                        {item.status === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => onOpenDispatch(item)}
                            className="btn btn-primary text-[11px] py-0.5 px-2.5 h-[26px]"
                          >
                            {t('actions.dispatch')}
                          </button>
                        )}

                        {item.status === 'IN_TRANSIT' && (
                          <button
                            type="button"
                            onClick={() => onOpenReturn(item)}
                            className="btn btn-primary text-[11px] py-0.5 px-2.5 h-[26px]"
                          >
                            {t('actions.returnCheckIn')}
                          </button>
                        )}

                        {/* PDF Stream Direct Link */}
                        <a
                          href={`/api/equipment/loans/${item.loan_id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary text-[11px] py-0.5 px-1.5 h-[26px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          title={t('actions.viewPdf')}
                        >
                          <Printer size={13} />
                        </a>

                        {/* Detail Link */}
                        <Link
                          href={`/equipment/loans/${item.loan_id}`}
                          className="btn btn-secondary text-[11px] py-0.5 px-1.5 h-[26px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)]"
                          title={t('actions.viewDetail')}
                        >
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      {totalRecords > 0 && (
        <div className="p-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
