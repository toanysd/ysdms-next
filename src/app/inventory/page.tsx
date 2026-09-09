import React, { Suspense } from 'react'
import { getInventoryStockData, getInventoryKPIs, getInventoryCompanies } from './actions'
import { InventoryContainer } from './_components/InventoryContainer'

export const dynamic = 'force-dynamic'

interface InventoryPageProps {
  searchParams: Promise<{
    search?: string
    company?: string
    status?: string
    page?: string
    sort?: string
    dir?: 'asc' | 'desc'
  }>
}

export default async function InventoryPage(props: InventoryPageProps) {
  const searchParams = await props.searchParams
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 50
  const search = searchParams.search || ''
  const companyId = searchParams.company || 'ALL'
  const status = searchParams.status || 'ALL'
  const sortCol = searchParams.sort || 'current_stock'
  const sortDir = searchParams.dir || 'desc'

  const [kpis, companies, stockResult] = await Promise.all([
    getInventoryKPIs(),
    getInventoryCompanies(),
    getInventoryStockData({
      search,
      companyId,
      stockStatus: status,
      page,
      pageSize,
      sortCol,
      sortDir,
    }),
  ])

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Đang tải dữ liệu tồn kho...</div>}>
      <InventoryContainer
        initialItems={stockResult.items}
        total={stockResult.total}
        kpis={kpis}
        companies={companies}
        currentPage={page}
        pageSize={pageSize}
        search={search}
        companyId={companyId}
        status={status}
        sortCol={sortCol}
        sortDir={sortDir}
      />
    </Suspense>
  )
}
