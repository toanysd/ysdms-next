"use client"
import React from 'react'
import { Menu, Filter, QrCode, Images, Camera } from 'lucide-react'

export default function MobileNavbar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#dde1e7] z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      
      {/* 1. Menu */}
      <button className="flex flex-col items-center justify-center w-16 h-full text-[var(--mcs-text-secondary)] hover:text-[var(--mcs-primary)]">
        <Menu size={22} className="mb-1" />
        <span className="text-[10px] font-bold">Menu</span>
      </button>

      {/* 2. Filter */}
      <button 
        onClick={() => window.dispatchEvent(new Event('open-filter'))}
        className="flex flex-col items-center justify-center w-16 h-full text-[var(--mcs-text-secondary)] hover:text-[var(--mcs-primary)] relative"
      >
        <Filter size={22} className="mb-1" />
        <span className="text-[10px] font-bold">絞込</span>
      </button>

      {/* 3. QR Scan (Center FAB) */}
      <div className="relative w-16 h-full flex justify-center">
        <button className="absolute -top-6 w-[56px] h-[56px] rounded-full bg-[var(--mcs-primary)] text-white flex items-center justify-center shadow-lg border-4 border-white transition-transform active:scale-95">
          <QrCode size={26} />
        </button>
      </div>

      {/* 4. Photos */}
      <button className="flex flex-col items-center justify-center w-16 h-full text-[var(--mcs-text-secondary)] hover:text-[var(--mcs-primary)]">
        <Images size={22} className="mb-1" />
        <span className="text-[10px] font-bold">写真</span>
      </button>

      {/* 5. Camera */}
      <button className="flex flex-col items-center justify-center w-16 h-full text-[var(--mcs-text-secondary)] hover:text-[var(--mcs-primary)]">
        <Camera size={22} className="mb-1" />
        <span className="text-[10px] font-bold">カメラ</span>
      </button>

    </nav>
  )
}
