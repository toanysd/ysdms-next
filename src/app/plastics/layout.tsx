'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Layers, Package, ClipboardList } from 'lucide-react'

export default function PlasticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/plastics/inventory', label: '在庫管理', icon: <Layers size={16} /> },
    { href: '/plastics/master', label: 'プラスチックM', icon: <Box size={16} /> },
    { href: '/plastics/receipts', label: '入荷', icon: <Package size={16} /> },
    { href: '/plastics/usage', label: '使用・ロス', icon: <ClipboardList size={16} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Box size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <h1 className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-jp)', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                プラスチック管理
              </h1>
            </div>
          </div>
          <div className="h-6 w-px bg-[var(--border-default)]"></div>
          <nav className="flex items-center gap-2">
            {navItems.map(item => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] transition-colors font-bold ${
                    active 
                      ? 'bg-[var(--accent)] text-white' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  {item.icon}
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
