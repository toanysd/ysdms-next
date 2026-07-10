import React from 'react'
import { AlertTriangle, PackageSearch, PackageMinus, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { getMRPTimelineData } from '@/app/actions/mrp-actions'

export const metadata = {
  title: 'MRP Dashboard - YSDMS NextGen',
}

export default async function MRPDashboardPage() {
  const days = 14
  // Fetch Real Data from Server Action
  const matrixData = await getMRPTimelineData(days)

  const timelineCols = Array.from({ length: days }, (_, i) => `T+${i + 1}`)

  // Derive KPIs from data
  let criticalCount = 0
  let warningCount = 0
  
  matrixData.forEach(row => {
    let minProjected = row.current_stock_m
    row.timeline.forEach(t => {
      if (t.projected_stock_m < minProjected) minProjected = t.projected_stock_m
    })
    
    if (minProjected < 0) {
      // Find out if it's within 7 days
      const isCritical = row.timeline.slice(0, 7).some(t => t.projected_stock_m < 0)
      if (isCritical) criticalCount++
      else warningCount++
    } else if (minProjected < 1000) {
      warningCount++
    }
  })

  const kpiData = {
    criticalShortages: criticalCount,
    lowStock: warningCount,
    transferNeeded: 0, // Placeholder
  }

  const alerts: any[] = []

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jp)' }}>材料所要量計画 (MRP)</h1>
          <p className="text-sm text-slate-500">Material Requirements Planning - Dự báo nhu cầu vật liệu</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span style={{ fontFamily: 'var(--font-jp)' }}>同期</span>
            <span className="text-[10px] text-slate-500 ml-1">Đồng bộ</span>
          </button>
        </div>
      </div>

      {/* Vùng 1: Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-flat p-5 border-l-4 border-l-red-500 bg-red-50 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-red-700" style={{ fontFamily: 'var(--font-jp)' }}>
              欠品危機 <span className="text-xs font-normal opacity-80">(Thủng kho &lt; 7 ngày)</span>
            </p>
            <h2 className="text-3xl font-bold text-red-600 mt-1">{kpiData.criticalShortages}</h2>
          </div>
          <AlertTriangle className="w-10 h-10 text-red-400 opacity-50" />
        </div>
        <div className="card-flat p-5 border-l-4 border-l-amber-500 bg-amber-50 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-700" style={{ fontFamily: 'var(--font-jp)' }}>
              在庫警告 <span className="text-xs font-normal opacity-80">(Dưới mức an toàn)</span>
            </p>
            <h2 className="text-3xl font-bold text-amber-600 mt-1">{kpiData.lowStock}</h2>
          </div>
          <PackageMinus className="w-10 h-10 text-amber-400 opacity-50" />
        </div>
        <div className="card-flat p-5 border-l-4 border-l-sky-500 bg-sky-50 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-700" style={{ fontFamily: 'var(--font-jp)' }}>
              工場間アンバランス <span className="text-xs font-normal opacity-80">(Cần luân chuyển)</span>
            </p>
            <h2 className="text-3xl font-bold text-sky-600 mt-1">{kpiData.transferNeeded}</h2>
          </div>
          <PackageSearch className="w-10 h-10 text-sky-400 opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Vùng 2: Action Center */}
        <div className="col-span-1 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-5 bg-accent rounded-sm inline-block"></span>
            <span style={{ fontFamily: 'var(--font-jp)' }}>スマート提案</span>
            <span className="text-xs font-normal text-slate-500">Đề xuất</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border text-sm bg-red-50 border-red-200">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-900">PET-310-CL</span>
                <span className="badge badge--neutral text-[10px]">HONSHA</span>
              </div>
              <p className="text-slate-600 mb-3" style={{ fontFamily: 'var(--font-jp)' }}>
                7/15の注文に5,000m不足 <br />
                <span className="text-xs text-slate-500">Thiếu 5,000m cho đơn hàng 15/07</span>
              </p>
              <button className="w-full py-2 rounded text-xs font-semibold bg-red-600 text-white hover:bg-red-700" style={{ fontFamily: 'var(--font-jp)' }}>
                発注書作成 <span className="font-normal opacity-80">(Tạo PO)</span>
              </button>
            </div>
            
            <div className="p-4 rounded-lg border text-sm bg-sky-50 border-sky-200">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-900">PS-250-BK</span>
                <span className="badge badge--neutral text-[10px]">MARUDAI</span>
              </div>
              <p className="text-slate-600 mb-3" style={{ fontFamily: 'var(--font-jp)' }}>
                2,000m不足 (Sakata工場に5,000mの余剰あり) <br />
                <span className="text-xs text-slate-500">Đang thiếu 2,000m (Sakata dư 5k)</span>
              </p>
              <button className="w-full py-2 rounded text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700" style={{ fontFamily: 'var(--font-jp)' }}>
                工場間移動 <span className="font-normal opacity-80">(Chuyển kho)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vùng 3: Timeline Matrix Grid */}
        <div className="col-span-1 lg:col-span-3 card-flat p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-5 bg-accent rounded-sm inline-block"></span>
              <span style={{ fontFamily: 'var(--font-jp)' }}>タイムライン・マトリックス</span>
              <span className="text-xs font-normal text-slate-500">(Dự báo tồn kho)</span>
            </h3>
            <div className="flex gap-2">
              <select className="form-input text-xs py-1 h-auto" style={{ fontFamily: 'var(--font-jp)' }}>
                <option>全工場 (Tất cả)</option>
                <option>HONSHA</option>
                <option>MARUDAI</option>
                <option>SAKATA</option>
              </select>
              <select className="form-input text-xs py-1 h-auto" style={{ fontFamily: 'var(--font-jp)' }}>
                <option>14 日間</option>
                <option>30 日間</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="p-3 font-semibold w-48 sticky left-0 bg-slate-100 z-10 border-r" style={{ fontFamily: 'var(--font-jp)' }}>材料コード <span className="text-[10px] font-normal text-slate-500 block">Mã Nhựa</span></th>
                  <th className="p-3 font-semibold text-right border-r" style={{ fontFamily: 'var(--font-jp)' }}>現在在庫 <span className="text-[10px] font-normal text-slate-500 block">Tồn kho HT</span></th>
                  {timelineCols.map(col => (
                    <th key={col} className="p-3 font-semibold text-center border-r min-w-[70px]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium sticky left-0 bg-white border-r group-hover:bg-slate-50">
                      <Link href={`/master/plastics`} className="text-accent hover:underline">{row.plastic_code}</Link>
                      <div className="text-[10px] text-slate-500 font-normal">{row.branch_code}</div>
                    </td>
                    <td className="p-3 text-right font-mono border-r bg-slate-50">
                      {row.current_stock_m.toLocaleString()} m
                    </td>
                    {row.timeline.map((val, tIdx) => {
                      let cellClass = "p-3 text-center font-mono border-r"
                      if (val.projected_stock_m < 0) {
                        cellClass += " bg-red-100 text-red-700 font-bold"
                      } else if (val.projected_stock_m < 1000) {
                        cellClass += " bg-amber-50 text-amber-700 font-semibold"
                      } else {
                        cellClass += " text-slate-700"
                      }
                      
                      return (
                        <td key={tIdx} className={cellClass}>
                          <button className="w-full hover:underline focus:outline-none" title={`Demand: ${val.demand_m} | Supply: ${val.supply_m}`}>
                            {val.projected_stock_m.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t bg-slate-50 text-[11px] text-slate-500" style={{ fontFamily: 'var(--font-jp)' }}>
            * セルをクリックすると、その日の在庫変動の原因となった製造オーダー（ジョブ）の詳細が表示されます。 (Bấm vào từng ô để xem chi tiết biến động)
          </div>
        </div>
      </div>
    </div>
  )
}
