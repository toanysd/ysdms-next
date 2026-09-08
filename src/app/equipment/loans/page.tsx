'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import LoanHeader from './_components/LoanHeader';
import LoanKpiCards from './_components/LoanKpiCards';
import LoanFilterBar from './_components/LoanFilterBar';
import LoanListTable from './_components/LoanListTable';
import CreateLoanModal from './_components/CreateLoanModal';
import {
  ApproveModal,
  RejectModal,
  DispatchModal,
  ReturnCheckInModal,
} from './_components/LoanWorkflowModals';
import { getEquipmentLoans, getEquipmentLoanKpis } from './actions';
import type {
  EquipmentLoanItem,
  LoanKpiSummary,
  LoanType,
  LoanStatus,
} from './types';

export default function EquipmentLoansPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filters from URL or state
  const initialSearch = searchParams.get('search') || '';
  const initialTab = searchParams.get('tab') || 'ALL';
  const initialStatus = searchParams.get('status') || 'ALL';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 50;

  // Data states
  const [loans, setLoans] = useState<EquipmentLoanItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [kpis, setKpis] = useState<LoanKpiSummary>({
    total: 0,
    custodyCount: 0,
    pendingApproval: 0,
    inTransit: 0,
    overdue: 0,
    completedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeLoanForAction, setActiveLoanForAction] = useState<EquipmentLoanItem | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  // Debounce search input (400ms per Rule 5)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedTab !== 'ALL') params.set('tab', selectedTab);
    if (selectedStatus !== 'ALL') params.set('status', selectedStatus);
    if (currentPage > 1) params.set('page', String(currentPage));

    const qs = params.toString();
    const currentQs = searchParams.toString();
    if (qs !== currentQs) {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    }
  }, [debouncedSearch, selectedTab, selectedStatus, currentPage, router, pathname, searchParams]);

  // Load data callback
  const loadData = useCallback(() => {
    setLoading(true);
    startTransition(async () => {
      try {
        let loanTypeParam: LoanType | 'ALL' | undefined = undefined;
        let statusParam: LoanStatus | 'ALL' | 'ACTIVE' | undefined = undefined;
        let isOverdueParam: boolean | undefined = undefined;

        if (selectedTab === 'CUSTOMER_LOAN' || selectedTab === 'RETURN_TO_CUSTOMER' || selectedTab === 'OUTSOURCE_PROCESSING') {
          loanTypeParam = selectedTab as LoanType;
        } else if (selectedTab === 'ACTIVE') {
          statusParam = 'ACTIVE';
        } else if (selectedTab === 'OVERDUE') {
          isOverdueParam = true;
        }

        if (selectedStatus !== 'ALL') {
          statusParam = selectedStatus as LoanStatus;
        }

        const [listRes, kpiRes] = await Promise.all([
          getEquipmentLoans({
            search: debouncedSearch,
            loan_type: loanTypeParam,
            status: statusParam,
            is_overdue: isOverdueParam,
            page: currentPage,
            pageSize,
          }),
          getEquipmentLoanKpis(),
        ]);

        setLoans(listRes.data);
        setTotalRecords(listRes.totalRecords);
        setKpis(kpiRes);
      } catch (err) {
        console.error('Failed to load loans data:', err);
      } finally {
        setLoading(false);
      }
    });
  }, [debouncedSearch, selectedTab, selectedStatus, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedTab('ALL');
    setSelectedStatus('ALL');
    setCurrentPage(1);
  };

  return (
    <div
      className="flex flex-col h-full gap-3 p-3 overflow-hidden"
      style={{ background: 'var(--bg-canvas)' }}
    >
      {/* 1. Page Header (Page Anatomy Layer 1) */}
      <LoanHeader
        onOpenCreate={() => setIsCreateOpen(true)}
        onRefresh={loadData}
        loading={loading}
      />

      {/* 2. KPI Cards */}
      <LoanKpiCards
        kpis={kpis}
        selectedFilter={selectedTab}
        onSelectFilter={(tab) => {
          setSelectedTab(tab);
          setCurrentPage(1);
        }}
      />

      {/* 3. Filter Bar (Page Anatomy Layer 2) */}
      <LoanFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedTab={selectedTab}
        onTabChange={(tab) => {
          setSelectedTab(tab);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
        onClear={handleClearFilters}
        totalCount={totalRecords}
      />

      {/* 4. Content Area (Page Anatomy Layer 3) */}
      <LoanListTable
        loans={loans}
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onOpenApprove={(loan) => {
          setActiveLoanForAction(loan);
          setIsApproveOpen(true);
        }}
        onOpenReject={(loan) => {
          setActiveLoanForAction(loan);
          setIsRejectOpen(true);
        }}
        onOpenDispatch={(loan) => {
          setActiveLoanForAction(loan);
          setIsDispatchOpen(true);
        }}
        onOpenReturn={(loan) => {
          setActiveLoanForAction(loan);
          setIsReturnOpen(true);
        }}
        loading={loading}
      />

      {/* 5. Create Proposal Modal */}
      <CreateLoanModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={loadData}
      />

      {/* 6. Workflow Action Modals */}
      <ApproveModal
        loan={activeLoanForAction}
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false);
          setActiveLoanForAction(null);
        }}
        onSuccess={loadData}
      />

      <RejectModal
        loan={activeLoanForAction}
        isOpen={isRejectOpen}
        onClose={() => {
          setIsRejectOpen(false);
          setActiveLoanForAction(null);
        }}
        onSuccess={loadData}
      />

      <DispatchModal
        loan={activeLoanForAction}
        isOpen={isDispatchOpen}
        onClose={() => {
          setIsDispatchOpen(false);
          setActiveLoanForAction(null);
        }}
        onSuccess={loadData}
      />

      <ReturnCheckInModal
        loan={activeLoanForAction}
        isOpen={isReturnOpen}
        onClose={() => {
          setIsReturnOpen(false);
          setActiveLoanForAction(null);
        }}
        onSuccess={loadData}
      />
    </div>
  );
}
