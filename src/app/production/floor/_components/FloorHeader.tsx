'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Factory, RefreshCw, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FloorHeaderProps {
  machineCode?: string;
  machineName?: string;
  onChangeMachine: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function FloorHeader({
  machineCode,
  machineName,
  onChangeMachine,
  onRefresh,
  isLoading,
}: FloorHeaderProps) {
  const t = useTranslations('Floor');

  return (
    <header
      className="card-flat flex flex-wrap items-center justify-between gap-3 px-4 py-3"
      style={{
        borderLeft: '4px solid var(--accent)',
        background: 'var(--bg-surface)',
      }}
    >
      {/* Left: Machine Info & Current Shift */}
      <div className="flex items-center gap-3">
        <Link
          href="/production/schedule"
          className="btn btn-secondary flex items-center justify-center"
          style={{ minHeight: '44px', minWidth: '44px', padding: '0 12px' }}
          title={t('back')}
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>

        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--tint-teal-bg)' }}
        >
          <Factory className="w-6 h-6" style={{ color: 'var(--accent)' }} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-lg md:text-xl font-bold font-mono tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {machineCode ? `${machineCode} : ${machineName || ''}` : t('noMachineSelected')}
            </span>
            <span
              className="badge"
              style={{
                background: 'var(--tint-teal-bg)',
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: '12px',
                padding: '4px 8px',
              }}
            >
              {t('shiftDayOnly')} (08:00 - 17:00)
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {t('subtitle')}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="btn btn-secondary flex items-center gap-2"
          style={{ minHeight: '44px', padding: '0 14px', fontSize: '13px' }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{t('refresh')}</span>
        </button>

        <button
          type="button"
          onClick={onChangeMachine}
          className="btn btn-primary flex items-center gap-2"
          style={{ minHeight: '44px', padding: '0 18px', fontSize: '14px', fontWeight: 600 }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('changeMachine')}</span>
        </button>
      </div>
    </header>
  );
}
