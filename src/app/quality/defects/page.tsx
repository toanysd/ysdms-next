'use client';

export default function DefectsPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
          不良報告
        </h1>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Báo cáo Lỗi</span>
      </div>
      <div className="card-flat px-4 py-8 text-center">
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>🚧 このモジュールは開発中です / Module đang phát triển</p>
      </div>
    </div>
  )
}
