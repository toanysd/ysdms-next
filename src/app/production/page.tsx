'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar as CalendarIcon, Factory, Plus, List, Grid3X3, Settings, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductionPlanningPage() {
  const supabase = createClient();
  const [plans, setPlans] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Date state for day view (default today)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  async function fetchData() {
    setIsLoading(true);
    
    // Fetch machines
    const { data: machData } = await supabase.from('machines').select('*').order('machine_code');
    if (machData) setMachines(machData);
    
    // Fetch plans for current day/range
    const { data: planData, error } = await supabase
      .from('production_schedules')
      .select('*, machines(machine_code, machine_name), order_lines(*, orders(order_no, company_id), products(product_code, product_name))')
      .order('schedule_date');
      
    if (!error && planData) {
      const mapped = (planData as any[]).map(p => ({
        ...p,
        id: p.schedule_id,
        planned_start_date: p.schedule_date,
        planned_end_date: null,
        order_lines: p.order_lines ? {
          ...p.order_lines,
          products: p.order_lines.products ? {
            ...p.order_lines.products,
            name: p.order_lines.products.product_name
          } : null
        } : null
      }));
      setPlans(mapped);
    }
    setIsLoading(false);
  }

  // Simplified navigation
  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };
  
  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}>
            <Factory size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              生産計画
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Kế hoạch Sản xuất</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-2 rounded-md p-1 border" style={{ borderColor: 'var(--border-subtle)' }}>
            <button 
              className={`p-1.5 rounded flex items-center justify-center ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={14} />
            </button>
            <button 
              className={`p-1.5 rounded flex items-center justify-center ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
            </button>
          </div>
          <button className="btn-primary h-[32px] px-3 text-[12px] font-bold">
            <Plus size={16} className="mr-1" /> 新規計画
          </button>
        </div>
      </div>

      {viewMode === 'grid' && (
        <div className="flex flex-col gap-4">
          <div className="card-flat p-2 flex items-center justify-between">
            <button onClick={prevDay} className="p-1 hover-bg-surface-2 rounded text-muted hover-accent"><ChevronLeft size={18} /></button>
            <div className="flex items-center gap-2 font-bold font-mono text-[14px]">
              <CalendarIcon size={16} className="text-accent" />
              {currentDate}
            </div>
            <button onClick={nextDay} className="p-1 hover-bg-surface-2 rounded text-muted hover-accent"><ChevronRight size={18} /></button>
          </div>

          <div className="card-flat overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Simple Day Grid View Mock */}
              <div className="grid grid-cols-5 gap-[1px] bg-border-subtle border-b" style={{ background: 'var(--border-subtle)' }}>
                {machines.slice(0, 5).map(m => (
                  <div key={m.id} className="bg-surface py-2 text-center border-r last:border-r-0" style={{ background: 'var(--bg-surface)' }}>
                    <div className="text-[12px] font-bold font-mono" style={{ color: 'var(--accent)' }}>{m.machine_code}</div>
                    <div className="text-[10px] text-muted">{m.machine_name}</div>
                  </div>
                ))}
                {machines.length === 0 && (
                  <div className="col-span-5 bg-surface p-4 text-center text-[12px] text-muted" style={{ background: 'var(--bg-surface)' }}>機械データがありません</div>
                )}
              </div>
              <div className="bg-surface-2 p-4 text-center min-h-[300px] flex items-center justify-center" style={{ background: 'var(--bg-surface)' }}>
                {isLoading ? (
                  <span className="text-[13px] text-muted">読み込み中...</span>
                ) : plans.length === 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[13px] text-muted">この日の計画はありません</span>
                    <button className="btn-secondary h-[28px] px-3 text-[11px]">追加する</button>
                  </div>
                ) : (
                  <span className="text-[13px] text-muted">グリッド表示モジュール開発中</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="card-flat overflow-hidden">
          <table className="w-full text-left border-collapse data-table">
            <thead className="bg-surface-2 border-b" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
              <tr>
                <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">機械<br/><span className="text-[8px] font-normal">Machine</span></th>
                <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">受注<br/><span className="text-[8px] font-normal">Order</span></th>
                <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">製品<br/><span className="text-[8px] font-normal">Product</span></th>
                <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">開始<br/><span className="text-[8px] font-normal">Start</span></th>
                <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">終了<br/><span className="text-[8px] font-normal">End</span></th>
                <th className="px-3 py-2 text-[10px] uppercase font-semibold text-right text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-[12px] text-muted">読み込み中...</td></tr>
              ) : plans.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-[12px] text-muted">計画がありません</td></tr>
              ) : (
                plans.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover-bg-subtle" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="px-3 py-2 text-[12px] font-mono font-bold">{p.machines?.machine_code || '-'}</td>
                    <td className="px-3 py-2 text-[12px] font-mono">{p.order_lines?.orders?.order_no || '-'}</td>
                    <td className="px-3 py-2 text-[12px]">
                      <div className="flex flex-col">
                        <span className="font-mono text-accent">{p.order_lines?.products?.product_code}</span>
                        <span className="text-[10px] text-muted truncate max-w-[150px]">{p.order_lines?.products?.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[12px] font-mono">{p.planned_start_date ? new Date(p.planned_start_date).toLocaleString('ja-JP', {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}) : '-'}</td>
                    <td className="px-3 py-2 text-[12px] font-mono">{p.planned_end_date ? new Date(p.planned_end_date).toLocaleString('ja-JP', {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}) : '-'}</td>
                    <td className="px-3 py-2 text-right">
                      <button className="p-1 hover-bg-surface-2 rounded text-muted hover-accent transition-colors"><Settings size={14}/></button>
                      <button className="p-1 hover-bg-surface-2 rounded text-muted hover-error transition-colors"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
