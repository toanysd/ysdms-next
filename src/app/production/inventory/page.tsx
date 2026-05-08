import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft, Package, History, AlertTriangle } from 'lucide-react'
import StockTable from './StockTable'
import TxnHistoryTab from './TxnHistoryTab'
import LowStockAlert from './LowStockAlert'

export const dynamic = 'force-dynamic'

export default async function InventoryDashboardPage(props: {
    searchParams: Promise<{ tab?: string, txnType?: string }>
}) {
    const searchParams = await props.searchParams
    const { tab = 'overview' } = searchParams
    const supabase = await createClient()

    // Fetch Stock Summary (used by Overview and Alerts tabs)
    let stockData: any[] = []
    if (tab === 'overview' || tab === 'alerts') {
        const { data } = await supabase
            .from('tray_stock_summary')
            .select('*')
            .order('product_code', { ascending: true })
        stockData = data || []
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-[var(--mcs-surface)] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <Link href="/production" className="flex items-center gap-2 text-[var(--mcs-primary)] font-bold">
                    <ChevronLeft /> Kanbanへ戻る (Quay lại Kanban)
                </Link>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--mcs-text)]">
                    <Package className="text-[var(--mcs-primary)]" />
                    完成品在庫管理 (Quản Lý Kho Thành Phẩm)
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--mcs-border)] mb-6">
                <Link 
                    href="/production/inventory?tab=overview" 
                    className={`px-6 py-3 font-bold flex items-center gap-2 transition-colors ${tab === 'overview' ? 'border-b-2 border-[var(--mcs-primary)] text-[var(--mcs-primary)]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Package size={18} /> 在庫概要 / Tổng Quan
                </Link>
                <Link 
                    href="/production/inventory?tab=history" 
                    className={`px-6 py-3 font-bold flex items-center gap-2 transition-colors ${tab === 'history' ? 'border-b-2 border-[var(--mcs-primary)] text-[var(--mcs-primary)]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <History size={18} /> 取引履歴 / Lịch Sử
                </Link>
                <Link 
                    href="/production/inventory?tab=alerts" 
                    className={`px-6 py-3 font-bold flex items-center gap-2 transition-colors ${tab === 'alerts' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <AlertTriangle size={18} /> 在庫警告 / Cảnh Báo
                </Link>
            </div>

            {/* Content */}
            <div className="bg-[var(--mcs-surface)] rounded-md border border-[var(--mcs-border)] shadow-sm overflow-hidden">
                {tab === 'overview' && <StockTable initialData={stockData} />}
                {tab === 'history' && <TxnHistoryTab currentParams={searchParams} />}
                {tab === 'alerts' && <LowStockAlert data={stockData} />}
            </div>
        </div>
    )
}
