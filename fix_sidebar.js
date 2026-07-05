const fs = require('fs');
let c = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const correct = `const NAV_SECTIONS: NavSection[] = [
  {
    id: 'd1', icon: Package, labelJA: '受注', labelVI: 'Đơn hàng', color: '#3B82F6',
    items: [
      { href: '/orders/products', icon: Package, labelJA: '製品マスター', labelVI: 'Sản phẩm' },
      { href: '/orders/quotations', icon: FileSpreadsheet, labelJA: '見積書', labelVI: 'Báo giá' },
      { href: '/orders', icon: FileText, labelJA: '受注・指示書', labelVI: 'Đơn hàng' },
      { href: '/orders/shipments', icon: Truck, labelJA: '出荷・納品', labelVI: 'Xuất hàng' },
    ]
  },
  {
    id: 'd3', icon: Wrench, labelJA: '金型', labelVI: 'Khuôn & Dao', color: '#F59E0B',
    items: [
      { href: '/tooling/designs', icon: PenTool, labelJA: '設計案件', labelVI: 'Thiết kế' },
      { href: '/tooling/molds', icon: Wrench, labelJA: '金型', labelVI: 'Khuôn' },
      { href: '/tooling/cutters', icon: Scissors, labelJA: '抜型', labelVI: 'Dao cắt' },
      { href: '/tooling/auxiliary', icon: Cog, labelJA: '補助設備', labelVI: 'TB phụ trợ' },
      { href: '/tooling/aluminum', icon: Layers, labelJA: 'アルミブランク', labelVI: 'Phôi nhôm' },
      { href: '/tooling/lifecycle', icon: Archive, labelJA: '棚卸・管理', labelVI: 'Kiểm kê' },
    ]
  },
  {
    id: 'd4', icon: Layers, labelJA: '材料', labelVI: 'Vật liệu', color: '#10B981',
    items: [
      { href: '/materials', icon: Layers, labelJA: '在庫', labelVI: 'Tồn kho' },
      { href: '/materials/daily', icon: ArrowDownUp, labelJA: '日次入出庫', labelVI: 'Nhập xuất ngày' },
    ]
  },
  {
    id: 'd2', icon: Factory, labelJA: '生産', labelVI: 'Sản xuất', color: '#8B5CF6',
    items: [
      { href: '/production', icon: Calendar, labelJA: '計画', labelVI: 'Kế hoạch' },
      { href: '/production/mrp', icon: Calculator, labelJA: 'MRP', labelVI: 'MRP' },
      { href: '/production/orders', icon: HardDriveDownload, labelJA: '生産指示', labelVI: 'Lệnh SX' },
      { href: '/production/floor', icon: Factory, labelJA: '成形現場', labelVI: 'Xưởng' },
    ]
  },
  {
    id: 'd5', icon: ShieldCheck, labelJA: '品質', labelVI: 'Chất lượng', color: '#EF4444',
    items: [
      { href: '/quality', icon: ShieldCheck, labelJA: '検査', labelVI: 'Kiểm tra' },
      { href: '/quality/defects', icon: AlertTriangle, labelJA: '不良報告', labelVI: 'Báo cáo lỗi' },
    ]
  },
  {
    id: 'd7', icon: Building2, labelJA: 'マスター', labelVI: 'Master', color: '#6B7280',
    items: [
      { href: '/master', icon: Building2, labelJA: '会社・得意先', labelVI: 'Công ty & KH' },
      { href: '/master/employees', icon: Users, labelJA: '従業員', labelVI: 'Nhân viên' },
      { href: '/master/machines', icon: Server, labelJA: '機械・設備', labelVI: 'Máy móc' },
      { href: '/master/racks', icon: Grid3X3, labelJA: '棚', labelVI: 'Giá khuôn' },
    ]
  },
]
`;

const startIdx = c.indexOf('const NAV_SECTIONS');
const endIdx = c.indexOf('const NAV_BOTTOM');
if (startIdx > -1 && endIdx > -1) {
    c = c.slice(0, startIdx) + correct + '\n' + c.slice(endIdx);
    fs.writeFileSync('src/components/layout/Sidebar.tsx', c, 'utf8');
    console.log('Fixed Sidebar!');
} else {
    console.log('Failed to find bounds.');
}
