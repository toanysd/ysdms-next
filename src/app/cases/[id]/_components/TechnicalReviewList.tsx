'use client';

import type { TechnicalReview } from '../types';
import { useTranslations } from 'next-intl';

interface Props {
  reviews: TechnicalReview[];
}

const STATUS_BADGE: Record<string, string> = {
  superseded: 'badge-secondary',
  rejected:   'badge-danger',
  draft:      'badge-info',
  in_review:  'badge-warning',
  approved:   'badge-success',
};

export default function TechnicalReviewList({ reviews }: Props) {
  const t = useTranslations();
  if (reviews.length === 0) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'superseded': return t('Cases.TechnicalReview.statusSuperseded');
      case 'rejected': return t('Cases.TechnicalReview.statusRejected');
      case 'draft': return t('Cases.TechnicalReview.statusDraft');
      case 'in_review': return t('Cases.TechnicalReview.statusInReview');
      case 'approved': return t('Cases.TechnicalReview.statusApproved');
      default: return status;
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-6)' }}>
      <h4 className="section-subtitle">{t('Cases.TechnicalReview.historyTitle')}</h4>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{t('Cases.TechnicalReview.tableHeaders.ver')}</th>
              <th>{t('Cases.TechnicalReview.tableHeaders.status')}</th>
              <th>{t('Cases.TechnicalReview.tableHeaders.moldOption')}</th>
              <th>{t('Cases.TechnicalReview.tableHeaders.cuttingDie')}</th>
              <th>{t('Cases.TechnicalReview.tableHeaders.pocket')}</th>
              <th>{t('Cases.TechnicalReview.tableHeaders.notesOrRejectReason')}</th>
              <th>{t('Cases.TechnicalReview.tableHeaders.createdDate')}</th>
            </tr>
          </thead>
          <tbody>
            {reviews
              .sort((a, b) => b.version - a.version)
              .map((r) => (
                <tr key={r.id}>
                  <td className="text-center font-mono">v{r.version}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[r.approval_status] ?? 'badge-secondary'}`}>
                      {getStatusLabel(r.approval_status)}
                    </span>
                  </td>
                  <td>{r.mold_option ? t(`Cases.TechnicalReview.moldOptions.${r.mold_option}`, { defaultValue: r.mold_option }) : '—'}</td>
                  <td>{r.cutting_die_option ? t(`Cases.TechnicalReview.dieOptions.${r.cutting_die_option}`, { defaultValue: r.cutting_die_option }) : '—'}</td>
                  <td className="text-center">{r.pocket_count ?? '—'}</td>
                  <td className="text-muted text-sm">
                    {r.rejected_reason || r.technical_constraints?.slice(0, 60) || '—'}
                  </td>
                  <td className="text-sm">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString('ja-JP')
                      : '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
