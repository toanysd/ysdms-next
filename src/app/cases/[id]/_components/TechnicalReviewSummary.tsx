'use client';

import type { TechnicalReview, UserRole } from '../types';
import { createTechnicalReviewRevision } from '../actions';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  review: TechnicalReview;
  caseId: string;
  currentUserRole: UserRole;
  onCreateRevision: () => void;
  // Callback từ page.tsx — chuyển sang Sales tab và mở modal báo giá
  onCreateQuotation?: () => void;
}

export default function TechnicalReviewSummary({
  review,
  caseId: _caseId,
  currentUserRole,
  onCreateRevision,
  onCreateQuotation,
}: Props) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const rows: { label: string; value: string | number | null | undefined }[] = [
    { label: t('Cases.TechnicalReview.fields.version'),           value: review.version },
    { label: t('Cases.TechnicalReview.fields.material'),          value: review.material_spec },
    { label: t('Cases.TechnicalReview.fields.thickness'),         value: review.thickness_mm },
    { label: t('Cases.TechnicalReview.fields.moldOption'),         value: review.mold_option },
    { label: t('Cases.TechnicalReview.fields.pocketCount'),         value: review.pocket_count },
    { label: t('Cases.TechnicalReview.fields.cuttingDieOption'),   value: review.cutting_die_option },
    { label: t('Cases.TechnicalReview.fields.leadTime'),          value: review.lead_time_days },
    { label: t('Cases.TechnicalReview.fields.cycleTime'),          value: review.cycle_time_sec },
    { label: t('Cases.TechnicalReview.fields.specialRequirements'),value: review.special_requirements },
    { label: t('Cases.TechnicalReview.fields.technicalConstraints'),value: review.technical_constraints },
    { label: t('Cases.TechnicalReview.fields.approvedBy'),         value: review.approved_by },
    {
      label: t('Cases.TechnicalReview.fields.approvedAt'),
      value: review.approved_at
        ? new Date(review.approved_at).toLocaleDateString('ja-JP')
        : null,
    },
  ];

  function handleCreateRevision() {
    startTransition(async () => {
      await createTechnicalReviewRevision(_caseId);
      onCreateRevision();
    });
  }

  return (
    <div className="card card-approved">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="card-title">✅ {t('Cases.TechnicalReview.approvedSummaryTitle')}</span>
          <span className="badge badge-success">{t('Cases.TechnicalReview.statusApproved')}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Nút này chuyển sang Tab 販売 và mở modal — KHÔNG navigate ra /quotations/new */}
          {onCreateQuotation && (
            <button
              className="btn btn-primary"
              onClick={onCreateQuotation}
            >
              📄 {t('Cases.TechnicalReview.createQuotationBtn')}
            </button>
          )}
          {(currentUserRole === 'engineering' || currentUserRole === 'manager') && (
            <button
              className="btn btn-secondary"
              onClick={handleCreateRevision}
              disabled={isPending}
            >
              🔄 {t('Cases.TechnicalReview.createRevisionBtn')}
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
