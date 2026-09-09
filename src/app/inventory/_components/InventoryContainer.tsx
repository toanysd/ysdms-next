'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { InventoryItem, InventoryKPIs } from '../actions'
import { InventoryHeader } from './InventoryHeader'
import { InventoryKpiCards } from './InventoryKpiCards'
import { InventoryFilterBar } from './InventoryFilterBar'
import { InventoryTable } from './InventoryTable'
import { Pagination } from '@/components/ui/Pagination'

interface InventoryContainerProps {
  initialItems: InventoryItem[]
  total: number
  kpis: InventoryKPIs
  companies: { company_id: string; company_name: string; company_code: string | null }[]
  currentPage: number
  pageSize: number
  search: string
  companyId: string
  status: string
  sortCol: string
  sortDir: 'asc' | 'desc'
}

export function InventoryContainer({
  initialItems,
  total,
  kpis,
  companies,
  currentPage,
  pageSize,
  search,
  companyId,
  status,
  sortCol,
  sortDir,
}: InventoryContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateQueryParams = (newParams: Record<string, string | number>) => {
    const sp = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === '' || v === 'ALL') {
        sp.delete(k)
      } else {
        sp.set(k, String(v))
      }
    })
    router.push(`/inventory?${sp.toString()}`)
  }

  const handleFilterChange = (filters: { search: string; companyId: string; status: string }) => {
    updateQueryParams({
      search: filters.search,
      company: filters.companyId,
      status: filters.status,
      page: 1,
    })
  }

  const handleStatusClick = (st: string) => {
    updateQueryParams({
      status: st,
      page: 1,
    })
  }

  const handleSort = (col: string) => {
    const newDir = sortCol === col && sortDir === 'desc' ? 'asc' : 'desc'
    updateQueryParams({
      sort: col,
      dir: newDir,
      page: 1,
    })
  }

  const handlePageChange = (page: number) => {
    updateQueryParams({ page })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 12,
      }}
    >
      {/* 1. Page Header with Tab switch & Callout */}
      <InventoryHeader />

      {/* 2. 4 KPI Cards */}
      <InventoryKpiCards
        kpis={kpis}
        activeStatus={status}
        onStatusClick={handleStatusClick}
      />

      {/* 3. Filter Bar */}
      <InventoryFilterBar
        initialSearch={search}
        initialCompanyId={companyId}
        initialStatus={status}
        companies={companies}
        onFilterChange={handleFilterChange}
      />

      {/* 4. Data Table */}
      <InventoryTable
        items={initialItems}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={handleSort}
      />

      {/* 5. Pagination */}
      <Pagination
        currentPage={currentPage}
        totalRecords={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
