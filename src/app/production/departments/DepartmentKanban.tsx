'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { KanbanSquare, Factory, Settings, Scissors, Recycle, Package, CheckCircle, Clock } from 'lucide-react';

type Department = { id: string; code: string; name: string };
type Job = { id: string; order_no: string; product_name: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE'; quantity: number };

const DEPARTMENTS_MOCK = [
  { id: '1', code: 'CUTTING', name: '抜き加工 (Cutting)', icon: <Scissors size={16} /> },
  { id: '2', code: 'RECYCLING', name: '粉砕 (Recycling)', icon: <Recycle size={16} /> },
  { id: '3', code: 'WAREHOUSE', name: '出荷・倉庫 (Warehouse)', icon: <Package size={16} /> },
  { id: '4', code: 'QC', name: '品質検査 (QC)', icon: <CheckCircle size={16} /> }
];

export default function DepartmentKanban() {
  const [activeDept, setActiveDept] = useState<string>('1');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real app, fetch from Supabase: 
    // supabase.from('jobs').select('*').eq('department_id', activeDept)
    setLoading(true);
    setTimeout(() => {
      setJobs([
        { id: 'j1', order_no: 'ORD-2607-001', product_name: 'A-PET 0.5mm Tray', status: 'TODO', quantity: 5000 },
        { id: 'j2', order_no: 'ORD-2607-002', product_name: 'PS Black Conductive Tray', status: 'IN_PROGRESS', quantity: 2000 },
        { id: 'j3', order_no: 'ORD-2607-003', product_name: 'PP White Tray', status: 'DONE', quantity: 15000 }
      ]);
      setLoading(false);
    }, 400);
  }, [activeDept]);

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
  };

  const handleDrop = (e: React.DragEvent, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));
    // Call Supabase to update job status here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderColumn = (title: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE', colorClass: string, jpTitle: string) => {
    const colJobs = jobs.filter(j => j.status === status);
    
    return (
      <div 
        className="flex flex-col bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] rounded-lg p-4 h-full min-h-0"
        onDrop={(e) => handleDrop(e, status)}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--mcs-border)] shrink-0">
          <div className={`w-3 h-3 rounded-full ${colorClass}`} />
          <div>
            <h2 className="font-bold text-[var(--mcs-text)] text-sm leading-tight">{jpTitle}</h2>
            <h3 className="text-xs text-[var(--mcs-text-muted)] font-medium">{title}</h3>
          </div>
          <span className="ml-auto bg-[var(--mcs-surface)] px-2 py-1 rounded-full text-xs font-bold text-[var(--mcs-text-muted)] border border-[var(--mcs-border)]">
            {colJobs.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {colJobs.map(job => (
            <div 
              key={job.id} 
              draggable 
              onDragStart={(e) => handleDragStart(e, job.id)}
              className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-[var(--mcs-primary)] hover:shadow-md transition-all group"
            >
              <div className="text-[11px] text-[var(--mcs-primary)] font-bold mb-1 truncate">
                {job.order_no}
              </div>
              <div className="text-sm font-bold text-[var(--mcs-text)] mb-2">
                {job.product_name}
              </div>
              <div className="text-[11px] text-[var(--mcs-text-muted)] flex justify-between items-center">
                <span>SL: {job.quantity.toLocaleString()}</span>
                <span className="text-xs text-[var(--mcs-border-strong)] group-hover:text-[var(--mcs-primary)]">
                  ⋮⋮
                </span>
              </div>
            </div>
          ))}
          {colJobs.length === 0 && (
            <div className="text-center text-[var(--mcs-text-muted)] text-sm py-8 border-2 border-dashed border-[var(--mcs-border)] rounded-md">
              カードをドラッグ＆ドロップ
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 overflow-hidden flex flex-col bg-[var(--mcs-bg)] h-screen">
      <header className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[var(--mcs-text)] flex items-center gap-2">
            <KanbanSquare className="text-[var(--mcs-primary)]" />
            各部門カンバン (Department Kanban)
          </h1>
          <p className="text-[12px] text-[var(--mcs-text-muted)] mt-1">部門間サポートタスクの管理ボード</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--mcs-border)] pb-0 shrink-0 overflow-x-auto">
        {DEPARTMENTS_MOCK.map(dept => (
          <button
            key={dept.id}
            onClick={() => setActiveDept(dept.id)}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-bold transition-colors border-b-2 ${
              activeDept === dept.id 
                ? 'border-[var(--mcs-primary)] text-[var(--mcs-primary)] bg-[var(--mcs-surface)] rounded-t-md' 
                : 'border-transparent text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)]'
            }`}
          >
            {dept.icon}
            {dept.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[var(--mcs-text-muted)]">
          読み込み中...
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
          {renderColumn('未着手', 'TODO', 'bg-amber-500', '未着手')}
          {renderColumn('進行中', 'IN_PROGRESS', 'bg-info', '進行中')}
          {renderColumn('完了', 'DONE', 'bg-emerald-500', '完了')}
        </div>
      )}
    </div>
  );
}
