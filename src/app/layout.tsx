import type { Metadata } from 'next'
import './globals.css'

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

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
