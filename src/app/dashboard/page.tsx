'use client';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-2.5" style={{ height: 'calc(100vh - 48px - 32px)', overflow: 'hidden' }}>
      
      {/* Row 1: Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
            総合ダッシュボード
          </h1>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Bảng điều khiển tổng hợp</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="btn-secondary h-[26px] text-[11px] px-3">Master Control</button>
          <button className="btn-secondary h-[26px] text-[11px] px-3">Production</button>
        </div>
      </div>

      {/* Row 2: KPI Cards — compact inline */}
      <div className="grid grid-cols-4 gap-2.5 shrink-0">
        {[
          { label: '稼働金型', vi: 'Khuôn hoạt động', value: '1,248', delta: '+12%', ok: true, color: 'var(--accent)' },
          { label: 'プラ在庫 (kg)', vi: 'Tồn kho nhựa', value: '8,450', delta: '-5%', ok: false, color: 'var(--status-warning)' },
          { label: '新規受注', vi: 'Đơn hàng mới', value: '34', delta: 'T6/2026', ok: true, color: 'var(--status-info)' },
          { label: '要メンテナンス', vi: 'Cần bảo trì', value: '12', delta: 'Cần xử lý', ok: false, color: 'var(--status-error)' },
        ].map((kpi, i) => (
          <div key={i} className="card-flat flex items-center justify-between px-4 py-2.5" style={{ borderTop: `3px solid ${kpi.color}` }}>
            <div>
              <div className="text-[11px] font-bold" style={{ color: kpi.color, fontFamily: 'var(--font-jp)' }}>{kpi.label}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{kpi.vi}</div>
            </div>
            <div className="text-right">
              <div className="text-[24px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{kpi.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: kpi.ok ? 'var(--status-success)' : 'var(--status-error)' }}>{kpi.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Analysis widgets — 4 small cards like MoldCutterSearch */}
      <div className="grid grid-cols-4 gap-2.5 shrink-0" style={{ height: '140px' }}>
        {[
          { titleJa: '入庫トレンド', titleVi: 'Xu hướng nhập', tag: 'FG', tagColor: 'var(--accent)' },
          { titleJa: '材料タイプ分布', titleVi: 'Tỷ lệ Vật liệu', tag: 'Live', tagColor: 'var(--status-success)' },
          { titleJa: 'カラー分布', titleVi: 'Tỷ lệ Màu sắc', tag: 'Live', tagColor: 'var(--status-success)' },
          { titleJa: '消費トップ', titleVi: 'Tiêu dùng nhiều', tag: 'M', tagColor: 'var(--status-info)' },
        ].map((w, i) => (
          <div key={i} className="card-flat flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-1.5 shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{w.titleJa}</span>
                <span className="text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>{w.titleVi}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: w.tagColor, color: '#fff' }}>{w.tag}</span>
            </div>
            <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              <span className="text-[11px]">📊</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 4: Main content — Table + Stats side by side */}
      <div className="grid grid-cols-3 gap-2.5 flex-1 min-h-0">
        
        {/* Data Table — 2/3 width */}
        <div className="card-flat col-span-2 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
            <div>
              <span className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>タスク一覧</span>
              <span className="text-[10px] ml-2" style={{ color: 'var(--text-muted)' }}>Nhiệm vụ gần đây</span>
            </div>
            <button className="text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>Xem tất cả →</button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Công việc</th>
                  <th style={{ width: '70px' }}>Loại</th>
                  <th style={{ width: '95px' }}>Trạng thái</th>
                  <th style={{ width: '60px' }}>Hạn</th>
                  <th style={{ width: '55px' }}>PIC</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'J-101', ja: 'JAE-001 新規金型', vi: 'Khuôn mới', type: '新規', st: 'N.進行中', bc: 'badge--success', d: '06/10', p: '田中' },
                  { id: 'J-102', ja: 'MTY-005 メンテ', vi: 'Bảo trì', type: 'メンテ', st: 'R.REQUEST', bc: 'badge--warning', d: '06/15', p: '佐藤' },
                  { id: 'J-103', ja: 'SMK-002 新規抜型', vi: 'Dao mới', type: '新規', st: 'ZN.材料待', bc: 'badge--error', d: '06/20', p: '鈴木' },
                  { id: 'J-104', ja: 'TE-010 成形試作', vi: 'Thành hình', type: '試作', st: 'F.完了', bc: 'badge--neutral', d: '06/05', p: '高橋' },
                  { id: 'J-105', ja: 'IRI-008 金型コピー', vi: 'Sao chép', type: 'コピー', st: 'N.進行中', bc: 'badge--success', d: '06/25', p: '渡辺' },
                  { id: 'J-106', ja: 'JAE-015 プラグ', vi: 'Plug mới', type: '新規', st: '2.機械加工', bc: 'badge--info', d: '06/18', p: '伊藤' },
                  { id: 'J-107', ja: 'KWA-003 調整', vi: 'Điều chỉnh', type: '調整', st: 'N.進行中', bc: 'badge--success', d: '06/22', p: '山本' },
                ].map((t, i) => (
                  <tr key={i} className="cursor-pointer">
                    <td className="font-mono text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{t.id}</td>
                    <td>
                      <span className="text-[12px] font-semibold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{t.ja}</span>
                      <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-muted)' }}>{t.vi}</span>
                    </td>
                    <td><span className="badge badge--neutral">{t.type}</span></td>
                    <td><span className={`badge ${t.bc}`}>{t.st}</span></td>
                    <td className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{t.d}</td>
                    <td className="text-[11px]" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-secondary)' }}>{t.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats + System — 1/3 width */}
        <div className="card-flat flex flex-col min-h-0">
          <div className="px-3 py-2 shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
            <span className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>統計</span>
            <span className="text-[10px] ml-2" style={{ color: 'var(--text-muted)' }}>Thống kê</span>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar px-3 py-1">
            {[
              { k: '金型', vi: '448 chủ sở hữu', v: '4,589' },
              { k: '抜型', vi: '12 cần bảo trì', v: '892' },
              { k: '注文', vi: 'Tháng này', v: '156' },
              { k: '機械', vi: '9 thành hình', v: '14' },
              { k: '従業員', vi: 'Hoạt động', v: '45' },
              { k: '棚', vi: '380 tầng', v: '76' },
              { k: '製品', vi: 'Sản phẩm', v: '320' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div>
                  <span className="text-[12px] font-semibold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{s.k}</span>
                  <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-muted)' }}>{s.vi}</span>
                </div>
                <span className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{s.v}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 shrink-0 text-center" style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface-2)' }}>
            <div className="flex items-center justify-center gap-1.5">
              <div className="badge-dot badge-dot--success"></div>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--status-success)' }}>正常</span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>· DB 70 tables · Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
