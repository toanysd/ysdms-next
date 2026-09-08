'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { X, ShieldCheck, ArrowRight, Clock, Camera, AlertCircle } from 'lucide-react';
import {
  createEquipmentLoan,
  getEquipmentCandidates,
  getCompaniesForLoan,
  getEmployeesForLoan,
} from '../actions';
import type { LoanType, CreateLoanInput } from '../types';

interface CreateLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLoanModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateLoanModalProps) {
  const t = useTranslations('Loans');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [loanType, setLoanType] = useState<LoanType>('CUSTOMER_LOAN');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<{
    equipment_id: string;
    equipment_code: string;
    display_name: string;
    equipment_type: string;
    owner_company_id: string | null;
    owner_company_name: string | null;
  } | null>(null);

  const [equipmentList, setEquipmentList] = useState<
    {
      equipment_id: string;
      equipment_code: string;
      display_name: string;
      equipment_type: string;
      owner_company_id: string | null;
      owner_company_name: string | null;
    }[]
  >([]);

  const [companies, setCompanies] = useState<
    {
      company_id: string;
      company_code: string;
      company_name: string;
      is_ysd: boolean;
    }[]
  >([]);

  const [employees, setEmployees] = useState<
    {
      employee_id: string;
      employee_code: string | null;
      employee_name: string;
    }[]
  >([]);

  const [toCompanyId, setToCompanyId] = useState('');
  const [fromCompanyId, setFromCompanyId] = useState('');
  const [loanDate, setLoanDate] = useState(new Date().toISOString().slice(0, 10));
  const [scheduledReturnDate, setScheduledReturnDate] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [conditionOnLoan, setConditionOnLoan] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [photoOverallUrl, setPhotoOverallUrl] = useState('');
  const [photoNameplateUrl, setPhotoNameplateUrl] = useState('');

  // Fetch candidate data on mount
  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    async function loadCandidates() {
      try {
        const [eqs, comps, emps] = await Promise.all([
          getEquipmentCandidates(),
          getCompaniesForLoan(),
          getEmployeesForLoan(),
        ]);
        setEquipmentList(eqs);
        setCompanies(comps);
        setEmployees(emps);
      } catch (err) {
        console.error('Failed to load modal master data:', err);
      }
    }
    loadCandidates();
  }, [isOpen]);

  // Debounced equipment search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(async () => {
      if (equipmentSearch.trim().length >= 1) {
        const res = await getEquipmentCandidates(equipmentSearch.trim());
        setEquipmentList(res);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [equipmentSearch, isOpen]);

  // Auto-fill from/to companies based on loan_type and selected equipment
  useEffect(() => {
    const ysd = companies.find((c) => c.is_ysd);
    const ysdId = ysd?.company_id || '';

    if (loanType === 'CUSTOMER_LOAN') {
      // Khách hàng -> YSD
      setToCompanyId(ysdId);
      if (selectedEquipment?.owner_company_id) {
        setFromCompanyId(selectedEquipment.owner_company_id);
      }
    } else if (loanType === 'RETURN_TO_CUSTOMER') {
      // YSD -> Khách hàng
      setFromCompanyId(ysdId);
      if (selectedEquipment?.owner_company_id) {
        setToCompanyId(selectedEquipment.owner_company_id);
      }
    } else if (loanType === 'OUTSOURCE_PROCESSING') {
      // YSD -> Đơn vị gia công ngoài
      setFromCompanyId(ysdId);
    }
  }, [loanType, selectedEquipment, companies]);

  if (!isOpen) return null;

  const ysdCompany = companies.find((c) => c.is_ysd);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedEquipment) {
      setError(t('createModal.errorNoEquipment'));
      return;
    }

    if (loanType !== 'RETURN_TO_CUSTOMER' && !scheduledReturnDate) {
      setError(t('createModal.errorReturnDateRequired'));
      return;
    }

    const payload: CreateLoanInput = {
      equipment_id: selectedEquipment.equipment_id,
      loan_type: loanType,
      to_company_id: toCompanyId,
      from_company_id: fromCompanyId || undefined,
      loan_date: loanDate,
      scheduled_return_date: scheduledReturnDate || null,
      requested_by: requestedBy || null,
      destination_address: destinationAddress || null,
      contact_person: contactPerson || null,
      contact_phone: contactPhone || null,
      purpose: purpose || null,
      condition_on_loan: conditionOnLoan || null,
      condition_notes: conditionNotes || null,
      photo_overall_url: photoOverallUrl || null,
      photo_nameplate_url: photoNameplateUrl || null,
    };

    startTransition(async () => {
      const res = await createEquipmentLoan(payload);
      if (!res.success) {
        setError(res.error || 'Có lỗi xảy ra khi tạo phiếu.');
      } else {
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="card-flat bg-[var(--bg-surface)] w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-[var(--tint-teal-bg)]">
          <div>
            <h2
              className="text-[16px] font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('createModal.title')}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {t('createModal.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-[12px] flex items-center gap-2 border border-red-200 shrink-0">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Transaction Type (loan_type) selector */}
          <div className="form-section p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
            <label className="text-[12px] font-bold text-[var(--text-primary)] block mb-2">
              {t('createModal.loanTypeLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* CUSTOMER_LOAN */}
              <button
                type="button"
                onClick={() => setLoanType('CUSTOMER_LOAN')}
                className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  loanType === 'CUSTOMER_LOAN'
                    ? 'border-[var(--accent)] bg-white shadow-sm ring-1 ring-[var(--accent)]'
                    : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[12px] text-blue-700">
                  <ShieldCheck size={14} />
                  <span>{t('types.CUSTOMER_LOAN')}</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Khách hàng gửi YSD giữ hộ & mượn sản xuất (金型借用書)
                </span>
              </button>

              {/* RETURN_TO_CUSTOMER */}
              <button
                type="button"
                onClick={() => setLoanType('RETURN_TO_CUSTOMER')}
                className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  loanType === 'RETURN_TO_CUSTOMER'
                    ? 'border-orange-500 bg-white shadow-sm ring-1 ring-orange-500'
                    : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[12px] text-orange-700">
                  <ArrowRight size={14} />
                  <span>{t('types.RETURN_TO_CUSTOMER')}</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">
                  YSD hoàn trả khuôn về cho Khách hàng (金型返却書)
                </span>
              </button>

              {/* OUTSOURCE_PROCESSING */}
              <button
                type="button"
                onClick={() => setLoanType('OUTSOURCE_PROCESSING')}
                className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  loanType === 'OUTSOURCE_PROCESSING'
                    ? 'border-purple-500 bg-white shadow-sm ring-1 ring-purple-500'
                    : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[12px] text-purple-700">
                  <Clock size={14} />
                  <span>{t('types.OUTSOURCE_PROCESSING')}</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">
                  YSD xuất khuôn cho Vendor gia công ngoài (送付状)
                </span>
              </button>
            </div>
          </div>

          {/* 2. Equipment selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[var(--text-primary)]">
              {t('createModal.equipmentLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={equipmentSearch}
                onChange={(e) => setEquipmentSearch(e.target.value)}
                placeholder={t('createModal.equipmentPlaceholder')}
                className="form-input text-[12px] h-[32px]"
              />

              <select
                value={selectedEquipment?.equipment_id || ''}
                onChange={(e) => {
                  const eq = equipmentList.find((item) => item.equipment_id === e.target.value);
                  setSelectedEquipment(eq || null);
                }}
                className="form-input text-[12px] h-[32px]"
              >
                <option value="">-- {t('createModal.equipmentLabel')} --</option>
                {equipmentList.map((eq) => (
                  <option key={eq.equipment_id} value={eq.equipment_id}>
                    {eq.equipment_code} - {eq.display_name} ({eq.owner_company_name || 'No Owner'})
                  </option>
                ))}
              </select>
            </div>

            {selectedEquipment && (
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--accent)] font-mono text-[12px] mr-2">
                    {selectedEquipment.equipment_code}
                  </span>
                  <span className="text-slate-700 font-semibold">{selectedEquipment.display_name}</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-500 mr-1">
                    {t('createModal.ownerCompany')}
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedEquipment.owner_company_name || '—'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Movement direction: From & To Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
            {/* From Company */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.fromCompanyLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                value={fromCompanyId}
                onChange={(e) => setFromCompanyId(e.target.value)}
                disabled={loanType === 'RETURN_TO_CUSTOMER' || loanType === 'OUTSOURCE_PROCESSING'}
                className="form-input text-[12px] h-[32px]"
              >
                <option value="">-- Chọn công ty xuất --</option>
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>
                    {c.company_name} ({c.company_code})
                  </option>
                ))}
              </select>
            </div>

            {/* To Company */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.toCompanyLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                value={toCompanyId}
                onChange={(e) => setToCompanyId(e.target.value)}
                disabled={loanType === 'CUSTOMER_LOAN'}
                className="form-input text-[12px] h-[32px]"
              >
                <option value="">-- Chọn công ty nhận --</option>
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>
                    {c.company_name} ({c.company_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Dates & Requested by */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Loan Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.loanDateLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                required
                className="form-input text-[12px] h-[32px]"
              />
            </div>

            {/* Scheduled Return Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.scheduledReturnDateLabel')}{' '}
                {loanType !== 'RETURN_TO_CUSTOMER' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                value={scheduledReturnDate}
                onChange={(e) => setScheduledReturnDate(e.target.value)}
                required={loanType !== 'RETURN_TO_CUSTOMER'}
                className="form-input text-[12px] h-[32px]"
              />
              <span className="text-[10px] text-slate-500">
                {loanType === 'RETURN_TO_CUSTOMER'
                  ? t('createModal.scheduledReturnOptionalHint')
                  : t('createModal.scheduledReturnRequiredHint')}
              </span>
            </div>

            {/* Requested by */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.requestedByLabel')}
              </label>
              <select
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="form-input text-[12px] h-[32px]"
              >
                <option value="">{t('createModal.requestedByPlaceholder')}</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_name} {emp.employee_code ? `(${emp.employee_code})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Destination & Contact Person */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.destinationAddressLabel')}
              </label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="VD: Nhà máy Hưng Yên / SMK Tokyo..."
                className="form-input text-[12px] h-[32px]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.contactPersonLabel')}
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="VD: 山田 太郎 様"
                className="form-input text-[12px] h-[32px]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.contactPhoneLabel')}
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="VD: 03-1234-5678"
                className="form-input text-[12px] h-[32px]"
              />
            </div>
          </div>

          {/* 6. Purpose & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.purposeLabel')}
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder={t('createModal.purposePlaceholder')}
                className="form-input text-[12px] h-[32px]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">
                {t('createModal.conditionOnLoanLabel')}
              </label>
              <input
                type="text"
                value={conditionOnLoan}
                onChange={(e) => setConditionOnLoan(e.target.value)}
                placeholder={t('createModal.conditionOnLoanPlaceholder')}
                className="form-input text-[12px] h-[32px]"
              />
            </div>
          </div>

          {/* 7. Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('createModal.conditionNotesLabel')}
            </label>
            <input
              type="text"
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder={t('createModal.conditionNotesPlaceholder')}
              className="form-input text-[12px] h-[32px]"
            />
          </div>

          {/* 8. Japanese Audit Photos (全体写真 + 銘板写真) */}
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--text-primary)]">
              <Camera size={15} className="text-[var(--accent)]" />
              <span>{t('createModal.photosSection')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Photo 1: Overall with signboard */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">
                  {t('createModal.photoOverallLabel')}
                </label>
                <input
                  type="text"
                  value={photoOverallUrl}
                  onChange={(e) => setPhotoOverallUrl(e.target.value)}
                  placeholder="https://... /mold_overall.jpg"
                  className="form-input text-[12px] h-[32px] font-mono"
                />
                <span className="text-[10px] text-slate-500">
                  {t('createModal.photoOverallHint')}
                </span>
              </div>

              {/* Photo 2: Nameplate */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">
                  {t('createModal.photoNameplateLabel')}
                </label>
                <input
                  type="text"
                  value={photoNameplateUrl}
                  onChange={(e) => setPhotoNameplateUrl(e.target.value)}
                  placeholder="https://... /nameplate.jpg"
                  className="form-input text-[12px] h-[32px] font-mono"
                />
                <span className="text-[10px] text-slate-500">
                  {t('createModal.photoNameplateHint')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-[12px] px-3 py-1.5"
            >
              {t('actions.close')}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary text-[12px] px-4 py-1.5 flex items-center gap-1.5"
            >
              <span>{isPending ? t('actions.saving') : t('createModal.submit')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
