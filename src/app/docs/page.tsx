import React from 'react'
import DocsViewer from './_components/DocsViewer'

export const metadata = {
  title: 'Hồ sơ Hệ thống & Nghiệp vụ | YSDMS Next-Gen',
}

export default function DocsPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">システム設計書 <span className="text-base font-normal text-slate-500 ml-1">/ Hệ thống & Nghiệp vụ</span></h1>
            <p className="text-xs text-slate-500 mt-0.5">Mô hình quan hệ, luồng nghiệp vụ và quy trình thao tác YSDMS Next-Gen</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <DocsViewer />
    </div>
  )
}
