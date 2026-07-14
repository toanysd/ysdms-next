import { getNGStatistics } from '@/app/actions/quality'
import { AlertTriangle, TrendingDown, PackageX, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
    dimension: 'Kích thước',
    appearance: 'Ngoại quan',
    material: 'Vật liệu',
    packaging: 'Đóng gói',
    other: 'Khác'
}

export default async function DefectsDashboardPage() {
    const { data: defects } = await getNGStatistics()
    const validDefects = defects || []

    const totalNG = validDefects.reduce((sum, d) => sum + (d.ng_qty || 0), 0)

    // Group by category
    const categoryStats = validDefects.reduce((acc, d) => {
        const cat = d.ng_category || 'other'
        acc[cat] = (acc[cat] || 0) + (d.ng_qty || 0)
        return acc
    }, {} as Record<string, number>)

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-7xl mx-auto bg-gray-50 p-4 rounded-xl shadow-inner gap-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-6 py-4 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 font-jp leading-tight">不良品ダッシュボード</h1>
                        <span className="text-sm text-slate-500 font-medium">Bảng Theo dõi Hàng Lỗi (NG)</span>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 font-bold mb-1">Tổng Lỗi (Tất cả)</p>
                        <p className="text-3xl font-black text-red-600 font-mono">{totalNG}</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 shrink-0">
                {Object.keys(CATEGORY_LABELS).map(cat => (
                    <div key={cat} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2">
                        <span className="text-sm font-bold text-slate-600">{CATEGORY_LABELS[cat]}</span>
                        <span className="text-2xl font-black text-slate-800">{categoryStats[cat] || 0}</span>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col min-h-0">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2">
                        <PackageX size={18} /> Chi tiết Lịch sử Báo Lỗi
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Tìm kiếm Lô, Sản phẩm..." className="form-input pl-9 pr-4 py-2 text-sm w-64 border rounded" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50 uppercase sticky top-0 border-b">
                            <tr>
                                <th className="px-6 py-3 font-bold">Ngày kiểm</th>
                                <th className="px-6 py-3 font-bold">Lô / Mã SP</th>
                                <th className="px-6 py-3 font-bold">Phân loại Lỗi</th>
                                <th className="px-6 py-3 font-bold text-center">S.Lượng NG</th>
                                <th className="px-6 py-3 font-bold">Mô tả chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validDefects.length > 0 ? validDefects.map((d, i) => {
                                const ins: any = d.inspections;
                                const prod = ins?.production_lots?.production_orders?.products
                                const lotNo = ins?.production_lots?.lot_no
                                const date = ins?.inspection_date
                                return (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-red-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-600">{date || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{prod?.product_name || 'Không rõ SP'}</div>
                                            <div className="text-xs text-slate-500 font-mono">Lot: {lotNo || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                                                {CATEGORY_LABELS[d.ng_category] || d.ng_category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-black text-red-600">{d.ng_qty}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={d.ng_description || undefined}>
                                            {d.ng_description || '-'}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Chưa có bản ghi lỗi nào trong hệ thống.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
