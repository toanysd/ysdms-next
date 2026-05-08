import React from 'react'
import { AlertTriangle, TrendingDown } from 'lucide-react'

export default function LowStockAlert({ data }: { data: any[] }) {
    const CRITICAL_STOCK = 20
    const LOW_STOCK = 50

    // Filter items below LOW_STOCK threshold
    const lowStockItems = data.filter(item => (item.current_stock || 0) < LOW_STOCK)

    if (lowStockItems.length === 0) {
        return (
            <div className="p-10 text-center">
                <div className="bg-emerald-50 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <AlertTriangle size={32} className="opacity-70" />
                </div>
                <h3 className="text-lg font-bold text-emerald-700">安全 (An Toàn)</h3>
                <p className="text-sm text-emerald-600/80 mt-1">
                    すべての製品の在庫は安全基準（{LOW_STOCK}個）を満たしています。<br/>
                    (Tất cả sản phẩm đều đạt mức tồn kho an toàn trên {LOW_STOCK} khay)
                </p>
                <div className="mt-6 text-xs text-emerald-500/60">
                    {/* TODO: Replace with dynamic threshold from product_master.min_stock when available */}
                    * Mức cảnh báo hiện tại được đặt ở {LOW_STOCK} khay.
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="text-red-600 mt-0.5 shrink-0" />
                <div>
                    <h3 className="text-red-800 font-bold">在庫警告 (Cảnh Báo Tồn Kho Thấp)</h3>
                    <p className="text-sm text-red-600 mt-1">
                        以下の製品は安全在庫（{LOW_STOCK}個）を下回っています。至急、生産計画を確認してください。<br/>
                        (Các sản phẩm dưới đây có tồn kho thấp hơn mức an toàn. Vui lòng xếp lịch chạy bù ngay lập tức.)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {lowStockItems.map(item => {
                    const stock = item.current_stock || 0
                    const isCritical = stock < CRITICAL_STOCK

                    return (
                        <div key={item.product_id} className={`bg-white border rounded-md p-4 shadow-sm relative overflow-hidden ${isCritical ? 'border-red-300 bg-red-50/30' : 'border-amber-300 bg-amber-50/30'}`}>
                            <div className={`absolute top-0 left-0 w-1 h-full ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                                <div>
                                    <h4 className={`font-bold ${isCritical ? 'text-red-800' : 'text-amber-800'}`}>{item.product_code}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-1">{item.product_name}</p>
                                </div>
                                <div className={`font-mono font-bold text-sm px-2 py-1 rounded flex items-center gap-1 ${isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                    <TrendingDown size={14} /> {stock}
                                </div>
                            </div>
                            <div className="pl-2 mt-3 flex items-center justify-between">
                                {isCritical ? (
                                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded border border-red-200">
                                        危険 / Nguy hiểm
                                    </span>
                                ) : (
                                    <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded border border-amber-200">
                                        要注意 / Chú ý
                                    </span>
                                )}
                                <span className={`text-xs font-bold ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
                                    Thiếu: {- (stock - LOW_STOCK)}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            <div className="p-3 bg-[var(--mcs-surface-2)] text-xs text-[var(--mcs-text-muted)] border border-[var(--mcs-border)] rounded-md">
                {/* TODO: Replace with dynamic threshold from product_master.min_stock when available */}
                <strong>* Ghi chú hệ thống mức cảnh báo tạm thời:</strong><br/>
                - Mức Nguy hiểm (Critical): &lt; {CRITICAL_STOCK} khay.<br/>
                - Mức Chú ý (Low): &lt; {LOW_STOCK} khay.
            </div>
        </div>
    )
}
