'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { X, CheckCircle2, AlertTriangle, Truck, Archive, AlertCircle } from 'lucide-react';
import {
  approveEquipmentLoan,
  rejectEquipmentLoan,
  dispatchEquipmentLoan,
  completeEquipmentLoanReturn,
  getEmployeesForLoan,
  getRackLayersForReturn,
} from '../actions';
import type { EquipmentLoanItem } from '../types';

// ==============================================================================
// 1. Approve Modal
// ==============================================================================
interface ApproveModalProps {
  loan: EquipmentLoanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApproveModal({
  loan,
  isOpen,
  onClose,
  onSuccess,
}: ApproveModalProps) {
  const t = useTranslations('Loans');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<{ employee_id: string; employee_name: string }[]>([]);
  const [approvedBy, setApprovedBy] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError(null);
      getEmployeesForLoan().then((list) => {
        setEmployees(list);
        if (list.length > 0) setApprovedBy(list[0].employee_id);
      });
    }
  }, [isOpen]);

  if (!isOpen || !loan) return null;

  const handleApprove = () => {
    if (!approvedBy) {
      setError('Vui lòng chọn người phê duyệt.');
      return;
    }
    startTransition(async () => {
      const res = await approveEquipmentLoan({
        loan_id: loan.loan_id,
        approved_by: approvedBy,
      });
      if (!res.success) {
        setError(res.error || 'Có lỗi xảy ra khi phê duyệt.');
      } else {
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="card-flat bg-[var(--bg-surface)] w-full max-w-md flex flex-col rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--tint-teal-bg)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[var(--accent)]" />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              {t('workflowModal.approveTitle')}
            </h3>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-black">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {error && (
            <div className="p-2.5 rounded bg-red-50 text-red-700 text-[12px] flex items-center gap-1.5 border border-red-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[12px] text-[var(--text-primary)]">
            {t('workflowModal.approveDesc', { code: loan.loan_code })}
          </p>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] flex flex-col gap-1">
            <div>
              <span className="text-slate-500">Thiết bị:</span>{' '}
              <span className="font-mono font-bold text-slate-800">{loan.equipment_code}</span> -{' '}
              {loan.equipment_name}
            </div>
            <div>
              <span className="text-slate-500">Chuyển:</span>{' '}
              <span className="font-semibold">{loan.from_company_name}</span> →{' '}
              <span className="font-semibold">{loan.to_company_name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              Người phê duyệt <span className="text-red-500">*</span>
            </label>
            <select
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
              className="form-input text-[12px] h-[32px]"
            >
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2 bg-[var(--bg-surface-2)]">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-[12px] px-3 py-1.5"
          >
            {t('actions.close')}
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={isPending}
            className="btn btn-primary text-[12px] px-4 py-1.5 flex items-center gap-1"
          >
            <span>{isPending ? t('actions.saving') : t('actions.approve')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 2. Reject Modal
// ==============================================================================
interface RejectModalProps {
  loan: EquipmentLoanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RejectModal({
  loan,
  isOpen,
  onClose,
  onSuccess,
}: RejectModalProps) {
  const t = useTranslations('Loans');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<{ employee_id: string; employee_name: string }[]>([]);
  const [approvedBy, setApprovedBy] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setRejectionReason('');
      getEmployeesForLoan().then((list) => {
        setEmployees(list);
        if (list.length > 0) setApprovedBy(list[0].employee_id);
      });
    }
  }, [isOpen]);

  if (!isOpen || !loan) return null;

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    startTransition(async () => {
      const res = await rejectEquipmentLoan({
        loan_id: loan.loan_id,
        approved_by: approvedBy,
        rejection_reason: rejectionReason.trim(),
      });
      if (!res.success) {
        setError(res.error || 'Có lỗi xảy ra khi từ chối.');
      } else {
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="card-flat bg-[var(--bg-surface)] w-full max-w-md flex flex-col rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-red-50 text-red-900">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="text-[14px] font-bold">
              {t('workflowModal.rejectTitle')}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-black">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {error && (
            <div className="p-2.5 rounded bg-red-50 text-red-700 text-[12px] flex items-center gap-1.5 border border-red-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              Người từ chối <span className="text-red-500">*</span>
            </label>
            <select
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
              className="form-input text-[12px] h-[32px]"
            >
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('workflowModal.rejectionReasonLabel')} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t('workflowModal.rejectionReasonPlaceholder')}
              className="form-textarea text-[12px]"
              required
            />
          </div>
        </div>

        <div className="p-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2 bg-[var(--bg-surface-2)]">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-[12px] px-3 py-1.5"
          >
            {t('actions.close')}
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={isPending}
            className="btn text-[12px] px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
          >
            <span>{isPending ? t('actions.saving') : t('actions.reject')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 3. Dispatch Modal
// ==============================================================================
interface DispatchModalProps {
  loan: EquipmentLoanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DispatchModal({
  loan,
  isOpen,
  onClose,
  onSuccess,
}: DispatchModalProps) {
  const t = useTranslations('Loans');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<{ employee_id: string; employee_name: string }[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setNotes('');
      getEmployeesForLoan().then((list) => {
        setEmployees(list);
        if (list.length > 0) setEmployeeId(list[0].employee_id);
      });
    }
  }, [isOpen]);

  if (!isOpen || !loan) return null;

  const handleDispatch = () => {
    if (!employeeId) {
      setError('Vui lòng chọn nhân viên xuất kho.');
      return;
    }
    startTransition(async () => {
      const res = await dispatchEquipmentLoan({
        loan_id: loan.loan_id,
        employee_id: employeeId,
        notes: notes.trim() || undefined,
      });
      if (!res.success) {
        setError(res.error || 'Có lỗi xảy ra khi xuất kho.');
      } else {
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="card-flat bg-[var(--bg-surface)] w-full max-w-md flex flex-col rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-blue-50 text-blue-900">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-blue-600" />
            <h3 className="text-[14px] font-bold">
              {t('workflowModal.dispatchTitle')}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-black">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {error && (
            <div className="p-2.5 rounded bg-red-50 text-red-700 text-[12px] flex items-center gap-1.5 border border-red-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[12px] text-[var(--text-primary)]">
            {t('workflowModal.dispatchDesc')}
          </p>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] flex flex-col gap-1">
            <div>
              <span className="text-slate-500">Mã phiếu:</span>{' '}
              <span className="font-mono font-bold text-[var(--accent)]">{loan.loan_code}</span>
            </div>
            <div>
              <span className="text-slate-500">Thiết bị:</span>{' '}
              <span className="font-mono font-bold text-slate-800">{loan.equipment_code}</span> -{' '}
              {loan.equipment_name}
            </div>
            <div>
              <span className="text-slate-500">Đơn vị nhận:</span>{' '}
              <span className="font-bold text-slate-800">{loan.to_company_name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('workflowModal.dispatchedByLabel')} <span className="text-red-500">*</span>
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="form-input text-[12px] h-[32px]"
            >
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('workflowModal.dispatchNotesLabel')}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('workflowModal.dispatchNotesPlaceholder')}
              className="form-input text-[12px] h-[32px]"
            />
          </div>
        </div>

        <div className="p-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2 bg-[var(--bg-surface-2)]">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-[12px] px-3 py-1.5"
          >
            {t('actions.close')}
          </button>
          <button
            type="button"
            onClick={handleDispatch}
            disabled={isPending}
            className="btn btn-primary text-[12px] px-4 py-1.5 flex items-center gap-1"
          >
            <span>{isPending ? t('actions.saving') : t('actions.dispatch')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 4. Return Check-In Modal
// ==============================================================================
interface ReturnCheckInModalProps {
  loan: EquipmentLoanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReturnCheckInModal({
  loan,
  isOpen,
  onClose,
  onSuccess,
}: ReturnCheckInModalProps) {
  const t = useTranslations('Loans');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<{ employee_id: string; employee_name: string }[]>([]);
  const [rackLayers, setRackLayers] = useState<
    { id: string; layer_code: string; rack_code: string; rack_name: string | null }[]
  >([]);

  const [employeeId, setEmployeeId] = useState('');
  const [newRackLayerId, setNewRackLayerId] = useState('');
  const [conditionOnReturn, setConditionOnReturn] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setConditionOnReturn('');
      setNotes('');
      setNewRackLayerId('');

      Promise.all([getEmployeesForLoan(), getRackLayersForReturn()]).then(([emps, rls]) => {
        setEmployees(emps);
        if (emps.length > 0) setEmployeeId(emps[0].employee_id);
        setRackLayers(rls);
      });
    }
  }, [isOpen]);

  if (!isOpen || !loan) return null;

  const handleReturn = () => {
    if (!employeeId) {
      setError('Vui lòng chọn người nghiệm thu nhận lại.');
      return;
    }

    startTransition(async () => {
      const res = await completeEquipmentLoanReturn({
        loan_id: loan.loan_id,
        employee_id: employeeId,
        new_rack_layer_id: newRackLayerId || null,
        condition_on_return: conditionOnReturn.trim() || null,
        notes: notes.trim() || null,
      });

      if (!res.success) {
        setError(res.error || 'Có lỗi xảy ra khi nhận lại.');
      } else {
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="card-flat bg-[var(--bg-surface)] w-full max-w-md flex flex-col rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-emerald-50 text-emerald-900">
          <div className="flex items-center gap-2">
            <Archive size={18} className="text-emerald-600" />
            <h3 className="text-[14px] font-bold">
              {t('workflowModal.returnTitle')}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-black">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {error && (
            <div className="p-2.5 rounded bg-red-50 text-red-700 text-[12px] flex items-center gap-1.5 border border-red-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[12px] text-[var(--text-primary)]">
            {t('workflowModal.returnDesc')}
          </p>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] flex flex-col gap-1">
            <div>
              <span className="text-slate-500">Mã phiếu:</span>{' '}
              <span className="font-mono font-bold text-[var(--accent)]">{loan.loan_code}</span>
            </div>
            <div>
              <span className="text-slate-500">Thiết bị:</span>{' '}
              <span className="font-mono font-bold text-slate-800">{loan.equipment_code}</span> -{' '}
              {loan.equipment_name}
            </div>
          </div>

          {/* Employee */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('workflowModal.returnedReceivedByLabel')} <span className="text-red-500">*</span>
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="form-input text-[12px] h-[32px]"
            >
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Rack Layer */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('workflowModal.targetRackLayerLabel')}
            </label>
            <select
              value={newRackLayerId}
              onChange={(e) => setNewRackLayerId(e.target.value)}
              className="form-input text-[12px] h-[32px]"
            >
              <option value="">-- {t('workflowModal.noRackLayerSelected')} --</option>
              {rackLayers.map((rl) => (
                <option key={rl.id} value={rl.id}>
                  {rl.rack_code} - {rl.layer_code} {rl.rack_name ? `(${rl.rack_name})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Condition on return */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('workflowModal.conditionOnReturnLabel')}
            </label>
            <input
              type="text"
              value={conditionOnReturn}
              onChange={(e) => setConditionOnReturn(e.target.value)}
              placeholder={t('workflowModal.conditionOnReturnPlaceholder')}
              className="form-input text-[12px] h-[32px]"
            />
          </div>

          {/* Return Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)]">
              {t('workflowModal.returnNotesLabel')}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('workflowModal.returnNotesPlaceholder')}
              className="form-input text-[12px] h-[32px]"
            />
          </div>
        </div>

        <div className="p-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2 bg-[var(--bg-surface-2)]">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-[12px] px-3 py-1.5"
          >
            {t('actions.close')}
          </button>
          <button
            type="button"
            onClick={handleReturn}
            disabled={isPending}
            className="btn btn-primary text-[12px] px-4 py-1.5 flex items-center gap-1"
          >
            <span>{isPending ? t('actions.saving') : t('actions.returnCheckIn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
