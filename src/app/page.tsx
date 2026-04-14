export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex border-b border-[#dde1e7] pb-2">
        <h1 className="text-[16px] font-bold">
          <span className="ja">総合ダッシュボード</span>
          <span className="vi">Bảng điều khiển tổng hợp</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Card Example */}
        <div className="bg-white border text-center border-[#dde1e7] border-t-4 border-t-[var(--mcs-primary)] p-4 rounded-lg shadow-sm">
          <div className="ja">稼働金型</div>
          <div className="vi">Khuôn đang hoạt động</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </div>
        
        <div className="bg-white border text-center border-[#dde1e7] border-t-4 border-t-[var(--mcs-success)] p-4 rounded-lg shadow-sm">
          <div className="ja">プラ在庫 (kg)</div>
          <div className="vi">Tồn kho nhựa (kg)</div>
          <div className="text-2xl font-bold mt-2 text-[var(--mcs-success)]">--</div>
        </div>
      </div>
      
      <div className="bg-white border border-[#dde1e7] p-4 rounded-lg shadow-sm">
        <p className="text-[var(--mcs-text-secondary)]">Database đã kết nối thành công. Vui lòng chọn module bên trái để quản lý Dữ liệu hệ thống.</p>
      </div>
    </div>
  )
}
