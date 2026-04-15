"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Database, Box, FileText, Settings, Layers, Scissors, Truck, Users, Server, ClipboardList, BarChart3 } from 'lucide-react'

const MENU_ITEMS = [
  { href: '/dashboard', icon: Home, labelJA: 'ダッシュボード', labelVI: 'Dashboard' },
  { href: '/reports', icon: BarChart3, labelJA: 'レポート', labelVI: 'Báo cáo' },
  { href: '/order', icon: ClipboardList, labelJA: '受注・指示書', labelVI: 'Đơn Hàng / Chỉ Thị' },
  { href: '/master/customers', icon: Users, labelJA: '納入先マスター', labelVI: 'Khách Hàng/Giao Nhận' },
  { href: '/master/machine', icon: Server, labelJA: '設備マスター', labelVI: 'Máy Đúc (Machine)' },
  { href: '/master/plastic', icon: Box, labelJA: 'プラ材料マスター', labelVI: 'Danh mục Nhựa' },
  { href: '/master/mold', icon: Layers, labelJA: '金型マスター', labelVI: 'Danh mục Khuôn' },
  { href: '/master/cutter', icon: Scissors, labelJA: '刃物マスター', labelVI: 'Danh mục Dao Cắt' },
  { href: '/master/product', icon: FileText, labelJA: '製品マスター', labelVI: 'Danh mục Khay' },
  { href: '/inventory', icon: Database, labelJA: '在庫管理', labelVI: 'Quản lý Kho' },
  { href: '/production', icon: Truck, labelJA: '生産管理', labelVI: 'Sản xuất' },
  { href: '/settings', icon: Settings, labelJA: '設定', labelVI: 'Cài đặt' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[52px] hover:w-[200px] group bg-[var(--mcs-surface)] border-r border-[var(--mcs-border)] transition-all duration-200 z-50 flex flex-col flex-shrink-0 h-full overflow-hidden">
      <div className="h-[48px] flex items-center justify-center border-b border-[var(--mcs-border)]">
        <div className="font-bold text-[var(--mcs-primary)] text-xl w-[52px] text-center shrink-0">YSD</div>
        <div className="font-bold text-[var(--mcs-text)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ml-2">Manufacturing</div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                h-[44px] flex items-center shrink-0 relative
                hover:bg-[var(--mcs-surface-2)] transition-colors
                ${isActive ? 'bg-[var(--mcs-primary-light)]' : ''}
              `}
              title={`${item.labelJA} / ${item.labelVI}`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--mcs-primary)]" />
              )}
              <div className="w-[52px] flex justify-center shrink-0">
                <item.icon size={20} className={isActive ? "text-[var(--mcs-primary)]" : "text-[var(--mcs-text-muted)]"} />
              </div>
              <div className="flex flex-col justify-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[12px] font-bold text-[var(--mcs-text)]">{item.labelJA}</span>
                <span className="text-[10px] text-[var(--mcs-text-muted)] leading-tight">{item.labelVI}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
