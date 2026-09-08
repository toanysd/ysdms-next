'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, Filter } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { SearchSuggestions } from '@/components/ui/SearchSuggestions';
import type { LoanType, LoanStatus } from '../types';

interface LoanFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedTab: string;
  onTabChange: (tab: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onClear: () => void;
  totalCount: number;
}

export default function LoanFilterBar({
  search,
  onSearchChange,
  selectedTab,
  onTabChange,
  selectedStatus,
  onStatusChange,
  onClear,
  totalCount,
}: LoanFilterBarProps) {
  const t = useTranslations('Loans');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory('search_equipment_loans');

  const TABS = [
    { id: 'ALL', label: t('filterAll') },
    { id: 'CUSTOMER_LOAN', label: t('filterCustomerLoan') },
    { id: 'RETURN_TO_CUSTOMER', label: t('filterReturnToCustomer') },
    { id: 'OUTSOURCE_PROCESSING', label: t('filterOutsourceProcessing') },
    { id: 'ACTIVE', label: t('filterActive') },
    { id: 'OVERDUE', label: t('filterOverdue') },
  ];

  const STATUSES: { id: LoanStatus | 'ALL'; label: string }[] = [
    { id: 'ALL', label: t('statusAll') },
    { id: 'PENDING_APPROVAL', label: t('status.PENDING_APPROVAL') },
    { id: 'APPROVED', label: t('status.APPROVED') },
    { id: 'IN_TRANSIT', label: t('status.IN_TRANSIT') },
    { id: 'RETURNED', label: t('status.RETURNED') },
    { id: 'CANCELLED', label: t('status.CANCELLED') },
    { id: 'REJECTED', label: t('status.REJECTED') },
  ];

  const hasFilters =
    Boolean(search) || selectedTab !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div className="card-flat p-2 flex flex-col gap-2 shrink-0">
      {/* Top row: Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-[var(--border-subtle)]">
        <div className="tab-nav flex items-center gap-1">
          {TABS.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`tab-item px-3 py-1 text-[12px] font-bold rounded transition-colors whitespace-nowrap ${
                  isActive
                    ? 'active bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-[12px] font-medium text-[var(--text-muted)] shrink-0 px-2">
          {t('totalRecords', { count: totalCount })}
        </div>
      </div>

      {/* Bottom row: Search & Status Dropdown & Clear */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search input with search history */}
        <div className="relative flex-1 min-w-[240px] max-w-[420px]">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                addToHistory(search.trim());
                setShowSuggestions(false);
              }
            }}
            placeholder={t('searchPlaceholder')}
            className="form-input form-input-search w-full text-[12px] h-[30px] pl-8 pr-7"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={13} />
            </button>
          )}
          <SearchSuggestions
            history={history}
            onSelect={(q: string) => {
              onSearchChange(q);
              setShowSuggestions(false);
            }}
            onRemove={removeFromHistory}
            onClear={clearHistory}
            visible={showSuggestions && !search}
            onClose={() => setShowSuggestions(false)}
          />
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-[var(--text-muted)]" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="form-input text-[12px] h-[30px] py-0 px-2"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filter button */}
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="btn btn-secondary text-[11px] h-[30px] px-2 flex items-center gap-1"
          >
            <X size={12} />
            <span>{t('clearFilter')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
