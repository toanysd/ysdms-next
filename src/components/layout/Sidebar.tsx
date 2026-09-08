"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Briefcase, FileText, Factory, ClipboardList, ClipboardEdit, ShieldCheck,
  Wrench, DatabaseZap, Box, PenTool, Cog, Truck, Package, Layers, Calculator,
  Database, Settings, ChevronRight, Pin
} from 'lucide-react'

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
]

const NAV_SECTIONS: NavSection[] = [
  // ── 1. 営業・受注 (Business) ──────────────────────────────────────────
  {
    id: 'business', icon: Briefcase, tKey: 'sections.business', color: '#3B82F6',
    items: [
      { href: '/cases', icon: Briefcase, tKey: 'items.cases' },
      { href: '/orders', icon: FileText, tKey: 'items.orders' },
    ]
  },
  // ── 2. 生産管理 (Production) ──────────────────────────────────────────
  {
    id: 'production', icon: Factory, tKey: 'sections.production', color: '#8B5CF6',
    items: [
      { href: '/production/work-orders', icon: ClipboardList, tKey: 'items.workOrders' },
      { href: '/worklogs', icon: ClipboardEdit, tKey: 'items.worklogs' },
      { href: '/quality', icon: ShieldCheck, tKey: 'items.quality' },
    ]
  },
  // ── 3. 金型・設備 (Equipment) ─────────────────────────────────────────
  {
    id: 'equipment', icon: Wrench, tKey: 'sections.equipment', color: '#EA8C1C',
    items: [
      { href: '/product-center', icon: DatabaseZap, tKey: 'items.productCenter' },
      { href: '/equipment', icon: Box, tKey: 'items.equipment' },
      { href: '/engineering', icon: PenTool, tKey: 'items.cadDesigns' },
      { href: '/maintenance', icon: Cog, tKey: 'items.maintenance' },
    ]
  },
  // ── 4. 出荷・在庫 (Logistics) ─────────────────────────────────────────
  {
    id: 'logistics', icon: Truck, tKey: 'sections.logistics', color: '#10B981',
    items: [
      { href: '/shipments', icon: Truck, tKey: 'items.shipments' },
      { href: '/inventory', icon: Package, tKey: 'items.inventory' },
    ]
  },
  // ── 5. 原材料・資材 (Materials) ───────────────────────────────────────
  {
    id: 'materials', icon: Layers, tKey: 'sections.materials', color: '#EAB308',
    items: [
      { href: '/plastics', icon: Layers, tKey: 'items.plastics' },
      { href: '/mrp', icon: Calculator, tKey: 'items.mrp' },
    ]
  },
  // ── 6. システム管理 (System) ─────────────────────────────────────────
  {
    id: 'system', icon: Settings, tKey: 'sections.system', color: '#64748B',
    items: [
      { href: '/master', icon: Database, tKey: 'items.master' },
      { href: '/settings', icon: Settings, tKey: 'items.settings' },
    ]
  },
]

import { useTranslations } from 'next-intl'

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
            <span className="text-white/80 text-[10px] leading-tight whitespace-nowrap">NextGen v2.0</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">

        {/* Top: Dashboard, 日報 */}
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
      </nav>
    </aside>
  )
}
