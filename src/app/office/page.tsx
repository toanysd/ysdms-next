export default function OfficeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">オフィス・総括 (Office Dashboard)</h1>
          <p className="text-[var(--text-muted)]">営業、計画、マスターデータの総合管理</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">進行中受注</h3>
          </div>
          <div className="text-2xl font-bold">124</div>
        </div>
      </div>
    </div>
  )
}
