"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ClipboardEdit, DatabaseZap,
  Briefcase, FileText, FileSpreadsheet, Receipt, CreditCard, Truck, Calculator,
  PenTool, Layers, Box,
  LayoutDashboard, Settings, CalendarRange, GanttChart, ClipboardList, Scissors,
  MapPin, ArrowLeftRight, Archive, ScanLine, Wrench,
  Columns3, Factory, Server,
  TrendingUp, ShieldCheck, AlertTriangle,
  Package,
  Database, Pin, ChevronRight
} from 'lucide-react'
import { useTranslations } from 'next-intl'

type NavItem = {
  href: string
  icon: React.ElementType
  tKey: string
  exact?: boolean
}

type NavSection = {
  id: string
  icon: React.ElementType
  tKey: string
  color: string
  items: NavItem[]
}

const NAV_TOP: NavItem[] = [
  { href: '/dashboard', icon: Home, tKey: 'top.dashboard' },
  { href: '/worklogs', icon: ClipboardEdit, tKey: 'top.worklogs' },
  { href: '/product-center', icon: DatabaseZap, tKey: 'top.productCenter' },
]

const NAV_SECTIONS: NavSection[] = [
  // ── 1. 営業・管理 (Văn phòng / Kinh doanh) ───────────────────────────
  {
    id: 'business', icon: Briefcase, tKey: 'sections.business', color: '#3B82F6',
    items: [
      { href: '/cases', icon: Briefcase, tKey: 'items.cases' },
      { href: '/orders', icon: FileText, tKey: 'items.orders' },
      { href: '/orders/quotations', icon: FileSpreadsheet, tKey: 'items.quotations' },
      { href: '/orders/invoices', icon: Receipt, tKey: 'items.invoices' },
      { href: '/orders/debt', icon: CreditCard, tKey: 'items.debt' },
      { href: '/shipments', icon: Truck, tKey: 'items.shipments' },
      { href: '/mrp', icon: Calculator, tKey: 'items.mrp' },
    ]
  },
  // ── 2. 設計部 (Phòng Thiết kế) ───────────────────────────────────────
  {
    id: 'design', icon: PenTool, tKey: 'sections.design', color: '#14B8A6',
    items: [
      { href: '/engineering', icon: PenTool, tKey: 'items.cadDesigns', exact: true },
      { href: '/engineering/designs', icon: Layers, tKey: 'items.designs' },
      { href: '/equipment/aluminum', icon: Box, tKey: 'items.aluminum' },
    ]
  },
  // ── 3. 金型部 (Phòng Khuôn) ──────────────────────────────────────────
  {
    id: 'equipment', icon: Wrench, tKey: 'sections.equipment', color: '#EA8C1C',
    items: [
      { href: '/equipment/dashboard', icon: LayoutDashboard, tKey: 'items.moldDashboard', exact: true },
      { href: '/equipment/unified', icon: Layers, tKey: 'items.equipmentUnified' },
      { href: '/equipment/molds', icon: Box, tKey: 'items.molds' },
      { href: '/equipment/jobs', icon: Settings, tKey: 'items.jobs' },
      { href: '/equipment/schedule', icon: CalendarRange, tKey: 'items.moldSchedule' },
      { href: '/production/mold-orders', icon: ClipboardList, tKey: 'items.moldOrders' },
      { href: '/equipment/cutting-dies', icon: Scissors, tKey: 'items.cuttingDies' },
      { href: '/equipment/locations', icon: MapPin, tKey: 'items.locations' },
      { href: '/equipment/loans', icon: ArrowLeftRight, tKey: 'items.loans' },
      { href: '/equipment/lifecycle', icon: Archive, tKey: 'items.lifecycle' },
      { href: '/equipment/scan', icon: ScanLine, tKey: 'items.scan' },
      { href: '/maintenance', icon: Wrench, tKey: 'items.maintenance' },
    ]
  },
  // ── 4. 成形部 (Phòng Định hình / Dập) ─────────────────────────────────
  {
    id: 'thermoforming', icon: Factory, tKey: 'sections.thermoforming', color: '#8B5CF6',
    items: [
      { href: '/production/work-orders', icon: ClipboardList, tKey: 'items.workOrders' },
      { href: '/production/schedule', icon: GanttChart, tKey: 'items.productionSchedule' },
      { href: '/production/kanban', icon: Columns3, tKey: 'items.kanban' },
      { href: '/production/floor', icon: Factory, tKey: 'items.floor' },
      { href: '/production-instructions', icon: FileText, tKey: 'items.productionInstructions' },
      { href: '/master/machines', icon: Server, tKey: 'items.machines' },
    ]
  },
  // ── 5. 品質部 (Phòng QC) ─────────────────────────────────────────────
  {
    id: 'quality', icon: ShieldCheck, tKey: 'sections.quality', color: '#EF4444',
    items: [
      { href: '/quality/ng-trends', icon: TrendingUp, tKey: 'items.ngTrends' },
      { href: '/quality/inspection', icon: ScanLine, tKey: 'items.inspections' },
      { href: '/quality/lot-inspections', icon: ShieldCheck, tKey: 'items.lotInspections' },
      { href: '/quality/defects', icon: AlertTriangle, tKey: 'items.defects' },
    ]
  },
  // ── 6. 資材・物流 (Vật tư & Kho) ─────────────────────────────────────
  {
    id: 'materials', icon: Package, tKey: 'sections.materials', color: '#EAB308',
    items: [
      { href: '/inventory', icon: Package, tKey: 'items.inventory' },
      { href: '/plastics/inventory', icon: Archive, tKey: 'items.plasticsInventory' },
      { href: '/plastics/master', icon: Layers, tKey: 'items.plasticsMaster' },
    ]
  },
]

const NAV_BOTTOM: NavItem[] = [
  { href: '/reports/daily-worklog', icon: ClipboardEdit, tKey: 'bottom.dailyWorklog' },
  { href: '/master', icon: Database, tKey: 'items.master', exact: true },
]

export default function Sidebar() {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const [manuallyOpened, setManuallyOpened] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const isSidebarOpen = isHovered || isPinned

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    const base = href.split('?')[0]
    return pathname === base || (base !== '/' && pathname.startsWith(base + '/'))
  }

  const activeSectionId = NAV_SECTIONS.find(s =>
    s.items.some(item => isActive(item.href, item.exact))
  )?.id

  const openSectionId = manuallyOpened !== null ? manuallyOpened : activeSectionId

  const toggleSection = (id: string) => {
    setManuallyOpened(prev => {
      const current = prev !== null ? prev : activeSectionId
      return current === id ? '' : id
    })
  }

  const isSectionOpen = (id: string) => openSectionId === id

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex flex-col transition-all duration-300 z-50 shrink-0 h-full overflow-hidden ${isSidebarOpen ? 'w-[240px]' : 'w-[56px]'}`}
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-default)' }}
    >
      {/* Logo & Pin */}
      <div
        className="h-[48px] flex items-center justify-between px-3 shrink-0 overflow-hidden"
        style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--accent)' }}
      >
        <div className="flex items-center">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
            title={isPinned ? t('unpin') : t('pinSidebar')}
          >
            <Pin size={18} className={isPinned ? 'fill-white' : ''} style={{ transform: isPinned ? 'none' : 'rotate(45deg)' }} />
          </button>
          <div className={`flex flex-col ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white font-bold text-[13px] leading-tight whitespace-nowrap">YSDMS</span>
            <span className="text-white/80 text-[10px] leading-tight whitespace-nowrap">NextGen v3.0</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">

        {/* Top: Dashboard, 日報, 製品センター */}
        <div className="flex flex-col gap-0.5 mb-1">
          {NAV_TOP.map(item => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href}
                className={`nav-item ${active ? 'nav-item--active' : ''}`}
                title={t(item.tKey)}
              >
                <div className="w-[32px] flex justify-center shrink-0">
                  <item.icon size={16} style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
                </div>
                <div className={`flex flex-col justify-center whitespace-nowrap ml-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-[12px] font-semibold leading-tight" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t(item.tKey)}</span>
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
                <button
                  onClick={() => { toggleSection(section.id); if (!isSidebarOpen) setIsPinned(true) }}
                  className="nav-item w-full"
                  title={t(section.tKey)}
                  style={{ background: open && isSidebarOpen ? 'var(--bg-surface-2)' : undefined }}
                >
                  <div className="w-[32px] flex justify-center shrink-0 relative">
                    <section.icon size={16} style={{ color: hasActiveChild ? section.color : 'var(--text-muted)' }} />
                    {!isSidebarOpen && hasActiveChild && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[16px] rounded-l-full"
                        style={{ background: section.color }} />
                    )}
                  </div>
                  <div className={`flex-1 flex items-center justify-between whitespace-nowrap ml-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-[3px] h-[14px] rounded-full shrink-0" style={{ background: section.color }} />
                      <div className="flex flex-col text-left">
                        <span className="text-[12px] font-bold leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t(section.tKey)}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)' }}
                      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${open && isSidebarOpen ? 'grid-rows-[1fr] opacity-100 mt-[2px] mb-2' : 'grid-rows-[0fr] opacity-0 mt-0 mb-0'}`}>
                  <div className="overflow-hidden flex flex-col gap-[2px] relative">
                    <div className="absolute top-0 bottom-[18px] w-[1px]"
                      style={{ left: 32, background: section.color, opacity: 0.3 }} />
                    {section.items.map(item => {
                      const active = isActive(item.href, item.exact)
                      return (
                        <Link key={item.href} href={item.href}
                          className={`nav-item relative ${active ? 'nav-item--active' : ''}`}
                          style={{ paddingLeft: '36px' }}
                        >
                          <div className="absolute top-1/2 h-[1px] -translate-y-1/2"
                            style={{ left: 26, width: 10, background: section.color, opacity: active ? 1 : 0.3 }} />
                          <div className="w-[24px] flex justify-center shrink-0">
                            <item.icon size={14} style={{ color: active ? section.color : 'var(--text-muted)' }} />
                          </div>
                          <div className="flex flex-col justify-center whitespace-nowrap ml-2">
                            <span className="text-[11px] font-semibold leading-tight" style={{ color: active ? section.color : 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t(item.tKey)}</span>
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

        {/* Bottom: Reports, Master */}
        <div className="mx-3 my-1" style={{ borderTop: '1px solid var(--border-subtle)' }} />
        <div className="flex flex-col gap-0.5 mt-1">
          {NAV_BOTTOM.map(item => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href}
                className={`nav-item ${active ? 'nav-item--active' : ''}`}
                title={t(item.tKey)}
              >
                <div className="w-[32px] flex justify-center shrink-0">
                  <item.icon size={16} style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
                </div>
                <div className={`flex flex-col justify-center whitespace-nowrap ml-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-[12px] font-semibold leading-tight" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t(item.tKey)}</span>
                </div>
              </Link>
            )
          })}
        </div>

      </nav>
    </aside>
  )
}
