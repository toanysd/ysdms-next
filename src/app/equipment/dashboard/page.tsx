import React from 'react'
import { Wrench, Layers, AlertCircle, Settings, FileEdit, Truck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { BilingualTitle } from '@/components/ui/BilingualTitle'

export default function ToolingDashboard() {
  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        titleJa="金型部"
        titleVi="Phòng Khuôn & Thiết bị"
        description="Quản lý Tiến độ gia công Khuôn, Xử lý bề mặt (Teflon), và Thiết bị phụ trợ (Dao, Chày, Frame)"
        actions={
          <button className="bg-slate-800 text-white px-3 py-1.5 rounded text-[11px] font-bold shadow hover:bg-slate-700 transition">
            + Yêu cầu Bảo dưỡng
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        {/* Cột 1: Tiến độ gia công */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-blue-50/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Wrench className="text-blue-600" size={16} />
                    <BilingualTitle ja="加工中" vi="Đang Gia công" className="gap-0" />
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
                {/* Mock Item */}
                <div className="border border-slate-100 rounded p-2 bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                    <div className="flex justify-between items-start mb-1.5">
                        <div>
                            <span className="text-[10px] font-mono text-slate-500">PO-2606-001</span>
                            <h3 className="font-bold text-slate-800 text-[13px]">Khuôn KWE-005</h3>
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Phay CNC</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Tiến độ: 45%</span>
                        <span>Dự kiến: 18/06</span>
                    </div>
                </div>

                <div className="border border-slate-100 rounded p-2 bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                    <div className="flex justify-between items-start mb-1.5">
                        <div>
                            <span className="text-[10px] font-mono text-slate-500">PO-2606-002</span>
                            <h3 className="font-bold text-slate-800 text-[13px]">Dao cắt IRI-006 (Dùng chung)</h3>
                        </div>
                        <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Chờ phôi</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Tiến độ: 10%</span>
                        <span>Dự kiến: 20/06</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Cột 2: Cảnh báo Xử lý Bề mặt (Teflon) */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-purple-50/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Settings className="text-purple-600" size={16} />
                    <BilingualTitle ja="表面処理 (テフロン)" vi="Xử lý Bề mặt (Teflon)" className="gap-0" />
                </div>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
                {/* Mock Item */}
                <div className="border border-purple-100 rounded p-2 bg-purple-50/30">
                    <div className="flex justify-between items-start mb-1.5">
                        <div>
                            <h3 className="font-bold text-purple-900 text-[13px]">KWE-005 (Đã duyệt chạy loạt)</h3>
                            <p className="text-[10px] text-slate-600 mt-0.5">Khách hàng Kowa Emori</p>
                        </div>
                        <AlertCircle size={14} className="text-red-500" />
                    </div>
                    <div className="bg-red-50 text-red-700 border border-red-100 text-[11px] p-1.5 rounded mb-2">
                        Khách hàng đã phê duyệt chạy loạt. Yêu cầu gửi khuôn đi mạ Teflon ngay.
                    </div>
                    <button className="w-full bg-purple-100 text-purple-700 hover:bg-purple-200 py-1.5 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition">
                        <Truck size={12} /> Tạo Lệnh Gia Công Ngoài
                    </button>
                </div>

                <div className="border border-slate-100 rounded p-2 bg-slate-50">
                    <div className="flex justify-between items-start mb-1.5">
                        <div>
                            <h3 className="font-bold text-slate-800 text-[13px]">KWE-001 (T502)</h3>
                            <p className="text-[10px] text-slate-600 mt-0.5">Đang mạ Teflon tại đối tác</p>
                        </div>
                        <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Đang gia công ngoài</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                        <span>Ngày gửi: 10/06</span>
                        <span className="font-bold text-purple-700">Ngày nhận (ETA): 17/06</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Cột 3: Quản lý Phụ trợ & Chày gỗ */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-orange-50/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Layers className="text-orange-600" size={16} />
                    <BilingualTitle ja="補助設備管理" vi="Quản lý Phụ trợ (Dao/Chày)" className="gap-0" />
                </div>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
                <div className="border border-slate-100 rounded p-2 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center">
                            <Layers size={14} />
                        </div>
                        <div>
                            <div className="font-bold text-[13px] text-slate-800">Dao cắt (Cutters)</div>
                            <div className="text-[10px] text-slate-500">12 dao đang hoạt động</div>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition">
                        <FileEdit size={14} />
                    </button>
                </div>
                
                <div className="border border-slate-100 rounded p-2 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-yellow-100 text-yellow-600 flex items-center justify-center">
                            <Layers size={14} />
                        </div>
                        <div>
                            <div className="font-bold text-[13px] text-slate-800">Chày gỗ (Plugs)</div>
                            <div className="text-[10px] text-slate-500">8 chày đi kèm khuôn</div>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition">
                        <FileEdit size={14} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
