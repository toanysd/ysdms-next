import React from 'react'
import { getWorkOrders } from './actions'
import { WorkOrderHeader } from './_components/WorkOrderHeader'
import { WorkOrderKpiCards } from './_components/WorkOrderKpiCards'
import { WorkOrderFilterBar } from './_components/WorkOrderFilterBar'
import { WorkOrderTable } from './_components/WorkOrderTable'
import { Pagination } from '@/components/ui/Pagination'

export const dynamic = 'force-dynamic'

interface WorkOrdersPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

export default async function WorkOrdersPage(props: WorkOrdersPageProps) {
  const searchParams = await props.searchParams
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 50

  const { items, total, kpis, error } = await getWorkOrders({
    search: searchParams.search,
    status: searchParams.status,
    page,
    pageSize,
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '12px',
      }}
    >
      {/* 1. Page Header */}
      <WorkOrderHeader totalCount={total} />

      {/* 2. KPI Cards */}
      <WorkOrderKpiCards kpis={kpis} activeStatus={searchParams.status} />

      {/* 3. Filter Bar */}
      <WorkOrderFilterBar
        initialSearch={searchParams.search}
        initialStatus={searchParams.status}
      />

      {/* 4. Table Area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 16px',
          paddingBottom: 16,
        }}
      >
        <div
          className="card-flat"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: 12,
                borderBottom: '1px solid #FECACA',
              }}
            >
              エラー: {error}
            </div>
          )}

          <WorkOrderTable data={items} />

          <div
            style={{
              marginTop: 'auto',
              padding: '12px 16px',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <Pagination
              currentPage={page}
              totalRecords={total}
              pageSize={pageSize}
              baseUrl={`/production/work-orders?search=${searchParams.search || ''}&status=${searchParams.status || ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
