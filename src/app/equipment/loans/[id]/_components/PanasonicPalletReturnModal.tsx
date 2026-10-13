'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { X, PackageCheck, CheckCircle2, AlertCircle, FileText, QrCode, ShieldCheck, Truck } from 'lucide-react';
import { createPanasonicPalletReturnRequest } from '../../actions';
import type { EquipmentLoanItem, CreatePanasonicReturnInput } from '../../types';

interface PanasonicPalletReturnModalProps {
  loan: EquipmentLoanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PanasonicPalletReturnModal({
  loan,
  isOpen,
  onClose,
  onSuccess,
}: PanasonicPalletReturnModalProps) {
  const t = useTranslations('Loans');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [palletSpec] = useState('1,100 × 1,100 mm (JIS規格)');
  const [totalHeightMm, setTotalHeightMm] = useState<number>(650);
  const [totalWeightKg, setTotalWeightKg] = useState<number>(185.5);
  const [qrSerialTag, setQrSerialTag] = useState(
    `PNS-${loan?.equipment_code || 'MOLD'}-2024`
  );
  const [qrVerified, setQrVerified] = useState(true);

  // 4 Checklist items
  const [checkDrawings, setCheckDrawings] = useState(true);
  const [checkParts, setCheckParts] = useState(true);
  const [checkOriginalDoc, setCheckOriginalDoc] = useState(true);
  const [checkFilm, setCheckFilm] = useState(true);

  const [dispatcherName, setDispatcherName] = useState('YSD 出庫担当 (遠藤)');
  const [transporterName, setTransporterName] = useState('ヤマト運輸 / クレーン車');
  const [receiverName, setReceiverName] = useState(
    loan?.to_company_name || 'パナソニック株式会社 白河工場'
  );
  const [sealType, setSealType] = useState<'NONE' | 'MARUIN' | 'KAKUIN' | 'BOTH'>('BOTH');
  const [notes, setNotes] = useState(
    'パレット4方差しクレーン吊り対応、白河工場第2搬入口にて荷下ろし'
  );

  if (!isOpen || !loan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrVerified || !qrSerialTag.trim()) {
      setError(t('panasonicReturnModal.qrWarning'));
      return;
    }
    if (!totalHeightMm || totalHeightMm <= 0) {
      setError(t('panasonicReturnModal.totalHeightHint'));
      return;
    }
    if (!totalWeightKg || totalWeightKg <= 0) {
      setError(t('panasonicReturnModal.totalWeightPlaceholder'));
      return;
    }

    setError(null);
    startTransition(async () => {
      const payload: CreatePanasonicReturnInput = {
        loan_id: loan.loan_id,
        pallet_spec: palletSpec,
        total_height_mm: Number(totalHeightMm),
        total_weight_kg: Number(totalWeightKg),
        qr_serial_tag: qrSerialTag.trim(),
        qr_verified: qrVerified,
        crane_truck_required: true,
        checklist: {
          mold_drawings: checkDrawings,
          spare_parts: checkParts,
          original_loan_doc: checkOriginalDoc,
          stretch_film_wrapped: checkFilm,
        },
        return_date: new Date().toISOString().slice(0, 10),
        dispatcher_name: dispatcherName,
        transporter_name: transporterName,
        receiver_name: receiverName,
        seal_type: sealType,
        notes: notes.trim() || undefined,
      };

      const res = await createPanasonicPalletReturnRequest(payload);
      if (res.success) {
        setSuccessMsg(t('panasonicReturnModal.success'));
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'Failed to submit Panasonic Return Request');
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
    >
      <div
        data-testid="panasonic-return-modal"
        className="card-flat bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-2xl max-h-[92vh] overflow-hidden"
        style={{ border: '1px solid #CBD5E1' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ background: 'var(--tint-teal-bg)', borderColor: '#99F6E4' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded"
              style={{ background: '#0D9488', color: '#ffffff' }}
            >
              <PackageCheck size={18} />
            </div>
            <div>
              <h2
                className="font-bold text-[14px]"
                style={{ color: '#0F172A', margin: 0 }}
              >
                {t('panasonicReturnModal.title')}
              </h2>
              <p
                className="text-[11px] font-medium"
                style={{ color: '#0F766E', margin: 0 }}
              >
                {t('panasonicReturnModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-teal-100 transition-colors"
            style={{ color: '#0F766E' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 text-[13px]">
          {error && (
            <div
              className="p-3 rounded flex items-center gap-2 text-[12px] font-bold"
              style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C' }}
            >
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              className="p-3 rounded flex items-center gap-2 text-[12px] font-bold"
              style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#15803D' }}
            >
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Target Tooling Info */}
          <div
            className="p-3 rounded flex items-center justify-between"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div>
              <span className="text-[11px] font-semibold" style={{ color: '#64748B' }}>
                対象金型 (Equipment):
              </span>
              <div className="font-bold font-mono text-[13px]" style={{ color: '#0F172A' }}>
                {loan.equipment_code} — {loan.equipment_name || '金型本体'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold" style={{ color: '#64748B' }}>
                返却先 (Partner):
              </span>
              <div className="font-bold text-[12px]" style={{ color: '#0D9488' }}>
                {receiverName}
              </div>
            </div>
          </div>

          {/* Section 1: Pallet & Crane Specs */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: '#0F172A' }}>
              <Truck size={14} className="text-teal-600" />
              1. {t('panasonicReturnModal.palletSpec')} & {t('panasonicReturnModal.totalHeight')}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: '#475569' }}>
                  {t('panasonicReturnModal.palletSpec')}
                </label>
                <div
                  className="form-input flex items-center font-bold text-[12px]"
                  style={{ background: '#F1F5F9', color: '#0F172A' }}
                >
                  {palletSpec}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: '#475569' }}>
                  {t('panasonicReturnModal.totalHeight')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={totalHeightMm}
                    onChange={(e) => setTotalHeightMm(Number(e.target.value))}
                    className="form-input font-mono font-bold text-[13px] w-full"
                    placeholder={t('panasonicReturnModal.totalHeightPlaceholder')}
                    required
                  />
                  <span className="text-[12px] font-semibold" style={{ color: '#64748B' }}>mm</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: '#475569' }}>
                  {t('panasonicReturnModal.totalWeight')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    value={totalWeightKg}
                    onChange={(e) => setTotalWeightKg(Number(e.target.value))}
                    className="form-input font-mono font-bold text-[13px] w-full"
                    placeholder={t('panasonicReturnModal.totalWeightPlaceholder')}
                    required
                  />
                  <span className="text-[12px] font-semibold" style={{ color: '#64748B' }}>kg</span>
                </div>
              </div>
            </div>
            <span className="text-[10.5px]" style={{ color: '#64748B' }}>
              {t('panasonicReturnModal.totalHeightHint')}
            </span>
          </div>

          {/* Section 2: Individual QR Verification */}
          <div
            className="p-3 rounded flex flex-col gap-2"
            style={{ background: '#F0FDFA', border: '1px solid #CCFBF1' }}
          >
            <span className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: '#0F766E' }}>
              <QrCode size={14} />
              2. {t('panasonicReturnModal.qrSectionTitle')}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: '#134E4A' }}>
                  {t('panasonicReturnModal.qrSerialTag')}
                </label>
                <input
                  type="text"
                  value={qrSerialTag}
                  onChange={(e) => setQrSerialTag(e.target.value)}
                  className="form-input font-mono font-bold text-[13px] w-full"
                  placeholder={t('panasonicReturnModal.qrSerialTagPlaceholder')}
                  required
                />
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qrVerified}
                    onChange={(e) => setQrVerified(e.target.checked)}
                    className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-[11.5px] font-bold" style={{ color: '#134E4A' }}>
                    {t('panasonicReturnModal.qrVerified')}
                  </span>
                </label>
              </div>
            </div>
            <span className="text-[10.5px] font-medium" style={{ color: '#0F766E' }}>
              {t('panasonicReturnModal.qrWarning')}
            </span>
          </div>

          {/* Section 3: Accompanying Items Checklist (4 items) */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: '#0F172A' }}>
              <ShieldCheck size={14} className="text-teal-600" />
              3. {t('panasonicReturnModal.checklistTitle')}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 rounded" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={checkDrawings}
                  onChange={(e) => setCheckDrawings(e.target.checked)}
                  className="h-4 w-4 rounded text-teal-600"
                />
                <span className="font-semibold" style={{ color: '#334155' }}>
                  {t('panasonicReturnModal.checkDrawings')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={checkParts}
                  onChange={(e) => setCheckParts(e.target.checked)}
                  className="h-4 w-4 rounded text-teal-600"
                />
                <span className="font-semibold" style={{ color: '#334155' }}>
                  {t('panasonicReturnModal.checkParts')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={checkOriginalDoc}
                  onChange={(e) => setCheckOriginalDoc(e.target.checked)}
                  className="h-4 w-4 rounded text-teal-600"
                />
                <span className="font-semibold" style={{ color: '#334155' }}>
                  {t('panasonicReturnModal.checkOriginalDoc')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={checkFilm}
                  onChange={(e) => setCheckFilm(e.target.checked)}
                  className="h-4 w-4 rounded text-teal-600"
                />
                <span className="font-semibold" style={{ color: '#334155' }}>
                  {t('panasonicReturnModal.checkFilm')}
                </span>
              </label>
            </div>
          </div>

          {/* Section 4: 3-Party Logistics & Electronic Seals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold block mb-1" style={{ color: '#475569' }}>
                {t('panasonicReturnModal.dispatcherName')}
              </label>
              <input
                type="text"
                value={dispatcherName}
                onChange={(e) => setDispatcherName(e.target.value)}
                className="form-input text-[12px] w-full"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold block mb-1" style={{ color: '#475569' }}>
                {t('panasonicReturnModal.transporterName')}
              </label>
              <input
                type="text"
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                className="form-input text-[12px] w-full"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold block mb-1" style={{ color: '#475569' }}>
                {t('panasonicReturnModal.sealType')}
              </label>
              <select
                value={sealType}
                onChange={(e) => setSealType(e.target.value as any)}
                className="form-input text-[12px] w-full"
              >
                <option value="BOTH">{t('panasonicReturnModal.sealBoth')}</option>
                <option value="MARUIN">{t('panasonicReturnModal.sealMaruin')}</option>
                <option value="KAKUIN">{t('panasonicReturnModal.sealKakuin')}</option>
                <option value="NONE">{t('panasonicReturnModal.sealNone')}</option>
              </select>
            </div>
          </div>

          {/* Section 5: Notes */}
          <div>
            <label className="text-[11px] font-semibold block mb-1" style={{ color: '#475569' }}>
              {t('panasonicReturnModal.notes')}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input text-[12px] w-full"
              placeholder={t('panasonicReturnModal.notesPlaceholder')}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t mt-1" style={{ borderColor: '#E2E8F0' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="btn btn-secondary text-[12px] px-4 py-2"
            >
              {t('panasonicReturnModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isPending || !qrVerified}
              className="btn btn-primary text-[12px] px-5 py-2 flex items-center gap-1.5 font-bold"
              style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' }}
            >
              <PackageCheck size={15} />
              <span>
                {isPending ? t('panasonicReturnModal.submitting') : t('panasonicReturnModal.submit')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
