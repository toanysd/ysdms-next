// @ts-nocheck
export const dynamic = 'force-dynamic'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Database, Plus, History, AlertCircle } from 'lucide-react'

// Dashboard Tồn Kho Nhựa (Plastic Inventory)
export default async function InventoryDashboard() {
  const t = useTranslations('Inventory')
  const supabase = await createClient()

  // Lấy dữ liệu view plastic_stock, có thể View này đã join sẵn plastic_master hoặc phải fetch FK
  // Tạm fetch thử cấu trúc mặc định WMS
  const { data: stocks, error } = await (supabase as any)
    .from('plastic_stock')
    .select(`
      id, plastic_id, current_kg, min_threshold_kg, last_updated,
      plastic_master (code:plastic_code, family:plastic_family, color)
    `)
    .order('current_kg', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm m-2">
      <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border-b border-teal-200 shrink-0">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-teal-700" />
          <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
            {t('plasticInventory')}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/inventory/history">
            <button className="bg-white hover:bg-teal-50 border border-teal-300 text-teal-700 h-[30px] px-3 flex items-center gap-1.5 text-xs rounded transition-colors shadow-sm font-bold">
              <History size={14} />
              {t('historyBtn')}
            </button>
          </Link>
          <Link href="/inventory/inbound">
            <button className="bg-teal-700 hover:bg-teal-800 text-white h-[30px] px-3 flex items-center gap-1.5 text-xs rounded transition-colors shadow-sm font-bold">
              <Plus size={16} />
              {t('inboundBtn')}
            </button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white p-4">
        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded border border-red-200">
            {t('schemaError', { message: error.message })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stocks?.map((stock: any) => {
              const isLowStock = stock.current_kg <= (stock.min_threshold_kg || 100);

              return (
                <div key={stock.id} className={`border rounded-lg p-4 shadow-sm transition-all ${isLowStock ? 'bg-red-50 border-red-200' : 'bg-white border-teal-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono font-bold text-teal-900">{stock.plastic_master?.code || 'UNKNOWN'}</div>
                    {isLowStock && <AlertCircle size={16} className="text-red-500 animate-pulse" />}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{stock.plastic_master?.family} - {stock.plastic_master?.color}</div>

                  <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{t('currentStock')}</span>
                    <span className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-teal-700'}`}>
                      {stock.current_kg?.toLocaleString()} <span className="text-sm font-normal">kg</span>
                    </span>
                  </div>
                  {stock.min_threshold_kg && (
                    <div className="text-[10px] text-gray-400 text-right mt-1">
                      {t('lowStockAlert', { threshold: stock.min_threshold_kg })}
                    </div>
                  )}
                </div>
              );
            })}

            {(!stocks || stocks.length === 0) && (
              <div className="col-span-full p-8 text-center text-slate-400 italic">
                {t('noData')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
