'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { X, Wrench, CheckCircle2, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { createOutsourceProcessingRequest } from '../../actions';
import type { EquipmentLoanItem, OutsourceProcessingType } from '../../types';

interface OutsourceProcessingModalProps {
  loan: EquipmentLoanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OutsourceProcessingModal({
  loan,
  isOpen,
  onClose,
  onSuccess,
}: OutsourceProcessingModalProps) {
  const t = useTranslations('Loans');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [processingType, setProcessingType] = useState<OutsourceProcessingType>('TEFLON');
  const [contractor, setContractor] = useState(
    loan?.to_company_name || 'ミネベアミツミ指定加工工場'
  );
  const [outsourceDate, setOutsourceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  // Default expected return: +7 days
  const defaultReturn = new Date();
  defaultReturn.setDate(defaultReturn.getDate() + 7);
  const [expectedReturnDate, setExpectedReturnDate] = useState(
    defaultReturn.toISOString().slice(0, 10)
  );
  const [trialSamples, setTrialSamples] = useState('24〜60枚');
  const [coatingThickness, setCoatingThickness] = useState('テフロン膜厚 20〜30μm');
  const [notes, setNotes] = useState('摺動部マスキング要、成形テストサンプル受取後に量産判定');

  if (!isOpen || !loan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractor.trim()) {
      setError(t('outsourceModal.contractorPlaceholder'));
      return;
    }
    if (!expectedReturnDate) {
      setError(t('outsourceModal.expectedReturnDate'));
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await createOutsourceProcessingRequest({
        loan_id: loan.loan_id,
        processing_type: processingType,
        contractor: contractor.trim(),
        outsource_date: outsourceDate,
        expected_return_date: expectedReturnDate,
        trial_samples: trialSamples.trim() || undefined,
        coating_thickness: coatingThickness.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || 'Có lỗi xảy ra khi tạo phiếu xuất gia công.');
      } else {
        setSuccessMsg(t('outsourceModal.success'));
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    });
  };

  const pdfUrl = `/api/equipment/loans/${loan.loan_id}/pdf?type=OUTSOURCE_PROCESSING&seal=both`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="card-flat bg-[var(--bg-surface)] w-full max-w-xl flex flex-col rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        data-testid="outsource-processing-modal"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--tint-teal-bg)]">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-[var(--accent)]" />
            <div>
              <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                {t('outsourceModal.title')}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                {t('outsourceModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3.5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Target Equipment Summary */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[12px]">
            <div>
              <span className="text-slate-500 font-medium">対象金型 / 設備: </span>
              <span className="font-mono font-bold text-slate-800 ml-1">
                {loan.equipment_code}
              </span>
              <span className="text-slate-700 ml-1">({loan.equipment_name || '—'})</span>
            </div>
            <span className="badge badge--neutral font-mono text-[11px]">
              {loan.loan_code}
            </span>
          </div>

          {/* Grid Row 1: Processing Type & Contractor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t('outsourceModal.processingType')} <span className="text-red-500">*</span>
              </label>
              <select
                className="form-input text-[12px] w-full"
                value={processingType}
                onChange={(e) => setProcessingType(e.target.value as OutsourceProcessingType)}
                data-testid="outsource-processing-type"
              >
                <option value="TEFLON">{t('outsourceModal.typeTeflon')}</option>
                <option value="PLATING">{t('outsourceModal.typePlating')}</option>
                <option value="POLISHING">{t('outsourceModal.typePolishing')}</option>
                <option value="OTHER">{t('outsourceModal.typeOther')}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t('outsourceModal.contractor')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input text-[12px] w-full"
                placeholder={t('outsourceModal.contractorPlaceholder')}
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                required
                data-testid="outsource-contractor"
              />
            </div>
          </div>

          {/* Grid Row 2: Outsource Date & Expected Return Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t('outsourceModal.outsourceDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="form-input text-[12px] w-full font-mono"
                value={outsourceDate}
                onChange={(e) => setOutsourceDate(e.target.value)}
                required
                data-testid="outsource-date"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t('outsourceModal.expectedReturnDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="form-input text-[12px] w-full font-mono"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                required
                data-testid="outsource-expected-return"
              />
            </div>
          </div>

          {/* Minebea Trial Samples Constraint */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                {t('outsourceModal.trialSamples')}
              </label>
              <span className="badge badge--warning text-[10px] py-0 px-1 font-semibold">
                ミネベア必須規定
              </span>
            </div>
            <input
              type="text"
              className="form-input text-[12px] w-full"
              placeholder={t('outsourceModal.trialSamplesPlaceholder')}
              value={trialSamples}
              onChange={(e) => setTrialSamples(e.target.value)}
              data-testid="outsource-trial-samples"
            />
            <p className="text-[10px] text-amber-700 mt-1 font-medium bg-amber-50 p-1.5 rounded border border-amber-200">
              {t('outsourceModal.trialSamplesHint')}
            </p>
          </div>

          {/* Coating Thickness / Spec */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {t('outsourceModal.coatingThickness')}
            </label>
            <input
              type="text"
              className="form-input text-[12px] w-full"
              placeholder={t('outsourceModal.coatingThicknessPlaceholder')}
              value={coatingThickness}
              onChange={(e) => setCoatingThickness(e.target.value)}
              data-testid="outsource-coating-thickness"
            />
          </div>

          {/* Technical Notes / Instructions */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {t('outsourceModal.notes')}
            </label>
            <textarea
              className="form-textarea text-[12px] w-full h-18 resize-none"
              placeholder={t('outsourceModal.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="outsource-notes"
            />
          </div>

          {/* Quick PDF Preview Notice */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--tint-blue-bg)] border border-[var(--border-subtle)] text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700">
              <FileText size={15} className="text-[var(--accent)]" />
              <span>発行後、電子社判付きA4依頼書（外注加工依頼書）が印刷可能になります</span>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] font-bold inline-flex items-center gap-0.5 hover:underline"
            >
              <span>{t('outsourceModal.viewPdf')}</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-[12px] h-[32px] px-3.5"
              disabled={isPending}
            >
              {t('outsourceModal.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary text-[12px] h-[32px] px-4 flex items-center gap-1.5 font-bold"
              disabled={isPending}
              data-testid="outsource-submit-btn"
            >
              {isPending ? (
                <>
                  <span className="animate-spin text-sm">⟳</span>
                  <span>{t('outsourceModal.submitting')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>{t('outsourceModal.submit')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
