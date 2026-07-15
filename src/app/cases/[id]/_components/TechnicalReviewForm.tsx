'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import type { TechnicalReview, UserRole } from '../types';
import {
  saveTechnicalReviewDraft,
  submitTechnicalReview,
  approveTechnicalReview,
} from '../actions';

interface Props {
  caseId: string;
  review: TechnicalReview | null;
  currentUserRole: UserRole;
  currentUserId: string;
  onClose: () => void;
}

const MOLD_OPTIONS = [
  { value: 'reuse',  label: '流用 / Tái sử dụng' },
  { value: 'modify', label: '改造 / Chỉnh sửa' },
  { value: 'remake', label: '作り直し / Làm lại' },
  { value: 'new',    label: '新規 / Khuôn mới' },
];

const DIE_OPTIONS = [
  { value: 'reuse', label: '流用 / Tái sử dụng' },
  { value: 'new',   label: '新規 / Dao mới' },
  { value: 'none',  label: 'なし / Không cần' },
];

export default function TechnicalReviewForm({
  caseId,
  review,
  currentUserRole,
  currentUserId,
  onClose,
}: Props) {
  const isApproveMode =
    review?.approval_status === 'in_review' && currentUserRole === 'manager';
  const isReadOnly =
    review?.approval_status === 'approved' ||
    review?.approval_status === 'superseded';

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

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
          {review ? `Technical Review — Version ${review.version}` : 'Tạo Technical Review mới'}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>

      <form ref={formRef}>
        {/* SECTION 1: Yêu cầu sản phẩm */}
        <fieldset className="form-section" disabled={isReadOnly}>
          <legend className="form-section-title">① Yêu cầu sản phẩm</legend>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Product ID</label>
              <input
                name="product_id"
                className="form-input"
                defaultValue={review?.product_id ?? ''}
                placeholder="FK product_id"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Design Revision ID</label>
              <input
                name="design_revision_id"
                className="form-input"
                defaultValue={review?.design_revision_id ?? ''}
                placeholder="FK revision_id"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vật liệu</label>
              <input
                name="material_spec"
                className="form-input"
                defaultValue={review?.material_spec ?? ''}
                placeholder="PET / PS / PVC..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Độ dày (mm)</label>
              <input
                name="thickness_mm"
                type="number"
                step="0.01"
                className="form-input"
                defaultValue={review?.thickness_mm ?? ''}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Yêu cầu đặc biệt</label>
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
          <legend className="form-section-title">② 金型方針 / Phương án khuôn</legend>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Phương án khuôn</label>
              <select name="mold_option" className="form-select" defaultValue={review?.mold_option ?? ''}>
                <option value="">-- Chọn --</option>
                {MOLD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Khuôn liên quan (mold_id)</label>
              <input
                name="mold_id"
                className="form-input"
                defaultValue={review?.mold_id ?? ''}
                placeholder="FK physical_mold_id"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Số pocket / cavity</label>
              <input
                name="pocket_count"
                type="number"
                className="form-input"
                defaultValue={review?.pocket_count ?? ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kích thước khuôn X (mm)</label>
              <input
                name="mold_size_x"
                type="number"
                step="0.1"
                className="form-input"
                defaultValue={(review as any)?.mold_size_x ?? ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kích thước khuôn Y (mm)</label>
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
          <legend className="form-section-title">③ 刃型・設備 / Dao cắt & Thiết bị</legend>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Phương án dao cắt</label>
              <select name="cutting_die_option" className="form-select" defaultValue={review?.cutting_die_option ?? ''}>
                <option value="">-- Chọn --</option>
                {DIE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dao cắt liên quan (cutting_die_id)</label>
              <input
                name="cutting_die_id"
                className="form-input"
                defaultValue={review?.cutting_die_id ?? ''}
                placeholder="FK cutter_id"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Máy định hình đề xuất</label>
              <input
                name="machine_id"
                className="form-input"
                defaultValue={review?.machine_id ?? ''}
                placeholder="FK machine_id"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lead time kỹ thuật (ngày)</label>
              <input
                name="lead_time_days"
                type="number"
                className="form-input"
                defaultValue={review?.lead_time_days ?? ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cycle time ước tính (giây)</label>
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

        {/* SECTION 4: Kết luận */}
        <fieldset className="form-section" disabled={isReadOnly && !isApproveMode}>
          <legend className="form-section-title">④ 結論 / Kết luận kỹ thuật</legend>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Ghi chú kỹ thuật / Ràng buộc / Rủi ro</label>
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
              <label className="form-label">Lý do từ chối</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do..."
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
              💾 Lưu nháp
            </button>
            {review && review.approval_status === 'draft' && (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isPending}
              >
                📤 Gửi duyệt
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
              ✅ Duyệt
            </button>
            {!showRejectInput ? (
              <button
                className="btn btn-danger"
                onClick={() => setShowRejectInput(true)}
                disabled={isPending}
              >
                ❌ Từ chối
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={isPending || !rejectReason.trim()}
              >
                ❌ Xác nhận từ chối
              </button>
            )}
          </>
        )}

        <button className="btn btn-ghost" onClick={onClose} disabled={isPending}>
          Hủy
        </button>
      </div>
    </div>
  );
}
