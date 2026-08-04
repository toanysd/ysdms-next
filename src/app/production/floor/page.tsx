'use client';

export default function FloorPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
          成形現場
        </h1>
      </div>
      <div className="card-flat px-4 py-8 text-center">
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>🚧 このモジュールは開発中です</p>
      </div>
    </div>
  )
}
