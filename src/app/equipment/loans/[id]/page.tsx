'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  ArrowUpFromLine,
  ArrowLeftRight,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  Archive,
  Camera,
  ExternalLink,
  MapPin,
  Building2,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import { getEquipmentLoanDetail } from '../actions';
import {
  ApproveModal,
  RejectModal,
  DispatchModal,
  ReturnCheckInModal,
} from '../_components/LoanWorkflowModals';
import type { EquipmentLoanItem, LoanType, LoanStatus } from '../types';

export default function EquipmentLoanDetailPage() {
  const t = useTranslations('Loans');
  const router = useRouter();
  const params = useParams();
  const loanId = params.id as string;

  const [loan, setLoan] = useState<EquipmentLoanItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modals
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  const fetchDetail = () => {
    if (!loanId) return;
    setLoading(true);
    startTransition(async () => {
      try {
        const data = await getEquipmentLoanDetail(loanId);
        setLoan(data);
      } catch (err) {
        console.error('Failed to load loan detail:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [loanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="animate-spin text-[var(--accent)] font-bold text-lg">⟳</span>
          <span className="text-[13px]">{t('actions.saving')}</span>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
        <p className="text-slate-600 text-[14px]">Không tìm thấy phiếu mượn / trả này.</p>
        <Link href="/equipment/loans" className="btn btn-primary text-[12px]">
          {t('detail.list')}
        </Link>
      </div>
    );
  }

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
    <div
      className="flex flex-col h-full gap-3 p-3 overflow-y-auto"
      style={{ background: 'var(--bg-canvas)' }}
    >
      {/* ── Compact Header with Back/Up inline (Detail Page Header Pattern) ── */}
      <div
        className="card-flat shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{ padding: '12px 16px' }}
      >
        <div className="flex items-center gap-3">
          {/* Back = router.back() */}
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary flex items-center gap-1 text-[11px] h-[28px] px-2"
            title={t('detail.back')}
          >
            <ArrowLeft size={13} />
            <span>{t('detail.back')}</span>
          </button>

          {/* Up = link to list */}
          <Link
            href="/equipment/loans"
            className="btn btn-secondary flex items-center gap-1 text-[11px] h-[28px] px-2 text-decoration-none"
            title={t('detail.list')}
          >
            <ArrowUpFromLine size={12} />
            <span>{t('detail.list')}</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-300 mx-1 hidden md:block" />

          {/* Title & Code */}
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowLeftRight size={18} className="text-[var(--accent)]" />
            <h1
              className="text-[18px] font-bold tracking-tight font-mono"
              style={{ color: 'var(--accent)' }}
            >
              {loan.loan_code}
            </h1>
            <span className="font-bold text-[13px] text-slate-800">
              [{t(`types.${loan.loan_type}`)}]
            </span>
            {getStatusBadge(loan.status)}

            {loan.has_valid_loan_document && (
              <span className="badge badge--success inline-flex items-center gap-1 text-[11px] font-bold">
                <CheckCircle2 size={12} />
                <span>{t('table.validDocBadge')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Workflow buttons */}
          {loan.status === 'PENDING_APPROVAL' && (
            <>
              <button
                type="button"
                onClick={() => setIsApproveOpen(true)}
                className="btn btn-primary text-[12px] h-[30px] px-3 flex items-center gap-1"
              >
                <CheckCircle2 size={14} />
                <span>{t('actions.approve')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRejectOpen(true)}
                className="btn text-[12px] h-[30px] px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-1"
              >
                <span>{t('actions.reject')}</span>
              </button>
            </>
          )}

          {loan.status === 'APPROVED' && (
            <button
              type="button"
              onClick={() => setIsDispatchOpen(true)}
              className="btn btn-primary text-[12px] h-[30px] px-3.5 flex items-center gap-1.5"
            >
              <Truck size={14} />
              <span>{t('actions.dispatch')}</span>
            </button>
          )}

          {loan.status === 'IN_TRANSIT' && (
            <button
              type="button"
              onClick={() => setIsReturnOpen(true)}
              className="btn btn-primary text-[12px] h-[30px] px-3.5 flex items-center gap-1.5"
            >
              <Archive size={14} />
              <span>{t('actions.returnCheckIn')}</span>
            </button>
          )}

          {/* PDF View / Print Direct Link */}
          <a
            href={`/api/equipment/loans/${loan.loan_id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-[12px] h-[30px] px-3 flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>{t('detail.printDocument')}</span>
          </a>
        </div>
      </div>

      {/* ── Main Content: Paper Style Spec Layout (RULE-UI-10) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        {/* Left Column: Specs & Parties (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Block 1: 基本情報 (General Specs) */}
          <div className="card-flat p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] border-b border-[var(--border-subtle)] pb-1.5">
              <FileText size={15} />
              <span>{t('detail.summaryTitle')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 py-1">
              {/* Row 1 */}
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.docType')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {t(`types.${loan.loan_type}`)}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.loanCode')}
                </span>
                <span className="text-[13px] font-bold font-mono text-[#0F172A]">
                  {loan.loan_code}
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.loanDate')}
                </span>
                <span className="text-[13px] font-bold font-mono text-[#0F172A]">
                  {loan.loan_date ? loan.loan_date.slice(0, 10) : '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.scheduledReturnDate')}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold font-mono text-[#0F172A]">
                    {loan.scheduled_return_date
                      ? loan.scheduled_return_date.slice(0, 10)
                      : '恒久返還 (なし)'}
                  </span>
                  {loan.is_overdue && (
                    <span className="badge badge--error text-[10px] py-0 px-1 font-bold">
                      {t('table.overdueBadge', { days: loan.days_overdue })}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.actualReturnDate')}
                </span>
                <span className="text-[13px] font-bold font-mono text-[#0F172A]">
                  {loan.actual_return_date ? loan.actual_return_date.slice(0, 10) : '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.validDocStatus')}
                </span>
                <span
                  className={`text-[13px] font-bold ${
                    loan.has_valid_loan_document ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {loan.has_valid_loan_document ? '有効 (監査対応済)' : 'なし'}
                </span>
              </div>
            </div>
          </div>

          {/* Block 2: 対象金型・設備情報 */}
          <div className="card-flat p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] border-b border-[var(--border-subtle)] pb-1.5">
              <Archive size={15} />
              <span>{t('detail.equipmentSpecs')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 py-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.equipmentCode')}
                </span>
                <Link
                  href={`/equipment/molds/${loan.equipment_id}`}
                  className="text-[13px] font-bold font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <span>{loan.equipment_code}</span>
                  <ExternalLink size={12} />
                </Link>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.equipmentName')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {loan.equipment_name || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.equipmentType')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {loan.equipment_type}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.currentRackLocation')}
                </span>
                <span className="text-[13px] font-bold font-mono text-[#0F172A]">
                  {loan.current_rack_layer_id ? '棚保管中' : t('detail.notStored')}
                </span>
              </div>
            </div>
          </div>

          {/* Block 3: 取引先・関係者情報 */}
          <div className="card-flat p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] border-b border-[var(--border-subtle)] pb-1.5">
              <Building2 size={15} />
              <span>{t('detail.companiesAndParties')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 py-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.fromCompany')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {loan.from_company_name || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.toCompany')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {loan.to_company_name}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.requestedBy')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {loan.requested_by_name || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.approvedBy')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {loan.approved_by_name || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.returnedReceivedBy')}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">
                  {loan.returned_received_by_name || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Block 4: 使用目的 & 状態 & 備考 */}
          <div className="card-flat p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] border-b border-[var(--border-subtle)] pb-1.5">
              <FileText size={15} />
              <span>{t('detail.conditionAndNotes')}</span>
            </div>

            <div className="flex flex-col gap-2 py-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.purpose')}
                </span>
                <span className="text-[13px] font-semibold text-[#0F172A]">
                  {loan.purpose || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.conditionOnLoan')}
                </span>
                <span className="text-[13px] font-semibold text-[#0F172A]">
                  {loan.condition_on_loan || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.conditionOnReturn')}
                </span>
                <span className="text-[13px] font-semibold text-[#0F172A]">
                  {loan.condition_on_return || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#64748B] min-w-[100px] shrink-0 font-semibold">
                  {t('detail.conditionNotes')}
                </span>
                <span className="text-[13px] text-slate-700">
                  {loan.condition_notes || '—'}
                </span>
              </div>

              {loan.rejection_reason && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-800 text-[12px] mt-1">
                  <span className="font-bold">{t('detail.rejectionReason')}:</span>{' '}
                  {loan.rejection_reason}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Photos for Japanese Accounting Audit (Span 1) */}
        <div className="flex flex-col gap-3">
          <div className="card-flat p-3 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] border-b border-[var(--border-subtle)] pb-1.5">
              <Camera size={15} />
              <span>{t('detail.photosTitle')}</span>
            </div>

            {/* Photo 1: Overall with signboard */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#64748B]">
                {t('detail.photoOverall')}
              </span>
              {loan.photo_overall_url ? (
                <a
                  href={loan.photo_overall_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-95 transition-opacity"
                >
                  <img
                    src={loan.photo_overall_url}
                    alt="Overall Mold"
                    className="w-full h-44 object-cover"
                  />
                </a>
              ) : (
                <div className="h-32 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-[var(--text-muted)] text-[11px]">
                  <Camera size={24} className="mb-1 text-slate-300" />
                  <span>{t('detail.noPhoto')}</span>
                </div>
              )}
            </div>

            {/* Photo 2: Nameplate */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#64748B]">
                {t('detail.photoNameplate')}
              </span>
              {loan.photo_nameplate_url ? (
                <a
                  href={loan.photo_nameplate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-95 transition-opacity"
                >
                  <img
                    src={loan.photo_nameplate_url}
                    alt="Nameplate"
                    className="w-full h-44 object-cover"
                  />
                </a>
              ) : (
                <div className="h-32 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-[var(--text-muted)] text-[11px]">
                  <Camera size={24} className="mb-1 text-slate-300" />
                  <span>{t('detail.noPhoto')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Modals */}
      <ApproveModal
        loan={loan}
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onSuccess={fetchDetail}
      />

      <RejectModal
        loan={loan}
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onSuccess={fetchDetail}
      />

      <DispatchModal
        loan={loan}
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        onSuccess={fetchDetail}
      />

      <ReturnCheckInModal
        loan={loan}
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        onSuccess={fetchDetail}
      />
    </div>
  );
}
