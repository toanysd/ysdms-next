'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeftRight, Plus, RefreshCw, FileSpreadsheet, Coins } from 'lucide-react';

interface LoanHeaderProps {
  onOpenCreate: () => void;
  onOpenAuditExport?: () => void;
  onOpenStorageFee?: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function LoanHeader({
  onOpenCreate,
  onOpenAuditExport,
  onOpenStorageFee,
  onRefresh,
  loading = false,
}: LoanHeaderProps) {
  const t = useTranslations('Loans');

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 pb-1 border-b border-[var(--border-subtle)]">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--tint-orange-bg)', color: 'var(--accent)' }}
        >
          <ArrowLeftRight size={22} />
        </div>
        <div>
          <h1
            className="text-[18px] font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h1>
          <p
            className="text-[12px] mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="btn btn-secondary flex items-center gap-1.5 text-[13px]"
          title={t('refresh')}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{t('refresh')}</span>
        </button>

        {onOpenAuditExport && (
          <button
            type="button"
            onClick={onOpenAuditExport}
            className="btn btn-secondary flex items-center gap-1.5 text-[13px]"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            title="年次棚卸調査リスト・有高確認"
          >
            <FileSpreadsheet size={15} style={{ color: 'var(--accent)' }} />
            <span>年次棚卸リスト</span>
          </button>
        )}

        {onOpenStorageFee && (
          <button
            type="button"
            onClick={onOpenStorageFee}
            className="btn btn-secondary flex items-center gap-1.5 text-[13px]"
            style={{ borderColor: 'var(--status-warning)', color: 'var(--text-primary)' }}
            title="型保管料算出・長期非稼働金型 (≥3年)"
          >
            <Coins size={15} style={{ color: 'var(--status-warning)' }} />
            <span>型保管料算出</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenCreate}
          className="btn btn-primary flex items-center gap-1.5 text-[13px]"
        >
          <Plus size={16} />
          <span>{t('createLoan')}</span>
        </button>
      </div>
    </div>
  );
}
