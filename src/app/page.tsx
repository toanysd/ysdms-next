'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

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

  const kpiCards = [
    { label: t('kpi.activeMolds'), value: '1,248', delta: '+12%', ok: true, color: 'var(--accent)', bgTint: 'var(--tint-teal-bg)' },
    { label: t('kpi.plasticInventory'), value: '8,450', delta: '-5%', ok: false, color: 'var(--status-warning)', bgTint: 'var(--tint-orange-bg)' },
    { label: t('kpi.newOrders'), value: '34', delta: t('kpi.newOrders'), ok: true, color: 'var(--status-info)', bgTint: 'var(--tint-blue-bg)' },
    { label: t('kpi.needsMaintenance'), value: '12', delta: t('kpi.needsActionDelta'), ok: false, color: 'var(--status-error)', bgTint: 'var(--tint-purple-bg)' },
  ];

  const widgets = [
    { label: t('widgets.inboundTrend'), tag: 'FG', tagColor: 'var(--accent)' },
    { label: t('widgets.materialTypeDist'), tag: 'Live', tagColor: 'var(--status-success)' },
    { label: t('widgets.colorDist'), tag: 'Live', tagColor: 'var(--status-success)' },
    { label: t('widgets.topConsumption'), tag: 'M', tagColor: 'var(--status-info)' },
  ];

  const taskTypeLabels: Record<string, string> = {
    new: t('tasks.types.new'),
    maintenance: t('tasks.types.maintenance'),
    prototype: t('tasks.types.prototype'),
    copy: t('tasks.types.copy'),
    adjust: t('tasks.types.adjust'),
  };

  const taskStatusLabels: Record<string, string> = {
    inProgress: t('tasks.status.inProgress'),
    request: t('tasks.status.request'),
    waitingMaterial: t('tasks.status.waitingMaterial'),
    completed: t('tasks.status.completed'),
    machining: t('tasks.status.machining'),
  };

  const taskItems = [
    { id: 'J-101', name: 'JAE-001', type: 'new', st: 'inProgress', bc: 'badge--success', d: '06/10', p: '田中' },
    { id: 'J-102', name: 'MTY-005', type: 'maintenance', st: 'request', bc: 'badge--warning', d: '06/15', p: '佐藤' },
    { id: 'J-103', name: 'SMK-002', type: 'new', st: 'waitingMaterial', bc: 'badge--error', d: '06/20', p: '鈴木' },
    { id: 'J-104', name: 'TE-010', type: 'prototype', st: 'completed', bc: 'badge--neutral', d: '06/05', p: '高橋' },
    { id: 'J-105', name: 'IRI-008', type: 'copy', st: 'inProgress', bc: 'badge--success', d: '06/25', p: '渡辺' },
    { id: 'J-106', name: 'JAE-015', type: 'new', st: 'machining', bc: 'badge--info', d: '06/18', p: '伊藤' },
    { id: 'J-107', name: 'KWA-003', type: 'adjust', st: 'inProgress', bc: 'badge--success', d: '06/22', p: '山本' },
  ];

  const statItemMap: Record<string, { label: string; sub: string; v: string }> = {
    molds: { label: t('stats.molds'), sub: t('stats.moldsSub'), v: '4,589' },
    cutters: { label: t('stats.cutters'), sub: t('stats.cuttersSub'), v: '892' },
    orders: { label: t('stats.orders'), sub: t('stats.ordersSub'), v: '156' },
    machines: { label: t('stats.machines'), sub: t('stats.machinesSub'), v: '14' },
    employees: { label: t('stats.employees'), sub: t('stats.employeesSub'), v: '45' },
    racks: { label: t('stats.racks'), sub: t('stats.racksSub'), v: '76' },
    products: { label: t('stats.products'), sub: t('stats.productsSub'), v: '320' },
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
        {kpiCards.map((kpi, i) => (
          <div key={i} className="card-flat flex items-center justify-between px-4 py-2.5" style={{ borderTop: `3px solid ${kpi.color}`, background: kpi.bgTint }}>
            <div>
              <div className="text-[11px] font-bold" style={{ color: kpi.color, fontFamily: 'var(--font-jp)' }}>{kpi.label}</div>
            </div>
            <div className="text-right">
              <div className="text-[24px] font-mono font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{kpi.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: kpi.ok ? 'var(--status-success)' : 'var(--status-error)' }}>{kpi.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Analysis widgets — 4 small cards */}
      <div className="grid grid-cols-4 gap-2.5 shrink-0" style={{ height: '140px' }}>
        {widgets.map((w, i) => (
          <div key={i} className="card-flat flex flex-col min-h-0">
            <div className="card-header-tint flex items-center justify-between px-3 py-1.5 shrink-0">
              <div>
                <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{w.label}</span>
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
          <div className="card-header-tint flex items-center justify-between px-3 py-2 shrink-0">
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
                {taskItems.map((task, i) => (
                  <tr key={i} className="cursor-pointer">
                    <td>
                      <Link href="/equipment/jobs" className="font-mono text-[13px] font-bold hover:underline" style={{ color: 'var(--accent)' }}>
                        {task.id}
                      </Link>
                    </td>
                    <td>
                      <span className="text-[12px] font-semibold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                        {task.name} {taskTypeLabels[task.type] || task.type}
                      </span>
                    </td>
                    <td><span className="badge badge--neutral">{taskTypeLabels[task.type] || task.type}</span></td>
                    <td><span className={`badge ${task.bc}`}>{taskStatusLabels[task.st] || task.st}</span></td>
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
          <div className="card-header-tint px-3 py-2 shrink-0">
            <span className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{t('stats.title')}</span>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar px-3 py-1">
            {Object.entries(statItemMap).map(([key, item], i) => (
              <div key={key} className="flex items-center justify-between py-2" style={{ borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div>
                  <span className="text-[12px] font-semibold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{item.label}</span>
                  <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</span>
                </div>
                <span className="font-mono text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{item.v}</span>
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
