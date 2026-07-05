"use client"

export default function MoldHeaderActions() {
  return (
    <div className="flex gap-2">
      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors">
        📋 入出庫 (Nhập/Xuất)
      </button>
      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors">
        🎨 テフロン (Teflon)
      </button>
    </div>
  )
}
