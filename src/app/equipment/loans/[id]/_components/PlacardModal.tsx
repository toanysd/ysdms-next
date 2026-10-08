'use client';

import React from 'react';
import { X, Printer, Camera, Building2, Calendar, ShieldCheck, Tag } from 'lucide-react';
import type { EquipmentLoanItem } from '../../types';

interface PlacardModalProps {
  loan: EquipmentLoanItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlacardModal({ loan, isOpen, onClose }: PlacardModalProps) {
  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:p-0 print:bg-white"
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="flex flex-col w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden print:shadow-none print:w-full print:rounded-none"
        style={{ background: '#FFFFFF' }}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-800">
              固定資産撮影用看板 (On-site Inspection Placard)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>A4印刷 / プレビュー</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Placard Card */}
        <div className="p-8 print:p-6 flex flex-col items-center justify-center bg-white text-slate-900">
          <div className="w-full border-4 border-black p-6 rounded-md flex flex-col gap-4 font-sans shadow-sm">
            {/* Placard Header */}
            <div className="border-b-2 border-black pb-3 text-center">
              <span className="text-xs font-bold tracking-widest text-slate-600 uppercase block mb-1">
                J-SOX 固定資産実査特定看板 / ASSET VERIFICATION PLACARD
              </span>
              <h1 className="text-2xl font-black tracking-tight text-black">
                【 金型保管・現品実査票 】
              </h1>
            </div>

            {/* Placard Table */}
            <div className="grid grid-cols-3 border-2 border-black divide-x-2 divide-y-2 divide-black text-sm">
              {/* Row 1: Code */}
              <div className="bg-slate-100 p-2.5 font-bold flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-700" />
                <span>金型管理番号 (型番)</span>
              </div>
              <div className="col-span-2 p-2.5 font-mono font-black text-lg text-black">
                {loan.equipment_code}
              </div>

              {/* Row 2: Name */}
              <div className="bg-slate-100 p-2.5 font-bold">金型・製品名称</div>
              <div className="col-span-2 p-2.5 font-bold text-base text-slate-900">
                {loan.equipment_name || 'トレー成形金型'}
              </div>

              {/* Row 3: Loan Code */}
              <div className="bg-slate-100 p-2.5 font-bold">借用・預託番号</div>
              <div className="col-span-2 p-2.5 font-mono font-bold text-slate-800">
                {loan.loan_code}
              </div>

              {/* Row 4: Asset Owner */}
              <div className="bg-slate-100 p-2.5 font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-700" />
                <span>資産所有者 (客先)</span>
              </div>
              <div className="col-span-2 p-2.5 font-black text-base text-black">
                {loan.from_company_name || loan.to_company_name}
              </div>

              {/* Row 5: Custodian */}
              <div className="bg-slate-100 p-2.5 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>保管受託者</span>
              </div>
              <div className="col-span-2 p-2.5 font-bold text-slate-900">
                株式会社ヨシダパッケージ 本社工場
              </div>

              {/* Row 6: Capture Date */}
              <div className="bg-slate-100 p-2.5 font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-700" />
                <span>実査・撮影日</span>
              </div>
              <div className="col-span-2 p-2.5 font-bold text-slate-900 font-mono">
                {todayStr}
              </div>
            </div>

            {/* Placard Notice */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-300">
              <span>※ 本看板を金型側面に置き、スケール（メジャー）を添えて撮影してください。</span>
              <span className="font-mono font-bold">YSDMS NextGen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
