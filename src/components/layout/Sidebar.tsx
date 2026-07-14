"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ClipboardEdit, Package, FileText, Truck, FileSpreadsheet,
  Wrench, PenTool, Scissors, Cog, Archive,
  Layers, ArrowDownUp,
  Factory, Calendar, Calculator, HardDriveDownload,
  ShieldCheck, AlertTriangle,
  Building2, Users, Server, Grid3X3,
  BarChart3, Settings, ChevronRight,
  Search, GanttChart, ExternalLink, Box, Columns3, Menu, X, Pin, DatabaseZap,
  Briefcase, ClipboardList, ScanLine, HardDriveDownload
} from 'lucide-react'

type NavItem = {
  href: string
  icon: React.ElementType
  labelJA: string
  labelVI: string
  exact?: boolean
}

type NavSection = {
  id: string
  icon: React.ElementType
  labelJA: string
  labelVI: string
  color: string
  items: NavItem[]
}

const NAV_TOP: NavItem[] = [
  { href: '/dashboard', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Dashboard' },
  { href: '/worklog', icon: ClipboardEdit, labelJA: '日報', labelVI: 'Nhật ký' },
]

const NAV_SECTIONS: NavSection[] = [
  // ── 1. Văn phòng (Office) ──────────────────────────────────────────
  {
    id: 'd1', icon: Building2, labelJA: 'オフィス', labelVI: 'Văn phòng', color: '#3B82F6',
    items: [
      { href: '/office', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Tổng quan', exact: true },
      { href: '/master/customers', icon: Users, labelJA: '得意先', labelVI: 'Khách hàng' },
      { href: '/master/products', icon: Package, labelJA: '製品マスター', labelVI: 'Sản phẩm' },
      { href: '/orders/quotations', icon: FileSpreadsheet, labelJA: '見積書', labelVI: 'Báo giá' },
      { href: '/orders', icon: FileText, labelJA: '受注・指示書', labelVI: 'Đơn hàng' },
      { href: '/orders/shipments', icon: Truck, labelJA: '出荷・納品', labelVI: 'Xuất hàng' },
      { href: '/mrp', icon: Calculator, labelJA: 'MRP', labelVI: 'MRP' },
      { href: '/production/orders?view=office', icon: ClipboardList, labelJA: '注文書／納入指示書', labelVI: 'Lệnh SX Khay' },
      { href: '/production/mold-orders', icon: Wrench, labelJA: '金型工程票', labelVI: 'Lệnh SX Khuôn' },
    ]
  },
  // ── 2. Phòng Thiết kế (Design Dept) ────────────────────────────────
  {
    id: 'd2', icon: PenTool, labelJA: '設計技術部', labelVI: 'Phòng Thiết kế', color: '#14B8A6',
    items: [
      { href: '/engineering', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Tổng quan', exact: true },
      { href: '/engineering/designs', icon: PenTool, labelJA: '設計版', labelVI: 'Phiên bản Thiết kế' },
      { href: '/equipment/materials', icon: Layers, labelJA: 'アルミブランク', labelVI: 'Phôi nhôm' },
    ]
  },
  // ── 3. Phòng Khuôn (Equipment / Die Dept) ──────────────────────
  {
    id: 'd3', icon: Wrench, labelJA: '設備・金型部', labelVI: 'Phòng Thiết bị & Khuôn', color: '#EA8C1C',
    items: [
      { href: '/equipment/dashboard', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Tổng quan', exact: true },
      { href: '/equipment/molds', icon: Box, labelJA: '金型実物', labelVI: 'Khuôn vật lý' },
      { href: '/equipment/jobs', icon: Briefcase, labelJA: 'ジョブ管理', labelVI: 'Quản lý Job' },
      { href: '/equipment/schedule', icon: GanttChart, labelJA: '工程計画', labelVI: 'Bảng Kế hoạch' },
      { href: '/equipment/cutting-dies', icon: Scissors, labelJA: '抜型', labelVI: 'Dao cắt (Die)' },
      { href: '/equipment/auxiliary', icon: Cog, labelJA: '補助設備', labelVI: 'TB phụ trợ' },
      { href: '/maintenance', icon: Wrench, labelJA: '保守・メンテ', labelVI: 'Bảo dưỡng' },
      { href: '/master/racks', icon: Grid3X3, labelJA: '棚管理', labelVI: 'Master Kệ chứa' },
      { href: '/equipment/lifecycle', icon: Archive, labelJA: '棚卸', labelVI: 'Kiểm kê' },
    ]
  },
  // ── 4. Phòng Định hình (Thermoforming Dept) ────────────────────────
  {
    id: 'd4', icon: Factory, labelJA: '成形部', labelVI: 'Phòng Định hình', color: '#8B5CF6',
    items: [
      { href: '/production/dashboard', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Tổng quan', exact: true },
      { href: '/production/planning', icon: Calendar, labelJA: '生産計画', labelVI: 'Kế hoạch SX' },
      { href: '/production/orders?view=factory', icon: ClipboardList, labelJA: '注文書／納入指示書', labelVI: 'Chỉ thị Khay' },
      { href: '/production/kanban', icon: Columns3, labelJA: '看板', labelVI: 'Kanban' },
      { href: '/production/floor', icon: Factory, labelJA: '実績入力', labelVI: 'Nhập thực tế' },
      { href: '/master/machines', icon: Server, labelJA: '機械・設備', labelVI: 'Master Máy móc' },
    ]
  },
  // ── 5. Phòng QC (Quality Control Dept) ─────────────────────────────
  {
    id: 'd5', icon: ShieldCheck, labelJA: '品質管理部', labelVI: 'Phòng QC', color: '#EF4444',
    items: [
      { href: '/quality', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Tổng quan', exact: true },
      { href: '/quality/inspections', icon: ScanLine, labelJA: '寸法検査', labelVI: 'KCS Đo đạc' },
      { href: '/quality/lot-inspections', icon: ShieldCheck, labelJA: 'ロット検査', labelVI: 'QC Lô / NG' },
      { href: '/quality/defects', icon: AlertTriangle, labelJA: '不良ダッシュボード', labelVI: 'Dashboard Lỗi' },
    ]
  },
  // ── 6. Quản lý Vật tư (Material Dept) ─────────────────────────────
  {
    id: 'd6', icon: Package, labelJA: '資材管理', labelVI: 'Quản lý Vật tư', color: '#EAB308',
    items: [
      { href: '/materials', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Tổng quan', exact: true },
      { href: '/plastics/master', icon: Layers, labelJA: '樹脂マスター', labelVI: 'Master Nhựa' },
      { href: '/plastics/inventory', icon: Archive, labelJA: '樹脂在庫', labelVI: 'Kiểm kê Nhựa' },
      { href: '/materials/daily', icon: ArrowDownUp, labelJA: '入出庫', labelVI: 'Nhập xuất kho' },
    ]
  },
]

const NAV_BOTTOM: NavItem[] = [
  { href: '/reports', icon: BarChart3, labelJA: 'レポート', labelVI: 'Báo cáo', exact: true },
  { href: '/reports/daily-worklog', icon: ClipboardEdit, labelJA: '日報記録書', labelVI: 'Nippo' },
  { href: '/admin/ingest', icon: DatabaseZap, labelJA: 'データ取込', labelVI: 'Nhập DL tự động' },
  { href: '/settings', icon: Settings, labelJA: '設定', labelVI: 'Cài đặt' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [manuallyOpened, setManuallyOpened] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const isSidebarOpen = isHovered || isPinned

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
  }

  const activeSectionId = NAV_SECTIONS.find(s =>
    s.items.some(item => isActive(item.href, item.exact))
  )?.id

  const openSectionId = manuallyOpened !== null ? manuallyOpened : activeSectionId

  const toggleSection = (id: string) => {
    setManuallyOpened(prev => {
      const current = prev !== null ? prev : activeSectionId;
      return current === id ? '' : id;
    })
  }

  const isSectionOpen = (id: string) => openSectionId === id

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex flex-col transition-all duration-300 z-50 shrink-0 h-full overflow-hidden ${isSidebarOpen ? 'w-[240px]' : 'w-[56px]'}`}
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-default)',
      }}
    >
      {/* Logo & Toggle */}
      <div
        className="h-[48px] flex items-center justify-between px-3 shrink-0 overflow-hidden"
        style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--accent)' }}
      >
        <div className="flex items-center">
          <button 
            onClick={() => setIsPinned(!isPinned)}
            className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
            title={isPinned ? "Bỏ ghim (Tự động ẩn)" : "Ghim Sidebar"}
          >
            <Pin size={18} className={isPinned ? 'fill-white' : ''} style={{ transform: isPinned ? 'none' : 'rotate(45deg)' }} />
          </button>
          
          <div className={`flex flex-col ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white font-bold text-[13px] leading-tight whitespace-nowrap">YSDMS</span>
            <span className="text-white/80 text-[10px] leading-tight whitespace-nowrap">NextGen v2.0</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Top pinned: Dashboard, 日報 */}
        <div className="flex flex-col gap-0.5 mb-1">
          {NAV_TOP.map(item => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? 'nav-item--active' : ''}`}
                title={`${item.labelJA} / ${item.labelVI}`}
              >
                <div className="w-[32px] flex justify-center shrink-0">
                  <item.icon size={16} style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
                </div>
                <div className={`flex flex-col justify-center whitespace-nowrap ml-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-[12px] font-semibold leading-tight" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                    {item.labelJA}
                  </span>
                  <span className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                    {item.labelVI}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mx-3 my-1" style={{ borderTop: '1px solid var(--border-subtle)' }} />

        {/* Domain sections */}
        <div className="flex flex-col gap-[2px] flex-1">
          {NAV_SECTIONS.map(section => {
            const open = isSectionOpen(section.id)
            const hasActiveChild = section.items.some(item => isActive(item.href, item.exact))

            return (
              <div key={section.id} className="flex flex-col">
                {/* ===== PARENT HEADER ===== */}
                <button
                  onClick={() => {
                    toggleSection(section.id)
                    if (!isSidebarOpen) setIsPinned(true)
                  }}
                  className="nav-item w-full"
                  title={`${section.labelJA} / ${section.labelVI}`}
                  style={{
                    background: open && isSidebarOpen ? 'var(--bg-surface-2)' : undefined,
                  }}
                >
                  {/* Colored dot indicator (visible in collapsed mode) */}
                  <div className="w-[32px] flex justify-center shrink-0 relative">
                    <section.icon size={16} style={{ color: hasActiveChild ? section.color : 'var(--text-muted)' }} />
                    {!isSidebarOpen && hasActiveChild && (
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[16px] rounded-l-full"
                        style={{ background: section.color }}
                      />
                    )}
                  </div>
                  <div className={`flex-1 flex items-center justify-between whitespace-nowrap ml-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-[3px] h-[14px] rounded-full shrink-0"
                        style={{ background: section.color }}
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-[12px] font-bold leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                          {section.labelJA}
                        </span>
                        <span className="text-[9px] font-medium leading-tight" style={{ color: 'var(--text-secondary)' }}>
                          {section.labelVI}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      style={{ color: 'var(--text-muted)' }}
                      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>

                {/* ===== CHILDREN ===== */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${open && isSidebarOpen ? 'grid-rows-[1fr] opacity-100 mt-[2px] mb-2' : 'grid-rows-[0fr] opacity-0 mt-0 mb-0'}`}
                >
                  <div className="overflow-hidden flex flex-col gap-[2px] relative">
                    {/* Vertical connecting line */}
                    <div 
                      className="absolute top-0 bottom-[18px] w-[1px]" 
                      style={{ left: 32, background: section.color, opacity: 0.3 }}
                    />
                    
                    {section.items.map(item => {
                      const active = isActive(item.href, item.exact)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`nav-item relative ${active ? 'nav-item--active' : ''}`}
                          style={{ paddingLeft: '36px' }}
                        >
                          {/* Horizontal connecting branch */}
                          <div 
                            className="absolute top-1/2 h-[1px] -translate-y-1/2"
                            style={{ left: 26, width: 10, background: section.color, opacity: active ? 1 : 0.3 }}
                          />
                          
                          <div className="w-[24px] flex justify-center shrink-0">
                            <item.icon size={14} style={{ color: active ? section.color : 'var(--text-muted)' }} />
                          </div>
                          <div className="flex flex-col justify-center whitespace-nowrap ml-2">
                            <span className="text-[11px] font-semibold leading-tight" style={{ color: active ? section.color : 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                              {item.labelJA}
                            </span>
                            <span className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                              {item.labelVI}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom pinned: Reports, Settings */}
        <div className="mx-3 my-1" style={{ borderTop: '1px solid var(--border-subtle)' }} />
        <div className="flex flex-col gap-0.5 mt-1">
          {NAV_BOTTOM.map(item => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? 'nav-item--active' : ''}`}
                title={`${item.labelJA} / ${item.labelVI}`}
              >
                <div className="w-[32px] flex justify-center shrink-0">
                  <item.icon size={16} style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
                </div>
                <div className={`flex flex-col justify-center whitespace-nowrap ml-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-[12px] font-semibold leading-tight" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                    {item.labelJA}
                  </span>
                  <span className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                    {item.labelVI}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
