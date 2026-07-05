'use client'

import React, { useState } from 'react'

type Tab = 'WORKFLOW' | 'DATABASE' | 'TABLE_DICT' | 'GUIDE'

export default function DocsViewer() {
  const [activeTab, setActiveTab] = useState<Tab>('WORKFLOW')

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Tabs Nav */}
      <div className="flex bg-white border-b border-slate-200 px-6 shrink-0 overflow-x-auto custom-scrollbar">
        <TabButton active={activeTab === 'WORKFLOW'} onClick={() => setActiveTab('WORKFLOW')} title="Luồng Nghiệp Vụ (Workflow)" icon="🔄" />
        <TabButton active={activeTab === 'DATABASE'} onClick={() => setActiveTab('DATABASE')} title="Cấu Trúc CSDL (ERD)" icon="🗄️" />
        <TabButton active={activeTab === 'TABLE_DICT'} onClick={() => setActiveTab('TABLE_DICT')} title="Từ Điển Các Bảng (Dictionary)" icon="📚" />
        <TabButton active={activeTab === 'GUIDE'} onClick={() => setActiveTab('GUIDE')} title="Quy Trình Nhập Liệu" icon="📝" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'WORKFLOW' && <WorkflowTab />}
          {activeTab === 'DATABASE' && <ERDTab />}
          {activeTab === 'TABLE_DICT' && <TableDictionaryTab />}
          {activeTab === 'GUIDE' && <GuideTab />}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, title, icon }: { active: boolean, onClick: () => void, title: string, icon: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-12 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
        active ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      }`}
    >
      <span>{icon}</span>
      <span>{title}</span>
    </button>
  )
}

function WorkflowTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
          Chuỗi Giá Trị "Product-Centric" YSDMS
        </h2>
        
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <h3 className="font-bold text-blue-700 mb-2">1. Giai đoạn Kinh Doanh (Sales / Orders)</h3>
            <p className="text-sm text-slate-600 mb-4">Mọi luồng dữ liệu bắt đầu từ Khách hàng. Sales nhận yêu cầu tạo Khay mới hoặc sản xuất lại Khay cũ.</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white px-3 py-1 rounded-full border border-slate-300 font-mono text-slate-700">Tạo Khay (product_master)</span>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-300 font-mono text-slate-700">Chọn Khách Hàng (customers)</span>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10"><span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs font-bold">Chuyển Hồ Sơ</span></div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
            <h3 className="font-bold text-indigo-700 mb-2">2. Giai đoạn Thiết Kế Kỹ Thuật (Engineering)</h3>
            <p className="text-sm text-slate-600 mb-4">Kỹ sư tiếp nhận Khay, lên bản vẽ, tính toán vật liệu. Chốt các thông số Khuôn gốc (Base) và Phiên bản (Revision).</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-mono">Định nghĩa Khuôn (mold_base)</span>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-mono">Bản vẽ (mold_design_revision)</span>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-mono">Định mức Nhựa (mold_plastic_bom)</span>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10"><span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-bold">Duyệt & Ra Lệnh</span></div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
            <h3 className="font-bold text-teal-700 mb-2">3. Kế Hoạch & Chuẩn Bị (Planning & Prep)</h3>
            <p className="text-sm text-slate-600 mb-4">Lập kế hoạch sản xuất, xếp lịch máy, kiểm tra tồn kho nhựa. Đồng thời, bộ phận kho Khuôn gia công Khuôn thực tế.</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200 font-mono">Gia công Khuôn Vật Lý (mold_physical)</span>
              <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200 font-mono">Kiểm tra Nhựa (plastic_roll)</span>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Thực thi tại xưởng</span></div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <h3 className="font-bold text-emerald-700 mb-2">4. Sản Xuất Định Hình (Mass Production)</h3>
            <p className="text-sm text-slate-600 mb-4">Khuôn được lắp lên máy, cấp nhựa. Công nhân chạy máy, ghi nhận sản lượng OK/NG.</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-mono">Ghi nhận năng suất (production_logs)</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-mono">Tiêu hao nhựa (inventory_txn)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ERDTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
          Sơ đồ Thực Thể Liên Kết (Core ERD)
        </h2>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Column 1: Product */}
            <div className="flex flex-col gap-4">
              <TableNode name="product_master" type="MASTER" color="indigo" fields={["id (PK)", "code", "customer_part_number", "customer_id", "name"]} />
              <TableNode name="customers" type="MASTER" color="slate" fields={["id (PK)", "customer_code", "name"]} />
            </div>

            {/* Column 2: Bridge */}
            <div className="flex flex-col gap-4 items-center">
              <div className="w-16 border-t-2 border-dashed border-indigo-300"></div>
              <TableNode name="product_mold_map" type="BRIDGE" color="blue" fields={["id (PK)", "product_id (FK)", "revision_id (FK)"]} />
              <div className="w-16 border-t-2 border-dashed border-teal-300"></div>
            </div>

            {/* Column 3: Design / Revisions */}
            <div className="flex flex-col gap-4">
              <TableNode name="mold_base" type="CORE" color="teal" fields={["id (PK)", "code", "customer_id"]} />
              <div className="h-4 border-l-2 border-teal-300 mx-auto"></div>
              <TableNode name="mold_design_revision" type="CORE" color="teal" fields={["id (PK)", "mold_base_id (FK)", "revision_code", "specs..."]} />
              <div className="flex justify-between px-8">
                <div className="h-4 border-l-2 border-teal-300"></div>
                <div className="h-4 border-l-2 border-teal-300"></div>
              </div>
              <div className="flex gap-2">
                <TableNode name="mold_plastic_bom" type="BOM" color="amber" fields={["revision_id", "plastic_id"]} />
                <TableNode name="mold_cutter_config" type="BOM" color="amber" fields={["revision_id", "cutter_id"]} />
              </div>
            </div>

            {/* Column 4: Physical Assets */}
            <div className="flex flex-col gap-4 items-center">
              <div className="w-16 border-t-2 border-dashed border-teal-300"></div>
            </div>

            {/* Column 5: Inventory */}
            <div className="flex flex-col gap-4">
              <TableNode name="mold_physical" type="ASSET" color="emerald" fields={["id (PK)", "revision_id (FK)", "physical_code", "status", "rack_layer_id"]} />
              <div className="h-4 border-l-2 border-slate-300 mx-auto"></div>
              <TableNode name="racks / rack_layers" type="LOCATION" color="slate" fields={["id", "rack_id", "code"]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableNode({ name, type, color, fields }: { name: string, type: string, color: string, fields: string[] }) {
  const bgHeader = `bg-${color}-600`
  const bgBody = `bg-${color}-50`
  const borderColor = `border-${color}-200`
  const textHeader = `text-white`
  
  return (
    <div className={`border ${borderColor} rounded-lg overflow-hidden shadow-sm min-w-[200px]`}>
      <div className={`${bgHeader} ${textHeader} font-bold p-2 text-[11px] flex justify-between items-center`}>
        <span>{name}</span>
        <span className="opacity-70 text-[9px]">{type}</span>
      </div>
      <div className={`${bgBody} p-2 text-[10px] font-mono text-slate-700 flex flex-col gap-1`}>
        {fields.map((f, i) => <div key={i} className="border-b border-black/5 pb-0.5">{f}</div>)}
      </div>
    </div>
  )
}

function TableDictionaryTab() {
  const tables = [
    { name: 'product_master', role: 'Sản Phẩm (Khay)', desc: 'Chứa định danh khay (Tray). Đại diện cho cái mà khách hàng mua. VD: IRI-003, JAE-001 Tray.' },
    { name: 'mold_base', role: 'Khuôn Gốc', desc: 'Đại diện cho 1 bộ khuôn về mặt khái niệm (Family). Thường dùng làm mã chung (Base Code) chưa tính đến các phiên bản (R1, R2).' },
    { name: 'mold_design_revision', role: 'Bản Vẽ Thiết Kế', desc: 'TRÁI TIM của hệ thống. Chứa toàn bộ thông số kỹ thuật (Kích thước, Số pocket, Bản vẽ). 1 Mold Base có thể có nhiều Revision.' },
    { name: 'product_mold_map', role: 'Cầu nối Khay - Khuôn', desc: 'Bảng N:N. Kết nối 1 Khay với 1 (hoặc nhiều) Bản Vẽ Khuôn. Cho phép 1 Khuôn có thể đúc ra nhiều loại Khay khác nhau.' },
    { name: 'mold_physical', role: 'Khuôn Vật Lý (Tài Sản)', desc: 'Khối kim loại thực tế đang nằm trên kệ. Chứa thông tin vị trí lưu kho, mạ Teflon, trạng thái hỏng hóc. Tham chiếu tới 1 Revision.' },
    { name: 'plastic_master', role: 'Danh Mục Nhựa', desc: 'Định nghĩa các loại nhựa: PS, PET, độ dày, chiều rộng.' },
    { name: 'plastic_roll', role: 'Cuộn Nhựa Thực Tế', desc: 'Từng cuộn nhựa cụ thể (có QR code riêng, trọng lượng tịnh). Dùng cho WMS.' },
    { name: 'inventory_txn', role: 'Lịch Sử Xuất Nhập Nhựa', desc: 'Ghi nhận lượng nhựa tiêu hao mỗi lần chạy máy hoặc xuất kho.' },
    { name: 'mold_plastic_bom', role: 'Định Mức (BOM)', desc: 'Xác định: Bản vẽ (Revision) này khi chạy sẽ dùng Loại Nhựa nào (plastic_master), tỷ lệ hao hụt bao nhiêu.' },
  ]

  return (
    <div className="space-y-4">
      {tables.map((t, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="w-64 font-mono font-bold text-indigo-700 bg-indigo-50 p-2 rounded text-sm shrink-0">
              {t.name}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{t.role}</h4>
              <p className="text-slate-600 text-sm">{t.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function GuideTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
          Hướng Dẫn Nhập Liệu Chuẩn
        </h2>
        
        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <h3 className="font-bold text-blue-800 mb-2">Bước 1: Kinh Doanh (Tạo Khay)</h3>
            <p>Vào menu <strong>Quản lý Khay</strong>. Điền Mã Khay, Tên Khay, Khách hàng. Thao tác này lưu vào <code>product_master</code>.</p>
          </div>
          
          <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
            <h3 className="font-bold text-indigo-800 mb-2">Bước 2: Thiết Kế (Khai Báo Khuôn)</h3>
            <p>Trong cùng Form đó, chuyển qua Tab <strong>Hồ sơ Thiết kế</strong>. Điền Mã Khuôn dự kiến. Khi bấm Lưu, hệ thống tự động sinh <code>mold_base</code> và <code>mold_design_revision</code>, tự động liên kết chúng qua <code>product_mold_map</code>.</p>
          </div>

          <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg">
            <h3 className="font-bold text-emerald-800 mb-2">Bước 3: Gia Công (Tạo Khuôn Thực)</h3>
            <p>Xưởng Khuôn tiến hành gia công. Khi gia công xong mảnh kim loại, vào kho Khuôn (Warehouse), tạo <code>mold_physical</code>, dán mã QR, và gán nó vào <code>revision_id</code> tương ứng để đem đi sản xuất.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
