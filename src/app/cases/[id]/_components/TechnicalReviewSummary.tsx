'use client';

import { useRouter } from 'next/navigation';
import type { TechnicalReview, UserRole } from '../types';
import { createTechnicalReviewRevision } from '../actions';
import { useTransition } from 'react';

interface Props {
  review: TechnicalReview;
  caseId: string;
  currentUserRole: UserRole;
  onCreateRevision: () => void;
}

export default function TechnicalReviewSummary({
  review,
  caseId,
  currentUserRole,
  onCreateRevision,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const rows: { label: string; value: string | number | null | undefined }[] = [
    { label: 'Version',          value: review.version },
    { label: 'Vật liệu',         value: review.material_spec },
    { label: 'Độ dày (mm)',      value: review.thickness_mm },
    { label: 'Phương án khuôn',  value: review.mold_option },
    { label: 'Số pocket',        value: review.pocket_count },
    { label: 'Phương án dao cắt',value: review.cutting_die_option },
    { label: 'Lead time (ngày)', value: review.lead_time_days },
    { label: 'Cycle time (sec)', value: review.cycle_time_sec },
    { label: 'Yêu cầu đặc biệt',value: review.special_requirements },
    { label: 'Ghi chú kỹ thuật',value: review.technical_constraints },
    { label: 'Người duyệt',      value: review.approved_by },
    {
      label: 'Ngày duyệt',
      value: review.approved_at
        ? new Date(review.approved_at).toLocaleDateString('ja-JP')
        : null,
    },
  ];

  function handleCreateQuotation() {
    router.push(`/quotations/new?case_id=${caseId}&review_id=${review.id}`);
  }

  function handleCreateRevision() {
    startTransition(async () => {
      await createTechnicalReviewRevision(caseId);
      onCreateRevision();
    });
  }

  return (
    <div className="card card-approved">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="card-title">✅ Technical Review đã duyệt</span>
          <span className="badge badge-success">承認済 / Approved</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            className="btn btn-primary"
            onClick={handleCreateQuotation}
          >
            📄 見積書を作成 / Tạo báo giá
          </button>
          {(currentUserRole === 'engineering' || currentUserRole === 'manager') && (
            <button
              className="btn btn-secondary"
              onClick={handleCreateRevision}
              disabled={isPending}
            >
              🔄 Tạo Revision mới
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        <dl className="summary-grid">
          {rows.map((row) =>
            row.value != null && row.value !== '' ? (
              <div key={row.label} className="summary-row">
                <dt className="summary-label">{row.label}</dt>
                <dd className="summary-value">{String(row.value)}</dd>
              </div>
            ) : null
          )}
        </dl>
      </div>
    </div>
  );
}
