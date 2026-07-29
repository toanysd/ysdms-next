'use client';

import { useTranslations, useLocale } from 'next-intl';

const PIC_MAP: Record<string, { ja: string, vi: string }> = {
  '田中': { ja: '田中', vi: 'Tanaka' },
  '佐藤': { ja: '佐藤', vi: 'Sato' },
  '鈴木': { ja: '鈴木', vi: 'Suzuki' },
  '高橋': { ja: '高橋', vi: 'Takahashi' },
  '渡辺': { ja: '渡辺', vi: 'Watanabe' },
  '伊藤': { ja: '伊藤', vi: 'Ito' },
  '山本': { ja: '山本', vi: 'Yamamoto' },
};

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();

  const getPicName = (p: string) => {
    return PIC_MAP[p]?.[locale === 'vi' ? 'vi' : 'ja'] || p;
  };

  return (
    <div className="flex flex-col gap-2.5" style={{ height: 'calc(100vh - 48px - 32px)', overflow: 'hidden' }}>
      
      {/* Row 1: Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
            {t('title')}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button className="btn-secondary h-[26px] text-[11px] px-3">{t('masterControl')}</button>
          <button className="btn-secondary h-[26px] text-[11px] px-3">{t('production')}</button>
        </div>
      </div>

      {/* Row 2: KPI Cards — compact inline */}
      <div className="grid grid-cols-4 gap-2.5 shrink-0">
        {[
          { labelKey: 'activeMolds', value: '1,248', delta: '+12%', ok: true, color: 'var(--accent)' },
          { labelKey: 'plasticInventory', value: '8,450', delta: '-5%', ok: false, color: 'var(--status-warning)' },
          { labelKey: 'newOrders', value: '34', delta: 'T6/2026', ok: true, color: 'var(--status-info)' },
          { labelKey: 'needsMaintenance', value: '12', delta: 'Cần xử lý', ok: false, color: 'var(--status-error)' },
        ].map((kpi, i) => (
          <div key={i} className="card-flat flex items-center justify-between px-4 py-2.5" style={{ borderTop: `3px solid ${kpi.color}` }}>
            <div>
              <div className="text-[11px] font-bold" style={{ color: kpi.color, fontFamily: 'var(--font-jp)' }}>{t('kpi.' + kpi.labelKey)}</div>
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
          { labelKey: 'inboundTrend', tag: 'FG', tagColor: 'var(--accent)' },
          { labelKey: 'materialTypeDist', tag: 'Live', tagColor: 'var(--status-success)' },
          { labelKey: 'colorDist', tag: 'Live', tagColor: 'var(--status-success)' },
          { labelKey: 'topConsumption', tag: 'M', tagColor: 'var(--status-info)' },
        ].map((w, i) => (
          <div key={i} className="card-flat flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-1.5 shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{t('widgets.' + w.labelKey)}</span>
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
              <span className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{t('tasks.title')}</span>
            </div>
            <button className="text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>{t('tasks.viewAll')}</button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>{t('tasks.colId')}</th>
                  <th>{t('tasks.colJob')}</th>
                  <th style={{ width: '70px' }}>{t('tasks.colType')}</th>
                  <th style={{ width: '95px' }}>{t('tasks.colStatus')}</th>
                  <th style={{ width: '60px' }}>{t('tasks.colDue')}</th>
                  <th style={{ width: '55px' }}>{t('tasks.colPic')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'J-101', ja: 'JAE-001 新規金型', vi: 'JAE-001 Khuôn mới', type: 'new', st: 'inProgress', bc: 'badge--success', d: '06/10', p: '田中' },
                  { id: 'J-102', ja: 'MTY-005 メンテ', vi: 'MTY-005 Bảo trì', type: 'maintenance', st: 'request', bc: 'badge--warning', d: '06/15', p: '佐藤' },
                  { id: 'J-103', ja: 'SMK-002 新規抜型', vi: 'SMK-002 Dao mới', type: 'new', st: 'waitingMaterial', bc: 'badge--error', d: '06/20', p: '鈴木' },
                  { id: 'J-104', ja: 'TE-010 成形試作', vi: 'TE-010 Thử nghiệm định hình', type: 'prototype', st: 'completed', bc: 'badge--neutral', d: '06/05', p: '高橋' },
                  { id: 'J-105', ja: 'IRI-008 金型コピー', vi: 'IRI-008 Sao chép khuôn', type: 'copy', st: 'inProgress', bc: 'badge--success', d: '06/25', p: '渡辺' },
                  { id: 'J-106', ja: 'JAE-015 プラグ', vi: 'JAE-015 Làm plug mới', type: 'new', st: 'machining', bc: 'badge--info', d: '06/18', p: '伊藤' },
                  { id: 'J-107', ja: 'KWA-003 調整', vi: 'KWA-003 Điều chỉnh', type: 'adjust', st: 'inProgress', bc: 'badge--success', d: '06/22', p: '山本' },
                ].map((task, i) => (
                  <tr key={i} className="cursor-pointer">
                    <td className="font-mono text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{task.id}</td>
                    <td>
                      <span className="text-[12px] font-semibold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                        {locale === 'vi' ? task.vi : task.ja}
                      </span>
                    </td>
                    <td><span className="badge badge--neutral">{t('tasks.types.' + task.type)}</span></td>
                    <td><span className={`badge ${task.bc}`}>{t('tasks.status.' + task.st)}</span></td>
                    <td className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{task.d}</td>
                    <td className="text-[11px]" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-secondary)' }}>
                      {getPicName(task.p)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats + System — 1/3 width */}
        <div className="card-flat flex flex-col min-h-0">
          <div className="px-3 py-2 shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
            <span className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{t('stats.title')}</span>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar px-3 py-1">
            {[
              { k: 'molds', v: '4,589' },
              { k: 'cutters', v: '892' },
              { k: 'orders', v: '156' },
              { k: 'machines', v: '14' },
              { k: 'employees', v: '45' },
              { k: 'racks', v: '76' },
              { k: 'products', v: '320' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div>
                  <span className="text-[12px] font-semibold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{t('stats.' + s.k)}</span>
                  <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-muted)' }}>{t('stats.' + s.k + 'Sub')}</span>
                </div>
                <span className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{s.v}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 shrink-0 text-center" style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface-2)' }}>
            <div className="flex items-center justify-center gap-1.5">
              <div className="badge-dot badge-dot--success"></div>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--status-success)' }}>{t('stats.systemNormal')}</span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>· {t('stats.systemStatus')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
