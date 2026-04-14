import type { Metadata } from 'next'
import { Noto_Sans_JP, Inter } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '600', '700'] })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'YSDMS Next-Gen Core',
  description: 'Enterprise Manufacturing & Warehouse Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSansJP.className} antialiased bg-[var(--mcs-bg)] text-[var(--mcs-text)]`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="h-[48px] bg-white border-b border-[#dde1e7] flex items-center px-4">
              <span className="font-bold">YSDMS Dashboard</span>
            </header>
            <div className="flex-1 overflow-auto p-4 mod-content">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
