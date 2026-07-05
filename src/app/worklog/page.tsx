'use client';

export default function WorklogPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
          日報管理
        </h1>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Hub Nhật ký tập trung</span>
      </div>
      <div className="card-flat px-4 py-8 text-center flex flex-col items-center gap-4">
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>🚧 このモジュールは開発中です / Module đang phát triển</p>
        
        <div className="mt-8 border-t border-[var(--border-subtle)] w-full max-w-md pt-8">
          <p className="text-[13px] mb-4 text-[var(--text-primary)]">Tính năng in báo cáo Nhật ký (Nippo) đã được hoàn thành:</p>
          <a 
            href="/reports/daily-worklog"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect width="12" height="8" x="6" y="14"/></svg>
            Đi tới trang In báo cáo (Nippo)
          </a>
        </div>
      </div>
    </div>
  )
}
