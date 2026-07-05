'use client'

import React, { useState } from 'react'
import UnifiedTrayDrawer from './UnifiedTrayDrawer'

interface Props {
  customers: any[]
  plasticTypes: any[]
  initialProducts: any[]
}

export default function ProductsClientPage({ customers, plasticTypes, initialProducts }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">トレイ・製品 <span className="text-base font-normal text-slate-500 ml-1">/ Quản lý Khay & Sản phẩm</span></h1>
            <p className="text-xs text-slate-500 mt-0.5">Khởi tạo yêu cầu thiết kế khay từ khách hàng</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-10 px-4 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            フィルター (Lọc)
          </button>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="h-10 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-sm rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition-colors shadow-md flex items-center gap-2"
          >
            <span>+</span>
            <span>新規登録 (Tạo Khay Mới)</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {initialProducts.map(p => {
            const moldInfo = p.product_code || 'Chưa có mã'
            const customerName = p.companies?.company_code || 'No Customer'
            return (
              <div key={p.product_id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-800">{p.product_code}</div>
                  <div className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium border border-indigo-100">Khay</div>
                </div>
                <div className="text-sm text-slate-600 mb-3 truncate">{p.product_name}</div>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1"><span className="text-slate-400">KH:</span> <span className="font-medium text-slate-700 truncate max-w-[80px]">{customerName}</span></div>
                  <div className="flex items-center gap-1"><span className="text-slate-400">Khuôn:</span> <span className="font-medium text-indigo-600">{moldInfo}</span></div>
                </div>
              </div>
            )
          })}
        </div>
        
        {initialProducts.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64 text-slate-500">
            <p className="mb-2">Chưa có khay nào trong hệ thống.</p>
            <button onClick={() => setDrawerOpen(true)} className="text-indigo-600 font-medium hover:underline text-sm">
              Nhấn vào đây để tạo Khay mới
            </button>
          </div>
        )}
      </div>

      <UnifiedTrayDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        customers={customers} 
        plasticTypes={plasticTypes} 
      />
    </div>
  )
}
