'use client';

import React, { useState } from 'react';
import { ScanBarcode, Plus, Minus, ArrowRight, PackageOpen, CheckCircle } from 'lucide-react';
import { consumePlasticRoll } from '@/app/actions/production';

export default function PlasticRollScanner() {
  const [barcode, setBarcode] = useState('');
  const [scannedRoll, setScannedRoll] = useState<any>(null);
  const [consumeAmount, setConsumeAmount] = useState<number>(0);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;
    
    // Mock fetching roll from DB
    setScannedRoll({
      id: 'roll_123',
      roll_barcode: barcode,
      plastic_code: 'A-PET-0.5-640',
      current_length_m: 500,
      nominal_length_m: 1000,
      status: 'in_stock'
    });
  };

  const handleConsume = async () => {
    if (!scannedRoll || consumeAmount <= 0) return;
    
    try {
      const res = await consumePlasticRoll(scannedRoll.roll_barcode, consumeAmount);
      alert(`Đã trừ ${consumeAmount}m từ cuộn ${scannedRoll.roll_barcode}. Tồn kho mới: ${res.newLength}m.`);
      
      setScannedRoll(null);
      setBarcode('');
      setConsumeAmount(0);
    } catch (e: any) {
      alert(e.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[var(--mcs-text)] flex items-center gap-2 mb-4">
        <ScanBarcode className="text-[var(--mcs-primary)]" />
        ロールバーコードスキャン
      </h2>

      <form onSubmit={handleScan} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="ロールバーコードをスキャンまたは入力..." 
          className="flex-1 border border-[var(--mcs-border)] rounded-md px-3 py-2 text-sm focus:border-[var(--mcs-primary)] focus:outline-none"
          autoFocus
        />
        <button type="submit" className="px-4 py-2 bg-[var(--mcs-primary)] text-white rounded-md font-bold hover:bg-[var(--mcs-primary-hover)] transition-colors">
          スキャン
        </button>
      </form>

      {scannedRoll && (
        <div className="bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] rounded-md p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-[var(--mcs-text-muted)] font-bold mb-1">選択中のロール</div>
              <div className="text-xl font-bold text-[var(--mcs-text)]">{scannedRoll.roll_barcode}</div>
              <div className="text-sm font-bold text-[var(--mcs-primary)] mt-1">{scannedRoll.plastic_code}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--mcs-text-muted)] font-bold mb-1">現在残量</div>
              <div className="text-2xl font-bold text-[var(--mcs-success)]">{scannedRoll.current_length_m} <span className="text-sm">m</span></div>
            </div>
          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 mt-2">
            <label className="block text-xs text-[var(--mcs-text-muted)] font-bold mb-2">使用（またはロス）メートル数を入力</label>
            <div className="flex gap-4 items-center">
              <div className="flex-1 flex border border-[var(--mcs-border-strong)] rounded-md overflow-hidden bg-white">
                <button 
                  type="button"
                  className="px-4 bg-[var(--mcs-surface-3)] hover:bg-[var(--mcs-border)] transition-colors flex items-center justify-center"
                  onClick={() => setConsumeAmount(Math.max(0, consumeAmount - 10))}
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="number" 
                  value={consumeAmount}
                  onChange={(e) => setConsumeAmount(Number(e.target.value))}
                  className="flex-1 text-center font-bold text-lg py-2 focus:outline-none"
                />
                <button 
                  type="button"
                  className="px-4 bg-[var(--mcs-surface-3)] hover:bg-[var(--mcs-border)] transition-colors flex items-center justify-center"
                  onClick={() => setConsumeAmount(consumeAmount + 10)}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button 
                onClick={handleConsume}
                disabled={consumeAmount <= 0 || consumeAmount > scannedRoll.current_length_m}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[var(--mcs-surface)] rounded-md font-bold transition-colors h-full"
              >
                <CheckCircle size={18} /> 記録
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
