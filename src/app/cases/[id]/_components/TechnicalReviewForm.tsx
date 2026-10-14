'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TechnicalReview, UserRole } from '../types';
import {
  saveTechnicalReviewDraft,
  submitTechnicalReview,
  approveTechnicalReview,
} from '../actions';
import { useTranslations } from 'next-intl';

interface Props {
  caseId: string;
  review: TechnicalReview | null;
  currentUserRole: UserRole;
  currentUserId: string;
  onClose: () => void;
}

export default function TechnicalReviewForm({
  caseId,
  review,
  currentUserRole,
  onClose,
}: Props) {
  const t = useTranslations();
  const supabase = createClient();

  const MOLD_OPTIONS = [
    { value: 'reuse',  label: t('Cases.TechnicalReview.moldOptions.reuse') },
    { value: 'modify', label: t('Cases.TechnicalReview.moldOptions.modify') },
    { value: 'remake', label: t('Cases.TechnicalReview.moldOptions.remake') },
    { value: 'new',    label: t('Cases.TechnicalReview.moldOptions.new') },
  ];

  const DIE_OPTIONS = [
    { value: 'reuse', label: t('Cases.TechnicalReview.dieOptions.reuse') },
    { value: 'new',   label: t('Cases.TechnicalReview.dieOptions.new') },
    { value: 'none',  label: t('Cases.TechnicalReview.dieOptions.none') },
  ];

  const isApproveMode =
    review?.approval_status === 'in_review' &&
    (currentUserRole === 'manager' || currentUserRole === 'admin');
  const isReadOnly =
    review?.approval_status === 'approved' ||
    review?.approval_status === 'superseded';

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string>(review?.product_id ?? '');
  const [products, setProducts] = useState<{ product_id: string; product_code: string; product_name: string | null }[]>([]);
  const [revisions, setRevisions] = useState<{ revision_id: string; design_code: string; product_id: string | null }[]>([]);
  const [molds, setMolds] = useState<{ equipment_id: string; equipment_code: string; display_name: string | null }[]>([]);
  const [cutters, setCutters] = useState<{ equipment_id: string; equipment_code: string; display_name: string | null }[]>([]);
  const [machines, setMachines] = useState<{ machine_id: string; machine_code: string; machine_name: string }[]>([]);
  const [employees, setEmployees] = useState<{ employee_id: string; employee_code: string; employee_name: string }[]>([]);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    async function loadReferenceData() {
      const [prodRes, revRes, moldRes, cutterRes, machRes, empRes] = await Promise.all([
        supabase.from('products').select('product_id, product_code, product_name').order('product_code').limit(500),
        supabase.from('design_revisions').select('revision_id, design_code, product_id').order('design_code').limit(500),
        supabase.from('equipment').select('equipment_id, equipment_code, display_name').eq('equipment_type', 'MOLD').order('equipment_code').limit(500),
        supabase.from('equipment').select('equipment_id, equipment_code, display_name').in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE']).order('equipment_code').limit(500),
        supabase.from('machines').select('machine_id, machine_code, machine_name').order('machine_code'),
        supabase.from('employees').select('employee_id, employee_code, employee_name').order('employee_code'),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (revRes.data) setRevisions(revRes.data);
      if (moldRes.data) setMolds(moldRes.data);
      if (cutterRes.data) setCutters(cutterRes.data);
      if (machRes.data) setMachines(machRes.data);
      if (empRes.data) setEmployees(empRes.data);
    }
    loadReferenceData();
  }, [supabase]);

  const filteredRevisions = selectedProductId
    ? revisions.filter((r) => r.product_id === selectedProductId || r.revision_id === review?.design_revision_id)
    : revisions;

  async function handleSaveDraft() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set('case_id', caseId);
    if (review?.id) fd.set('review_id', review.id);
    startTransition(async () => {
      const res = await saveTechnicalReviewDraft(fd);
      if (res?.error) setError(res.error);
      else onClose();
    });
  }

  async function handleSubmit() {
    if (!review?.id) return;
    startTransition(async () => {
      const res = await submitTechnicalReview(review.id);
      if (res?.error) setError(res.error);
      else onClose();
    });
  }

  async function handleApprove() {
    if (!review?.id) return;
    startTransition(async () => {
      const res = await approveTechnicalReview(review.id, 'approved', '');
      if (res?.error) setError(res.error);
      else onClose();
    });
  }

  async function handleReject() {
    if (!review?.id || !rejectReason.trim()) return;
    startTransition(async () => {
      const res = await approveTechnicalReview(review.id, 'rejected', rejectReason);
      if (res?.error) setError(res.error);
      else onClose();
    });
  }

  return (
    <div className="card" style={{ marginTop: 'var(--space-4)' }}>
      <div className="card-header">
        <span className="card-title">
          {review ? t('Cases.TechnicalReview.formTitleEdit', { version: review.version }) : t('Cases.TechnicalReview.formTitleNew')}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>

      <form ref={formRef}>
        {/* SECTION 1: Yêu cầu sản phẩm */}
        <fieldset className="form-section" disabled={isReadOnly}>
          <legend className="form-section-title">{t('Cases.TechnicalReview.section1')}</legend>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">対象製品 (Product)</label>
              <select
                name="product_id"
                className="form-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    [{p.product_code}] {p.product_name || p.product_code}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">設計版 (Design Revision)</label>
              <select
                name="design_revision_id"
                className="form-select"
                defaultValue={review?.design_revision_id ?? ''}
              >
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {filteredRevisions.map((r) => (
                  <option key={r.revision_id} value={r.revision_id}>
                    {r.design_code}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.materialSpec')}</label>
              <input
                name="material_spec"
                className="form-input"
                defaultValue={review?.material_spec ?? ''}
                placeholder="PET / PS / PVC..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.thickness')}</label>
              <input
                name="thickness_mm"
                type="number"
                step="0.01"
                className="form-input"
                defaultValue={review?.thickness_mm ?? ''}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">{t('Cases.TechnicalReview.specialRequirements')}</label>
              <textarea
                name="special_requirements"
                className="form-textarea"
                defaultValue={review?.special_requirements ?? ''}
                rows={2}
              />
            </div>
          </div>
        </fieldset>

        {/* SECTION 2: Phương án khuôn */}
        <fieldset className="form-section" disabled={isReadOnly}>
          <legend className="form-section-title">{t('Cases.TechnicalReview.section2')}</legend>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.moldOption')}</label>
              <select name="mold_option" className="form-select" defaultValue={review?.mold_option ?? ''}>
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {MOLD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.moldId')}</label>
              <select
                name="mold_id"
                className="form-select"
                defaultValue={review?.mold_id ?? ''}
              >
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {molds.map((m) => (
                  <option key={m.equipment_id} value={m.equipment_id}>
                    [{m.equipment_code}] {m.display_name || m.equipment_code}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.pocketCount')}</label>
              <input
                name="pocket_count"
                type="number"
                className="form-input"
                defaultValue={review?.pocket_count ?? ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.moldSizeX')}</label>
              <input
                name="mold_size_x"
                type="number"
                step="0.1"
                className="form-input"
                defaultValue={(review as any)?.mold_size_x ?? ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.moldSizeY')}</label>
              <input
                name="mold_size_y"
                type="number"
                step="0.1"
                className="form-input"
                defaultValue={(review as any)?.mold_size_y ?? ''}
              />
            </div>
          </div>
        </fieldset>

        {/* SECTION 3: Dao cắt & Thiết bị */}
        <fieldset className="form-section" disabled={isReadOnly}>
          <legend className="form-section-title">{t('Cases.TechnicalReview.section3')}</legend>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.cuttingDieOption')}</label>
              <select name="cutting_die_option" className="form-select" defaultValue={review?.cutting_die_option ?? ''}>
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {DIE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.cuttingDieId')}</label>
              <select
                name="cutting_die_id"
                className="form-select"
                defaultValue={review?.cutting_die_id ?? ''}
              >
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {cutters.map((c) => (
                  <option key={c.equipment_id} value={c.equipment_id}>
                    [{c.equipment_code}] {c.display_name || c.equipment_code}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.machineId')}</label>
              <select
                name="machine_id"
                className="form-select"
                defaultValue={review?.machine_id ?? ''}
              >
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {machines.map((mc) => (
                  <option key={mc.machine_id} value={mc.machine_id}>
                    [{mc.machine_code}] {mc.machine_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.leadTimeDays')}</label>
              <input
                name="lead_time_days"
                type="number"
                className="form-input"
                defaultValue={review?.lead_time_days ?? ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('Cases.TechnicalReview.cycleTimeSec')}</label>
              <input
                name="cycle_time_sec"
                type="number"
                step="0.1"
                className="form-input"
                defaultValue={review?.cycle_time_sec ?? ''}
              />
            </div>
          </div>
        </fieldset>

        {/* SECTION 4: Kết luận & Người phụ trách (employees FK) */}
        <fieldset className="form-section" disabled={isReadOnly && !isApproveMode}>
          <legend className="form-section-title">{t('Cases.TechnicalReview.section4')}</legend>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">依頼者 (Requested By)</label>
              <select
                name="requested_by"
                className="form-select"
                defaultValue={review?.requested_by ?? ''}
                disabled={isReadOnly}
              >
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    [{emp.employee_code}] {emp.employee_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">担当者 (Reviewed By)</label>
              <select
                name="reviewed_by"
                className="form-select"
                defaultValue={review?.reviewed_by ?? ''}
                disabled={isReadOnly}
              >
                <option value="">{t('Cases.TechnicalReview.choosePlaceholder')}</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    [{emp.employee_code}] {emp.employee_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">{t('Cases.TechnicalReview.technicalConstraintsLabel')}</label>
              <textarea
                name="technical_constraints"
                className="form-textarea"
                rows={4}
                defaultValue={review?.technical_constraints ?? ''}
              />
            </div>
          </div>

          {/* Reject reason input */}
          {isApproveMode && showRejectInput && (
            <div className="form-group" style={{ marginTop: 'var(--space-3)' }}>
              <label className="form-label">{t('Cases.TechnicalReview.rejectReason')}</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t('Cases.TechnicalReview.rejectReasonPlaceholder')}
              />
            </div>
          )}
        </fieldset>

        {error && (
          <div className="alert alert-error" style={{ margin: 'var(--space-3) 0' }}>
            {error}
          </div>
        )}
      </form>

      {/* ACTION BUTTONS */}
      <div className="card-footer" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {!isReadOnly && !isApproveMode && (
          <>
            <button
              className="btn btn-secondary"
              onClick={handleSaveDraft}
              disabled={isPending}
            >
              {t('Cases.TechnicalReview.saveDraft')}
            </button>
            {review && review.approval_status === 'draft' && (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {t('Cases.TechnicalReview.submitForApproval')}
              </button>
            )}
          </>
        )}

        {isApproveMode && (
          <>
            <button
              className="btn btn-primary"
              onClick={handleApprove}
              disabled={isPending}
            >
              {t('Cases.TechnicalReview.approve')}
            </button>
            {!showRejectInput ? (
              <button
                className="btn btn-danger"
                onClick={() => setShowRejectInput(true)}
                disabled={isPending}
              >
                {t('Cases.TechnicalReview.reject')}
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={isPending || !rejectReason.trim()}
              >
                {t('Cases.TechnicalReview.confirmReject')}
              </button>
            )}
          </>
        )}

        <button className="btn btn-ghost" onClick={onClose} disabled={isPending}>
          {t('Cases.TechnicalReview.cancel')}
        </button>
      </div>
    </div>
  );
}
