// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft, Package, History, AlertTriangle, Warehouse } from 'lucide-react'
import StockTable from './StockTable'
import TxnHistoryTab from './TxnHistoryTab'
import LowStockAlert from './LowStockAlert'
import InventoryKPIRow from './InventoryKPIRow'
import CustomerBento from './CustomerBento'

export const dynamic = 'force-dynamic'

export default async function InventoryDashboardPage(props: {
    searchParams: Promise<{ tab?: string, txnType?: string }>
}) {
    const searchParams = await props.searchParams
    const { tab = 'overview' } = searchParams
    const supabase = await createClient()

    // Fetch KPI data
    let kpiData: any = null
    const { data: kpiResult } = await supabase.rpc('get_inventory_dashboard_kpis')
    kpiData = kpiResult

    // Fetch Stock Summary (used by Overview and Alerts tabs)
    let stockData: any[] = []
    if (tab === 'overview' || tab === 'alerts') {
        const { data } = await supabase
            .from('tray_stock_summary')
            .select('*')
            .order('product_code', { ascending: true })
        stockData = data || []
    }

    const tabs = [
        { key: 'overview', label: '在庫概要 / Tổng Quan', icon: <Package size={18} />, color: 'var(--mcs-primary)' },
        { key: 'history', label: '取引履歴 / Lịch Sử', icon: <History size={18} />, color: 'var(--mcs-info)' },
        { key: 'alerts', label: '在庫警告 / Cảnh Báo', icon: <AlertTriangle size={18} />, color: 'var(--mcs-error)' },
    ]

    return (
        <div className="min-h-screen" style={{ background: 'var(--mcs-bg)' }}>
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 border-b shadow-sm" 
                 style={{ 
                     background: 'linear-gradient(135deg, #0d7a7a 0%, #0a6262 100%)',
                     borderColor: 'var(--mcs-primary-active)' 
                 }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-14">
                        <Link href="/production" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
                            <ChevronLeft size={18} /> Kanbanへ戻めE                        </Link>
                        <h1 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white tracking-wide">
                            <Warehouse size={22} className="text-teal-200" />
                            完�E品在庫管琁E                            <span className="text-xs font-normal text-teal-200 hidden sm:inline">/ Kho Sản Phẩm Tray</span>
                        </h1>
                        <div className="text-xs text-teal-100 hidden md:block">
                            {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
                {/* KPI Cards */}
                <InventoryKPIRow kpi={kpiData} />

                {/* Customer Bento (Top 5 today) */}
                {kpiData?.top_customers?.length > 0 && (
                    <CustomerBento customers={kpiData.top_customers} />
                )}

                {/* Tabs */}
                <div className="flex gap-1 mt-6 mb-4 border-b" style={{ borderColor: 'var(--mcs-border)' }}>
                    {tabs.map(t => (
                        <Link
                            key={t.key}
                            href={`/production/inventory?tab=${t.key}`}
                            className="relative px-4 py-3 text-sm font-bold flex items-center gap-2 transition-all rounded-t-lg"
                            style={{
                                color: tab === t.key ? t.color : 'var(--mcs-text-muted)',
                                background: tab === t.key ? 'var(--mcs-surface)' : 'transparent',
                                borderBottom: tab === t.key ? `3px solid ${t.color}` : '3px solid transparent'
                            }}
                        >
                            {t.icon} {t.label}
                        </Link>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="rounded-lg border shadow-sm overflow-hidden"
                     style={{ background: 'var(--mcs-surface)', borderColor: 'var(--mcs-border)' }}>
                    {tab === 'overview' && <StockTable initialData={stockData} />}
                    {tab === 'history' && <TxnHistoryTab currentParams={searchParams} />}
                    {tab === 'alerts' && <LowStockAlert data={stockData} />}
                </div>
            </div>
        </div>
    )
}
