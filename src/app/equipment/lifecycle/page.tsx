'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Archive,
  Search,
  RefreshCw,
  ArrowLeft,
  ArrowUpFromLine,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import { SearchSuggestions } from '@/components/ui/SearchSuggestions';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import LifecycleKpiCards from './_components/LifecycleKpiCards';
import LifecycleTable from './_components/LifecycleTable';
import ServiceConfirmModal from './_components/ServiceConfirmModal';
import {
  LifecycleItem,
  LifecycleStats,
  getLifecycleDashboard,
  completeEquipmentMaintenance,
} from './actions';

const PAGE_SIZE = 50;

export default function LifecycleDashboardPage() {
  const t = useTranslations('Equipment.Lifecycle');

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  // Data state
  const [items, setItems] = useState<LifecycleItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [stats, setStats] = useState<LifecycleStats>({
    total: 0,
    overdue: 0,
    warning: 0,
    normal: 0,
  });
  const [loading, setLoading] = useState(true);

  // Search suggestions hook
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory('search_equipment_lifecycle');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Service Modal state
  const [selectedItemForService, setSelectedItemForService] =
    useState<LifecycleItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Debounce search input 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Load data callback
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLifecycleDashboard({
        search: debouncedSearch,
        type: typeFilter,
        status: statusFilter,
        page,
        pageSize: PAGE_SIZE,
      });
      setItems(res.data);
      setTotalRecords(res.totalRecords);
      setStats(res.stats);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load lifecycle data');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, typeFilter, statusFilter, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Maintenance Completion Action
  const handleConfirmService = async (equipmentId: string, totalShots: number) => {
    const res = await completeEquipmentMaintenance({
      equipmentId,
      totalShots,
    });
    if (res.success) {
      showToast('success', t('serviceSuccess'));
      await loadData();
    } else {
      showToast('error', res.error || 'Failed to record maintenance');
    }
  };

  const handleTabClick = (tab: string) => {
    setTypeFilter(tab);
    setPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '12px',
        padding: '12px 16px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white font-medium ${
            toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-100" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. PageHeader (flexShrink: 0) */}
      <div
        className="card-flat flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        style={{ flexShrink: 0, background: 'var(--bg-surface)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/equipment"
            className="btn btn-secondary flex items-center justify-center"
            style={{ minHeight: '36px', minWidth: '36px', padding: '0 8px' }}
            title="一覧へ"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>

          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--tint-teal-bg)' }}
          >
            <Archive className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>

          <div>
            <h1
              className="text-base md:text-lg font-bold"
              style={{ color: 'var(--text-primary)', margin: 0 }}
            >
              {t('title')}
            </h1>
            <p className="text-xs text-slate-500 font-medium m-0">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-1.5 text-xs"
            style={{ minHeight: '36px' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>更新</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards */}
      <LifecycleKpiCards
        stats={stats}
        currentStatusFilter={statusFilter}
        onSelectStatus={handleStatusFilter}
      />

      {/* 3. FilterBar / TabBar (flexShrink: 0) */}
      <div
        className="card-flat flex flex-wrap items-center justify-between gap-3 px-4 py-2.5"
        style={{ flexShrink: 0, background: 'var(--bg-surface)' }}
      >
        {/* Type Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'ALL', label: t('tabAll') },
            { id: 'MOLD', label: t('tabMold') },
            { id: 'CUTTER', label: t('tabCutter') },
            { id: 'PLUG', label: t('tabPlug') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="form-input text-xs font-medium"
            style={{ minHeight: '36px', minWidth: '150px' }}
          >
            <option value="ALL">{t('statusAll')}</option>
            <option value="OVERDUE">{t('statusOverdue')}</option>
            <option value="WARNING">{t('statusWarning')}</option>
            <option value="NORMAL">{t('statusNormal')}</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && search.trim()) {
                  addToHistory(search.trim());
                  setShowSuggestions(false);
                }
              }}
              placeholder={t('searchPlaceholder')}
              className="form-input pl-9 pr-3 text-xs"
              style={{ minHeight: '36px', minWidth: '220px' }}
            />
            {showSuggestions && history.length > 0 && (
              <SearchSuggestions
                history={history}
                visible={showSuggestions}
                onSelect={(val) => {
                  setSearch(val);
                  setShowSuggestions(false);
                }}
                onRemove={removeFromHistory}
                onClear={clearHistory}
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* 4. Content Area (flex: 1, overflow: auto) */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <LifecycleTable
          items={items}
          onOpenServiceModal={(item) => setSelectedItemForService(item)}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-xs text-slate-500">
            全 {totalRecords.toLocaleString()} 件中 {(page - 1) * PAGE_SIZE + 1} -{' '}
            {Math.min(page * PAGE_SIZE, totalRecords)} 件を表示
          </span>
          <Pagination
            currentPage={page}
            totalRecords={totalRecords}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Maintenance Confirmation Modal */}
      <ServiceConfirmModal
        isOpen={Boolean(selectedItemForService)}
        onClose={() => setSelectedItemForService(null)}
        item={selectedItemForService}
        onConfirmService={handleConfirmService}
      />
    </div>
  );
}
