"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import MoldDetailPanel from "./MoldDetailPanel"
import CustomerSearchBox from "./CustomerSearchBox"

export default function MoldSearchTable({
  initialData,
  itemTypes,
  customers,
  initialParams,
  racks,
  allLayers,
  employees,
  destinations,
  companies
}: {
  initialData: any[]
  itemTypes: any[]
  customers: any[]
  initialParams: { search: string, typeId: string, status: string, customerId: string }
  racks: any[]
  allLayers: any[]
  employees: any[]
  destinations: any[]
  companies: any[]
}) {
  const router = useRouter()
  
  const [search, setSearch] = useState(initialParams.search)
  const [typeId, setTypeId] = useState(initialParams.typeId)
  const [status, setStatus] = useState(initialParams.status)
  const [customerId, setCustomerId] = useState(initialParams.customerId)

  const [selectedMoldId, setSelectedMoldId] = useState<string | null>(null)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (typeId) params.set('type', typeId)
    if (status) params.set('status', status)
    if (customerId) params.set('customer', customerId)
    
    router.push(`/production/molds?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* FILTER BAR */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <input 
            type="text" 
            placeholder="Tìm mã khuôn, tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
        </div>
        
        <select 
          value={typeId} 
          onChange={(e) => { setTypeId(e.target.value); setTimeout(handleSearch, 50) }}
          className="py-1.5 px-3 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
        >
          <option value="">-- Loại (ItemType) --</option>
          {itemTypes.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select 
          value={status} 
          onChange={(e) => { setStatus(e.target.value); setTimeout(handleSearch, 50) }}
          className="py-1.5 px-3 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
        >
          <option value="">-- Trạng thái IN/OUT --</option>
          <option value="IN">IN (Trong kho)</option>
          <option value="OUT">OUT (Ngoài kho)</option>
          <option value="AUDIT">AUDIT (Đang kiểm kê)</option>
        </select>

        <CustomerSearchBox 
          value={customerId} 
          onChange={(val) => { setCustomerId(val); setTimeout(handleSearch, 50) }} 
          initialCustomers={customers} 
        />

        <button 
          onClick={handleSearch}
          className="px-4 py-1.5 bg-teal-700 text-white text-sm font-medium rounded hover:bg-teal-800 transition-colors"
        >
          検索 (Lọc)
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-left text-sm border-collapse min-w-[800px]">
          <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10 shadow-sm text-xs">
            <tr>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">#</th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">金型コード<br/><span className="text-[10px] font-normal text-slate-500">Mã khuôn</span></th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">品名<br/><span className="text-[10px] font-normal text-slate-500">Tên khuôn</span></th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">種類<br/><span className="text-[10px] font-normal text-slate-500">Loại</span></th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">顧客<br/><span className="text-[10px] font-normal text-slate-500">Khách hàng</span></th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap text-center">CAV</th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">位置<br/><span className="text-[10px] font-normal text-slate-500">Vị trí kệ</span></th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">状態<br/><span className="text-[10px] font-normal text-slate-500">Trạng thái</span></th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">テフロン<br/><span className="text-[10px] font-normal text-slate-500">Teflon</span></th>
              <th className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap text-center">操作<br/><span className="text-[10px] font-normal text-slate-500">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialData.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                  データが見つかりません (Không tìm thấy dữ liệu)
                </td>
              </tr>
            ) : (
              initialData.map((mold, idx) => (
                <tr key={mold.id} className="hover:bg-slate-50 transition-colors h-[36px]">
                  <td className="py-1 px-3 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="py-1 px-3 font-semibold text-slate-800">{mold.physical_code}</td>
                  <td className="py-1 px-3 text-slate-700 max-w-[200px] truncate" title={mold.mold_name}>{mold.mold_name}</td>
                  <td className="py-1 px-3 text-slate-600 text-xs">
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded whitespace-nowrap">
                      {mold.item_type_name}
                    </span>
                  </td>
                  <td className="py-1 px-3 text-slate-600 max-w-[150px] truncate" title={mold.customer_name}>{mold.customer_name}</td>
                  <td className="py-1 px-3 text-center text-slate-600 font-mono text-xs">{mold.cavity}</td>
                  <td className="py-1 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 text-xs">{mold.rack_code !== '-' ? mold.rack_code : mold.rack_name}</span>
                      {mold.rack_label !== '-' && <span className="text-[10px] text-slate-400">{mold.rack_label}</span>}
                    </div>
                  </td>
                  <td className="py-1 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      mold.checkin_status === 'IN' 
                        ? 'bg-teal-100 text-teal-800 border border-teal-200' 
                        : mold.checkin_status === 'OUT'
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {mold.checkin_status === 'IN' ? '● IN' : mold.checkin_status === 'OUT' ? '○ OUT' : '▲ AUDIT'}
                    </span>
                  </td>
                  <td className="py-1 px-3">
                    {mold.teflon_count > 0 ? (
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold" title="Số lần mạ Teflon">
                          {mold.teflon_count}
                        </span>
                        {mold.last_teflon_date && (
                          <span className="text-[10px] text-slate-500">
                            {new Date(mold.last_teflon_date).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-1 px-3 text-center">
                    <button 
                      onClick={() => setSelectedMoldId(mold.id)}
                      className="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-teal-700 hover:border-teal-300 rounded text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      詳細 ➔
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL PANEL SLIDE-OVER */}
      {selectedMoldId && (
        <MoldDetailPanel 
          moldId={selectedMoldId} 
          onClose={() => setSelectedMoldId(null)} 
          racks={racks}
          allLayers={allLayers}
          employees={employees}
          destinations={destinations}
          companies={companies}
          itemTypes={itemTypes}
        />
      )}
    </div>
  )
}
