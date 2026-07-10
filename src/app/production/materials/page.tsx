import React from 'react';
import { Package } from 'lucide-react';
import PlasticRollScanner from './PlasticRollScanner';

export const metadata = {
  title: 'Quản Lý Kho Vật Tư (Nhựa) | YSDMS Next-Gen',
}

export default function MaterialsPage() {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[var(--mcs-bg)]">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-[var(--mcs-text)] flex items-center gap-2">
            <Package className="text-[var(--mcs-primary)]" />
            Quản Lý Vật Tư / Kho Nhựa (Plastic WMS)
          </h1>
          <p className="text-[12px] text-[var(--mcs-text-muted)] mt-1">Hệ thống theo dõi tồn kho cuộn nhựa chi tiết bằng mã vạch và mét (m)</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlasticRollScanner />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-lg shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="p-4 border-b border-[var(--mcs-border)] flex justify-between items-center bg-[var(--mcs-surface-3)]">
              <h2 className="font-bold text-[var(--mcs-text)] text-sm">Tồn Kho Cuộn (Rolls In Stock)</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[var(--mcs-surface-2)] text-[var(--mcs-text-muted)] text-[11px] uppercase sticky top-0 z-10 shadow-sm border-b border-[var(--mcs-border)]">
                  <tr>
                    <th className="p-3">Mã Cuộn (Barcode)</th>
                    <th className="p-3">Mã Vật Tư</th>
                    <th className="p-3 text-right">Lúc Nhập (m)</th>
                    <th className="p-3 text-right">Tồn Hiện Tại (m)</th>
                    <th className="p-3">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock data for visualization */}
                  <tr className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)]">
                    <td className="p-3 font-mono text-[var(--mcs-primary)] font-bold">R2607-001</td>
                    <td className="p-3 font-bold">A-PET-0.5-640</td>
                    <td className="p-3 text-right tabular-nums">1,000.0</td>
                    <td className="p-3 text-right tabular-nums font-bold text-[var(--mcs-success)]">850.5</td>
                    <td className="p-3">
                      <span className="bg-[var(--mcs-success-light)] text-[var(--mcs-success-text)] px-2 py-0.5 rounded text-[10px] font-bold uppercase">In Stock</span>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)]">
                    <td className="p-3 font-mono text-[var(--mcs-primary)] font-bold">R2607-002</td>
                    <td className="p-3 font-bold">A-PET-0.5-640</td>
                    <td className="p-3 text-right tabular-nums">1,000.0</td>
                    <td className="p-3 text-right tabular-nums font-bold text-[var(--mcs-warning)]">120.0</td>
                    <td className="p-3">
                      <span className="bg-[var(--mcs-warning-light)] text-[var(--mcs-warning-text)] px-2 py-0.5 rounded text-[10px] font-bold uppercase">In Use</span>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)]">
                    <td className="p-3 font-mono text-[var(--mcs-primary)] font-bold">R2607-003</td>
                    <td className="p-3 font-bold">PS-1.0-640-BLK-C</td>
                    <td className="p-3 text-right tabular-nums">500.0</td>
                    <td className="p-3 text-right tabular-nums font-bold text-[var(--mcs-success)]">500.0</td>
                    <td className="p-3">
                      <span className="bg-[var(--mcs-success-light)] text-[var(--mcs-success-text)] px-2 py-0.5 rounded text-[10px] font-bold uppercase">In Stock</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
