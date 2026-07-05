import type { Metadata } from 'next'
import { Noto_Sans_JP, Inter } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '600', '700'] })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import MobileNavbar from '@/components/layout/MobileNavbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'YSDMS NextGen — Manufacturing Management',
  description: 'Enterprise Manufacturing & Warehouse Management System — Yoshida Package',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} ${notoSansJP.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />

              {/* Main Content Area */}
              <main className="flex-1 flex flex-col overflow-hidden relative">
                <Suspense fallback={<div className="h-[48px] shrink-0" style={{ background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border-default)' }}></div>}>
                  <Topbar />
                </Suspense>
                
                <div className="flex-1 overflow-auto p-4 pb-20 md:pb-4 custom-scrollbar" style={{ background: 'var(--bg-page)' }}>
                  {children}
                </div>
                
                <MobileNavbar />
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
