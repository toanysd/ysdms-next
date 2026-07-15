'use client';

import type { TechnicalReview } from '../types';

interface Props {
  reviews: TechnicalReview[];
}

const STATUS_LABELS: Record<string, string> = {
  superseded: '旧バージョン / Đã thay thế',
  rejected:   '却下 / Bị từ chối',
  draft:      '下書き / Nháp',
  in_review:  '審査中 / Đang duyệt',
  approved:   '承認済 / Đã duyệt',
};

const STATUS_BADGE: Record<string, string> = {
  superseded: 'badge-secondary',
  rejected:   'badge-danger',
  draft:      'badge-info',
  in_review:  'badge-warning',
  approved:   'badge-success',
};

export default function TechnicalReviewList({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <div style={{ marginTop: 'var(--space-6)' }}>
      <h4 className="section-subtitle">履歴 / Lịch sử version</h4>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Ver.</th>
              <th>Trạng thái</th>
              <th>Phương án khuôn</th>
              <th>Dao cắt</th>
              <th>Pocket</th>
              <th>Ghi chú / Lý do từ chối</th>
              <th>Ngày tạo</th>
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
                      {STATUS_LABELS[r.approval_status] ?? r.approval_status}
                    </span>
                  </td>
                  <td>{r.mold_option ?? '—'}</td>
                  <td>{r.cutting_die_option ?? '—'}</td>
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
