"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import MoldDetailPanel from "./MoldDetailPanel"
import MoldFilterDrawer from "./MoldFilterDrawer"
import UnifiedMoldDrawer from "./UnifiedMoldDrawer"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { Suspense } from "react"

type SortField = 'physical_code' | 'mold_name' | 'item_type_name' | 'customer_name' | 'cavity' | 'rack_code' | 'checkin_status' | 'teflon_count' | 'legacy_id' | 'product_info' | 'dimensions' | 'updated_at'
type SortOrder = 'asc' | 'desc' | null

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
  const [selectedMoldId, setSelectedMoldId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editPhysicalId, setEditPhysicalId] = useState<string | null>(null)

  const handleOpenCreate = () => { setEditPhysicalId(null); setDrawerOpen(true) }
  const handleOpenEdit = (id: string) => { setEditPhysicalId(id); setDrawerOpen(true) }

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc')
      else if (sortOrder === 'desc') {
        setSortOrder(null)
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedData = useMemo(() => {
    if (!sortField || !sortOrder) return initialData
    
    return [...initialData].sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]

      if (valA === null || valA === undefined) valA = ''
      if (valB === null || valB === undefined) valB = ''

      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [initialData, sortField, sortOrder])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="opacity-30" />
    return sortOrder === 'asc' ? <ArrowUp size={12} className="text-[var(--mcs-primary)]" /> : <ArrowDown size={12} className="text-[var(--mcs-primary)]" />
  }

  return (
    <div className="flex flex-col h-full relative">
      <Suspense fallback={null}>
        <MoldFilterDrawer itemTypes={itemTypes} customers={customers} racks={racks} />
      </Suspense>

      {/* VIEW CONTROLS */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--mcs-surface)] border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex bg-[var(--mcs-surface-3)] p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('card')}
              className={`w-10 h-8 flex items-center justify-center rounded-md transition-colors ${viewMode === 'card' ? 'bg-white shadow-sm text-[var(--mcs-primary)]' : 'text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)]'}`}
              title="カードビュー (Card View)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`w-10 h-8 flex items-center justify-center rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-[var(--mcs-primary)]' : 'text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)]'}`}
              title="テーブルビュー (Table View)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>

          <div className="flex items-baseline gap-1 text-[var(--mcs-text)]">
            <span className="text-xl font-bold">{initialData.length}</span>
            <span className="text-sm">件</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleOpenCreate} className="h-[36px] px-4 flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600 transition-all text-sm font-bold shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span className="hidden md:inline">新規登録 (Tạo mới)</span>
            <span className="md:hidden">+</span>
          </button>
          <button className="h-[36px] px-4 flex items-center gap-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] text-[var(--mcs-text-secondary)] rounded-lg hover:bg-[var(--mcs-surface-hover)] transition-colors text-sm font-bold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span className="hidden md:inline">印刷</span>
          </button>
          <button className="h-[36px] px-4 flex items-center gap-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] text-[var(--mcs-text-secondary)] rounded-lg hover:bg-[var(--mcs-surface-hover)] transition-colors text-sm font-bold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            <span className="hidden md:inline">棚卸</span>
          </button>
        </div>
      </div>

      {/* RESULTS CONTAINER */}
      <div className="flex-1 overflow-auto bg-[var(--mcs-bg)] p-4 md:p-6">
        
        {/* CARD VIEW */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {sortedData.length === 0 ? (
              <div className="col-span-full py-12 text-center text-[var(--mcs-text-muted)]">
                データが見つかりません (Không tìm thấy dữ liệu)
              </div>
            ) : (
              sortedData.map((mold) => {
                const isDao = mold.item_type_name.includes('Dao') || mold.item_type_name.includes('Cutter');
                return (
                  <div 
                    key={mold.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col p-4 border border-[var(--mcs-border)] relative"
                    onClick={() => setSelectedMoldId(mold.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        mold.checkin_status === 'IN' 
                          ? 'border-[#a5d6a7] bg-[#e8f5e9] text-[#2e7d32]' 
                          : mold.checkin_status === 'OUT'
                          ? 'border-[#f48fb1] bg-[#fce4ec] text-[#c2185b]'
                          : 'border-[#80deea] bg-[#e0f7fa] text-[#00838f]'
                      }`}>
                        <span className={isDao ? 'text-[#00bcd4]' : 'text-[#8bc34a]'} style={{ fontSize: '8px' }}>■</span>
                        <span>{mold.checkin_status === 'IN' ? 'IN' : mold.checkin_status === 'OUT' ? 'OUT' : 'AUDIT'}</span>
                      </div>
                      
                      {mold.teflon_count > 0 && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-50 text-purple-600 font-bold text-[10px] border border-purple-200" title="Số lần mạ Teflon">
                          T{mold.teflon_count}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-800 mb-4 line-clamp-1" title={mold.physical_code}>
                      {mold.physical_code}
                    </h3>
                    
                    <div className="flex flex-col mb-4">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tên thiết bị</span>
                      <span className="text-[13px] font-semibold text-gray-700 line-clamp-1" title={mold.mold_name}>
                        {mold.mold_name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto pt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Vị trí</span>
                        <span className="text-[13px] font-semibold text-gray-700">
                          {mold.rack_code !== '-' ? mold.rack_code : mold.rack_name}
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Khách hàng</span>
                        <span className="text-[13px] font-semibold text-gray-700 line-clamp-1 max-w-[120px]" title={mold.customer_name}>
                          {mold.customer_name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="bg-[var(--mcs-surface)] rounded-xl border border-[var(--mcs-border)] overflow-hidden shadow-[var(--mcs-shadow-sm)]">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                <thead className="bg-[var(--mcs-surface-3)] text-[var(--mcs-text-secondary)] sticky top-0 z-10 shadow-sm text-xs">
                  <tr>
                    <th className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold w-10 text-center">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                    </th>
                    
                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('legacy_id')}
                    >
                      <div className="flex items-center gap-1">
                        ID
                        <SortIcon field="legacy_id" />
                      </div>
                    </th>

                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('physical_code')}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          コード<br/><span className="text-[10px] font-normal opacity-70">Mã</span>
                        </div>
                        <SortIcon field="physical_code" />
                      </div>
                    </th>

                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('product_info')}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          製品情報<br/><span className="text-[10px] font-normal opacity-70">Sản phẩm</span>
                        </div>
                        <SortIcon field="product_info" />
                      </div>
                    </th>

                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('dimensions')}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          寸法<br/><span className="text-[10px] font-normal opacity-70">Kích thước</span>
                        </div>
                        <SortIcon field="dimensions" />
                      </div>
                    </th>

                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('rack_code')}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          位置<br/><span className="text-[10px] font-normal opacity-70">Vị trí</span>
                        </div>
                        <SortIcon field="rack_code" />
                      </div>
                    </th>

                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('customer_name')}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          顧客<br/><span className="text-[10px] font-normal opacity-70">Khách hàng</span>
                        </div>
                        <SortIcon field="customer_name" />
                      </div>
                    </th>

                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('updated_at')}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          更新日<br/><span className="text-[10px] font-normal opacity-70">Ngày cập nhật</span>
                        </div>
                        <SortIcon field="updated_at" />
                      </div>
                    </th>

                    <th 
                      className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                      onClick={() => handleSort('checkin_status')}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          状態<br/><span className="text-[10px] font-normal opacity-70">Trạng thái</span>
                        </div>
                        <SortIcon field="checkin_status" />
                      </div>
                    </th>

                    <th className="py-3 px-4 border-b border-[var(--mcs-border)] font-bold whitespace-nowrap text-center">
                      操作
                    </th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--mcs-divider)]">
                  {sortedData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[var(--mcs-text-muted)] text-sm">
                        データが見つかりません (Không tìm thấy dữ liệu)
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((mold, idx) => (
                      <tr 
                        key={mold.id} 
                        className="hover:bg-[var(--mcs-surface-hover)] transition-colors h-[48px] cursor-pointer"
                        onClick={() => setSelectedMoldId(mold.id)}
                      >
                        <td className="py-2 px-4 text-center w-10">
                          <input type="checkbox" className="w-4 h-4 cursor-pointer" onClick={(e) => e.stopPropagation()} />
                        </td>
                        <td className="py-2 px-4 text-[var(--mcs-text-muted)] text-xs text-center font-mono">
                          {mold.legacy_id || '-'}
                        </td>
                        <td className="py-2 px-4 font-black text-[var(--mcs-text)] text-sm whitespace-nowrap">
                          {mold.physical_code}
                        </td>
                        <td className="py-2 px-4 text-[var(--mcs-text-secondary)] text-xs font-bold max-w-[200px] truncate" title={mold.product_info !== '-' ? mold.product_info : mold.mold_name}>
                          {mold.product_info !== '-' ? mold.product_info : mold.mold_name}
                        </td>
                        <td className="py-2 px-4 text-[var(--mcs-text-secondary)] text-xs font-bold font-mono">
                          {mold.dimensions}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--mcs-text)] text-xs">{mold.rack_code !== '-' ? mold.rack_code : mold.rack_name}</span>
                            {mold.rack_label !== '-' && <span className="text-[10px] text-[var(--mcs-text-muted)]">{mold.rack_label}</span>}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-[var(--mcs-text-secondary)] text-xs font-bold max-w-[150px] truncate" title={mold.customer_name}>
                          {mold.customer_name}
                        </td>
                        <td className="py-2 px-4 text-[var(--mcs-text-secondary)] text-xs font-bold font-mono">
                          {mold.updated_at ? new Date(mold.updated_at).toLocaleDateString('ja-JP').replace(/\//g, '.') : '-'}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${
                            mold.checkin_status === 'IN' 
                              ? 'bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7]' 
                              : mold.checkin_status === 'OUT'
                              ? 'bg-[#fce4ec] text-[#c2185b] border border-[#f48fb1]'
                              : 'bg-[#e0f7fa] text-[#00838f] border border-[#80deea]'
                          }`}>
                            {mold.checkin_status === 'IN' ? '入庫 IN' : mold.checkin_status === 'OUT' ? '出庫 OUT' : '棚卸 AUDIT'}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button className="p-1 hover:bg-[#e0e0e0] rounded-full transition-colors text-[var(--mcs-text-muted)]" onClick={(e) => { e.stopPropagation(); setSelectedMoldId(mold.id); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

      {/* UNIFIED MOLD DRAWER */}
      <UnifiedMoldDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editPhysicalId={editPhysicalId}
        customers={customers}
        itemTypes={itemTypes}
        racks={racks}
        allLayers={allLayers}
      />
    </div>
  )
}
