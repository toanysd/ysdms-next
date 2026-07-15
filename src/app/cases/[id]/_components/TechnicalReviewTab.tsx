'use client';

import { useState } from 'react';
import type { TechnicalReview, UserRole } from '../types';
import TechnicalReviewForm from './TechnicalReviewForm';
import TechnicalReviewList from './TechnicalReviewList';
import TechnicalReviewSummary from './TechnicalReviewSummary';

interface Props {
  caseId: string;
  reviews: TechnicalReview[];
  currentUserRole: UserRole;
  currentUserId: string;
  // Callback từ parent (page.tsx) — chuyển sang Sales tab và mở modal
  onCreateQuotation?: () => void;
}

export default function TechnicalReviewTab({
  caseId,
  reviews,
  currentUserRole,
  currentUserId,
  onCreateQuotation,
}: Props) {
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view');
  const [editingReview, setEditingReview] = useState<TechnicalReview | null>(null);

  const approvedReview = reviews.find((r) => r.approval_status === 'approved');
  const activeReview = reviews.find((r) => r.approval_status === 'draft' || r.approval_status === 'in_review');
  const historyReviews = reviews.filter((r) => r.approval_status === 'superseded' || r.approval_status === 'rejected');

  function handleCreate() {
    setEditingReview(null);
    setMode('create');
  }

  function handleEdit(review: TechnicalReview) {
    setEditingReview(review);
    setMode('edit');
  }

  function handleFormClose() {
    setEditingReview(null);
    setMode('view');
  }

  if (reviews.length === 0 && mode === 'view') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔧</div>
        <h3 className="empty-state-title">Chưa có Technical Review</h3>
        <p className="empty-state-desc">
          Tạo hồ sơ đánh giá kỹ thuật để cung cấp căn cứ cho báo giá.
        </p>
        {(currentUserRole === 'engineering' || currentUserRole === 'manager') && (
          <button className="btn btn-primary" onClick={handleCreate}>
            技術検討を作成 / Tạo Technical Review
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="technical-review-tab">
      {/* Approved summary block */}
      {approvedReview && mode === 'view' && (
        <TechnicalReviewSummary
          review={approvedReview}
          caseId={caseId}
          currentUserRole={currentUserRole}
          onCreateRevision={() => handleCreate()}
          onCreateQuotation={onCreateQuotation}
        />
      )}

      {/* Active draft / in_review block */}
      {activeReview && mode === 'view' && (
        <div className="card" style={{ marginTop: 'var(--space-4)' }}>
          <div className="card-header">
            <span className="card-title">Đang soạn — Version {activeReview.version}</span>
            <span className={`badge badge-${activeReview.approval_status === 'in_review' ? 'warning' : 'info'}`}>
              {activeReview.approval_status === 'in_review' ? '審査中 / Đang duyệt' : '下書き / Nháp'}
            </span>
          </div>
          <div className="card-body">
            <p className="text-muted text-sm">
              {activeReview.technical_constraints || 'Chưa có ghi chú kỹ thuật.'}
            </p>
          </div>
          <div className="card-footer">
            {(currentUserRole === 'engineering' || currentUserRole === 'manager') &&
              activeReview.approval_status === 'draft' && (
              <button
                className="btn btn-secondary"
                onClick={() => handleEdit(activeReview)}
              >
                ✏️ Chỉnh sửa
              </button>
            )}
            {(currentUserRole === 'manager') &&
              activeReview.approval_status === 'in_review' && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(activeReview)}
                >
                  ✅ Duyệt / Từ chối
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Form */}
      {(mode === 'create' || mode === 'edit') && (
        <TechnicalReviewForm
          caseId={caseId}
          review={editingReview}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          onClose={handleFormClose}
        />
      )}

      {/* Header toolbar when in view mode */}
      {mode === 'view' && !activeReview && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
          {(currentUserRole === 'engineering' || currentUserRole === 'manager') && (
            <button className="btn btn-primary" onClick={handleCreate}>
              + 技術検討を作成 / Tạo Review mới
            </button>
          )}
        </div>
      )}

      {/* History list */}
      {historyReviews.length > 0 && (
        <TechnicalReviewList reviews={historyReviews} />
      )}
    </div>
  );
}
